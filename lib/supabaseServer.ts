import { createClient } from "@supabase/supabase-js"

export const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!, // nur serverseitig verwenden
  { auth: { persistSession: false } }
)
