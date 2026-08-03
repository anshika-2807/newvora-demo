export const dynamic = "force-dynamic";
import { supabaseServer } from "@/lib/supabase/server";
import { setQuoteStatusAction } from "@/app/actions/quotes";

export const metadata = { title: "Owner Console · Quote Requests" };

const PILL: Record<string, string> = {
  new: "bg-gold/15 text-gold-dark",
  quoted: "bg-emerald-mist text-emerald",
  closed: "bg-sand text-muted",
};

export default async function AdminQuotes() {
  const { data } = await supabaseServer().from("quote_requests").select("*").order("created_at", { ascending: false }).limit(200);
  const rows = (data as any[]) ?? [];
  const open = rows.filter((r) => r.status === "new").length;

  return (
    <main className="p-8 bg-cream/40 min-h-screen max-w-3xl">
      <h1 className="font-display text-4xl text-ink mb-1">Quote Requests</h1>
      <p className="text-sm text-muted mb-6">Bulk / business enquiries from the storefront{open ? ` · ${open} new` : ""}. Prepare a quote and mark progress.</p>

      {rows.length === 0 && (
        <div className="bg-surface rounded-2xl p-10 text-center text-muted shadow-card">
          No quote requests yet. They appear here when someone uses the “Request a bulk quote” form.
        </div>
      )}

      <div className="space-y-3">
        {rows.map((q) => {
          const wa = String(q.phone ?? "").replace(/\D/g, "");
          return (
            <div key={q.id} className={`bg-surface rounded-2xl p-5 shadow-card ${q.status === "new" ? "ring-2 ring-emerald/30" : ""}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-ink">{q.name}{q.company ? ` · ${q.company}` : ""}</p>
                  <p className="text-xs text-muted mt-0.5">{q.phone}{q.email ? ` · ${q.email}` : ""} · {new Date(q.created_at).toLocaleString("en-IN")}</p>
                  <p className="text-sm text-ink/80 mt-2">{q.message}</p>
                </div>
                <span className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-medium ${PILL[q.status] ?? "bg-sand text-muted"}`}>{q.status}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-sand">
                {wa && <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener" className="text-xs px-3 py-1.5 rounded-full bg-[#25D366] text-white font-medium">WhatsApp</a>}
                {q.status !== "quoted" && <form action={setQuoteStatusAction}><input type="hidden" name="id" value={q.id} /><input type="hidden" name="status" value="quoted" /><button className="text-xs px-3 py-1.5 rounded-full border border-sand text-muted hover:border-emerald hover:text-emerald transition">Mark quoted</button></form>}
                {q.status !== "closed" && <form action={setQuoteStatusAction}><input type="hidden" name="id" value={q.id} /><input type="hidden" name="status" value="closed" /><button className="text-xs px-3 py-1.5 rounded-full border border-sand text-muted hover:border-rose hover:text-rose transition">Close</button></form>}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
