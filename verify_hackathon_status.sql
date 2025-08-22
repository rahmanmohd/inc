-- Verification script for hackathon_registrations status field
-- This script shows the current setup and validates the status functionality

-- 1. Show the current table structure for hackathon_registrations
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'hackathon_registrations' 
AND column_name IN ('status', 'admin_notes')
ORDER BY ordinal_position;

-- 2. Show any check constraints on the status field
SELECT 
    tc.constraint_name,
    cc.check_clause
FROM information_schema.table_constraints tc
JOIN information_schema.check_constraints cc ON tc.constraint_name = cc.constraint_name
WHERE tc.table_name = 'hackathon_registrations' 
AND tc.constraint_type = 'CHECK'
AND cc.check_clause LIKE '%status%';

-- 3. Show current status distribution
SELECT 
    status,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
FROM hackathon_registrations 
GROUP BY status
ORDER BY count DESC;

-- 4. Show recent registrations with their status
SELECT 
    id,
    full_name,
    email,
    status,
    admin_notes,
    created_at,
    updated_at
FROM hackathon_registrations 
ORDER BY created_at DESC 
LIMIT 10;

-- 5. Verify that the default status works for new insertions
-- (This would be tested when actually inserting data)
SELECT 'Status field setup verification complete' as result;
