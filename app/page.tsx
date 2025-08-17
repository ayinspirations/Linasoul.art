"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Mail, MapPin, Heart, Palette, Send, ChevronLeft, ChevronRight, X, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { track } from "@vercel/analytics"

// Cart
import { CartProvider, useCart } from "./cart/CartProvider"

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

export default function LinasoulPortfolio() {
  // Forms
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" })
  const [inquiryForm, setInquiryForm] = useState({ name: "", email: "", artwork: "", message: "" })

  // Mobile menu
  const [mobileOpen, setMobileOpen] = useState(false)

  // Zoom-Lightbox
  const [zoomSrc, setZoomSrc] = useState<string | null>(null)
  const [zoomLevel, setZoomLevel] = useState(1)

  // Artworks aus API
  const [artworks, setArtworks] = useState<Artwork[]>([])

  useEffect(() => {
    // ESC schließt Menüs/Zoom
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false)
        setZoomSrc(null)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  // --- Analytics: Page View (einmalig) ---
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
            id: String(a.id ?? crypto.randomUUID?.() ?? Date.now().toString()),
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

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // --- Analytics: Kontakt gesendet ---
    track("Contact Submitted")
    console.log("Contact form submitted:", contactForm)
  }

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Inquiry form submitted:", inquiryForm)
  }

  // ---------- Beschreibung mit Mehr/Weniger (eine Zeile collapsed) ----------
  function ArtworkDescription({ text }: { text: string }) {
    const [expanded, setExpanded] = useState(false)
    if (!text?.trim()) return null
    return (
      <div className="mb-3">
        <p className={`text-gray-600 ${expanded ? "" : "line-clamp-1"}`}>{text}</p>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-1 text-sm underline text-gray-800 hover:text-gray-600"
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
            alt={artwork.title}
            width={400}
            height={600}
            className="h-full w-full cursor-zoom-in object-cover transition-transform duration-300 group-hover:scale-105"
            onClick={() => {
              if (artwork.images && artwork.images[idx]) {
                // --- Analytics: Bild-Zoom ---
                track("Image Zoom", { artwork_id: artwork.id })
                onZoom(artwork.images[idx])
              }
            }}
          />

          {hasMultiple && (
            <>
              <button
                aria-label="Previous image"
                onClick={(e) => {
                  e.stopPropagation()
                  prevImage()
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow hover:bg-white"
              >
                <ChevronLeft className="h-5 w-5 text-gray-700" />
              </button>
              <button
                aria-label="Next image"
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
              {artwork.available ? "Verfügbar" : "Nicht Verfügbar"}
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
                  // --- Analytics: Add to Cart ---
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
              <span className="text-sm text-gray-500">Nicht Verfügbar</span>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  // ---------- Seite ----------
  return (
    <div className="min-h-screen bg-gradient-to-br from-taupe-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-taupe-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex h-16 items-center mt-5">
              <Link href="#home" className="inline-flex h-16 items-center">
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

            {/* Desktop */}
            <div className="hidden md:flex items-center gap-4">
              <a href="#about" className="text-gray-600 transition-colors hover:text-taupe-400">Künstler</a>
              <a href="#gallery" className="text-gray-600 transition-colors hover:text-taupe-400">Galerie</a>
              <a href="#contact" className="text-gray-600 transition-colors hover:text-taupe-400">Kontakt</a>
              <CartButton />
            </div>

            {/* Mobile: Cart + Burger */}
            <div className="md:hidden flex items-center gap-2">
              <CartButton />
              <button
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen((v) => !v)}
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

      {/* Right Drawer (mobil) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={() => setMobileOpen(false)}>
          <div
            className="w-64 bg-white/90 backdrop-blur-md rounded-l-2xl shadow-lg p-6 mt-16 mb-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="space-y-4">
              <a href="#about" className="block text-lg text-gray-800 hover:text-taupe-600" onClick={() => setMobileOpen(false)}>Künstler</a>
              <a href="#gallery" className="block text-lg text-gray-800 hover:text-taupe-600" onClick={() => setMobileOpen(false)}>Galerie</a>
              <a href="#contact" className="block text-lg text-gray-800 hover:text-taupe-600" onClick={() => setMobileOpen(false)}>Kontakt</a>
            </nav>
          </div>
        </div>
      )}

      {/* Hero */}
      <section id="home" className="relative flex min-h-screen items-center justify-center overflow-hidden" style={{ paddingTop: "4rem" }}>
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60" style={{ backgroundImage: "url('/images/abstract-background.jpeg')" }} />
          <div className="absolute inset-0 bg-white/20" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <Image src="/images/Logo.png" alt="Linasoul Logo" width={400} height={150} priority className="mx-auto block" />
          <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-gray-700 drop-shadow-md">
            Fließende Formen und ätherische Farben, die die Seele berühren und zum Nachdenken anregen – Entdecke meine Kunst der tiefsten Emotionen.
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
                <p>Willkommen in meiner Welt der abstrakten Kunst! Ich bin Selina und meine Gemälde sind eine Reise zu den unsichtbaren Verbindungen zwischen Gefühlen, Erinnerungen und der Natur.</p>
                <p>Jedes Gemälde entsteht aus einer intuitiven Antwort auf ein Gefühl oder einen Augenblick. Durch das Schichten von Acrylfarben und Texturen erzeuge ich Tiefe und Bewegung und lasse das Gemälde sich organisch auf der Leinwand entfalten.</p>
                <p>Das Ergebnis sind lebendige und ausdrucksstarke Gemälde, die eine ganz eigene Geschichte erzählen.</p>
              </div>
              <div className="mt-8 flex items-center space-x-4">
                <Heart className="h-5 w-5 text-taupe-400" />
                <span className="text-gray-600">Creating art that touches the soul</span>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square overflow-hidden rounded-2xl shadow-2xl">
                <Image src="/images/AboutMe1.jpeg" alt="Lina in her studio" width={500} height={500} className="object-cover" />
              </div>
              <div className="absolute -bottom-6 -right-6 flex h-24 w-24 items-center justify-center rounded-full bg-taupe-100">
                <Palette className="h-8 w-8 text-taupe-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
    {/* Gallery */}
<section id="gallery" className="bg-gradient-to-br from-taupe-50 to-taupe-100 py-20">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div className="mb-16 text-center">
      <h2 className="mb-4 text-4xl font-light text-gray-800">Galerie</h2>
      {/* Neue SEO-optimierte Einleitung */}
      <div className="mx-auto max-w-3xl space-y-4 text-lg leading-relaxed text-gray-600">
        <p>
          Jedes meiner <strong>Acrylbilder auf Leinwand</strong> ist mehr als nur Farbe – 
          es ist ein Ausdruck von Gefühl, Energie und Intuition. 
          In einem meditativen Prozess lasse ich Formen und Strukturen entstehen, 
          die den Raum mit einer einzigartigen Atmosphäre füllen.
        </p>
        <p>
          Viele meiner Kundinnen und Kunden erzählen, dass sie „ihr Bild“ gefunden haben – 
          ein Werk, das sie auf besondere Weise berührt. 
          Genau das ist meine Intention: <em>Kunstwerke zu schaffen, die inspirieren, 
          berühren und ein Leben lang begleiten.</em>
        </p>
        <p>
          In dieser Galerie finden Sie eine Auswahl handgemalter 
          <strong> Acrylgemälde </strong>, die Sie direkt online kaufen können. 
          Ob als Blickfang im Wohnzimmer, beruhigende Präsenz im Schlafzimmer oder inspirierendes Highlight im Büro – 
          ein abstraktes <strong>Acrylbild</strong> verleiht jedem Raum Charakter und Tiefe.
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
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="mb-6 text-4xl font-light text-gray-800">Kontaktanfrage</h2>
              <p className="mb-8 text-lg text-gray-600">
                Hat eines meiner Werke Dein Herz berührt? Ich freue mich auf Deine Anfrage!
              </p>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-taupe-400" />
                  <span className="text-gray-600">linasoul.art@gmx.de</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-taupe-400" />
                  <span className="text-gray-600">Leonberg, Stuttgart</span>
                </div>
              </div>
            </div>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="contact-name">Name</Label>
                    <Input id="contact-name" value={contactForm.name} onChange={(e) => setContactForm((prev) => ({ ...prev, name: e.target.value }))} className="mt-1" required />
                  </div>

                  <div>
                    <Label htmlFor="contact-email">Email</Label>
                    <Input id="contact-email" type="email" value={contactForm.email} onChange={(e) => setContactForm((prev) => ({ ...prev, email: e.target.value }))} className="mt-1" required />
                  </div>

                  <div>
                    <Label htmlFor="contact-message">Nachricht</Label>
                    <Textarea id="contact-message" value={contactForm.message} onChange={(e) => setContactForm((prev) => ({ ...prev, message: e.target.value }))} placeholder="Deine Nachricht..." className="mt-1 min-h-[120px]" required />
                  </div>

                  <Button type="submit" className="w-full bg-[#f9f5ec] text-gray-800 hover:bg-[#f2e8dc]" size="lg">
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
          onClick={() => { setZoomSrc(null); setZoomLevel(1) }}
        >
          <button
            aria-label="Close"
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
