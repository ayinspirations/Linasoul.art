// app/success/page.tsx
"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "../cart/CartProvider";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { track } from "@vercel/analytics";

function SuccessContent() {
  const { clear } = useCart();
  const params = useSearchParams();
  const sessionId = params.get("session_id"); // falls Stripe die Session-ID zurückgibt

  useEffect(() => {
    // Analytics: Kauf abgeschlossen
    track("Purchase Completed", {
      session_id: sessionId || undefined,
    });

    // Warenkorb leeren
    clear();
  }, [clear, sessionId]);

  // kleine, stabile Referenz (optional)
  const shortRef =
    sessionId && sessionId.length > 6
      ? `#${sessionId.slice(-6).toUpperCase()}`
      : null;

  return (
    <main className="relative mx-auto max-w-2xl px-6 py-24 text-center">
      {/* dezente Deko */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-white via-blue-50/40 to-transparent" />

      {/* Icon */}
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className="h-9 w-9 text-green-600"
          fill="currentColor"
        >
          <path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
        </svg>
      </div>

      <h1 className="mb-3 text-3xl font-light">Danke für deinen Kauf! 🎉</h1>

      <p className="mx-auto max-w-xl text-gray-600">
        Wir haben deine Bestellung erhalten{shortRef ? ` (${shortRef})` : ""}.
        Du bekommst gleich eine Bestätigung per E-Mail. Hebe sie bitte für deine
        Unterlagen auf.
      </p>

      {/* Info-Karte */}
      <div className="mx-auto mt-8 inline-block text-left">
        <div className="rounded-xl border border-gray-200 bg-white/80 p-5 shadow-sm backdrop-blur">
          <ul className="space-y-2 text-sm text-gray-700">
            <li>
              →{" "}
              <Link href="/agb" className="underline hover:text-gray-900">
                AGB
              </Link>{" "}
              &nbsp;·&nbsp;{" "}
              <Link
                href="/widerruf"
                className="underline hover:text-gray-900"
              >
                Widerrufsbelehrung
              </Link>
            </li>
            <li>
              → Fragen? Schreib uns:{" "}
              <a
                href="mailto:linasoul.art@gmx.de"
                className="underline hover:text-gray-900"
              >
                linasoul.art@gmx.de
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* CTAs */}
      <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href="/#gallery"
          className="rounded-full bg-black px-5 py-2.5 text-white hover:bg-gray-900"
        >
          Weiter stöbern
        </Link>
        <Link
          href="/"
          className="rounded-full border border-gray-300 px-5 py-2.5 text-gray-700 hover:bg-gray-100"
        >
          Zur Startseite
        </Link>
      </div>

      {/* kleiner Hinweis */}
      <p className="mt-6 text-xs text-gray-500">
        Rechnung und Versanddetails erhältst du per E-Mail, sobald die Zahlung
        bestätigt ist.
      </p>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="px-6 py-24 text-center">Lade…</div>}>
      <SuccessContent />
    </Suspense>
  );
}
