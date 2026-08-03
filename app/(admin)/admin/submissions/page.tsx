export const dynamic = "force-dynamic";
import { supabaseServer } from "@/lib/supabase/server";
import { formatPaise } from "@/lib/pricing";
import { decideSubmissionAction } from "@/app/actions/submissions";

export const metadata = { title: "Owner Console · Submissions" };

const PILL: Record<string, string> = {
  pending: "bg-gold/15 text-gold-dark",
  approved: "bg-emerald-mist text-emerald",
  rejected: "bg-sand text-muted",
};

export default async function AdminSubmissions() {
  const sb = supabaseServer();
  const { data } = await sb.from("product_submissions")
    .select("*, category:categories(name)")
    .order("created_at", { ascending: false })
    .limit(200);
  const subs = (data as any[]) ?? [];
  const pending = subs.filter((s) => s.status === "pending").length;

  return (
    <main className="p-8 bg-cream/40 min-h-screen max-w-3xl">
      <h1 className="font-display text-4xl text-ink mb-1">Product Submissions</h1>
      <p className="text-sm text-muted mb-6">Products customers have offered to sell or list with you{pending ? ` · ${pending} pending` : ""}. Approve the good ones, then add them from Add Inventory.</p>

      {subs.length === 0 && (
        <div className="bg-surface rounded-2xl p-10 text-center text-muted shadow-card">
          No submissions yet. They appear here when a customer uses the “Sell with us” form.
        </div>
      )}

      <div className="space-y-4">
        {subs.map((s) => (
          <div key={s.id} className="bg-surface rounded-2xl p-5 shadow-card">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-ink">{s.product_name}</p>
                <p className="text-xs text-muted mt-0.5">
                  {(s.category?.name || s.category_other || "Uncategorised")}
                  {s.color ? ` · ${s.color}` : ""}
                  {s.qty ? ` · qty ${s.qty}` : ""}
                </p>
                {s.description && <p className="text-sm text-ink/80 mt-2">{s.description}</p>}
                <p className="text-xs text-muted mt-2">
                  {s.submitter_name}{s.submitter_phone ? ` · ${s.submitter_phone}` : ""}{s.submitter_email ? ` · ${s.submitter_email}` : ""} · {new Date(s.created_at).toLocaleString("en-IN")}
                </p>
                {s.review_note && <p className="text-xs text-muted mt-1 italic">Note: {s.review_note}</p>}
              </div>
              <div className="text-right shrink-0">
                {s.asking_price ? <p className="font-semibold text-ink">{formatPaise(s.asking_price)}</p> : null}
                <span className={`inline-block mt-1 px-2.5 py-1 rounded-full text-xs font-medium ${PILL[s.status] ?? "bg-sand text-muted"}`}>{s.status}</span>
              </div>
            </div>

            {s.status === "pending" && (
              <form action={decideSubmissionAction} className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-sand">
                <input type="hidden" name="id" value={s.id} />
                <input name="note" placeholder="Optional note to file with this decision" className="flex-1 min-w-[200px] rounded-xl border border-sand bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-emerald" />
                <button name="decision" value="approved" className="btn-primary px-4 py-2 text-sm font-medium">Approve</button>
                <button name="decision" value="rejected" className="px-4 py-2 text-sm rounded-full border border-sand text-muted hover:border-rose hover:text-rose transition">Reject</button>
              </form>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
