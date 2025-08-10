"use client"

import { useState } from "react"

export default function AdminCreateArtwork() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const form = new FormData(e.currentTarget)

    try {
      const res = await fetch("/api/admin/artworks", {
        method: "POST",
        body: form,
      })
      const json = await res.json()
      if (!res.ok) {
        setMessage(json?.error || "Fehler beim Speichern")
      } else {
        setMessage("Gespeichert 🎉")
        e.currentTarget.reset()
      }
    } catch (err: any) {
      setMessage(err?.message || "Fehler")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-3xl font-light">Neues Artwork anlegen</h1>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-4">
          <label className="block">
            <span className="text-sm text-gray-700">Titel</span>
            <input name="title" required className="mt-1 w-full rounded border p-2" />
          </label>

          <label className="block">
            <span className="text-sm text-gray-700">Beschreibung</span>
            <textarea name="description" rows={4} className="mt-1 w-full rounded border p-2" />
          </label>

          <label className="block">
            <span className="text-sm text-gray-700">Größe (Format: 24 x 36)</span>
            <input name="size" placeholder="24 x 36" className="mt-1 w-full rounded border p-2" />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm text-gray-700">Preis</span>
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                placeholder="z. B. 850"
                className="mt-1 w-full rounded border p-2"
              />
            </label>
            <label className="block">
              <span className="text-sm text-gray-700">Währung</span>
              <input name="currency" defaultValue="EUR" className="mt-1 w-full rounded border p-2" />
            </label>
          </div>

          <label className="inline-flex items-center gap-2">
            <input type="checkbox" name="available" defaultChecked className="h-4 w-4" />
            <span className="text-sm text-gray-700">Verfügbar</span>
          </label>

          <label className="block">
            <span className="text-sm text-gray-700">Bilder (1–5 Dateien)</span>
            <input name="images" type="file" multiple accept="image/*" className="mt-1 w-full" />
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? "Speichert…" : "Speichern"}
        </button>

        {message && <p className="pt-2 text-sm text-gray-700">{message}</p>}
      </form>
    </main>
  )
}
