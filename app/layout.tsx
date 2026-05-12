import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import Script from "next/script";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-dm-sans",
  display: "swap",
});

const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: "Verso",
  description: "Vanhojen tietokoneiden uusiokäyttö — SSD, RAM, Linux.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fi" className={`${dmSans.variable} scroll-smooth`}>
      <body className="min-h-screen font-sans antialiased text-lg text-gray-900">
        {children}
        {plausibleDomain ? (
          <Script
            src="https://plausible.io/js/script.js"
            data-domain={plausibleDomain}
            strategy="lazyOnload"
          />
        ) : null}
      </body>
    </html>
  );
}
