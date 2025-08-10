// app/api/admin/login/route.ts
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  let password = ""
  const ct = req.headers.get("content-type") || ""

  try {
    if (ct.includes("application/json")) {
      const body = await req.json().catch(() => ({}))
      password = String(body?.password ?? "")
    } else {
      const form = await req.formData().catch(() => null)
      password = String(form?.get("password") ?? "")
    }
  } catch {
    // ignore
  }

  const envPwdRaw = process.env.ADMIN_PASSWORD
  if (!envPwdRaw) {
    return NextResponse.json({ error: "ADMIN_PASSWORD not set" }, { status: 500 })
  }

  const envPwd = envPwdRaw.trim()
  const got = password.trim()

  if (got !== envPwd) {
    return NextResponse.json({ error: "Ungültiges Passwort" }, { status: 401 })
  }

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
