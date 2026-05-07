// app/api/artworks/route.ts
import { readFile } from "fs/promises"
import { join } from "path"
import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

async function loadArtworks() {
  try {
    const filePath = join(process.cwd(), "public", "artworks.json")
    const raw = await readFile(filePath, "utf-8")
    const data = JSON.parse(raw)
    if (!Array.isArray(data)) return []

    return data.map((item: any, index: number) => ({
      id: String(item.id ?? item.title ?? `artwork-${index}`),
      title: String(item.title ?? "Unbenannt"),
      description: String(item.description ?? ""),
      price_cents: Number(item.price_cents ?? 0),
      currency: String(item.currency ?? item.currency ?? "eur").toLowerCase(),
      available: item.available === undefined ? true : Boolean(item.available),
      images: Array.isArray(item.images)
        ? item.images.map(String).filter(Boolean)
        : item.image
        ? [String(item.image)]
        : [],
      size: String(item.size ?? ""),
    }))
  } catch {
    return []
  }
}

export async function GET() {
  const artworks = await loadArtworks()
  return NextResponse.json({ artworks }, { status: 200 })
}

export async function POST(_req: NextRequest) {
  return NextResponse.json({ error: "Artwork backend disabled" }, { status: 503 })
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 })
}
