"use server";
/** Dealer self-signup for a trade (wholesale) account. Creates a PENDING wholesale
 *  customer the owner then approves in the console (which issues an access code). */
import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabase/server";

export async function dealerSignupAction(
  formData: FormData,
): Promise<{ ok: boolean; error?: string }> {
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  if (!name) return { ok: false, error: "Please add your shop / business name." };
  if (!phone) return { ok: false, error: "Please add the phone number you'll sign in with." };
  const gstin = String(formData.get("gstin") ?? "").trim() || null;
  const city = String(formData.get("city") ?? "").trim() || null;

  const sb = supabaseServer();
  const { data: existing } = await sb.from("customers").select("id,wholesale_approved").eq("phone", phone).limit(1);
  const hit = (existing as any[])?.[0];
  if (hit?.wholesale_approved) return { ok: false, error: "This number already has an approved trade account — just sign in." };

  if (hit) {
    await sb.from("customers").update({ name, gstin, city, type: "wholesale" }).eq("id", hit.id);
  } else {
    const { error } = await sb.from("customers").insert({ name, phone, gstin, city, type: "wholesale", wholesale_approved: false });
    if (error) return { ok: false, error: error.message };
  }
  revalidatePath("/admin/trade-accounts");
  revalidatePath("/admin/customers");
  return { ok: true };
}
