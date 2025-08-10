// lib/supabaseServer.ts
import { createClient } from "@supabase/supabase-js"

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const service = process.env.SUPABASE_SERVICE_ROLE! // <— exakt so, wie in Vercel benannt

// Client für serverseitige Admin-Operationen (RLS-Bypass)
// Achtung: nur auf dem Server verwenden!
export const supabaseServer = createClient(url, service, {
  auth: { persistSession: false },
})

// Optional: wenn du irgendwo clientseitig liest, nimm den anon key:
export const supabasePublic = createClient(url, anon)
