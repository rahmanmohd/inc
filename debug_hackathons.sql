-- Debug script to check the current state of hackathons table
-- Run this in your Supabase SQL Editor to see what's happening

-- Check the current hackathons table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'hackathons' 
ORDER BY ordinal_position;

-- Check if there are any hackathons in the table
SELECT 
  id,
  title,
  published,
  status,
  created_at
FROM hackathons 
ORDER BY created_at DESC;

-- Check the foreign key constraints
SELECT 
  tc.constraint_name, 
  tc.table_name, 
  kcu.column_name, 
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name = 'hackathon_registrations';

-- Check if there are any hackathon registrations
SELECT 
  id,
  hackathon_id,
  full_name,
  email,
  created_at
FROM hackathon_registrations 
ORDER BY created_at DESC 
LIMIT 5;

-- Check the RLS policies on hackathons table
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'hackathons';
