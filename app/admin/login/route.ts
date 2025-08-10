import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { password } = await req.json().catch(() => ({}))
  const ok = password && password === (process.env.ADMIN_PASSWORD || "")
  if (!ok) {
    return NextResponse.json({ error: "Falsches Passwort" }, { status: 401 })
  }
  const res = NextResponse.json({ ok: true })
  res.cookies.set("admin_auth", "ok", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8h
  })
  return res
}
