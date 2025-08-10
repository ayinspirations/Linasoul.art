"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "./CartProvider";
import { useState } from "react";

export default function CartPage() {
  const { items, remove, clear, totalCents } = useCart();
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const totalFmt = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: (items[0]?.currency || "eur").toUpperCase(),
  }).format(totalCents / 100);

  async function checkout() {
    if (!acceptTerms) {
      alert("Bitte AGB und Bedingungen akzeptieren.");
      return;
    }
    if (items.length === 0) {
      alert("Der Warenkorb ist leer.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Wir senden jetzt mehrere Artikel (IDs)
        body: JSON.stringify({ items: items.map((i) => i.id) }),
      });
      const json = await res.json();
      if (json?.url) window.location.href = json.url;
      else alert(json?.error || "Fehler beim Checkout");
    } catch (e: any) {
      alert(e?.message || "Fehler");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="mb-6 text-3xl font-light">Warenkorb</h1>

      {/* Wenn leer: trotzdem Bedingungen/AGB anzeigen */}
      {items.length === 0 ? (
        <div className="rounded border p-6 bg-white">
          <p className="mb-4 text-gray-700">
            Dein Warenkorb ist leer. Du kannst dennoch unsere Bedingungen und AGB einsehen:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
            <li>
              <Link href="/agb" className="underline">Allgemeine Geschäftsbedingungen (AGB)</Link>
            </li>
            <li>
              <Link href="/widerruf" className="underline">Widerrufsbelehrung</Link>
            </li>
            <li>
              <Link href="/datenschutz" className="underline">Datenschutzerklärung</Link>
            </li>
          </ul>

          <div className="mt-6 flex items-center gap-2">
            <input
              id="terms-empty"
              type="checkbox"
              className="h-4 w-4"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
            />
            <label htmlFor="terms-empty" className="text-sm text-gray-700">
              Ich habe die AGB, Widerrufsbelehrung und Datenschutzerklärung gelesen und akzeptiere sie.
            </label>
          </div>

          <div className="mt-4">
            <Link href="/#gallery" className="underline">
              Zur Galerie
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="rounded border bg-white divide-y">
            {items.map((it) => (
              <div key={it.id} className="flex items-center gap-4 p-4">
                {it.image ? (
                  <Image src={it.image} alt={it.title} width={72} height={72} className="h-18 w-18 object-cover rounded" />
                ) : (
                  <div className="h-18 w-18 rounded bg-gray-200" />
                )}
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{it.title}</p>
                  <p className="text-sm text-gray-500">
                    {new Intl.NumberFormat("de-DE", {
                      style: "currency",
                      currency: (it.currency || "eur").toUpperCase(),
                    }).format((it.price_cents || 0) / 100)}
                  </p>
                </div>
                <button
                  onClick={() => remove(it.id)}
                  className="rounded border px-3 py-1 text-sm hover:bg-gray-50"
                >
                  Entfernen
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <button onClick={clear} className="text-sm underline">
              Warenkorb leeren
            </button>
            <div className="text-right">
              <p className="text-gray-600 text-sm">Zwischensumme</p>
              <p className="text-xl font-medium">{totalFmt}</p>
            </div>
          </div>

          <div className="mt-6 space-y-3 rounded border bg-white p-4">
            <div className="flex items-start gap-2">
              <input
                id="terms"
                type="checkbox"
                className="mt-1 h-4 w-4"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
              />
              <label htmlFor="terms" className="text-sm text-gray-700">
                Ich habe die{" "}
                <Link href="/agb" className="underline">AGB</Link>,{" "}
                <Link href="/widerruf" className="underline">Widerrufsbelehrung</Link> und{" "}
                <Link href="/datenschutz" className="underline">Datenschutzerklärung</Link> gelesen und akzeptiere sie.
              </label>
            </div>

            <button
              onClick={checkout}
              disabled={!acceptTerms || loading}
              className="w-full rounded bg-black px-4 py-3 text-white disabled:opacity-50"
            >
              {loading ? "Weiter zur Zahlung…" : "Zur Zahlung (Stripe)"}
            </button>
          </div>
        </>
      )}
    </main>
  );
}
