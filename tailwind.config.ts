import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Modern neutral-premium palette (domain-agnostic). Token names kept
        // for compatibility with existing classNames; only the values changed.
        ivory: "#F8FAFC",   // app background (slate-50)
        cream: "#F1F5F9",   // subtle panel (slate-100)
        sand: "#E2E8F0",    // borders / dividers (slate-200)
        ink: "#0F172A",     // primary text (slate-900)
        muted: "#64748B",   // secondary text (slate-500)
        emerald: { DEFAULT: "#4F46E5", dark: "#3730A3", light: "#6366F1", mist: "#EEF0FF" }, // primary = indigo
        gold: { DEFAULT: "#F59E0B", light: "#FCD34D", dark: "#D97706" },                     // accent = amber
        rose: { DEFAULT: "#7C3AED", light: "#DDD6FE" },                                       // secondary = violet
        wine: "#312E81",
        diva: { rose: "#6366F1", gold: "#F59E0B", ink: "#0F172A", cream: "#F8FAFC" },
      },
      fontFamily: {
        display: ['"Space Grotesk"', "system-ui", "sans-serif"],
        body: ['"Inter"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        luxe: "0 10px 40px -12px rgba(36,27,46,0.18)",
        card: "0 6px 24px -10px rgba(36,27,46,0.16)",
        gold: "0 8px 30px -8px rgba(200,162,76,0.35)",
      },
      keyframes: {
        fadeUp: { "0%": { opacity: "0", transform: "translateY(18px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
        marquee: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        pop: { "0%": { transform: "scale(0.9)", opacity: "0" }, "100%": { transform: "scale(1)", opacity: "1" } },
        spinSlow: { to: { transform: "rotate(360deg)" } },
      },
      animation: {
        fadeUp: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) both",
        fadeIn: "fadeIn 0.8s ease both",
        float: "float 5s ease-in-out infinite",
        marquee: "marquee 24s linear infinite",
        shimmer: "shimmer 2.5s linear infinite",
        pop: "pop 0.35s cubic-bezier(0.16,1,0.3,1) both",
        spinSlow: "spinSlow 14s linear infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
