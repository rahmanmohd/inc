-- Admin Notifications Table
CREATE TABLE IF NOT EXISTS admin_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  application_id UUID,
  application_type VARCHAR(50),
  applicant_name VARCHAR(255),
  startup_name VARCHAR(255),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  priority VARCHAR(20) DEFAULT 'normal',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin Activity Log Table
CREATE TABLE IF NOT EXISTS admin_activity_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  action VARCHAR(100) NOT NULL,
  admin_id UUID NOT NULL,
  application_id UUID,
  application_type VARCHAR(50),
  old_status VARCHAR(50),
  new_status VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admin_notifications_type ON admin_notifications(type);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_is_read ON admin_notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_created_at ON admin_notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_admin_id ON admin_activity_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_action ON admin_activity_log(action);
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_created_at ON admin_activity_log(created_at);

-- Enable RLS
ALTER TABLE admin_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin_notifications
CREATE POLICY "Admin notifications are viewable by admin users" ON admin_notifications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admin notifications are insertable by admin users" ON admin_notifications
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admin notifications are updatable by admin users" ON admin_notifications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- RLS Policies for admin_activity_log
CREATE POLICY "Admin activity log is viewable by admin users" ON admin_activity_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admin activity log is insertable by admin users" ON admin_activity_log
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Add admin_notes and reviewed_by columns to application tables if they don't exist
DO $$ 
BEGIN
  -- Incubation Applications
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'incubation_applications' AND column_name = 'admin_notes') THEN
    ALTER TABLE incubation_applications ADD COLUMN admin_notes TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'incubation_applications' AND column_name = 'reviewed_by') THEN
    ALTER TABLE incubation_applications ADD COLUMN reviewed_by UUID REFERENCES profiles(id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'incubation_applications' AND column_name = 'reviewed_at') THEN
    ALTER TABLE incubation_applications ADD COLUMN reviewed_at TIMESTAMPTZ;
  END IF;

  -- Investment Applications
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'investment_applications' AND column_name = 'admin_notes') THEN
    ALTER TABLE investment_applications ADD COLUMN admin_notes TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'investment_applications' AND column_name = 'reviewed_by') THEN
    ALTER TABLE investment_applications ADD COLUMN reviewed_by UUID REFERENCES profiles(id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'investment_applications' AND column_name = 'reviewed_at') THEN
    ALTER TABLE investment_applications ADD COLUMN reviewed_at TIMESTAMPTZ;
  END IF;

  -- Mentor Applications
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mentor_applications' AND column_name = 'admin_notes') THEN
    ALTER TABLE mentor_applications ADD COLUMN admin_notes TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mentor_applications' AND column_name = 'reviewed_by') THEN
    ALTER TABLE mentor_applications ADD COLUMN reviewed_by UUID REFERENCES profiles(id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'mentor_applications' AND column_name = 'reviewed_at') THEN
    ALTER TABLE mentor_applications ADD COLUMN reviewed_at TIMESTAMPTZ;
  END IF;

  -- Program Applications
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'program_applications' AND column_name = 'admin_notes') THEN
    ALTER TABLE program_applications ADD COLUMN admin_notes TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'program_applications' AND column_name = 'reviewed_by') THEN
    ALTER TABLE program_applications ADD COLUMN reviewed_by UUID REFERENCES profiles(id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'program_applications' AND column_name = 'reviewed_at') THEN
    ALTER TABLE program_applications ADD COLUMN reviewed_at TIMESTAMPTZ;
  END IF;

  -- Grant Applications
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'grant_applications' AND column_name = 'admin_notes') THEN
    ALTER TABLE grant_applications ADD COLUMN admin_notes TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'grant_applications' AND column_name = 'reviewed_by') THEN
    ALTER TABLE grant_applications ADD COLUMN reviewed_by UUID REFERENCES profiles(id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'grant_applications' AND column_name = 'reviewed_at') THEN
    ALTER TABLE grant_applications ADD COLUMN reviewed_at TIMESTAMPTZ;
  END IF;

  -- Partnership Requests
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'partnership_requests' AND column_name = 'admin_notes') THEN
    ALTER TABLE partnership_requests ADD COLUMN admin_notes TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'partnership_requests' AND column_name = 'reviewed_by') THEN
    ALTER TABLE partnership_requests ADD COLUMN reviewed_by UUID REFERENCES profiles(id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'partnership_requests' AND column_name = 'reviewed_at') THEN
    ALTER TABLE partnership_requests ADD COLUMN reviewed_at TIMESTAMPTZ;
  END IF;
END $$;

-- Create function to automatically create admin notification when new application is submitted
CREATE OR REPLACE FUNCTION create_admin_notification()
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
    'new_application',
    NEW.id,
    TG_TABLE_NAME,
    COALESCE(NEW.founder_name, NEW.applicant_name, 'Unknown'),
    COALESCE(NEW.startup_name, NEW.company_name, 'N/A'),
    'New ' || TG_TABLE_NAME || ' application submitted',
    'high'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for new application notifications
DROP TRIGGER IF EXISTS trigger_incubation_notification ON incubation_applications;
CREATE TRIGGER trigger_incubation_notification
  AFTER INSERT ON incubation_applications
  FOR EACH ROW
  EXECUTE FUNCTION create_admin_notification();

DROP TRIGGER IF EXISTS trigger_investment_notification ON investment_applications;
CREATE TRIGGER trigger_investment_notification
  AFTER INSERT ON investment_applications
  FOR EACH ROW
  EXECUTE FUNCTION create_admin_notification();

DROP TRIGGER IF EXISTS trigger_mentor_notification ON mentor_applications;
CREATE TRIGGER trigger_mentor_notification
  AFTER INSERT ON mentor_applications
  FOR EACH ROW
  EXECUTE FUNCTION create_admin_notification();

DROP TRIGGER IF EXISTS trigger_program_notification ON program_applications;
CREATE TRIGGER trigger_program_notification
  AFTER INSERT ON program_applications
  FOR EACH ROW
  EXECUTE FUNCTION create_admin_notification();

DROP TRIGGER IF EXISTS trigger_grant_notification ON grant_applications;
CREATE TRIGGER trigger_grant_notification
  AFTER INSERT ON grant_applications
  FOR EACH ROW
  EXECUTE FUNCTION create_admin_notification();

DROP TRIGGER IF EXISTS trigger_partnership_notification ON partnership_requests;
CREATE TRIGGER trigger_partnership_notification
  AFTER INSERT ON partnership_requests
  FOR EACH ROW
  EXECUTE FUNCTION create_admin_notification();
