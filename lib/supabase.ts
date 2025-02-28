import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL or anon key is not defined in environment variables")
}

// Create a Supabase client for browser/client usage
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// For server-side operations that need admin privileges
export const getAdminClient = () => {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseServiceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not defined in environment variables")
  }
  
  return createClient(supabaseUrl, supabaseServiceKey)
}