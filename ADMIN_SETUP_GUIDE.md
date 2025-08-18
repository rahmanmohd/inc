# Admin Setup Guide

## Overview
The application now supports admin login functionality with the following features:

- **Admin Login Toggle**: Users can switch between "User Login" and "Admin Login" on the login page
- **Admin-Only Dashboard**: Admin users are redirected to `/admin-dashboard` after login
- **Admin-Only Profile Section**: Admin users see only "Admin Dashboard" in their profile dropdown
- **Protected Admin Routes**: Admin dashboard is protected with `RequireAdmin` component

## How to Set Up Admin Access

### 1. Create Admin User in Database

To create an admin user, you need to:

1. **Register a normal user** through the application
2. **Update the user's role** in the Supabase `profiles` table to `"admin"`

#### SQL Command to Make User Admin:
```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-admin-email@example.com';
```

### 2. Admin Login Process

1. **Go to Login Page**: Navigate to `/login`
2. **Select Admin Login**: Click on the "Admin Login" toggle
3. **Enter Admin Credentials**: Use the email and password of the admin user
4. **Access Admin Dashboard**: After successful login, you'll be redirected to `/admin-dashboard`

### 3. Admin Features

#### Login Page Features:
- ✅ Toggle between "User Login" and "Admin Login"
- ✅ Different placeholder text for admin login
- ✅ Different button text ("Admin Sign In")
- ✅ Admin-specific message (no sign-up link)

#### Admin Dashboard Features:
- ✅ Personalized welcome message with admin's name
- ✅ Full admin dashboard with all management tabs
- ✅ Protected route (only accessible by admin users)

#### Profile Section Features:
- ✅ Shows "Admin" instead of "Profile" in the dropdown button
- ✅ Only shows "Admin Dashboard" option (no other dashboards)
- ✅ Proper logout functionality

### 4. Security Features

#### Route Protection:
- ✅ `RequireAdmin` component protects admin routes
- ✅ Non-admin users are redirected to `/user-dashboard`
- ✅ Unauthenticated users are prompted to login

#### Role-Based Access:
- ✅ Admin users can only access admin dashboard
- ✅ Regular users cannot access admin dashboard
- ✅ Proper role checking in authentication flow

## Testing Admin Functionality

### 1. Test Admin Login:
```bash
# Navigate to login page
# Switch to "Admin Login"
# Use admin credentials
# Verify redirect to admin dashboard
```

### 2. Test Non-Admin Access:
```bash
# Login with regular user credentials
# Try to access /admin-dashboard directly
# Verify redirect to user dashboard
```

### 3. Test Profile Section:
```bash
# Login as admin
# Click on "Admin" dropdown
# Verify only "Admin Dashboard" is shown
```

## Database Schema

The admin functionality relies on the `profiles` table with the following structure:

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  role TEXT DEFAULT 'user',
  first_name TEXT,
  last_name TEXT,
  company TEXT,
  phone TEXT,
  bio TEXT,
  -- other fields...
);
```

## Troubleshooting

### Common Issues:

1. **Admin user not recognized**:
   - Check if the user's role is set to `"admin"` in the `profiles` table
   - Verify the email matches exactly

2. **Cannot access admin dashboard**:
   - Ensure you're logged in as an admin user
   - Check browser console for any errors
   - Verify the `RequireAdmin` component is working

3. **Profile dropdown shows wrong options**:
   - Clear browser cache and cookies
   - Log out and log back in
   - Check if the user role is correctly set

## Future Enhancements

Potential improvements for admin functionality:

- [ ] Admin user management interface
- [ ] Role-based permissions system
- [ ] Admin activity logging
- [ ] Multi-admin support with different permission levels
- [ ] Admin dashboard analytics and reporting
