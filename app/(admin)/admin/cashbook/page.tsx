export const dynamic = "force-dynamic";
import { supabaseServer } from "@/lib/supabase/server";
import { formatPaise } from "@/lib/pricing";

export const metadata = { title: "Owner Console · Cashbook" };

const KIND: Record<string, string> = {
  sales: "bg-emerald-mist text-emerald",
  purchase: "bg-gold/15 text-gold-dark",
  cash: "bg-cream text-muted",
  bank: "bg-rose-light/40 text-rose",
};

export default async function Cashbook() {
  const sb = supabaseServer();
  const { data } = await sb.from("ledger")
    .select("id,kind,ref_id,debit,credit,note,created_at")
    .order("created_at", { ascending: false })
    .limit(300);
  const rows = (data as any[]) ?? [];

  const moneyIn = rows.reduce((s, r) => s + (r.credit ?? 0), 0);
  const moneyOut = rows.reduce((s, r) => s + (r.debit ?? 0), 0);
  const net = moneyIn - moneyOut;

  const groups = new Map<string, any[]>();
  for (const r of rows) {
    const day = new Date(r.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    (groups.get(day) ?? groups.set(day, []).get(day)!)!.push(r);
  }

  return (
    <main className="p-8 bg-cream/40 min-h-screen max-w-4xl">
      <h1 className="font-display text-4xl text-ink mb-1">Cashbook</h1>
      <p className="text-sm text-muted mb-6">Your day-book — every sale, purchase and payment posts here automatically, so your books stay current without manual entry.</p>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-surface rounded-2xl p-5 shadow-card">
          <p className="text-[11px] uppercase tracking-wide text-muted">Money in</p>
          <p className="text-2xl font-semibold text-emerald mt-1">{formatPaise(moneyIn)}</p>
        </div>
        <div className="bg-surface rounded-2xl p-5 shadow-card">
          <p className="text-[11px] uppercase tracking-wide text-muted">Money out</p>
          <p className="text-2xl font-semibold text-rose mt-1">{formatPaise(moneyOut)}</p>
        </div>
        <div className="bg-surface rounded-2xl p-5 shadow-card">
          <p className="text-[11px] uppercase tracking-wide text-muted">Net</p>
          <p className={`text-2xl font-semibold mt-1 ${net >= 0 ? "text-ink" : "text-rose"}`}>{formatPaise(net)}</p>
        </div>
      </div>

      {rows.length === 0 && (
        <div className="bg-surface rounded-2xl p-10 text-center text-muted shadow-card">
          No entries yet. Ring up a sale in Billing or place a website order and the cashbook fills automatically.
        </div>
      )}

      <div className="space-y-6">
        {[...groups.entries()].map(([day, entries]) => (
          <div key={day}>
            <p className="text-xs font-medium text-muted mb-2">{day}</p>
            <div className="bg-surface rounded-2xl shadow-card overflow-hidden">
              <table className="w-full text-sm">
                <tbody>
                  {entries.map((r) => (
                    <tr key={r.id} className="border-t border-sand/60 first:border-t-0">
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${KIND[r.kind] ?? "bg-sand text-muted"}`}>{r.kind}</span>
                      </td>
                      <td className="px-4 py-3 text-ink/80">{r.note || "—"}</td>
                      <td className="px-4 py-3 text-right text-emerald whitespace-nowrap">{r.credit ? `+ ${formatPaise(r.credit)}` : ""}</td>
                      <td className="px-4 py-3 text-right text-rose whitespace-nowrap">{r.debit ? `− ${formatPaise(r.debit)}` : ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
