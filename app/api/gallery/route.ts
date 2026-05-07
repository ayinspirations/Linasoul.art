import { readdir } from "fs/promises"
import { join } from "path"
import { NextResponse } from "next/server"

export const runtime = "nodejs"

const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]

export async function GET() {
  try {
    const dir = join(process.cwd(), "public", "gallery")
    const entries = await readdir(dir, { withFileTypes: true })
    const images = entries
      .filter((entry) => entry.isFile())
      .filter((entry) => allowedExtensions.includes(entry.name.toLowerCase().slice(-5)) || allowedExtensions.includes(entry.name.toLowerCase().slice(-4)))
      .map((entry) => `/gallery/${entry.name}`)

    return NextResponse.json({ images })
  } catch (error) {
    return NextResponse.json({ images: [] })
  }
}
