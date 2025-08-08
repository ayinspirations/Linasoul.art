"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Mail, Phone, MapPin, Heart, Palette, Send } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

export default function LinasoulPortfolio() {
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  })

  const [inquiryForm, setInquiryForm] = useState({
    name: "",
    email: "",
    artwork: "",
    message: "",
  })

  const artworks = [
    {
      id: 1,
      title: "Ethereal Dreams",
      size: '24" x 36"',
      medium: "Acrylic on Canvas",
      price: "$850",
      available: true,
      image: "/placeholder.svg?height=600&width=400",
    },
    {
      id: 2,
      title: "Golden Whispers",
      size: '30" x 40"',
      medium: "Acrylic on Canvas",
      price: "$1,200",
      available: true,
      image: "/placeholder.svg?height=600&width=450",
    },
    {
      id: 3,
      title: "Ocean's Memory",
      size: '18" x 24"',
      medium: "Acrylic on Canvas",
      price: "$650",
      available: false,
      image: "/placeholder.svg?height=600&width=400",
    },
    {
      id: 4,
      title: "Sunset Reverie",
      size: '36" x 48"',
      medium: "Acrylic on Canvas",
      price: "$1,800",
      available: true,
      image: "/placeholder.svg?height=600&width=500",
    },
    {
      id: 5,
      title: "Forest Meditation",
      size: '20" x 30"',
      medium: "Acrylic on Canvas",
      price: "$750",
      available: true,
      image: "/placeholder.svg?height=600&width=400",
    },
    {
      id: 6,
      title: "Cosmic Dance",
      size: '32" x 44"',
      medium: "Acrylic on Canvas",
      price: "$1,400",
      available: true,
      image: "/placeholder.svg?height=600&width=450",
    },
  ]

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle contact form submission
    console.log("Contact form submitted:", contactForm)
  }

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle inquiry form submission
    console.log("Inquiry form submitted:", inquiryForm)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-rose-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Palette className="h-6 w-6 text-rose-400" />
              <span className="text-2xl font-light text-gray-800 font-amsterdam-two">Linasoul</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#home" className="text-gray-600 hover:text-rose-400 transition-colors">
                Home
              </a>
              <a href="#about" className="text-gray-600 hover:text-rose-400 transition-colors">
                About
              </a>
              <a href="#gallery" className="text-gray-600 hover:text-rose-400 transition-colors">
                Gallery
              </a>
              <a href="#purchase" className="text-gray-600 hover:text-rose-400 transition-colors">
                Purchase
              </a>
              <a href="#contact" className="text-gray-600 hover:text-rose-400 transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-16 min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Abstract Painting Background */}
        <div className="absolute inset-0">
          {/* Background Image with Transparency */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
            style={{
              backgroundImage: "url('/images/abstract-background.jpeg')"
            }}
          />
          {/* Subtle white overlay for better text readability */}
          <div className="absolute inset-0 bg-white/20" />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-6xl md:text-8xl text-black mb-6 drop-shadow-lg font-amsterdam-two">
            Lina<span className="text-amber-100">soul</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-800 mb-8 font-light drop-shadow-md">Abstract Acrylic Artist</p>
          <p className="text-lg text-gray-700 mb-12 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            Exploring the depths of emotion through fluid forms and ethereal colors, creating pieces that speak to the
            soul and inspire contemplation.
          </p>
          <Button
            size="lg"
            className="bg-rose-400 hover:bg-rose-500 text-white px-8 py-3 rounded-full shadow-lg"
            onClick={() => document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" })}
          >
            View My Work
          </Button>
        </div>

        {/* Featured Artwork Preview */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
          <div className="w-32 h-20 rounded-lg overflow-hidden shadow-lg">
            <Image
              src="/placeholder.svg?height=80&width=128"
              alt="Featured artwork preview"
              width={128}
              height={80}
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-light text-gray-800 mb-6">About the Artist</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
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
                <Heart className="h-5 w-5 text-rose-400" />
                <span className="text-gray-600">Creating art that touches the soul</span>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/placeholder.svg?height=500&width=500"
                  alt="Lina in her studio"
                  width={500}
                  height={500}
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center">
                <Palette className="h-8 w-8 text-rose-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 bg-gradient-to-br from-blue-50 to-rose-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-800 mb-4">Gallery</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A collection of my recent works, each piece telling its own story through color, texture, and form.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {artworks.map((artwork) => (
              <Card
                key={artwork.id}
                className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <Image
                    src={artwork.image || "/placeholder.svg"}
                    alt={artwork.title}
                    width={400}
                    height={600}
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-medium text-gray-800">{artwork.title}</h3>
                    <Badge variant={artwork.available ? "default" : "secondary"} className="ml-2">
                      {artwork.available ? "Available" : "Sold"}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-1">{artwork.size}</p>
                  <p className="text-gray-500 text-sm mb-3">{artwork.medium}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-black">{artwork.price}</span>
                    {artwork.available && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setInquiryForm((prev) => ({ ...prev, artwork: artwork.title }))
                          document.getElementById("purchase")?.scrollIntoView({ behavior: "smooth" })
                        }}
                      >
                        Inquire
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Purchase Inquiry Section */}
      <section id="purchase" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-light text-gray-800 mb-4">Purchase Inquiry</h2>
            <p className="text-lg text-gray-600">Interested in acquiring a piece? I'd love to hear from you.</p>
          </div>

          <Card className="shadow-lg border-0">
            <CardContent className="p-8">
              <form onSubmit={handleInquirySubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
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

                <Button type="submit" className="w-full bg-rose-400 hover:bg-rose-500 text-white" size="lg">
                  <Send className="h-4 w-4 mr-2" />
                  Send Inquiry
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-br from-rose-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-4xl font-light text-gray-800 mb-6">Get in Touch</h2>
              <p className="text-lg text-gray-600 mb-8">
                I'd love to connect with fellow art enthusiasts, collectors, or anyone interested in commissioning a
                custom piece.
              </p>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-rose-400" />
                  <span className="text-gray-600">hello@linasoul.art</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-rose-400" />
                  <span className="text-gray-600">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-rose-400" />
                  <span className="text-gray-600">Portland, Oregon</span>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Studio Visits</h3>
                <p className="text-gray-600">
                  Private studio visits are available by appointment. Experience the artwork in person and learn about
                  my creative process.
                </p>
              </div>
            </div>

            <Card className="shadow-lg border-0">
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

                  <Button type="submit" className="w-full bg-rose-400 hover:bg-rose-500 text-white" size="lg">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Palette className="h-6 w-6 text-rose-400" />
              <span className="text-2xl font-light font-amsterdam-two">Linasoul</span>
            </div>
            <p className="text-gray-400 mb-4">Abstract Acrylic Artist • Creating art that touches the soul</p>
            <p className="text-gray-500 text-sm">© 2024 Linasoul. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
