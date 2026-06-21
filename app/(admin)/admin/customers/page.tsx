export const dynamic = "force-dynamic";
import { getCustomers, getRetailers } from "@/lib/supabase/queries";
import { formatPaise } from "@/lib/pricing";

export const metadata = { title: "Owner Console · Customers (CRM)" };

export default async function Customers() {
  const [customers, retailers] = await Promise.all([getCustomers(), getRetailers()]);
  return (
    <main className="p-8 bg-cream/40 min-h-screen max-w-4xl">
      <h1 className="font-display text-4xl text-ink mb-1">Customers</h1>
      <p className="text-sm text-muted mb-6">Your buyers, ranked by spend — built automatically from orders. Reach top customers first.</p>

      <div className="bg-white rounded-2xl p-6 shadow-card mb-6">
        <h2 className="font-medium text-ink mb-3">Top customers</h2>
        <table className="w-full text-sm">
          <thead className="text-muted text-left"><tr><th className="py-1">Name</th><th className="py-1">Phone</th><th className="py-1 text-right">Orders</th><th className="py-1 text-right">Spent</th></tr></thead>
          <tbody>
            {customers.length === 0 && <tr><td colSpan={4} className="py-3 text-muted">No named customers yet — POS &amp; online orders will populate this.</td></tr>}
            {customers.map((c) => (
              <tr key={c.name} className="border-t border-sand/50">
                <td className="py-2 text-ink font-medium">{c.name}</td>
                <td className="py-2 text-muted">{c.phone ?? "—"}</td>
                <td className="py-2 text-right">{c.orders}</td>
                <td className="py-2 text-right font-medium text-emerald">{formatPaise(c.spent)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-card">
        <h2 className="font-medium text-ink mb-3">Wholesale retailers</h2>
        <div className="grid sm:grid-cols-2 gap-2">
          {retailers.map((r: any) => (
            <div key={r.id} className="flex justify-between border-b border-sand/50 py-2 text-sm">
              <span className="text-ink">{r.name} <span className="text-muted text-xs">· {r.city}</span></span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${r.approved ? "bg-emerald-mist text-emerald-dark" : "bg-gold/15 text-gold-dark"}`}>{r.approved ? "approved" : "pending"}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
