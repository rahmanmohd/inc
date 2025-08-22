-- Create consultations table
CREATE TABLE IF NOT EXISTS consultations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company TEXT NOT NULL,
  consultation_type TEXT NOT NULL,
  description TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_consultations_user_id ON consultations(user_id);
CREATE INDEX IF NOT EXISTS idx_consultations_status ON consultations(status);
CREATE INDEX IF NOT EXISTS idx_consultations_created_at ON consultations(created_at);

-- Enable RLS
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;

-- RLS policies will be created in a separate migration to avoid conflicts

-- Create trigger for admin notifications
CREATE OR REPLACE FUNCTION create_consultation_notification()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO admin_notifications (
    type,
    application_id,
    application_type,
    applicant_name,
    startup_name,
    message,
    priority
  ) VALUES (
    'new_consultation',
    NEW.id,
    'consultations',
    COALESCE(NEW.name, 'Unknown'),
    COALESCE(NEW.company, 'N/A'),
    'New consultation request submitted',
    'medium'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

ALTER FUNCTION create_consultation_notification() OWNER TO postgres;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_create_consultation_notification ON consultations;
CREATE TRIGGER trigger_create_consultation_notification
  AFTER INSERT ON consultations
  FOR EACH ROW
  EXECUTE FUNCTION create_consultation_notification();
