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
  description: z.string().min(40),
  specs: z.record(z.string()),
  tags: z.array(z.string()).min(1),
  seo: z.object({ metaTitle: z.string(), metaDescription: z.string(), keywords: z.array(z.string()) }),
});

function prompt(p: ProductLike) {
  const colors = (p.colors ?? []).join(", ");
  return [
    `You are a senior e-commerce copywriter for "Blythe Diva", a premium artificial-jewellery brand in Sadar Bazar, Rui Mandi, Delhi (retail + wholesale).`,
    `Write a high-converting product page as STRICT JSON with keys: title, description, specs (object of label->value), tags (array), seo (object: metaTitle, metaDescription, keywords array).`,
    `Product name: ${p.name}. SKU: ${p.sku}. Category: ${p.categoryName ?? "Jewellery"}.${colors ? ` Available colours: ${colors}.` : ""}`,
    `Rules: description 60-90 words, warm and aspirational, mention craftsmanship, anti-tarnish finish, and occasions; weave in location SEO ("Sadar Bazar", "Delhi", "artificial jewellery wholesale"). specs must include SKU, Category, Material, Care. seo.keywords 6-10 items. Return ONLY the JSON object, no markdown.`,
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
