"use client";
import { useState } from "react";
import { submitQuoteAction } from "@/app/actions/quotes";

export function QuoteRequestForm() {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");
  const inp = "w-full rounded-xl border border-sand bg-surface px-4 py-2.5 text-sm text-ink outline-none focus:border-emerald";

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setErr("");
    const res = await submitQuoteAction(new FormData(e.currentTarget));
    setBusy(false);
    if (res.ok) setDone(true); else setErr(res.error ?? "Something went wrong.");
  }

  if (done) return (
    <div className="text-center py-8">
      <p className="text-5xl">📩</p>
      <h2 className="font-display text-2xl text-ink mt-2">Request received</h2>
      <p className="text-sm text-muted mt-1">Thanks! Our team will prepare a quote and reach out shortly.</p>
    </div>
  );

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <div><label className="text-xs text-muted">Your name *</label><input name="name" required className={`${inp} mt-1`} /></div>
        <div><label className="text-xs text-muted">Business name</label><input name="company" className={`${inp} mt-1`} /></div>
        <div><label className="text-xs text-muted">Phone *</label><input name="phone" required inputMode="tel" className={`${inp} mt-1`} /></div>
        <div><label className="text-xs text-muted">Email</label><input name="email" type="email" className={`${inp} mt-1`} /></div>
      </div>
      <div>
        <label className="text-xs text-muted">What do you need a quote for? *</label>
        <textarea name="message" required rows={4} placeholder="Products, quantities, delivery location, timeline…" className={`${inp} mt-1`} />
      </div>
      {err && <p className="text-sm text-rose">{err}</p>}
      <button disabled={busy} className="btn-primary w-full py-3 text-sm font-medium disabled:opacity-60">
        {busy ? "Sending…" : "Request a quote"}
      </button>
    </form>
  );
}
