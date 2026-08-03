export const dynamic = "force-dynamic";
import { supabaseServer } from "@/lib/supabase/server";
import { formatPaise } from "@/lib/pricing";

export const metadata = { title: "Owner Console · Receivables" };

export default async function Creditors() {
  const sb = supabaseServer();
  const { data } = await sb.from("orders")
    .select("customer_name,customer_phone,total,amount_paid,created_at,invoice_no,status")
    .not("status", "in", "(cancelled,void,refunded)")
    .order("created_at", { ascending: true })
    .limit(1000);
  const rows = (data as any[]) ?? [];

  type Party = { name: string; phone: string; outstanding: number; bills: number; oldest: string };
  const map = new Map<string, Party>();
  for (const o of rows) {
    const due = Math.max(0, (o.total ?? 0) - (o.amount_paid ?? 0));
    if (due <= 0) continue;
    const key = (o.customer_phone || o.customer_name || "walk-in").toLowerCase();
    const p = map.get(key) ?? { name: o.customer_name || "Walk-in customer", phone: o.customer_phone || "", outstanding: 0, bills: 0, oldest: o.created_at };
    p.outstanding += due; p.bills += 1;
    if (new Date(o.created_at) < new Date(p.oldest)) p.oldest = o.created_at;
    if (!p.name && o.customer_name) p.name = o.customer_name;
    map.set(key, p);
  }
  const parties = [...map.values()].sort((a, b) => b.outstanding - a.outstanding);
  const totalDue = parties.reduce((s, p) => s + p.outstanding, 0);
  const days = (d: string) => Math.floor((Date.now() - new Date(d).getTime()) / 86400000);

  return (
    <main className="p-8 bg-cream/40 min-h-screen max-w-3xl">
      <h1 className="font-display text-4xl text-ink mb-1">Receivables</h1>
      <p className="text-sm text-muted mb-6">Money owed to you across unpaid and part-paid bills, by customer — so nothing slips through.</p>

      <div className="bg-surface rounded-2xl p-5 shadow-card mb-6 flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-muted">Total outstanding</p>
          <p className="text-3xl font-semibold text-ink mt-1">{formatPaise(totalDue)}</p>
        </div>
        <p className="text-sm text-muted">{parties.length} {parties.length === 1 ? "party" : "parties"}</p>
      </div>

      {parties.length === 0 ? (
        <div className="bg-surface rounded-2xl p-10 text-center text-muted shadow-card">
          Nothing outstanding — every bill is fully paid. (Part-paid POS sales show up here.)
        </div>
      ) : (
        <div className="bg-surface rounded-2xl shadow-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-cream/60 text-muted text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-4 py-3">Customer</th>
                <th className="text-right px-4 py-3">Bills</th>
                <th className="text-left px-4 py-3">Oldest due</th>
                <th className="text-right px-4 py-3">Outstanding</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {parties.map((p) => {
                const wa = p.phone.replace(/\D/g, "");
                return (
                  <tr key={p.name + p.phone} className="border-t border-sand/70">
                    <td className="px-4 py-3">
                      <p className="font-medium text-ink">{p.name}</p>
                      {p.phone && <p className="text-xs text-muted">{p.phone}</p>}
                    </td>
                    <td className="px-4 py-3 text-right text-muted">{p.bills}</td>
                    <td className="px-4 py-3 text-muted">{days(p.oldest)} days</td>
                    <td className="px-4 py-3 text-right font-semibold text-rose">{formatPaise(p.outstanding)}</td>
                    <td className="px-4 py-3 text-right">
                      {wa && (
                        <a href={`https://wa.me/${wa}?text=${encodeURIComponent(`Hi ${p.name}, a gentle reminder — ${formatPaise(p.outstanding)} is pending on your account. Thank you!`)}`}
                          target="_blank" rel="noopener" className="text-xs px-3 py-1.5 rounded-full border border-sand text-muted hover:border-emerald hover:text-emerald transition whitespace-nowrap">Remind</a>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
