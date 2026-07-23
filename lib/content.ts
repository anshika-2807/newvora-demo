/**
 * lib/content.ts — product content resolver. Requirement 2.2-2.3.
 * NEVER calls a model on the request path: cached generated_content else a rich
 * deterministic template. SEO-strong by default (tags, keywords, occasion terms).
 * Domain-neutral: works for any product catalogue.
 */
export type GeneratedContent = {
  title: string;
  description: string;
  specs: Record<string, string>;
  tags: string[];
  seo: { metaTitle: string; metaDescription: string; keywords: string[] };
};

export type ProductLike = {
  name: string;
  sku: string;
  categoryName?: string;
  colors?: string[];
  keywords?: string[];
  generated_content?: GeneratedContent | null;
};

const LOCATION = ["India", "online India", "retail and wholesale", "buy online"];
const OCCASIONS = ["everyday use", "gifting", "special occasions"];

export function templateContent(p: ProductLike): GeneratedContent {
  const cat = p.categoryName ?? "Product";
  const catL = cat.toLowerCase();
  const colorPhrase = p.colors && p.colors.length ? ` Available in ${p.colors.join(", ")}.` : "";
  const description =
    `${p.name} — a quality ${catL} from Newvora.${colorPhrase} ` +
    `Thoughtfully made and finished for a premium look and feel, built to last and priced fairly. ` +
    `Great for everyday use and gifting. Shop online with Cash on Delivery, free shipping over ₹999, and easy 7-day returns.`;

  const specs: Record<string, string> = {
    SKU: p.sku,
    Category: cat,
    Quality: "Premium",
    Availability: "Retail & wholesale",
    Care: "Follow the care instructions provided with the product",
    ...(p.colors && p.colors.length ? { Colours: p.colors.join(", ") } : {}),
  };

  const tags = Array.from(new Set([
    cat, "retail", "wholesale", "buy online",
    ...OCCASIONS.slice(0, 3), ...(p.colors ?? []),
  ])).slice(0, 14);

  const keywords = Array.from(new Set([
    p.name, `${catL} online`, `buy ${catL}`, `${catL} wholesale`,
    "Newvora", ...(p.keywords ?? []), ...LOCATION,
  ])).filter(Boolean).slice(0, 12);

  return {
    title: p.name,
    description,
    specs,
    tags,
    seo: {
      metaTitle: `${p.name} | ${cat} | Newvora`.slice(0, 60),
      metaDescription: `Buy ${p.name} (${p.sku}) — ${catL} at retail & wholesale from Newvora. COD, free shipping over ₹999.`.slice(0, 158),
      keywords,
    },
  };
}

export function resolveProductContent(p: ProductLike): GeneratedContent {
  if (p.generated_content && p.generated_content.title) return p.generated_content;
  return templateContent(p);
}
