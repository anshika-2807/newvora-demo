export const dynamic = "force-dynamic";
import { supabaseServer } from "@/lib/supabase/server";
import { approveWholesaleAction, regenWholesaleCodeAction } from "@/app/actions/wholesale";

export const metadata = { title: "Owner Console · Trade Accounts" };

export default async function TradeAccounts() {
  const { data } = await supabaseServer().from("customers")
    .select("id,name,phone,city,gstin,wholesale_approved,login_code,created_at")
    .eq("type", "wholesale")
    .order("wholesale_approved", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(300);
  const rows = (data as any[]) ?? [];
  const pending = rows.filter((r) => !r.wholesale_approved).length;

  return (
    <main className="p-8 bg-cream/40 min-h-screen max-w-3xl">
      <h1 className="font-display text-4xl text-ink mb-1">Trade Accounts</h1>
      <p className="text-sm text-muted mb-6">Retailers who applied for wholesale pricing{pending ? ` · ${pending} pending` : ""}. Approve to unlock trade prices and issue an access code they sign in with.</p>

      {rows.length === 0 && (
        <div className="bg-surface rounded-2xl p-10 text-center text-muted shadow-card">
          No trade accounts yet. Applications from the wholesale portal appear here for approval.
        </div>
      )}

      <div className="space-y-3">
        {rows.map((c) => (
          <div key={c.id} className={`bg-surface rounded-2xl p-5 shadow-card ${!c.wholesale_approved ? "ring-2 ring-gold/30" : ""}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-ink">{c.name || "Unnamed shop"}</p>
                <p className="text-xs text-muted mt-0.5">{c.phone}{c.city ? ` · ${c.city}` : ""}{c.gstin ? ` · GSTIN ${c.gstin}` : ""}</p>
                {c.wholesale_approved && c.login_code && (
                  <p className="text-xs text-muted mt-1">Access code: <span className="font-mono font-semibold text-ink tracking-widest">{c.login_code}</span></p>
                )}
              </div>
              <span className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-medium ${c.wholesale_approved ? "bg-emerald-mist text-emerald" : "bg-gold/15 text-gold-dark"}`}>
                {c.wholesale_approved ? "Approved" : "Pending"}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-sand">
              {!c.wholesale_approved ? (
                <form action={approveWholesaleAction}><input type="hidden" name="id" value={c.id} /><input type="hidden" name="approve" value="1" />
                  <button className="btn-primary px-4 py-2 text-sm font-medium">Approve &amp; issue code</button></form>
              ) : (
                <>
                  <form action={regenWholesaleCodeAction}><input type="hidden" name="id" value={c.id} />
                    <button className="text-xs px-3 py-1.5 rounded-full border border-sand text-muted hover:border-emerald hover:text-emerald transition">Regenerate code</button></form>
                  <form action={approveWholesaleAction}><input type="hidden" name="id" value={c.id} /><input type="hidden" name="approve" value="0" />
                    <button className="text-xs px-3 py-1.5 rounded-full border border-sand text-muted hover:border-rose hover:text-rose transition">Revoke access</button></form>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
