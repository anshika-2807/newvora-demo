import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { getSession } from "@/lib/auth";

const rupees = (paise: number) => (Number(paise || 0) / 100).toFixed(2);
const esc = (v: any) => {
  const s = v == null ? "" : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const csv = (headers: string[], rows: any[][]) =>
  [headers, ...rows].map((r) => r.map(esc).join(",")).join("\n");

function download(name: string, body: string) {
  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${name}"`,
    },
  });
}

export async function GET(req: NextRequest, { params }: { params: { type: string } }) {
  // Admin-only.
  if (!getSession().authed) return new NextResponse("Unauthorized", { status: 401 });

  const sb = supabaseServer();
  const sp = req.nextUrl.searchParams;
  const from = sp.get("from");
  const to = sp.get("to");
  const fromISO = from ? new Date(from + "T00:00:00").toISOString() : null;
  const toISO = to ? new Date(to + "T23:59:59").toISOString() : null;
  const stamp = new Date().toISOString().slice(0, 10);

  if (params.type === "sales") {
    let q = sb.from("orders").select("invoice_no,created_at,channel,payment_mode,status,total,amount_paid,customer_name").order("created_at", { ascending: false }).limit(5000);
    if (fromISO) q = q.gte("created_at", fromISO);
    if (toISO) q = q.lte("created_at", toISO);
    const { data } = await q;
    const rows = ((data as any[]) ?? []).map((o) => [
      o.invoice_no || "", new Date(o.created_at).toLocaleString("en-IN"), o.channel, o.payment_mode || "",
      o.status || "", rupees(o.total), rupees(o.amount_paid), o.customer_name || "",
    ]);
    return download(`sales-${stamp}.csv`, csv(["Invoice", "Date", "Channel", "Payment", "Status", "Total (₹)", "Paid (₹)", "Customer"], rows));
  }

  if (params.type === "daybook") {
    let q = sb.from("ledger").select("created_at,kind,note,debit,credit").order("created_at", { ascending: false }).limit(10000);
    if (fromISO) q = q.gte("created_at", fromISO);
    if (toISO) q = q.lte("created_at", toISO);
    const { data } = await q;
    const rows = ((data as any[]) ?? []).map((r) => [
      new Date(r.created_at).toLocaleString("en-IN"), r.kind, r.note || "", rupees(r.credit), rupees(r.debit),
    ]);
    return download(`daybook-${stamp}.csv`, csv(["Date", "Type", "Note", "Money in (₹)", "Money out (₹)"], rows));
  }

  if (params.type === "stock") {
    const { data } = await sb.from("products").select("sku,name,qty,base_wholesale,status,category:categories(name)").order("name").limit(10000);
    const rows = ((data as any[]) ?? []).map((p) => [
      p.sku, p.name, p.category?.name || "", p.status, p.qty, rupees(p.base_wholesale), rupees((p.qty || 0) * (p.base_wholesale || 0)),
    ]);
    return download(`stock-${stamp}.csv`, csv(["SKU", "Product", "Category", "Status", "Qty", "Cost each (₹)", "Stock value (₹)"], rows));
  }

  if (params.type === "receivables") {
    const { data } = await sb.from("orders").select("customer_name,customer_phone,total,amount_paid,created_at,status").not("status", "in", "(cancelled,void,refunded)").limit(10000);
    const map = new Map<string, { name: string; phone: string; due: number; bills: number }>();
    for (const o of (data as any[]) ?? []) {
      const due = Math.max(0, (o.total ?? 0) - (o.amount_paid ?? 0));
      if (due <= 0) continue;
      const key = (o.customer_phone || o.customer_name || "walk-in").toLowerCase();
      const p = map.get(key) ?? { name: o.customer_name || "Walk-in", phone: o.customer_phone || "", due: 0, bills: 0 };
      p.due += due; p.bills += 1; map.set(key, p);
    }
    const rows = [...map.values()].sort((a, b) => b.due - a.due).map((p) => [p.name, p.phone, p.bills, rupees(p.due)]);
    return download(`receivables-${stamp}.csv`, csv(["Customer", "Phone", "Bills", "Outstanding (₹)"], rows));
  }

  return new NextResponse("Unknown report", { status: 404 });
}
