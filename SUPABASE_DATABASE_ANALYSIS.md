# Supabase Database Schema Analysis & Partnership Form Integration

## Database Schema Overview

The Supabase database contains a comprehensive set of tables designed to support a startup incubator platform. Here's a detailed analysis:

### Core User Management Tables

#### 1. `profiles` Table
- **Purpose**: Stores user profile information
- **Key Fields**: 
  - `id` (UUID, Primary Key) - References auth.users
  - `email` (Text, Unique) - User's email address
  - `first_name`, `last_name` (Text) - User's name
  - `phone`, `company`, `bio` (Text) - Additional profile info
  - `role` (USER-DEFINED) - User role (entrepreneur, investor, mentor, admin)
  - `created_at`, `updated_at` (Timestamp) - Audit fields

#### 2. `auth.users` Table (Supabase Auth)
- **Purpose**: Handles authentication and user sessions
- **Relationship**: Referenced by `profiles.id`

### Application Management Tables

#### 3. `incubation_applications`
- **Purpose**: Startup incubation program applications
- **Key Fields**:
  - `applicant_id` (UUID) - References auth.users
  - `founder_name`, `cofounder_name` (Text)
  - `startup_name`, `website`, `stage`, `industry` (Text)
  - `description`, `mission`, `vision` (Text)
  - `status` (Text) - submitted, pending, approved, rejected
  - `reviewer_id`, `reviewed_by` (UUID) - Admin review tracking
  - `decision_note`, `admin_notes` (Text) - Review feedback

#### 4. `investment_applications`
- **Purpose**: Investment funding applications
- **Key Fields**:
  - `applicant_id` (UUID) - References auth.users
  - `target_investor`, `funding_amount`, `funding_stage` (Text)
  - `current_valuation`, `monthly_revenue`, `user_traction` (Text)
  - `pitch_deck_url`, `financial_statements_url` (Text)
  - `status` (Text) - submitted, pending, approved, rejected
  - `reviewer_id`, `reviewed_by` (UUID) - Admin review tracking

#### 5. `mentor_applications`
- **Purpose**: Mentor program applications
- **Key Fields**:
  - `user_id` (UUID) - References auth.users
  - `first_name`, `last_name`, `email`, `phone` (Text)
  - `position`, `company`, `years_experience` (Text)
  - `expertise` (Array) - Areas of expertise
  - `linkedin_profile`, `why_mentor` (Text)
  - `status` (Text) - submitted, pending, approved, rejected

#### 6. `program_applications`
- **Purpose**: General program applications
- **Key Fields**:
  - `applicant_id` (UUID) - References auth.users
  - `program_name`, `current_stage` (Text)
  - `problem_statement`, `solution_description` (Text)
  - `target_market`, `current_traction` (Text)
  - `funding_requirements`, `why_join` (Text)
  - `status` (Text) - submitted, pending, approved, rejected

#### 7. `grant_applications`
- **Purpose**: Grant funding applications
- **Key Fields**:
  - `applicant_id` (UUID) - References auth.users
  - `startup_name`, `founder_name` (Text)
  - `program_id`, `sector`, `stage` (Text)
  - `business_description`, `social_impact` (Text)
  - `funding_usage_plan` (Text)
  - `status` (Text) - submitted, pending, approved, rejected

#### 8. `partnership_requests`
- **Purpose**: Partnership collaboration requests
- **Key Fields**:
  - `user_id` (UUID) - References auth.users
  - `company_name`, `industry` (Text)
  - `contact_name`, `email`, `phone` (Text)
  - `partnership_type` (Text) - Type of partnership
  - `company_details`, `partnership_goals` (Text)
  - `timeline` (Text) - Preferred timeline
  - `status` (Text) - submitted, pending, approved, rejected
  - `admin_notes`, `reviewed_by` (UUID) - Admin review tracking

### Content Management Tables

#### 9. `blog_posts`
- **Purpose**: Blog content management
- **Key Fields**:
  - `author_id` (UUID) - References auth.users
  - `title`, `slug`, `summary`, `content` (Text)
  - `cover_image_url` (Text)
  - `tags` (Array) - Blog post tags
  - `published` (Boolean) - Publication status
  - `published_at` (Timestamp) - Publication date

#### 10. `news_posts`
- **Purpose**: News content management
- **Key Fields**: Similar to blog_posts structure

#### 11. `events`
- **Purpose**: Event management
- **Key Fields**:
  - `created_by` (UUID) - References auth.users
  - `title`, `description`, `venue`, `city` (Text)
  - `type` (USER-DEFINED) - Event type
  - `starts_at`, `ends_at` (Timestamp) - Event timing
  - `online_url` (Text) - Virtual event link
  - `published` (Boolean) - Publication status

#### 12. `resources`
- **Purpose**: Resource library management
- **Key Fields**:
  - `created_by` (UUID) - References auth.users
  - `title`, `content` (Text)
  - `type` (USER-DEFINED) - Resource type
  - `url` (Text) - Resource link
  - `tags` (Array) - Resource tags
  - `published` (Boolean) - Publication status

### Community & Networking Tables

#### 13. `cofounder_posts`
- **Purpose**: Cofounder matching platform
- **Key Fields**:
  - `posted_by` (UUID) - References auth.users
  - `title`, `role`, `description` (Text)
  - `experience`, `equity`, `location` (Text)
  - `commitment`, `salary` (Text)
  - `skills` (Array) - Required skills
  - `published` (Boolean) - Publication status

#### 14. `consultations`
- **Purpose**: Consultation booking system
- **Key Fields**:
  - `user_id`, `mentor_user_id` (UUID) - References auth.users
  - `name`, `email`, `phone`, `company` (Text)
  - `stage`, `consultation_type` (Text)
  - `preferred_date`, `preferred_time` (Text)
  - `start_at`, `end_at` (Timestamp) - Scheduled time
  - `description` (Text) - Consultation details
  - `status` (Text) - submitted, scheduled, completed

#### 15. `contact_messages`
- **Purpose**: Contact form submissions
- **Key Fields**:
  - `user_id` (UUID) - References auth.users
  - `first_name`, `last_name`, `email`, `phone` (Text)
  - `company`, `inquiry_type` (Text)
  - `subject`, `message` (Text)

### Hackathon Management Tables

#### 16. `hackathon_registrations`
- **Purpose**: Hackathon participant registrations
- **Key Fields**:
  - `user_id` (UUID) - References auth.users
  - `full_name`, `email`, `phone` (Text)
  - `age`, `city`, `college`, `graduation` (Text)
  - `programming_languages`, `experience`, `frameworks` (Text)
  - `specialization`, `github_profile`, `portfolio` (Text)
  - `linkedin_profile` (Text)
  - `agreements` (Boolean) - Terms acceptance
  - `status` (Text) - pending, approved, rejected

#### 17. `hackathon_teams`
- **Purpose**: Hackathon team management
- **Key Fields**:
  - `created_by` (UUID) - References auth.users
  - `team_name`, `team_size` (Text, Integer)
  - `track`, `experience`, `project_idea` (Text)
  - `technical_skills`, `previous_hackathons` (Text)
  - `dietary_requirements` (Text)
  - `accommodation`, `terms_accepted` (Boolean)

#### 18. `hackathon_team_members`
- **Purpose**: Individual team member details
- **Key Fields**:
  - `team_id` (UUID) - References hackathon_teams
  - `full_name`, `email`, `phone` (Text)
  - `role` (Text) - Team role

### Administrative Tables

#### 19. `admin_activity_log`
- **Purpose**: Admin action tracking
- **Key Fields**:
  - `admin_id` (UUID) - References auth.users
  - `action` (Text) - Admin action performed
  - `application_id`, `application_type` (UUID, Text)
  - `old_status`, `new_status` (Text) - Status changes
  - `notes` (Text) - Admin notes

#### 20. `admin_notifications`
- **Purpose**: Admin notification system
- **Key Fields**:
  - `type` (Text) - Notification type
  - `application_id`, `application_type` (UUID, Text)
  - `applicant_name`, `startup_name` (Text)
  - `message` (Text) - Notification content
  - `is_read`, `priority` (Boolean, Text)
  - `created_at`, `updated_at` (Timestamp)

#### 21. `activity_logs`
- **Purpose**: General activity tracking
- **Key Fields**:
  - `actor_user_id` (UUID) - References auth.users
  - `action` (Text) - Action performed
  - `target_table`, `target_id` (Text, UUID)
  - `payload` (JSONB) - Additional data

### Supporting Tables

#### 22. `startups`
- **Purpose**: Startup profiles
- **Key Fields**:
  - `owner_id` (UUID) - References auth.users
  - `name`, `description`, `stage`, `industry` (Text)
  - `location`, `website`, `logo_url` (Text)
  - `team_size`, `founded_year` (Integer)
  - `metrics` (JSONB) - Startup metrics
  - `published` (Boolean) - Publication status

#### 23. `mentor_profiles`
- **Purpose**: Mentor profile information
- **Key Fields**:
  - `user_id` (UUID) - References auth.users
  - `name`, `organization`, `bio` (Text)
  - `expertise` (Array) - Areas of expertise
  - `availability`, `website` (Text)
  - `avatar_url`, `linkedin`, `twitter` (Text)
  - `published` (Boolean) - Publication status

#### 24. `investor_profiles`
- **Purpose**: Investor profile information
- **Key Fields**:
  - `user_id` (UUID) - References auth.users
  - `name`, `organization`, `bio` (Text)
  - `investment_thesis` (Text)
  - `stages`, `sectors` (Array) - Investment focus
  - `ticket_min`, `ticket_max` (Text) - Investment range
  - `website`, `logo_url`, `linkedin`, `twitter` (Text)
  - `published` (Boolean) - Publication status

#### 25. `cohorts`
- **Purpose**: Program cohort management
- **Key Fields**:
  - `name`, `season`, `year` (Text, Integer)
  - `description` (Text)
  - `start_date`, `end_date` (Date)
  - `is_current` (Boolean) - Active cohort flag
  - `published` (Boolean) - Publication status

#### 26. `cohort_startups`
- **Purpose**: Many-to-many relationship between cohorts and startups
- **Key Fields**:
  - `cohort_id` (UUID) - References cohorts
  - `startup_id` (UUID) - References startups
  - `added_at` (Timestamp)

#### 27. `deals_offers`
- **Purpose**: Partnership deals and offers
- **Key Fields**:
  - `created_by` (UUID) - References auth.users
  - `title`, `partner_name`, `description` (Text)
  - `link_url`, `discount_code` (Text)
  - `valid_from`, `valid_to` (Date)
  - `published` (Boolean) - Publication status

#### 28. `event_registrations`
- **Purpose**: Event registration tracking
- **Key Fields**:
  - `event_id` (UUID) - References events
  - `user_id` (UUID) - References auth.users
  - `status` (Text) - registered, attended, cancelled
  - `notes` (Text)

#### 29. `attachments`
- **Purpose**: File attachment management
- **Key Fields**:
  - `owner_user_id` (UUID) - References auth.users
  - `table_name`, `record_id` (Text, UUID)
  - `file_name`, `content_type`, `storage_path` (Text)
  - `public` (Boolean) - Public access flag

#### 30. `mail_queue`
- **Purpose**: Email queue management
- **Key Fields**:
  - `event_type` (Text) - Email type
  - `payload` (JSONB) - Email data
  - `to_email` (Text) - Recipient email
  - `status` (Text) - pending, sent, failed
  - `attempts` (Integer) - Retry attempts
  - `last_error` (Text) - Error details

### Comment & Interaction Tables

#### 31. `blog_comments`
- **Purpose**: Blog post comments
- **Key Fields**:
  - `post_id` (UUID) - References blog_posts
  - `user_id` (UUID) - References auth.users
  - `content` (Text) - Comment content
  - `parent_id` (UUID) - References blog_comments (replies)

#### 32. `news_comments`
- **Purpose**: News post comments
- **Key Fields**: Similar to blog_comments structure

## Partnership Form Integration

### Implementation Details

I have successfully integrated a comprehensive partnership form system with the following components:

#### 1. PartnershipFormDialog Component (`src/components/PartnershipFormDialog.tsx`)

**Features:**
- **Authentication Integration**: Requires user login before form submission
- **Form Validation**: Client-side validation for required fields
- **API Integration**: Connects to Supabase database via apiService
- **Email Automation**: Sends confirmation emails via emailService
- **User Experience**: Loading states, success/error notifications
- **Responsive Design**: Works on desktop and mobile devices

**Form Fields:**
- Company Name (required)
- Industry (dropdown with 10+ options)
- Contact Person (required)
- Email (required, validated)
- Phone Number (optional)
- Partnership Type (dropdown with 8 options)
- Company Details (required, textarea)
- Partnership Goals (required, textarea)
- Preferred Timeline (dropdown with 5 options)

#### 2. Updated Partnership Page (`src/pages/Partnership.tsx`)

**Changes Made:**
- Replaced static form with interactive PartnershipFormDialog
- Added proper button styling with Handshake icon
- Maintained existing page layout and design
- Integrated with authentication system

#### 3. Email Integration

**Email Template**: Already exists in `supabase/functions/send-hackathon-email/index.ts`
- **Template Type**: `partnership_request`
- **Subject**: "Partnership Request Submitted - Inc Combinator"
- **Content**: Professional HTML email with:
  - Partnership details summary
  - Next steps information
  - Call-to-action button
  - Branded styling

**Email Service**: Already configured in `src/services/emailService.ts`
- **Method**: `sendPartnershipRequestEmail()`
- **Integration**: Uses Supabase Edge Functions

#### 4. Database Integration

**API Service**: Already configured in `src/services/apiService.ts`
- **Method**: `submitPartnershipRequest()`
- **Table**: `partnership_requests`
- **Fields**: All form data mapped to database columns
- **Status**: Automatically set to 'submitted'

### Database Schema Analysis for Partnership Requests

#### `partnership_requests` Table Structure:

```sql
CREATE TABLE public.partnership_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  company_name text NOT NULL,
  industry text NOT NULL,
  contact_name text NOT NULL,
  email text NOT NULL,
  phone text,
  partnership_type text NOT NULL,
  company_details text NOT NULL,
  partnership_goals text NOT NULL,
  timeline text,
  status text NOT NULL DEFAULT 'submitted'::text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  admin_notes text,
  reviewed_by uuid,
  reviewed_at timestamp with time zone,
  CONSTRAINT partnership_requests_pkey PRIMARY KEY (id),
  CONSTRAINT partnership_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT partnership_requests_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.profiles(id)
);
```

**Key Features:**
- **UUID Primary Key**: Unique identifier for each request
- **User Association**: Links to authenticated user
- **Required Fields**: Company name, industry, contact info, partnership details
- **Status Tracking**: submitted → pending → approved/rejected
- **Admin Review**: Admin notes and reviewer tracking
- **Audit Trail**: Created/updated timestamps
- **Foreign Keys**: Proper referential integrity

### Admin Dashboard Integration

The partnership requests are automatically integrated into the admin dashboard:

#### 1. Admin Overview (`src/components/dashboard/AdminOverview.tsx`)
- **Statistics**: Total partnership requests count
- **Pending Requests**: Number of requests awaiting review
- **Approved/Rejected**: Status breakdown

#### 2. Application Management (`src/components/dashboard/ApplicationManagement.tsx`)
- **Partnership Requests**: Listed with other application types
- **Status Updates**: Admin can approve/reject requests
- **Notes**: Admin can add review notes

#### 3. Admin API Service (`src/services/adminApiService.ts`)
- **getAllApplications()**: Includes partnership requests
- **getAdminDashboardStats()**: Partnership request statistics
- **updateApplicationStatus()**: Status management for partnership requests

### Security & Permissions

#### Row Level Security (RLS) Policies:
- **User Access**: Users can only view their own partnership requests
- **Admin Access**: Admins can view and manage all requests
- **Public Access**: Limited to form submission only

#### Authentication Requirements:
- **Form Submission**: Requires user authentication
- **Data Access**: Protected by user ID association
- **Admin Functions**: Restricted to admin role

### Email Workflow

#### 1. Form Submission Process:
1. User fills out partnership form
2. Form validates required fields
3. Data submitted to `partnership_requests` table
4. Confirmation email sent via Supabase Edge Function
5. Success notification shown to user
6. Admin notification created (if configured)

#### 2. Email Template Features:
- **Professional Design**: Branded HTML template
- **Dynamic Content**: Personalized with form data
- **Clear Next Steps**: What happens after submission
- **Contact Information**: How to reach the team
- **Mobile Responsive**: Works on all devices

### Testing & Validation

#### 1. Form Validation:
- **Required Fields**: Company name, industry, contact person, email, partnership type, company details, partnership goals
- **Email Format**: Valid email address validation
- **Character Limits**: Appropriate textarea limits
- **Dropdown Validation**: Ensures valid selections

#### 2. API Testing:
- **Database Insertion**: Successful data storage
- **Email Delivery**: Confirmation email sending
- **Error Handling**: Graceful error management
- **Authentication**: Proper user verification

#### 3. User Experience:
- **Loading States**: Visual feedback during submission
- **Success Messages**: Clear confirmation of submission
- **Error Messages**: Helpful error descriptions
- **Form Reset**: Clean form after successful submission

## Summary

The partnership form integration is now fully functional with:

✅ **Complete Form Implementation**: All required fields with validation
✅ **Database Integration**: Proper data storage in `partnership_requests` table
✅ **Email Automation**: Professional confirmation emails
✅ **Admin Dashboard**: Full integration with admin management system
✅ **Authentication**: Secure user authentication required
✅ **Responsive Design**: Works on all device sizes
✅ **Error Handling**: Comprehensive error management
✅ **User Experience**: Smooth, professional user journey

The system is ready for production use and follows all best practices for form handling, data security, and user experience.
