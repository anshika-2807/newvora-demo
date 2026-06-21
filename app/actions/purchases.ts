"use server";
import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabase/server";

export async function createSupplierAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  if (!name) return;
  await supabaseServer().from("suppliers").insert({ name, city: city || null });
  revalidatePath("/admin/purchases");
}

export type PurchaseLine = { supplierSku: string; mappedProductId: string; qty: number; unitCostRupees: number };

export async function recordPurchaseAction(input: { supplierId: string; billNo: string; items: PurchaseLine[] }): Promise<{ ok: boolean; total?: number; error?: string }> {
  if (!input.supplierId) return { ok: false, error: "Choose a supplier" };
  const items = (input.items ?? []).filter((l) => l.qty > 0 && l.unitCostRupees > 0);
  if (!items.length) return { ok: false, error: "Add at least one line with qty and cost" };
  const payload = items.map((l) => ({ supplier_sku: l.supplierSku, mapped_product_id: l.mappedProductId || "", qty: l.qty, unit_cost: Math.round(l.unitCostRupees * 100) }));
  const { data, error } = await supabaseServer().rpc("record_purchase", { p_supplier_id: input.supplierId, p_bill_no: input.billNo || null, p_items: payload });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/purchases"); revalidatePath("/admin/dashboard");
  return { ok: true, total: (data as any)?.total };
}
