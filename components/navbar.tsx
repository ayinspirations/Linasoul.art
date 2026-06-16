"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"

const navItems = [
  { label: "Künstler", href: "/#about", section: "about" },
  { label: "Galerie", href: "/#gallery", section: "gallery" },
]

export default function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<string>("home")

  useEffect(() => {
    const sections = ["home", "about", "gallery", "contact"]
    const observers: IntersectionObserver[] = []

    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id)
        },
        { threshold: 0.4 }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  return (
    <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="inline-flex items-center mt-5">
          <Image
            src="/images/Logo_schwarz_2.png"
            alt="Linasoul Logo"
            width={120}
            height={40}
            priority
          />
        </Link>

        {/* Desktop pill nav */}
        <div className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => {
            const isActive = activeSection === item.section
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#171717] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.label}
              </Link>
            )
          })}
          <Link
            href="/#contact"
            className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 ${
              activeSection === "contact"
                ? "bg-rose-400 text-white"
                : "bg-rose-100 text-rose-900 hover:bg-rose-200"
            }`}
          >
            Kontakt
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menü öffnen/schließen"
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md text-gray-800 hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-black/20"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-white px-6 pb-6 pt-2 shadow-lg border-t border-gray-100">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-full px-5 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/#contact"
              onClick={() => setMobileOpen(false)}
              className="rounded-full px-5 py-3 text-base font-medium bg-rose-100 text-rose-900 hover:bg-rose-200 transition-colors"
            >
              Kontakt
            </Link>
          </nav>
        </div>
      )}
    </nav>
  )
}
