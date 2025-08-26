-- Schema Updates Required for Dynamic User Dashboard
-- Based on existing database schema analysis

-- =============================================================================
-- 1. UPDATE PROFILES TABLE - Add missing fields for enhanced user profiles
-- =============================================================================

-- Add missing columns to existing profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS location text,
ADD COLUMN IF NOT EXISTS website text,
ADD COLUMN IF NOT EXISTS linkedin_profile text,
ADD COLUMN IF NOT EXISTS github_profile text,
ADD COLUMN IF NOT EXISTS skills text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS interests text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS profile_completion integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS join_date date DEFAULT CURRENT_DATE;

-- =============================================================================
-- 2. UPDATE EVENTS TABLE - Enhance existing events table
-- =============================================================================

-- Add missing columns to existing events table for better event management
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS date date,
ADD COLUMN IF NOT EXISTS time time,
ADD COLUMN IF NOT EXISTS status text DEFAULT 'upcoming',
ADD COLUMN IF NOT EXISTS registration_required boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS max_participants integer,
ADD COLUMN IF NOT EXISTS current_participants integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';

-- Update existing events to have proper date field from starts_at
UPDATE public.events 
SET date = starts_at::date 
WHERE date IS NULL AND starts_at IS NOT NULL;

-- Update existing events to have proper time field from starts_at
UPDATE public.events 
SET time = starts_at::time 
WHERE time IS NULL AND starts_at IS NOT NULL;

-- =============================================================================
-- 3. CREATE MISSING TABLES - Tables that don't exist in current schema
-- =============================================================================

-- Co-founder Opportunities Table (using existing cofounder_posts as base)
-- We'll use the existing cofounder_posts table but add missing fields
ALTER TABLE public.cofounder_posts 
ADD COLUMN IF NOT EXISTS equity_range text,
ADD COLUMN IF NOT EXISTS stage text DEFAULT 'idea',
ADD COLUMN IF NOT EXISTS remote_friendly boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS status text DEFAULT 'active';

-- Rename existing columns to match our service expectations
-- Note: We'll handle this in the service layer instead of renaming columns

-- Co-founder Applications Table
CREATE TABLE IF NOT EXISTS public.cofounder_applications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    opportunity_id uuid NOT NULL REFERENCES public.cofounder_posts(id),
    applicant_id uuid NOT NULL REFERENCES auth.users(id),
    cover_letter text,
    status text DEFAULT 'pending',
    applied_date timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    UNIQUE(opportunity_id, applicant_id)
);

-- Learning Resources Table
CREATE TABLE IF NOT EXISTS public.learning_resources (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text,
    type text NOT NULL DEFAULT 'course',
    duration text,
    difficulty text DEFAULT 'beginner',
    category text,
    url text,
    thumbnail_url text,
    tags text[] DEFAULT '{}',
    published boolean DEFAULT true,
    created_by uuid REFERENCES auth.users(id),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- User Learning Progress Table
CREATE TABLE IF NOT EXISTS public.user_learning_progress (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id),
    resource_id uuid NOT NULL REFERENCES public.learning_resources(id),
    progress integer DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    completed boolean DEFAULT false,
    started_at timestamp with time zone DEFAULT now(),
    completed_at timestamp with time zone,
    last_accessed timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    UNIQUE(user_id, resource_id)
);

-- User Achievements Table
CREATE TABLE IF NOT EXISTS public.user_achievements (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id),
    achievement_type text NOT NULL,
    title text NOT NULL,
    description text,
    icon text,
    earned_date timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now()
);

-- Community Posts Table (we can use existing blog_posts but create a separate one for community)
CREATE TABLE IF NOT EXISTS public.community_posts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id),
    title text NOT NULL,
    content text NOT NULL,
    category text,
    tags text[] DEFAULT '{}',
    likes_count integer DEFAULT 0,
    comments_count integer DEFAULT 0,
    status text DEFAULT 'active',
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Community Comments Table
CREATE TABLE IF NOT EXISTS public.community_comments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id uuid NOT NULL REFERENCES public.community_posts(id),
    user_id uuid NOT NULL REFERENCES auth.users(id),
    content text NOT NULL,
    parent_comment_id uuid REFERENCES public.community_comments(id),
    likes_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Community Post Likes Table
CREATE TABLE IF NOT EXISTS public.community_post_likes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id uuid NOT NULL REFERENCES public.community_posts(id),
    user_id uuid NOT NULL REFERENCES auth.users(id),
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE(post_id, user_id)
);

-- User Activity Table (we can enhance existing activity_logs or create separate)
CREATE TABLE IF NOT EXISTS public.user_activity (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id),
    activity_type text NOT NULL,
    title text NOT NULL,
    description text,
    related_id uuid,
    related_type text,
    created_at timestamp with time zone DEFAULT now()
);

-- =============================================================================
-- 4. CREATE INDEXES FOR PERFORMANCE
-- =============================================================================

-- Events indexes
CREATE INDEX IF NOT EXISTS idx_events_date ON public.events(date);
CREATE INDEX IF NOT EXISTS idx_events_type ON public.events(type);
CREATE INDEX IF NOT EXISTS idx_events_published ON public.events(published);
CREATE INDEX IF NOT EXISTS idx_event_registrations_user_id ON public.event_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON public.event_registrations(event_id);

-- Co-founder indexes
CREATE INDEX IF NOT EXISTS idx_cofounder_posts_status ON public.cofounder_posts(status);
CREATE INDEX IF NOT EXISTS idx_cofounder_posts_published ON public.cofounder_posts(published);
CREATE INDEX IF NOT EXISTS idx_cofounder_applications_applicant_id ON public.cofounder_applications(applicant_id);

-- Learning indexes
CREATE INDEX IF NOT EXISTS idx_learning_resources_category ON public.learning_resources(category);
CREATE INDEX IF NOT EXISTS idx_learning_resources_type ON public.learning_resources(type);
CREATE INDEX IF NOT EXISTS idx_learning_resources_published ON public.learning_resources(published);
CREATE INDEX IF NOT EXISTS idx_user_learning_progress_user_id ON public.user_learning_progress(user_id);

-- Community indexes
CREATE INDEX IF NOT EXISTS idx_community_posts_user_id ON public.community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_category ON public.community_posts(category);
CREATE INDEX IF NOT EXISTS idx_community_posts_status ON public.community_posts(status);

-- User activity indexes
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON public.user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_type ON public.user_activity(activity_type);

-- Profile indexes
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- =============================================================================
-- 5. ROW LEVEL SECURITY POLICIES
-- =============================================================================

-- Enable RLS on new tables
ALTER TABLE public.cofounder_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity ENABLE ROW LEVEL SECURITY;

-- Co-founder applications policies
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'cofounder_applications' AND policyname = 'Users can view their own applications') THEN
        CREATE POLICY "Users can view their own applications" ON public.cofounder_applications FOR SELECT USING (auth.uid() = applicant_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'cofounder_applications' AND policyname = 'Users can insert their own applications') THEN
        CREATE POLICY "Users can insert their own applications" ON public.cofounder_applications FOR INSERT WITH CHECK (auth.uid() = applicant_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'cofounder_applications' AND policyname = 'Opportunity owners can view applications') THEN
        CREATE POLICY "Opportunity owners can view applications" ON public.cofounder_applications FOR SELECT USING (
            EXISTS (SELECT 1 FROM public.cofounder_posts WHERE id = opportunity_id AND posted_by = auth.uid())
        );
    END IF;
END $$;

-- Learning resources policies
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'learning_resources' AND policyname = 'Learning resources are viewable by everyone') THEN
        CREATE POLICY "Learning resources are viewable by everyone" ON public.learning_resources FOR SELECT USING (published = true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'learning_resources' AND policyname = 'Users can create learning resources') THEN
        CREATE POLICY "Users can create learning resources" ON public.learning_resources FOR INSERT WITH CHECK (auth.uid() = created_by);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'learning_resources' AND policyname = 'Users can update their own learning resources') THEN
        CREATE POLICY "Users can update their own learning resources" ON public.learning_resources FOR UPDATE USING (auth.uid() = created_by);
    END IF;
END $$;

-- User learning progress policies
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_learning_progress' AND policyname = 'Users can view their own progress') THEN
        CREATE POLICY "Users can view their own progress" ON public.user_learning_progress FOR SELECT USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_learning_progress' AND policyname = 'Users can insert their own progress') THEN
        CREATE POLICY "Users can insert their own progress" ON public.user_learning_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_learning_progress' AND policyname = 'Users can update their own progress') THEN
        CREATE POLICY "Users can update their own progress" ON public.user_learning_progress FOR UPDATE USING (auth.uid() = user_id);
    END IF;
END $$;

-- User achievements policies
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_achievements' AND policyname = 'Users can view their own achievements') THEN
        CREATE POLICY "Users can view their own achievements" ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);
    END IF;
END $$;

-- Community policies
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'community_posts' AND policyname = 'Community posts are viewable by everyone') THEN
        CREATE POLICY "Community posts are viewable by everyone" ON public.community_posts FOR SELECT USING (status = 'active');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'community_posts' AND policyname = 'Users can create posts') THEN
        CREATE POLICY "Users can create posts" ON public.community_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'community_posts' AND policyname = 'Users can update their own posts') THEN
        CREATE POLICY "Users can update their own posts" ON public.community_posts FOR UPDATE USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'community_comments' AND policyname = 'Comments are viewable by everyone') THEN
        CREATE POLICY "Comments are viewable by everyone" ON public.community_comments FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'community_comments' AND policyname = 'Users can create comments') THEN
        CREATE POLICY "Users can create comments" ON public.community_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'community_comments' AND policyname = 'Users can update their own comments') THEN
        CREATE POLICY "Users can update their own comments" ON public.community_comments FOR UPDATE USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'community_post_likes' AND policyname = 'Likes are viewable by everyone') THEN
        CREATE POLICY "Likes are viewable by everyone" ON public.community_post_likes FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'community_post_likes' AND policyname = 'Users can like posts') THEN
        CREATE POLICY "Users can like posts" ON public.community_post_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'community_post_likes' AND policyname = 'Users can unlike posts') THEN
        CREATE POLICY "Users can unlike posts" ON public.community_post_likes FOR DELETE USING (auth.uid() = user_id);
    END IF;
END $$;

-- User activity policies
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_activity' AND policyname = 'Users can view their own activity') THEN
        CREATE POLICY "Users can view their own activity" ON public.user_activity FOR SELECT USING (auth.uid() = user_id);
    END IF;
END $$;

-- =============================================================================
-- 6. UPDATE TRIGGERS FOR TIMESTAMPS
-- =============================================================================

-- Function for updating timestamps (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for new tables
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_cofounder_applications_updated_at') THEN
        CREATE TRIGGER update_cofounder_applications_updated_at BEFORE UPDATE ON public.cofounder_applications
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_learning_resources_updated_at') THEN
        CREATE TRIGGER update_learning_resources_updated_at BEFORE UPDATE ON public.learning_resources
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_learning_progress_updated_at') THEN
        CREATE TRIGGER update_user_learning_progress_updated_at BEFORE UPDATE ON public.user_learning_progress
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_community_posts_updated_at') THEN
        CREATE TRIGGER update_community_posts_updated_at BEFORE UPDATE ON public.community_posts
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_community_comments_updated_at') THEN
        CREATE TRIGGER update_community_comments_updated_at BEFORE UPDATE ON public.community_comments
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- =============================================================================
-- 7. UTILITY FUNCTIONS
-- =============================================================================

-- Function to increment event participants
CREATE OR REPLACE FUNCTION increment_event_participants(event_id uuid)
RETURNS void AS $$
BEGIN
    UPDATE public.events 
    SET current_participants = COALESCE(current_participants, 0) + 1
    WHERE id = event_id;
END;
$$ language 'plpgsql';

-- Function to decrement event participants
CREATE OR REPLACE FUNCTION decrement_event_participants(event_id uuid)
RETURNS void AS $$
BEGIN
    UPDATE public.events 
    SET current_participants = GREATEST(COALESCE(current_participants, 0) - 1, 0)
    WHERE id = event_id;
END;
$$ language 'plpgsql';

-- =============================================================================
-- 8. SAMPLE DATA FOR TESTING (Optional)
-- =============================================================================

-- Insert sample learning resources
INSERT INTO public.learning_resources (title, description, type, duration, difficulty, category, url, tags, published) VALUES
('Startup Fundamentals', 'Complete guide to starting and running a successful startup. Covers ideation, validation, funding, and scaling.', 'course', '4 hours', 'beginner', 'startup_fundamentals', 'https://example.com/startup-fundamentals', ARRAY['startup', 'business', 'fundamentals'], true),
('Technical Leadership Masterclass', 'Learn how to transition from developer to tech leader. Covers team management, technical strategy, and communication.', 'masterclass', '6 hours', 'advanced', 'technical', 'https://example.com/tech-leadership', ARRAY['leadership', 'management', 'technical'], true),
('Pitch Deck Mastery', 'Create compelling pitch decks that get investors excited. Includes templates, examples, and presentation tips.', 'course', '3 hours', 'intermediate', 'business', 'https://example.com/pitch-deck', ARRAY['pitch', 'presentation', 'funding'], true)
ON CONFLICT DO NOTHING;

-- Insert sample community posts (only if there are users to reference)
INSERT INTO public.community_posts (user_id, title, content, category, tags, likes_count, comments_count, status)
SELECT 
    p.id,
    'Welcome to the Community!',
    'This is a sample community post to test the functionality. Feel free to engage and share your thoughts!',
    'general',
    ARRAY['welcome', 'community', 'introduction'],
    5,
    2,
    'active'
FROM public.profiles p 
WHERE p.role = 'admin' 
LIMIT 1
ON CONFLICT DO NOTHING;

-- Update sample profiles with extended information
UPDATE public.profiles SET 
    location = 'India',
    website = 'https://example.com',
    linkedin_profile = 'https://linkedin.com/in/profile',
    github_profile = 'https://github.com/profile',
    skills = ARRAY['Product Management', 'Business Development', 'Marketing'],
    interests = ARRAY['AI/ML', 'FinTech', 'HealthTech'],
    profile_completion = 75,
    join_date = CURRENT_DATE - INTERVAL '30 days'
WHERE location IS NULL AND role != 'admin';

-- Update existing events with proper formatting
UPDATE public.events SET 
    status = 'upcoming',
    registration_required = true,
    current_participants = 0,
    tags = ARRAY['tech', 'startup']
WHERE status IS NULL;

-- Update existing cofounder posts
UPDATE public.cofounder_posts SET 
    status = 'active',
    stage = 'idea',
    remote_friendly = true
WHERE status IS NULL;

-- =============================================================================
-- NOTES FOR IMPLEMENTATION
-- =============================================================================

/*
Key Changes Made to Align with Existing Schema:

1. PROFILES TABLE:
   - Added: location, website, linkedin_profile, github_profile, skills, interests, profile_completion, join_date
   - Uses existing: id, email, first_name, last_name, phone, company, bio, role, created_at, updated_at

2. EVENTS TABLE:
   - Added: date, time, status, registration_required, max_participants, current_participants, tags
   - Uses existing: id, title, type, description, venue, city, online_url, starts_at, ends_at, published, created_by, created_at, updated_at
   - Maps: venue/city -> location, starts_at -> date/time

3. EVENT_REGISTRATIONS TABLE:
   - Already exists with proper structure
   - Uses: id, event_id, user_id, status, created_at, updated_at

4. COFOUNDER_POSTS TABLE (maps to cofounder_opportunities):
   - Added: equity_range, stage, remote_friendly, status
   - Uses existing: id, posted_by, title, role, description, location, created_at, updated_at
   - Maps: posted_by -> company_name (in service layer), equity -> equity_range

5. NEW TABLES CREATED:
   - cofounder_applications
   - learning_resources
   - user_learning_progress
   - user_achievements
   - community_posts
   - community_comments
   - community_post_likes
   - user_activity

6. EXISTING TABLES LEVERAGED:
   - hackathon_registrations (for application stats)
   - incubation_applications (for application stats)
   - incubation_applications_new (for application stats)
   - profiles (enhanced)
   - events (enhanced)
   - event_registrations (as-is)

The service layer will need to be updated to map between the existing schema 
and the expected UserDashboard interface.
*/
