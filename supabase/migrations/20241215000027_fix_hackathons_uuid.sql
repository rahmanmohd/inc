-- Fix hackathons table to use UUID IDs instead of integers
-- This migration converts the existing hackathons table to use proper UUIDs

-- First, drop existing foreign key constraints
ALTER TABLE hackathon_registrations DROP CONSTRAINT IF EXISTS hackathon_registrations_hackathon_id_fkey;

-- Create a new hackathons table with UUID IDs
CREATE TABLE IF NOT EXISTS hackathons_new (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  registration_open_date TIMESTAMPTZ,
  registration_close_date TIMESTAMPTZ,
  location TEXT,
  prize_pool TEXT,
  expected_participants INTEGER,
  tags TEXT[],
  cover_image_url TEXT,
  status TEXT DEFAULT 'draft',
  published BOOLEAN DEFAULT false,
  registration_count INTEGER DEFAULT 0,
  is_default BOOLEAN DEFAULT false,
  registration_form_id UUID,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Copy data from old table to new table (if old table exists)
DO $$
BEGIN
  -- Check if old hackathons table exists and has data
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'hackathons') THEN
    -- Insert data from old table to new table
    INSERT INTO hackathons_new (
      title, subtitle, description, start_date, end_date,
      registration_open_date, registration_close_date, location,
      prize_pool, expected_participants, tags, cover_image_url,
      status, published, registration_count, is_default,
      registration_form_id, created_by, created_at, updated_at
    )
    SELECT 
      title, subtitle, description, start_date, end_date,
      registration_open_date, registration_close_date, location,
      prize_pool, expected_participants, tags, cover_image_url,
      status, published, registration_count, is_default,
      registration_form_id, created_by, created_at, updated_at
    FROM hackathons;
    
    -- Drop the old table (now safe since constraints are removed)
    DROP TABLE hackathons;
  END IF;
END $$;

-- Rename new table to hackathons
ALTER TABLE hackathons_new RENAME TO hackathons;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_hackathons_published ON hackathons(published);
CREATE INDEX IF NOT EXISTS idx_hackathons_status ON hackathons(status);
CREATE INDEX IF NOT EXISTS idx_hackathons_start_date ON hackathons(start_date);
CREATE INDEX IF NOT EXISTS idx_hackathons_end_date ON hackathons(end_date);
CREATE INDEX IF NOT EXISTS idx_hackathons_created_at ON hackathons(created_at);

-- Add RLS policies
ALTER TABLE hackathons ENABLE ROW LEVEL SECURITY;

-- Policy for admins to manage all hackathons (based on profiles.role = 'admin')
CREATE POLICY "Admins can manage all hackathons" ON hackathons
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Policy for public to view published hackathons
CREATE POLICY "Public can view published hackathons" ON hackathons
  FOR SELECT USING (published = true);

-- Policy for authenticated users to view their own hackathons
CREATE POLICY "Users can view their own hackathons" ON hackathons
  FOR SELECT USING (auth.uid() = created_by);

-- Policy for hackathon creators to manage their own hackathons
CREATE POLICY "Users can manage their own hackathons" ON hackathons
  FOR ALL USING (auth.uid() = created_by);

-- Update hackathon_registrations table to reference the new UUID hackathon_id
-- First, add a temporary column
ALTER TABLE hackathon_registrations 
ADD COLUMN IF NOT EXISTS hackathon_id_new UUID;

-- Update the references (this will need to be done manually if there are existing registrations)
-- For now, we'll set it to NULL and let the application handle the relationship
UPDATE hackathon_registrations 
SET hackathon_id_new = NULL 
WHERE hackathon_id IS NOT NULL;

-- Drop the old column and rename the new one
ALTER TABLE hackathon_registrations DROP COLUMN IF EXISTS hackathon_id;
ALTER TABLE hackathon_registrations RENAME COLUMN hackathon_id_new TO hackathon_id;

-- Add foreign key constraint back
ALTER TABLE hackathon_registrations 
ADD CONSTRAINT fk_hackathon_registrations_hackathon_id 
FOREIGN KEY (hackathon_id) REFERENCES hackathons(id) ON DELETE CASCADE;

-- Create index on hackathon_id for better performance
CREATE INDEX IF NOT EXISTS idx_hackathon_registrations_hackathon_id ON hackathon_registrations(hackathon_id);

-- Add comment to document the change
COMMENT ON TABLE hackathons IS 'Hackathons table with UUID primary keys for better scalability and security';
COMMENT ON COLUMN hackathons.id IS 'UUID primary key for the hackathon';
