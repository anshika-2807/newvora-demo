export const dynamic = "force-dynamic";

export const metadata = { title: "Owner Console · Reports" };

const REPORTS = [
  { type: "sales", title: "Sales report", desc: "Every bill with totals, payment and status — for GST filing or your accountant.", ranged: true },
  { type: "daybook", title: "Cashbook / day-book", desc: "All money in and out (sales, purchases, payments) line by line.", ranged: true },
  { type: "stock", title: "Stock summary", desc: "Current quantity and stock value for every product.", ranged: false },
  { type: "receivables", title: "Receivables", desc: "Outstanding balances owed to you, by customer.", ranged: false },
];

export default function Reports({ searchParams }: { searchParams: { from?: string; to?: string } }) {
  const from = searchParams.from ?? "";
  const to = searchParams.to ?? "";
  const qs = from || to ? `?${new URLSearchParams({ ...(from ? { from } : {}), ...(to ? { to } : {}) }).toString()}` : "";
  const inp = "rounded-xl border border-sand bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-emerald";

  return (
    <main className="p-8 bg-cream/40 min-h-screen max-w-3xl">
      <h1 className="font-display text-4xl text-ink mb-1">Reports</h1>
      <p className="text-sm text-muted mb-6">Download your books as spreadsheets (CSV) — open in Excel or Google Sheets, or hand to your accountant.</p>

      <form action="/admin/reports" className="bg-surface rounded-2xl p-5 shadow-card mb-6 flex flex-wrap items-end gap-3">
        <label className="text-[11px] text-muted">From<input type="date" name="from" defaultValue={from} className={`${inp} block mt-0.5`} /></label>
        <label className="text-[11px] text-muted">To<input type="date" name="to" defaultValue={to} className={`${inp} block mt-0.5`} /></label>
        <button className="btn-primary px-5 py-2 text-sm font-medium">Apply date range</button>
        <span className="text-xs text-muted">Applies to Sales &amp; Day-book (others are current).</span>
      </form>

      <div className="grid sm:grid-cols-2 gap-4">
        {REPORTS.map((r) => (
          <div key={r.type} className="bg-surface rounded-2xl p-5 shadow-card flex flex-col">
            <h2 className="font-medium text-ink">{r.title}</h2>
            <p className="text-xs text-muted mt-1 mb-4 flex-1">{r.desc}</p>
            <a href={`/api/reports/${r.type}${r.ranged ? qs : ""}`} className="btn-primary px-4 py-2 text-sm font-medium text-center">Download CSV</a>
          </div>
        ))}
      </div>
    </main>
  );
}
