// app/layout.tsx
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import Script from "next/script"
import "./globals.css"

import { CartProvider } from "./cart/CartProvider"
import { Analytics } from "@vercel/analytics/react"

// deine Komponenten:
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

const siteUrl = "https://linasoul.art"
const ogImage = "/images/og-linasoul.jpg"
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
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
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
        url: ogImage, // /public/images/og-linasoul.jpg
        width: 1200,
        height: 630,
        alt: "Abstraktes Acrylgemälde von Linasoul Art",
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
    index: process.env.NEXT_PUBLIC_NOINDEX ? false : true,
    follow: process.env.NEXT_PUBLIC_NOINDEX ? false : true,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  // Optional: wenn du GSC-Verifizierung hast, hier eintragen
  // verification: { google: "GSC_VERIFICATION_TOKEN" },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        {/* Preload OG image (hilft leicht bei Social/OpenGraph und FCP) */}
        <link rel="preload" as="image" href={ogImage} />
      </head>
      <body className="flex min-h-screen flex-col">
        <CartProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:bg-white focus:px-3 focus:py-2 focus:ring"
          >
            Zum Inhalt springen
          </a>
          <Navbar />
          {/* Abstand unter der fixen Navi */}
          <div className="h-16" />
          <main id="main" className="flex-grow">
            {children}
          </main>
          <Footer />
        </CartProvider>

        <Analytics />

        {/* JSON-LD: Person (Künstlerin) */}
        <Script id="ld-person" type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: personName,
              alternateName: "Lina",
              jobTitle: "Künstlerin",
              url: siteUrl,
              // sameAs: ["https://www.instagram.com/DEIN_INSTAGRAM"], // optional
              knowsAbout: ["Abstrakte Acrylmalerei", "Moderne Kunst", "Leinwandbilder"],
            }),
          }}
        />
        {/* JSON-LD: WebSite mit SearchAction */}
        <Script id="ld-website" type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: siteName,
              url: siteUrl,
              potentialAction: {
                "@type": "SearchAction",
                target: `${siteUrl}/search?q={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </body>
    </html>
  )
}
