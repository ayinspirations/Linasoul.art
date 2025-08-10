"use client"

import type React from "react"
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
  images: string[] // Mehrere Bilder pro Artwork
}

export default function LinasoulPortfolio() {
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" })
  const [inquiryForm, setInquiryForm] = useState({ name: "", email: "", artwork: "", message: "" })

  // Zoom-Lightbox
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
      images: ["/images/IMG_4634.jpeg", "/images/IMG_4643.jpeg", "/images/IMG_4646.jpeg"], // mehrere Bilder
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
    {
      id: 4,
      title: "Sunset Reverie",
      size: '36" x 48"',
      medium: "Acrylic on Canvas",
      price: "$1,800",
      available: true,
      images: ["/images/abstract-background.jpeg"],
    },
    {
      id: 5,
      title: "Forest Meditation",
      size: '20" x 30"',
      medium: "Acrylic on Canvas",
      price: "$750",
      available: true,
      images: ["/placeholder.svg"],
    },
    {
      id: 6,
      title: "Cosmic Dance",
      size: '32" x 44"',
      medium: "Acrylic on Canvas",
      price: "$1,400",
      available: true,
      images: ["/placeholder.svg"],
    },
  ]

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Contact form submitted:", contactForm)
  }

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Inquiry form submitted:", inquiryForm)
  }

  // Einzelne Artwork-Karte mit eigenem Bild-Index + Zoom
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
      <Card className="group overflow-hidden border-0 shadow-lg transition-all duration-300 hover:shadow-2xl">
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={artwork.images[idx] || "/placeholder.svg"}
            alt={artwork.title}
            width={400}
            height={600}
            className="h-full w-full cursor-zoom-in object-cover transition-transform duration-300 group-hover:scale-105"
            onClick={() => onZoom(artwork.images[idx])}
          />

          {/* Pfeile nur zeigen, wenn mehrere Bilder vorhanden */}
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

              {/* kleine Indikatorpunkte */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {artwork.images.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 w-1.5 rounded-full ${i === idx ? "bg-white" : "bg-white/60"}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <CardContent className="p-6">
          <div className="mb-2 flex items-start justify-between">
            <h3 className="text-xl font-medium text-gray-800">{artwork.title}</h3>
            <Badge variant={artwork.available ? "default" : "secondary"} className="ml-2">
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
                className="bg-[#f9f5ec] text-gray-800 hover:bg-[#f2e8dc]"
                onClick={() => {
                  onInquire(artwork.title)
                }}
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
    <div className="min-h-screen bg-gradient-to-br from-taupe-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-taupe-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* beide Blöcke in EINEM Flex-Wrapper */}
          <div className="flex h-16 items-center justify-between">
            <div className="flex h-16 items-center mt-5"> {/* hier mt-1 oder mt-2 für mehr */}
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
            <div className="hidden space-x-8 md:flex">
              <a href="#home" className="text-gray-600 transition-colors hover:text-taupe-400">
                Home
              </a>
              <a href="#about" className="text-gray-600 transition-colors hover:text-taupe-400">
                About
              </a>
              <a href="#gallery" className="text-gray-600 transition-colors hover:text-taupe-400">
                Gallery
              </a>
              <a href="#purchase" className="text-gray-600 transition-colors hover:text-taupe-400">
                Purchase
              </a>
              <a href="#contact" className="text-gray-600 transition-colors hover:text-taupe-400">
                Contact
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16">
        {/* Abstract Painting Background */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
            style={{ backgroundImage: "url('/images/abstract-background.jpeg')" }}
          />
          <div className="absolute inset-0 bg-white/20" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <Image
            src="/images/Logo.png"
            alt="Linasoul Logo"
            width={400}
            height={150}
            priority
            className="mx-auto block"
          />
          <p className="mb-8 text-xl font-light text-gray-800 drop-shadow-md md:text-2xl">
            Abstract Acrylic Artist
          </p>
          <p className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-gray-700 drop-shadow-md">
            Exploring the depths of emotion through fluid forms and ethereal colors, creating pieces that speak to the
            soul and inspire contemplation.
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

      {/* About Section */}
      <section id="about" className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <h2 className="mb-6 text-4xl font-light text-gray-800">About the Artist</h2>
              <div className="space-y-4 leading-relaxed text-gray-600">
                <p>
                  Welcome to my world of abstract expression. I'm Lina, and through my art, I explore the invisible
                  connections between emotion, memory, and the natural world.
                </p>
                <p>
                  Each piece begins as an intuitive response to a feeling or moment in time. Using acrylic paints, I
                  layer colors and textures to create depth and movement, allowing the painting to evolve organically on
                  the canvas.
                </p>
                <p>
                  My work has been featured in galleries across the region, and I find deep joy in creating pieces that
                  resonate with collectors who seek art that speaks to their inner landscape.
                </p>
              </div>
              <div className="mt-8 flex items-center space-x-4">
                <Heart className="h-5 w-5 text-taupe-400" />
                <span className="text-gray-600">Creating art that touches the soul</span>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square overflow-hidden rounded-2xl shadow-2xl">
                <Image
                  src="/images/AboutMe1.jpeg"
                  alt="Lina in her studio"
                  width={500}
                  height={500}
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 flex h-24 w-24 items-center justify-center rounded-full bg-taupe-100">
                <Palette className="h-8 w-8 text-taupe-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="bg-gradient-to-br from-taupe-50 to-taupe-100 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-light text-gray-800">Gallery</h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              A collection of my recent works, each piece telling its own story through color, texture, and form.
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

      {/* Purchase Inquiry Section */}
      <section id="purchase" className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-light text-gray-800">Purchase Inquiry</h2>
            <p className="text-lg text-gray-600">Interested in acquiring a piece? I'd love to hear from you.</p>
          </div>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <form onSubmit={handleInquirySubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <Label htmlFor="inquiry-name">Name</Label>
                    <Input
                      id="inquiry-name"
                      value={inquiryForm.name}
                      onChange={(e) => setInquiryForm((prev) => ({ ...prev, name: e.target.value }))}
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="inquiry-email">Email</Label>
                    <Input
                      id="inquiry-email"
                      type="email"
                      value={inquiryForm.email}
                      onChange={(e) => setInquiryForm((prev) => ({ ...prev, email: e.target.value }))}
                      className="mt-1"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="artwork-interest">Artwork of Interest</Label>
                  <Input
                    id="artwork-interest"
                    value={inquiryForm.artwork}
                    onChange={(e) => setInquiryForm((prev) => ({ ...prev, artwork: e.target.value }))}
                    placeholder="Enter artwork title or describe what you're looking for"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="inquiry-message">Message</Label>
                  <Textarea
                    id="inquiry-message"
                    value={inquiryForm.message}
                    onChange={(e) => setInquiryForm((prev) => ({ ...prev, message: e.target.value }))}
                    placeholder="Tell me about your interest in the piece, any questions you have, or if you'd like to schedule a viewing..."
                    className="mt-1 min-h-[120px]"
                    required
                  />
                </div>

                <Button type="submit" className="w-full bg-[#f9f5ec] text-gray-800 hover:bg-[#f2e8dc]" size="lg">
                  <Send className="mr-2 h-4 w-4" />
                  Send Inquiry
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-gradient-to-br from-taupe-50 to-blue-50 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <h2 className="mb-6 text-4xl font-light text-gray-800">Get in Touch</h2>
              <p className="mb-8 text-lg text-gray-600">
                I'd love to connect with fellow art enthusiasts, collectors, or anyone interested in commissioning a
                custom piece.
              </p>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-taupe-400" />
                  <span className="text-gray-600">hello@linasoul.art</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-taupe-400" />
                  <span className="text-gray-600">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-taupe-400" />
                  <span className="text-gray-600">Portland, Oregon</span>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="mb-4 text-lg font-medium text-gray-800">Studio Visits</h3>
                <p className="text-gray-600">
                  Private studio visits are available by appointment. Experience the artwork in person and learn about
                  my creative process.
                </p>
              </div>
            </div>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-8">
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="contact-name">Name</Label>
                    <Input
                      id="contact-name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm((prev) => ({ ...prev, name: e.target.value }))}
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="contact-email">Email</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm((prev) => ({ ...prev, email: e.target.value }))}
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="contact-message">Message</Label>
                    <Textarea
                      id="contact-message"
                      value={contactForm.message}
                      onChange={(e) => setContactForm((prev) => ({ ...prev, message: e.target.value }))}
                      placeholder="Your message..."
                      className="mt-1 min-h-[120px]"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full bg-[#f9f5ec] text-gray-800 hover:bg-[#f2e8dc]" size="lg">
                    Send Message
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
            <div className="flex h-16 items-center mt-1"> {/* hier mt-1 oder mt-2 für mehr */}
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
            <p className="mb-4 text-gray-400">Abstract Acrylic Artist • Creating art that touches the soul</p>
            <p className="text-sm text-gray-500">© 2024 Linasoul. All rights reserved.</p>
          </div>
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
