export const dynamic = "force-dynamic";
import { supabaseServer } from "@/lib/supabase/server";
import { addOptionAction, deleteOptionAction } from "@/app/actions/options";

export const metadata = { title: "Owner Console · Variant Options" };

const SECTIONS: { kind: string; title: string; hint: string }[] = [
  { kind: "color", title: "Colours", hint: "Colour options for products (with an optional short code used on labels)." },
  { kind: "size", title: "Sizes", hint: "Size options (S, M, L, 6, 7, 8…)." },
  { kind: "polish", title: "Finishes", hint: "Finish / material options (Matte, Glossy, Oxidised…)." },
];

export default async function OptionsMaster() {
  const { data } = await supabaseServer().from("variant_options").select("id,kind,value,barcode_code").order("value");
  const all = (data as any[]) ?? [];
  const inp = "rounded-xl border border-sand bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-emerald";

  return (
    <main className="p-8 bg-cream/40 min-h-screen max-w-3xl">
      <h1 className="font-display text-4xl text-ink mb-1">Variant Options</h1>
      <p className="text-sm text-muted mb-6">Your master lists of colours, sizes and finishes. Add options here once, then pick them when creating product variants.</p>

      <div className="space-y-6">
        {SECTIONS.map((s) => {
          const items = all.filter((o) => o.kind === s.kind);
          return (
            <div key={s.kind} className="bg-surface rounded-2xl p-5 shadow-card">
              <h2 className="font-medium text-ink">{s.title}</h2>
              <p className="text-xs text-muted mt-0.5 mb-3">{s.hint}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {items.length === 0 && <span className="text-sm text-muted">None yet.</span>}
                {items.map((o) => (
                  <span key={o.id} className="inline-flex items-center gap-2 rounded-full border border-sand bg-cream/50 px-3 py-1.5 text-sm text-ink">
                    {o.value}
                    {o.barcode_code && <span className="text-[10px] font-mono text-muted">{o.barcode_code}</span>}
                    <form action={deleteOptionAction} className="inline">
                      <input type="hidden" name="id" value={o.id} />
                      <button className="text-muted hover:text-rose" title="Remove">×</button>
                    </form>
                  </span>
                ))}
              </div>

              <form action={addOptionAction} className="flex flex-wrap items-end gap-2">
                <input type="hidden" name="kind" value={s.kind} />
                <label className="text-[11px] text-muted">{s.title.slice(0, -1)}<input name="value" required placeholder={s.kind === "color" ? "e.g. Sky Blue" : s.kind === "size" ? "e.g. M" : "e.g. Matte"} className={`${inp} block mt-0.5 w-44`} /></label>
                {s.kind === "color" && (
                  <label className="text-[11px] text-muted">Label code<input name="barcode_code" placeholder="SBLUE" className={`${inp} block mt-0.5 w-32 uppercase`} /></label>
                )}
                <button className="btn-primary px-4 py-2 text-sm font-medium">Add</button>
              </form>
            </div>
          );
        })}
      </div>
    </main>
  );
}
