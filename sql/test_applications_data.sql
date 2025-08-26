-- Test Applications Data for Real-time Functionality
-- Run this script to add sample applications that will show in your UserDashboard

DO $$
DECLARE
  user_id uuid;
BEGIN
  -- Get the first user ID
  SELECT id INTO user_id FROM auth.users LIMIT 1;
  
  IF user_id IS NOT NULL THEN
    -- Insert sample incubation applications
    INSERT INTO incubation_applications (
      id, applicant_id, founder_name, email, startup_name, stage, industry, 
      description, status, created_at, updated_at
    ) VALUES 
      (gen_random_uuid(), user_id, 'John Doe', 'john@startup.com', 'TechVision AI', 'MVP', 'AI/ML', 
       'Revolutionary AI platform for computer vision applications', 'submitted', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours'),
      (gen_random_uuid(), user_id, 'John Doe', 'john@startup.com', 'EcoSmart Solutions', 'Prototype', 'CleanTech', 
       'Smart energy management system for homes and businesses', 'pending', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
      (gen_random_uuid(), user_id, 'John Doe', 'john@startup.com', 'FinanceFlow', 'Idea', 'FinTech', 
       'Automated financial planning tool for small businesses', 'under_review', NOW() - INTERVAL '3 days', NOW() - INTERVAL '1 hour')
    ON CONFLICT (id) DO NOTHING;
    
    -- Insert sample hackathon registrations
    INSERT INTO hackathon_registrations (
      id, user_id, full_name, email, phone, age, city, college, graduation,
      programming_languages, experience, frameworks, specialization, 
      github_profile, portfolio, agreements, status, created_at, updated_at
    ) VALUES 
      (gen_random_uuid(), user_id, 'John Doe', 'john@startup.com', '+1234567890', '25', 'San Francisco', 
       'Stanford University', '2021', 'JavaScript, Python, Go', '3 years', 'React, Node.js, Django', 
       'Full-stack Development', 'https://github.com/johndoe', 'https://johndoe.dev', 
       true, 'approved', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
      (gen_random_uuid(), user_id, 'John Doe', 'john@startup.com', '+1234567890', '25', 'San Francisco',
       'Stanford University', '2021', 'Python, R, SQL', '3 years', 'TensorFlow, PyTorch, Pandas',
       'Machine Learning', 'https://github.com/johndoe', 'https://johndoe.dev',
       true, 'pending', NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '30 minutes')
    ON CONFLICT (id) DO NOTHING;
    
    -- Insert sample program applications
    INSERT INTO program_applications (
      id, applicant_id, program, first_name, last_name, email, phone,
      startup_name, stage, problem, solution, market, traction, funding, why,
      status, created_at, updated_at
    ) VALUES 
      (gen_random_uuid(), user_id, 'MVP Lab', 'John', 'Doe', 'john@startup.com', '+1234567890',
       'HealthTech Pro', 'MVP', 'Healthcare data is fragmented and hard to access',
       'Unified healthcare data platform with AI insights', 'Healthcare providers and patients',
       '100 beta users, $5k MRR', '$50k for development and marketing',
       'Need mentorship and resources to scale our platform', 'submitted', 
       NOW() - INTERVAL '45 minutes', NOW() - INTERVAL '45 minutes')
    ON CONFLICT (id) DO NOTHING;
    
    -- Insert sample investment applications
    INSERT INTO investment_applications (
      id, applicant_id, target_investor, funding_amount, funding_stage, 
      current_valuation, monthly_revenue, user_traction, business_model,
      use_of_funds, status, created_at, updated_at
    ) VALUES 
      (gen_random_uuid(), user_id, 'Tech Ventures', '$500K', 'Seed', '$2M', '$8K',
       '500 active users, 15% month-over-month growth', 'SaaS subscription model',
       'Product development (60%), Marketing (30%), Operations (10%)', 'submitted',
       NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours')
    ON CONFLICT (id) DO NOTHING;
    
    -- Insert sample mentor applications
    INSERT INTO mentor_applications (
      id, user_id, first_name, last_name, email, phone, current_position, company,
      years_of_experience, area_of_expertise, linkedin_profile, why_mentor,
      status, created_at, updated_at
    ) VALUES 
      (gen_random_uuid(), user_id, 'John', 'Doe', 'john@startup.com', '+1234567890',
       'Senior Product Manager', 'TechCorp', '7 years', 'Product Strategy, User Experience',
       'https://linkedin.com/in/johndoe', 'Want to give back to the startup community',
       'pending', NOW() - INTERVAL '6 hours', NOW() - INTERVAL '6 hours')
    ON CONFLICT (id) DO NOTHING;
    
    -- Insert sample consultations
    INSERT INTO consultations (
      id, user_id, name, email, phone, company, stage, consultation_type,
      preferred_date, preferred_time, description, status, created_at, updated_at
    ) VALUES 
      (gen_random_uuid(), user_id, 'John Doe', 'john@startup.com', '+1234567890',
       'StartupXYZ', 'MVP', 'Strategy', '2024-01-20', '2:00 PM',
       'Need guidance on go-to-market strategy for our B2B SaaS product',
       'submitted', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '3 hours')
    ON CONFLICT (id) DO NOTHING;
    
    RAISE NOTICE 'Test applications inserted successfully for user: %', user_id;
  ELSE
    RAISE NOTICE 'No users found. Please create a user first.';
  END IF;
END $$;

-- Success message
SELECT 'Test applications inserted! Check your UserDashboard Applications tab to see real-time updates.' as message;
