# Newvora Demo — UI Redesign Prompt (for Claude / design tool)

Paste everything below the line into Claude (or your design tool) as the brief. It is written to
rework the UI of the Newvora demo store + owner console so it feels like **newvora.in** and is
usable by someone with **near-zero tech knowledge**.

---

## Role & goal

You are a senior product designer + front-end engineer. Rework the **entire UI** of an existing
Next.js 14 + Tailwind e-commerce + business-console app (a demo we share with prospective clients).
Keep every feature and route working — this is a **restyle and navigation overhaul only**, not a
rewrite of logic. The result must feel calm, modern, trustworthy, and be effortless for a
**non-technical shop owner** to navigate on a phone.

## North star: newvora.in

Match the look and feel of **https://newvora.in**. Open it and sample it directly. Its signatures:

- **Calm, minimal, lots of whitespace.** Nothing is loud or cluttered. Confidence through restraint.
- **Lowercase `newvora` wordmark**, understated.
- **Small uppercase "eyebrow" labels** (e.g. `what we build`, `how we work`) sitting above **large,
  plain-English headlines** ("Software, built around your business.").
- **Human, plain language** everywhere — no jargon, no marketing fluff.
- **Numbered process steps** (01 · Understand, 02 · Scope, 03 · Build), device/phone mockups, and
  **WhatsApp-first** primary actions.
- A **restrained palette** — near-neutral base with one confident accent; sample the exact colours,
  fonts, radii and spacing from the live site and reuse them.

If the live palette can't be sampled, use: near-white/paper base, near-black ink text, one warm
accent, generous spacing, a clean geometric-sans for headings + a highly legible sans for body.

## THE #1 RULE — ruthless ease of use (a non-technical person must never feel lost)

Design for someone who has never used admin software and is nervous about "breaking something."

- **One obvious primary action per screen.** Make it big, high-contrast, and labelled with a plain
  verb ("Add a product", "Place order", "Mark delivered"). Everything secondary is visually quieter.
- **Big tap targets** (min 44×44px), large readable text (16px+ body, bigger on mobile), high contrast.
- **Plain labels, not jargon.** "Coupons", not "Vouchers/Promo engine". "Website Orders", not "Fulfilment queue".
- **Always show where you are and how to get back.** Breadcrumbs, a persistent simple top/side nav,
  and a "Back" link on every sub-page.
- **Explain each screen in one friendly sentence** at the top ("This is where you add what you sell.").
- **Confirm destructive actions** with a clear in-app modal (never a raw browser popup) that says
  exactly what will happen.
- **Empty states teach.** When a list is empty, show a friendly line + the one button to fix it
  ("No products yet — Add your first product").
- **Progress + feedback.** Toasts on every save ("Saved ✓"), clear loading states, obvious success.
- **Reduce choices.** Group the admin nav into a few labelled sections; collapse rarely-used items.
- **Mobile-first.** Most of these users are on a phone. Sticky bottom action bars, thumb-reachable
  primary buttons, no tiny horizontal-scroll tables (use stacked cards on mobile).

## What to restyle (keep routes & functionality identical)

**Storefront (customer side):** home/landing (`/`), shop home (`/shop`), category pages
(`/shop/c/[slug]`), product page, cart, checkout (with the coupon field), order confirmation +
live status timeline (`/order/[id]`), wishlist, and the trust/info pages (about, contact, shipping,
returns, FAQ, product guide).

**Owner console (admin side):** the left nav + every page — dashboard, add inventory, catalogue,
categories, **pricing formula**, inventory, billing/POS, sales, **website orders** (fulfilment board),
returns, purchases, customers, suppliers, reviews, **coupons**, roles, notifications, and the DIVA
assistant widget. Keep the **privacy-shield** "Hide figures" toggle.

## Design tokens (direction)

- **Colour:** sample from newvora.in. Provide a small token set — `bg`, `surface`, `border`, `ink`
  (text), `muted`, one `primary` accent (for primary buttons/links), one subtle `accent-2`, plus
  `success`/`warn`/`danger`. Keep it calm; the accent should feel intentional, used sparingly.
- **Type:** a clean geometric or humanist sans for display headings, a highly legible sans for body.
  Establish a clear scale (e.g. 12 / 14 / 16 / 20 / 28 / 40 / 56). Headings tight, body relaxed
  line-height (~1.6).
- **Spacing & shape:** generous, consistent spacing scale; medium-large corner radii (12–20px);
  soft, low shadows (no harsh borders). Airy layouts, clear section rhythm.
- **Motion:** subtle and reassuring — gentle fade/slide-up on scroll, 150–250ms ease transitions,
  a soft press state on buttons. Nothing flashy or distracting.

## Navigation model

- **Storefront:** simple sticky header (logo, Shop, a big search, cart, account). Clear category
  chips. A sticky "Add to cart" bar on mobile product pages. Footer with the info pages.
- **Admin:** a simple labelled left sidebar grouped into a few sections (e.g. *Sell*, *Catalogue*,
  *Money*, *Customers*, *Settings*), each item with a plain label + simple icon. On mobile, a
  hamburger that opens the same grouped list. Highlight the current page clearly.

## Component specs

- **Buttons:** primary (filled accent, large), secondary (outline), quiet (text). Rounded-full or
  soft-rounded, obvious hover/press, disabled state.
- **Cards:** soft surface, subtle shadow, clear title + one-line helper.
- **Forms:** big inputs, visible labels above fields (never placeholder-only), inline validation
  with friendly messages, one primary submit.
- **Tables → cards on mobile.** On desktop keep clean rows with generous padding; on mobile stack
  each row as a card so nothing needs horizontal scrolling.
- **Status:** pills/badges with plain words + colour (New, Packed, Shipped, Delivered).
- **Empty states, toasts, and a consistent confirm-modal** as described above.

## Technical constraints (important — so nothing breaks)

- Stack is **Next.js 14 (App Router) + Tailwind CSS**. Server components + server actions. Do not
  add heavy UI libraries; stay close to Tailwind + small components.
- **Restyle via the existing Tailwind design tokens**, don't rename them. The theme is defined in
  `tailwind.config.ts` and `app/globals.css` with these token names already used across every
  component: `ivory, cream, sand, ink, muted, emerald (primary), gold (accent), rose, wine`, plus a
  `diva.*` set, and fonts `display` + `body`. **Change the token VALUES (hex + fonts), not the class
  names**, so the whole app re-skins without editing hundreds of files. Only touch individual
  components for layout/spacing/hierarchy improvements.
- **Do not change** database columns, server actions, RPC names, routes, or business logic.
- Keep everything **accessible** (WCAG AA contrast, focus states, semantic HTML, alt text) and
  **fast** (no layout shift, lazy images).
- Money stays in the existing `formatPaise` format. Product images may be absent — keep the elegant
  gradient placeholder pattern.

## Deliverables

1. Updated `tailwind.config.ts` (token values) + `app/globals.css` (base styles, buttons, motion).
2. Restyled shared components first (header, footer, nav, buttons, cards, forms, product card,
   admin nav) so the change propagates.
3. Then page-level polish for the key flows: **shop → product → cart → checkout → order tracking**,
   and **admin dashboard → add product → website orders → coupons**.
4. A short before/after note per screen and a 6–8 colour + type token summary.

## Acceptance criteria

- A non-technical person can, without help: find a product, add to cart, apply a coupon, check out,
  and track the order; and as owner, add a product, create a coupon, and move an order from New →
  Delivered — each in a few obvious taps.
- It visibly reads as **Newvora** (matches newvora.in's calm, minimal, human feel).
- No feature or route is broken; the diff is mostly tokens + shared components + spacing/hierarchy.
