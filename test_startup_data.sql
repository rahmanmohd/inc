-- Test script to verify startup data exists
SELECT 
  COUNT(*) as total_startups,
  COUNT(CASE WHEN published = true THEN 1 END) as active_startups,
  COUNT(CASE WHEN stage ILIKE '%Series%' OR stage ILIKE '%Seed%' THEN 1 END) as funded_startups
FROM startups;

-- Show first 5 startups
SELECT 
  id,
  name,
  industry,
  stage,
  published,
  created_at
FROM startups 
ORDER BY created_at DESC 
LIMIT 5;
