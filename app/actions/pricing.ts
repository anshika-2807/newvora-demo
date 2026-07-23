"use server";
/** Save the single global pricing formula (multiplier mode). One row drives the
 *  whole catalogue, so changing it re-prices every product on the next render. */
import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabase/server";
import { requirePerm } from "@/lib/auth";

export async function savePricingFormulaAction(formData: FormData): Promise<void> {
  if (!(await requirePerm("catalog.edit"))) return;
  const num = (k: string, d: number, min: number) => {
    const n = Number(formData.get(k));
    return Number.isFinite(n) && n >= min ? n : d;
  };
  const wholesale_markup_pct = num("wholesale_markup_pct", 12, 0);
  const retail_multiplier = num("retail_multiplier", 2.2, 1);
  const mrp_multiplier = num("mrp_multiplier", 2.75, 1);
  const round_to = Math.max(1, Math.round(num("round_to", 100, 1)));

  const sb = supabaseServer();
  const { data: existing } = await sb.from("pricing_settings").select("id").limit(1).maybeSingle();
  const patch = { wholesale_markup_pct, retail_multiplier, mrp_multiplier, round_to, updated_at: new Date().toISOString() };
  if ((existing as any)?.id) {
    await sb.from("pricing_settings").update(patch).eq("id", (existing as any).id);
  } else {
    await sb.from("pricing_settings").insert(patch);
  }
  revalidatePath("/admin/pricing");
  revalidatePath("/shop");
}
