import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function POST() {
  return NextResponse.json({ error: "Signed uploads disabled" }, { status: 503 })
}

export async function GET() {
  return NextResponse.json({ alive: true, status: "disabled" }, { status: 200 })
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 })
}
