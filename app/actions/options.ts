"use server";
/** Master list of variant options (colours, sizes, finishes) used across products. */
import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabase/server";
import { requirePerm } from "@/lib/auth";

const KINDS = ["color", "size", "polish"] as const;

export async function addOptionAction(formData: FormData): Promise<void> {
  if (!(await requirePerm("catalog.edit"))) return;
  const kind = String(formData.get("kind") ?? "");
  const value = String(formData.get("value") ?? "").trim();
  if (!KINDS.includes(kind as any) || !value) return;
  const barcode_code = String(formData.get("barcode_code") ?? "").trim().toUpperCase().replace(/\s+/g, "") || null;
  await supabaseServer().from("variant_options").upsert(
    { kind, value, barcode_code },
    { onConflict: "kind,value" },
  );
  revalidatePath("/admin/colours");
}

export async function deleteOptionAction(formData: FormData): Promise<void> {
  if (!(await requirePerm("catalog.edit"))) return;
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;
  await supabaseServer().from("variant_options").delete().eq("id", id);
  revalidatePath("/admin/colours");
}
