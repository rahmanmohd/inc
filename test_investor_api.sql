-- Test if investors table exists and has data
SELECT COUNT(*) as total_investors FROM investors;

-- Check if table exists
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public'
   AND table_name = 'investors'
) as table_exists;

-- Show sample data if exists
SELECT id, name, email, status FROM investors LIMIT 5;
