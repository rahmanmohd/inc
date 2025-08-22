-- Create new incubation_applications table with program linking
CREATE TABLE IF NOT EXISTS incubation_applications_new (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  program_id UUID NOT NULL,
  founder_name TEXT NOT NULL,
  cofounder_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  linkedin_profile TEXT,
  education TEXT,
  experience TEXT,
  startup_name TEXT NOT NULL,
  website TEXT,
  stage TEXT NOT NULL,
  industry TEXT NOT NULL,
  description TEXT NOT NULL,
  mission TEXT,
  vision TEXT,
  problem_statement TEXT NOT NULL,
  solution_description TEXT NOT NULL,
  target_market TEXT NOT NULL,
  business_model TEXT,
  revenue_model TEXT,
  current_traction TEXT,
  funding_requirements TEXT,
  team_size INTEGER,
  pitch_deck_url TEXT,
  financials_url TEXT,
  status TEXT NOT NULL DEFAULT 'submitted',
  admin_notes TEXT,
  reviewed_by UUID,
  reviewed_at TIMESTAMPTZ,
  decision_note TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  -- Foreign key constraints
  CONSTRAINT fk_incubation_applications_user_id FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT fk_incubation_applications_program_id FOREIGN KEY (program_id) REFERENCES incubation_programs(id) ON DELETE CASCADE,
  CONSTRAINT fk_incubation_applications_reviewed_by FOREIGN KEY (reviewed_by) REFERENCES profiles(id)
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_incubation_applications_program_id ON incubation_applications_new(program_id);
CREATE INDEX IF NOT EXISTS idx_incubation_applications_user_id ON incubation_applications_new(user_id);
CREATE INDEX IF NOT EXISTS idx_incubation_applications_status ON incubation_applications_new(status);
CREATE INDEX IF NOT EXISTS idx_incubation_applications_created_at ON incubation_applications_new(created_at);

-- Enable RLS
ALTER TABLE incubation_applications_new ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view their own applications
CREATE POLICY "Users can view their own incubation applications" ON incubation_applications_new
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own applications
CREATE POLICY "Users can insert their own incubation applications" ON incubation_applications_new
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own applications (before review)
CREATE POLICY "Users can update their own incubation applications" ON incubation_applications_new
  FOR UPDATE USING (auth.uid() = user_id AND status = 'submitted');

-- Admins can view all applications
CREATE POLICY "Admins can view all incubation applications" ON incubation_applications_new
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Admins can update all applications
CREATE POLICY "Admins can update all incubation applications" ON incubation_applications_new
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Service role can manage all applications (for email service)
CREATE POLICY "Service role can manage all incubation applications" ON incubation_applications_new
  FOR ALL USING (auth.role() = 'service_role');
