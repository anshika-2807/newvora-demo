/**
 * lib/ai/listingAgent.ts — generates a full product page via the AI gateway.
 * Chain: Groq (primary) -> OpenAI (secondary) -> deterministic template (always).
 * Output is zod-validated; any failure falls back so a page is never blank.
 */
import "server-only";
import { AiGateway, z } from "./gateway";
import { groqChat, openaiChat, groqConfigured, openaiConfigured } from "./providers";
import { templateContent, type GeneratedContent, type ProductLike } from "../content";

const schema = z.object({
  title: z.string().min(2),
  description: z.string().min(60),
  specs: z.record(z.string()),
  tags: z.array(z.string()).min(4),
  seo: z.object({ metaTitle: z.string(), metaDescription: z.string(), keywords: z.array(z.string()).min(5) }),
});

function prompt(p: ProductLike) {
  const colors = (p.colors ?? []).join(", ");
  return [
    `You are a senior e-commerce copywriter for "Newvora", a premium retail brand in Delhi, India (retail + wholesale).`,
    `Write a high-converting product page as STRICT JSON with keys: title, description, specs (object of label->value), tags (array), seo (object: metaTitle, metaDescription, keywords array).`,
    `Product name: ${p.name}. SKU: ${p.sku}. Category: ${p.categoryName ?? "Products"}.${colors ? ` Available colours: ${colors}.` : ""}`,
    `Rules: description 70-110 words, warm and benefit-led; naturally weave in Google-friendly search terms (the category, key features/use-cases, occasions like everyday/gifting/special occasions, and location terms "Delhi", "India", "buy online India"). Mention quality, materials/finish where relevant, value, COD and easy returns. Do NOT assume a specific product domain — describe whatever the product actually is.`,
    `specs (object) MUST include: SKU, Category, plus 3-5 relevant attributes for this product type (e.g. Material, Size/Options, Quality, Warranty, Care) and Colours if provided.`,
    `tags: 8-12 short search tags mixing category, use-case, occasion, and key features.`,
    `seo.metaTitle <= 60 chars; seo.metaDescription <= 155 chars and compelling; seo.keywords 8-12 long-tail phrases such as "<category> online", "buy <category>", "<category> wholesale", "products online India".`,
    `Return ONLY the JSON object, no markdown.`,
  ].join("\n");
}

export function buildGateway() {
  return new AiGateway({
    primary: {
      name: "groq",
      run: async (call: any) => JSON.parse(await groqChat({ system: "Return only valid minified JSON.", user: call._prompt, json: true })),
    },
    secondary: {
      name: "openai",
      run: async (call: any) => JSON.parse(await openaiChat({ system: "Return only valid minified JSON.", user: call._prompt, json: true })),
    },
    deterministic: (call: any) => templateContent(call._product) as GeneratedContent,
    budgetPaise: Number(process.env.AI_BUDGET_PAISE ?? 500000),
    maxRetries: 1,
    breakerThreshold: 3,
    log: (e) => console.log("[ai]", JSON.stringify(e)),
  });
}

export async function generateProductContent(p: ProductLike): Promise<{ content: GeneratedContent; provider: string; fallbackUsed: boolean }> {
  const gateway = buildGateway();
  const call: any = { feature: "listing", cacheKey: `listing:${p.sku}`, schema, estCostPaise: 50, _prompt: prompt(p), _product: p };
  const r = await gateway.run(call);
  return { content: r.data as GeneratedContent, provider: r.provider, fallbackUsed: r.fallbackUsed };
}

export function aiProvidersStatus() {
  return { groq: groqConfigured(), openai: openaiConfigured() };
}
