// ----------------- POST: Neues Artwork anlegen -----------------
export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()

    const title = String(form.get("title") ?? "").trim()
    const description = String(form.get("description") ?? "").trim()
    const size = String(form.get("size") ?? "").trim()

    // Währung: 3 Buchstaben, zur Sicherheit auf uppercase normalisieren
    const currencyRaw = String(form.get("currency") ?? "EUR").trim()
    const currency = currencyRaw.toUpperCase()

    // Preis -> Cents
    const priceStr = String(form.get("price") ?? "0").replace(",", ".")
    const price_cents = Math.round((parseFloat(priceStr) || 0) * 100)

    // Checkbox/Toggle
    const available = String(form.get("available") ?? "true") === "true"

    // Dateien aufs Storage laden
    const files = form.getAll("images").filter((f): f is File => f instanceof File)

    const extFromType = (file: File) => {
      const map: Record<string, string> = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/webp": "webp",
        "image/avif": "avif",
      }
      return map[file.type] || (file.name.split(".").pop() || "jpg")
    }

    const publicUrls: string[] = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (!file || file.size === 0) continue

      const ext = extFromType(file).toLowerCase()
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

    // 👉 WICHTIG: images als STRING speichern (JSON), damit es in text/jsonb/text[]-Setups nicht kollidiert
    const payload: any = {
      title,
      description,
      size,
      price_cents,
      currency,
      available,
      images: JSON.stringify(publicUrls), // <— hier der Fix
    }

    const { data, error } = await supabaseServer
      .from("artworks")
      .insert([payload])
      .select()
      .single()

    if (error) {
      // mehr Details zurückgeben hilft beim Debuggen
      // @ts-ignore
      const details = error.details || error.hint || ""
      return NextResponse.json({ error: `${error.message}${details ? ` – ${details}` : ""}` }, { status: 400 })
    }

    return NextResponse.json({ ok: true, artwork: data })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unbekannter Fehler" }, { status: 500 })
  }
}
