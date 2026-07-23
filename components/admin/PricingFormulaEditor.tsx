"use client";
import { useState } from "react";
import { computePrices, formatPaise, type PricingFormula } from "@/lib/pricing";

export default function PricingFormulaEditor({
  initial,
  action,
}: {
  initial: PricingFormula;
  action: (formData: FormData) => Promise<void>;
}) {
  const [f, setF] = useState<PricingFormula>(initial);
  const [sample, setSample] = useState(500); // ₹ base cost for the live preview
  const [saved, setSaved] = useState(false);

  const preview = computePrices(Math.round(sample * 100), f);
  const set = (k: keyof PricingFormula, v: number) => { setF({ ...f, [k]: v }); setSaved(false); };
  const inp = "w-full h-11 rounded-xl border border-sand px-3 text-[15px] bg-white outline-none focus:border-emerald";

  return (
    <form
      action={async (fd) => { await action(fd); setSaved(true); }}
      className="rounded-2xl border border-sand bg-white p-6 shadow-card"
    >
      <h2 className="font-medium text-ink">Pricing formula</h2>
      <p className="text-sm text-muted mt-1 mb-5">
        The <b>base wholesale price</b> you set on each product is the only input — this formula derives the
        wholesale rate, retail selling price and printed MRP from it. Change it once and the whole catalogue re-prices.
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        <label className="text-sm text-muted">Wholesale markup (%)
          <input name="wholesale_markup_pct" type="number" step="0.5" min="0" value={f.wholesaleMarkupPct}
            onChange={(e) => set("wholesaleMarkupPct", Number(e.target.value))} className={`${inp} mt-1`} />
          <span className="text-xs text-muted/70">base → wholesale rate for retailers</span>
        </label>
        <label className="text-sm text-muted">Retail multiplier (×)
          <input name="retail_multiplier" type="number" step="0.05" min="1" value={f.retailMultiplier}
            onChange={(e) => set("retailMultiplier", Number(e.target.value))} className={`${inp} mt-1`} />
          <span className="text-xs text-muted/70">base → retail selling price</span>
        </label>
        <label className="text-sm text-muted">MRP multiplier (×)
          <input name="mrp_multiplier" type="number" step="0.05" min="1" value={f.mrpMultiplier}
            onChange={(e) => set("mrpMultiplier", Number(e.target.value))} className={`${inp} mt-1`} />
          <span className="text-xs text-muted/70">base → printed MRP (≥ retail)</span>
        </label>
        <label className="text-sm text-muted">Round to (paise)
          <input name="round_to" type="number" step="1" min="1" value={f.roundToPaise}
            onChange={(e) => set("roundToPaise", Number(e.target.value))} className={`${inp} mt-1`} />
          <span className="text-xs text-muted/70">100 = nearest ₹1</span>
        </label>
      </div>

      {/* Live preview */}
      <div className="mt-6 rounded-xl bg-cream/60 border border-sand p-4">
        <div className="flex items-center gap-2 text-sm text-muted mb-3">
          <span>Live preview for a base cost of ₹</span>
          <input type="number" min="1" value={sample} onChange={(e) => setSample(Number(e.target.value) || 0)}
            className="w-24 h-9 rounded-lg border border-sand px-2 text-sm bg-white outline-none focus:border-emerald" />
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          {[["Wholesale", preview.wholesaleRate], ["Retail", preview.retailPrice], ["MRP", preview.mrp]].map(([label, val]) => (
            <div key={label as string} className="rounded-lg bg-white border border-sand py-3">
              <p className="text-[11px] uppercase tracking-wide text-muted">{label as string}</p>
              <p className="text-lg font-semibold text-ink mt-0.5">{formatPaise(val as number)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 mt-6">
        <button className="btn-primary px-6 py-2.5 text-sm font-medium">Save formula</button>
        {saved && <span className="text-sm text-emerald">✓ Saved — catalogue re-priced</span>}
      </div>
    </form>
  );
}
