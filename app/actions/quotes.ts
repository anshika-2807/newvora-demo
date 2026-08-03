"use server";
/** Wholesale/bulk quote requests — public submit + admin status updates. */
import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabase/server";
import { requirePerm } from "@/lib/auth";

export async function submitQuoteAction(
  formData: FormData,
): Promise<{ ok: boolean; error?: string }> {
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  if (!name) return { ok: false, error: "Please add your name." };
  if (!phone) return { ok: false, error: "Please add a phone number." };
  if (!message) return { ok: false, error: "Tell us what you'd like a quote for." };
  const { error } = await supabaseServer().from("quote_requests").insert({
    name, phone,
    email: String(formData.get("email") ?? "").trim() || null,
    company: String(formData.get("company") ?? "").trim() || null,
    message,
    status: "new",
  });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/quotes");
  return { ok: true };
}

export async function setQuoteStatusAction(formData: FormData): Promise<void> {
  if (!(await requirePerm("customers.view"))) return;
  const id = String(formData.get("id") ?? "").trim();
  const status = String(formData.get("status") ?? "");
  if (!id || !["new", "quoted", "closed"].includes(status)) return;
  await supabaseServer().from("quote_requests").update({ status }).eq("id", id);
  revalidatePath("/admin/quotes");
}
