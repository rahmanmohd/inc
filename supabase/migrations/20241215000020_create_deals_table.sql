-- Create deals table
CREATE TABLE IF NOT EXISTS deals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  deal_name VARCHAR(255) NOT NULL,
  startup_name VARCHAR(255) NOT NULL,
  investor_name VARCHAR(255) NOT NULL,
  deal_value DECIMAL(15,2) NOT NULL,
  deal_stage VARCHAR(100) NOT NULL,
  sector VARCHAR(100) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'active',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_deals_status ON deals(status);
CREATE INDEX IF NOT EXISTS idx_deals_created_at ON deals(created_at);
CREATE INDEX IF NOT EXISTS idx_deals_deal_stage ON deals(deal_stage);
CREATE INDEX IF NOT EXISTS idx_deals_sector ON deals(sector);
CREATE INDEX IF NOT EXISTS idx_deals_created_by ON deals(created_by);

-- Enable RLS
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Admin can view all deals" ON deals
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admin can insert deals" ON deals
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admin can update deals" ON deals
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admin can delete deals" ON deals
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_deals_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_deals_updated_at 
  BEFORE UPDATE ON deals 
  FOR EACH ROW 
  EXECUTE FUNCTION update_deals_updated_at_column();

-- Insert sample data
INSERT INTO deals (deal_name, startup_name, investor_name, deal_value, deal_stage, sector, description, status) VALUES
('Series A Funding', 'TechStart Inc', 'Venture Capital Partners', 5000000.00, 'Series A', 'Technology', 'Leading AI startup raising Series A for product development and market expansion', 'active'),
('Seed Round', 'HealthTech Solutions', 'Angel Investor Group', 1200000.00, 'Seed', 'Healthcare', 'Innovative healthcare platform for remote patient monitoring', 'active'),
('Series B Funding', 'FinanceFlow', 'Growth Equity Fund', 15000000.00, 'Series B', 'Fintech', 'Digital banking solution for SMEs looking to scale operations', 'completed'),
('Pre-Series A', 'EduLearn Platform', 'EdTech Ventures', 2500000.00, 'Pre-Series A', 'Education', 'Online learning platform with AI-powered personalization', 'active'),
('Series C Funding', 'GreenEnergy Co', 'Climate Investment Fund', 25000000.00, 'Series C', 'Clean Energy', 'Renewable energy solutions for commercial and residential use', 'active'),
('Seed Round', 'FoodDelivery Pro', 'Local Venture Partners', 800000.00, 'Seed', 'Food & Beverage', 'Hyperlocal food delivery platform with sustainability focus', 'completed'),
('Series A Funding', 'PropTech Innovations', 'Real Estate Ventures', 7500000.00, 'Series A', 'Real Estate', 'Smart property management platform using IoT and AI', 'active'),
('Bridge Round', 'MedDevice Labs', 'Healthcare Angels', 3000000.00, 'Bridge', 'Medical Devices', 'Next-generation medical devices for minimally invasive surgery', 'active'),
('Series B Funding', 'LogiChain Solutions', 'Supply Chain Fund', 12000000.00, 'Series B', 'Logistics', 'Blockchain-based supply chain management platform', 'completed'),
('Seed Round', 'CyberSecure Systems', 'Security Ventures', 1800000.00, 'Seed', 'Cybersecurity', 'Advanced threat detection and response platform for enterprises', 'active');
