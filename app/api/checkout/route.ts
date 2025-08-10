// app/api/checkout/route.ts
import { NextResponse } from "next/server"
import Stripe from "stripe"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export const runtime = "nodejs"

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY!
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

const stripe = STRIPE_SECRET_KEY
  ? new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" })
  : (null as unknown as Stripe)

export async function POST(req: Request) {
  try {
    if (!stripe) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 500 })
    }

    const body = await req.json().catch(() => ({}))

    // items kann Array aus IDs ODER aus Objekten sein
    const rawItems = Array.isArray(body?.items) ? body.items : []
    const itemIds: string[] = rawItems
      .map((x) => {
        if (typeof x === "string") return x
        if (x && typeof x === "object" && typeof x.id === "string") return x.id
        return null
      })
      .filter(Boolean) as string[]

    if (itemIds.length === 0) {
      return NextResponse.json({ error: "Keine Artikel übergeben" }, { status: 400 })
    }

    const success_url = typeof body?.success_url === "string" ? body.success_url : `${SITE_URL}/success`
    const cancel_url = typeof body?.cancel_url === "string" ? body.cancel_url : `${SITE_URL}/cart`

    // Preise/Verfügbarkeit IMMER aus DB (Single-Source-of-Truth)
    const { data, error } = await supabaseAdmin
      .from("artworks")
      .select("id, title, price_cents, currency, available, images")
      .in("id", itemIds)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // check: alle angefragten existieren
    const foundIds = new Set((data ?? []).map((d) => d.id))
    const missing = itemIds.filter((id) => !foundIds.has(id))
    if (missing.length > 0) {
      return NextResponse.json({ error: `Unbekannte Artikel: ${missing.join(", ")}` }, { status: 400 })
    }

    // check: Verfügbarkeit
    const unavailable = (data || []).filter((a) => !a.available)
    if (unavailable.length > 0) {
      return NextResponse.json(
        { error: `Nicht verfügbar: ${unavailable.map((u) => u.title).join(", ")}` },
        { status: 409 }
      )
    }

    // Stripe Line Items
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = (data || []).map((a) => ({
      quantity: 1,
      price_data: {
        currency: String(a.currency || "eur").toLowerCase(),
        unit_amount: Number(a.price_cents || 0),
        product_data: {
          name: a.title,
          images: Array.isArray(a.images) && a.images[0] ? [a.images[0]] : [],
        },
      },
    }))

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      customer_creation: "if_required",
      billing_address_collection: "required",
      phone_number_collection: { enabled: true },
      shipping_address_collection: {
        allowed_countries: ["DE", "AT", "CH"],
      },
      success_url,
      cancel_url,
      metadata: {
        artwork_ids_csv: itemIds.join(","), // für den Webhook
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: e?.message || "Checkout error" }, { status: 500 })
  }
}
