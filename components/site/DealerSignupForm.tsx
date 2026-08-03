"use client";
import { useState } from "react";
import { dealerSignupAction } from "@/app/actions/dealer";
import { Icon } from "@/components/ui/Icon";

export function DealerSignupForm() {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");
  const inp = "w-full rounded-xl border border-emerald/30 bg-surface px-4 py-2.5 text-sm text-ink outline-none focus:border-emerald";

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setErr("");
    const res = await dealerSignupAction(new FormData(e.currentTarget));
    setBusy(false);
    if (res.ok) setDone(true); else setErr(res.error ?? "Something went wrong.");
  }

  if (done) return (
    <div className="text-center py-2">
      <Icon name="handshake" className="w-10 h-10 mx-auto block text-emerald" />
      <h3 className="font-display text-xl text-emerald-dark mt-1">Application received</h3>
      <p className="text-sm text-emerald-dark/80 mt-1">We'll verify your shop and send an access code. Once approved, sign in with your phone number and code.</p>
    </div>
  );

  return (
    <form onSubmit={submit} className="space-y-2.5">
      <input name="name" required placeholder="Shop / business name" className={inp} />
      <input name="phone" required inputMode="tel" placeholder="Phone (you'll sign in with this)" className={inp} />
      <div className="grid grid-cols-2 gap-2.5">
        <input name="gstin" placeholder="GSTIN (optional)" className={inp} />
        <input name="city" placeholder="City" className={inp} />
      </div>
      {err && <p className="text-sm text-rose">{err}</p>}
      <button disabled={busy} className="btn-gold w-full py-2.5 text-sm font-medium disabled:opacity-60">
        {busy ? "Submitting…" : "Apply for a trade account"}
      </button>
    </form>
  );
}
