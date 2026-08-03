export const dynamic = "force-dynamic";
import { getStorefront } from "@/lib/supabase/queries";
import { computePrices, formatPaise } from "@/lib/pricing";
import { Back } from "@/components/site/Back";
import { getWholesaleSession } from "@/lib/wholesale";
import { wholesaleLoginAction } from "@/app/actions/wholesale";
import { WholesaleCatalog } from "@/components/site/WholesaleCatalog";
import { DealerSignupForm } from "@/components/site/DealerSignupForm";
import Link from "next/link";

export const metadata = { title: "Wholesale — Trade Pricing for Retailers" };

export default async function Wholesale({ searchParams }: { searchParams: { error?: string } }) {
  const session = await getWholesaleSession();
  const { products, formula } = await getStorefront();

  // Logged in & approved → real wholesale catalog with ordering.
  if (session) {
    const list = products.map((p) => ({
      sku: p.sku, name: p.name, category: p.category.name, qty: p.qty,
      price: computePrices(p.base_wholesale, formula).wholesaleRate,
    }));
    return (
      <div className="max-w-7xl mx-auto px-5 py-8">
        <div className="mb-4 flex items-center justify-between">
          <Back label="Back to store" />
          <Link href="/wholesale/orders" className="text-sm text-emerald nav-link">My orders →</Link>
        </div>
        <h1 className="font-display text-4xl text-ink mb-1">Wholesale Catalogue</h1>
        <p className="text-sm text-muted mb-6">Factory-direct trade rates. Enter quantities and place your order — no retail discounts, just your wholesale price.</p>
        <WholesaleCatalog products={list} customerName={session.name} />
      </div>
    );
  }

  const totalValue = products.reduce((s, p) => s + computePrices(p.base_wholesale, formula).wholesaleRate * p.qty, 0);

  // Not logged in → trade login + value prop.
  return (
    <div className="max-w-5xl mx-auto px-5 py-8">
      <div className="mb-3"><Back label="Back to store" /></div>
      <section className="rounded-3xl bg-night text-onnight px-8 py-12 relative overflow-hidden mb-8">
        <div className="absolute inset-0 opacity-25" style={{ background: "radial-gradient(circle at 15% 20%, #F59E0B, transparent 38%), radial-gradient(circle at 85% 90%, #38BDF8, transparent 42%)" }} />
        <div className="relative max-w-2xl">
          <p className="text-gold-light tracking-[0.3em] uppercase text-xs">Newvora · Trade</p>
          <h1 className="font-display text-5xl mt-2">Wholesale Portal</h1>
          <p className="text-onnight/70 mt-3">Factory-direct rates. {products.length} products live · {formatPaise(totalValue)} stock on hand. Approved retailers sign in to see trade prices and order.</p>
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-6">
        <form action={wholesaleLoginAction} className="bg-surface rounded-2xl shadow-card p-7 border border-sand">
          <h2 className="font-display text-2xl text-ink mb-1">Retailer sign in</h2>
          <p className="text-xs text-muted mb-5">Use the phone number and access code your supplier gave you.</p>
          <input name="phone" placeholder="Registered phone number" className="w-full rounded-xl border border-sand px-4 py-2.5 text-sm bg-surface outline-none focus:border-emerald mb-3" />
          <input name="code" placeholder="Access code" className="w-full rounded-xl border border-sand px-4 py-2.5 text-sm bg-surface outline-none focus:border-emerald uppercase tracking-widest" />
          {searchParams.error && <p className="text-sm text-rose mt-2">Wrong phone or code, or your account isn't approved yet.</p>}
          <button className="btn-primary w-full mt-4 py-3 text-sm font-medium">Sign in to trade prices</button>
        </form>

        <div className="bg-emerald-mist/60 rounded-2xl p-7 border border-emerald/20">
          <h2 className="font-display text-2xl text-emerald-dark mb-1">Become a wholesale partner</h2>
          <p className="text-xs text-emerald-dark/80 mb-4">Apply for a trade account — we verify your shop, then send an access code to sign in with. Or reach us on WhatsApp.</p>
          <DealerSignupForm />
          <a href="https://wa.me/918377062790" target="_blank" rel="noopener" className="block text-center text-xs text-emerald-dark/80 hover:text-emerald-dark mt-3">or message us on WhatsApp →</a>
        </div>
      </div>
    </div>
  );
}
