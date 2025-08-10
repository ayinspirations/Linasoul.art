import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabaseServer"

export async function GET() {
  const { data, error } = await supabaseServer
    .from("artworks")
    // size hinzufügen + created_at optional mitselektieren (wir sortieren ja danach)
    .select("id, title, description, price_cents, currency, available, images, size, created_at")
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // defensive mapping: images immer als string[], Fallbacks setzen
  const artworks = (data ?? []).map((row: any) => ({
    id: String(row.id),
    title: row.title ?? "",
    description: row.description ?? "",
    price_cents: Number(row.price_cents ?? 0),
    currency: row.currency ?? "EUR",
    available: !!row.available,
    size: row.size ?? "", // <- neu
    images: Array.isArray(row.images)
      ? row.images
      : row.images
      ? [row.images]
      : [],
  }))

  return NextResponse.json({ artworks })
}

