import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
// Replace these with your actual Supabase project URL and anon key
// You can find these in your Supabase project settings under API
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)