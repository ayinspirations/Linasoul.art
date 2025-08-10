import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabaseServer"

export async function GET() {
  const { data, error } = await supabaseServer
    .from("artworks")
    .select("id, title, description, price_cents, currency, available, images")
    .order("created_at", { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ artworks: data ?? [] })
}
