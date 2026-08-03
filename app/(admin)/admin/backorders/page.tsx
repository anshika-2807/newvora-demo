export const dynamic = "force-dynamic";
import { supabaseServer } from "@/lib/supabase/server";
import { formatPaise } from "@/lib/pricing";

export const metadata = { title: "Owner Console · Backorders" };

export default async function Backorders() {
  const sb = supabaseServer();
  const { data } = await sb.from("orders")
    .select("id,total,status,payment_mode,customer_name,customer_phone,created_at,invoice_no,channel")
    .eq("is_backorder", true)
    .not("status", "in", "(cancelled,void,refunded)")
    .order("created_at", { ascending: false })
    .limit(200);
  const rows = (data as any[]) ?? [];

  return (
    <main className="p-8 bg-cream/40 min-h-screen max-w-3xl">
      <h1 className="font-display text-4xl text-ink mb-1">Backorders</h1>
      <p className="text-sm text-muted mb-6">Orders billed beyond available stock — items you owe customers and need to restock and fulfil.</p>

      {rows.length === 0 ? (
        <div className="bg-surface rounded-2xl p-10 text-center text-muted shadow-card">
          No backorders — every order was fulfilled from stock. (Orders billed with the oversell/backorder option appear here.)
        </div>
      ) : (
        <div className="bg-surface rounded-2xl shadow-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-cream/60 text-muted text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-4 py-3">Order</th>
                <th className="text-left px-4 py-3">Customer</th>
                <th className="text-left px-4 py-3">Placed</th>
                <th className="text-right px-4 py-3">Amount</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((o) => (
                <tr key={o.id} className="border-t border-sand/70">
                  <td className="px-4 py-3 font-mono text-ink">{o.invoice_no || String(o.id).slice(0, 8).toUpperCase()}</td>
                  <td className="px-4 py-3">
                    <p className="text-ink">{o.customer_name || "Walk-in"}</p>
                    {o.customer_phone && <p className="text-xs text-muted">{o.customer_phone}</p>}
                  </td>
                  <td className="px-4 py-3 text-muted whitespace-nowrap">{new Date(o.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</td>
                  <td className="px-4 py-3 text-right font-semibold text-ink">{formatPaise(o.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
