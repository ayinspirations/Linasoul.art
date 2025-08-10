"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useCart } from "../cart/CartProvider"

type StripeSession = {
  id: string
  created: number
  amount_total: number | null
  currency: string | null
  customer_details?: {
    email?: string | null
    name?: string | null
    address?: {
      line1?: string | null
      line2?: string | null
      postal_code?: string | null
      city?: string | null
      country?: string | null
      state?: string | null
    } | null
  } | null
  shipping_details?: {
    name?: string | null
    phone?: string | null
    address?: {
      line1?: string | null
      line2?: string | null
      postal_code?: string | null
      city?: string | null
      country?: string | null
      state?: string | null
    } | null
  } | null
  line_items?: {
    data: Array<{
      quantity?: number | null
      amount_total?: number | null
      currency?: string | null
      description?: string | null
    }>
  }
}

function formatMoney(cents?: number | null, cur?: string | null) {
  const c = typeof cents === "number" ? cents : 0
  const currency = (cur || "EUR").toUpperCase()
  return new Intl.NumberFormat("de-DE", { style: "currency", currency }).format(c / 100)
}

// Warenkorb-Button (gleich wie auf Home/Cart)
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

export default function SuccessPage() {
  const search = useSearchParams()
  const sid = search.get("session_id") || search.get("sid") || ""
  const [mobileOpen, setMobileOpen] = useState(false)
  const [session, setSession] = useState<StripeSession | null>(null)
  const [loading, setLoading] = useState(true)
  const { clear } = useCart()

  useEffect(() => {
    clear() // lokalen Warenkorb leeren
  }, [clear])

  useEffect(() => {
    let ignore = false
    async function load() {
      if (!sid) return
      setLoading(true)
      try {
        const res = await fetch(`/api/checkout/session?sid=${encodeURIComponent(sid)}`, { cache: "no-store" })
        const json = await res.json()
        if (!res.ok) throw new Error(json?.error || "Fehler beim Laden")
        if (!ignore) setSession(json.session)
      } catch (e) {
        console.error(e)
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    load()
    return () => {
      ignore = true
    }
  }, [sid])

  const createdStr = useMemo(() => {
    if (!session?.created) return ""
    const d = new Date(session.created * 1000)
    return new Intl.DateTimeFormat("de-DE", {
      dateStyle: "long",
      timeStyle: "short",
    }).format(d)
  }, [session?.created])

  const sumFmt = formatMoney(session?.amount_total ?? 0, session?.currency ?? "EUR")

  return (
    <div className="min-h-screen bg-gradient-to-br from-taupe-50 via-white to-blue-50">
      {/* NAVIGATION (wie Cart-Seite) */}
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
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        <h1 className="mb-6 text-3xl font-light text-gray-900">Danke für deinen Kauf! 🎉</h1>

        <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
          {/* Bestellübersicht */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              {loading && <p className="text-gray-600">Lade Bestelldetails …</p>}
              {!loading && !session && <p className="text-gray-600">Keine Bestelldaten gefunden.</p>}

              {session && (
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-gray-500">Bestellnummer</p>
                    <p className="font-medium text-gray-900">{session.id}</p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm text-gray-500">Datum</p>
                      <p className="font-medium text-gray-900">{createdStr}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Summe</p>
                      <p className="font-medium text-gray-900">{sumFmt}</p>
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-sm text-gray-500">Artikel</p>
                    <ul className="divide-y">
                      {(session.line_items?.data ?? []).map((li, i) => (
                        <li key={i} className="py-3 flex items-center justify-between">
                          <span className="text-gray-800">{li.description || "Kunstwerk"}</span>
                          <span className="text-gray-700">
                            {formatMoney(li.amount_total ?? 0, li.currency ?? session.currency ?? "EUR")}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <p className="mb-2 text-sm text-gray-500">Rechnungsadresse</p>
                      <AddressBox
                        name={session.customer_details?.name}
                        email={session.customer_details?.email}
                        addr={session.customer_details?.address}
                      />
                    </div>
                    <div>
                      <p className="mb-2 text-sm text-gray-500">Lieferadresse</p>
                      <AddressBox
                        name={session.shipping_details?.name}
                        email={undefined}
                        addr={session.shipping_details?.address}
                        phone={session.shipping_details?.phone ?? undefined}
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link href="/" className="underline">Zur Startseite</Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Zusammenfassung rechts */}
          <div className="space-y-4">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between text-gray-800">
                  <span>Summe</span>
                  <span className="font-medium">{sumFmt}</span>
                </div>
                <Button asChild className="w-full bg-[#f9f5ec] text-gray-800 hover:bg-[#f2e8dc]">
                  <Link href="/#gallery">Weiter stöbern</Link>
                </Button>
                <p className="text-xs text-gray-500">
                  Du erhältst zusätzlich eine E-Mail mit allen Details.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer (wie Startseite) */}
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

function AddressBox({
  name,
  email,
  phone,
  addr,
}: {
  name?: string | null
  email?: string | null
  phone?: string | null
  addr?: {
    line1?: string | null
    line2?: string | null
    postal_code?: string | null
    city?: string | null
    country?: string | null
    state?: string | null
  } | null
}) {
  if (!name && !email && !addr?.line1) {
    return <p className="text-gray-600">Keine Daten</p>
  }
  return (
    <div className="rounded-lg border bg-white/70 p-4 text-sm text-gray-700">
      {name && <p className="text-gray-900">{name}</p>}
      {email && <p className="">{email}</p>}
      {phone && <p className="">{phone}</p>}
      {addr && (
        <>
          <p className="">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}</p>
          <p className="">{addr.postal_code} {addr.city}</p>
          <p className="">{addr.country}{addr.state ? `, ${addr.state}` : ""}</p>
        </>
      )}
    </div>
  )
}
