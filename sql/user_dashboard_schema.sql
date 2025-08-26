-- Additional tables for User Dashboard dynamic features

-- User Profile Extensions (additional fields for the profiles table)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS website TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS linkedin_profile TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS github_profile TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS skills TEXT[]; -- Array of skills
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS interests TEXT[]; -- Array of interests
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS profile_completion INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS join_date DATE DEFAULT CURRENT_DATE;

-- Events table for upcoming events
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time TIME,
    type TEXT NOT NULL DEFAULT 'event', -- hackathon, workshop, pitch_event, meetup
    location TEXT,
    status TEXT DEFAULT 'upcoming', -- upcoming, ongoing, completed, cancelled
    registration_required BOOLEAN DEFAULT true,
    max_participants INTEGER,
    current_participants INTEGER DEFAULT 0,
    tags TEXT[],
    cover_image_url TEXT,
    published BOOLEAN DEFAULT true,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event Registrations (track user registrations)
CREATE TABLE IF NOT EXISTS event_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) NOT NULL,
    event_id UUID REFERENCES events(id) NOT NULL,
    status TEXT DEFAULT 'registered', -- registered, attended, cancelled
    registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, event_id)
);

-- Co-founder Opportunities
CREATE TABLE IF NOT EXISTS cofounder_opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name TEXT NOT NULL,
    role TEXT NOT NULL,
    equity_range TEXT,
    stage TEXT, -- idea, mvp, pre_seed, seed, series_a
    description TEXT,
    requirements TEXT,
    location TEXT,
    remote_friendly BOOLEAN DEFAULT false,
    posted_by UUID REFERENCES profiles(id),
    status TEXT DEFAULT 'active', -- active, filled, closed
    posted_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Co-founder Applications
CREATE TABLE IF NOT EXISTS cofounder_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    opportunity_id UUID REFERENCES cofounder_opportunities(id) NOT NULL,
    applicant_id UUID REFERENCES profiles(id) NOT NULL,
    cover_letter TEXT,
    status TEXT DEFAULT 'pending', -- pending, accepted, rejected
    applied_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(opportunity_id, applicant_id)
);

-- Learning Resources
CREATE TABLE IF NOT EXISTS learning_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL, -- course, workshop, masterclass, video, article
    duration TEXT, -- e.g., "4 hours", "2 days"
    difficulty TEXT DEFAULT 'beginner', -- beginner, intermediate, advanced
    category TEXT, -- startup_fundamentals, technical, business, marketing
    url TEXT,
    thumbnail_url TEXT,
    tags TEXT[],
    published BOOLEAN DEFAULT true,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Learning Progress
CREATE TABLE IF NOT EXISTS user_learning_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) NOT NULL,
    resource_id UUID REFERENCES learning_resources(id) NOT NULL,
    progress INTEGER DEFAULT 0, -- 0-100
    completed BOOLEAN DEFAULT false,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, resource_id)
);

-- User Achievements/Badges
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) NOT NULL,
    achievement_type TEXT NOT NULL, -- first_application, hackathon_participant, course_completed
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT, -- icon name or URL
    earned_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community Posts/Discussions
CREATE TABLE IF NOT EXISTS community_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT, -- general, startup_advice, technical, networking
    tags TEXT[],
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active', -- active, archived, flagged
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community Post Comments
CREATE TABLE IF NOT EXISTS community_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES community_posts(id) NOT NULL,
    user_id UUID REFERENCES profiles(id) NOT NULL,
    content TEXT NOT NULL,
    parent_comment_id UUID REFERENCES community_comments(id), -- for nested comments
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community Post Likes
CREATE TABLE IF NOT EXISTS community_post_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES community_posts(id) NOT NULL,
    user_id UUID REFERENCES profiles(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);

-- User Activity Log (for recent activity feed)
CREATE TABLE IF NOT EXISTS user_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) NOT NULL,
    activity_type TEXT NOT NULL, -- application_submitted, event_registered, course_completed, etc.
    title TEXT NOT NULL,
    description TEXT,
    related_id UUID, -- ID of related entity (application_id, event_id, etc.)
    related_type TEXT, -- application, event, course, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(type);
CREATE INDEX IF NOT EXISTS idx_events_published ON events(published);
CREATE INDEX IF NOT EXISTS idx_event_registrations_user_id ON event_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_cofounder_opportunities_status ON cofounder_opportunities(status);
CREATE INDEX IF NOT EXISTS idx_cofounder_opportunities_stage ON cofounder_opportunities(stage);
CREATE INDEX IF NOT EXISTS idx_learning_resources_category ON learning_resources(category);
CREATE INDEX IF NOT EXISTS idx_learning_resources_type ON learning_resources(type);
CREATE INDEX IF NOT EXISTS idx_user_learning_progress_user_id ON user_learning_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_category ON community_posts(category);
CREATE INDEX IF NOT EXISTS idx_community_posts_user_id ON community_posts(user_id);

-- RLS (Row Level Security) Policies
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE cofounder_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE cofounder_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;

-- Events policies
CREATE POLICY "Events are viewable by everyone" ON events FOR SELECT USING (published = true);
CREATE POLICY "Only creators can update events" ON events FOR UPDATE USING (auth.uid() = created_by);

-- Event registrations policies
CREATE POLICY "Users can view their own registrations" ON event_registrations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own registrations" ON event_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own registrations" ON event_registrations FOR UPDATE USING (auth.uid() = user_id);

-- Co-founder opportunities policies
CREATE POLICY "Co-founder opportunities are viewable by everyone" ON cofounder_opportunities FOR SELECT USING (status = 'active');
CREATE POLICY "Users can create co-founder opportunities" ON cofounder_opportunities FOR INSERT WITH CHECK (auth.uid() = posted_by);
CREATE POLICY "Only creators can update co-founder opportunities" ON cofounder_opportunities FOR UPDATE USING (auth.uid() = posted_by);

-- Co-founder applications policies
CREATE POLICY "Users can view their own applications" ON cofounder_applications FOR SELECT USING (auth.uid() = applicant_id);
CREATE POLICY "Users can insert their own applications" ON cofounder_applications FOR INSERT WITH CHECK (auth.uid() = applicant_id);

-- Learning resources policies
CREATE POLICY "Learning resources are viewable by everyone" ON learning_resources FOR SELECT USING (published = true);

-- User learning progress policies
CREATE POLICY "Users can view their own progress" ON user_learning_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own progress" ON user_learning_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own progress" ON user_learning_progress FOR UPDATE USING (auth.uid() = user_id);

-- User achievements policies
CREATE POLICY "Users can view their own achievements" ON user_achievements FOR SELECT USING (auth.uid() = user_id);

-- Community policies
CREATE POLICY "Community posts are viewable by everyone" ON community_posts FOR SELECT USING (status = 'active');
CREATE POLICY "Users can create posts" ON community_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own posts" ON community_posts FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Comments are viewable by everyone" ON community_comments FOR SELECT USING (true);
CREATE POLICY "Users can create comments" ON community_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own comments" ON community_comments FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Likes are viewable by everyone" ON community_post_likes FOR SELECT USING (true);
CREATE POLICY "Users can like posts" ON community_post_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike posts" ON community_post_likes FOR DELETE USING (auth.uid() = user_id);

-- User activity policies
CREATE POLICY "Users can view their own activity" ON user_activity FOR SELECT USING (auth.uid() = user_id);

-- Functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updating timestamps
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cofounder_opportunities_updated_at BEFORE UPDATE ON cofounder_opportunities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_resources_updated_at BEFORE UPDATE ON learning_resources
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_community_posts_updated_at BEFORE UPDATE ON community_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_community_comments_updated_at BEFORE UPDATE ON community_comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
