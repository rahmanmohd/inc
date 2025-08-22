-- Create incubation_programs table for dynamic incubation program management
CREATE TABLE IF NOT EXISTS incubation_programs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT NOT NULL,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  application_open_date TIMESTAMPTZ,
  application_close_date TIMESTAMPTZ,
  location TEXT,
  duration TEXT,
  equity_requirement TEXT,
  funding_amount TEXT,
  expected_startups INTEGER,
  tags TEXT[],
  cover_image_url TEXT,
  status TEXT DEFAULT 'draft',
  published BOOLEAN DEFAULT false,
  application_count INTEGER DEFAULT 0,
  is_default BOOLEAN DEFAULT false,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_incubation_programs_published ON incubation_programs(published);
CREATE INDEX IF NOT EXISTS idx_incubation_programs_status ON incubation_programs(status);
CREATE INDEX IF NOT EXISTS idx_incubation_programs_end_date ON incubation_programs(end_date);
CREATE INDEX IF NOT EXISTS idx_incubation_programs_created_by ON incubation_programs(created_by);

-- Enable RLS
ALTER TABLE incubation_programs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Public can view published programs
CREATE POLICY "Public can view published incubation programs" ON incubation_programs
  FOR SELECT USING (published = true);

-- Users can view their own programs
CREATE POLICY "Users can view their own incubation programs" ON incubation_programs
  FOR SELECT USING (auth.uid() = created_by);

-- Users can manage their own programs
CREATE POLICY "Users can manage their own incubation programs" ON incubation_programs
  FOR ALL USING (auth.uid() = created_by);

-- Admins can manage all programs
CREATE POLICY "Admins can manage all incubation programs" ON incubation_programs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Insert default incubation program
INSERT INTO incubation_programs (
  title,
  subtitle,
  description,
  start_date,
  end_date,
  application_open_date,
  application_close_date,
  location,
  duration,
  equity_requirement,
  funding_amount,
  expected_startups,
  tags,
  status,
  published,
  is_default
) VALUES (
  'Tech Innovation Incubation Program 2024',
  'Transform Your Startup with Expert Mentorship & Resources',
  'Join our flagship incubation program designed to accelerate early-stage tech startups. Get access to mentorship, funding opportunities, workspace, and a network of successful entrepreneurs and investors.',
  '2024-03-01 00:00:00+00',
  '2024-12-31 23:59:59+00',
  '2024-01-01 00:00:00+00',
  '2024-02-28 23:59:59+00',
  'Hybrid (Online + Bangalore)',
  '10 months',
  '5-15% equity',
  'Up to ₹50 Lakhs',
  20,
  ARRAY['tech', 'startup', 'incubation', 'mentorship', 'funding'],
  'published',
  true,
  true
);
