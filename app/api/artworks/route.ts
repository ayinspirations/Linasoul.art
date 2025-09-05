// ----------------- POST: Neues Artwork anlegen -----------------
export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()

    const title = String(form.get("title") ?? "").trim()
    const descriptionRaw = String(form.get("description") ?? "").trim()
    const sizeRaw = String(form.get("size") ?? "").trim()

    // Währung: exakt 3 Buchstaben (ISO-4217), sonst Fallback "EUR"
    const currencyInput = String(form.get("currency") ?? "EUR").trim()
    const currency = /^[A-Za-z]{3}$/.test(currencyInput) ? currencyInput.toUpperCase() : "EUR"

    // Preis -> Cents (Komma/Punkt)
    const priceStr = String(form.get("price") ?? "0").replace(/[^\d.,-]/g, "").replace(",", ".")
    const price_cents = Math.round((parseFloat(priceStr) || 0) * 100)

    // Checkbox/Toggle
    const availableVal = String(form.get("available") ?? "true").toLowerCase()
    const available = availableVal === "true" || availableVal === "on" || availableVal === "1"

    // Dateien aufs Storage laden
    const files = form.getAll("images").filter((f): f is File => f instanceof File)

    const extFromType = (file: File) => {
      const map: Record<string, string> = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/webp": "webp",
        "image/avif": "avif",
      }
      return (map[file.type] || (file.name.split(".").pop() || "jpg")).toLowerCase()
    }

    const publicUrls: string[] = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (!file || file.size === 0) continue

      const ext = extFromType(file)
      const filename = `${Date.now()}_${i}.${ext}`.replace(/[^a-z0-9._-]/gi, "")
      const path = `uploads/${filename}`

      const { error: upErr } = await supabaseServer.storage
        .from("artworks")
        .upload(path, file, { contentType: file.type || "application/octet-stream", upsert: false })

      if (upErr) {
        return NextResponse.json({ error: `Upload fehlgeschlagen: ${upErr.message}` }, { status: 400 })
      }

      const { data: pub } = supabaseServer.storage.from("artworks").getPublicUrl(path)
      if (pub?.publicUrl) publicUrls.push(pub.publicUrl)
    }

    // LEERE Strings -> null (wichtig bei CHECK/Regex-Constraints)
    const payload: any = {
      title, // UI hat "required", daher lassen wir es so
      description: descriptionRaw || null,
      size: sizeRaw || null,
      price_cents,
      currency,
      available,
      // WICHTIG: Wenn deine DB-Spalte `images` = jsonb oder text[] ist,
      // nimm die folgende Zeile (Array speichern):
      // images: publicUrls.length ? publicUrls : null,

      // Wenn `images` = text/varchar (ohne Array/JSON-Typ), nimm diese:
      images: publicUrls.length ? JSON.stringify(publicUrls) : null,
    }

    const { data, error } = await supabaseServer
      .from("artworks")
      .insert([payload])
      .select()
      .single()

    if (error) {
      // ausführlichere Fehler – hilft sofort beim Eingrenzen
      const anyErr: any = error
      return NextResponse.json(
        {
          error: anyErr.message || "Insert-Fehler",
          details: anyErr.details ?? null,
          hint: anyErr.hint ?? null,
          code: anyErr.code ?? null,
          payload, // Debug-Hilfe: siehst, was reinging (nur in DEV nutzen)
        },
        { status: 400 },
      )
    }

    return NextResponse.json({ ok: true, artwork: data })
  } catch (e: any) {
    // Serverseitiges Loggen hilft in den Vercel-Logs/CLI
    console.error("POST /api/artworks failed:", e)
    return NextResponse.json({ error: e?.message || "Unbekannter Fehler" }, { status: 500 })
  }
}
