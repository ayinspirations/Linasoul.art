"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Heart, Palette, ChevronLeft, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { track } from "@vercel/analytics"
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

export default function LinasoulPortfolio() {
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

  // Body-Scroll sperren, wenn Zoom offen ist
  useEffect(() => {
    const body = document.body
    if (zoomSrc) {
      const prevOverflow = body.style.overflow
      const prevTouch = body.style.touchAction
      body.style.overflow = "hidden"
      body.style.touchAction = "none" // verhindert iOS Overscroll
      return () => {
        body.style.overflow = prevOverflow
        body.style.touchAction = prevTouch
      }
    }
  }, [zoomSrc])

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
            id: String(
              a.id ??
                (typeof crypto !== "undefined" && "randomUUID" in crypto
                  ? crypto.randomUUID()
                  : Date.now().toString())
            ),
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

  // ---------- Einzelkarte mit smooth Crossfade (ohne Flash, mobil-freundlich) ----------
// ---------- Einzelkarte mit smooth Crossfade (ohne Flash, mobil-freundlich) ----------
// ---------- Einzelkarte mit decode-Preload (kein Flash, mobil-sicher) ----------
// ---------- Einzelkarte mit sofortigem Wechsel + Crossfade ----------
function ArtworkCard({ artwork, onZoom }: { artwork: Artwork; onZoom: (src: string) => void }) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [overlaySrc, setOverlaySrc] = useState<string | null>(null)
  const { add } = useCart()

  const images = (artwork.images || []).filter((u) => typeof u === "string" && u.trim().length > 0)
  const total = images.length
  const hasMultiple = total > 1

  const priceFmt = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: (artwork.currency || "eur").toUpperCase(),
  }).format((artwork.price_cents ?? 0) / 100)

  const currentSrc = images[currentIdx] || "/placeholder.svg"

  // Navigation: sofort Overlay setzen, danach Index umstellen
  const go = (dir: "prev" | "next") => {
    if (!hasMultiple) return
    const target =
      dir === "next"
        ? (currentIdx + 1) % total
        : (currentIdx - 1 + total) % total

    const targetSrc = images[target]
    if (!targetSrc) return

    setOverlaySrc(targetSrc)
    // nach dem Fade-In das aktuelle Bild setzen
    setTimeout(() => {
      setCurrentIdx(target)
      setOverlaySrc(null)
    }, 300) // Dauer der CSS-Transition
  }

  return (
    <Card className="group overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-2xl">
      <div className="relative aspect-[3/4] overflow-hidden bg-[#f7f5f1]">
        {/* aktuelles Bild */}
        <img
          src={currentSrc}
          alt={`${artwork.title} – Acrylbild von Selina („Lina“) Sickinger`}
          className="absolute inset-0 h-full w-full object-cover cursor-zoom-in transition-transform duration-300 group-hover:scale-105"
          onClick={() => onZoom(currentSrc)}
        />

        {/* Overlay-Bild für Crossfade */}
        {overlaySrc && (
          <img
            src={overlaySrc}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-0 animate-fadeIn"
            onClick={() => onZoom(overlaySrc)}
          />
        )}

        {/* Navigation */}
        {hasMultiple && (
          <>
            <button
              aria-label="Vorheriges Bild"
              onClick={(e) => {
                e.stopPropagation()
                go("prev")
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow hover:bg-white"
            >
              <ChevronLeft className="h-5 w-5 text-gray-700" />
            </button>
            <button
              aria-label="Nächstes Bild"
              onClick={(e) => {
                e.stopPropagation()
                go("next")
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow hover:bg-white"
            >
              <ChevronRight className="h-5 w-5 text-gray-700" />
            </button>
          </>
        )}
      </div>

      {/* Rest wie gehabt */}
      <CardContent className="p-6">
        <div className="mb-2 flex items-start justify-between">
          <h3 className="text-xl font-medium text-gray-800">{artwork.title}</h3>
          <Badge
            variant={artwork.available ? "default" : "secondary"}
            className="ml-2"
          >
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
                  image: images[0] ?? null,
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
      {/* Hero */}
      <section
        id="home"
        className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden text-center"
      >
        {/* Hintergrundbild + Overlay */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
            style={{ backgroundImage: "url('/images/abstract-background.jpeg')" }}
          />
          <div className="absolute inset-0 bg-white/20" />
        </div>

        {/* Inhalt */}
        <div className="relative z-10 mx-auto w-full max-w-4xl px-4">
          {/* Logo zentral – mobil kompakt, Desktop größer; sehr kleiner Abstand darunter */}
          <Image
            src="/images/Logo.png"
            alt="Linasoul Logo"
            width={420}
            height={180}
            priority
            className="mx-auto block h-auto w-48 sm:w-64 md:w-80 lg:w-[22rem] mb-1 sm:mb-2"
          />

          {/* Headline – mobil 2xl/3xl, Desktop 4xl; enger zum Logo */}
          <h1 className="mb-2 sm:mb-3 text-2xl sm:text-3xl md:text-4xl font-light text-gray-900">
            Abstrakte Acrylbilder von Lina – moderne Kunst auf Leinwand
          </h1>

          {/* Einleitung – mobil etwas kleiner, Desktop größer; moderater Abstand vor CTA */}
          <p className="mx-auto mb-6 sm:mb-8 max-w-2xl text-base sm:text-lg leading-relaxed text-gray-700 drop-shadow-md">
            Willkommen bei <strong>Linasoul Art</strong>. Ich bin Selina („Lina“) Sickinger und male{" "}
            <em>abstrakte Acrylgemälde</em>, die Emotionen sichtbar machen: ruhige Naturtöne, kraftvolle
            Strukturen und moderne Kompositionen für Zuhause oder Büro. Entdecke originale{" "}
            <strong>abstrakte Bilder</strong> auf Leinwand – jedes Werk ist handgemalt und ein Unikat.
          </p>

          {/* CTA */}
          <Button
            size="lg"
            className="rounded-full bg-[#f9f5ec] px-8 py-3 text-gray-800 shadow-lg hover:bg-[#f2e8dc]"
            onClick={() => {
              try {
                // optionales Analytics-Event, falls @vercel/analytics eingebunden ist
                // @ts-ignore
                track?.("CTA To Gallery")
              } catch {}
              document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" })
            }}
          >
            Zur Galerie
          </Button>
        </div>
      </section>

       {/* Über die Künstlerin */}
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
                <Image src="/images/lina-abstrakt-acrylmalerei-kuenstlerin.jpeg" alt="Lina im Atelier" width={1200} height={1200} className="object-cover object-[50%_30%]" />
              </div>
              <div className="absolute -bottom-6 -right-6 flex h-24 w-24 items-center justify-center rounded-full bg-taupe-100">
                <Palette className="h-8 w-8 text-taupe-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Galerie (direkt nach Hero) */}
      <section id="gallery" className="bg-gradient-to-br from-taupe-50 to-taupe-100 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-light text-gray-800">Galerie</h2>
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

      {/* Kontakt */}
      <section id="contact" className="bg-gradient-to-br from-taupe-50 to-blue-50 py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="mb-6 text-4xl font-light text-gray-800">Kontaktanfrage</h2>
            <p className="mb-8 text-lg text-gray-600">
              Hat eines meiner Werke dein Herz berührt? Ich freue mich auf deine Anfrage!
            </p>

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
          className="fixed inset-0 z-[9990] flex items-center justify-center bg-black/80 p-4 overscroll-contain"
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

          <div className="relative z-[9995] max-h-screen max-w-6xl overflow-auto">
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
