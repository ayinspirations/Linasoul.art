import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Nur Admin-Pfade schützen
  const isProtected =
    pathname.startsWith("/admin") || pathname.startsWith("/api/admin")

  if (!isProtected) return NextResponse.next()

  // Login-Pfade nicht blocken
  if (pathname.startsWith("/admin/login") || pathname.startsWith("/api/admin/login")) {
    return NextResponse.next()
  }

  // Schon eingeloggt?
  const cookie = req.cookies.get("admin_auth")?.value
  if (cookie === "ok") return NextResponse.next()

  // Optional: Basic Auth unterstützen (praktisch für schnelle Tests)
  const auth = req.headers.get("authorization")
  if (auth?.startsWith("Basic ")) {
    const decoded = atob(auth.slice(6)) // "user:pass"
    const pass = decoded.split(":")[1] ?? ""
    if (pass === (process.env.ADMIN_PASSWORD || "")) {
      const res = NextResponse.next()
      res.cookies.set("admin_auth", "ok", {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 8, // 8h
      })
      return res
    }
  }

  // sonst zum Login
  const url = req.nextUrl.clone()
  url.pathname = "/admin/login"
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
}
