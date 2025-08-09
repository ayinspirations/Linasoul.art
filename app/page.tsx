"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Mail, Phone, MapPin, Heart, Palette, Send, ChevronLeft, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

type Artwork = {
  id: number
  title: string
  size: string
  medium: string
  price: string
  available: boolean
  images: string[]
}

export default function LinasoulPortfolio() {
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" })
  const [inquiryForm, setInquiryForm] = useState({ name: "", email: "", artwork: "", message: "" })
  const [zoomSrc, setZoomSrc] = useState<string | null>(null)
  const [zoomLevel, setZoomLevel] = useState(1)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoomSrc(null)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const artworks: Artwork[] = [
    {
      id: 1,
      title: "Ethereal Dreams",
      size: '24" x 36"',
      medium: "Acrylic on Canvas",
      price: "$850",
      available: true,
      images: ["/images/IMG_4634.jpeg", "/images/IMG_4643.jpeg", "/images/IMG_4646.jpeg"],
    },
    {
      id: 2,
      title: "Golden Whispers",
      size: '30" x 40"',
      medium: "Acrylic on Canvas",
      price: "$1,200",
      available: true,
      images: ["/images/IMG_4643.jpeg"],
    },
    {
      id: 3,
      title: "Ocean's Memory",
      size: '18" x 24"',
      medium: "Acrylic on Canvas",
      price: "$650",
      available: false,
      images: ["/images/IMG_4646.jpeg"],
    },
  ]

  // Mail API Call
  const sendEmail = async (data: any) => {
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, to: "linasoul.art@gmx.de" }),
      })
      if (!res.ok) throw new Error("Mail send failed")
    } catch (err) {
      console.error(err)
    }
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await sendEmail({ subject: "Contact Form", ...contactForm })
    setContactForm({ name: "", email: "", message: "" })
    alert("Your message has been sent!")
  }

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await sendEmail({ subject: "Purchase Inquiry", ...inquiryForm })
    setInquiryForm({ name: "", email: "", artwork: "", message: "" })
    alert("Your inquiry has been sent!")
  }

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
    const hasMultiple = artwork.images.length > 1
    const prevImage = () => setIdx((p) => (p === 0 ? artwork.images.length - 1 : p - 1))
    const nextImage = () => setIdx((p) => (p === artwork.images.length - 1 ? 0 : p + 1))

    return (
      <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300">
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={artwork.images[idx] || "/placeholder.svg"}
            alt={artwork.title}
            width={400}
            height={600}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-zoom-in"
            onClick={() => onZoom(artwork.images[idx])}
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
            </>
          )}
        </div>
        <CardContent className="p-6">
          <div className="mb-2 flex items-start justify-between">
            <h3 className="text-xl font-medium text-gray-800">{artwork.title}</h3>
            <Badge variant={artwork.available ? "default" : "secondary"}>
              {artwork.available ? "Available" : "Sold"}
            </Badge>
          </div>
          <p className="mb-1 text-gray-600">{artwork.size}</p>
          <p className="mb-3 text-sm text-gray-500">{artwork.medium}</p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium text-black">{artwork.price}</span>
            {artwork.available && (
              <Button
                size="sm"
                className="bg-[#f9f5ec] hover:bg-[#f2e8dc] text-gray-800"
                onClick={() => onInquire(artwork.title)}
              >
                Inquire
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-blue-50">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full border-b border-rose-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="#home" className="inline-flex items-center">
              <Image src="/images/Logo_schwarz_2.png" alt="Linasoul Logo" width={120} height={40} priority />
            </Link>
            <div className="hidden space-x-8 md:flex">
              <a href="#home" className="text-gray-600 hover:text-rose-400">Home</a>
              <a href="#about" className="text-gray-600 hover:text-rose-400">About</a>
              <a href="#gallery" className="text-gray-600 hover:text-rose-400">Gallery</a>
              <a href="#purchase" className="text-gray-600 hover:text-rose-400">Purchase</a>
              <a href="#contact" className="text-gray-600 hover:text-rose-400">Contact</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section id="home" className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: "url('/images/abstract-background.jpeg')" }} />
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <Image src="/images/Logo.png" alt="Linasoul Logo" width={400} height={150} priority className="block mx-auto" />
          <p className="mb-8 text-xl font-light text-gray-800 drop-shadow-md md:text-2xl">Abstract Acrylic Artist</p>
          <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-gray-700">
            Exploring the depths of emotion through fluid forms and ethereal colors.
          </p>
          <Button
            size="lg"
            className="rounded-full bg-[#f9f5ec] px-8 py-3 text-gray-800 shadow-lg hover:bg-[#f2e8dc]"
            onClick={() => document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" })}
          >
            View My Work
          </Button>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="bg-gradient-to-br from-blue-50 to-rose-50 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-4 text-4xl font-light text-center">Gallery</h2>
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

      {/* Inquiry Form */}
      <section id="purchase" className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="mb-4 text-4xl font-light text-center">Purchase Inquiry</h2>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <form onSubmit={handleInquirySubmit} className="space-y-6">
                <Input placeholder="Name" value={inquiryForm.name} onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })} required />
                <Input type="email" placeholder="Email" value={inquiryForm.email} onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })} required />
                <Input placeholder="Artwork" value={inquiryForm.artwork} onChange={(e) => setInquiryForm({ ...inquiryForm, artwork: e.target.value })} />
                <Textarea placeholder="Message" value={inquiryForm.message} onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })} required />
                <Button type="submit" className="w-full bg-[#f9f5ec] text-gray-800 hover:bg-[#f2e8dc]">
                  <Send className="mr-2 h-4 w-4" /> Send Inquiry
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="bg-gradient-to-br from-rose-50 to-blue-50 py-20">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="mb-4 text-4xl font-light text-center">Get in Touch</h2>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <Input placeholder="Name" value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} required />
                <Input type="email" placeholder="Email" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} required />
                <Textarea placeholder="Message" value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} required />
                <Button type="submit" className="w-full bg-[#f9f5ec] text-gray-800 hover:bg-[#f2e8dc]">Send Message</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 py-12 text-white">
        <div className="text-center">
          <Link href="#home">
            <Image src="/images/Logo_schwarz_2.png" alt="Linasoul Logo" width={120} height={40} priority />
          </Link>
          <p className="mt-4 text-gray-400">Abstract Acrylic Artist • Creating art that touches the soul</p>
          <p className="text-sm text-gray-500">© 2024 Linasoul. All rights reserved.</p>
        </div>
      </footer>

      {/* Zoom Lightbox */}
      {zoomSrc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => {
            setZoomSrc(null)
            setZoomLevel(1)
          }}
        >
          <button
            aria-label="Close"
            className="absolute right-4 top-4 rounded-full bg-white/90 p-2 shadow hover:bg-white"
            onClick={(e) => {
              e.stopPropagation()
              setZoomSrc(null)
              setZoomLevel(1)
            }}
          >
            <X className="h-5 w-5 text-gray-800" />
          </button>
          <div className="max-h-full max-w-6xl overflow-auto">
            <img
              src={zoomSrc}
              alt="Zoomed artwork"
              className="mx-auto block transition-transform duration-200"
              style={{ transform: `scale(${zoomLevel})` }}
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
