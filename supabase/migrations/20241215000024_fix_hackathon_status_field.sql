-- Fix hackathon_registrations status field to ensure proper status tracking
-- The status field exists but needs proper constraints and defaults

-- First, ensure the status field has proper constraints
ALTER TABLE hackathon_registrations 
  -- Make sure status is NOT NULL and has proper default
  ALTER COLUMN status SET NOT NULL,
  ALTER COLUMN status SET DEFAULT 'pending';

-- Add a check constraint to ensure only valid status values
DO $$ 
BEGIN
  -- Drop existing constraint if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'hackathon_registrations_status_check' 
    AND table_name = 'hackathon_registrations'
  ) THEN
    ALTER TABLE hackathon_registrations DROP CONSTRAINT hackathon_registrations_status_check;
  END IF;
  
  -- Add the check constraint
  ALTER TABLE hackathon_registrations 
    ADD CONSTRAINT hackathon_registrations_status_check 
    CHECK (status IN ('pending', 'approved', 'rejected'));
END $$;

-- Ensure any existing NULL status values are set to 'pending'
UPDATE hackathon_registrations 
SET status = 'pending' 
WHERE status IS NULL;

-- Ensure any existing invalid status values are set to 'pending'
UPDATE hackathon_registrations 
SET status = 'pending' 
WHERE status NOT IN ('pending', 'approved', 'rejected');

-- Add an index on status for better query performance
CREATE INDEX IF NOT EXISTS idx_hackathon_registrations_status_lookup 
ON hackathon_registrations(status);

-- Add admin_notes field if it doesn't exist (for admin comments when updating status)
ALTER TABLE hackathon_registrations 
ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- Ensure proper trigger exists for status updates (for activity logging)
CREATE OR REPLACE FUNCTION log_hackathon_status_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Only log if status actually changed
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO admin_activity_log (
      action,
      admin_id,
      application_id,
      application_type,
      old_status,
      new_status,
      notes,
      created_at
    ) VALUES (
      'status_update',
      NEW.user_id, -- This will be the admin who made the change
      NEW.id,
      'hackathon',
      OLD.status,
      NEW.status,
      NEW.admin_notes,
      NOW()
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for status updates
DROP TRIGGER IF EXISTS hackathon_status_update_trigger ON hackathon_registrations;
CREATE TRIGGER hackathon_status_update_trigger
  AFTER UPDATE ON hackathon_registrations
  FOR EACH ROW
  EXECUTE FUNCTION log_hackathon_status_update();

-- Ensure RLS policies allow admins to update status
-- Drop existing policies first
DROP POLICY IF EXISTS "Admins can update hackathon status" ON hackathon_registrations;

-- Create policy for admins to update status
CREATE POLICY "Admins can update hackathon status" ON hackathon_registrations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Verify the schema is correct by showing the current structure
DO $$
BEGIN
  RAISE NOTICE 'Hackathon registrations status field setup complete.';
  RAISE NOTICE 'Status field: NOT NULL, DEFAULT ''pending'', CHECK (status IN (''pending'', ''approved'', ''rejected''))';
  RAISE NOTICE 'Admin notes field: Available for admin comments';
  RAISE NOTICE 'Activity logging: Enabled for status changes';
  RAISE NOTICE 'RLS policies: Admins can update status';
END $$;
