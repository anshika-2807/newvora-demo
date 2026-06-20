export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStorefront } from "@/lib/supabase/queries";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import { Back } from "@/components/site/Back";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const name = params.slug.charAt(0).toUpperCase() + params.slug.slice(1);
  return {
    title: `${name} — Artificial Jewellery`,
    description: `Shop ${name.toLowerCase()} from Blythe Diva, Sadar Bazar Delhi. Premium artificial ${name.toLowerCase()} at retail & wholesale, with COD and free shipping over ₹999.`,
    keywords: [name, "artificial jewellery", "Sadar Bazar", "Delhi", "wholesale"],
  };
}

export default async function CategoryPage({ params, searchParams }: { params: { slug: string }; searchParams: { sort?: string } }) {
  const { products, formula } = await getStorefront();
  let items = products.filter((p) => p.category.slug === params.slug);
  if (items.length === 0) notFound();
  const catName = items[0].category.name;
  if (searchParams.sort === "price") items = [...items].sort((a, b) => a.base_wholesale - b.base_wholesale);
  else if (searchParams.sort === "rating") items = [...items].sort((a, b) => b.rating - a.rating);

  return (
    <div className="max-w-7xl mx-auto px-5 py-8">
      <div className="flex items-center justify-between gap-4 mb-2">
        <Back label="Back" />
        <div className="text-xs text-muted">
          <Link href="/shop" className="hover:text-emerald">Home</Link> / <span className="text-ink">{catName}</span>
        </div>
      </div>
      <Reveal>
        <header className="text-center my-8">
          <p className="text-gold-dark tracking-[0.25em] uppercase text-xs">Collection</p>
          <h1 className="font-display text-5xl text-ink mt-1">{catName}</h1>
          <p className="text-muted mt-2">{items.length} designs · live pricing &amp; stock</p>
        </header>
      </Reveal>

      <div className="flex items-center gap-2 mb-6 text-sm">
        <span className="text-muted">Sort:</span>
        {[["", "Featured"], ["price", "Price"], ["rating", "Top rated"]].map(([k, label]) => (
          <Link key={k} href={`/shop/c/${params.slug}${k ? `?sort=${k}` : ""}`}
            className={`px-3 py-1.5 rounded-full border transition-colors ${ (searchParams.sort ?? "") === k ? "border-emerald text-emerald bg-emerald-mist" : "border-sand text-muted hover:border-emerald"}`}>
            {label}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {items.map((p, i) => (
          <Reveal key={p.sku} delay={(i % 4) * 70}><ProductCard p={p as any} formula={formula} index={i} /></Reveal>
        ))}
      </div>
    </div>
  );
}
