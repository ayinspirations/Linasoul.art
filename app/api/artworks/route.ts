export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()

    const title = String(form.get("title") ?? "").trim()
    const description = (String(form.get("description") ?? "").trim()) || null
    const size = (String(form.get("size") ?? "").trim()) || null

    const currencyInput = String(form.get("currency") ?? "eur").trim()
    const currency = /^[A-Za-z]{3}$/.test(currencyInput) ? currencyInput.toLowerCase() : "eur"

    const priceStr = String(form.get("price") ?? "0").replace(/[^\d.,-]/g, "").replace(",", ".")
    const price_cents = Math.round((parseFloat(priceStr) || 0) * 100)

    const availableVal = String(form.get("available") ?? "true").toLowerCase()
    const available = ["true", "on", "1"].includes(availableVal)

    const files = form.getAll("images").filter((f): f is File => f instanceof File)

    const publicUrls: string[] = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (!file || file.size === 0) continue

      const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "")
      const safeName = `${Date.now()}_${i}.${ext}`.replace(/[^a-z0-9._-]/gi, "")
      const path = `uploads/${safeName}`

      const { error: upErr } = await supabaseServer.storage
        .from("artworks")
        .upload(path, file, { contentType: file.type || "application/octet-stream", upsert: false })

      if (upErr) {
        return NextResponse.json({ error: `Upload fehlgeschlagen: ${upErr.message}` }, { status: 400 })
      }

      const { data: pub } = supabaseServer.storage.from("artworks").getPublicUrl(path)
      if (pub?.publicUrl) publicUrls.push(pub.publicUrl)
    }

    const payload = {
      title,
      description,
      size,
      price_cents,
      currency,       // "eur"
      available,
      images: publicUrls, // jsonb array
    }

    const { data, error } = await supabaseServer
      .from("artworks")
      .insert([payload])
      .select()
      .single()

    if (error) {
      const anyErr: any = error
      return NextResponse.json(
        { error: anyErr.message, details: anyErr.details ?? null, hint: anyErr.hint ?? null, code: anyErr.code ?? null },
        { status: 400 }
      )
    }

    return NextResponse.json({ ok: true, artwork: data })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unbekannter Fehler" }, { status: 500 })
  }
}
