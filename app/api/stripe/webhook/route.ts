// app/api/stripe/webhook/route.ts
import "server-only"
import { NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"                // nutzt STRIPE_SECRET_KEY
import { supabaseServer } from "@/lib/supabaseServer" // nutzt Service-Role

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature")
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!sig || !whSecret) {
    return NextResponse.json({ error: "Missing Stripe webhook secret/signature" }, { status: 400 })
  }

  // Wichtig: unveränderten Raw-Body an Stripe geben
  const buf = Buffer.from(await req.arrayBuffer())

  let event
  try {
    event = stripe.webhooks.constructEvent(buf, sig, whSecret)
  } catch (err: any) {
    return NextResponse.json({ error: `Invalid signature: ${err.message}` }, { status: 400 })
  }

  try {
    if (
      event.type === "checkout.session.completed" ||
      event.type === "checkout.session.async_payment_succeeded"
    ) {
      const session = event.data.object as any

      // Nur bezahlte Sessions verarbeiten
      if (session.payment_status && session.payment_status !== "paid") {
        return NextResponse.json({ skipped: "not paid" })
      }

      // IDs aus der Metadata lesen (neu: artwork_ids; alt: artwork_ids_csv)
      const idsCsv: string =
        session?.metadata?.artwork_ids ??
        session?.metadata?.artwork_ids_csv ??
        ""

      const ids = idsCsv
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean)

      if (ids.length) {
        const { error } = await supabaseServer
          .from("artworks")
          .update({ available: false })
          .in("id", ids)

        if (error) {
          console.error("Supabase update error:", error)
          // Stripe nicht mit 5xx antworten, sonst retryschleife:
          return NextResponse.json({ ok: false, supabase: error.message })
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (e: any) {
    console.error("Webhook handler error:", e)
    // 2xx zurückgeben, damit Stripe nicht endlos retried. Fehler trotzdem loggen.
    return NextResponse.json({ ok: false, error: e?.message ?? "webhook error" })
  }
}
