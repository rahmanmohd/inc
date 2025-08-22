-- Fix hackathon_registrations table schema to match form data
ALTER TABLE hackathon_registrations 
ADD COLUMN IF NOT EXISTS team_name TEXT,
ADD COLUMN IF NOT EXISTS team_size TEXT,
ADD COLUMN IF NOT EXISTS university TEXT,
ADD COLUMN IF NOT EXISTS experience TEXT,
ADD COLUMN IF NOT EXISTS track TEXT,
ADD COLUMN IF NOT EXISTS project_idea TEXT,
ADD COLUMN IF NOT EXISTS technical_skills TEXT,
ADD COLUMN IF NOT EXISTS previous_hackathons TEXT,
ADD COLUMN IF NOT EXISTS dietary_requirements TEXT,
ADD COLUMN IF NOT EXISTS accommodation BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS member2_name TEXT,
ADD COLUMN IF NOT EXISTS member2_email TEXT,
ADD COLUMN IF NOT EXISTS member3_name TEXT,
ADD COLUMN IF NOT EXISTS member3_email TEXT,
ADD COLUMN IF NOT EXISTS member4_name TEXT,
ADD COLUMN IF NOT EXISTS member4_email TEXT,
ADD COLUMN IF NOT EXISTS age TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS college TEXT,
ADD COLUMN IF NOT EXISTS graduation TEXT,
ADD COLUMN IF NOT EXISTS programming_languages TEXT,
ADD COLUMN IF NOT EXISTS frameworks TEXT,
ADD COLUMN IF NOT EXISTS specialization TEXT,
ADD COLUMN IF NOT EXISTS github_profile TEXT,
ADD COLUMN IF NOT EXISTS portfolio TEXT,
ADD COLUMN IF NOT EXISTS agreements BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS hackathon_title TEXT;

-- Create additional indexes for better performance
CREATE INDEX IF NOT EXISTS idx_hackathon_registrations_email ON hackathon_registrations(email);
CREATE INDEX IF NOT EXISTS idx_hackathon_registrations_status ON hackathon_registrations(status);
CREATE INDEX IF NOT EXISTS idx_hackathon_registrations_created_at ON hackathon_registrations(created_at);
