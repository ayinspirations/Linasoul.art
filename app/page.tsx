"use client"

import type React from "react"
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Mail, MapPin, Heart, Palette, Send, ChevronLeft, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

export default function AdminCreateArtwork() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const form = new FormData(e.currentTarget)

    try {
      const res = await fetch("/api/admin/artworks", {
        method: "POST",
        body: form,
      })

      const json = await res.json()
      if (!res.ok) {
        setMessage(json?.error || "Fehler beim Speichern")
      } else {
        setMessage("Gespeichert 🎉")
        e.currentTarget.reset()
      }
    } catch (err: any) {
      setMessage(err?.message || "Fehler")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-3xl font-light">Neues Artwork anlegen</h1>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-4">
          <label className="block">
            <span className="text-sm text-gray-700">Titel</span>
            <input name="title" required className="mt-1 w-full rounded border p-2" />
          </label>

          <label className="block">
            <span className="text-sm text-gray-700">Beschreibung</span>
            <textarea name="description" rows={4} className="mt-1 w-full rounded border p-2" />
          </label>

          <label className="block">
            <span className="text-sm text-gray-700">Größe (Format: 24 x 36)</span>
            <input name="size" placeholder="24 x 36" className="mt-1 w-full rounded border p-2" />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm text-gray-700">Preis</span>
              <input name="price" type="number" min="0" step="0.01" placeholder="z.B. 850" className="mt-1 w-full rounded border p-2" />
            </label>
            <label className="block">
              <span className="text-sm text-gray-700">Währung</span>
              <input name="currency" defaultValue="EUR" className="mt-1 w-full rounded border p-2" />
            </label>
          </div>

          <label className="inline-flex items-center gap-2">
            <input type="checkbox" name="available" defaultChecked className="h-4 w-4" />
            <span className="text-sm text-gray-700">Verfügbar</span>
          </label>

          <label className="block">
            <span className="text-sm text-gray-700">Bilder (1–5 Dateien)</span>
            <input name="images" type="file" multiple accept="image/*" className="mt-1 w-full" />
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? "Speichert…" : "Speichern"}
        </button>

        {message && <p className="pt-2 text-sm text-gray-700">{message}</p>}
      </form>
    </main>
  )
}

// ---------- Datentyp passend zu Supabase ----------
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
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false)
        setZoomSrc(null)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  // --- ROBUSTES Laden + Normalisieren (fix für images.map Fehler) ---
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
    console.log("Contact form submitted:", contactForm)
  }

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Inquiry form submitted:", inquiryForm)
  }

  // ---------- Beschreibung mit Mehr/Weniger ----------
  function ArtworkDescription({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false)

  // Zeige gar nichts, wenn kein Text da ist
  if (!text?.trim()) return null

  return (
    <div className="mb-3">
      {/* Ein Zeile in der Vorschau, kompletter Text wenn expanded */}
      <p className={`text-gray-600 ${expanded ? "" : "truncate"}`}>
        {text}
      </p>

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
  function ArtworkCard({
    artwork,
    onInquire,
    onZoom,
  }: {
    artwork: Artwork
    onInquire: (title: string) => void
    onZoom: (src: string) => void
  }) {
    const [idx, setIdx] = useState(0)
    const hasMultiple = (artwork.images?.length ?? 0) > 1

    const prevImage = () => setIdx((p) => (p === 0 ? (artwork.images?.length ?? 1) - 1 : p - 1))
    const nextImage = () => setIdx((p) => (p === (artwork.images?.length ?? 1) - 1 ? 0 : p + 1))

    const priceFmt =
      new Intl.NumberFormat("de-DE", { style: "currency", currency: (artwork.currency || "eur").toUpperCase() }).format(
        (artwork.price_cents ?? 0) / 100
      )

    return (
      <Card className="group overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-2xl">
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={artwork.images && artwork.images[idx] ? artwork.images[idx] : "/placeholder.svg"}
            alt={artwork.title}
            width={400}
            height={600}
            className="h-full w-full cursor-zoom-in object-cover transition-transform duration-300 group-hover:scale-105"
            onClick={() => artwork.images && artwork.images[idx] && onZoom(artwork.images[idx])}
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
              {artwork.available ? "Verfügbar" : "Verkauft"}
            </Badge>
          </div>
          {/* Maße (immer anzeigen, wenn vorhanden) */}
  {artwork.size ? (
    <p className="mb-1 text-sm text-gray-500">{artwork.size}</p>
  ) : null}

          {artwork.description ? <ArtworkDescription text={artwork.description} /> : null}

          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-black">{priceFmt}</span>
            {artwork.available ? (
              <Button
                size="sm"
                className="bg-[#f9f5ec] text-gray-800 hover:bg-[#f2e8dc]"
                onClick={() => onInquire(artwork.title)}
              >
                In den Warenkorb
              </Button>
            ) : (
              <span className="text-sm text-gray-500">Verkauft</span>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

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
            <div className="hidden space-x-8 md:flex">
              <a href="#about" className="text-gray-600 transition-colors hover:text-taupe-400">Künstler</a>
              <a href="#gallery" className="text-gray-600 transition-colors hover:text-taupe-400">Galerie</a>
              <a href="#purchase" className="text-gray-600 transition-colors hover:text-taupe-400">Kaufen</a>
              <a href="#contact" className="text-gray-600 transition-colors hover:text-taupe-400">Kontakt</a>
            </div>

            {/* Mobile Button (nur Icon) */}
            <button
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden inline-flex items-center justify-center p-2 text-gray-800 hover:text-taupe-700 transition-colors"
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
              <a href="#purchase" className="block text-lg text-gray-800 hover:text-taupe-600" onClick={() => setMobileOpen(false)}>Kaufen</a>
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
            onClick={() => document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" })}
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
      <section id="gallery" className="bg-gradient-to-br from-taupe-50 to-taupe-100 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-light text-gray-800">Galerie</h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Meine Welt in Farbe: Tauche ein in meine neuesten abstrakten Gemälde. Lass Dich von den Geschichten aus Farbe, Form und Textur verzaubern.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {artworks.map((artwork) => (
              <ArtworkCard
                key={artwork.id}
                artwork={artwork}
                onInquire={(title) => {
                  setInquiryForm((prev) => ({ ...prev, artwork: title }))
                  document.getElementById("purchase")?.scrollIntoView({ behavior: "smooth" })
                }}
                onZoom={(src) => {
                  setZoomSrc(src)
                  setZoomLevel(1)
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Purchase Inquiry */}
      <section id="purchase" className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-light text-gray-800">Kaufanfrage</h2>
            <p className="text-lg text-gray-600">Hat eines meiner Werke Dein Herz berührt? Ich freue mich auf Deine Anfrage!</p>
          </div>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <form onSubmit={handleInquirySubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <Label htmlFor="inquiry-name">Name</Label>
                    <Input id="inquiry-name" value={inquiryForm.name} onChange={(e) => setInquiryForm((prev) => ({ ...prev, name: e.target.value }))} className="mt-1" required />
                  </div>
                  <div>
                    <Label htmlFor="inquiry-email">Email</Label>
                    <Input id="inquiry-email" type="email" value={inquiryForm.email} onChange={(e) => setInquiryForm((prev) => ({ ...prev, email: e.target.value }))} className="mt-1" required />
                  </div>
                </div>

                <div>
                  <Label htmlFor="artwork-interest">Kunstwerk von Interesse</Label>
                  <Input id="artwork-interest" value={inquiryForm.artwork} onChange={(e) => setInquiryForm((prev) => ({ ...prev, artwork: e.target.value }))} placeholder="Titel eingeben oder Wunsch beschreiben" className="mt-1" />
                </div>

                <div>
                  <Label htmlFor="inquiry-message">Nachricht</Label>
                  <Textarea id="inquiry-message" value={inquiryForm.message} onChange={(e) => setInquiryForm((prev) => ({ ...prev, message: e.target.value }))} placeholder="Ich freue mich, mehr über Dein Interesse zu erfahren …" className="mt-1 min-h-[120px]" required />
                </div>

                <Button type="submit" className="w-full bg-[#f9f5ec] text-gray-800 hover:bg-[#f2e8dc]" size="lg">
                  <Send className="mr-2 h-4 w-4" />
                  Anfrage senden
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="bg-gradient-to-br from-taupe-50 to-blue-50 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="mb-6 text-4xl font-light text-gray-800">Kontakt Aufnehmen</h2>
              <p className="mb-8 text-lg text-gray-600">
                Ich freue mich über Kontakte zu anderen Kunstliebhabern, Sammlern oder Interessenten an Auftragsarbeiten.
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

      {/* Footer */}
      <footer className="bg-gray-800 py-12 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center items-center h-16">
              <Link href="#home" className="inline-flex items-center">
                <Image src="/images/Logo_weiss_2.png" alt="Linasoul Logo" width={120} height={40} priority className="block" />
              </Link>
            </div>
            <p className="mb-4 text-gray-400">Abstract Acrylic Artist • Creating art that touches the soul</p>
            <p className="text-sm text-gray-500">© 2025 Linasoul.art</p>
          </div>
        </div>
      </footer>

      {/* Zoom Lightbox */}
{zoomSrc && (
  <div
    className="fixed inset-0 z-[9990] flex items-center justify-center bg-black/80 p-4"
    onClick={() => {
      setZoomSrc(null)
      setZoomLevel(1)
    }}
  >
    {/* Close-Button ganz oben drüber */}
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

    {/* Bild-Wrapper */}
    <div className="relative z-[9995] max-h-full max-w-6xl overflow-auto">
      <img
        src={zoomSrc}
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
