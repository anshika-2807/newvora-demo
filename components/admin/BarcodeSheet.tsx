"use client";
import { useState, useMemo } from "react";
import { formatPaise } from "@/lib/pricing";
import { Barcode } from "@/components/admin/Barcode";

type P = { sku: string; name: string; price: number };

export function BarcodeSheet({ products }: { products: P[] }) {
  const [q, setQ] = useState("");
  const [items, setItems] = useState<{ sku: string; name: string; price: number; count: number }[]>([]);
  const matches = useMemo(() => q.trim() ? products.filter((p) => (p.name + p.sku).toLowerCase().includes(q.toLowerCase())).slice(0, 6) : [], [q, products]);

  const add = (p: P) => { setItems((prev) => prev.find((x) => x.sku === p.sku) ? prev : [...prev, { ...p, count: 1 }]); setQ(""); };
  const setCount = (sku: string, n: number) => setItems((prev) => prev.map((x) => x.sku === sku ? { ...x, count: Math.max(1, Math.floor(n || 1)) } : x));
  const rm = (sku: string) => setItems((prev) => prev.filter((x) => x.sku !== sku));
  const labels = items.flatMap((it) => Array.from({ length: it.count }, () => it));
  const input = "w-full rounded-xl border border-sand px-4 py-2.5 text-sm bg-white outline-none focus:border-emerald";

  return (
    <div>
      <div className="bg-white rounded-2xl p-5 shadow-card mb-5 no-print">
        <h2 className="font-medium text-ink mb-3">Add SKUs to print</h2>
        <div className="relative mb-3">
          <input className={input} placeholder="Search product by name or SKU…" value={q} onChange={(e) => setQ(e.target.value)} />
          {matches.length > 0 && (
            <div className="absolute z-10 left-0 right-0 mt-1 bg-white rounded-xl shadow-luxe border border-sand overflow-hidden">
              {matches.map((p) => (
                <button key={p.sku} onClick={() => add(p)} className="w-full text-left px-4 py-2.5 text-sm hover:bg-emerald-mist flex justify-between">
                  <span>{p.name} <span className="text-muted">· {p.sku}</span></span><span>{formatPaise(p.price)}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        {items.length === 0 && <p className="text-sm text-muted">No SKUs selected yet.</p>}
        {items.map((it) => (
          <div key={it.sku} className="flex items-center gap-3 border-b border-sand/60 py-2 text-sm">
            <span className="flex-1">{it.name} <span className="text-muted">· {it.sku}</span></span>
            <label className="text-xs text-muted flex items-center gap-1"># labels
              <input type="number" min={1} value={it.count} onChange={(e) => setCount(it.sku, Number(e.target.value))} className="w-16 rounded-lg border border-sand px-2 py-1 text-center" />
            </label>
            <button onClick={() => rm(it.sku)} className="text-muted hover:text-rose">✕</button>
          </div>
        ))}
        {labels.length > 0 && (
          <button onClick={() => window.print()} className="btn-primary px-6 py-2.5 text-sm font-medium mt-4">🖶 Print {labels.length} label{labels.length === 1 ? "" : "s"}</button>
        )}
      </div>

      {/* Printable label grid */}
      {labels.length > 0 && (
        <div className="print-area">
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {labels.map((it, i) => (
              <div key={i} className="border border-sand rounded-lg p-2 text-center bg-white break-inside-avoid">
                <p className="text-[10px] font-semibold text-ink truncate">{it.name}</p>
                <Barcode value={it.sku} height={38} />
                <p className="text-[10px] tracking-widest text-ink mt-0.5">{it.sku}</p>
                <p className="text-[11px] font-medium text-ink">{formatPaise(it.price)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
