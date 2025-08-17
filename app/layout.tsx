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
  title: "Linasoul Art",
  description: "Abstract Acrylic Art by Selina Sickinger",
  generator: "v0.dev",
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
