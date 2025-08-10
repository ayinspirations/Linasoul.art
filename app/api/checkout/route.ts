import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { supabaseServer } from "@/lib/supabaseServer" // dein bereits vorhandener Server-Client

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const ids = Array.isArray(body?.ids) ? body.ids.map(String) : []

    if (!ids.length) {
      return NextResponse.json({ error: "Keine Artikel im Warenkorb" }, { status: 400 })
    }

    // Artworks laden und prüfen
    const { data, error } = await supabaseServer
      .from("artworks")
      .select("id, title, price_cents, currency, available")
      .in("id", ids)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const availableItems = (data ?? []).filter(a => a.available)
    if (availableItems.length !== ids.length) {
      return NextResponse.json({ error: "Mindestens ein Artikel ist nicht verfügbar" }, { status: 409 })
    }

    // Line Items (Preis dynamisch aus Datenbank)
    const line_items = availableItems.map((a) => ({
      quantity: 1,
      price_data: {
        currency: (a.currency || "eur").toLowerCase(),
        product_data: { name: a.title, metadata: { artwork_id: a.id } },
        unit_amount: Number(a.price_cents || 0),
      },
    }))

    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "https://linasoul.art"

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
      metadata: {
        artwork_ids: ids.join(","), // für den Webhook
      },
      shipping_address_collection: { allowed_countries: ["DE", "AT", "CH", "FR", "IT", "NL", "BE"] },
    })

    return NextResponse.json({ url: session.url })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Fehler beim Checkout" }, { status: 500 })
  }
}
