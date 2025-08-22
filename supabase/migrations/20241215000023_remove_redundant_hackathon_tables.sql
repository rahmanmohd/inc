-- Remove redundant hackathon tables since we're using individual registrations
-- The hackathon_teams and hackathon_team_members tables are no longer needed

-- Drop the redundant tables (these were for team-based hackathons)
DROP TABLE IF EXISTS hackathon_team_members CASCADE;
DROP TABLE IF EXISTS hackathon_teams CASCADE;

-- These tables are redundant because:
-- 1. hackathon_teams - We're now doing individual registrations, not team-based
-- 2. hackathon_team_members - No longer needed since we track individuals directly
-- 3. All hackathon data is now in hackathon_registrations table for individual users
