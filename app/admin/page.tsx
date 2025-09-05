"use client"

import { useState } from "react"

export default function AdminCreateArtwork() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const formEl = e.currentTarget
    const fd = new FormData(formEl)

    // Checkbox-Wert explizit als "true"/"false" setzen
    const availableInput = formEl.elements.namedItem("available") as HTMLInputElement | null
    fd.set("available", availableInput?.checked ? "true" : "false")

    // Währung auf Großbuchstaben normalisieren
    const currencyInput = formEl.elements.namedItem("currency") as HTMLInputElement | null
    if (currencyInput?.value) fd.set("currency", currencyInput.value.toUpperCase())

    // Dateien sicher re-anhängen (räumt Browser-Inkonsistenzen aus)
    const imagesInput = formEl.elements.namedItem("images") as HTMLInputElement | null
    if (imagesInput?.files) {
      fd.delete("images")
      Array.from(imagesInput.files).forEach((f) => fd.append("images", f))
    }

    try {
      // 🔁 KORREKTE API-Route & Methode
      const res = await fetch("/api/artworks", {
        method: "POST",
        body: fd, // keinen Content-Type manuell setzen!
      })

      // bessere Fehlersichtbarkeit
      const text = await res.text()
      let json: any = null
      try { json = JSON.parse(text) } catch {}
      if (!res.ok) {
        setMessage((json && (json.error || json.details || json.hint)) || text || "Fehler beim Speichern")
        return
      }

      setMessage("Gespeichert 🎉")
      formEl.reset()
    } catch (err: any) {
      setMessage(err?.message || "Fehler")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-3xl font-light">Neues Artwork anlegen</h1>

      <form onSubmit={onSubmit} className="space-y-4" encType="multipart/form-data">
        <div className="grid gap-4">
          <label className="block">
            <span className="text-sm text-gray-700">Titel</span>
            <input name="title" required className="mt-1 w-full rounded border p-2" autoComplete="off" />
          </label>

          <label className="block">
            <span className="text-sm text-gray-700">Beschreibung</span>
            <textarea name="description" rows={4} className="mt-1 w-full rounded border p-2" />
          </label>

          <label className="block">
            <span className="text-sm text-gray-700">Größe (z. B. 80 x 60 cm)</span>
            <input name="size" placeholder="80 x 60 cm" className="mt-1 w-full rounded border p-2" autoComplete="off" />
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
                inputMode="decimal"
                autoComplete="off"
              />
            </label>
            <label className="block">
              <span className="text-sm text-gray-700">Währung</span>
              <input
                name="currency"
                defaultValue="EUR"
                className="mt-1 w-full rounded border p-2"
                autoComplete="off"
                maxLength={3}
              />
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
