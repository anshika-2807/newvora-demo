export const dynamic = "force-dynamic";
import { supabaseServer } from "@/lib/supabase/server";
import { formatPaise } from "@/lib/pricing";
import { orderStage, stageIndex, stageLabel, STAGE_STEPS } from "@/lib/orderStatus";
import { acceptOrderAction, shipOrderAction, deliverOrderAction } from "@/app/actions/fulfillment";

export const metadata = { title: "Owner Console · Website Orders" };

const PILL: Record<string, string> = {
  new: "bg-gold/15 text-gold-dark",
  packed: "bg-emerald-mist text-emerald",
  shipped: "bg-rose-light/50 text-rose",
  delivered: "bg-emerald text-white",
  cancelled: "bg-sand text-muted",
};

export default async function AdminOrders() {
  const sb = supabaseServer();
  const { data } = await sb.from("orders")
    .select("id,total,status,fulfillment,dispatched_at,delivered_at,payment_mode,customer_name,customer_phone,created_at,invoice_no")
    .in("channel", ["retail", "wholesale"])
    .order("created_at", { ascending: false })
    .limit(60);
  const orders = (data as any[]) ?? [];

  return (
    <main className="p-8 bg-cream/40 min-h-screen max-w-4xl">
      <h1 className="font-display text-4xl text-ink mb-1">Website Orders</h1>
      <p className="text-sm text-muted mb-6">Fulfil online orders end to end — accept &amp; pack, ship, then mark delivered. Each step updates the customer's live tracking timeline.</p>

      {orders.length === 0 && (
        <div className="bg-white rounded-2xl p-10 text-center text-muted shadow-card">
          No website orders yet. Place one from the storefront checkout to see it appear here.
        </div>
      )}

      <div className="space-y-4">
        {orders.map((o) => {
          const stage = orderStage(o);
          const idx = stageIndex(stage);
          const cancelled = stage === "cancelled";
          const phone = String(o.customer_phone ?? "").replace(/\D/g, "");
          return (
            <div key={o.id} className="bg-white rounded-2xl p-5 shadow-card">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-mono text-sm font-semibold text-ink">#{String(o.id).slice(0, 8).toUpperCase()}</p>
                  <p className="text-xs text-muted">{new Date(o.created_at).toLocaleString("en-IN")} · {o.customer_name ?? "Customer"}{o.customer_phone ? ` · ${o.customer_phone}` : ""}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-ink">{formatPaise(o.total)}</span>
                  <span className="text-[11px] uppercase tracking-wide text-muted">{o.payment_mode ?? ""}</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${PILL[stage]}`}>{stageLabel(stage)}</span>
                </div>
              </div>

              {/* progress */}
              {!cancelled && (
                <div className="flex items-center mt-4 mb-1">
                  {STAGE_STEPS.map((step, i) => (
                    <div key={step} className="flex-1 flex items-center">
                      <div className="flex flex-col items-center">
                        <div className={`h-6 w-6 rounded-full grid place-items-center text-[11px] ${i <= idx ? "bg-emerald text-white" : "bg-cream text-muted border border-sand"}`}>
                          {i <= idx ? "✓" : i + 1}
                        </div>
                        <span className={`text-[10px] mt-1 ${i <= idx ? "text-ink" : "text-muted"}`}>{step}</span>
                      </div>
                      {i < STAGE_STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-1 ${i < idx ? "bg-emerald" : "bg-sand"}`} />}
                    </div>
                  ))}
                </div>
              )}

              {/* actions */}
              <div className="flex flex-wrap items-center gap-2 mt-4">
                {stage === "new" && (
                  <form action={acceptOrderAction}><input type="hidden" name="order_id" value={o.id} />
                    <button className="btn-primary px-4 py-2 text-sm font-medium">Accept &amp; pack</button></form>
                )}
                {stage === "packed" && (
                  <form action={shipOrderAction}><input type="hidden" name="order_id" value={o.id} />
                    <button className="btn-primary px-4 py-2 text-sm font-medium">Mark shipped</button></form>
                )}
                {stage === "shipped" && (
                  <form action={deliverOrderAction}><input type="hidden" name="order_id" value={o.id} />
                    <button className="btn-primary px-4 py-2 text-sm font-medium">Mark delivered</button></form>
                )}
                {stage === "delivered" && <span className="text-sm text-emerald font-medium">✓ Completed</span>}
                {cancelled && <span className="text-sm text-muted">Cancelled</span>}
                {phone && !cancelled && (
                  <a href={`https://wa.me/${phone}`} target="_blank" rel="noopener"
                    className="px-4 py-2 text-sm rounded-full border border-sand text-ink hover:border-emerald hover:text-emerald transition">
                    Notify on WhatsApp
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
