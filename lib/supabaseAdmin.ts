import { createClient } from "@supabase/supabase-js"

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE

if (!URL) throw new Error("NEXT_PUBLIC_SUPABASE_URL not set")
if (!SERVICE_KEY) throw new Error("SUPABASE_SERVICE_ROLE not set")

export const supabaseAdmin = createClient(URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
})
