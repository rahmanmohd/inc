-- Fix duplicate RLS policies for partnership_requests
-- This migration drops any duplicate policies that might exist

-- Drop all existing policies for partnership_requests to start fresh
DROP POLICY IF EXISTS "Users can insert their own partnership requests" ON partnership_requests;
DROP POLICY IF EXISTS "Users can view their own partnership requests" ON partnership_requests;
DROP POLICY IF EXISTS "Admins can view all partnership requests" ON partnership_requests;

-- Recreate the policies properly
CREATE POLICY "Users can insert their own partnership requests" ON partnership_requests
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own partnership requests" ON partnership_requests
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all partnership requests" ON partnership_requests
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);
