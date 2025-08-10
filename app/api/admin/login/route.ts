import { NextResponse } from "next/server"

// sehr simpel: vergleicht ein Passwort aus dem Body mit ENV
export async function POST(req: Request) {
  const formData = await req.formData()
  const password = String(formData.get("password") || "")

  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "ADMIN_PASSWORD not set" }, { status: 500 })
  }

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Ungültiges Passwort" }, { status: 401 })
  }

  // Cookie setzen (httpOnly)
  const res = NextResponse.json({ ok: true })
  res.cookies.set("admin", "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 8, // 8h
  })
  return res
}
