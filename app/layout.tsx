// app/layout.tsx
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import Script from "next/script"
import "./globals.css"

import { CartProvider } from "./cart/CartProvider"
import { Analytics } from "@vercel/analytics/react"

// Komponenten
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

const siteUrl = "https://linasoul.art"
// WICHTIG: benutze ein EXISTIERENDES Bild aus /public/images
// (og-linasoul.jpg existiert aktuell nicht -> 404 + Warnung)
const ogImage = "/images/Logo.png"
const siteName = "Linasoul Art"
const personName = "Selina Sickinger"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Linasoul Art – Abstrakte Acrylbilder & Acrylgemälde kaufen",
    template: "%s | Linasoul Art",
  },
  description:
    "Entdecke abstrakte Acrylbilder von Selina Sickinger – moderne, emotionale Acrylgemälde auf Leinwand. Originale & hochwertige Prints direkt online kaufen.",
  alternates: { canonical: "/" },
  viewport: { width: "device-width", initialScale: 1, maximumScale: 5 },
  themeColor: "#dfd6ce",
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName,
    title: "Abstrakte Acrylbilder & Acrylgemälde kaufen – Linasoul Art",
    description:
      "Moderne abstrakte Acrylmalerei: Originale Kunstwerke von Selina Sickinger auf Leinwand.",
    images: [
      {
        url: ogImage, // existierend
        width: 1200,
        height: 630,
        alt: "Linasoul Art – abstrakte Acrylmalerei",
      },
    ],
    locale: "de_DE",
  },
  twitter: {
    card: "summary_large_image",
    title: "Abstrakte Acrylbilder & Acrylgemälde – Linasoul Art",
    description:
      "Originale abstrakte Acrylgemälde von Selina Sickinger – jetzt entdecken & kaufen.",
    images: [ogImage],
  },
  robots: {
    // falls du PREVIEW-Deployments mit noindex willst, env setzen: NEXT_PUBLIC_NOINDEX=1
    index: process.env.NEXT_PUBLIC_NOINDEX ? false : true,
    follow: process.env.NEXT_PUBLIC_NOINDEX ? false : true,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  // Optional: Google Search Console
  // verification: { google: "GSC_VERIFICATION_TOKEN" },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      {/* <head> weglassen oder leer lassen – KEIN Preload für OG-Bild */}
      <body className="flex min-h-screen flex-col">
        <CartProvider>
          {/* Skip-Link für Accessibility */}
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:bg-white focus:px-3 focus:py-2 focus:ring"
          >
            Zum Inhalt springen
          </a>

          <Navbar />
          {/* Abstand unter fixer Navi */}
          <div className="h-16" />

          <main id="main" className="flex-grow">
            {children}
          </main>

          <Footer />
        </CartProvider>

        <Analytics />

        {/* JSON-LD: Person (Künstlerin) */}
        <Script
          id="ld-person"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: personName,
              alternateName: "Lina",
              jobTitle: "Künstlerin",
              url: siteUrl,
              knowsAbout: ["Abstrakte Acrylmalerei", "Moderne Kunst", "Leinwandbilder"],
              // sameAs: ["https://www.instagram.com/DEIN_INSTAGRAM"] // optional ergänzen
            }),
          }}
        />

        {/* JSON-LD: WebSite (Suchaktion als Google Site-Search, keine /search-Route nötig) */}
        <Script
          id="ld-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: siteName,
              url: siteUrl,
              potentialAction: {
                "@type": "SearchAction",
                target:
                  "https://www.google.com/search?q=site:linasoul.art+{search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </body>
    </html>
  )
}
