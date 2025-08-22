-- Safe setup for hackathon_registrations status field
-- This migration avoids destructive operations and only adds missing functionality

-- 1. Ensure status field has proper default (safe operation)
ALTER TABLE hackathon_registrations 
  ALTER COLUMN status SET DEFAULT 'pending';

-- 2. Update any NULL status values to 'pending' (safe data cleanup)
UPDATE hackathon_registrations 
SET status = 'pending' 
WHERE status IS NULL;

-- 3. Add admin_notes field if it doesn't exist (safe addition)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'hackathon_registrations' 
    AND column_name = 'admin_notes'
  ) THEN
    ALTER TABLE hackathon_registrations ADD COLUMN admin_notes TEXT;
  END IF;
END $$;

-- 4. Add status index if it doesn't exist (safe addition)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'hackathon_registrations' 
    AND indexname = 'idx_hackathon_registrations_status_safe'
  ) THEN
    CREATE INDEX idx_hackathon_registrations_status_safe ON hackathon_registrations(status);
  END IF;
END $$;

-- 5. Add check constraint only if it doesn't exist (safe addition)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'hackathon_status_valid_values' 
    AND table_name = 'hackathon_registrations'
  ) THEN
    ALTER TABLE hackathon_registrations 
      ADD CONSTRAINT hackathon_status_valid_values 
      CHECK (status IN ('pending', 'approved', 'rejected'));
  END IF;
END $$;

-- 6. Create admin update policy only if it doesn't exist (safe addition)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'hackathon_registrations' 
    AND policyname = 'admin_can_update_hackathon_status'
  ) THEN
    CREATE POLICY admin_can_update_hackathon_status ON hackathon_registrations
      FOR UPDATE USING (
        EXISTS (
          SELECT 1 FROM profiles 
          WHERE profiles.id = auth.uid() 
          AND profiles.role = 'admin'
        )
      );
  END IF;
END $$;

-- 7. Verification message
DO $$
BEGIN
  RAISE NOTICE '✅ Safe hackathon status setup completed';
  RAISE NOTICE '📋 Status field: Default "pending", Valid values: pending/approved/rejected';
  RAISE NOTICE '👤 Admin notes: Available for status updates';
  RAISE NOTICE '🔒 Admin policy: Admins can update status';
  RAISE NOTICE '⚡ Index: Added for better performance';
END $$;
