-- Fix RLS policies for startups table to ensure admin can view all startups
-- Drop existing view policies that might be conflicting
DROP POLICY IF EXISTS "Users can view published startups" ON startups;
DROP POLICY IF EXISTS "Users can view their own startups" ON startups;
DROP POLICY IF EXISTS "Admins can view all startups" ON startups;

-- Create a single comprehensive view policy for admins
CREATE POLICY "Admins can view all startups" ON startups
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Also allow users to view their own startups
CREATE POLICY "Users can view their own startups" ON startups
  FOR SELECT USING (
    auth.uid() = owner_id
  );
