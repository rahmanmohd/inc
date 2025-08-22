-- Create investors table
CREATE TABLE IF NOT EXISTS investors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  email VARCHAR(255),
  check_size VARCHAR(100),
  investment_stage VARCHAR(100),
  sectors TEXT[] DEFAULT '{}',
  portfolio_count INTEGER DEFAULT 0,
  portfolio_value DECIMAL(15,2) DEFAULT 0,
  recent_investments INTEGER DEFAULT 0,
  success_rate DECIMAL(5,2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_investors_name ON investors(name);
CREATE INDEX IF NOT EXISTS idx_investors_status ON investors(status);
CREATE INDEX IF NOT EXISTS idx_investors_created_at ON investors(created_at);
CREATE INDEX IF NOT EXISTS idx_investors_sectors ON investors USING GIN(sectors);

-- Enable RLS
ALTER TABLE investors ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DROP POLICY IF EXISTS "Users can view all investors" ON investors;
CREATE POLICY "Users can view all investors" ON investors
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can insert investors" ON investors;
CREATE POLICY "Admins can insert investors" ON investors
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can update investors" ON investors;
CREATE POLICY "Admins can update investors" ON investors
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can delete investors" ON investors;
CREATE POLICY "Admins can delete investors" ON investors
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Create trigger to update updated_at column
CREATE OR REPLACE FUNCTION update_investors_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_investors_updated_at ON investors;
CREATE TRIGGER update_investors_updated_at
  BEFORE UPDATE ON investors
  FOR EACH ROW
  EXECUTE FUNCTION update_investors_updated_at_column();

-- Insert sample data
INSERT INTO investors (name, description, email, check_size, investment_stage, sectors, portfolio_count, portfolio_value, recent_investments, success_rate, status) VALUES
('Sequoia Capital India', 'Leading venture capital firm focused on early and growth-stage investments', 'contact@sequoia.com', '₹5-50Cr', 'Series A+', ARRAY['FinTech', 'HealthTech', 'AI/ML'], 45, 2500.00, 8, 85.5, 'active'),
('Accel Partners', 'Global venture capital firm investing in early-stage startups', 'contact@accel.com', '₹2-25Cr', 'Seed-Series B', ARRAY['SaaS', 'E-commerce', 'EdTech'], 38, 1800.00, 6, 78.2, 'active'),
('Matrix Partners', 'Venture capital firm investing in technology companies', 'contact@matrix.com', '₹1-15Cr', 'Pre-Seed-Series A', ARRAY['FinTech', 'Enterprise', 'Consumer'], 52, 1200.00, 5, 82.1, 'active'),
('Blume Ventures', 'Early-stage venture capital firm', 'contact@blume.com', '₹50L-5Cr', 'Pre-Seed-Seed', ARRAY['FinTech', 'EdTech', 'HealthTech'], 28, 800.00, 4, 75.8, 'active'),
('Kalaari Capital', 'Early-stage venture capital firm', 'contact@kalaari.com', '₹1-10Cr', 'Seed-Series A', ARRAY['E-commerce', 'FinTech', 'SaaS'], 35, 950.00, 7, 79.3, 'active'),
('Nexus Venture Partners', 'Early-stage venture capital firm', 'contact@nexus.com', '₹2-20Cr', 'Seed-Series B', ARRAY['Enterprise', 'FinTech', 'HealthTech'], 42, 1600.00, 6, 81.7, 'active'),
('Chiratae Ventures', 'Technology-focused venture capital firm', 'contact@chiratae.com', '₹1-15Cr', 'Seed-Series A', ARRAY['AI/ML', 'FinTech', 'HealthTech'], 31, 1100.00, 5, 77.9, 'active'),
('Elevation Capital', 'Early-stage venture capital firm', 'contact@elevation.com', '₹2-25Cr', 'Seed-Series B', ARRAY['FinTech', 'E-commerce', 'EdTech'], 39, 1400.00, 8, 83.4, 'active'),
('Lightspeed India', 'Early-stage venture capital firm', 'contact@lightspeed.com', '₹1-20Cr', 'Seed-Series A', ARRAY['Consumer', 'FinTech', 'SaaS'], 46, 1700.00, 7, 80.6, 'active'),
('Tiger Global', 'Global investment firm', 'contact@tiger.com', '₹10-100Cr', 'Series A+', ARRAY['FinTech', 'E-commerce', 'EdTech'], 58, 3500.00, 12, 87.2, 'active');
