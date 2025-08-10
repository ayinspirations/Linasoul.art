// app/api/admin/login/route.ts
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  let password = ""
  const ct = req.headers.get("content-type") || ""

  if (ct.includes("application/json")) {
    const body = await req.json().catch(() => ({}))
    password = String(body?.password ?? "")
  } else {
    const form = await req.formData().catch(() => null)
    password = String(form?.get("password") ?? "")
  }

  const expected = (process.env.ADMIN_PASSWORD || "").trim()
  if (!expected) {
    return NextResponse.json({ error: "ADMIN_PASSWORD not set" }, { status: 500 })
  }

  if (password.trim() !== expected) {
    return NextResponse.json({ error: "Ungültiges Passwort" }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  // >>> exakt so erwartet es deine middleware:
  res.cookies.set("admin_auth", "ok", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8h
  })
  return res
}
