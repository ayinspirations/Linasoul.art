import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"

import { CartProvider } from "./cart/CartProvider"
import { Analytics } from "@vercel/analytics/react"

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
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
          <div className="flex-grow">{children}</div>

          {/* Globaler Footer (blau + Logo) */}
          <footer className="bg-[#1f2a37] text-white">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 text-center">
              <div className="flex justify-center items-center h-16 mb-4">
                {/* Weißes Logo auf dunklem Blau */}
                <img
                  src="/images/Logo_weiss_2.png"
                  alt="Linasoul Logo"
                  width={120}
                  height={40}
                />
              </div>

              <p className="text-white/80">
                Abstract Acrylic Artist • Creating art that touches the soul
              </p>

              <p className="mt-2 text-white/60">
                © {new Date().getFullYear()} Linasoul.art · Selina Sickinger
              </p>

              <p className="mt-4 space-x-4 text-sm">
                <a href="/agb" className="underline hover:text-white">AGB</a>
                <a href="/widerruf" className="underline hover:text-white">Widerruf</a>
                <a href="/impressum" className="underline hover:text-white">Impressum</a>
                <a href="/datenschutz" className="underline hover:text-white">Datenschutz</a>
              </p>
            </div>
          </footer>
        </CartProvider>

        <Analytics />
      </body>
    </html>
  )
}
