-- Add published column to hackathons table
ALTER TABLE hackathons ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT false;

-- Add comment to the column
COMMENT ON COLUMN hackathons.published IS 'Whether the hackathon is visible to the public';

-- Update existing records to be published by default if they have a status
UPDATE hackathons SET published = true WHERE status = 'published';
