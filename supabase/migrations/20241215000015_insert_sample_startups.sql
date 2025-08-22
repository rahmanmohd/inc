-- Insert sample startup data for testing
-- Note: Replace the owner_id with an actual user ID from your profiles table

INSERT INTO startups (name, description, industry, stage, website, location, team_size, founded_year, logo_url, published, owner_id, created_at, updated_at) VALUES
('TechFlow Solutions', 'AI-powered workflow automation platform for enterprises', 'SaaS', 'Series A', 'https://techflow.com', 'Bangalore, India', 25, 2022, 'https://via.placeholder.com/150', true, (SELECT id FROM profiles LIMIT 1), NOW(), NOW()),
('HealthSync Pro', 'Digital health monitoring and telemedicine platform', 'HealthTech', 'Seed', 'https://healthsyncpro.com', 'Mumbai, India', 15, 2023, 'https://via.placeholder.com/150', true, (SELECT id FROM profiles LIMIT 1), NOW(), NOW()),
('EduTech Innovate', 'Personalized learning platform with AI tutors', 'EdTech', 'Pre-Seed', 'https://edutechinnovate.com', 'Delhi, India', 8, 2024, 'https://via.placeholder.com/150', true, (SELECT id FROM profiles LIMIT 1), NOW(), NOW()),
('FinSecure Plus', 'Blockchain-based financial security solutions', 'FinTech', 'Series B', 'https://finsecureplus.com', 'Hyderabad, India', 45, 2021, 'https://via.placeholder.com/150', true, (SELECT id FROM profiles LIMIT 1), NOW(), NOW()),
('GreenEnergy Hub', 'Renewable energy management and optimization platform', 'CleanTech', 'Series A', 'https://greenenergyhub.com', 'Chennai, India', 30, 2022, 'https://via.placeholder.com/150', true, (SELECT id FROM profiles LIMIT 1), NOW(), NOW()),
('ShopSmart AI', 'AI-driven e-commerce personalization and analytics', 'E-commerce', 'Seed', 'https://shopsmartai.com', 'Pune, India', 20, 2023, 'https://via.placeholder.com/150', true, (SELECT id FROM profiles LIMIT 1), NOW(), NOW()),
('CloudScale Pro', 'Enterprise cloud infrastructure and scaling solutions', 'SaaS', 'Series C', 'https://cloudscalepro.com', 'Bangalore, India', 60, 2020, 'https://via.placeholder.com/150', true, (SELECT id FROM profiles LIMIT 1), NOW(), NOW()),
('MediCare Connect', 'Healthcare provider network and patient management system', 'HealthTech', 'Series A', 'https://medicareconnect.com', 'Mumbai, India', 35, 2022, 'https://via.placeholder.com/150', true, (SELECT id FROM profiles LIMIT 1), NOW(), NOW()),
('LearnFlex Academy', 'Adaptive learning platform for skill development', 'EdTech', 'Seed', 'https://learnflexacademy.com', 'Delhi, India', 12, 2023, 'https://via.placeholder.com/150', true, (SELECT id FROM profiles LIMIT 1), NOW(), NOW()),
('PayFlow Secure', 'Next-generation payment processing and security', 'FinTech', 'Series B', 'https://payflowsecure.com', 'Hyderabad, India', 40, 2021, 'https://via.placeholder.com/150', true, (SELECT id FROM profiles LIMIT 1), NOW(), NOW())
ON CONFLICT (id) DO NOTHING;
