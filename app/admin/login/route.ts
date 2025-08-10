import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const password = String(body?.password ?? "");
  const EXPECTED = process.env.ADMIN_PASSWORD;

  if (!EXPECTED) {
    return NextResponse.json({ error: "ADMIN_PASSWORD not set" }, { status: 500 });
  }
  if (password !== EXPECTED) {
    return NextResponse.json({ ok: false, error: "Invalid password" }, { status: 401 });
  }

  cookies().set("admin_auth", "1", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.json({ ok: true });
}
