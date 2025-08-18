-- Create Admin User: Rahman
-- Email: muteeurrahmanmohammed@gmail.com
-- Password: Rahman

-- Step 1: Insert the user into auth.users (this will be done automatically when they register)
-- You can either:
-- 1. Register normally through the app first, then update the role
-- 2. Or use this SQL to create the user directly

-- Option 1: If user already exists, update their role to admin
UPDATE profiles 
SET role = 'admin',
    first_name = 'Rahman',
    last_name = 'Admin'
WHERE email = 'muteeurrahmanmohammed@gmail.com';

-- Option 2: If user doesn't exist, you'll need to register them first through the app
-- Then run the above UPDATE command

-- Step 3: Verify the admin user was created
SELECT 
    id,
    email,
    role,
    first_name,
    last_name,
    created_at
FROM profiles 
WHERE email = 'muteeurrahmanmohammed@gmail.com';

-- Step 4: Check if the user exists in auth.users
SELECT 
    id,
    email,
    created_at,
    email_confirmed_at
FROM auth.users 
WHERE email = 'muteeurrahmanmohammed@gmail.com';
