# 🚀 Hackathon API Integration with Supabase

This document outlines the complete integration of Supabase API for all hackathon form submissions and email notifications using Edge Functions with SendGrid API.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Database Schema](#database-schema)
3. [API Services](#api-services)
4. [Form Components](#form-components)
5. [Email Notifications](#email-notifications)
6. [Setup Instructions](#setup-instructions)
7. [Testing Guide](#testing-guide)

## 🎯 Overview

The hackathon system now includes:
- **Real-time form submissions** to Supabase
- **Automatic email notifications** via Edge Functions using SendGrid API
- **Comprehensive data validation**
- **User-friendly error handling**
- **Loading states and feedback**

## 🗄️ Database Schema

### Tables Required in Supabase

#### 1. `hackathons` Table
```sql
CREATE TABLE hackathons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  location TEXT NOT NULL,
  theme TEXT NOT NULL,
  prize_pool TEXT NOT NULL,
  participants TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Coming Soon',
  description TEXT NOT NULL,
  registration_deadline TEXT NOT NULL,
  max_participants INTEGER DEFAULT 500,
  current_participants INTEGER DEFAULT 0,
  tracks TEXT[] DEFAULT '{}',
  prizes JSONB DEFAULT '[]',
  rules TEXT[] DEFAULT '{}',
  requirements TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 2. `hackathon_registrations` Table
```sql
CREATE TABLE hackathon_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hackathon_id UUID REFERENCES hackathons(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  age TEXT NOT NULL,
  city TEXT NOT NULL,
  college TEXT,
  graduation TEXT,
  programming_languages TEXT NOT NULL,
  experience TEXT NOT NULL,
  frameworks TEXT,
  specialization TEXT,
  github_profile TEXT,
  portfolio TEXT,
  agreements BOOLEAN NOT NULL DEFAULT false,
  hackathon_title TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 3. `hackathon_submissions` Table
```sql
CREATE TABLE hackathon_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hackathon_id UUID REFERENCES hackathons(id) ON DELETE CASCADE,
  team_name TEXT NOT NULL,
  project_title TEXT NOT NULL,
  project_description TEXT NOT NULL,
  team_members TEXT[] NOT NULL,
  technologies TEXT[] NOT NULL,
  github_repo TEXT,
  demo_link TEXT,
  presentation_link TEXT,
  track TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'submitted',
  score INTEGER,
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 4. `hackathon_feedback` Table
```sql
CREATE TABLE hackathon_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  hackathon_id UUID REFERENCES hackathons(id) ON DELETE CASCADE,
  registration_id UUID REFERENCES hackathon_registrations(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT NOT NULL,
  suggestions TEXT,
  would_recommend BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔧 API Services

### HackathonService (`src/services/hackathonService.ts`)

The service provides comprehensive API methods:

#### Event Management
- `getHackathons()` - Fetch all hackathons
- `getHackathonById(id)` - Get specific hackathon
- `createHackathon(data)` - Create new hackathon
- `updateHackathon(id, updates)` - Update hackathon
- `deleteHackathon(id)` - Delete hackathon

#### Registration Management
- `registerForHackathon(data)` - Register for hackathon
- `getRegistrations(hackathonId?)` - Get registrations
- `updateRegistrationStatus(id, status)` - Update status
- `getUserRegistrations(email)` - Get user's registrations
- `checkRegistrationStatus(email, hackathonId)` - Check if registered

#### Project Submissions
- `submitProject(data)` - Submit project
- `getSubmissions(hackathonId?)` - Get submissions
- `updateSubmissionStatus(id, status, score?, feedback?)` - Update status

#### Feedback
- `submitFeedback(data)` - Submit feedback
- `getFeedback(hackathonId)` - Get feedback

#### Utilities
- `getHackathonStats(hackathonId)` - Get statistics

## 🎨 Form Components

### 1. HackathonRegistrationForm
**Location**: `src/components/HackathonRegistrationForm.tsx`

**Features**:
- Personal information collection
- Technical skills assessment
- Agreement acceptance
- Real-time validation
- Loading states
- Auto-fill from user profile

**Usage**:
```tsx
<HackathonRegistrationForm 
  hackathonId="1" 
  hackathonTitle="AI Innovation Challenge 2025"
>
  <Button>Register Now</Button>
</HackathonRegistrationForm>
```

### 2. ProjectSubmissionForm
**Location**: `src/components/hackathon/ProjectSubmissionForm.tsx`

**Features**:
- Project information
- Team member management
- Technology stack
- Links (GitHub, demo, presentation)
- Track selection

**Usage**:
```tsx
<ProjectSubmissionForm 
  hackathonId="1" 
  hackathonTitle="AI Innovation Challenge 2025"
>
  <Button>Submit Project</Button>
</ProjectSubmissionForm>
```

### 3. FeedbackForm
**Location**: `src/components/hackathon/FeedbackForm.tsx`

**Features**:
- Star rating system
- Experience feedback
- Improvement suggestions
- Recommendation checkbox

**Usage**:
```tsx
<FeedbackForm 
  hackathonId="1" 
  hackathonTitle="AI Innovation Challenge 2025"
  registrationId="reg-123"
>
  <Button>Submit Feedback</Button>
</FeedbackForm>
```

## 📧 Email Notifications

### Edge Function: `send-hackathon-email`

**Location**: `supabase/functions/send-hackathon-email/index.ts`

**Email Provider**: SendGrid API

**Email Types**:
1. **Registration Confirmation** - Sent when user registers
2. **Status Update** - Sent when registration status changes
3. **Project Submission** - Sent when project is submitted
4. **Submission Status** - Sent when submission status changes

**Email Features**:
- Beautiful HTML templates
- Responsive design
- Status-specific content
- Call-to-action buttons
- Branded styling
- SendGrid API integration for reliable delivery

### SendGrid Configuration

The Edge Function is configured with:
- **API Key**: `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`
- **From Email**: `muteeurrahmanmohammed@gmail.com`
- **From Name**: `Inc Combinator`

## ⚙️ Setup Instructions

### 1. Database Setup

1. **Create Tables**: Run the SQL commands above in your Supabase SQL editor
2. **Enable RLS**: Set up Row Level Security policies
3. **Create Indexes**: For better performance

```sql
-- Create indexes
CREATE INDEX idx_hackathon_registrations_email ON hackathon_registrations(email);
CREATE INDEX idx_hackathon_registrations_hackathon_id ON hackathon_registrations(hackathon_id);
CREATE INDEX idx_hackathon_submissions_hackathon_id ON hackathon_submissions(hackathon_id);
CREATE INDEX idx_hackathon_feedback_hackathon_id ON hackathon_feedback(hackathon_id);
```

### 2. Edge Function Deployment

1. **Install Supabase CLI**:
```bash
npm install -g supabase
```

2. **Login to Supabase**:
```bash
supabase login
```

3. **Deploy Function**:
```bash
supabase functions deploy send-hackathon-email
```

### 3. SendGrid Setup

1. **Verify Sender Email**: Ensure `muteeurrahmanmohammed@gmail.com` is verified in SendGrid
2. **API Key**: The function uses the provided SendGrid API key
3. **Domain Authentication**: For better deliverability, consider authenticating your domain

### 4. Frontend Integration

1. **Install Dependencies**:
```bash
npm install @supabase/supabase-js
```

2. **Import Components**:
```tsx
import HackathonRegistrationForm from '@/components/HackathonRegistrationForm';
import ProjectSubmissionForm from '@/components/hackathon/ProjectSubmissionForm';
import FeedbackForm from '@/components/hackathon/FeedbackForm';
```

## 🧪 Testing Guide

### 1. Registration Testing

```typescript
// Test registration flow
const testRegistration = async () => {
  const response = await hackathonService.registerForHackathon({
    fullName: "Test User",
    email: "test@example.com",
    phone: "1234567890",
    age: "25",
    city: "Bangalore",
    programmingLanguages: "JavaScript, Python",
    experience: "intermediate",
    agreements: true,
    hackathonId: "1",
    hackathonTitle: "Test Hackathon"
  });
  
  console.log('Registration response:', response);
};
```

### 2. Email Testing

```typescript
// Test email function
const testEmail = async () => {
  const response = await supabase.functions.invoke('send-hackathon-email', {
    body: {
      type: 'registration',
      email: 'test@example.com',
      name: 'Test User',
      hackathonTitle: 'Test Hackathon'
    }
  });
  
  console.log('Email response:', response);
};
```

### 3. SendGrid Testing

```typescript
// Test SendGrid API directly
const testSendGrid = async () => {
  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer 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',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [
        {
          to: [{ email: 'test@example.com', name: 'Test User' }],
          subject: 'Test Email'
        }
      ],
      from: {
        email: 'muteeurrahmanmohammed@gmail.com',
        name: 'Inc Combinator'
      },
      content: [
        {
          type: 'text/html',
          value: '<h1>Test Email</h1><p>This is a test email from SendGrid.</p>'
        }
      ]
    })
  });
  
  console.log('SendGrid response:', response.status, await response.text());
};
```

### 4. Form Testing

1. **Registration Form**:
   - Fill all required fields
   - Test validation
   - Submit and check email
   - Verify database entry

2. **Project Submission**:
   - Add team members
   - Add technologies
   - Submit project
   - Check confirmation email

3. **Feedback Form**:
   - Rate with stars
   - Write feedback
   - Submit and verify

### 5. Error Testing

```typescript
// Test duplicate registration
const testDuplicateRegistration = async () => {
  // Register first time
  await hackathonService.registerForHackathon(registrationData);
  
  // Try to register again
  const response = await hackathonService.registerForHackathon(registrationData);
  
  // Should return error
  console.log('Duplicate registration response:', response);
};
```

## 🔒 Security Features

### Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE hackathons ENABLE ROW LEVEL SECURITY;
ALTER TABLE hackathon_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE hackathon_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE hackathon_feedback ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view hackathons" ON hackathons FOR SELECT USING (true);
CREATE POLICY "Users can register for hackathons" ON hackathon_registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view their own registrations" ON hackathon_registrations FOR SELECT USING (auth.email() = email);
```

### Input Validation

- **Frontend**: Real-time validation with user feedback
- **Backend**: Database constraints and type checking
- **API**: Comprehensive error handling

### SendGrid Security

- **API Key**: Securely stored in Edge Function
- **Rate Limiting**: SendGrid provides built-in rate limiting
- **Email Validation**: SendGrid validates email addresses
- **Spam Protection**: Built-in spam detection and filtering

## 📊 Monitoring & Analytics

### Key Metrics to Track

1. **Registration Metrics**:
   - Total registrations per hackathon
   - Registration conversion rate
   - Geographic distribution

2. **Submission Metrics**:
   - Submission rate
   - Track distribution
   - Technology usage

3. **Feedback Metrics**:
   - Average rating
   - Recommendation rate
   - Common feedback themes

4. **Email Metrics** (via SendGrid):
   - Delivery rate
   - Open rate
   - Click rate
   - Bounce rate

### Dashboard Queries

```sql
-- Get hackathon statistics
SELECT 
  h.title,
  COUNT(r.id) as total_registrations,
  COUNT(CASE WHEN r.status = 'approved' THEN 1 END) as approved_registrations,
  COUNT(s.id) as total_submissions,
  AVG(f.rating) as average_rating
FROM hackathons h
LEFT JOIN hackathon_registrations r ON h.id = r.hackathon_id
LEFT JOIN hackathon_submissions s ON h.id = s.hackathon_id
LEFT JOIN hackathon_feedback f ON h.id = f.hackathon_id
GROUP BY h.id, h.title;
```

## 🚀 Performance Optimization

### 1. Database Optimization

- **Indexes**: On frequently queried columns
- **Pagination**: For large result sets
- **Caching**: For static hackathon data

### 2. Frontend Optimization

- **Lazy Loading**: For form components
- **Debouncing**: For search inputs
- **Memoization**: For expensive calculations

### 3. Email Optimization

- **SendGrid Queuing**: Built-in queuing system
- **Template Caching**: For faster rendering
- **Rate Limiting**: To prevent spam
- **Bulk Sending**: For multiple recipients

## 🔄 Future Enhancements

### Planned Features

1. **Real-time Updates**: WebSocket integration for live status updates
2. **File Uploads**: Support for project files and presentations
3. **Team Management**: Advanced team formation and management
4. **Judging System**: Integrated judging and scoring
5. **Analytics Dashboard**: Real-time hackathon analytics
6. **Mobile App**: Native mobile application
7. **Integration APIs**: Third-party service integrations

### Technical Improvements

1. **Microservices**: Break down into smaller services
2. **Event Sourcing**: For better audit trails
3. **CQRS**: Command Query Responsibility Segregation
4. **GraphQL**: For more flexible data fetching
5. **Real-time Collaboration**: For team projects

### Email Enhancements

1. **Dynamic Templates**: Personalized email content
2. **A/B Testing**: Test different email formats
3. **Advanced Analytics**: Detailed email performance metrics
4. **Automated Workflows**: Trigger-based email sequences

---

## 📞 Support

For technical support or questions:
- **Email**: support@inccombinator.com
- **Documentation**: [API Docs](https://docs.inccombinator.com)
- **GitHub**: [Issues](https://github.com/inccombinator/hackathon-api/issues)

---

**Built with ❤️ for the Inc Combinator community**
