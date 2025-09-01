"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { ShoppingCart, Menu, X } from "lucide-react"
import { useCart } from "../app/cart/CartProvider"

function CartButton() {
  const { count } = useCart()
  return (
    <Link
      href="/cart"
      className="relative inline-flex h-10 w-10 items-center justify-center text-gray-800"
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

export default function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  // ESC schließt das Menü
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-taupe-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center mt-4">
          <Image
            src="/images/Logo_schwarz_2.png"
            alt="Linasoul Logo"
            width={120}
            height={40}
            priority
          />
        </Link>

        {/* Desktop-Links */}
        <div className="hidden items-center gap-6 md:flex">
          <Link href="/#about" className="hover:text-taupe-400">
            Künstler
          </Link>
          <Link href="/#gallery" className="hover:text-taupe-400">
            Galerie
          </Link>
          <Link href="/#contact" className="hover:text-taupe-400">
            Kontakt
          </Link>
          <CartButton />
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-3 md:hidden">
          <CartButton />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menü öffnen/schließen"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-gray-800 hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-black/20"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden">
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          {/* Slide-in Panel */}
          <div className="fixed right-0 top-0 z-50 h-full w-72 transform bg-white shadow-xl transition-transform duration-300 ease-in-out">
            <div className="flex h-16 items-center justify-between px-4 border-b">
              <span className="text-lg font-medium text-gray-800">Menü</span>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Menü schließen"
                className="p-2 text-gray-800 hover:bg-black/5 rounded-md"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex flex-col gap-4 p-6 text-lg">
              <Link href="/#about" onClick={() => setMobileOpen(false)}>
                Künstler
              </Link>
              <Link href="/#gallery" onClick={() => setMobileOpen(false)}>
                Galerie
              </Link>
              <Link href="/#contact" onClick={() => setMobileOpen(false)}>
                Kontakt
              </Link>
            </nav>
          </div>
        </div>
      )}
    </nav>
  )
}
