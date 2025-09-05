import { NextRequest, NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabaseServer"

export const runtime = "nodejs"

// --- TEMP: Diagnostische POST-Funktion ---
export async function POST(req: NextRequest) {
  try {
    // 1) ENV-Prüfung
    const haveUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
    const haveService = !!process.env.SUPABASE_SERVICE_ROLE
    if (!haveUrl || !haveService) {
      return NextResponse.json(
        { step: "env", haveUrl, haveService, error: "Supabase ENV missing" },
        { status: 500 }
      )
    }

    // 2) Minimal-Payload (ohne Bilder, ohne optionale Felder)
    const payload = {
      title: "diag-" + Date.now(),
      description: null,
      size: null,
      price_cents: 100,
      currency: "eur",   // in deiner DB lowercase
      available: true,
      images: [] as string[], // jsonb array
    }

    // 3) Insert
    const { data, error } = await supabaseServer
      .from("artworks")
      .insert([payload])
      .select()
      .single()

    if (error) {
      const anyErr: any = error
      return NextResponse.json(
        {
          step: "insert",
          error: anyErr.message,
          details: anyErr.details ?? null,
          hint: anyErr.hint ?? null,
          code: anyErr.code ?? null,
          payload,
        },
        { status: 400 }
      )
    }

    return NextResponse.json({ ok: true, artwork: data })
  } catch (e: any) {
    return NextResponse.json(
      { step: "catch", error: e?.message || "Unknown error", stack: e?.stack ?? null },
      { status: 500 }
    )
  }
}
