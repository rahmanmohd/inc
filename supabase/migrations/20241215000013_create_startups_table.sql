-- Create startups table for startup management
CREATE TABLE IF NOT EXISTS startups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  industry TEXT,
  stage TEXT DEFAULT 'Pre-Seed',
  website TEXT,
  location TEXT,
  team_size INTEGER,
  founded_year INTEGER,
  logo_url TEXT,
  published BOOLEAN DEFAULT true,
  owner_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_startups_name ON startups(name);
CREATE INDEX IF NOT EXISTS idx_startups_industry ON startups(industry);
CREATE INDEX IF NOT EXISTS idx_startups_stage ON startups(stage);
CREATE INDEX IF NOT EXISTS idx_startups_published ON startups(published);
CREATE INDEX IF NOT EXISTS idx_startups_created_at ON startups(created_at);
CREATE INDEX IF NOT EXISTS idx_startups_owner_id ON startups(owner_id);

-- Enable Row Level Security
ALTER TABLE startups ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view published startups" ON startups
  FOR SELECT USING (published = true);

CREATE POLICY "Users can view their own startups" ON startups
  FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Admins can view all startups" ON startups
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Users can insert their own startups" ON startups
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Admins can insert startups" ON startups
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Users can update their own startups" ON startups
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Admins can update all startups" ON startups
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Users can delete their own startups" ON startups
  FOR DELETE USING (auth.uid() = owner_id);

CREATE POLICY "Admins can delete all startups" ON startups
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_startups_updated_at 
  BEFORE UPDATE ON startups 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
