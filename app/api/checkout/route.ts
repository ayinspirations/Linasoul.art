// app/api/checkout/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY!;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const stripe = STRIPE_SECRET_KEY
  ? new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" })
  : (null as unknown as Stripe);

export async function POST(req: Request) {
  try {
    if (!stripe) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
    }

    const body = await req.json().catch(() => ({}));
    const items: string[] = Array.isArray(body?.items) ? body.items : [];

    if (!items.length) {
      return NextResponse.json({ error: "Keine Artikel übergeben" }, { status: 400 });
    }

    // Alle Artworks laden
    const { data, error } = await supabaseAdmin
      .from("artworks")
      .select("id, title, price_cents, currency, available")
      .in("id", items);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Verfügbarkeit prüfen
    const unavailable = (data || []).filter((a) => !a.available);
    if (unavailable.length > 0) {
      return NextResponse.json(
        { error: `Nicht verfügbar: ${unavailable.map((u) => u.title).join(", ")}` },
        { status: 409 }
      );
    }

    // line_items bauen
    const line_items = (data || []).map((a) => ({
      quantity: 1,
      price_data: {
        currency: String(a.currency || "eur").toLowerCase(),
        unit_amount: Number(a.price_cents || 0),
        product_data: { name: a.title },
      },
    }));

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${SITE_URL}/?success=true`,
      cancel_url: `${SITE_URL}/cart?canceled=true`,
      metadata: {
        artwork_ids_csv: (data || []).map((a) => a.id).join(","),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e?.message || "Checkout error" }, { status: 500 });
  }
}
