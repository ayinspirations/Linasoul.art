import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"

// Cart (global!)
import { CartProvider } from "./cart/CartProvider"

// Vercel Web Analytics
import { Analytics } from "@vercel/analytics/react"

export const metadata: Metadata = {
  title: "Linasoul.art – Original Kunstwerke von Selina Sickinger",
  description: "Online-Shop für Kunstwerke von Selina Sickinger. Kaufen Sie Originale direkt von der Künstlerin.",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
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
          {/* Seiteninhalt */}
          <div className="flex-grow">{children}</div>

          {/* Footer */}
          <footer className="mt-12 border-t border-gray-200 bg-gray-50 py-6 text-center text-sm text-gray-600">
            <p>© {new Date().getFullYear()} Linasoul.art · Selina Sickinger</p>
            <p className="mt-2 space-x-4">
              <a href="/agb" className="underline hover:text-gray-900">AGB</a>
              <a href="/widerruf" className="underline hover:text-gray-900">Widerruf</a>
              <a href="/impressum" className="underline hover:text-gray-900">Impressum</a>
              <a href="/datenschutz" className="underline hover:text-gray-900">Datenschutz</a>
            </p>
          </footer>
        </CartProvider>

        {/* Vercel Analytics */}
        <Analytics />
      </body>
    </html>
  )
}
