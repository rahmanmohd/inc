-- Update hackathon_registrations table to support individual registrations
-- Drop existing table and recreate with new schema

DROP TABLE IF EXISTS hackathon_registrations CASCADE;

CREATE TABLE hackathon_registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    hackathon_id TEXT NOT NULL DEFAULT '1',
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    age TEXT NOT NULL,
    city TEXT NOT NULL,
    college TEXT,
    graduation_year TEXT,
    programming_languages TEXT NOT NULL,
    experience TEXT NOT NULL,
    frameworks TEXT,
    specialization TEXT,
    github_profile TEXT,
    portfolio TEXT,
    agreements BOOLEAN NOT NULL DEFAULT false,
    hackathon_title TEXT NOT NULL DEFAULT 'AI Innovation Challenge 2025',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_hackathon_registrations_user_id ON hackathon_registrations(user_id);
CREATE INDEX idx_hackathon_registrations_status ON hackathon_registrations(status);
CREATE INDEX idx_hackathon_registrations_created_at ON hackathon_registrations(created_at);
CREATE INDEX idx_hackathon_registrations_email ON hackathon_registrations(email);

-- Enable Row Level Security
ALTER TABLE hackathon_registrations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view their own registrations
CREATE POLICY "Users can view own hackathon registrations" ON hackathon_registrations
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own registrations
CREATE POLICY "Users can insert own hackathon registrations" ON hackathon_registrations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own registrations (only if status is pending)
CREATE POLICY "Users can update own pending hackathon registrations" ON hackathon_registrations
    FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

-- Admins can view all registrations
CREATE POLICY "Admins can view all hackathon registrations" ON hackathon_registrations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Admins can update all registrations
CREATE POLICY "Admins can update all hackathon registrations" ON hackathon_registrations
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Admins can delete all registrations
CREATE POLICY "Admins can delete all hackathon registrations" ON hackathon_registrations
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Create trigger to update updated_at column
CREATE OR REPLACE FUNCTION update_hackathon_registrations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_hackathon_registrations_updated_at
    BEFORE UPDATE ON hackathon_registrations
    FOR EACH ROW
    EXECUTE FUNCTION update_hackathon_registrations_updated_at();

-- Create trigger for admin notifications when new registration is created
CREATE OR REPLACE FUNCTION create_hackathon_registration_notification()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO admin_notifications (
        type,
        title,
        message,
        data,
        created_at
    ) VALUES (
        'hackathon_registration',
        'New Hackathon Registration',
        'A new hackathon registration has been submitted by ' || COALESCE(NEW.full_name, 'Unknown User'),
        jsonb_build_object(
            'registration_id', NEW.id,
            'user_id', NEW.user_id,
            'full_name', NEW.full_name,
            'email', NEW.email,
            'hackathon_title', NEW.hackathon_title,
            'status', NEW.status
        ),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER hackathon_registration_notification_trigger
    AFTER INSERT ON hackathon_registrations
    FOR EACH ROW
    EXECUTE FUNCTION create_hackathon_registration_notification();

-- Insert sample data for testing
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
    status,
    created_at
) VALUES 
(
    '00000000-0000-0000-0000-000000000001',
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
    'pending',
    NOW() - INTERVAL '2 days'
),
(
    '00000000-0000-0000-0000-000000000002',
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
    'approved',
    NOW() - INTERVAL '5 days'
),
(
    '00000000-0000-0000-0000-000000000003',
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
    'rejected',
    NOW() - INTERVAL '1 day'
);
