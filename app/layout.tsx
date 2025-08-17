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
  title: "Linasoul Art – Acrylbilder & Acrylgemälde kaufen | Selina Sickinger",
  description: "Entdecken Sie handgemalte Acrylbilder und Acrylgemälde von Selina Sickinger. Jedes Werk ist einzigartig – moderne Kunst auf Leinwand für Ihr Zuhause.",
},
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "https://linasoul.art",
    title: "Acrylbilder & Acrylgemälde kaufen – Linasoul Art",
    description:
      "Abstrakte Acrylmalerei auf Leinwand: Originale Kunstwerke von Selina Sickinger direkt online kaufen.",
    siteName: "Linasoul Art",
    images: ["/images/og-linasoul.jpg"], // Lege diese Datei unter /public/images/ an
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
          {/* NAVBAR */}
          <Navbar />
          {/* Abstand unter der fixen Navi */}
          <div className="h-16" />

          {/* MAIN CONTENT */}
          <div className="flex-grow">{children}</div>

          {/* FOOTER */}
          <Footer />
        </CartProvider>

        {/* VERZEL ANALYTICS */}
        <Analytics />
      </body>
    </html>
  )
}
