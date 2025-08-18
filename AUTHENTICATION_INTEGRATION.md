# 🔐 Supabase Authentication Integration Guide

This guide explains how to use the integrated Supabase authentication system in the Inc Combinator application.

## 🚀 Features Implemented

### ✅ Backend (Node.js + Express)
- **Complete Supabase Integration**: Full authentication service with JWT token management
- **User Registration**: Email/password signup with role assignment
- **User Login**: Secure authentication with session management
- **Password Reset**: Email-based password recovery
- **Profile Management**: Update user profiles and information
- **Session Management**: JWT token refresh and validation
- **Security**: Row Level Security (RLS) and input validation
- **Activity Logging**: Comprehensive audit trail

### ✅ Frontend (React + TypeScript)
- **Authentication Context**: Centralized auth state management
- **Login Component**: Modern login form with validation
- **Register Component**: Complete registration form
- **Login Dialog**: Modal login for quick access
- **Protected Routes**: Route protection based on authentication
- **User Profile**: Display and update user information
- **Loading States**: User-friendly loading indicators

## 📁 File Structure

```
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── supabase.js          # Supabase configuration
│   │   ├── middleware/
│   │   │   ├── auth.js              # JWT authentication middleware
│   │   │   └── errorHandler.js      # Error handling middleware
│   │   ├── routes/
│   │   │   └── auth.js              # Authentication API routes
│   │   └── server.js                # Main server file
│   ├── package.json                 # Backend dependencies
│   └── README.md                    # Backend documentation
├── src/
│   ├── context/
│   │   └── AuthContext.tsx          # Authentication context
│   ├── services/
│   │   └── authService.ts           # Frontend auth service
│   ├── pages/
│   │   ├── Login.tsx                # Login page
│   │   ├── Register.tsx             # Registration page
│   │   └── AuthTest.tsx             # Test page
│   └── components/
│       └── LoginDialog.tsx          # Login modal
```

## 🔧 Setup Instructions

### 1. Backend Setup

```bash
cd backend
npm install
cp env.example .env
# Edit .env with your Supabase credentials
npm run dev
```

### 2. Frontend Setup

```bash
npm install @supabase/supabase-js
npm run dev
```

### 3. Environment Variables

Create `.env` file in the backend directory:

```env
# Supabase Configuration
SUPABASE_URL=https://ysxtcljsclkoatngtihl.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE=your-service-role-key
SUPABASE_PUBLISHABLE_KEY=your-publishable-key
SUPABASE_SECRET=your-secret-key

# Server Configuration
PORT=3001
NODE_ENV=development
```

## 🎯 Usage Examples

### User Registration

```typescript
import { useAuth } from "@/context/AuthContext";

const { signUp } = useAuth();

const handleRegister = async () => {
  const response = await signUp({
    email: "user@example.com",
    password: "securepassword123",
    firstName: "John",
    lastName: "Doe",
    role: "entrepreneur",
    phone: "+1234567890",
    company: "My Startup"
  });

  if (response.success) {
    console.log("Registration successful!");
  }
};
```

### User Login

```typescript
import { useAuth } from "@/context/AuthContext";

const { signIn } = useAuth();

const handleLogin = async () => {
  const response = await signIn("user@example.com", "password123");
  
  if (response.success) {
    console.log("Login successful!");
  }
};
```

### Check Authentication Status

```typescript
import { useAuth } from "@/context/AuthContext";

const { isAuthenticated, user } = useAuth();

if (isAuthenticated) {
  console.log("User is logged in:", user);
}
```

### Protected Routes

```typescript
import RequireAuth from "@/routes/RequireAuth";

<Route 
  path="/dashboard" 
  element={<RequireAuth><Dashboard /></RequireAuth>} 
/>
```

## 🔌 API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | User logout |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update user profile |
| POST | `/api/auth/refresh` | Refresh token |
| POST | `/api/auth/forgot-password` | Reset password |

### Example API Calls

```javascript
// Register user
const response = await fetch('http://localhost:3001/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe',
    role: 'entrepreneur'
  })
});

// Login user
const response = await fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});
```

## 🧪 Testing

### Test Page
Visit `/auth-test` to test the authentication system:

1. **Sign Up**: Create a new account
2. **Sign In**: Login with existing credentials
3. **View Status**: See current authentication state
4. **Logout**: Sign out from the application

### Manual Testing

```bash
# Start backend
cd backend && npm run dev

# Start frontend
npm run dev

# Visit test page
http://localhost:3000/auth-test
```

## 🔒 Security Features

### Backend Security
- **JWT Token Validation**: Secure token verification
- **Input Validation**: Request sanitization and validation
- **Rate Limiting**: API rate limiting for abuse prevention
- **CORS Protection**: Cross-origin request security
- **Row Level Security**: Database-level access control

### Frontend Security
- **Token Storage**: Secure token management
- **Route Protection**: Authentication-based routing
- **Input Validation**: Client-side form validation
- **Error Handling**: Secure error messages

## 🚨 Error Handling

### Common Errors

```typescript
// Registration errors
if (response.message.includes("already exists")) {
  // Handle duplicate email
}

// Login errors
if (response.message.includes("Invalid credentials")) {
  // Handle wrong password
}

// Network errors
try {
  const response = await signIn(email, password);
} catch (error) {
  // Handle network/server errors
}
```

### Error Messages

- **"User with this email already exists"**: Email already registered
- **"Invalid credentials"**: Wrong email or password
- **"Email not confirmed"**: User needs to verify email
- **"Password too weak"**: Password doesn't meet requirements

## 🔄 State Management

### Authentication Context

```typescript
interface AuthContextValue {
  isAuthenticated: boolean;
  isHydrated: boolean;
  user: AuthUser | null;
  login: (user: AuthUserLegacy) => void;
  logout: () => void;
  signIn: (email: string, password: string) => Promise<Response>;
  signUp: (userData: UserData) => Promise<Response>;
  resetPassword: (email: string) => Promise<Response>;
  updateProfile: (profileData: Partial<AuthUser>) => Promise<Response>;
}
```

### User Object Structure

```typescript
interface AuthUser {
  id: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  phone?: string;
  bio?: string;
}
```

## 🎨 UI Components

### Login Form
- Email and password fields
- Show/hide password toggle
- Remember me checkbox
- Forgot password link
- Loading states

### Registration Form
- Complete user information
- Password confirmation
- Terms acceptance
- Role selection
- Form validation

### Login Dialog
- Modal login form
- Quick access from anywhere
- Redirect handling
- Responsive design

## 🔧 Configuration

### Supabase Settings

1. **Enable Email Confirmation**: Required for registration
2. **Configure Email Templates**: Customize email messages
3. **Set Password Policy**: Configure password requirements
4. **Enable Social Auth**: Add Google, GitHub, etc. (optional)

### Environment Variables

```env
# Required
SUPABASE_URL=your-project-url
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE=your-service-role

# Optional
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your-jwt-secret
```

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Configure CORS for production domain
3. Set up SSL certificates
4. Configure database connections

### Frontend Deployment
1. Update API endpoints for production
2. Configure environment variables
3. Build and deploy to hosting service
4. Set up custom domain

## 📞 Support

For issues or questions:
1. Check the test page at `/auth-test`
2. Review browser console for errors
3. Check backend logs for API errors
4. Verify Supabase configuration

## 🔄 Migration from Static Auth

The integration maintains backward compatibility with the existing static authentication system. The `login` function still works for demo purposes, but new features use the Supabase authentication.

---

**Built with ❤️ for the Inc Combinator community**
