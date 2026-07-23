export const dynamic = "force-dynamic";
import { getPricingFormula } from "@/lib/supabase/queries";
import { getSession, can } from "@/lib/auth";
import { savePricingFormulaAction } from "@/app/actions/pricing";
import PricingFormulaEditor from "@/components/admin/PricingFormulaEditor";

export const metadata = { title: "Owner Console · Pricing formula" };

export default async function PricingPage() {
  const canEdit = can(getSession(), "catalog.edit");
  const formula = await getPricingFormula();

  return (
    <main className="p-8 bg-cream/40 min-h-screen max-w-3xl">
      <h1 className="font-display text-4xl text-ink mb-1">Pricing formula</h1>
      <p className="text-sm text-muted mb-6">One formula prices the entire catalogue from each product's base wholesale cost — so what shoppers see always matches what's billed.</p>

      {canEdit ? (
        <PricingFormulaEditor initial={formula} action={savePricingFormulaAction} />
      ) : (
        <div className="rounded-2xl border border-sand bg-white p-6 text-muted">
          You don't have permission to edit pricing. Ask the owner for the <code>catalog.edit</code> role.
        </div>
      )}
    </main>
  );
}
