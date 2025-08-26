-- ====================================================
-- INVESTOR DASHBOARD COMPLETE SCHEMA UPDATE
-- ====================================================
-- This script creates and updates all necessary tables for a fully dynamic investor dashboard
-- Run this script in your Supabase SQL editor

-- ====================================================
-- 1. CREATE MISSING TABLES
-- ====================================================

-- Create portfolio_companies table (for investor portfolio management)
CREATE TABLE IF NOT EXISTS public.portfolio_companies (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  investor_id uuid NOT NULL,
  startup_id uuid NOT NULL,
  startup_name text NOT NULL,
  sector text NOT NULL,
  investment_amount numeric NOT NULL,
  current_valuation numeric NOT NULL,
  investment_date date NOT NULL,
  stage text NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'exited', 'under_review', 'dormant')),
  growth_percentage numeric DEFAULT 0,
  ownership_percentage numeric DEFAULT 0,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT portfolio_companies_pkey PRIMARY KEY (id),
  CONSTRAINT portfolio_companies_investor_id_fkey FOREIGN KEY (investor_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT portfolio_companies_startup_id_fkey FOREIGN KEY (startup_id) REFERENCES public.startups(id) ON DELETE CASCADE
);

-- Create deal_pipeline table (for tracking investment opportunities)
CREATE TABLE IF NOT EXISTS public.deal_pipeline (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  investor_id uuid NOT NULL,
  company_name text NOT NULL,
  sector text NOT NULL,
  requested_amount numeric NOT NULL,
  stage text NOT NULL DEFAULT 'initial_review' CHECK (stage IN ('initial_review', 'due_diligence', 'term_sheet', 'negotiation', 'closed')),
  progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  founded_year integer,
  team_size integer,
  revenue text,
  description text,
  pitch_deck_url text,
  financials_url text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'on_hold', 'rejected', 'closed')),
  notes text,
  contact_email text,
  contact_phone text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT deal_pipeline_pkey PRIMARY KEY (id),
  CONSTRAINT deal_pipeline_investor_id_fkey FOREIGN KEY (investor_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create investor_startup_connections table (for tracking connections between investors and startups)
CREATE TABLE IF NOT EXISTS public.investor_startup_connections (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  investor_id uuid NOT NULL,
  startup_id uuid NOT NULL,
  connection_type text NOT NULL CHECK (connection_type IN ('portfolio', 'pipeline', 'interested', 'passed')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT investor_startup_connections_pkey PRIMARY KEY (id),
  CONSTRAINT investor_startup_connections_unique UNIQUE (investor_id, startup_id, connection_type),
  CONSTRAINT investor_startup_connections_investor_id_fkey FOREIGN KEY (investor_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT investor_startup_connections_startup_id_fkey FOREIGN KEY (startup_id) REFERENCES public.startups(id) ON DELETE CASCADE
);

-- ====================================================
-- 2. UPDATE EXISTING TABLES
-- ====================================================

-- Add missing columns to investment_applications table
DO $$ 
BEGIN
  -- Add startup_name if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'investment_applications' AND column_name = 'startup_name') THEN
    ALTER TABLE public.investment_applications ADD COLUMN startup_name text;
  END IF;
  
  -- Add sector if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'investment_applications' AND column_name = 'sector') THEN
    ALTER TABLE public.investment_applications ADD COLUMN sector text;
  END IF;
  
  -- Add business_description if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'investment_applications' AND column_name = 'business_description') THEN
    ALTER TABLE public.investment_applications ADD COLUMN business_description text;
  END IF;
  
  -- Add company_website if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'investment_applications' AND column_name = 'company_website') THEN
    ALTER TABLE public.investment_applications ADD COLUMN company_website text;
  END IF;
  
  -- Add founder_email if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'investment_applications' AND column_name = 'founder_email') THEN
    ALTER TABLE public.investment_applications ADD COLUMN founder_email text;
  END IF;
  
  -- Add contact_phone if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'investment_applications' AND column_name = 'contact_phone') THEN
    ALTER TABLE public.investment_applications ADD COLUMN contact_phone text;
  END IF;
END $$;

-- Add missing columns to investor_profiles table
DO $$ 
BEGIN
  -- Add investment_focus if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'investor_profiles' AND column_name = 'investment_focus') THEN
    ALTER TABLE public.investor_profiles ADD COLUMN investment_focus text[];
  END IF;
  
  -- Add geographic_focus if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'investor_profiles' AND column_name = 'geographic_focus') THEN
    ALTER TABLE public.investor_profiles ADD COLUMN geographic_focus text[];
  END IF;
  
  -- Add fund_size if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'investor_profiles' AND column_name = 'fund_size') THEN
    ALTER TABLE public.investor_profiles ADD COLUMN fund_size numeric;
  END IF;
  
  -- Add portfolio_companies_count if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'investor_profiles' AND column_name = 'portfolio_companies_count') THEN
    ALTER TABLE public.investor_profiles ADD COLUMN portfolio_companies_count integer DEFAULT 0;
  END IF;
  
  -- Add contact_email if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'investor_profiles' AND column_name = 'contact_email') THEN
    ALTER TABLE public.investor_profiles ADD COLUMN contact_email text;
  END IF;
  
  -- Add contact_phone if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'investor_profiles' AND column_name = 'contact_phone') THEN
    ALTER TABLE public.investor_profiles ADD COLUMN contact_phone text;
  END IF;
END $$;

-- ====================================================
-- 3. CREATE INDEXES FOR PERFORMANCE
-- ====================================================

-- Portfolio companies indexes
CREATE INDEX IF NOT EXISTS idx_portfolio_companies_investor_id ON public.portfolio_companies(investor_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_companies_startup_id ON public.portfolio_companies(startup_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_companies_status ON public.portfolio_companies(status);
CREATE INDEX IF NOT EXISTS idx_portfolio_companies_sector ON public.portfolio_companies(sector);
CREATE INDEX IF NOT EXISTS idx_portfolio_companies_investment_date ON public.portfolio_companies(investment_date);

-- Deal pipeline indexes
CREATE INDEX IF NOT EXISTS idx_deal_pipeline_investor_id ON public.deal_pipeline(investor_id);
CREATE INDEX IF NOT EXISTS idx_deal_pipeline_stage ON public.deal_pipeline(stage);
CREATE INDEX IF NOT EXISTS idx_deal_pipeline_status ON public.deal_pipeline(status);
CREATE INDEX IF NOT EXISTS idx_deal_pipeline_sector ON public.deal_pipeline(sector);

-- Investor startup connections indexes
CREATE INDEX IF NOT EXISTS idx_investor_startup_connections_investor_id ON public.investor_startup_connections(investor_id);
CREATE INDEX IF NOT EXISTS idx_investor_startup_connections_startup_id ON public.investor_startup_connections(startup_id);
CREATE INDEX IF NOT EXISTS idx_investor_startup_connections_type ON public.investor_startup_connections(connection_type);

-- Investment applications indexes
CREATE INDEX IF NOT EXISTS idx_investment_applications_target_investor ON public.investment_applications(target_investor);
CREATE INDEX IF NOT EXISTS idx_investment_applications_status ON public.investment_applications(status);
CREATE INDEX IF NOT EXISTS idx_investment_applications_sector ON public.investment_applications(sector);

-- Investor profiles indexes
CREATE INDEX IF NOT EXISTS idx_investor_profiles_user_id ON public.investor_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_investor_profiles_published ON public.investor_profiles(published);

-- ====================================================
-- 4. ENABLE ROW LEVEL SECURITY
-- ====================================================

-- Enable RLS on new tables
ALTER TABLE public.portfolio_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deal_pipeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investor_startup_connections ENABLE ROW LEVEL SECURITY;

-- ====================================================
-- 5. CREATE RLS POLICIES
-- ====================================================

-- Portfolio companies policies
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'portfolio_companies' AND policyname = 'Investors can view their own portfolio companies') THEN
    CREATE POLICY "Investors can view their own portfolio companies" ON public.portfolio_companies
      FOR SELECT USING (auth.uid() = investor_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'portfolio_companies' AND policyname = 'Investors can insert their own portfolio companies') THEN
    CREATE POLICY "Investors can insert their own portfolio companies" ON public.portfolio_companies
      FOR INSERT WITH CHECK (auth.uid() = investor_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'portfolio_companies' AND policyname = 'Investors can update their own portfolio companies') THEN
    CREATE POLICY "Investors can update their own portfolio companies" ON public.portfolio_companies
      FOR UPDATE USING (auth.uid() = investor_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'portfolio_companies' AND policyname = 'Investors can delete their own portfolio companies') THEN
    CREATE POLICY "Investors can delete their own portfolio companies" ON public.portfolio_companies
      FOR DELETE USING (auth.uid() = investor_id);
  END IF;
  
  -- Admin access policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'portfolio_companies' AND policyname = 'Admins can view all portfolio companies') THEN
    CREATE POLICY "Admins can view all portfolio companies" ON public.portfolio_companies
      FOR ALL USING (
        EXISTS (
          SELECT 1 FROM public.profiles 
          WHERE id = auth.uid() AND role = 'admin'
        )
      );
  END IF;
END $$;

-- Deal pipeline policies
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'deal_pipeline' AND policyname = 'Investors can view their own deal pipeline') THEN
    CREATE POLICY "Investors can view their own deal pipeline" ON public.deal_pipeline
      FOR SELECT USING (auth.uid() = investor_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'deal_pipeline' AND policyname = 'Investors can insert their own deals') THEN
    CREATE POLICY "Investors can insert their own deals" ON public.deal_pipeline
      FOR INSERT WITH CHECK (auth.uid() = investor_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'deal_pipeline' AND policyname = 'Investors can update their own deals') THEN
    CREATE POLICY "Investors can update their own deals" ON public.deal_pipeline
      FOR UPDATE USING (auth.uid() = investor_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'deal_pipeline' AND policyname = 'Investors can delete their own deals') THEN
    CREATE POLICY "Investors can delete their own deals" ON public.deal_pipeline
      FOR DELETE USING (auth.uid() = investor_id);
  END IF;
  
  -- Admin access policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'deal_pipeline' AND policyname = 'Admins can view all deal pipeline') THEN
    CREATE POLICY "Admins can view all deal pipeline" ON public.deal_pipeline
      FOR ALL USING (
        EXISTS (
          SELECT 1 FROM public.profiles 
          WHERE id = auth.uid() AND role = 'admin'
        )
      );
  END IF;
END $$;

-- Investor startup connections policies
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'investor_startup_connections' AND policyname = 'Users can view their own connections') THEN
    CREATE POLICY "Users can view their own connections" ON public.investor_startup_connections
      FOR SELECT USING (auth.uid() = investor_id OR auth.uid() IN (SELECT owner_id FROM public.startups WHERE id = startup_id));
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'investor_startup_connections' AND policyname = 'Investors can manage their connections') THEN
    CREATE POLICY "Investors can manage their connections" ON public.investor_startup_connections
      FOR ALL USING (auth.uid() = investor_id);
  END IF;
  
  -- Admin access policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'investor_startup_connections' AND policyname = 'Admins can view all connections') THEN
    CREATE POLICY "Admins can view all connections" ON public.investor_startup_connections
      FOR ALL USING (
        EXISTS (
          SELECT 1 FROM public.profiles 
          WHERE id = auth.uid() AND role = 'admin'
        )
      );
  END IF;
END $$;

-- ====================================================
-- 6. CREATE TRIGGERS FOR UPDATED_AT
-- ====================================================

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'portfolio_companies_updated_at') THEN
    CREATE TRIGGER portfolio_companies_updated_at
      BEFORE UPDATE ON public.portfolio_companies
      FOR EACH ROW
      EXECUTE FUNCTION public.handle_updated_at();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'deal_pipeline_updated_at') THEN
    CREATE TRIGGER deal_pipeline_updated_at
      BEFORE UPDATE ON public.deal_pipeline
      FOR EACH ROW
      EXECUTE FUNCTION public.handle_updated_at();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'investor_startup_connections_updated_at') THEN
    CREATE TRIGGER investor_startup_connections_updated_at
      BEFORE UPDATE ON public.investor_startup_connections
      FOR EACH ROW
      EXECUTE FUNCTION public.handle_updated_at();
  END IF;
END $$;

-- ====================================================
-- 7. CREATE VIEWS FOR ANALYTICS
-- ====================================================

-- Create view for investor analytics
CREATE OR REPLACE VIEW public.investor_analytics AS
SELECT 
  ip.user_id,
  ip.name as investor_name,
  ip.organization,
  COUNT(DISTINCT pc.id) as total_portfolio_companies,
  COUNT(DISTINCT CASE WHEN pc.status = 'active' THEN pc.id END) as active_investments,
  COUNT(DISTINCT CASE WHEN pc.status = 'exited' THEN pc.id END) as successful_exits,
  COALESCE(SUM(pc.investment_amount), 0) as total_invested,
  COALESCE(SUM(pc.current_valuation), 0) as current_portfolio_value,
  CASE 
    WHEN COUNT(DISTINCT pc.id) > 0 THEN 
      ROUND(AVG(
        CASE 
          WHEN pc.investment_amount > 0 THEN 
            ((pc.current_valuation - pc.investment_amount) / pc.investment_amount * 100)
          ELSE 0 
        END
      ), 2)
    ELSE 0 
  END as average_roi,
  CASE 
    WHEN COUNT(DISTINCT pc.id) > 0 THEN 
      ROUND((COUNT(DISTINCT CASE WHEN pc.status = 'exited' THEN pc.id END)::numeric / COUNT(DISTINCT pc.id)::numeric * 100), 2)
    ELSE 0 
  END as success_rate,
  COUNT(DISTINCT dp.id) as active_deals_in_pipeline,
  ip.created_at as investor_since
FROM public.investor_profiles ip
LEFT JOIN public.portfolio_companies pc ON ip.user_id = pc.investor_id
LEFT JOIN public.deal_pipeline dp ON ip.user_id = dp.investor_id AND dp.status = 'active'
WHERE ip.published = true
GROUP BY ip.user_id, ip.name, ip.organization, ip.created_at;

-- Create view for startup-investor connections
CREATE OR REPLACE VIEW public.startup_investor_connections_view AS
SELECT 
  s.id as startup_id,
  s.name as startup_name,
  s.industry as startup_sector,
  s.stage as startup_stage,
  ip.user_id as investor_id,
  ip.name as investor_name,
  ip.organization as investor_organization,
  isc.connection_type,
  isc.status as connection_status,
  isc.created_at as connection_date,
  CASE 
    WHEN pc.id IS NOT NULL THEN pc.investment_amount
    ELSE NULL
  END as investment_amount,
  CASE 
    WHEN pc.id IS NOT NULL THEN pc.ownership_percentage
    ELSE NULL
  END as ownership_percentage
FROM public.startups s
LEFT JOIN public.investor_startup_connections isc ON s.id = isc.startup_id
LEFT JOIN public.investor_profiles ip ON isc.investor_id = ip.user_id
LEFT JOIN public.portfolio_companies pc ON isc.investor_id = pc.investor_id AND isc.startup_id = pc.startup_id
WHERE s.published = true AND (ip.published = true OR ip.published IS NULL);

-- ====================================================
-- 8. INSERT SAMPLE DATA (OPTIONAL)
-- ====================================================

-- Insert sample portfolio companies (only if tables are empty)
INSERT INTO public.portfolio_companies (
  investor_id,
  startup_id,
  startup_name,
  sector,
  investment_amount,
  current_valuation,
  investment_date,
  stage,
  status,
  growth_percentage,
  ownership_percentage
) 
SELECT 
  u.id,
  s.id,
  s.name,
  COALESCE(s.industry, 'Technology'),
  25000000, -- 2.5 Cr
  150000000, -- 15 Cr
  '2023-01-15',
  'Series A',
  'active',
  45.0,
  15.0
FROM auth.users u
CROSS JOIN public.startups s
WHERE u.email ILIKE '%admin%' 
  AND s.published = true
  AND NOT EXISTS (SELECT 1 FROM public.portfolio_companies WHERE investor_id = u.id)
LIMIT 3
ON CONFLICT DO NOTHING;

-- Insert sample deal pipeline
INSERT INTO public.deal_pipeline (
  investor_id,
  company_name,
  sector,
  requested_amount,
  stage,
  progress,
  founded_year,
  team_size,
  revenue,
  description
)
SELECT 
  u.id,
  'GreenTech Solutions',
  'CleanTech',
  40000000, -- 4 Cr
  'due_diligence',
  75,
  2022,
  12,
  '₹50L ARR',
  'AI-powered energy management system for sustainable buildings'
FROM auth.users u
WHERE u.email ILIKE '%admin%' 
  AND NOT EXISTS (SELECT 1 FROM public.deal_pipeline WHERE investor_id = u.id AND company_name = 'GreenTech Solutions')
LIMIT 1
ON CONFLICT DO NOTHING;

-- ====================================================
-- 9. GRANT PERMISSIONS
-- ====================================================

-- Grant necessary permissions
GRANT ALL ON public.portfolio_companies TO authenticated;
GRANT ALL ON public.deal_pipeline TO authenticated;
GRANT ALL ON public.investor_startup_connections TO authenticated;
GRANT SELECT ON public.investor_analytics TO authenticated;
GRANT SELECT ON public.startup_investor_connections_view TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- ====================================================
-- 10. ENABLE REALTIME (OPTIONAL)
-- ====================================================

-- Enable realtime for investor dashboard tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.portfolio_companies;
ALTER PUBLICATION supabase_realtime ADD TABLE public.deal_pipeline;
ALTER PUBLICATION supabase_realtime ADD TABLE public.investor_startup_connections;
ALTER PUBLICATION supabase_realtime ADD TABLE public.investment_applications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.investor_profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.blog_posts;

-- ====================================================
-- SUCCESS MESSAGE
-- ====================================================

SELECT 'Investor Dashboard schema updated successfully! 🚀
- Created portfolio_companies table
- Created deal_pipeline table  
- Created investor_startup_connections table
- Updated existing tables with missing columns
- Added performance indexes
- Enabled Row Level Security with proper policies
- Created analytics views
- Enabled realtime subscriptions
- Added sample data

You can now use the dynamic investor dashboard!' as message;
