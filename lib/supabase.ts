import { createClient } from "@supabase/supabase-js"
import { createClient as createClientBrowser } from "@supabase/supabase-js"

// Server-side Supabase client (with admin privileges)
export const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// Client-side Supabase client
export const createBrowserClient = () => {
  return createClientBrowser(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
}

