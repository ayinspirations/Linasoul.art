import { NextRequest, NextResponse } from "next/server"
import "server-only"
import { supabaseServer } from "@/lib/supabaseServer"

export const runtime = "nodejs" // für Datei-Uploads

// ----------------- GET: Alle Artworks abrufen -----------------
export async function GET() {
  const { data, error } = await supabaseServer
    .from("artworks")
    .select("id, title, description, price_cents, currency, available, images, size, created_at")
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const artworks = (data ?? []).map((row: any) => ({
    id: String(row.id),
    title: row.title ?? "",
    description: row.description ?? "",
    price_cents: Number(row.price_cents ?? 0),
    currency: row.currency ?? "EUR",
    available: !!row.available,
    size: row.size ?? "",
    images: Array.isArray(row.images) ? row.images : row.images ? [row.images] : [],
  }))

  return NextResponse.json({ artworks })
}

// ----------------- POST: Neues Artwork anlegen -----------------
export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()

    const title = String(form.get("title") ?? "")
    const description = String(form.get("description") ?? "")
    const size = String(form.get("size") ?? "")
    const currency = String(form.get("currency") ?? "EUR").toUpperCase()
    const priceStr = String(form.get("price") ?? "0").replace(",", ".")
    const price_cents = Math.round(parseFloat(priceStr || "0") * 100)
    const available = String(form.get("available") ?? "true") === "true"

    const files = form.getAll("images").filter((f): f is File => f instanceof File)

    const publicUrls: string[] = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (!file || file.size === 0) continue

      const ext = file.name.split(".").pop() || "jpg"
      const filename = `${Date.now()}_${i}.${ext}`
      const path = `uploads/${filename}`

      const { error: upErr } = await supabaseServer.storage
        .from("artworks")
        .upload(path, file, { contentType: file.type, upsert: false })

      if (upErr) {
        return NextResponse.json({ error: `Upload fehlgeschlagen: ${upErr.message}` }, { status: 400 })
      }

      const { data: pub } = supabaseServer.storage.from("artworks").getPublicUrl(path)
      if (pub?.publicUrl) publicUrls.push(pub.publicUrl)
    }

    const { data, error } = await supabaseServer
      .from("artworks")
      .insert([
        {
          title,
          description,
          size,
          price_cents,
          currency,
          available,
          images: publicUrls,
        },
      ])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ ok: true, artwork: data })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Unbekannter Fehler" }, { status: 500 })
  }
}
