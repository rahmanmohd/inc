-- Simple Sample Data for UserDashboard Testing
-- This script works with your existing schema and adds minimal test data

-- First, let's check if we have any users
DO $$
BEGIN
  -- Insert a test user if none exists
  IF NOT EXISTS (SELECT 1 FROM auth.users LIMIT 1) THEN
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
    VALUES (
      gen_random_uuid(),
      'test@example.com',
      crypt('password123', gen_salt('bf')),
      NOW(),
      NOW(),
      NOW()
    );
  END IF;
END $$;

-- Get the first user ID for sample data
DO $$
DECLARE
  user_id uuid;
BEGIN
  SELECT id INTO user_id FROM auth.users LIMIT 1;
  
  IF user_id IS NOT NULL THEN
    -- Insert profile if it doesn't exist
    INSERT INTO profiles (id, email, first_name, last_name, role, bio, company, phone)
    VALUES (
      user_id,
      'test@example.com',
      'John',
      'Doe',
      'entrepreneur',
      'Passionate entrepreneur building innovative solutions',
      'TechStart Inc',
      '+1234567890'
    )
    ON CONFLICT (id) DO NOTHING;
    
    -- Insert sample events
    INSERT INTO events (id, created_by, title, type, description, venue, city, online_url, starts_at, ends_at, published)
    VALUES 
      (gen_random_uuid(), user_id, 'Startup Pitch Night', 'networking', 'Monthly pitch event for early-stage startups', 'Innovation Hub', 'San Francisco', NULL, NOW() + INTERVAL '5 days', NOW() + INTERVAL '5 days' + INTERVAL '3 hours', true),
      (gen_random_uuid(), user_id, 'Tech Talk: AI in Startups', 'workshop', 'Learn how to integrate AI into your startup', 'Tech Center', 'San Francisco', 'https://zoom.us/j/123456789', NOW() + INTERVAL '10 days', NOW() + INTERVAL '10 days' + INTERVAL '2 hours', true),
      (gen_random_uuid(), user_id, 'Founder Networking Breakfast', 'networking', 'Connect with fellow entrepreneurs over breakfast', 'Startup Cafe', 'San Francisco', NULL, NOW() + INTERVAL '15 days', NOW() + INTERVAL '15 days' + INTERVAL '2 hours', true)
    ON CONFLICT (id) DO NOTHING;
    
    -- Insert sample blog posts (for community section)
    INSERT INTO blog_posts (id, author_id, title, slug, summary, content, tags, published, published_at)
    VALUES 
      (gen_random_uuid(), user_id, 'My Startup Journey', 'my-startup-journey', 'Sharing lessons learned from building my first startup', 'Here are the key lessons I learned during my entrepreneurial journey...', ARRAY['startup', 'entrepreneurship', 'lessons'], true, NOW() - INTERVAL '1 day'),
      (gen_random_uuid(), user_id, 'Best Practices for MVP Development', 'mvp-development-best-practices', 'Essential tips for building your minimum viable product', 'When building an MVP, focus on these core principles...', ARRAY['mvp', 'development', 'startup'], true, NOW() - INTERVAL '3 days'),
      (gen_random_uuid(), user_id, 'Fundraising Tips from the Trenches', 'fundraising-tips-trenches', 'Real-world advice for raising your first round', 'After going through multiple funding rounds, here is what I learned...', ARRAY['fundraising', 'investment', 'startup'], true, NOW() - INTERVAL '5 days')
    ON CONFLICT (id) DO NOTHING;
    
    -- Insert sample cofounder posts
    INSERT INTO cofounder_posts (id, posted_by, title, role, description, experience, equity, location, commitment, salary, skills, published)
    VALUES 
      (gen_random_uuid(), user_id, 'Technical Co-founder for EdTech', 'CTO', 'Seeking a passionate CTO to lead product development for an innovative EdTech platform. Must have strong full-stack experience.', '5+ years in software development, leadership experience a plus.', '10-15%', 'Remote', 'Full-time', 'Competitive equity + deferred salary', ARRAY['React', 'Node.js', 'AWS', 'MongoDB'], true),
      (gen_random_uuid(), user_id, 'Marketing Co-founder for SaaS', 'CMO', 'Looking for a growth-oriented CMO to drive user acquisition and brand strategy for a B2B SaaS.', '3+ years in SaaS marketing, strong understanding of digital marketing channels.', '5-10%', 'New York, NY', 'Full-time', 'Equity-only initially', ARRAY['SEO', 'SEM', 'Content Marketing', 'Social Media'], true)
    ON CONFLICT (id) DO NOTHING;
    
    RAISE NOTICE 'Sample data inserted successfully for user: %', user_id;
  ELSE
    RAISE NOTICE 'No users found. Please create a user first.';
  END IF;
END $$;

-- Success message
SELECT 'Sample data inserted successfully! Your UserDashboard should now display content.' as message;
