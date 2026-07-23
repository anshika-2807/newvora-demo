import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center bg-ivory">
      <span className="inline-flex items-center gap-2 rounded-full border border-sand bg-white px-4 py-1.5 text-xs font-medium text-muted shadow-card mb-8">
        <span className="h-2 w-2 rounded-full bg-emerald-light animate-pulse" />
        Live demo · storefront + business console
      </span>

      <p className="font-display tracking-[0.35em] uppercase text-xs text-emerald mb-4">Newvora</p>
      <h1 className="font-display text-5xl md:text-6xl font-semibold text-ink leading-tight max-w-3xl">
        Everything your store needs, <span className="text-gold-gradient">in one system.</span>
      </h1>
      <p className="text-muted mt-6 max-w-xl text-lg leading-relaxed">
        A complete online store and back-office — catalogue, cart &amp; checkout, POS billing,
        GST invoicing, inventory, wholesale pricing and an AI assistant. Built for any product
        business, retail or wholesale.
      </p>

      <div className="flex flex-wrap gap-4 justify-center mt-10">
        <Link href="/shop" className="btn-primary px-7 py-3.5 text-sm font-semibold">Explore the store →</Link>
        <Link href="/admin/catalogue" className="px-7 py-3.5 rounded-full border border-sand bg-white text-ink text-sm font-semibold hover:border-emerald hover:text-emerald transition">
          Open the business console
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-16 max-w-3xl w-full">
        {[
          ["Storefront", "Browse, cart & checkout"],
          ["POS & Billing", "GST invoices, split pay"],
          ["Inventory", "Live stock & reorder"],
          ["AI assistant", "Runs the shop by chat"],
        ].map(([t, d]) => (
          <div key={t} className="rounded-2xl border border-sand bg-white p-5 shadow-card">
            <p className="font-display text-sm font-semibold text-ink">{t}</p>
            <p className="text-xs text-muted mt-1 leading-relaxed">{d}</p>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted/70 mt-14">A Newvora demo · newvora.in</p>
    </main>
  );
}
