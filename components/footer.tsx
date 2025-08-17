import Link from "next/link"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="bg-blue-950 py-12 text-white mt-16">
      <div className="mx-auto max-w-6xl px-4 text-center">
        <div className="flex justify-center mb-4">
          <Link href="/">
            <Image src="/images/Logo_weiss_2.png" alt="Linasoul Logo" width={120} height={40} />
          </Link>
        </div>
        <p className="mb-2 text-gray-300">Abstract Acrylic Artist • Creating art that touches the soul</p>

        <div className="space-x-4 text-sm">
          <Link href="/impressum" className="hover:underline">Impressum</Link>
          <Link href="/dsgvo" className="hover:underline">Datenschutz</Link>
          <Link href="/agb" className="hover:underline">AGB</Link>
          <Link href="/widerruf" className="hover:underline">Widerruf</Link>
        </div>
      </div>
    </footer>
  )
}
