export const dynamic = "force-dynamic";
import { supabaseServer } from "@/lib/supabase/server";
import { markFeedbackSeenAction } from "@/app/actions/feedback";

export const metadata = { title: "Owner Console · Feedback" };

export default async function AdminFeedback() {
  const { data } = await supabaseServer().from("feedback").select("*").order("created_at", { ascending: false }).limit(200);
  const items = (data as any[]) ?? [];
  const unseen = items.filter((f) => !f.seen).length;

  return (
    <main className="p-8 bg-cream/40 min-h-screen max-w-3xl">
      <h1 className="font-display text-4xl text-ink mb-1">Customer Feedback</h1>
      <p className="text-sm text-muted mb-6">Ratings and messages customers send from the storefront{unseen ? ` · ${unseen} new` : ""}.</p>

      {items.length === 0 && (
        <div className="bg-surface rounded-2xl p-10 text-center text-muted shadow-card">
          No feedback yet. It appears here the moment a customer submits the feedback form.
        </div>
      )}

      <div className="space-y-3">
        {items.map((f) => (
          <div key={f.id} className={`bg-surface rounded-2xl p-5 shadow-card ${!f.seen ? "ring-2 ring-emerald/30" : ""}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                {f.rating ? <p className="text-gold text-lg leading-none">{"★".repeat(f.rating)}<span className="text-sand">{"★".repeat(5 - f.rating)}</span></p> : null}
                {f.message && <p className="text-ink mt-2 leading-relaxed">{f.message}</p>}
                <p className="text-xs text-muted mt-2">
                  {f.name || "Anonymous"}{f.phone ? ` · ${f.phone}` : ""}{f.order_ref ? ` · Order ${f.order_ref}` : ""} · {new Date(f.created_at).toLocaleString("en-IN")}
                </p>
              </div>
              {!f.seen && (
                <form action={markFeedbackSeenAction}>
                  <input type="hidden" name="id" value={f.id} />
                  <button className="text-xs px-3 py-1.5 rounded-full border border-sand text-muted hover:border-emerald hover:text-emerald transition whitespace-nowrap">Mark seen</button>
                </form>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
