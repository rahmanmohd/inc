-- Clean up hackathon_registrations table schema
-- Remove team-based fields and ensure individual registration schema is consistent

-- First, let's clean up the existing table
ALTER TABLE hackathon_registrations 
  -- Drop team-based columns that are no longer needed
  DROP COLUMN IF EXISTS team_name,
  DROP COLUMN IF EXISTS team_size,
  DROP COLUMN IF EXISTS member2_name,
  DROP COLUMN IF EXISTS member2_email,
  DROP COLUMN IF EXISTS member3_name,
  DROP COLUMN IF EXISTS member3_email,
  DROP COLUMN IF EXISTS member4_name,
  DROP COLUMN IF EXISTS member4_email,
  DROP COLUMN IF EXISTS university,
  DROP COLUMN IF EXISTS track,
  DROP COLUMN IF EXISTS project_idea,
  DROP COLUMN IF EXISTS technical_skills,
  DROP COLUMN IF EXISTS previous_hackathons,
  DROP COLUMN IF EXISTS dietary_requirements,
  DROP COLUMN IF EXISTS accommodation,
  DROP COLUMN IF EXISTS linkedin_profile;

-- Ensure all required individual registration fields exist with correct types
ALTER TABLE hackathon_registrations 
  -- Make sure required fields are NOT NULL
  ALTER COLUMN full_name SET NOT NULL,
  ALTER COLUMN email SET NOT NULL,
  ALTER COLUMN user_id SET NOT NULL,
  
  -- Ensure phone is NOT NULL for individual registrations
  ALTER COLUMN phone SET NOT NULL,
  
  -- Ensure age is NOT NULL for individual registrations  
  ALTER COLUMN age SET NOT NULL,
  
  -- Ensure city is NOT NULL for individual registrations
  ALTER COLUMN city SET NOT NULL,
  
  -- Rename graduation to graduation_year for consistency
  ADD COLUMN IF NOT EXISTS graduation_year TEXT,
  
  -- Add missing fields if they don't exist
  ADD COLUMN IF NOT EXISTS hackathon_id TEXT NOT NULL DEFAULT '1',
  ADD COLUMN IF NOT EXISTS hackathon_title TEXT NOT NULL DEFAULT 'AI Innovation Challenge 2025',
  ADD COLUMN IF NOT EXISTS admin_notes TEXT,
  
  -- Ensure status has proper constraint
  ADD CONSTRAINT hackathon_registrations_status_check 
    CHECK (status IN ('pending', 'approved', 'rejected'));

-- Copy graduation data to graduation_year if graduation column exists
UPDATE hackathon_registrations 
SET graduation_year = graduation 
WHERE graduation IS NOT NULL AND graduation_year IS NULL;

-- Drop the old graduation column if it exists
ALTER TABLE hackathon_registrations DROP COLUMN IF EXISTS graduation;

-- Ensure proper indexes exist
CREATE INDEX IF NOT EXISTS idx_hackathon_registrations_user_id ON hackathon_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_hackathon_registrations_status ON hackathon_registrations(status);
CREATE INDEX IF NOT EXISTS idx_hackathon_registrations_created_at ON hackathon_registrations(created_at);
CREATE INDEX IF NOT EXISTS idx_hackathon_registrations_email ON hackathon_registrations(email);
CREATE INDEX IF NOT EXISTS idx_hackathon_registrations_hackathon_id ON hackathon_registrations(hackathon_id);

-- Update RLS policies to ensure they're correct
DROP POLICY IF EXISTS "Users can view own hackathon registrations" ON hackathon_registrations;
DROP POLICY IF EXISTS "Users can insert own hackathon registrations" ON hackathon_registrations;
DROP POLICY IF EXISTS "Users can update own pending hackathon registrations" ON hackathon_registrations;
DROP POLICY IF EXISTS "Admins can view all hackathon registrations" ON hackathon_registrations;
DROP POLICY IF EXISTS "Admins can update all hackathon registrations" ON hackathon_registrations;
DROP POLICY IF EXISTS "Admins can delete all hackathon registrations" ON hackathon_registrations;

-- Recreate RLS policies
CREATE POLICY "Users can view own hackathon registrations" ON hackathon_registrations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own hackathon registrations" ON hackathon_registrations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pending hackathon registrations" ON hackathon_registrations
    FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Admins can view all hackathon registrations" ON hackathon_registrations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Admins can update all hackathon registrations" ON hackathon_registrations
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Admins can delete all hackathon registrations" ON hackathon_registrations
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Ensure the notification trigger exists
DROP TRIGGER IF EXISTS hackathon_registration_notification_trigger ON hackathon_registrations;
DROP FUNCTION IF EXISTS create_hackathon_registration_notification();

CREATE OR REPLACE FUNCTION create_hackathon_registration_notification()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO admin_notifications (
        type,
        application_id,
        application_type,
        applicant_name,
        message,
        created_at
    ) VALUES (
        'hackathon_registration',
        NEW.id,
        'hackathon',
        NEW.full_name,
        'New hackathon registration submitted by ' || COALESCE(NEW.full_name, 'Unknown User'),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER hackathon_registration_notification_trigger
    AFTER INSERT ON hackathon_registrations
    FOR EACH ROW
    EXECUTE FUNCTION create_hackathon_registration_notification();

-- Clean up any existing invalid data and set defaults
UPDATE hackathon_registrations 
SET 
    hackathon_id = '1' 
WHERE hackathon_id IS NULL;

UPDATE hackathon_registrations 
SET 
    hackathon_title = 'AI Innovation Challenge 2025' 
WHERE hackathon_title IS NULL;

UPDATE hackathon_registrations 
SET 
    status = 'pending' 
WHERE status IS NULL;

-- Add some sample individual registrations for testing (only if table is empty)
INSERT INTO hackathon_registrations (
    user_id,
    full_name,
    email,
    phone,
    age,
    city,
    college,
    graduation_year,
    programming_languages,
    experience,
    frameworks,
    specialization,
    github_profile,
    portfolio,
    agreements,
    hackathon_id,
    hackathon_title,
    status,
    created_at
)
SELECT * FROM (
    VALUES 
    (
        '00000000-0000-0000-0000-000000000001'::uuid,
        'John Doe',
        'john.doe@example.com',
        '+1234567890',
        '22',
        'New York',
        'MIT',
        '2025',
        'Python, JavaScript, Java',
        'Intermediate',
        'React, Node.js, Django',
        'Full Stack Development',
        'https://github.com/johndoe',
        'https://johndoe.dev',
        true,
        '1',
        'AI Innovation Challenge 2025',
        'pending',
        NOW() - INTERVAL '2 days'
    ),
    (
        '00000000-0000-0000-0000-000000000002'::uuid,
        'Jane Smith',
        'jane.smith@example.com',
        '+1234567891',
        '24',
        'San Francisco',
        'Stanford University',
        '2024',
        'Python, C++, JavaScript',
        'Advanced',
        'TensorFlow, PyTorch, React',
        'Machine Learning',
        'https://github.com/janesmith',
        'https://janesmith.ai',
        true,
        '1',
        'AI Innovation Challenge 2025',
        'approved',
        NOW() - INTERVAL '5 days'
    ),
    (
        '00000000-0000-0000-0000-000000000003'::uuid,
        'Mike Johnson',
        'mike.johnson@example.com',
        '+1234567892',
        '20',
        'Austin',
        'University of Texas',
        '2026',
        'JavaScript, TypeScript, Python',
        'Beginner',
        'React, Express, MongoDB',
        'Frontend Development',
        'https://github.com/mikejohnson',
        'https://mikejohnson.dev',
        true,
        '1',
        'AI Innovation Challenge 2025',
        'rejected',
        NOW() - INTERVAL '1 day'
    )
) AS sample_data(user_id, full_name, email, phone, age, city, college, graduation_year, programming_languages, experience, frameworks, specialization, github_profile, portfolio, agreements, hackathon_id, hackathon_title, status, created_at)
WHERE NOT EXISTS (SELECT 1 FROM hackathon_registrations LIMIT 1);
