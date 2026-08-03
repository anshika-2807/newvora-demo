import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Tokens are CSS variables (space-separated RGB) so a single `.dark` class
        // on <html> flips the whole app. Values live in app/globals.css (:root + .dark).
        // Token names kept for compatibility with existing classNames.
        ivory: "rgb(var(--c-ivory) / <alpha-value>)",     // app background
        cream: "rgb(var(--c-cream) / <alpha-value>)",     // subtle panel
        sand: "rgb(var(--c-sand) / <alpha-value>)",       // borders / dividers
        surface: "rgb(var(--c-surface) / <alpha-value>)", // cards (replaces bg-white)
        ink: "rgb(var(--c-ink) / <alpha-value>)",         // primary text
        muted: "rgb(var(--c-muted) / <alpha-value>)",     // secondary text
        emerald: {
          DEFAULT: "rgb(var(--c-primary) / <alpha-value>)",
          dark: "rgb(var(--c-primary-dark) / <alpha-value>)",
          light: "rgb(var(--c-primary-light) / <alpha-value>)",
          mist: "rgb(var(--c-primary-mist) / <alpha-value>)",
        },
        gold: {
          DEFAULT: "rgb(var(--c-gold) / <alpha-value>)",
          light: "rgb(var(--c-gold-light) / <alpha-value>)",
          dark: "rgb(var(--c-gold-dark) / <alpha-value>)",
        },
        rose: {
          DEFAULT: "rgb(var(--c-rose) / <alpha-value>)",
          light: "rgb(var(--c-rose-light) / <alpha-value>)",
        },
        wine: "rgb(var(--c-wine) / <alpha-value>)",
        diva: {
          rose: "rgb(var(--c-primary) / <alpha-value>)",
          gold: "rgb(var(--c-gold) / <alpha-value>)",
          ink: "rgb(var(--c-ink) / <alpha-value>)",
          cream: "rgb(var(--c-ivory) / <alpha-value>)",
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', "system-ui", "sans-serif"],
        body: ['"DM Sans"', "system-ui", "sans-serif"],
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
