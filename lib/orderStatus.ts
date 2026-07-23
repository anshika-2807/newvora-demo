/**
 * lib/orderStatus.ts — pure helper deriving a fulfilment stage from an order row.
 * Shared by the admin orders board and the customer order/track timeline.
 */
export type OrderStage = "new" | "packed" | "shipped" | "delivered" | "cancelled";

type OrderLike = {
  status?: string | null;
  fulfillment?: string | null;
  dispatched_at?: string | null;
  delivered_at?: string | null;
};

export function orderStage(o: OrderLike): OrderStage {
  const s = (o.status ?? "").toLowerCase();
  if (["cancelled", "void", "refunded", "rejected"].includes(s) || o.fulfillment === "rejected") return "cancelled";
  if (o.delivered_at || s === "delivered") return "delivered";
  if (o.dispatched_at || s === "dispatched") return "shipped";
  if (o.fulfillment === "accepted") return "packed";
  return "new";
}

export const STAGE_STEPS = ["Confirmed", "Packed", "Shipped", "Delivered"] as const;

export function stageIndex(stage: OrderStage): number {
  return ({ new: 0, packed: 1, shipped: 2, delivered: 3, cancelled: 0 } as const)[stage];
}

export function stageLabel(stage: OrderStage): string {
  return ({ new: "New", packed: "Packed", shipped: "Shipped", delivered: "Delivered", cancelled: "Cancelled" } as const)[stage];
}
