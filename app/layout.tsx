import type { Metadata, Viewport } from "next";
import { Instrument_Serif } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { ScrollbarWidth } from "@/components/layout/scrollbar-width";
import { SmoothScroll } from "@/components/layout/smooth-scroll";
import { siteMeta } from "@/content/landing";
import "@/styles/globals.css";

/**
 * Three families, all freely licensed: Geist Sans for body copy, Geist Mono for
 * eyebrows and labels, Instrument Serif for the oversized display headlines.
 * Swap any of them here — the rest of the page reads `--font-sans`,
 * `--font-mono` and `--font-serif`, never a family name directly.
 */
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
});

/**
 * `metadataBase` resolves every relative URL below (OG image, canonical) into an
 * absolute one. It is not optional — a relative URL in a metadata field without
 * it is a build error, not a warning.
 *
 * The OG and icon images themselves come from the file conventions next to this
 * file (`opengraph-image.tsx`, `icon.svg`, `apple-icon.tsx`); Next wires those
 * up automatically, so they aren't listed here.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteMeta.url),
  title: {
    default: siteMeta.title,
    template: siteMeta.titleTemplate,
  },
  description: siteMeta.description,
  applicationName: siteMeta.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: siteMeta.name,
    title: siteMeta.title,
    description: siteMeta.description,
    url: "/",
    locale: siteMeta.locale,
  },
  twitter: {
    card: "summary_large_image",
    title: siteMeta.title,
    description: siteMeta.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

/**
 * Separate export by requirement — `themeColor`, `colorScheme` and `viewport`
 * have been deprecated inside `metadata` since Next 14 and are silently ignored
 * there. Value tracks `--color-surface` in styles/globals.css.
 */
export const viewport: Viewport = {
  themeColor: "#f5f5f4",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${instrumentSerif.variable} antialiased`}
    >
      <body>
        <ScrollbarWidth />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
