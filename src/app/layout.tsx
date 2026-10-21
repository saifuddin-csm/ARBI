import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import { DemoBanner } from "@/components/layout/DemoBanner";
import "@/styles/globals.css";

// Placeholder face until ARBI's brand fonts are chosen. When a separate display
// font arrives, load it here with variable "--font-display-face".
const bodyFace = Inter({ variable: "--font-body-face", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: { default: "ARBI", template: "%s | ARBI" },
  description: "ARBI clothing — online store preview.",
  // Preview build: keep the demo out of search engines until launch.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${bodyFace.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <DemoBanner />
        {children}
      </body>
    </html>
  );
}
