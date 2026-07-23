import "server-only";
/**
 * lib/vouchers.ts — voucher (discount code) validation + application. SERVER-ONLY,
 * single source of truth. The discount is always re-derived here at order time
 * (never trusted from the client). Applying it rewrites orders.total and posts an
 * offsetting day-book entry so GST, receivables, dashboards and the cash book all
 * see the discounted figure with no special-casing.
 */
import { supabaseServer } from "@/lib/supabase/server";

export type VoucherCheck = { ok: boolean; discountPaise: number; code?: string; message: string };

/** Validate a code against an items total (paise) for a channel. Pure read — no redemption. */
export async function validateVoucher(
  codeRaw: string,
  itemsPaise: number,
  channel: "retail" | "wholesale",
): Promise<VoucherCheck> {
  const code = (codeRaw ?? "").trim().toUpperCase();
  if (!code) return { ok: false, discountPaise: 0, message: "" };
  const sb = supabaseServer();
  const { data: v } = await sb.from("vouchers").select("*").ilike("code", code).maybeSingle();
  const vv = v as any;
  if (!vv || !vv.active) return { ok: false, discountPaise: 0, message: "This code isn't valid." };
  const now = Date.now();
  if (vv.starts_at && new Date(vv.starts_at).getTime() > now) return { ok: false, discountPaise: 0, message: "This code isn't live yet." };
  if (vv.ends_at && new Date(vv.ends_at).getTime() < now) return { ok: false, discountPaise: 0, message: "This code has expired." };
  if (vv.channel !== "all" && vv.channel !== channel) return { ok: false, discountPaise: 0, message: "This code doesn't apply here." };
  if (vv.usage_limit != null && vv.used_count >= vv.usage_limit) return { ok: false, discountPaise: 0, message: "This code has been fully used." };
  if (itemsPaise < (vv.min_order ?? 0)) return { ok: false, discountPaise: 0, message: `Add ₹${Math.ceil(((vv.min_order ?? 0) - itemsPaise) / 100)} more to use this code.` };

  let disc = vv.kind === "flat"
    ? Math.min(vv.value, itemsPaise)
    : Math.round((itemsPaise * Math.min(90, Math.max(0, vv.value))) / 100);
  if (vv.kind === "percent" && vv.cap != null) disc = Math.min(disc, vv.cap);
  disc = Math.max(0, Math.min(disc, itemsPaise));
  // Whole-rupee discounts only, so every total on the bill stays in whole rupees.
  disc = Math.min(itemsPaise, Math.round(disc / 100) * 100);
  if (disc <= 0) return { ok: false, discountPaise: 0, message: "This code gives no discount on this order." };
  return { ok: true, discountPaise: disc, code, message: `Code ${code} applied — you save ₹${Math.round(disc / 100)}.` };
}

/** Apply a validated voucher to a JUST-PLACED order: rewrite total, record the code,
 *  post the day-book offset, redeem atomically. Returns the discount applied (paise). */
export async function applyVoucherToOrder(
  orderId: string,
  codeRaw: string,
  channel: "retail" | "wholesale",
): Promise<number> {
  const sb = supabaseServer();
  const { data: o } = await sb.from("orders").select("id,total").eq("id", orderId).maybeSingle();
  if (!o) return 0;
  const check = await validateVoucher(codeRaw, (o as any).total ?? 0, channel);
  if (!check.ok || check.discountPaise <= 0) return 0;
  const { data: redeemed } = await sb.rpc("redeem_voucher", { p_code: check.code });
  if (!redeemed) return 0; // raced past the usage limit — order simply keeps full price
  await sb.from("orders").update({
    total: ((o as any).total ?? 0) - check.discountPaise,
    voucher_code: check.code,
    voucher_discount: check.discountPaise,
  }).eq("id", orderId);
  await sb.from("ledger").insert({ kind: "sales", ref_id: orderId, debit: check.discountPaise, note: `Voucher ${check.code}` });
  return check.discountPaise;
}
