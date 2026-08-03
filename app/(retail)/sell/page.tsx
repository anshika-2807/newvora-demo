export const dynamic = "force-dynamic";
import { getCategories } from "@/lib/supabase/queries";
import { SellForm } from "@/components/site/SellForm";
import { Back } from "@/components/site/Back";

export const metadata = {
  title: "Sell with us",
  description: "Have a product to sell or list with us? Submit the details and our team will review it.",
};

export default async function SellPage() {
  const categories = await getCategories();
  return (
    <main className="max-w-xl mx-auto px-4 py-10">
      <div className="mb-4"><Back label="Back" /></div>
      <h1 className="font-display text-3xl text-ink mb-1">Sell with us</h1>
      <p className="text-sm text-muted mb-6">Got something you'd like us to stock or buy? Tell us about it — we review every submission and reach out personally.</p>
      <div className="bg-surface rounded-2xl p-6 shadow-card">
        <SellForm categories={categories} />
      </div>
    </main>
  );
}
