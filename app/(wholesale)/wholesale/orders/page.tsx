export const dynamic = "force-dynamic";
import Link from "next/link";
import { getWholesaleSession } from "@/lib/wholesale";
import { supabaseServer } from "@/lib/supabase/server";
import { formatPaise } from "@/lib/pricing";
import { orderStage, stageLabel } from "@/lib/orderStatus";
import { Back } from "@/components/site/Back";

export const metadata = { title: "My trade orders" };

const PILL: Record<string, string> = {
  new: "bg-gold/15 text-gold-dark", packed: "bg-emerald-mist text-emerald",
  shipped: "bg-rose-light/50 text-rose", delivered: "bg-emerald text-white", cancelled: "bg-sand text-muted",
};

export default async function TradeOrders() {
  const session = await getWholesaleSession();
  if (!session) {
    return (
      <div className="max-w-lg mx-auto px-5 py-16 text-center">
        <h1 className="font-display text-3xl text-ink mb-2">Please sign in</h1>
        <p className="text-muted mb-6">Sign in to your trade account to view your orders.</p>
        <Link href="/wholesale" className="btn-primary inline-block px-7 py-3 text-sm font-medium">Go to trade sign in</Link>
      </div>
    );
  }
  const { data } = await supabaseServer().from("orders")
    .select("id,total,amount_paid,status,fulfillment,dispatched_at,delivered_at,created_at,invoice_no")
    .eq("customer_id", session.id).eq("channel", "wholesale")
    .order("created_at", { ascending: false }).limit(100);
  const orders = (data as any[]) ?? [];

  return (
    <div className="max-w-3xl mx-auto px-5 py-8">
      <div className="mb-4 flex items-center justify-between">
        <Back label="Back to catalogue" />
        <Link href="/wholesale" className="text-sm text-emerald nav-link">Order more →</Link>
      </div>
      <h1 className="font-display text-4xl text-ink mb-1">Your trade orders</h1>
      <p className="text-sm text-muted mb-6">Hi {session.name} — here's your wholesale order history.</p>

      {orders.length === 0 ? (
        <div className="bg-surface rounded-2xl p-10 text-center text-muted shadow-card">
          No orders yet. Head to the <Link href="/wholesale" className="text-emerald nav-link">catalogue</Link> to place your first trade order.
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => {
            const due = Math.max(0, (o.total ?? 0) - (o.amount_paid ?? 0));
            const stage = orderStage(o);
            return (
              <div key={o.id} className="bg-surface rounded-2xl p-5 shadow-card flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-mono text-sm text-ink">{o.invoice_no || String(o.id).slice(0, 8).toUpperCase()}</p>
                  <p className="text-xs text-muted">{new Date(o.created_at).toLocaleString("en-IN")}</p>
                </div>
                <div className="flex items-center gap-3">
                  {due > 0 && <span className="text-xs text-rose">Due {formatPaise(due)}</span>}
                  <span className="text-sm font-semibold text-ink">{formatPaise(o.total)}</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${PILL[stage]}`}>{stageLabel(stage)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
