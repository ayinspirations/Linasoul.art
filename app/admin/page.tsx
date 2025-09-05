"use client"

import { useState } from "react"
import { supabaseClient } from "@/lib/supabaseClient"

type SignedUpload =
  | { path: string; token: string; signedUrl?: string }
  | { path: string; token?: string; signedUrl: string }

export default function AdminCreateArtwork() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const formEl = e.currentTarget
    const fd = new FormData(formEl)

    // Checkbox & Currency normalisieren
    const availableInput = formEl.elements.namedItem("available") as HTMLInputElement | null
    fd.set("available", availableInput?.checked ? "true" : "false")
    const currencyInput = formEl.elements.namedItem("currency") as HTMLInputElement | null
    if (currencyInput?.value) fd.set("currency", currencyInput.value.toUpperCase())

    // Dateien
    const imagesInput = formEl.elements.namedItem("images") as HTMLInputElement | null
    const files = imagesInput?.files ? Array.from(imagesInput.files).filter((f) => f && f.size > 0) : []

    try {
      // ---------- 1) Signed Uploads anfordern ----------
      let publicUrls: string[] = []
      if (files.length) {
        const meta = files.map((f) => ({ name: f.name, type: f.type }))
        const signRes = await fetch("/api/admin/storage/signed-upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ files: meta }),
        })
        const signJson = await signRes.json()
        if (!signRes.ok) throw new Error(`[Sign] ${signJson?.error || "Signed upload failed"}`)

        const uploads: SignedUpload[] = signJson.uploads || []
        if (uploads.length !== files.length) {
          throw new Error("[Sign] Upload tokens count mismatch")
        }

        // ---------- 2) Dateien hochladen (kompatibel zu beiden SDK-Signaturen) ----------
        const bucket = supabaseClient.storage.from("artworks")
        for (let i = 0; i < files.length; i++) {
          const file = files[i]
          const up = uploads[i] as any

          let upErr
          if (up?.signedUrl) {
            // Variante A: signedUrl + file
            const { error } = await bucket.uploadToSignedUrl(up.signedUrl, file, {
              contentType: file.type || "application/octet-stream",
              upsert: false,
            })
            upErr = error
          } else if (up?.path && up?.token) {
            // Variante B: path + token + file
            const { error } = await bucket.uploadToSignedUrl(up.path, up.token, file, {
              contentType: file.type || "application/octet-stream",
              upsert: false,
            })
            upErr = error
          } else {
            throw new Error("[Upload] Missing signedUrl or token")
          }

          if (upErr) throw new Error(`[Upload] ${upErr.message}`)

          const { data: pub } = bucket.getPublicUrl(up.path)
          if (pub?.publicUrl) publicUrls.push(pub.publicUrl)
        }
      }

      // ---------- 3) Metadaten speichern ----------
      const metaForm = new FormData()
      metaForm.set("title", String(fd.get("title") || ""))
      metaForm.set("description", String(fd.get("description") || ""))
      metaForm.set("size", String(fd.get("size") || ""))
      metaForm.set("currency", String(fd.get("currency") || "EUR"))
      metaForm.set("price", String(fd.get("price") || "0"))
      metaForm.set("available", String(fd.get("available") || "false"))
      metaForm.set("image_urls_json", JSON.stringify(publicUrls))

      const saveRes = await fetch("/api/artworks", { method: "POST", body: metaForm })
      const text = await saveRes.text()
      let json: any = null
      try { json = JSON.parse(text) } catch {}
      if (!saveRes.ok) {
        throw new Error(`[Save] ${(json && (json.error || json.details || json.hint)) || text || "Fehler beim Speichern"}`)
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

      <form onSubmit={onSubmit} className="space-y-4">
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
