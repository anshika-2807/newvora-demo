"use client";
import { useState } from "react";
import { submitFeedbackAction } from "@/app/actions/feedback";
import { Icon } from "@/components/ui/Icon";

export function FeedbackForm({ storePhone = "", orderRef = "" }: { storePhone?: string; orderRef?: string }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [msg, setMsg] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const waText = encodeURIComponent(
    `Feedback for Newvora${orderRef ? ` (Order ${orderRef})` : ""}: ${rating ? `${rating}★ — ` : ""}${msg}${name ? `\n— ${name}` : ""}`,
  );
  const waHref = storePhone ? `https://wa.me/91${storePhone}?text=${waText}` : "#";
  const input = "w-full rounded-xl border border-sand px-4 py-2.5 text-sm bg-surface text-ink outline-none focus:border-emerald";

  async function submit() {
    if (!rating && !msg.trim()) { setErr("Add a rating or a few words first."); return; }
    setBusy(true); setErr("");
    const res = await submitFeedbackAction({ name, phone, rating, message: msg, orderRef });
    setBusy(false);
    if (res.ok) setDone(true); else setErr(res.error ?? "Couldn't submit — try the WhatsApp button.");
  }

  if (done) return (
    <div className="text-center py-6">
      <Icon name="heart" className="w-12 h-12 mx-auto block text-gold" />
      <h2 className="font-display text-2xl text-ink mt-2">Thank you!</h2>
      <p className="text-sm text-muted mt-1">We've received your feedback and truly appreciate it.</p>
      {storePhone && (
        <a href={waHref} target="_blank" rel="noreferrer" className="inline-block mt-4 px-5 py-3 rounded-full bg-[#25D366] text-white text-sm font-medium">Also send us on WhatsApp →</a>
      )}
    </div>
  );

  return (
    <div className="space-y-3">
      <div className="flex gap-1.5 justify-center text-4xl">
        {[1, 2, 3, 4, 5].map((s) => (
          <button key={s} type="button" onClick={() => setRating(s)} onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)}
            className={`transition-transform hover:scale-110 ${(hover || rating) >= s ? "text-gold" : "text-sand"}`} aria-label={`${s} star${s > 1 ? "s" : ""}`}><Icon name="star" className="w-7 h-7" /></button>
        ))}
      </div>
      <textarea value={msg} onChange={(e) => setMsg(e.target.value)} rows={4} placeholder="Tell us what you loved, or how we can do better…" className={input} />
      <div className="grid grid-cols-2 gap-3">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name (optional)" className={input} />
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone (optional)" inputMode="tel" className={input} />
      </div>
      {err && <p className="text-sm text-rose">{err}</p>}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <button onClick={submit} disabled={busy} className="btn-primary px-6 py-2.5 text-sm font-medium disabled:opacity-60">
          {busy ? "Sending…" : "Send feedback"}
        </button>
        {storePhone && (
          <a href={waHref} target="_blank" rel="noreferrer" className="px-5 py-2.5 rounded-full bg-[#25D366] text-white text-sm font-medium">WhatsApp instead</a>
        )}
      </div>
    </div>
  );
}
