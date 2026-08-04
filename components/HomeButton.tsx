"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";

/** Floating "Home" button — always available to jump back to the demo landing page (/).
 *  Hidden when you're already on the home page. Sits with the theme + language switches. */
export function HomeButton() {
  const path = usePathname();
  if (path === "/") return null;
  return (
    <Link
      href="/"
      aria-label="Go to home page"
      title="Home"
      className="no-print fixed bottom-5 left-[7.75rem] z-[57] h-11 pl-3 pr-4 rounded-full inline-flex items-center gap-1.5 bg-surface text-ink border border-sand shadow-luxe hover:border-emerald hover:text-emerald transition-colors text-sm font-semibold"
    >
      <Icon name="home" className="w-4 h-4" />Home
    </Link>
  );
}
