// app/api/artworks/route.ts
import "server-only"
import { NextRequest, NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabaseServer"

export const runtime = "nodejs"

function jsonError(err: any, status = 500) {
  const any = err || {}
  return NextResponse.json(
    {
      error: any.message || any.toString?.() || "Fehler",
      details: any.details ?? null,
      hint: any.hint ?? null,
      code: any.code ?? null,
    },
    { status },
  )
}

/* ------------------------- GET: Karten laden ------------------------- */
export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from("artworks")
      .select(
        "id, title, description, price_cents, currency, available, images, size, created_at",
      )
      .order("created_at", { ascending: false })

    if (error) return jsonError(error, 500)

    const artworks =
      (data ?? []).map((row: any) => ({
        id: String(row.id),
        title: row.title ?? "",
        description: row.description ?? "",
        price_cents: Number(row.price_cents ?? 0),
        currency: String(row.currency ?? "eur").toLowerCase(),
        available: Boolean(row.available),
        size: row.size ?? "",
        // images ist jsonb (Array) – aber wir normalisieren trotzdem defensiv
        images: Array.isArray(row.images)
          ? row.images.filter((u: any) => typeof u === "string" && u.trim())
          : (() => {
              if (!row.images) return []
              try {
                const parsed = typeof row.images === "string" ? JSON.parse(row.images) : []
                return Array.isArray(parsed)
                  ? parsed.filter((u: any) => typeof u === "string" && u.trim())
                  : []
              } catch {
                return []
              }
            })(),
      })) ?? []

    return NextResponse.json({ artworks }, { status: 200 })
  } catch (e: any) {
    return jsonError(e, 500)
  }
}

/* ------------------------- POST: Neues Artwork ----------------------- */
export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()

    const title = String(form.get("title") ?? "").trim()
    const description = (String(form.get("description") ?? "").trim()) || null
    const size = (String(form.get("size") ?? "").trim()) || null

    // currency in deiner DB lowercase (eur)
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
        .upload(path, file, {
          contentType: file.type || "application/octet-stream",
          upsert: false,
        })

      if (upErr) {
        return NextResponse.json({ error: `Upload fehlgeschlagen: ${upErr.message}` }, { status: 400 })
      }

      const { data: pub } = supabaseServer.storage.from("artworks").getPublicUrl(path)
      if (pub?.publicUrl) publicUrls.push(pub.publicUrl)
    }

    const payload = {
      title,
      description,          // null wenn leer
      size,                 // null wenn leer
      price_cents,          // int
      currency,             // "eur"
      available,            // boolean
      images: publicUrls,   // jsonb ARRAY (kein JSON.stringify)
    }

    const { data, error } = await supabaseServer
      .from("artworks")
      .insert([payload])
      .select()
      .single()

    if (error) return jsonError(error, 400)

    return NextResponse.json({ ok: true, artwork: data })
  } catch (e: any) {
    return jsonError(e, 500)
  }
}

/* ------------------------- OPTIONS (optional) ------------------------ */
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 })
}

