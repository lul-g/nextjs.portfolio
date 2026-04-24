import type { Metadata } from "next";
import { Instrument_Serif, Outfit } from "next/font/google";
import "@fontsource/bluu-next";
import "@fontsource/dm-mono/400.css";
import "@fontsource/dm-mono/500.css";
import { Providers } from "@/components/providers";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

/*
  Site-wide font stack — only four families allowed:
    1. Outfit            → all paragraph / body copy           (--font-outfit)
    2. Instrument Serif  → section titles + emphasis words     (--font-instrument-serif)
    3. DM Mono ("Core Mono") → eyebrows, badges, dates, links  (--font-coremono, self-hosted)
    4. Bluu Next         → curated-work project titles only    (--font-bluu, self-hosted)
*/

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Lulseged Admasu — Developer, Freelancer & Problem Solver",
    template: "%s — Lulseged Admasu",
  },
  description:
    "Full-stack developer crafting digital products that ship — from the first spark of an idea to a polished release.",
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${outfit.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="bg-canvas min-h-full font-sans text-foreground">
        <Providers>
          <SiteHeader />
          <main className="relative z-0">{children}</main>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
