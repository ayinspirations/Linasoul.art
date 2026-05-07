import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function POST() {
  return NextResponse.json({ error: "Webhook disabled" }, { status: 503 })
}
