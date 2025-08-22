-- Fix duplicate RLS policies for consultations
-- This migration drops any duplicate policies that might exist

-- Drop all existing policies for consultations to start fresh
DROP POLICY IF EXISTS "Users can insert their own consultations" ON consultations;
DROP POLICY IF EXISTS "Users can view their own consultations" ON consultations;
DROP POLICY IF EXISTS "Admins can view all consultations" ON consultations;

-- Recreate the policies properly
CREATE POLICY "Users can insert their own consultations" ON consultations
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own consultations" ON consultations
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all consultations" ON consultations
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);
