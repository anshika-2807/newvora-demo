"use server";
/** "Sell with us" — customers propose a product for the store to stock/buy.
 *  Public submit lands as 'pending'; the owner approves or rejects in the console. */
import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabase/server";
import { requirePerm } from "@/lib/auth";

export async function submitProductAction(
  formData: FormData,
): Promise<{ ok: boolean; error?: string }> {
  const productName = String(formData.get("productName") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const askingRupees = Number(formData.get("askingPrice")) || 0;
  if (!productName) return { ok: false, error: "Please add the product name." };
  if (!name) return { ok: false, error: "Please add your name." };
  if (!phone) return { ok: false, error: "Please add a phone number so we can reach you." };
  if (!(askingRupees > 0)) return { ok: false, error: "Please enter the price you're asking (in ₹)." };

  const { error } = await supabaseServer().from("product_submissions").insert({
    channel: "retail",
    product_name: productName,
    submitter_name: name,
    submitter_phone: phone,
    submitter_email: String(formData.get("email") ?? "").trim() || null,
    category_id: String(formData.get("categoryId") ?? "").trim() || null,
    category_other: String(formData.get("categoryOther") ?? "").trim() || null,
    description: String(formData.get("description") ?? "").trim() || null,
    color: String(formData.get("color") ?? "").trim() || null,
    asking_price: Math.round(askingRupees * 100),
    qty: Math.max(0, Math.floor(Number(formData.get("qty")) || 0)),
    status: "pending",
  });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/submissions");
  return { ok: true };
}

/** Admin: approve or reject a submission (with an optional note). */
export async function decideSubmissionAction(formData: FormData): Promise<void> {
  if (!(await requirePerm("catalog.create"))) return;
  const id = String(formData.get("id") ?? "").trim();
  const decision = String(formData.get("decision") ?? "");
  if (!id || !["approved", "rejected"].includes(decision)) return;
  await supabaseServer().from("product_submissions").update({
    status: decision,
    review_note: String(formData.get("note") ?? "").trim() || null,
    decided_at: new Date().toISOString(),
  }).eq("id", id);
  revalidatePath("/admin/submissions");
}
