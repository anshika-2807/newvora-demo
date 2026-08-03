import { QuoteRequestForm } from "@/components/site/QuoteRequestForm";
import { Back } from "@/components/site/Back";

export const metadata = {
  title: "Request a bulk quote",
  description: "Buying in bulk or for your business? Tell us what you need and we'll send a tailored quote.",
};

export default function QuotePage() {
  return (
    <main className="max-w-lg mx-auto px-4 py-10">
      <div className="mb-4"><Back label="Back" /></div>
      <h1 className="font-display text-3xl text-ink mb-1">Request a bulk quote</h1>
      <p className="text-sm text-muted mb-6">Buying in volume or for your business? Share the details and our team will prepare pricing and reach out.</p>
      <div className="bg-surface rounded-2xl p-6 shadow-card">
        <QuoteRequestForm />
      </div>
    </main>
  );
}
