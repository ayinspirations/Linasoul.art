import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY!;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;

const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });

export async function POST(req: Request) {
  try {
    const sig = req.headers.get("stripe-signature");
    if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

    const rawBody = await req.text();
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(rawBody, sig, STRIPE_WEBHOOK_SECRET);
    } catch (err: any) {
      return NextResponse.json({ error: `Webhook signature verification failed: ${err.message}` }, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      // Optionaler Sicherheits-Check
      if (session.payment_status !== "paid") {
        return NextResponse.json({ ok: true });
      }

      const idsCsv = session.metadata?.artwork_ids_csv || "";
      const ids = idsCsv.split(",").map((s) => s.trim()).filter(Boolean);

      if (ids.length > 0) {
        const { error } = await supabaseAdmin
          .from("artworks")
          .update({ available: false })
          .in("id", ids);

        if (error) {
          console.error("Supabase update error:", error);
          // 2xx an Stripe zurück, damit sie nicht endlos retrys schicken – aber wir loggen es
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (e: any) {
    console.error("Webhook error:", e);
    // Stripe erwartet 2xx für "ok" oder 4xx/5xx für retry
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 400 });
  }
}
