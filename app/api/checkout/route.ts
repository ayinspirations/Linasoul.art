// app/api/checkout/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs"; // Stripe SDK braucht Node

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY!;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

if (!STRIPE_SECRET_KEY) {
  // Nicht während des Builds crashen – nur beim ersten Request meckern wir
  console.warn("STRIPE_SECRET_KEY not set");
}

const stripe = STRIPE_SECRET_KEY
  ? new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" })
  : (null as unknown as Stripe);

export async function POST(req: Request) {
  try {
    if (!stripe) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
    }

    // Erwartet: { artworkId: string }
    const { artworkId } = await req.json().catch(() => ({}));
    if (!artworkId) {
      return NextResponse.json({ error: "artworkId missing" }, { status: 400 });
    }

    // Artwork aus DB holen
    const { data: artwork, error } = await supabaseAdmin
      .from("artworks")
      .select("id, title, price_cents, currency, available")
      .eq("id", artworkId)
      .single();

    if (error || !artwork) {
      return NextResponse.json({ error: "Artwork not found" }, { status: 404 });
    }
    if (!artwork.available) {
      return NextResponse.json({ error: "Bereits verkauft / nicht verfügbar" }, { status: 409 });
    }

    const unitAmount = Number(artwork.price_cents || 0);
    const currency = String(artwork.currency || "EUR").toLowerCase();

    // Stripe Checkout Session erstellen
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency,
            product_data: { name: artwork.title },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      success_url: `${SITE_URL}/?success=true`,
      cancel_url: `${SITE_URL}/?canceled=true`,
      metadata: {
        artwork_id: String(artwork.id),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e?.message || "Checkout error" }, { status: 500 });
  }
}
