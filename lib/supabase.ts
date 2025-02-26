import { createClient } from "@supabase/supabase-js"

// In production, these would come from environment variables
const supabaseUrl = "https://your-project.supabase.co"
const supabaseAnonKey = "your-anon-key"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

