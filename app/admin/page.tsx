export default function AdminCreateArtwork() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 text-gray-800">
      <h1 className="mb-6 text-3xl font-light text-gray-900">Admin-Bereich</h1>
      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-lg">
        <h2 className="mb-4 text-2xl font-medium">Backend deaktiviert</h2>
        <p className="mb-4 leading-relaxed text-gray-600">
          Die Supabase- und Stripe-Integration wurde entfernt. Aktuell ist kein Admin-Upload oder Backend-Checkout verfügbar.
        </p>
        <p className="text-sm text-gray-500">
          Wenn du den Shop weiter betreiben möchtest, muss ein neues Backend für Artwork-Verwaltung und Checkout eingerichtet werden.
        </p>
      </div>
    </main>
  )
}
