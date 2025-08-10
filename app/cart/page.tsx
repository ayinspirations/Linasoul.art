"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Mail, MapPin, ShoppingCart, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useCart } from "../cart/CartProvider"

function CartNav() {
  const { count } = useCart()
  return (
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

          <div className="hidden md:flex items-center gap-4">
            <Link href="/#about" className="text-gray-600 transition-colors hover:text-taupe-400">Künstler</Link>
            <Link href="/#gallery" className="text-gray-600 transition-colors hover:text-taupe-400">Galerie</Link>
            <Link href="/#purchase" className="text-gray-600 transition-colors hover:text-taupe-400">Kaufen</Link>
            <Link href="/#contact" className="text-gray-600 transition-colors hover:text-taupe-400">Kontakt</Link>
            <Link href="/cart" className="relative inline-flex items-center justify-center p-2 text-gray-800 hover:text-taupe-700 transition-colors" aria-label="Warenkorb">
              <ShoppingCart className="h-6 w-6" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 rounded-full bg-black text-white text-xs flex items-center justify-center px-1">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default function CartPage() {
  const { items, remove, clear, total_cents, currency } = useCart()
  const [agb, setAgb] = useState(false)
  const [widerruf, setWiderruf] = useState(false)
  const [versand, setVersand] = useState(false)
  const [busy, setBusy] = useState(false)
  const totalFmt = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: (currency || "EUR").toUpperCase(),
  }).format((total_cents || 0) / 100)

  async function checkout() {
    if (!agb || !widerruf || !versand) return
    setBusy(true)
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(i => ({
            id: i.id,
            title: i.title,
            price_cents: i.price_cents,
            currency: i.currency,
            image: i.image ?? null,
          })),
          success_url: `${window.location.origin}/success`,
          cancel_url: `${window.location.origin}/cart`,
        }),
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
      <CartNav />

      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <h1 className="mb-8 text-3xl font-light text-gray-900">Warenkorb</h1>

        <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
          {/* Items */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              {items.length === 0 ? (
                <div className="text-gray-600">
                  <p className="mb-4">Dein Warenkorb ist leer.</p>
                  <div className="space-y-2 text-sm">
                    <label className="flex items-start gap-2">
                      <input type="checkbox" checked={agb} onChange={() => setAgb(v => !v)} className="mt-1" />
                      <span>Ich akzeptiere die <Link href="/agb" className="underline">AGB</Link>.</span>
                    </label>
                    <label className="flex items-start gap-2">
                      <input type="checkbox" checked={widerruf} onChange={() => setWiderruf(v => !v)} className="mt-1" />
                      <span>Ich habe die <Link href="/widerruf" className="underline">Widerrufsbelehrung</Link> gelesen.</span>
                    </label>
                    <label className="flex items-start gap-2">
                      <input type="checkbox" checked={versand} onChange={() => setVersand(v => !v)} className="mt-1" />
                      <span>Ich stimme den <Link href="/versand" className="underline">Versand-/Lieferbedingungen</Link> zu.</span>
                    </label>
                  </div>

                  <Link href="/#gallery" className="inline-block mt-6 underline">
                    Zur Galerie
                  </Link>
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

          {/* Summary */}
          <div className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between text-gray-800">
                  <span>Zwischensumme</span>
                  <span className="font-medium">{totalFmt}</span>
                </div>

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

                <Button
                  className="w-full bg-[#f9f5ec] text-gray-800 hover:bg-[#f2e8dc]"
                  onClick={checkout}
                  disabled={!agb || !widerruf || !versand || items.length === 0 || busy}
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

      {/* Optional: gleiches Footer-Design wie Startseite */}
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
