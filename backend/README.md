# Inc Combinator Backend API

A comprehensive backend API for the Inc Combinator startup ecosystem platform, built with Node.js, Express, and Supabase.

## 🚀 Features

- **Supabase Authentication** - Complete user registration, login, and session management
- **Row Level Security (RLS)** - Secure data access with user-based permissions
- **JWT Token Management** - Secure token-based authentication
- **Email Confirmation** - User email verification for account activation
- **Password Reset** - Secure password reset functionality
- **User Profiles** - Complete user profile management
- **Activity Logging** - Comprehensive audit trail
- **Rate Limiting** - API rate limiting for security
- **Input Validation** - Request validation and sanitization
- **Error Handling** - Comprehensive error handling and logging

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account and project
- PostgreSQL database (handled by Supabase)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy the example environment file
   cp env.example .env
   
   # Edit .env with your Supabase credentials
   nano .env
   ```

4. **Database Setup**
   - Run the Supabase schema in your Supabase SQL editor
   - Ensure email confirmation is enabled in Supabase Auth settings

5. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 🔧 Environment Variables

Create a `.env` file in the backend directory:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE=your-service-role-key
SUPABASE_PUBLISHABLE_KEY=your-publishable-key
SUPABASE_SECRET=your-secret-key

# Database Configuration
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres

# Server Configuration
PORT=3001
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# File Upload Configuration
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,application/pdf

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS Configuration
CORS_ORIGIN=http://localhost:3000,https://your-frontend-domain.com
```

## 📚 API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/auth/signup` | Register new user | Public |
| POST | `/api/auth/login` | User login | Public |
| POST | `/api/auth/logout` | User logout | Private |
| GET | `/api/auth/me` | Get current user profile | Private |
| PUT | `/api/auth/profile` | Update user profile | Private |
| POST | `/api/auth/refresh` | Refresh access token | Public |
| POST | `/api/auth/forgot-password` | Send password reset email | Public |

### Request/Response Examples

#### User Registration
```bash
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "entrepreneur",
  "phone": "+1234567890",
  "company": "My Startup"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully. Please check your email to confirm your account.",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "entrepreneur"
  }
}
```

#### User Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "entrepreneur",
    "firstName": "John",
    "lastName": "Doe",
    "company": "My Startup"
  },
  "session": {
    "access_token": "jwt-token",
    "refresh_token": "refresh-token",
    "expires_at": 1234567890
  }
}
```

## 🔐 Authentication

### JWT Token Usage

Include the JWT token in the Authorization header:

```bash
Authorization: Bearer <your-jwt-token>
```

### Token Refresh

When the access token expires, use the refresh token:

```bash
POST /api/auth/refresh
Content-Type: application/json

{
  "refresh_token": "your-refresh-token"
}
```

## 🛡️ Security Features

### Row Level Security (RLS)
- All database tables have RLS enabled
- Users can only access their own data
- Admins have access to all data
- Proper foreign key constraints

### Input Validation
- Email validation and normalization
- Password strength requirements
- Input sanitization
- SQL injection prevention

### Rate Limiting
- API rate limiting per IP
- Configurable limits and windows
- Prevents abuse and DDoS attacks

### CORS Protection
- Configurable CORS origins
- Secure cross-origin requests
- Credentials support

## 📊 Database Schema

The backend uses a comprehensive Supabase schema with:

- **User Management**: Profiles, authentication, roles
- **Applications**: Incubation, investment, program applications
- **Content**: Blog posts, news, resources
- **Events**: Event management and registrations
- **Startups**: Startup profiles and management
- **Audit Trail**: Activity logging for all actions

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 📝 Scripts

```bash
# Development
npm run dev          # Start development server with nodemon

# Production
npm start           # Start production server

# Testing
npm test            # Run tests
npm run test:watch  # Run tests in watch mode

# Linting
npm run lint        # Run ESLint
npm run lint:fix    # Fix linting issues

# Database
npm run migrate     # Run database migrations
npm run seed        # Seed database with sample data
```

## 🚀 Deployment

### Environment Setup
1. Set `NODE_ENV=production`
2. Configure production database URL
3. Set secure JWT secret
4. Configure CORS for production domain

### Deployment Options
- **Vercel**: Serverless deployment
- **Railway**: Easy deployment with database
- **Heroku**: Traditional deployment
- **DigitalOcean**: VPS deployment

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 📄 License

This project is licensed under the MIT License.

## 🔄 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

---

**Built with ❤️ for the Inc Combinator community**
