// app/api/stripe/webhook/route.ts
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs"; // Stripe SDK braucht Node

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY!;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;

const stripe = STRIPE_SECRET_KEY
  ? new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" })
  : (null as unknown as Stripe);

export async function POST(req: Request) {
  try {
    if (!stripe || !STRIPE_WEBHOOK_SECRET) {
      console.warn("Stripe/Webhook not configured");
      return NextResponse.json({ received: true }); // ruhig "acknowledgen"
    }

    const body = await req.text();
    const sig = (await headers()).get("stripe-signature") || "";

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET);
    } catch (err: any) {
      console.error("Webhook signature verification failed.", err?.message);
      return new NextResponse("Bad signature", { status: 400 });
    }

    // Auf Completed Checkout reagieren
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const artworkId = session.metadata?.artwork_id;

      if (artworkId) {
        // Artwork auf "verkauft" setzen
        const { error } = await supabaseAdmin
          .from("artworks")
          .update({ available: false })
          .eq("id", artworkId);

        if (error) {
          console.error("Failed to mark artwork sold:", error.message);
        } else {
          console.log("Artwork sold:", artworkId);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (e: any) {
    console.error(e);
    return new NextResponse("Webhook handler error", { status: 500 });
  }
}
