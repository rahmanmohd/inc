// Supabase Configuration
// Copy these values to your .env file

export const SUPABASE_CONFIG = {
  url: 'https://ysxtcljsclkoatngtihl.supabase.co',
  anonKey: process.env.VITE_SUPABASE_ANON_KEY || ''
}

// Instructions:
// 1. Create a .env file in your project root
// 2. Add: VITE_SUPABASE_ANON_KEY=your_actual_anon_key_here
// 3. Get your anon key from: Supabase Dashboard > Settings > API > Project API keys > anon public
