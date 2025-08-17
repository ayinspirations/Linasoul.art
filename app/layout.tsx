import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"

import { CartProvider } from "./cart/CartProvider"
import { Analytics } from "@vercel/analytics/react"

// deine Komponenten:
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  metadataBase: new URL("https://linasoul.art"),
  title: {
    default: "Linasoul Art – Acrylbilder & Acrylgemälde kaufen | Selina Sickinger",
    template: "%s | Linasoul Art",
  },
  description:
    "Entdecken Sie handgemalte Acrylbilder und Acrylgemälde von Selina Sickinger. Jedes Werk ist einzigartig – moderne Kunst auf Leinwand für Ihr Zuhause.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "https://linasoul.art",
    siteName: "Linasoul Art",
    title: "Acrylbilder & Acrylgemälde kaufen – Linasoul Art",
    description:
      "Abstrakte Acrylmalerei auf Leinwand: Originale Kunstwerke von Selina Sickinger direkt online kaufen.",
    images: [
      {
        url: "/images/og-linasoul.jpg", // Lege diese Datei unter /public/images/ ab (1200x630)
        width: 1200,
        height: 630,
        alt: "Abstraktes Acrylgemälde von Linasoul Art",
      },
    ],
    locale: "de_DE",
  },
  twitter: {
    card: "summary_large_image",
    title: "Acrylbilder & Acrylgemälde kaufen – Linasoul Art",
    description:
      "Originale Acrylgemälde auf Leinwand von Selina Sickinger – jetzt entdecken & kaufen.",
    images: ["/images/og-linasoul.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body className="flex min-h-screen flex-col">
        <CartProvider>
          <Navbar />
          {/* Abstand unter der fixen Navi */}
          <div className="h-16" />
          <div className="flex-grow">{children}</div>
          <Footer />
        </CartProvider>

        <Analytics />
      </body>
    </html>
  )
}
