"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "../cart/CartProvider";

export default function SuccessPage() {
  const { clear } = useCart();

  useEffect(() => {
    // Warenkorb local leeren (die tatsächliche Verfügbarkeits-Umstellung macht der Webhook)
    clear();
  }, [clear]);

  return (
    <main className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="mb-3 text-3xl font-light">Danke für deinen Kauf! 🎉</h1>
      <p className="text-gray-600 mb-8">
        Wir haben deine Bestellung erhalten. Du bekommst gleich eine Bestätigung per E-Mail.
      </p>
      <Link href="/" className="underline">Zur Startseite</Link>
    </main>
  );
}
