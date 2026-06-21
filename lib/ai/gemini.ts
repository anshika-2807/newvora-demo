/**
 * lib/ai/gemini.ts — Gemini image generation (Nano Banana Pro / 2 / 1).
 *
 * IMPORTANT: the request body differs by model family.
 *   - Gemini 3 image models (gemini-3-pro-image, gemini-3.1-flash-image) accept
 *       generationConfig.responseModalities = ["TEXT","IMAGE"] and imageConfig.aspectRatio.
 *   - Gemini 2.5 image model (gemini-2.5-flash-image) does NOT accept those fields
 *       (returns 400 "Unknown name responseModalities / imageConfig"). It returns an
 *       image by default, so we send the bare contents with no generationConfig.
 *
 * We use the v1beta endpoint (superset; serves all image models). We try the configured
 * primary model first, then fall back down the chain — so generation still succeeds even
 * if the key's tier can't access the newer Gemini 3 image models (they fall through to 2.5).
 *
 * NEVER called on a render path — only from an explicit "Generate" action.
 * Until GEMINI_API_KEY is set: { ok:false, reason:'no_key' }.
 */
const PRIMARY = () => process.env.GEMINI_IMAGE_MODEL ?? "gemini-3-pro-image";

/** primary first, then the rest (deduped) — best fidelity first, reliable last. */
function modelChain(): string[] {
  const chain = [PRIMARY(), "gemini-3-pro-image", "gemini-3.1-flash-image", "gemini-2.5-flash-image"];
  return [...new Set(chain)];
}

const ENDPOINT = (m: string) => `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent`;

/** Gemini 3 image models accept modalities + imageConfig; 2.5 does not. */
function isGen3(model: string): boolean {
  return model.includes("gemini-3");
}

export type GenImageResult =
  | { ok: true; base64: string; mime: string; model: string }
  | { ok: false; reason: "no_key" | "no_source" | "api_error" | "no_image"; error?: string };

export function geminiConfigured(): boolean { return !!process.env.GEMINI_API_KEY; }

export async function generateImage(opts: {
  prompt: string;
  referenceBase64?: string;
  referenceMime?: string;
  aspectRatio?: string;
  timeoutMs?: number;
}): Promise<GenImageResult> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return { ok: false, reason: "no_key" };

  // Image FIRST, then the instruction — keeps the reference design front-and-centre.
  const parts: any[] = [];
  if (opts.referenceBase64) parts.push({ inline_data: { mime_type: opts.referenceMime ?? "image/jpeg", data: opts.referenceBase64 } });
  parts.push({ text: opts.prompt });

  const chain = modelChain();
  let lastErr = "";

  for (const model of chain) {
    // Build the body THIS model accepts.
    const payload: any = { contents: [{ role: "user", parts }] };
    if (isGen3(model)) {
      payload.generationConfig = { responseModalities: ["TEXT", "IMAGE"] };
      if (opts.aspectRatio) payload.generationConfig.imageConfig = { aspectRatio: opts.aspectRatio };
    }
    // gemini-2.5-flash-image: no generationConfig — it returns an image by default.

    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), opts.timeoutMs ?? 120_000);
    try {
      const res = await fetch(ENDPOINT(model), {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": key },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      if (!res.ok) {
        const txt = (await res.text()).slice(0, 400);
        lastErr = `[${model}] HTTP ${res.status}: ${txt}`;
        console.error("[gemini] image api error:", lastErr);
        // 400/403/404 → this model is unavailable/incompatible on this key; try the next.
        if (res.status === 400 || res.status === 403 || res.status === 404) continue;
        // 429/5xx → not model-specific; stop and report.
        return { ok: false, reason: "api_error", error: lastErr };
      }
      const json: any = await res.json();
      const outParts = json?.candidates?.[0]?.content?.parts ?? [];
      const img = outParts.find((p: any) => p.inline_data?.data || p.inlineData?.data);
      const data = img?.inline_data?.data ?? img?.inlineData?.data;
      const mime = img?.inline_data?.mime_type ?? img?.inlineData?.mimeType ?? "image/png";
      if (!data) {
        lastErr = `[${model}] no image part in response`;
        console.error("[gemini]", lastErr);
        continue;
      }
      return { ok: true, base64: data, mime, model };
    } catch (e) {
      lastErr = `[${model}] ${e instanceof Error ? e.message : String(e)}`;
      console.error("[gemini] fetch threw:", lastErr);
      continue;
    } finally {
      clearTimeout(t);
    }
  }

  return { ok: false, reason: "api_error", error: lastErr || "all models failed" };
}
