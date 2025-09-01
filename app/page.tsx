"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Palette, ChevronLeft, ChevronRight, X, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { track } from "@vercel/analytics"

// Cart
import { useCart } from "./cart/CartProvider"

// ---------- Types ----------
type Artwork = {
  id: string
  title: string
  description?: string
  price_cents: number
  currency: string
  available: boolean
  images: string[]
  size?: string
}

// ---------- Cart Button (Navbar) ----------
function CartButton() {
  const { count } = useCart()
  return (
    <Link
      href="/cart"
      className="relative inline-flex items-center justify-center p-2 text-gray-800 transition-colors hover:text-taupe-700"
      aria-label="Warenkorb"
    >
      <ShoppingCart className="h-6 w-6" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-black px-1 text-xs text-white">
          {count}
        </span>
      )}
    </Link>
  )
}

export default function LinasoulPortfolio() {
  // Forms
  const [contactForm] = useState({ name: "", email: "", message: "" })
  const [inquiryForm] = useState({ name: "", email: "", artwork: "", message: "" })

  // Zoom-Lightbox
  const [zoomSrc, setZoomSrc] = useState<string | null>(null)
  const [zoomLevel, setZoomLevel] = useState(1)

  // Artworks aus API
  const [artworks, setArtworks] = useState<Artwork[]>([])

  // ESC schließt Zoom
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoomSrc(null)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  // Analytics: Page View
  useEffect(() => {
    track("Homepage Viewed")
  }, [])

  // Laden + Normalisieren
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/artworks", { cache: "no-store" })
        const json = await res.json()
        const arr = Array.isArray(json?.artworks) ? json.artworks : []

        const safe: Artwork[] = arr.map((a: any) => {
          // images robust normalisieren
          let imgs: string[] = []
          try {
            if (Array.isArray(a?.images)) {
              imgs = a.images.map(String)
            } else if (typeof a?.images === "string") {
              try {
                const parsed = JSON.parse(a.images)
                imgs = Array.isArray(parsed) ? parsed.map(String) : [String(a.images)]
              } catch {
                imgs = [String(a.images)]
              }
            } else if (a?.images && typeof a.images === "object" && typeof a.images.url === "string") {
              imgs = [String(a.images.url)]
            }
          } catch {
            imgs = []
          }
          imgs = (imgs || []).filter((u) => typeof u === "string" && u.trim().length > 0)

          return {
            id: String(a.id ?? (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : Date.now().toString())),
            title: String(a.title ?? "Untitled"),
            description: a.description ?? "",
            price_cents: Number(a.price_cents ?? 0),
            currency: String(a.currency ?? "eur"),
            available: Boolean(a.available ?? false),
            size: a.size ? String(a.size) : "",
            images: imgs,
          }
        })

        setArtworks(safe)
      } catch (e) {
        console.error(e)
        setArtworks([])
      }
    }
    load()
  }, [])

  // ---------- Beschreibung mit Mehr/Weniger ----------
  function ArtworkDescription({ text }: { text: string }) {
    const [expanded, setExpanded] = useState(false)
    if (!text?.trim()) return null
    return (
      <div className="mb-3">
        <p className={`text-gray-600 ${expanded ? "" : "line-clamp-1"}`}>{text}</p>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-1 text-sm text-gray-800 underline hover:text-gray-600"
          aria-expanded={expanded}
        >
          {expanded ? "weniger" : "mehr"}
        </button>
      </div>
    )
  }

  // ---------- Einzelkarte ----------
  function ArtworkCard({ artwork, onZoom }: { artwork: Artwork; onZoom: (src: string) => void }) {
    const [idx, setIdx] = useState(0)
    const hasMultiple = (artwork.images?.length ?? 0) > 1
    const { add } = useCart()

    const prevImage = () => setIdx((p) => (p === 0 ? (artwork.images?.length ?? 1) - 1 : p - 1))
    const nextImage = () => setIdx((p) => (p === (artwork.images?.length ?? 1) - 1 ? 0 : p + 1))

    const priceFmt = new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: (artwork.currency || "eur").toUpperCase(),
    }).format((artwork.price_cents ?? 0) / 100)

    return (
      <Card className="group overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-2xl">
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={artwork.images && artwork.images[idx] ? artwork.images[idx] : "/placeholder.svg"}
            alt={`${artwork.title} – Abstraktes Acrylbild auf Leinwand von Selina („Lina“) Sickinger`}
            width={1200}
            height={1600}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="h-full w-full cursor-zoom-in object-cover transition-transform duration-300 group-hover:scale-105"
            onClick={() => artwork.images && artwork.images[idx] && onZoom(artwork.images[idx])}
          />
          {hasMultiple && (
            <>
              <button
                aria-label="Vorheriges Bild"
                onClick={(e) => {
                  e.stopPropagation()
                  prevImage()
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow hover:bg-white"
              >
                <ChevronLeft className="h-5 w-5 text-gray-700" />
              </button>
              <button
                aria-label="Nächstes Bild"
                onClick={(e) => {
                  e.stopPropagation()
                  nextImage()
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow hover:bg-white"
              >
                <ChevronRight className="h-5 w-5 text-gray-700" />
              </button>

              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {(artwork.images || []).map((_, i) => (
                  <span key={i} className={`h-1.5 w-1.5 rounded-full ${i === idx ? "bg-white" : "bg-white/60"}`} />
                ))}
              </div>
            </>
          )}
        </div>

        <CardContent className="p-6">
          <div className="mb-2 flex items-start justify-between">
            <h3 className="text-xl font-medium text-gray-800">{artwork.title}</h3>
            <Badge variant={artwork.available ? "default" : "secondary"} className="ml-2">
              {artwork.available ? "Verfügbar" : "Nicht verfügbar"}
            </Badge>
          </div>

          {artwork.size ? <p className="mb-1 text-sm text-gray-500">{artwork.size}</p> : null}
          {artwork.description ? <ArtworkDescription text={artwork.description} /> : null}

          <div className="flex items-center justify-between">
            {artwork.available ? (
              <span className="text-lg font-medium text-black">{priceFmt}</span>
            ) : (
              <span aria-hidden className="inline-block" />
            )}

            {artwork.available ? (
              <Button
                size="sm"
                className="bg-[#f9f5ec] text-gray-800 hover:bg-[#f2e8dc]"
                onClick={() => {
                  track("Add to Cart", {
                    artwork_id: artwork.id,
                    price_eur: (artwork.price_cents ?? 0) / 100,
                  })
                  add({
                    id: artwork.id,
                    title: artwork.title,
                    price_cents: artwork.price_cents ?? 0,
                    currency: artwork.currency || "eur",
                    image: artwork.images?.[0] ?? null,
                  })
                }}
              >
                In den Warenkorb
              </Button>
            ) : (
              <span className="text-sm text-gray-500">Nicht verfügbar</span>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  // ---------- Seite ----------
  return (
    <div className="min-h-screen bg-gradient-to-br from-taupe-50 via-white to-blue-50">
      {/* Hinweis: Navbar & Footer kommen aus dem globalen Layout. Für den Warenkorb-Status zeigen wir hier optional den Button. */}
      <div className="fixed right-4 top-20 z-40 hidden md:block">
        <CartButton />
      </div>

      {/* Hero */}
      <section id="home" className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
            style={{ backgroundImage: "url('/images/abstract-background.jpeg')" }}
          />
          <div className="absolute inset-0 bg-white/20" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <Image src="/images/Logo.png" alt="Linasoul Logo" width={400} height={150} priority className="mx-auto block" />
          <h1 className="mt-6 mb-4 text-3xl font-light text-gray-900">
            Abstrakte Acrylbilder von Lina – moderne Kunst auf Leinwand
          </h1>
          <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-gray-700 drop-shadow-md">
            Willkommen bei <strong>Linasoul Art</strong>. Ich bin Selina („Lina“) Sickinger und male{" "}
            <em>abstrakte Acrylgemälde</em>, die Emotionen sichtbar machen: ruhige Naturtöne, kraftvolle Strukturen
            und moderne Kompositionen für Zuhause oder Büro. Entdecke originale <strong>abstrakte Bilder</strong> auf Leinwand – jedes Werk ist handgemalt und ein Unikat.
          </p>
          <Button
            size="lg"
            className="rounded-full bg-[#f9f5ec] px-8 py-3 text-gray-800 shadow-lg hover:bg-[#f2e8dc]"
            onClick={() => {
              track("CTA To Gallery")
              document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" })
            }}
          >
            Zur Galerie
          </Button>
        </div>
      </section>

      {/* About */}
      <section id="about" className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <h2 className="mb-6 text-4xl font-light text-gray-800">Über die Künstlerin</h2>
              <div className="space-y-4 leading-relaxed text-gray-600">
                <p>
                  Ich bin <strong>Selina („Lina“) Sickinger</strong> und arbeite mit Schichtungen aus Acrylfarben und
                  Texturen, um Tiefe, Bewegung und Harmonie zu erzeugen. Jedes Bild entsteht intuitiv als Antwort auf
                  Gefühl und Moment.
                </p>
                <p>
                  Meine <em>abstrakte Acrylmalerei</em> verbindet reduzierte Farbwelten mit organischen Strukturen – für
                  Kunstwerke, die Räume tragen und die Seele berühren.
                </p>
              </div>
              <div className="mt-8 flex items-center space-x-4">
                <Heart className="h-5 w-5 text-taupe-400" />
                <span className="text-gray-600">Creating art that touches the soul</span>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square overflow-hidden rounded-2xl shadow-2xl">
                <Image src="/images/AboutMe1.jpeg" alt="Lina im Atelier" width={500} height={500} className="object-cover" />
              </div>
              <div className="absolute -bottom-6 -right-6 flex h-24 w-24 items-center justify-center rounded-full bg-taupe-100">
                <Palette className="h-8 w-8 text-taupe-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="bg-gradient-to-br from-taupe-50 to-taupe-100 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-light text-gray-800">Galerie</h2>
            {/* SEO-optimierte Einleitung */}
            <div className="mx-auto max-w-3xl space-y-4 text-lg leading-relaxed text-gray-600">
              <p>
                Jedes meiner <strong>Acrylbilder auf Leinwand</strong> ist Ausdruck von Gefühl, Energie und Intuition. In
                einem meditativen Prozess entstehen Formen und Strukturen, die Räume mit Ruhe und Tiefe füllen.
              </p>
              <p>
                Viele Kund:innen erzählen, dass sie „ihr Bild“ gefunden haben – ein Werk, das sie besonders berührt. Genau
                das ist meine Intention: <em>Kunstwerke zu schaffen, die inspirieren, berühren und ein Leben lang
                begleiten.</em>
              </p>
              <p>
                In dieser Galerie findest du eine Auswahl handgemalter <strong>Acrylgemälde</strong>, die du direkt online
                kaufen kannst.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {artworks.map((artwork) => (
              <ArtworkCard
                key={artwork.id}
                artwork={artwork}
                onZoom={(src) => {
                  setZoomSrc(src)
                  setZoomLevel(1)
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="bg-gradient-to-br from-taupe-50 to-blue-50 py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="mb-6 text-4xl font-light text-gray-800">Kontaktanfrage</h2>
            <p className="mb-8 text-lg text-gray-600">
              Hat eines meiner Werke dein Herz berührt? Ich freue mich auf deine Anfrage!
            </p>

            {/* Formular mit mailto */}
            <Card className="mx-auto max-w-md border-0 shadow-lg">
              <CardContent className="p-8">
                <form action="mailto:linasoul.art@gmx.de" method="POST" encType="text/plain" className="space-y-6">
                  <div>
                    <Label htmlFor="contact-message">Nachricht</Label>
                    <Textarea
                      id="contact-message"
                      name="message"
                      placeholder="Deine Nachricht..."
                      className="mt-1 min-h-[120px]"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#f9f5ec] text-gray-800 hover:bg-[#f2e8dc]"
                    size="lg"
                    onClick={() => track("Contact Submitted")}
                  >
                    Anfrage senden
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Zoom Lightbox */}
      {zoomSrc && (
        <div
          className="fixed inset-0 z-[9990] flex items-center justify-center bg-black/80 p-4"
          onClick={() => {
            setZoomSrc(null)
            setZoomLevel(1)
          }}
        >
          <button
            aria-label="Schließen"
            className="absolute right-4 top-4 z-[10000] rounded-full bg-white/90 p-2 shadow hover:bg-white"
            onClick={(e) => {
              e.stopPropagation()
              setZoomSrc(null)
              setZoomLevel(1)
            }}
          >
            <X className="h-5 w-5 text-gray-800" />
          </button>

          <div className="relative z-[9995] max-h-full max-w-6xl overflow-auto">
            <img
              src={zoomSrc!}
              alt="Zoomed artwork"
              className="mx-auto block cursor-zoom-in transition-transform duration-200"
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: "center" }}
              onClick={(e) => {
                e.stopPropagation()
                setZoomLevel((z) => (z === 1 ? 1.6 : 1))
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
