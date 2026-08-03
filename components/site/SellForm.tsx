"use client";
import { useState } from "react";
import { submitProductAction } from "@/app/actions/submissions";

type Cat = { id: string; name: string; slug: string };

export function SellForm({ categories = [] }: { categories?: Cat[] }) {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");
  const inp = "w-full rounded-xl border border-sand bg-surface px-4 py-2.5 text-sm text-ink outline-none focus:border-emerald";

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true); setErr("");
    const res = await submitProductAction(new FormData(e.currentTarget));
    setBusy(false);
    if (res.ok) setDone(true); else setErr(res.error ?? "Something went wrong — please try again.");
  }

  if (done) return (
    <div className="text-center py-8">
      <p className="text-5xl">✅</p>
      <h2 className="font-display text-2xl text-ink mt-2">Submission received</h2>
      <p className="text-sm text-muted mt-1">Thanks! Our team will review your product and get back to you soon.</p>
    </div>
  );

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="text-xs text-muted">Product name *</label>
        <input name="productName" required placeholder="What are you offering?" className={`${inp} mt-1`} />
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-muted">Category</label>
          {categories.length ? (
            <select name="categoryId" className={`${inp} mt-1`}>
              <option value="">Choose…</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          ) : (
            <input name="categoryOther" placeholder="Category" className={`${inp} mt-1`} />
          )}
        </div>
        <div>
          <label className="text-xs text-muted">Asking price (₹) *</label>
          <input name="askingPrice" type="number" min="1" required placeholder="e.g. 500" className={`${inp} mt-1`} />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-muted">Quantity</label>
          <input name="qty" type="number" min="0" placeholder="e.g. 10" className={`${inp} mt-1`} />
        </div>
        <div>
          <label className="text-xs text-muted">Colour / variant</label>
          <input name="color" placeholder="Optional" className={`${inp} mt-1`} />
        </div>
      </div>
      <div>
        <label className="text-xs text-muted">Description</label>
        <textarea name="description" rows={3} placeholder="Condition, details, anything useful…" className={`${inp} mt-1`} />
      </div>
      <div className="border-t border-sand pt-3 grid sm:grid-cols-3 gap-3">
        <div>
          <label className="text-xs text-muted">Your name *</label>
          <input name="name" required placeholder="Full name" className={`${inp} mt-1`} />
        </div>
        <div>
          <label className="text-xs text-muted">Phone *</label>
          <input name="phone" required inputMode="tel" placeholder="WhatsApp number" className={`${inp} mt-1`} />
        </div>
        <div>
          <label className="text-xs text-muted">Email</label>
          <input name="email" type="email" placeholder="Optional" className={`${inp} mt-1`} />
        </div>
      </div>
      {err && <p className="text-sm text-rose">{err}</p>}
      <button disabled={busy} className="btn-primary w-full py-3 text-sm font-medium disabled:opacity-60">
        {busy ? "Submitting…" : "Submit for review"}
      </button>
    </form>
  );
}
