-- Ensure consultations table has required columns used by the app
ALTER TABLE consultations 
	ADD COLUMN IF NOT EXISTS description TEXT,
	ADD COLUMN IF NOT EXISTS message TEXT,
	ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
	ADD COLUMN IF NOT EXISTS company TEXT,
	ADD COLUMN IF NOT EXISTS name TEXT,
	ADD COLUMN IF NOT EXISTS email TEXT,
	ADD COLUMN IF NOT EXISTS phone TEXT,
	ADD COLUMN IF NOT EXISTS consultation_type TEXT;

-- Helpful indexes if not already present
CREATE INDEX IF NOT EXISTS idx_consultations_created_at ON consultations(created_at);
CREATE INDEX IF NOT EXISTS idx_consultations_status ON consultations(status);
