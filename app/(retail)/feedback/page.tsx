import { FeedbackForm } from "@/components/site/FeedbackForm";
import { BUSINESS } from "@/lib/business";
import { Back } from "@/components/site/Back";

export const metadata = {
  title: "Share your feedback",
  description: "Tell us about your experience — we read every message and use it to get better.",
};

export default function FeedbackPage({ searchParams }: { searchParams: { order?: string } }) {
  const storePhone = String(BUSINESS.phone ?? "").replace(/\D/g, "").slice(-10);
  return (
    <main className="max-w-lg mx-auto px-4 py-10">
      <div className="mb-4"><Back label="Back" /></div>
      <h1 className="font-display text-3xl text-ink mb-1">We'd love your feedback</h1>
      <p className="text-sm text-muted mb-6">Loved your order, or something we can improve? A quick rating and a line or two helps us a lot.</p>
      <div className="bg-surface rounded-2xl p-6 shadow-card">
        <FeedbackForm storePhone={storePhone} orderRef={searchParams.order ?? ""} />
      </div>
    </main>
  );
}
