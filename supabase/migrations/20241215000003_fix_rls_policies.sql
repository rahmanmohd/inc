-- Enable RLS on all application tables
ALTER TABLE incubation_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE hackathon_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE grant_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE partnership_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can insert their own incubation applications" ON incubation_applications;
DROP POLICY IF EXISTS "Users can view their own incubation applications" ON incubation_applications;
DROP POLICY IF EXISTS "Admins can view all incubation applications" ON incubation_applications;

DROP POLICY IF EXISTS "Users can insert their own investment applications" ON investment_applications;
DROP POLICY IF EXISTS "Users can view their own investment applications" ON investment_applications;
DROP POLICY IF EXISTS "Admins can view all investment applications" ON investment_applications;

DROP POLICY IF EXISTS "Users can insert their own program applications" ON program_applications;
DROP POLICY IF EXISTS "Users can view their own program applications" ON program_applications;
DROP POLICY IF EXISTS "Admins can view all program applications" ON program_applications;

DROP POLICY IF EXISTS "Users can insert their own mentor applications" ON mentor_applications;
DROP POLICY IF EXISTS "Users can view their own mentor applications" ON mentor_applications;
DROP POLICY IF EXISTS "Admins can view all mentor applications" ON mentor_applications;

DROP POLICY IF EXISTS "Users can insert their own consultations" ON consultations;
DROP POLICY IF EXISTS "Users can view their own consultations" ON consultations;
DROP POLICY IF EXISTS "Admins can view all consultations" ON consultations;

DROP POLICY IF EXISTS "Users can insert their own hackathon registrations" ON hackathon_registrations;
DROP POLICY IF EXISTS "Users can view their own hackathon registrations" ON hackathon_registrations;
DROP POLICY IF EXISTS "Admins can view all hackathon registrations" ON hackathon_registrations;

DROP POLICY IF EXISTS "Users can insert their own grant applications" ON grant_applications;
DROP POLICY IF EXISTS "Users can view their own grant applications" ON grant_applications;
DROP POLICY IF EXISTS "Admins can view all grant applications" ON grant_applications;

DROP POLICY IF EXISTS "Users can insert their own partnership requests" ON partnership_requests;
DROP POLICY IF EXISTS "Users can view their own partnership requests" ON partnership_requests;
DROP POLICY IF EXISTS "Admins can view all partnership requests" ON partnership_requests;

DROP POLICY IF EXISTS "Users can insert their own contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Users can view their own contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Admins can view all contact messages" ON contact_messages;

-- Create policies for incubation_applications
CREATE POLICY "Users can insert their own incubation applications" ON incubation_applications
  FOR INSERT WITH CHECK (auth.uid()::text = applicant_id::text);

CREATE POLICY "Users can view their own incubation applications" ON incubation_applications
  FOR SELECT USING (auth.uid()::text = applicant_id::text);

CREATE POLICY "Admins can view all incubation applications" ON incubation_applications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Create policies for investment_applications
CREATE POLICY "Users can insert their own investment applications" ON investment_applications
  FOR INSERT WITH CHECK (auth.uid()::text = applicant_id::text);

CREATE POLICY "Users can view their own investment applications" ON investment_applications
  FOR SELECT USING (auth.uid()::text = applicant_id::text);

CREATE POLICY "Admins can view all investment applications" ON investment_applications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Create policies for program_applications
CREATE POLICY "Users can insert their own program applications" ON program_applications
  FOR INSERT WITH CHECK (auth.uid()::text = applicant_id::text);

CREATE POLICY "Users can view their own program applications" ON program_applications
  FOR SELECT USING (auth.uid()::text = applicant_id::text);

CREATE POLICY "Admins can view all program applications" ON program_applications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Create policies for mentor_applications
CREATE POLICY "Users can insert their own mentor applications" ON mentor_applications
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view their own mentor applications" ON mentor_applications
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Admins can view all mentor applications" ON mentor_applications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Create policies for consultations
CREATE POLICY "Users can insert their own consultations" ON consultations
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view their own consultations" ON consultations
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Admins can view all consultations" ON consultations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Create policies for hackathon_registrations
CREATE POLICY "Users can insert their own hackathon registrations" ON hackathon_registrations
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view their own hackathon registrations" ON hackathon_registrations
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Admins can view all hackathon registrations" ON hackathon_registrations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Create policies for grant_applications
CREATE POLICY "Users can insert their own grant applications" ON grant_applications
  FOR INSERT WITH CHECK (auth.uid()::text = applicant_id::text);

CREATE POLICY "Users can view their own grant applications" ON grant_applications
  FOR SELECT USING (auth.uid()::text = applicant_id::text);

CREATE POLICY "Admins can view all grant applications" ON grant_applications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Create policies for partnership_requests
CREATE POLICY "Users can insert their own partnership requests" ON partnership_requests
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view their own partnership requests" ON partnership_requests
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Admins can view all partnership requests" ON partnership_requests
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Create policies for contact_messages
CREATE POLICY "Users can insert their own contact messages" ON contact_messages
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view their own contact messages" ON contact_messages
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Admins can view all contact messages" ON contact_messages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );
