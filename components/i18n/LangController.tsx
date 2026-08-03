"use client";
import { useEffect, useState } from "react";
import { HI } from "@/lib/i18n/dict";

/**
 * Whole-site Hindi/English toggle.
 * Floating switch (next to the theme button). When Hindi is on, a lightweight
 * translator swaps known interface strings (whole text nodes + common attributes)
 * into Hindi and keeps them translated as pages/route content change — while leaving
 * product names, SKUs, prices and any unknown text exactly as-is. Choice is remembered
 * per device. English is a clean restore (originals are stashed, never guessed back).
 */

const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA", "CODE", "SVG", "PATH"]);
const ATTRS = ["placeholder", "title", "aria-label"];

// Module-level stores survive re-renders so we can restore the exact originals.
const textOrig = new Map<Text, string>();
const attrOrig = new Map<Element, Record<string, string>>();

function shouldSkip(el: Element | null): boolean {
  for (let n = el; n; n = n.parentElement) {
    if (SKIP_TAGS.has(n.tagName)) return true;
    if (n.getAttribute && n.getAttribute("data-noi18n") != null) return true;
    const cls = n.className;
    if (typeof cls === "string" && /\b(bc-sku|font-mono|barcode-label)\b/.test(cls)) return true;
  }
  return false;
}

function translateText(node: Text) {
  const raw = node.nodeValue ?? "";
  const key = raw.trim();
  if (!key || !(key in HI)) return;
  if (shouldSkip(node.parentElement)) return;
  if (!textOrig.has(node)) textOrig.set(node, raw);
  node.nodeValue = raw.replace(key, HI[key]);
}

function translateTree(root: Node) {
  // A directly-inserted text node won't be walked (walker yields descendants only).
  if (root.nodeType === Node.TEXT_NODE) { translateText(root as Text); return; }
  // Text nodes
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  let cur = walker.nextNode();
  while (cur) { nodes.push(cur as Text); cur = walker.nextNode(); }
  for (const node of nodes) {
    const raw = node.nodeValue ?? "";
    const key = raw.trim();
    if (!key || !(key in HI)) continue;
    if (shouldSkip(node.parentElement)) continue;
    if (!textOrig.has(node)) textOrig.set(node, raw);
    node.nodeValue = raw.replace(key, HI[key]);
  }
  // Attributes on element subtree (including root if element)
  const els: Element[] = [];
  if (root instanceof Element) els.push(root);
  if (root instanceof Element || root instanceof Document || root instanceof DocumentFragment) {
    (root as Element).querySelectorAll?.("*").forEach((e) => els.push(e));
  }
  for (const el of els) {
    if (shouldSkip(el)) continue;
    for (const a of ATTRS) {
      const v = el.getAttribute(a);
      if (!v) continue;
      const key = v.trim();
      if (!(key in HI)) continue;
      const store = attrOrig.get(el) ?? {};
      if (store[a] == null) { store[a] = v; attrOrig.set(el, store); }
      el.setAttribute(a, HI[key]);
    }
  }
}

function restoreAll() {
  textOrig.forEach((val, node) => { try { node.nodeValue = val; } catch {} });
  textOrig.clear();
  attrOrig.forEach((attrs, el) => {
    for (const a in attrs) { try { el.setAttribute(a, attrs[a]); } catch {} }
  });
  attrOrig.clear();
}

export function LangController() {
  const [hi, setHi] = useState(false);

  // Apply / restore whenever the language changes, and observe DOM changes while Hindi.
  useEffect(() => {
    document.documentElement.lang = hi ? "hi" : "en";
    let obs: MutationObserver | null = null;
    if (hi) {
      translateTree(document.body);
      obs = new MutationObserver((muts) => {
        obs!.disconnect();
        for (const m of muts) {
          if (m.type === "characterData" && m.target) translateTree(m.target.parentNode ?? m.target);
          m.addedNodes.forEach((n) => translateTree(n));
        }
        obs!.observe(document.body, { childList: true, subtree: true, characterData: true });
      });
      obs.observe(document.body, { childList: true, subtree: true, characterData: true });
    } else {
      restoreAll();
    }
    return () => obs?.disconnect();
  }, [hi]);

  // Initial choice.
  useEffect(() => {
    try { setHi(localStorage.lang === "hi"); } catch {}
  }, []);

  const toggle = () => {
    const next = !hi;
    setHi(next);
    try { localStorage.lang = next ? "hi" : "en"; } catch {}
    document.cookie = `lang=${next ? "hi" : "en"};path=/;max-age=31536000`;
  };

  return (
    <button
      onClick={toggle}
      aria-label={hi ? "Switch to English" : "हिंदी में देखें"}
      title={hi ? "English" : "हिंदी"}
      className="no-print fixed bottom-5 left-[4.5rem] z-[57] h-11 px-3 rounded-full grid place-items-center bg-surface text-ink border border-sand shadow-luxe hover:border-emerald hover:text-emerald transition-colors text-sm font-semibold"
    >
      {hi ? "EN" : "हिं"}
    </button>
  );
}
