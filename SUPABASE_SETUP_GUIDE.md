# 🚀 Supabase + TypeScript Setup Guide

## ✅ What's Already Set Up

- ✅ **Supabase Client**: `@supabase/supabase-js` installed
- ✅ **Type Definitions**: Generated from your live database
- ✅ **Client Configuration**: `src/lib/supabase.ts` with TypeScript support
- ✅ **Helper Functions**: `getTable()`, `isAdmin()` utilities
- ✅ **Test Component**: `SupabaseTest.tsx` to verify setup

## 🔑 Environment Setup

### 1. Create `.env` File
Create a `.env` file in your project root:
```bash
VITE_SUPABASE_URL=https://ysxtcljsclkoatngtihl.supabase.co
VITE_SUPABASE_ANON_KEY=your_actual_anon_key_here
```

### 2. Get Your Anon Key
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select project: `ysxtcljsclkoatngtihl`
3. Navigate to **Settings** → **API**
4. Copy the **"anon public"** key from **Project API keys**

## 🎯 Usage Examples

### Basic Database Operations

```typescript
import { supabase, getTable } from '../lib/supabase'
import type { Tables, TablesInsert } from '../types/supabase-latest'

// Get all profiles
const { data: profiles, error } = await supabase
  .from('profiles')
  .select('*')

// Insert new profile
const newProfile: TablesInsert<'profiles'> = {
  id: user.id,
  email: user.email,
  first_name: 'John',
  last_name: 'Doe',
  role: 'user'
}

const { data, error } = await supabase
  .from('profiles')
  .insert(newProfile)
  .select()
  .single()
```

### Using Typed Tables

```typescript
// Get typed table reference
const profilesTable = getTable('profiles')

// TypeScript knows the exact structure
const { data, error } = await profilesTable
  .select('id, email, role')
  .eq('role', 'admin')
  .order('created_at', { ascending: false })
```

### Admin Functions

```typescript
import { isAdmin } from '../lib/supabase'

// Check if user is admin
const adminStatus = await isAdmin(userId)
if (adminStatus) {
  // Perform admin operations
  const { data } = await supabase
    .from('admin_notifications')
    .select('*')
}
```

## 🗄️ Available Tables

### Core Tables
- **`profiles`** - User profiles and roles
- **`startups`** - Startup information
- **`hackathon_registrations`** - Hackathon applications
- **`incubation_applications`** - Incubation program applications
- **`investment_applications`** - Investment seeking applications
- **`mentor_applications`** - Mentor onboarding
- **`program_applications`** - General program applications

### Admin Tables
- **`admin_notifications`** - System notifications
- **`admin_activity_log`** - Admin action audit trail

### Content Tables
- **`blog_posts`** - Blog articles
- **`resources`** - Educational resources
- **`events`** - Events and hackathons

## 🔒 Row Level Security (RLS)

Your database has comprehensive RLS policies:

- **Users can only access their own data**
- **Admins have full access to all data**
- **Public read access for published content**
- **Status-based update restrictions**

## 🧪 Testing Your Setup

1. **Add the test component** to any page:
```typescript
import { SupabaseTest } from '../components/SupabaseTest'

// In your component
<SupabaseTest />
```

2. **Check the console** for any errors
3. **Verify connection** shows green success message

## 🚨 Common Issues & Solutions

### "Missing Supabase environment variables"
- Create `.env` file in project root
- Add your anon key from Supabase dashboard
- Restart your dev server

### "Invalid API key"
- Check your anon key is correct
- Ensure no extra spaces or characters
- Verify project URL matches

### "RLS policy violation"
- Check if user is authenticated
- Verify user has appropriate role
- Check RLS policies in Supabase dashboard

## 🔄 Updating Types

When your database schema changes:

```bash
# Generate new types
npx supabase gen types typescript --project-id ysxtcljsclkoatngtihl --schema public > src/types/supabase-generated.ts

# Copy new types to your types file
# Or update the import in src/lib/supabase.ts
```

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [TypeScript Guide](https://supabase.com/docs/guides/api/typescript-support)
- [RLS Policies](https://supabase.com/docs/guides/auth/row-level-security)
- [Edge Functions](https://supabase.com/docs/guides/functions)

## 🎉 You're All Set!

Your Supabase + TypeScript setup is complete with:
- ✅ Full type safety
- ✅ IntelliSense support
- ✅ Helper functions
- ✅ Admin utilities
- ✅ Comprehensive error handling

Start building with confidence! 🚀
