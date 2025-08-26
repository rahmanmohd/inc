-- Sample data for User Dashboard testing

-- Sample Events
INSERT INTO events (title, description, date, time, type, location, status, registration_required, max_participants, current_participants, tags, published) VALUES
('AI Innovation Hackathon 2025', 'Join us for a 48-hour hackathon focused on AI and machine learning innovations. Build cutting-edge solutions and compete for amazing prizes!', '2025-01-15', '09:00', 'hackathon', 'Tech Hub, Bangalore', 'upcoming', true, 100, 23, ARRAY['AI', 'ML', 'Innovation', 'Hackathon'], true),
('Startup Pitch Day', 'Present your startup idea to top investors and get funding opportunities. Network with fellow entrepreneurs and industry experts.', '2025-01-22', '14:00', 'pitch_event', 'Mumbai Convention Center', 'upcoming', true, 50, 12, ARRAY['Pitch', 'Funding', 'Networking'], true),
('React Advanced Workshop', 'Deep dive into advanced React concepts including performance optimization, state management, and modern patterns.', '2025-01-28', '10:00', 'workshop', 'Online', 'upcoming', true, 200, 67, ARRAY['React', 'JavaScript', 'Frontend'], true),
('FinTech Meetup', 'Monthly meetup for FinTech enthusiasts to discuss latest trends, share insights, and network with peers.', '2025-02-05', '18:30', 'meetup', 'Delhi Tech Park', 'upcoming', true, 75, 34, ARRAY['FinTech', 'Banking', 'Payments'], true),
('Product Management Webinar', 'Learn essential product management skills from industry experts. Covers roadmapping, user research, and metrics.', '2025-02-12', '16:00', 'webinar', 'Online', 'upcoming', true, 500, 156, ARRAY['Product', 'Management', 'Strategy'], true);

-- Sample Co-founder Opportunities
INSERT INTO cofounder_opportunities (company_name, role, equity_range, stage, description, requirements, location, remote_friendly, status) VALUES
('AI Healthcare Solutions', 'Technical Co-founder', '15-20%', 'idea', 'Building AI-powered diagnostic tools for early disease detection. Looking for a technical co-founder with expertise in machine learning and healthcare.', 'Strong background in ML/AI, preferably with healthcare experience. PhD preferred but not required.', 'Bangalore', true, 'active'),
('GreenTech Startup', 'CTO', '10-15%', 'mvp', 'Developing sustainable energy solutions for urban areas. Need a CTO to lead technical team and product development.', '5+ years experience in cleantech or renewable energy. Strong leadership and technical skills.', 'Pune', false, 'active'),
('EdTech Platform', 'Technical Lead', '8-12%', 'pre_seed', 'Creating personalized learning platform for K-12 students. Seeking technical lead to build scalable platform.', 'Full-stack development experience, education background preferred. Experience with EdTech platforms is a plus.', 'Remote', true, 'active'),
('FinTech Innovations', 'Product Co-founder', '12-18%', 'seed', 'Building next-generation payment solutions for emerging markets. Looking for product-focused co-founder.', 'Product management experience in financial services. Understanding of emerging market dynamics.', 'Mumbai', true, 'active'),
('AgriTech Solutions', 'Business Co-founder', '10-14%', 'idea', 'Developing IoT solutions for smart farming. Need business co-founder to handle partnerships and go-to-market.', 'Business development experience, preferably in agriculture or B2B sales. Rural market understanding is a plus.', 'Chennai', false, 'active');

-- Sample Learning Resources
INSERT INTO learning_resources (title, description, type, duration, difficulty, category, url, tags, published) VALUES
('Startup Fundamentals', 'Complete guide to starting and running a successful startup. Covers ideation, validation, funding, and scaling.', 'course', '4 hours', 'beginner', 'startup_fundamentals', 'https://example.com/startup-fundamentals', ARRAY['startup', 'business', 'fundamentals'], true),
('Technical Leadership Masterclass', 'Learn how to transition from developer to tech leader. Covers team management, technical strategy, and communication.', 'masterclass', '6 hours', 'advanced', 'technical', 'https://example.com/tech-leadership', ARRAY['leadership', 'management', 'technical'], true),
('Pitch Deck Mastery', 'Create compelling pitch decks that get investors excited. Includes templates, examples, and presentation tips.', 'course', '3 hours', 'intermediate', 'business', 'https://example.com/pitch-deck', ARRAY['pitch', 'presentation', 'funding'], true),
('Product-Market Fit Workshop', 'Learn how to find and validate product-market fit. Practical exercises and real-world case studies included.', 'workshop', '5 hours', 'intermediate', 'startup_fundamentals', 'https://example.com/pmf-workshop', ARRAY['product', 'market', 'validation'], true),
('Scaling Engineering Teams', 'Best practices for building and scaling engineering teams in fast-growing startups. Covers hiring, culture, and processes.', 'course', '4.5 hours', 'advanced', 'technical', 'https://example.com/scaling-teams', ARRAY['engineering', 'scaling', 'hiring'], true),
('Digital Marketing for Startups', 'Complete guide to digital marketing for early-stage companies. Covers SEO, social media, content marketing, and analytics.', 'course', '8 hours', 'beginner', 'marketing', 'https://example.com/digital-marketing', ARRAY['marketing', 'digital', 'growth'], true),
('Fundraising Strategies', 'Navigate the fundraising landscape from seed to Series A. Includes investor outreach, term sheets, and negotiation tactics.', 'masterclass', '3.5 hours', 'intermediate', 'business', 'https://example.com/fundraising', ARRAY['fundraising', 'investment', 'venture'], true);

-- Sample Community Posts
INSERT INTO community_posts (user_id, title, content, category, tags, likes_count, comments_count, status) VALUES
((SELECT id FROM profiles WHERE email = 'admin@example.com' LIMIT 1), 'Tips for First-Time Founders', 'Starting your first company can be overwhelming. Here are 10 essential tips I wish I knew when I started my journey...', 'startup_advice', ARRAY['founder', 'startup', 'tips'], 15, 8, 'active'),
((SELECT id FROM profiles WHERE email = 'admin@example.com' LIMIT 1), 'Building MVP on a Budget', 'You don''t need a huge budget to build your first MVP. Here''s how we built our initial product for under $5000...', 'startup_advice', ARRAY['mvp', 'budget', 'development'], 23, 12, 'active'),
((SELECT id FROM profiles WHERE email = 'admin@example.com' LIMIT 1), 'React Performance Optimization', 'Sharing some advanced techniques for optimizing React applications. These methods helped us reduce load time by 60%...', 'technical', ARRAY['react', 'performance', 'optimization'], 18, 5, 'active'),
((SELECT id FROM profiles WHERE email = 'admin@example.com' LIMIT 1), 'Networking at Tech Events', 'Just got back from TechCrunch Disrupt. Here are my top strategies for making meaningful connections at tech conferences...', 'networking', ARRAY['networking', 'events', 'conferences'], 12, 7, 'active'),
((SELECT id FROM profiles WHERE email = 'admin@example.com' LIMIT 1), 'Remote Team Management', 'Managing a distributed team across 3 time zones. Sharing tools and practices that work for us...', 'startup_advice', ARRAY['remote', 'team', 'management'], 21, 9, 'active');

-- Note: User-specific data like user_activity, user_learning_progress, etc. will be created when users interact with the system
-- The system will automatically create activity logs when users register for events, apply for co-founder roles, etc.

-- Sample Achievement Types (these would be created when users earn them)
-- Example user activities that would be logged:
-- INSERT INTO user_activity (user_id, activity_type, title, description) VALUES
-- (user_id, 'profile_updated', 'Profile Updated', 'Updated profile information'),
-- (user_id, 'event_registered', 'Event Registration', 'Registered for AI Innovation Hackathon'),
-- (user_id, 'course_started', 'Course Started', 'Started Startup Fundamentals course'),
-- (user_id, 'achievement_earned', 'Achievement Earned', 'Earned First Application badge');

-- Update profiles table with sample extended data
UPDATE profiles SET 
    location = 'Bangalore, India',
    website = 'https://johndoe.dev',
    linkedin_profile = 'https://linkedin.com/in/johndoe',
    github_profile = 'https://github.com/johndoe',
    skills = ARRAY['Product Management', 'Business Development', 'Market Research', 'Team Leadership'],
    interests = ARRAY['AI/ML', 'FinTech', 'HealthTech', 'Sustainability'],
    profile_completion = 85,
    join_date = CURRENT_DATE - INTERVAL '3 months'
WHERE email LIKE '%@%' AND role != 'admin';

-- Create some sample user learning progress
-- This would typically be created when users start courses
-- INSERT INTO user_learning_progress (user_id, resource_id, progress, started_at) 
-- SELECT p.id, r.id, 
--     CASE 
--         WHEN random() < 0.3 THEN 0  -- 30% haven't started
--         WHEN random() < 0.6 THEN FLOOR(random() * 50)  -- 30% are in progress (0-50%)
--         WHEN random() < 0.9 THEN FLOOR(random() * 50) + 50  -- 30% are in progress (50-100%)
--         ELSE 100  -- 10% completed
--     END as progress,
--     NOW() - INTERVAL '1 week' * random() as started_at
-- FROM profiles p
-- CROSS JOIN learning_resources r
-- WHERE p.role != 'admin' AND random() < 0.4;  -- 40% of users have some learning progress
