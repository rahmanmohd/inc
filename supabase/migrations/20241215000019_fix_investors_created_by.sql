-- Make created_by field nullable to avoid foreign key constraint issues
ALTER TABLE investors ALTER COLUMN created_by DROP NOT NULL;
