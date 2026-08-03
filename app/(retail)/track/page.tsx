export const dynamic = "force-dynamic";
import { findOrderForTracking } from "@/lib/supabase/queries";
import { formatPaise } from "@/lib/pricing";
import { orderStage, stageIndex } from "@/lib/orderStatus";
import { Back } from "@/components/site/Back";
import { Icon } from "@/components/ui/Icon";

export const metadata = { title: "Track your order" };

const dt = (v?: string | null) =>
  v ? new Date(v).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : undefined;

function Step({ done, active, icon, title, sub }: { done: boolean; active?: boolean; icon: React.ReactNode; title: string; sub?: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className={`h-9 w-9 rounded-full flex items-center justify-center text-base shrink-0 ${done ? "bg-emerald text-white" : active ? "bg-gold/20 text-gold-dark" : "bg-ink/5 text-muted"}`}>{icon}</div>
      <div className="pb-6">
        <p className={`text-sm font-medium ${done || active ? "text-ink" : "text-muted"}`}>{title}</p>
        {sub && <p className="text-xs text-muted">{sub}</p>}
      </div>
    </div>
  );
}

export default async function TrackOrder({ searchParams }: { searchParams: { code?: string; phone?: string } }) {
  const code = (searchParams.code ?? "").trim();
  const phone = (searchParams.phone ?? "").trim();
  const order = code ? await findOrderForTracking(code, phone) : null;
  const fld = "w-full rounded-xl border border-sand bg-surface px-4 py-3 text-base outline-none focus:border-emerald";

  const idx = order ? stageIndex(orderStage(order)) : -1;
  const cancelled = order ? orderStage(order) === "cancelled" : false;

  return (
    <main className="max-w-lg mx-auto px-4 py-10">
      <div className="mb-4"><Back label="Back" /></div>
      <h1 className="font-display text-3xl text-ink mb-1">Track your order</h1>
      <p className="text-sm text-muted mb-6">Enter the order code from your confirmation. Add the phone number you ordered with for a quicker match.</p>

      <form action="/track" className="bg-surface rounded-2xl p-5 shadow-card space-y-3 mb-6">
        <input name="code" defaultValue={code} placeholder="Order code — e.g. 9F3A21BC" required className={fld} />
        <input name="phone" defaultValue={phone} placeholder="Phone number (optional)" inputMode="tel" className={fld} />
        <button className="btn-primary w-full py-3 text-base font-medium">Track →</button>
      </form>

      {code && !order && (
        <div className="bg-rose/10 text-rose rounded-2xl p-4 text-sm">No order found for that code. Double-check it (and the phone, if you added one), or WhatsApp us for help.</div>
      )}

      {order && (
        <div className="bg-surface rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-5">
            <div>
              <p className="font-mono text-sm text-muted">{order.invoice_no || String(order.id).slice(0, 8).toUpperCase()}</p>
              <p className="text-ink font-medium">{order.customer_name || "Your order"}</p>
            </div>
            <p className="text-xl font-semibold text-ink">{formatPaise(order.total)}</p>
          </div>

          {cancelled ? (
            <div className="bg-rose/10 text-rose rounded-xl p-4 text-sm font-medium">This order was cancelled. Any payment made will be refunded — WhatsApp us with your order code for anything at all.</div>
          ) : (
            <div>
              <Step done icon={<Icon name="bag" className="w-4 h-4" />} title="Order placed" sub={dt(order.created_at)} />
              <Step done={idx >= 1} active={idx === 0} icon={<Icon name="check" className="w-4 h-4" />} title="Confirmed & being packed" sub={idx >= 1 ? "We're preparing your order" : "Waiting for confirmation"} />
              <Step done={idx >= 2} active={idx === 1} icon={<Icon name="package" className="w-4 h-4" />} title="Shipped" sub={dt(order.dispatched_at)} />
              <Step done={idx >= 3} active={idx === 2} icon={<Icon name="home" className="w-4 h-4" />} title={`Delivered${order.payment_mode === "cod" && idx < 3 ? " · pay cash on delivery" : ""}`} sub={dt(order.delivered_at)} />
            </div>
          )}
        </div>
      )}
    </main>
  );
}
