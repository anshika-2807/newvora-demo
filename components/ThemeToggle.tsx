"use client";
import { useEffect, useState } from "react";

/** Floating light/dark switch. Adds/removes `.dark` on <html> and remembers the
 *  choice per device. A no-flash init script in the root layout applies it before paint. */
export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try { localStorage.theme = next ? "dark" : "light"; } catch { /* private mode */ }
    setDark(next);
  };

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Light mode" : "Dark mode"}
      className="no-print fixed bottom-5 left-5 z-[57] h-11 w-11 rounded-full grid place-items-center bg-surface text-ink border border-sand shadow-luxe hover:border-emerald hover:text-emerald transition-colors"
    >
      <span className="text-lg leading-none">{dark ? "☀️" : "🌙"}</span>
    </button>
  );
}
