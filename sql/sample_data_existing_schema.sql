-- Sample Data for Dynamic User Dashboard
-- Compatible with existing schema + new schema updates
-- Run this after schema_updates_for_user_dashboard.sql

-- Insert sample data into learning_resources
INSERT INTO learning_resources (id, title, description, type, url, duration_minutes, difficulty_level, tags, published) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'React Fundamentals', 'Learn the basics of React development', 'course', 'https://example.com/react-fundamentals', 120, 'beginner', ARRAY['react', 'javascript', 'frontend'], true),
  ('550e8400-e29b-41d4-a716-446655440002', 'Startup Fundraising 101', 'Complete guide to raising seed funding', 'article', 'https://example.com/fundraising-guide', 45, 'intermediate', ARRAY['fundraising', 'startup', 'business'], true),
  ('550e8400-e29b-41d4-a716-446655440003', 'Building MVP with Next.js', 'Step-by-step guide to build your MVP', 'tutorial', 'https://example.com/nextjs-mvp', 180, 'intermediate', ARRAY['nextjs', 'mvp', 'development'], true),
  ('550e8400-e29b-41d4-a716-446655440004', 'Product Market Fit', 'Understanding and achieving product-market fit', 'video', 'https://example.com/pmf-video', 30, 'advanced', ARRAY['product', 'market', 'strategy'], true),
  ('550e8400-e29b-41d4-a716-446655440005', 'UI/UX Design Principles', 'Essential design principles for startups', 'course', 'https://example.com/design-principles', 90, 'beginner', ARRAY['design', 'ux', 'ui'], true)
ON CONFLICT (id) DO NOTHING;

-- Insert sample data into user_achievements (using a sample user ID)
INSERT INTO user_achievements (id, user_id, title, description, category, icon, points, unlocked_at) VALUES
  ('650e8400-e29b-41d4-a716-446655440001', (SELECT id FROM auth.users LIMIT 1), 'First Steps', 'Completed your first learning module', 'learning', '🎯', 100, NOW() - INTERVAL '5 days'),
  ('650e8400-e29b-41d4-a716-446655440002', (SELECT id FROM auth.users LIMIT 1), 'Event Attendee', 'Attended your first startup event', 'networking', '🤝', 150, NOW() - INTERVAL '3 days'),
  ('650e8400-e29b-41d4-a716-446655440003', (SELECT id FROM auth.users LIMIT 1), 'Community Contributor', 'Made your first community post', 'community', '💬', 200, NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

-- Insert sample data into cofounder_applications (if user exists)
INSERT INTO cofounder_applications (id, cofounder_post_id, applicant_id, message, status, applied_at)
SELECT 
  '750e8400-e29b-41d4-a716-446655440001',
  (SELECT id FROM cofounder_posts LIMIT 1),
  (SELECT id FROM auth.users LIMIT 1),
  'I am very interested in this opportunity and believe my technical background would be a great fit.',
  'pending',
  NOW() - INTERVAL '2 days'
WHERE EXISTS (SELECT 1 FROM cofounder_posts) AND EXISTS (SELECT 1 FROM auth.users)
ON CONFLICT (id) DO NOTHING;

-- Update profiles table with sample enhanced profile data
UPDATE profiles SET
  location = CASE 
    WHEN location IS NULL THEN 'San Francisco, CA'
    ELSE location
  END,
  website = CASE 
    WHEN website IS NULL THEN 'https://johndoe.dev'
    ELSE website
  END,
  linkedin_profile = CASE 
    WHEN linkedin_profile IS NULL THEN 'https://linkedin.com/in/johndoe'
    ELSE linkedin_profile
  END,
  github_profile = CASE 
    WHEN github_profile IS NULL THEN 'https://github.com/johndoe'
    ELSE github_profile
  END,
  skills = CASE 
    WHEN skills IS NULL OR array_length(skills, 1) IS NULL THEN ARRAY['React', 'Node.js', 'Product Management', 'Startup Strategy']
    ELSE skills
  END,
  interests = CASE 
    WHEN interests IS NULL OR array_length(interests, 1) IS NULL THEN ARRAY['AI/ML', 'Fintech', 'SaaS', 'Mobile Apps']
    ELSE interests
  END,
  profile_completion = CASE 
    WHEN profile_completion IS NULL THEN 85
    ELSE profile_completion
  END,
  join_date = CASE 
    WHEN join_date IS NULL THEN created_at
    ELSE join_date
  END
WHERE id = (SELECT id FROM auth.users LIMIT 1);

-- Insert sample events with enhanced fields
INSERT INTO events (id, created_by, title, type, description, venue, city, online_url, starts_at, ends_at, max_participants, current_participants, published) VALUES
  ('850e8400-e29b-41d4-a716-446655440001', (SELECT id FROM auth.users LIMIT 1), 'Startup Pitch Night', 'networking', 'Monthly pitch event for early-stage startups', 'Innovation Hub', 'San Francisco', NULL, NOW() + INTERVAL '5 days', NOW() + INTERVAL '5 days' + INTERVAL '3 hours', 100, 45, true),
  ('850e8400-e29b-41d4-a716-446655440002', (SELECT id FROM auth.users LIMIT 1), 'Tech Talk: AI in Startups', 'workshop', 'Learn how to integrate AI into your startup', 'Tech Center', 'San Francisco', 'https://zoom.us/j/123456789', NOW() + INTERVAL '10 days', NOW() + INTERVAL '10 days' + INTERVAL '2 hours', 50, 23, true),
  ('850e8400-e29b-41d4-a716-446655440003', (SELECT id FROM auth.users LIMIT 1), 'Founder Networking Breakfast', 'networking', 'Connect with fellow entrepreneurs over breakfast', 'Startup Cafe', 'San Francisco', NULL, NOW() + INTERVAL '15 days', NOW() + INTERVAL '15 days' + INTERVAL '2 hours', 30, 18, true)
ON CONFLICT (id) DO NOTHING;

-- Insert sample event registrations
INSERT INTO event_registrations (id, event_id, user_id, status, notes)
SELECT 
  '950e8400-e29b-41d4-a716-446655440001',
  '850e8400-e29b-41d4-a716-446655440001',
  (SELECT id FROM auth.users LIMIT 1),
  'registered',
  'Looking forward to networking!'
WHERE EXISTS (SELECT 1 FROM auth.users)
ON CONFLICT (id) DO NOTHING;

-- Update cofounder_posts with enhanced fields
UPDATE cofounder_posts SET
  remote_friendly = CASE 
    WHEN remote_friendly IS NULL THEN true
    ELSE remote_friendly
  END,
  status = CASE 
    WHEN status IS NULL THEN 'active'
    ELSE status
  END
WHERE id IN (SELECT id FROM cofounder_posts LIMIT 3);

-- Insert sample user learning progress
INSERT INTO user_learning_progress (id, user_id, resource_id, progress_percentage, completed_at, last_accessed_at)
SELECT 
  '150e8400-e29b-41d4-a716-446655440001',
  (SELECT id FROM auth.users LIMIT 1),
  '550e8400-e29b-41d4-a716-446655440001',
  100,
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '2 days'
WHERE EXISTS (SELECT 1 FROM auth.users)
UNION ALL
SELECT 
  '150e8400-e29b-41d4-a716-446655440002',
  (SELECT id FROM auth.users LIMIT 1),
  '550e8400-e29b-41d4-a716-446655440002',
  65,
  NULL,
  NOW() - INTERVAL '1 day'
WHERE EXISTS (SELECT 1 FROM auth.users)
UNION ALL
SELECT 
  '150e8400-e29b-41d4-a716-446655440003',
  (SELECT id FROM auth.users LIMIT 1),
  '550e8400-e29b-41d4-a716-446655440003',
  30,
  NULL,
  NOW() - INTERVAL '3 hours'
WHERE EXISTS (SELECT 1 FROM auth.users)
ON CONFLICT (id) DO NOTHING;

-- Insert sample community posts (using blog_posts as fallback)
INSERT INTO blog_posts (id, author_id, title, slug, summary, content, tags, published, published_at) VALUES
  ('250e8400-e29b-41d4-a716-446655440001', (SELECT id FROM auth.users LIMIT 1), 'My Startup Journey', 'my-startup-journey', 'Sharing lessons learned from building my first startup', 'Here are the key lessons I learned during my entrepreneurial journey...', ARRAY['startup', 'entrepreneurship', 'lessons'], true, NOW() - INTERVAL '1 day'),
  ('250e8400-e29b-41d4-a716-446655440002', (SELECT id FROM auth.users LIMIT 1), 'Best Practices for MVP Development', 'mvp-development-best-practices', 'Essential tips for building your minimum viable product', 'When building an MVP, focus on these core principles...', ARRAY['mvp', 'development', 'startup'], true, NOW() - INTERVAL '3 days'),
  ('250e8400-e29b-41d4-a716-446655440003', (SELECT id FROM auth.users LIMIT 1), 'Fundraising Tips from the Trenches', 'fundraising-tips-trenches', 'Real-world advice for raising your first round', 'After going through multiple funding rounds, here is what I learned...', ARRAY['fundraising', 'investment', 'startup'], true, NOW() - INTERVAL '5 days')
ON CONFLICT (id) DO NOTHING;

-- Insert sample user activity
INSERT INTO user_activity (id, user_id, activity_type, activity_data, created_at)
SELECT 
  '350e8400-e29b-41d4-a716-446655440001',
  (SELECT id FROM auth.users LIMIT 1),
  'event_registration',
  jsonb_build_object('event_id', '850e8400-e29b-41d4-a716-446655440001', 'event_name', 'Startup Pitch Night'),
  NOW() - INTERVAL '2 days'
WHERE EXISTS (SELECT 1 FROM auth.users)
UNION ALL
SELECT 
  '350e8400-e29b-41d4-a716-446655440002',
  (SELECT id FROM auth.users LIMIT 1),
  'learning_progress',
  jsonb_build_object('resource_id', '550e8400-e29b-41d4-a716-446655440001', 'resource_name', 'React Fundamentals', 'progress', 100),
  NOW() - INTERVAL '2 days'
WHERE EXISTS (SELECT 1 FROM auth.users)
UNION ALL
SELECT 
  '350e8400-e29b-41d4-a716-446655440003',
  (SELECT id FROM auth.users LIMIT 1),
  'community_post',
  jsonb_build_object('post_id', '250e8400-e29b-41d4-a716-446655440001', 'post_title', 'My Startup Journey'),
  NOW() - INTERVAL '1 day'
WHERE EXISTS (SELECT 1 FROM auth.users)
ON CONFLICT (id) DO NOTHING;

-- Success message
SELECT 'Sample data inserted successfully! Your UserDashboard is now ready with dynamic content.' as message;