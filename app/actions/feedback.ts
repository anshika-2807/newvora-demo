"use server";
import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabase/server";
import { requirePerm } from "@/lib/auth";

/** Public: a customer submits store feedback. No auth — anyone can leave it. */
export async function submitFeedbackAction(input: {
  name?: string; phone?: string; rating?: number; message?: string; orderRef?: string;
}): Promise<{ ok: boolean; error?: string }> {
  const rating = Math.min(5, Math.max(0, Math.round(Number(input.rating) || 0)));
  const message = String(input.message ?? "").trim();
  if (!rating && !message) return { ok: false, error: "Please add a rating or a message." };
  const { error } = await supabaseServer().from("feedback").insert({
    name: input.name?.trim() || null,
    phone: input.phone?.trim() || null,
    rating: rating || null,
    message: message || null,
    order_ref: input.orderRef?.trim() || null,
  });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/feedback");
  return { ok: true };
}

/** Admin: mark a feedback entry as seen. */
export async function markFeedbackSeenAction(formData: FormData): Promise<void> {
  if (!(await requirePerm("reviews.respond"))) return;
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await supabaseServer().from("feedback").update({ seen: true }).eq("id", id);
  revalidatePath("/admin/feedback");
}
