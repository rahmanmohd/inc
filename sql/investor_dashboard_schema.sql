-- Investor Dashboard Schema Updates
-- This script adds the necessary tables and updates for the dynamic investor dashboard

-- Create portfolio_companies table
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

-- Create deal_pipeline table
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
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT deal_pipeline_pkey PRIMARY KEY (id),
  CONSTRAINT deal_pipeline_investor_id_fkey FOREIGN KEY (investor_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_portfolio_companies_investor_id ON public.portfolio_companies(investor_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_companies_startup_id ON public.portfolio_companies(startup_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_companies_status ON public.portfolio_companies(status);

CREATE INDEX IF NOT EXISTS idx_deal_pipeline_investor_id ON public.deal_pipeline(investor_id);
CREATE INDEX IF NOT EXISTS idx_deal_pipeline_stage ON public.deal_pipeline(stage);
CREATE INDEX IF NOT EXISTS idx_deal_pipeline_status ON public.deal_pipeline(status);

-- Enable Row Level Security (RLS)
ALTER TABLE public.portfolio_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deal_pipeline ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for portfolio_companies
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
END $$;

-- Create RLS policies for deal_pipeline
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
END $$;

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
END $$;

-- Insert sample data for testing
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
  s.industry,
  25000000, -- 2.5 Cr
  150000000, -- 15 Cr
  '2023-01-15',
  'Series A',
  'active',
  45.0,
  15.0
FROM auth.users u, public.startups s
WHERE u.email = 'admin@example.com' AND s.name = 'TechFlow Solutions'
LIMIT 1
ON CONFLICT DO NOTHING;

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
WHERE u.email = 'admin@example.com'
LIMIT 1
ON CONFLICT DO NOTHING;

-- Grant necessary permissions
GRANT ALL ON public.portfolio_companies TO authenticated;
GRANT ALL ON public.deal_pipeline TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Success message
SELECT 'Investor Dashboard schema updated successfully!' as message;
