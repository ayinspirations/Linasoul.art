"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { ShoppingCart } from "lucide-react"
import { useCart } from "../app/cart/CartProvider"

function CartButton() {
  const { count } = useCart()
  return (
    <Link href="/cart" className="relative inline-flex items-center p-2 text-gray-800">
      <ShoppingCart className="h-6 w-6" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 rounded-full bg-black text-white text-xs flex items-center justify-center px-1">
          {count}
        </span>
      )}
    </Link>
  )
}

export default function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-taupe-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center mt-2">
          <Image src="/images/Logo_schwarz_2.png" alt="Linasoul Logo" width={120} height={40} priority />
        </Link>

        {/* Desktop-Links */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/#about" className="hover:text-taupe-400">Künstler</Link>
          <Link href="/#gallery" className="hover:text-taupe-400">Galerie</Link>
          <Link href="/#contact" className="hover:text-taupe-400">Kontakt</Link>
          <CartButton />
        </div>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-2">
          <CartButton />
          <button onClick={() => setMobileOpen(!mobileOpen)}>☰</button>
        </div>
      </div>
    </nav>
  )
}
