export const dynamic = "force-dynamic";
import { supabaseServer } from "@/lib/supabase/server";

export const metadata = { title: "Owner Console · Stock Movements" };

export default async function StockMovements() {
  const sb = supabaseServer();
  const { data } = await sb.from("stock_adjustments")
    .select("id,sku,delta,source,reason,created_at,product:products(name)")
    .order("created_at", { ascending: false })
    .limit(300);
  const rows = (data as any[]) ?? [];
  const added = rows.filter((r) => r.delta > 0).reduce((s, r) => s + r.delta, 0);
  const removed = rows.filter((r) => r.delta < 0).reduce((s, r) => s + Math.abs(r.delta), 0);

  return (
    <main className="p-8 bg-cream/40 min-h-screen max-w-3xl">
      <h1 className="font-display text-4xl text-ink mb-1">Stock Movements</h1>
      <p className="text-sm text-muted mb-6">Every change to stock — sales, purchases, returns and manual adjustments — in one running ledger, so quantities are always explainable.</p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-surface rounded-2xl p-5 shadow-card">
          <p className="text-[11px] uppercase tracking-wide text-muted">Units added</p>
          <p className="text-2xl font-semibold text-emerald mt-1">+{added}</p>
        </div>
        <div className="bg-surface rounded-2xl p-5 shadow-card">
          <p className="text-[11px] uppercase tracking-wide text-muted">Units removed</p>
          <p className="text-2xl font-semibold text-rose mt-1">−{removed}</p>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="bg-surface rounded-2xl p-10 text-center text-muted shadow-card">
          No movements yet. Sell an item, record a purchase, or adjust stock and it appears here.
        </div>
      ) : (
        <div className="bg-surface rounded-2xl shadow-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-cream/60 text-muted text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-4 py-3">When</th>
                <th className="text-left px-4 py-3">Product</th>
                <th className="text-left px-4 py-3">Source</th>
                <th className="text-right px-4 py-3">Change</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-sand/70">
                  <td className="px-4 py-3 text-muted whitespace-nowrap">{new Date(r.created_at).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</td>
                  <td className="px-4 py-3">
                    <p className="text-ink">{r.product?.name || r.sku || "—"}</p>
                    {r.reason && <p className="text-xs text-muted">{r.reason}</p>}
                  </td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-cream text-muted">{r.source || "adjust"}</span></td>
                  <td className={`px-4 py-3 text-right font-semibold ${r.delta >= 0 ? "text-emerald" : "text-rose"}`}>{r.delta >= 0 ? `+${r.delta}` : r.delta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
