# Admin User Setup Guide

## Admin User Details
- **Name**: Rahman
- **Email**: muteeurrahmanmohammed@gmail.com
- **Password**: Rahman
- **Role**: admin

## Method 1: Register First, Then Update Role (Recommended)

### Step 1: Register the User
1. Go to your application
2. Navigate to `/register`
3. Fill in the registration form:
   - **First Name**: Rahman
   - **Last Name**: Admin
   - **Email**: muteeurrahmanmohammed@gmail.com
   - **Password**: Rahman
   - **Confirm Password**: Rahman
   - **User Type**: Entrepreneur (or any type, we'll change it)
4. Submit the registration
5. Check your email and confirm the account

### Step 2: Update User Role to Admin
1. Go to your Supabase Dashboard
2. Navigate to **Table Editor** → **profiles**
3. Find the user with email `muteeurrahmanmohammed@gmail.com`
4. Click on the row to edit
5. Change the `role` field from `entrepreneur` to `admin`
6. Update the `first_name` to `Rahman` and `last_name` to `Admin`
7. Save the changes

### Step 3: Verify Admin Access
1. Go to your application
2. Navigate to `/login`
3. Click on "Admin Login" toggle
4. Enter:
   - **Email**: muteeurrahmanmohammed@gmail.com
   - **Password**: Rahman
5. Click "Admin Sign In"
6. You should be redirected to `/admin-dashboard`

## Method 2: Direct SQL (Alternative)

If you prefer to use SQL directly:

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Run the following SQL commands:

```sql
-- First, register the user through the app, then run this:
UPDATE profiles 
SET role = 'admin',
    first_name = 'Rahman',
    last_name = 'Admin'
WHERE email = 'muteeurrahmanmohammed@gmail.com';

-- Verify the update
SELECT 
    id,
    email,
    role,
    first_name,
    last_name,
    created_at
FROM profiles 
WHERE email = 'muteeurrahmanmohammed@gmail.com';
```

## Testing Admin Functionality

### Test Admin Login:
1. Go to `/login`
2. Switch to "Admin Login"
3. Use the credentials:
   - Email: muteeurrahmanmohammed@gmail.com
   - Password: Rahman
4. Verify redirect to admin dashboard

### Test Admin Profile Section:
1. Login as admin
2. Click on "Admin" dropdown in navigation
3. Verify only "Admin Dashboard" is shown

### Test Admin Route Protection:
1. Login as regular user
2. Try to access `/admin-dashboard` directly
3. Verify redirect to user dashboard

## Troubleshooting

### If login fails:
1. Check if the user exists in `auth.users` table
2. Verify email confirmation was completed
3. Check if the role was updated correctly in `profiles` table

### If admin dashboard not accessible:
1. Verify the user role is exactly `admin` (case-sensitive)
2. Check browser console for any errors
3. Clear browser cache and cookies

### If profile dropdown shows wrong options:
1. Log out and log back in
2. Check if the user role is correctly set to `admin`
3. Verify the AuthContext is reading the correct role

## Security Notes

- The password "Rahman" is simple for testing purposes
- Consider changing it to a stronger password in production
- Admin users have full access to the admin dashboard
- Only users with `role = 'admin'` can access admin features
