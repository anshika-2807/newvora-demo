"use server";
/** Website-order fulfilment: accept (pack) → ship → deliver. Each step updates the
 *  order, writes a best-effort audit entry, and refreshes the admin + customer views. */
import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabase/server";
import { requirePerm } from "@/lib/auth";

const DEAD = ["cancelled", "void", "refunded"];

async function logAudit(action: string, id: string, detail: string) {
  try {
    await supabaseServer().from("audit_log").insert({ actor: "owner", action, ref: id, detail });
  } catch { /* best-effort */ }
}

function revalidateSurfaces(id: string) {
  revalidatePath("/admin/orders");
  revalidatePath("/admin/sales");
  revalidatePath("/admin/dashboard");
  revalidatePath(`/order/${id}`);
}

export async function acceptOrderAction(formData: FormData): Promise<void> {
  if (!(await requirePerm("billing.sell"))) return;
  const id = String(formData.get("order_id") ?? "");
  if (!id) return;
  const sb = supabaseServer();
  const { data: o } = await sb.from("orders").select("id,status").eq("id", id).maybeSingle();
  if (!o || DEAD.includes((o as any).status)) return;
  await sb.from("orders").update({ fulfillment: "accepted" }).eq("id", id);
  await logAudit("order_accepted", id, `Order ${id.slice(0, 8).toUpperCase()} accepted and being packed.`);
  revalidateSurfaces(id);
}

export async function shipOrderAction(formData: FormData): Promise<void> {
  if (!(await requirePerm("billing.sell"))) return;
  const id = String(formData.get("order_id") ?? "");
  if (!id) return;
  const sb = supabaseServer();
  const { data: o } = await sb.from("orders").select("id,status").eq("id", id).maybeSingle();
  if (!o || DEAD.includes((o as any).status)) return;
  await sb.from("orders").update({ status: "dispatched", dispatched_at: new Date().toISOString(), fulfillment: "accepted" }).eq("id", id);
  await logAudit("order_shipped", id, `Order ${id.slice(0, 8).toUpperCase()} dispatched.`);
  revalidateSurfaces(id);
}

export async function deliverOrderAction(formData: FormData): Promise<void> {
  if (!(await requirePerm("billing.sell"))) return;
  const id = String(formData.get("order_id") ?? "");
  if (!id) return;
  const sb = supabaseServer();
  const { data: o } = await sb.from("orders").select("id,status").eq("id", id).maybeSingle();
  if (!o || DEAD.includes((o as any).status)) return;
  await sb.from("orders").update({ status: "delivered", delivered_at: new Date().toISOString(), fulfillment: "accepted" }).eq("id", id);
  await logAudit("order_delivered", id, `Order ${id.slice(0, 8).toUpperCase()} delivered.`);
  revalidateSurfaces(id);
}
