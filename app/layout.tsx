import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@/components/Analytics";
import { ToastProvider } from "@/components/ui/Toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LangController } from "@/components/i18n/LangController";
import { HomeButton } from "@/components/HomeButton";

export const metadata: Metadata = {
  title: { default: "Newvora — Online Store & Business Console", template: "%s | Newvora" },
  description: "A complete storefront + back-office in one system — catalogue, cart, checkout, POS, invoicing, inventory and an AI assistant. Retail & wholesale ready.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* progressive-enhancement flag for scroll reveal + no-flash theme init (default light) */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js');try{if(localStorage.theme==='dark')document.documentElement.classList.add('dark')}catch(e){}" }} />
        <Analytics />
      </head>
      <body><ToastProvider>{children}<ThemeToggle /><LangController /><HomeButton /></ToastProvider></body>
    </html>
  );
}
