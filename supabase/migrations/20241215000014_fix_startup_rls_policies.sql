-- Fix RLS policies for startups table to allow admin operations

-- Drop existing policies
DROP POLICY IF EXISTS "Users can insert their own startups" ON startups;
DROP POLICY IF EXISTS "Admins can insert startups" ON startups;
DROP POLICY IF EXISTS "Users can update their own startups" ON startups;
DROP POLICY IF EXISTS "Admins can update all startups" ON startups;
DROP POLICY IF EXISTS "Users can delete their own startups" ON startups;
DROP POLICY IF EXISTS "Admins can delete all startups" ON startups;

-- Create new policies that allow admins to bypass owner_id restrictions
CREATE POLICY "Users can insert their own startups" ON startups
  FOR INSERT WITH CHECK (
    auth.uid() = owner_id OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Users can update their own startups" ON startups
  FOR UPDATE USING (
    auth.uid() = owner_id OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Users can delete their own startups" ON startups
  FOR DELETE USING (
    auth.uid() = owner_id OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );
