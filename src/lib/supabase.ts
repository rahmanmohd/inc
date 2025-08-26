import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/supabase-generated'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ysxtcljsclkoatngtihl.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Helper function to get typed table
export const getTable = <T extends keyof Database['public']['Tables']>(tableName: T) => {
  return supabase.from(tableName)
}

// Helper function to check if user is admin
export const isAdmin = async (userId: string) => {
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single()
  
  return profile?.role === 'admin'
}

// Export types for convenience
export type { Database }
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
