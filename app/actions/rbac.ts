"use server";
import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabase/server";
import { ALL_PERMISSIONS } from "@/lib/permissions";

function selectedPerms(formData: FormData): string[] {
  // Checkboxes are named "perm:<key>"; collect the ones that are on.
  return ALL_PERMISSIONS.filter((p) => formData.get(`perm:${p}`) === "on");
}

export async function createRoleAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  await supabaseServer().from("roles").insert({ name, permissions: selectedPerms(formData) });
  revalidatePath("/admin/roles");
}

export async function updateRoleAction(formData: FormData) {
  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  if (!id || !name) return;
  await supabaseServer().from("roles").update({ name, permissions: selectedPerms(formData) }).eq("id", id);
  revalidatePath("/admin/roles");
}

export async function deleteRoleAction(formData: FormData) {
  const id = String(formData.get("id"));
  await supabaseServer().from("roles").delete().eq("id", id);
  revalidatePath("/admin/roles");
}
