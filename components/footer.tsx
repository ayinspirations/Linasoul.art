import Link from "next/link"
import Image from "next/image"
import { Instagram } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-[#dfd6ce] py-12 text-black mt-16">
      <div className="mx-auto max-w-6xl px-4 text-center">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <Link href="/">
            <Image
              src="/images/Logo_weiss_2.png"
              alt="Linasoul Logo"
              width={120}
              height={40}
            />
          </Link>
        </div>

        {/* Claim */}
        <p className="mb-2 text-black">
          Abstract Acrylic Artist • Creating art that touches the soul
        </p>

        {/* Socials */}
        <div className="flex justify-center gap-6 mb-6 mt-4">
          <Link
            href="https://www.instagram.com/linasoul.art"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="hover:text-pink-400 transition-colors"
          >
            <Instagram className="h-6 w-6" />
          </Link>
        </div>

        {/* Footer Links */}
        <div className="space-x-4 text-sm">
          <Link href="/impressum" className="hover:underline">Impressum</Link>
          <Link href="/datenschutz" className="hover:underline">Datenschutz</Link>
          <Link href="/agb" className="hover:underline">AGB</Link>
          <Link href="/widerruf" className="hover:underline">Widerruf</Link>
        </div>
      </div>
    </footer>
  )
}
