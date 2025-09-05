// ----------------- POST: Neues Artwork anlegen -----------------
export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()

    const title = String(form.get("title") ?? "").trim()
    const descriptionRaw = String(form.get("description") ?? "").trim()
    const sizeRaw = String(form.get("size") ?? "").trim()

    // Währung: exakt 3 Buchstaben, in DEINER DB offenbar lowercase (eur)
    const currencyInput = String(form.get("currency") ?? "eur").trim()
    const currency = /^[A-Za-z]{3}$/.test(currencyInput) ? currencyInput.toLowerCase() : "eur"

    // Preis -> Cents (Komma erlauben)
    const priceStr = String(form.get("price") ?? "0").replace(/[^\d.,-]/g, "").replace(",", ".")
    const price_cents = Math.round((parseFloat(priceStr) || 0) * 100)

    // Checkbox/Toggle
    const availableVal = String(form.get("available") ?? "true").toLowerCase()
    const available = availableVal === "true" || availableVal === "on" || availableVal === "1"

    // Dateien
    const files = form.getAll("images").filter((f): f is File => f instanceof File)

    const contentTypeFrom = (f: File) => {
      if (f.type) return f.type
      const ext = (f.name.split(".").pop() || "").toLowerCase()
      if (ext === "jpg" || ext === "jpeg") return "image/jpeg"
      if (ext === "png") return "image/png"
      if (ext === "webp") return "image/webp"
      if (ext === "avif") return "image/avif"
      return "application/octet-stream"
    }

    const publicUrls: string[] = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (!file || file.size === 0) continue

      const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "")
      const safeName = `${Date.now()}_${i}.${ext}`.replace(/[^a-z0-9._-]/gi, "")
      const path = `uploads/${safeName}`

      const { error: upErr } = await supabaseServer.storage
        .from("artworks")
        .upload(path, file, { contentType: contentTypeFrom(file), upsert: false })

      if (upErr) {
        // Upload-Fehler klar zurückgeben
        return NextResponse.json({ error: `Upload fehlgeschlagen: ${upErr.message}` }, { status: 400 })
      }

      const { data: pub } = supabaseServer.storage.from("artworks").getPublicUrl(path)
      if (pub?.publicUrl) publicUrls.push(pub.publicUrl)
    }

    // WICHTIG für dein Schema:
    // - images = jsonb -> Array speichern (kein JSON.stringify)
    // - leere Strings -> null, damit CHECKs nicht mit "" kollidieren
    const payload = {
      title,                              // text (required)
      description: descriptionRaw || null, // text
      size: sizeRaw || null,               // text (NULL wenn leer)
      price_cents,                         // int8
      currency,                            // text, bei dir lowercase
      available,                           // boolean
      images: publicUrls,                  // jsonb array
    }

    const { data, error } = await supabaseServer
      .from("artworks")
      .insert([payload])
      .select()
      .single()

    if (error) {
      const anyErr: any = error
      console.error("Supabase insert error:", anyErr)
      return NextResponse.json(
        {
          error: anyErr.message || "Insert-Fehler",
          details: anyErr.details ?? null,
          hint: anyErr.hint ?? null,
          code: anyErr.code ?? null,
          payload, // nur für Debug
        },
        { status: 400 },
      )
    }

    return NextResponse.json({ ok: true, artwork: data })
  } catch (e: any) {
    console.error("POST /api/artworks failed:", e)
    return NextResponse.json({ error: e?.message || "Unbekannter Fehler", stack: e?.stack ?? null }, { status: 500 })
  }
}
