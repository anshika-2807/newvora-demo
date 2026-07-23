import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@/components/Analytics";
import { ToastProvider } from "@/components/ui/Toast";

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
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* progressive-enhancement flag for scroll reveal */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <Analytics />
      </head>
      <body><ToastProvider>{children}</ToastProvider></body>
    </html>
  );
}
