// lib/supabaseServer.ts
import "server-only"
import { createClient } from "@supabase/supabase-js"

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const service = process.env.SUPABASE_SERVICE_ROLE // exakt wie in Vercel

if (!url) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL")
if (!anon) throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY")
if (!service) throw new Error("Missing SUPABASE_SERVICE_ROLE")

export const supabaseServer = createClient(url, service, { auth: { persistSession: false } })
export const supabasePublic = createClient(url, anon)
