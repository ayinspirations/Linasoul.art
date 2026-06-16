"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import { Heart, Palette, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { track } from "@vercel/analytics"

// ---------- Types ----------
type GalleryImage = {
  id: string
  src: string
  name: string
}

const galleryQuotes = [
  {
    text: "Kunst wäscht den Staub des Alltags von der Seele.",
    author: "Pablo Picasso",
  },
  {
    text: "Das Geheimnis der Kunst liegt darin, dass man nicht weiß, was man tut.",
    author: "Johann Wolfgang von Goethe",
  },
  {
    text: "Jedes Kind ist ein Künstler. Das Problem ist, es auch als Erwachsener zu bleiben.",
    author: "Pablo Picasso",
  },
  {
    text: "Schönheit liegt im Auge des Betrachters.",
    author: "Margaret Hungerford",
  },
]

// ---------- Gallery components (module-level) ----------

function GalleryTile({ image, onZoom, col, height }: { image: GalleryImage; onZoom: (src: string) => void; col: string; height: string }) {
  const imageSrc = image.src || "/placeholder.svg"
  return (
    <div
      className="group relative overflow-hidden rounded-3xl bg-slate-950/5 transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-[0_20px_60px_rgba(15,23,42,0.18)]"
      style={{ gridColumn: col, height }}
    >
      <button
        type="button"
        onClick={() => onZoom(imageSrc)}
        className="relative block h-full w-full cursor-zoom-in"
        aria-label={`Zoom ${image.name}`}
      >
        <img
          src={imageSrc}
          alt={image.name}
          className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-t from-slate-950/20 via-transparent to-transparent" />
      </button>
    </div>
  )
}

function GalleryQuote({ quote, col, height }: { quote: { text: string; author: string }; col: string; height: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center px-8 text-center"
      style={{ gridColumn: col, height }}
    >
      <p className="mb-4 font-serif text-lg italic leading-relaxed text-slate-500 sm:text-xl">
        {"„"}{quote.text}{"“"}
      </p>
      <p className="text-sm text-slate-400">{"–"} {quote.author}</p>
    </div>
  )
}

export default function LinasoulPortfolio() {
  // Zoom-Lightbox
  const [zoomSrc, setZoomSrc] = useState<string | null>(null)
  const [zoomLevel, setZoomLevel] = useState(1)

  // Galeriebilder aus public/gallery
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])

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

  // Scroll-triggered entrance animations
  useEffect(() => {
    const els = document.querySelectorAll(".scroll-hidden")
    if (!els.length) return
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("scroll-visible")
            obs.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08 }
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [galleryImages])

  // Laden + Normalisieren
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/gallery", { cache: "no-store" })
        const json = await res.json()
        const arr = Array.isArray(json?.images) ? json.images : []

        const safe: GalleryImage[] = arr.map((src: string, index: number) => ({
          id: `gallery-${index}`,
          src,
          name: src.split("/").pop() || `Bild ${index + 1}`,
        }))

        setGalleryImages(safe)
      } catch (e) {
        console.error(e)
        setGalleryImages([])
      }
    }
    load()
  }, [])


  // Pure data: 5-row repeating gallery layout
  const galleryRows = (() => {
    const rows = []
    const ROW_DEFS = [
      { lw: "40%", rw: "60%", lk: "img",   rk: "img",   h: "22rem" },
      { lw: "40%", rw: "60%", lk: "img",   rk: "quote", h: "28rem" },
      { lw: "60%", rw: "40%", lk: "img",   rk: "img",   h: "26rem" },
      { lw: "40%", rw: "60%", lk: "quote", rk: "img",   h: "26rem" },
      { lw: "40%", rw: "60%", lk: "img",   rk: "img",   h: "26rem" },
    ]
    let imgIdx = 0
    let quoteIdx = 0
    let rowNum = 0
    while (imgIdx < galleryImages.length) {
      const def = ROW_DEFS[rowNum % 5]
      const lImg = def.lk === "img" ? (galleryImages[imgIdx] || null) : null
      const lQ = def.lk === "quote" ? galleryQuotes[quoteIdx % 4] : null
      if (def.lk === "img") imgIdx++; else quoteIdx++
      const rImg = def.rk === "img" ? (galleryImages[imgIdx] || null) : null
      const rQ = def.rk === "quote" ? galleryQuotes[quoteIdx % 4] : null
      if (def.rk === "img") imgIdx++; else quoteIdx++
      rows.push({ lw: def.lw, rw: def.rw, h: def.h, lImg, lQ, rImg, rQ })
      rowNum++
    }
    return rows
  })()


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
            Abstrakte Acrylmalerei. Farbenfrohe Werke, hochwertige Materialien und eine Menge Leidenschaft.
            Jedes Bild ein Unikat – und jedes erzählt seine eigene Geschichte.
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
                  Ich bin Selina – und ich male aus Leidenschaft.
                </p>
                <p>
                  Abstrakte Acrylbilder auf Leinwand. Mal knallig, mal ruhig. Immer handgemacht, immer ein Unikat.
                  Jedes Werk entsteht von Grund auf in meinen Händen – vom Rahmen, den ich selbst baue und bespanne,
                  bis zum finalen Schattenfugenrahmen, der ein Bild für mich erst wirklich fertig macht.
                </p>
                <p>
                  Ich war schon immer kreativ. Aber die abstrakte Malerei hat mich auf eine ganz eigene Art erwischt –
                  weil sie mich gelehrt hat loszulassen. Als Perfektionistin war das meine größte Challenge.
                  Und genau darin liegt für mich die Magie: Ein Bild ist nie „perfekt”. Es liegt im Auge des
                  Betrachters. Und das ist das Schönste daran.
                </p>
              </div>
              <div className="mt-8 flex items-center space-x-4">
                <Heart className="h-5 w-5 text-taupe-400" />
                <span className="text-gray-600">Every canvas tells a story</span>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square overflow-hidden rounded-2xl shadow-2xl">
                <Image src="/images/lina-abstrakt-acrylmalerei-kuenstlerin.jpeg" alt="Lina im Atelier" width={1200} height={1200} className="object-cover object-[50%_70%]" />
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

          {galleryRows.length ? (
            <div className="flex flex-col gap-3 sm:gap-4">
              {galleryRows.map((row, idx) => (
                <div
                  key={idx}
                  className="flex gap-3 sm:gap-4 scroll-hidden"
                  style={{ transitionDelay: `${idx * 0.1}s` }}
                >
                  <div
                    className={row.lImg ? "overflow-hidden rounded-3xl group cursor-zoom-in" : "flex flex-col items-center justify-center px-6 text-center rounded-3xl bg-slate-50/60"}
                    style={{ width: row.lw, height: row.h, flexShrink: 0 }}
                    onClick={row.lImg ? () => { setZoomSrc(row.lImg!.src); setZoomLevel(1) } : undefined}
                  >
                    {row.lImg ? (
                      <img src={row.lImg.src} alt={row.lImg.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                    ) : row.lQ ? (
                      <>
                        <p className="font-serif text-base italic leading-relaxed text-slate-500 sm:text-lg">{"\u201e"}{row.lQ.text}{"\u201c"}</p>
                        <p className="mt-2 text-sm text-slate-400">{"\u2013"} {row.lQ.author}</p>
                      </>
                    ) : null}
                  </div>
                  <div
                    className={row.rImg ? "overflow-hidden rounded-3xl group cursor-zoom-in" : "flex flex-col items-center justify-center px-6 text-center rounded-3xl bg-slate-50/60"}
                    style={{ flex: 1, height: row.h }}
                    onClick={row.rImg ? () => { setZoomSrc(row.rImg!.src); setZoomLevel(1) } : undefined}
                  >
                    {row.rImg ? (
                      <img src={row.rImg.src} alt={row.rImg.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                    ) : row.rQ ? (
                      <>
                        <p className="font-serif text-base italic leading-relaxed text-slate-500 sm:text-lg">{"\u201e"}{row.rQ.text}{"\u201c"}</p>
                        <p className="mt-2 text-sm text-slate-400">{"\u2013"} {row.rQ.author}</p>
                      </>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white/70 p-16 text-center text-slate-500">
              Lade deine Bilder in <code className="rounded bg-slate-100 px-2 py-1 text-sm">public/gallery/</code> hoch.
            </div>
          )}
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

          <div className="relative z-[9995]">
            <img
              src={zoomSrc!}
              alt="Zoomed artwork"
              className="mx-auto block rounded-3xl shadow-2xl"
              style={{
                maxHeight: "90vh",
                maxWidth: "90vw",
                width: "auto",
                height: "auto",
                objectFit: "contain" as const,
                transform: `scale(${zoomLevel})`,
                transformOrigin: "center",
                cursor: zoomLevel === 1 ? "zoom-in" : "zoom-out",
              }}
              onClick={(e) => {
                e.stopPropagation()
                setZoomLevel((z) => (z === 1 ? 1.5 : 1))
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
