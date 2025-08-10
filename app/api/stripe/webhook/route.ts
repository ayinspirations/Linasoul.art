import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { supabaseAdmin } from "@/lib/supabaseAdmin"

export const runtime = "nodejs" // sicherstellen für Buffer

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature")
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!sig || !whSecret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 })
  }

  const buf = Buffer.from(await req.arrayBuffer())

  let event: any
  try {
    event = stripe.webhooks.constructEvent(buf, sig, whSecret)
  } catch (err: any) {
    return NextResponse.json({ error: `Invalid signature: ${err.message}` }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    try {
      const session = event.data.object as any
      const idsCsv = session?.metadata?.artwork_ids || ""
      const ids = idsCsv.split(",").map((s: string) => s.trim()).filter(Boolean)

      if (ids.length) {
        // Alle betroffenen Artworks auf verkauft setzen
        const { error } = await supabaseAdmin
          .from("artworks")
          .update({ available: false })
          .in("id", ids)

        if (error) {
          console.error("Supabase update error:", error)
          return NextResponse.json({ error: error.message }, { status: 500 })
        }
      }
    } catch (e) {
      console.error(e)
      return NextResponse.json({ error: "Webhook handling failed" }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true }, { status: 200 })
}
