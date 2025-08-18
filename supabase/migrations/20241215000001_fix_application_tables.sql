-- Fix application tables schema issues

-- 1. Add missing fields to hackathon_registrations
ALTER TABLE hackathon_registrations 
ADD COLUMN IF NOT EXISTS hackathon_id TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS linkedin_profile TEXT;

-- 2. Add missing fields to incubation_applications
ALTER TABLE incubation_applications 
ADD COLUMN IF NOT EXISTS user_id UUID,
ADD COLUMN IF NOT EXISTS linkedin_profile TEXT;

-- 3. Add missing fields to investment_applications
ALTER TABLE investment_applications 
ADD COLUMN IF NOT EXISTS user_id UUID,
ADD COLUMN IF NOT EXISTS target_investor TEXT,
ADD COLUMN IF NOT EXISTS funding_amount TEXT,
ADD COLUMN IF NOT EXISTS funding_stage TEXT,
ADD COLUMN IF NOT EXISTS current_valuation TEXT,
ADD COLUMN IF NOT EXISTS monthly_revenue TEXT,
ADD COLUMN IF NOT EXISTS user_traction TEXT,
ADD COLUMN IF NOT EXISTS financial_statements_url TEXT;

-- 4. Add missing fields to program_applications
ALTER TABLE program_applications 
ADD COLUMN IF NOT EXISTS user_id UUID,
ADD COLUMN IF NOT EXISTS program_name TEXT,
ADD COLUMN IF NOT EXISTS current_stage TEXT,
ADD COLUMN IF NOT EXISTS problem_statement TEXT,
ADD COLUMN IF NOT EXISTS solution_description TEXT,
ADD COLUMN IF NOT EXISTS target_market TEXT,
ADD COLUMN IF NOT EXISTS current_traction TEXT,
ADD COLUMN IF NOT EXISTS funding_requirements TEXT,
ADD COLUMN IF NOT EXISTS why_join TEXT;

-- 5. Add missing fields to mentor_applications
ALTER TABLE mentor_applications 
ADD COLUMN IF NOT EXISTS user_id UUID,
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS current_position TEXT,
ADD COLUMN IF NOT EXISTS company TEXT,
ADD COLUMN IF NOT EXISTS years_of_experience TEXT,
ADD COLUMN IF NOT EXISTS area_of_expertise TEXT,
ADD COLUMN IF NOT EXISTS linkedin_profile TEXT,
ADD COLUMN IF NOT EXISTS why_mentor TEXT,
ADD COLUMN IF NOT EXISTS industry_experience TEXT,
ADD COLUMN IF NOT EXISTS time_commitment TEXT;

-- 6. Add missing fields to consultations
ALTER TABLE consultations 
ADD COLUMN IF NOT EXISTS user_id UUID,
ADD COLUMN IF NOT EXISTS consultation_type TEXT;

-- 7. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_hackathon_registrations_user_id ON hackathon_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_hackathon_registrations_hackathon_id ON hackathon_registrations(hackathon_id);
CREATE INDEX IF NOT EXISTS idx_incubation_applications_user_id ON incubation_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_investment_applications_user_id ON investment_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_program_applications_user_id ON program_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_mentor_applications_user_id ON mentor_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_consultations_user_id ON consultations(user_id);

-- 8. Add RLS policies for security
ALTER TABLE hackathon_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE incubation_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentor_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;

-- Users can view their own applications
CREATE POLICY "Users can view own hackathon registrations" ON hackathon_registrations
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own incubation applications" ON incubation_applications
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own investment applications" ON investment_applications
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own program applications" ON program_applications
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own mentor applications" ON mentor_applications
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view own consultations" ON consultations
    FOR SELECT USING (auth.uid()::text = user_id::text);

-- Users can insert their own applications
CREATE POLICY "Users can insert own hackathon registrations" ON hackathon_registrations
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own incubation applications" ON incubation_applications
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own investment applications" ON investment_applications
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own program applications" ON program_applications
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own mentor applications" ON mentor_applications
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own consultations" ON consultations
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Admins can view all applications
CREATE POLICY "Admins can view all applications" ON hackathon_registrations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Admins can view all applications" ON incubation_applications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Admins can view all applications" ON investment_applications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Admins can view all applications" ON program_applications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Admins can view all applications" ON mentor_applications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Admins can view all applications" ON consultations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );
