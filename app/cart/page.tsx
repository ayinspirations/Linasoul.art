"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { ShoppingCart, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useCart } from "../cart/CartProvider"

function CartButton() {
  const { count } = useCart()
  return (
    <Link
      href="/cart"
      className="relative inline-flex items-center justify-center p-2 text-gray-800 hover:text-taupe-700 transition-colors"
      aria-label="Warenkorb"
    >
      <ShoppingCart className="h-6 w-6" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 rounded-full bg-black text-white text-xs flex items-center justify-center px-1">
          {count}
        </span>
      )}
    </Link>
  )
}

export default function CartPage() {
  // ACHTUNG: Diese Felder müssen zu deinem CartProvider passen!
  // -> totalCents statt total_cents; currency leiten wir vom ersten Item ab.
  const { items, remove, clear, totalCents } = useCart()

  const currency = (items[0]?.currency || "EUR").toUpperCase()
  const totalFmt = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency,
  }).format((totalCents || 0) / 100)

  // AGB/… nur anzeigen, wenn Items vorhanden sind
  const [agb, setAgb] = useState(false)
  const [widerruf, setWiderruf] = useState(false)
  const [versand, setVersand] = useState(false)
  const [busy, setBusy] = useState(false)

  // Mobile Drawer
  const [mobileOpen, setMobileOpen] = useState(false)

  async function checkout() {
    if (!agb || !widerruf || !versand) return
    setBusy(true)
    try {
      // NUR IDs senden – deine /api/checkout erwartet string[]
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: items.map(i => i.id) }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || "Checkout fehlgeschlagen")
      window.location.href = json.url
    } catch (e) {
      alert((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-taupe-50 via-white to-blue-50">
      {/* NAVIGATION – identisch zum Onepager + Mobile Button */}
      <nav className="fixed top-0 z-50 w-full border-b border-taupe-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex h-16 items-center mt-5">
              <Link href="/" className="inline-flex h-16 items-center">
                <Image
                  src="/images/Logo_schwarz_2.png"
                  alt="Linasoul Logo"
                  width={120}
                  height={40}
                  priority
                  className="block"
                />
              </Link>
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-4">
              <Link href="/#about" className="text-gray-600 transition-colors hover:text-taupe-400">Künstler</Link>
              <Link href="/#gallery" className="text-gray-600 transition-colors hover:text-taupe-400">Galerie</Link>
              <Link href="/#contact" className="text-gray-600 transition-colors hover:text-taupe-400">Kontakt</Link>
              <CartButton />
            </div>

            {/* Mobile: Cart + Burger */}
            <div className="md:hidden flex items-center gap-2">
              <CartButton />
              <button
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen(v => !v)}
                className="inline-flex items-center justify-center p-2 text-gray-800 hover:text-taupe-700 transition-colors"
              >
                {mobileOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={() => setMobileOpen(false)}>
          <div
            className="w-64 bg-white/90 backdrop-blur-md rounded-l-2xl shadow-lg p-6 mt-16 mb-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="space-y-4">
              <Link href="/#about" className="block text-lg text-gray-800 hover:text-taupe-600" onClick={() => setMobileOpen(false)}>Künstler</Link>
              <Link href="/#gallery" className="block text-lg text-gray-800 hover:text-taupe-600" onClick={() => setMobileOpen(false)}>Galerie</Link>
              <Link href="/#contact" className="block text-lg text-gray-800 hover:text-taupe-600" onClick={() => setMobileOpen(false)}>Kontakt</Link>
            </nav>
          </div>
        </div>
      )}

      {/* CONTENT */}
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <h1 className="mb-8 text-3xl font-light text-gray-900">Warenkorb</h1>

        <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
          {/* ITEMS-KARTE */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              {items.length === 0 ? (
                <div className="text-gray-600">
                  <p className="mb-2">Dein Warenkorb ist leer.</p>
                  <p className="mb-4">Zwischensumme: <strong>0,00 €</strong></p>
                  <Link href="/#gallery" className="underline">Zur Galerie</Link>
                </div>
              ) : (
                <ul className="divide-y">
                  {items.map((it) => (
                    <li key={it.id} className="py-4 flex items-center gap-4">
                      <div className="h-20 w-16 overflow-hidden rounded bg-gray-100 flex items-center justify-center">
                        {it.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={it.image} alt={it.title} className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-xs text-gray-400">Kein Bild</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-900">{it.title}</p>
                        <p className="text-sm text-gray-500">
                          {new Intl.NumberFormat("de-DE", { style: "currency", currency: (it.currency || "EUR").toUpperCase() }).format((it.price_cents || 0) / 100)}
                        </p>
                      </div>
                      <button
                        className="rounded-full p-1 hover:bg-gray-100"
                        aria-label="Entfernen"
                        onClick={() => remove(it.id)}
                      >
                        <X className="h-5 w-5 text-gray-600" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* SUMMARY-KARTE */}
          <div className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between text-gray-800">
                  <span>Zwischensumme</span>
                  <span className="font-medium">{totalFmt}</span>
                </div>

                {items.length > 0 && (
                  <div className="space-y-2 text-sm text-gray-700">
                    <label className="flex items-start gap-2">
                      <input type="checkbox" checked={agb} onChange={() => setAgb(v => !v)} className="mt-1" />
                      <span>AGB akzeptieren</span>
                    </label>
                    <label className="flex items-start gap-2">
                      <input type="checkbox" checked={widerruf} onChange={() => setWiderruf(v => !v)} className="mt-1" />
                      <span>Widerrufsbelehrung gelesen</span>
                    </label>
                    <label className="flex items-start gap-2">
                      <input type="checkbox" checked={versand} onChange={() => setVersand(v => !v)} className="mt-1" />
                      <span>Versand-/Lieferbedingungen akzeptieren</span>
                    </label>
                  </div>
                )}

                <Button
                  className="w-full bg-[#f9f5ec] text-gray-800 hover:bg-[#f2e8dc]"
                  onClick={checkout}
                  disabled={items.length === 0 || !agb || !widerruf || !versand || busy}
                >
                  {busy ? "Weiter zur Kasse …" : "Zur Kasse"}
                </Button>

                {items.length > 0 && (
                  <button
                    type="button"
                    className="w-full text-sm underline text-gray-600 hover:text-gray-800"
                    onClick={clear}
                  >
                    Warenkorb leeren
                  </button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer wie Startseite */}
      <footer className="bg-gray-800 py-12 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center items-center h-16">
              <Link href="/" className="inline-flex items-center">
                <Image src="/images/Logo_weiss_2.png" alt="Linasoul Logo" width={120} height={40} priority className="block" />
              </Link>
            </div>
            <p className="mb-4 text-gray-400">Abstract Acrylic Artist • Creating art that touches the soul</p>
            <p className="text-sm text-gray-500">© 2025 Linasoul.art</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
