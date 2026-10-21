import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import { CartDrawer } from "@/components/cart/CartDrawer";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { LazySearchDrawer } from "@/components/layout/LazySearchDrawer";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { getNavigation, getSite } from "@/lib/api";
import { siteUrl } from "@/lib/utils/seo";
import { StoreHydrator } from "@/store/StoreHydrator";
import "@/styles/globals.css";

// Placeholder face until ARBI's brand fonts are chosen. When a separate display
// font arrives, load it here with variable "--font-display-face".
// display: optional — first visits on slow connections keep the fallback (no late swap,
// which protects LCP); Inter is used once cached.
const bodyFace = Inter({ variable: "--font-body-face", subsets: ["latin"], display: "optional" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl("/")),
  title: { default: "ARBI — Everyday clothing for a warm climate", template: "%s | ARBI" },
  description:
    "ARBI makes considered everyday clothing — linen shirts, cotton tees, dresses and more. Delivery across Bangladesh, cash on delivery available.",
  // Preview build: keep the demo out of search engines until launch.
  robots: { index: false, follow: false },
  openGraph: {
    type: "website",
    siteName: "ARBI",
    images: [{ url: siteUrl("/brand/arbi-logo.png"), width: 816, height: 497, alt: "ARBI" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [navigation, site] = await Promise.all([getNavigation(), getSite()]);
  return (
    <html lang="en" className={`${bodyFace.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only z-[100] bg-text px-4 py-3 label-caps text-xs text-bg focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
        >
          Skip to content
        </a>
        {site.announcement && (
          <AnnouncementBar id={site.announcement.id} messages={site.announcement.messages} />
        )}
        <SiteHeader navigation={navigation} socials={site.socials} />
        <main id="main" tabIndex={-1} className="flex flex-1 flex-col outline-none">
          {children}
        </main>
        <SiteFooter navigation={navigation} site={site} />
        <CartDrawer freeShippingThreshold={site.freeShippingThreshold} />
        <LazySearchDrawer />
        <StoreHydrator />
      </body>
    </html>
  );
}
