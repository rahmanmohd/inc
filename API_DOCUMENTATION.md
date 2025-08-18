# 🚀 Inc Combinator API Documentation

## Overview

This API service provides a comprehensive interface to interact with the Inc Combinator database schema. It's built with TypeScript and Supabase, offering type-safe database operations for all major entities in the platform.

## 📋 Table of Contents

- [Authentication](#authentication)
- [Profiles API](#profiles-api)
- [Startups API](#startups-api)
- [Blog Posts API](#blog-posts-api)
- [News Posts API](#news-posts-api)
- [Events API](#events-api)
- [Resources API](#resources-api)
- [Hackathon API](#hackathon-api)
- [Applications API](#applications-api)
- [Profiles API](#profiles-api-1)
- [Consultations API](#consultations-api)
- [Deals & Offers API](#deals--offers-api)
- [Cofounder Posts API](#cofounder-posts-api)
- [Cohorts API](#cohorts-api)
- [Partnership Requests API](#partnership-requests-api)
- [Contact Messages API](#contact-messages-api)
- [Utility Methods](#utility-methods)

## 🔐 Authentication

The API uses Supabase authentication. All requests require a valid JWT token in the Authorization header.

```typescript
import apiService from '@/services/apiService';

// Get current user profile
const profile = await apiService.getProfile(userId);
```

## 👥 Profiles API

### Get Profile
```typescript
async getProfile(userId: string): Promise<ApiResponse<Profile>>
```
**Description:** Retrieve a user's profile by ID.

### Update Profile
```typescript
async updateProfile(userId: string, updates: ProfileUpdate): Promise<ApiResponse<Profile>>
```
**Description:** Update a user's profile information.

### Get Profiles by Role
```typescript
async getProfilesByRole(role: Profile['role']): Promise<ApiResponse<Profile[]>>
```
**Description:** Get all profiles filtered by role (admin, entrepreneur, startup, investor, mentor, user).

## 🏢 Startups API

### Get Startups
```typescript
async getStartups(published?: boolean): Promise<ApiResponse<Startup[]>>
```
**Description:** Retrieve all startups, optionally filtered by published status.

### Get Startup by ID
```typescript
async getStartupById(id: string): Promise<ApiResponse<Startup>>
```
**Description:** Get a specific startup by its ID.

### Create Startup
```typescript
async createStartup(startup: StartupInsert): Promise<ApiResponse<Startup>>
```
**Description:** Create a new startup record.

### Update Startup
```typescript
async updateStartup(id: string, updates: StartupUpdate): Promise<ApiResponse<Startup>>
```
**Description:** Update an existing startup.

### Delete Startup
```typescript
async deleteStartup(id: string): Promise<ApiResponse<void>>
```
**Description:** Delete a startup record.

## 📝 Blog Posts API

### Get Blog Posts
```typescript
async getBlogPosts(published?: boolean): Promise<ApiResponse<BlogPost[]>>
```
**Description:** Retrieve all blog posts, optionally filtered by published status.

### Get Blog Post by ID
```typescript
async getBlogPostById(id: string): Promise<ApiResponse<BlogPost>>
```
**Description:** Get a specific blog post by ID.

### Get Blog Post by Slug
```typescript
async getBlogPostBySlug(slug: string): Promise<ApiResponse<BlogPost>>
```
**Description:** Get a blog post by its URL slug.

### Create Blog Post
```typescript
async createBlogPost(post: BlogPostInsert): Promise<ApiResponse<BlogPost>>
```
**Description:** Create a new blog post.

### Update Blog Post
```typescript
async updateBlogPost(id: string, updates: BlogPostUpdate): Promise<ApiResponse<BlogPost>>
```
**Description:** Update an existing blog post.

## 📰 News Posts API

### Get News Posts
```typescript
async getNewsPosts(published?: boolean): Promise<ApiResponse<NewsPost[]>>
```
**Description:** Retrieve all news posts, optionally filtered by published status.

### Get News Post by ID
```typescript
async getNewsPostById(id: string): Promise<ApiResponse<NewsPost>>
```
**Description:** Get a specific news post by ID.

### Get News Post by Slug
```typescript
async getNewsPostBySlug(slug: string): Promise<ApiResponse<NewsPost>>
```
**Description:** Get a news post by its URL slug.

## 🎉 Events API

### Get Events
```typescript
async getEvents(published?: boolean): Promise<ApiResponse<Event[]>>
```
**Description:** Retrieve all events, optionally filtered by published status.

### Get Event by ID
```typescript
async getEventById(id: string): Promise<ApiResponse<Event>>
```
**Description:** Get a specific event by ID.

### Get Events by Type
```typescript
async getEventsByType(type: Event['type']): Promise<ApiResponse<Event[]>>
```
**Description:** Get events filtered by type (workshop, conference, meetup, hackathon, pitch_competition, other).

## 📚 Resources API

### Get Resources
```typescript
async getResources(published?: boolean): Promise<ApiResponse<Resource[]>>
```
**Description:** Retrieve all resources, optionally filtered by published status.

### Get Resources by Type
```typescript
async getResourcesByType(type: Resource['type']): Promise<ApiResponse<Resource[]>>
```
**Description:** Get resources filtered by type (article, video, template, tool, guide, other).

## 🏆 Hackathon API

### Register for Hackathon
```typescript
async registerForHackathon(registration: HackathonRegistrationInsert): Promise<ApiResponse<HackathonRegistration>>
```
**Description:** Register a user for a hackathon event.

### Get Hackathon Registrations
```typescript
async getHackathonRegistrations(): Promise<ApiResponse<HackathonRegistration[]>>
```
**Description:** Get all hackathon registrations.

### Create Hackathon Team
```typescript
async createHackathonTeam(team: HackathonTeamInsert): Promise<ApiResponse<HackathonTeam>>
```
**Description:** Create a new hackathon team.

### Get Hackathon Teams
```typescript
async getHackathonTeams(): Promise<ApiResponse<HackathonTeam[]>>
```
**Description:** Get all hackathon teams.

## 📋 Applications API

### Incubation Applications

#### Submit Incubation Application
```typescript
async submitIncubationApplication(application: IncubationApplicationInsert): Promise<ApiResponse<IncubationApplication>>
```

#### Get Incubation Applications
```typescript
async getIncubationApplications(): Promise<ApiResponse<IncubationApplication[]>>
```

### Investment Applications

#### Submit Investment Application
```typescript
async submitInvestmentApplication(application: InvestmentApplicationInsert): Promise<ApiResponse<InvestmentApplication>>
```

#### Get Investment Applications
```typescript
async getInvestmentApplications(): Promise<ApiResponse<InvestmentApplication[]>>
```

### Mentor Applications

#### Submit Mentor Application
```typescript
async submitMentorApplication(application: MentorApplicationInsert): Promise<ApiResponse<MentorApplication>>
```

#### Get Mentor Applications
```typescript
async getMentorApplications(): Promise<ApiResponse<MentorApplication[]>>
```

### Program Applications

#### Submit Program Application
```typescript
async submitProgramApplication(application: ProgramApplicationInsert): Promise<ApiResponse<ProgramApplication>>
```

#### Get Program Applications
```typescript
async getProgramApplications(): Promise<ApiResponse<ProgramApplication[]>>
```

### Grant Applications

#### Submit Grant Application
```typescript
async submitGrantApplication(application: GrantApplicationInsert): Promise<ApiResponse<GrantApplication>>
```

#### Get Grant Applications
```typescript
async getGrantApplications(): Promise<ApiResponse<GrantApplication[]>>
```

## 👨‍🏫 Profiles API

### Mentor Profiles
```typescript
async getMentorProfiles(published?: boolean): Promise<ApiResponse<MentorProfile[]>>
```
**Description:** Get all mentor profiles, optionally filtered by published status.

### Investor Profiles
```typescript
async getInvestorProfiles(published?: boolean): Promise<ApiResponse<InvestorProfile[]>>
```
**Description:** Get all investor profiles, optionally filtered by published status.

## 💼 Consultations API

### Submit Consultation
```typescript
async submitConsultation(consultation: ConsultationInsert): Promise<ApiResponse<Consultation>>
```
**Description:** Submit a new consultation request.

### Get Consultations
```typescript
async getConsultations(): Promise<ApiResponse<Consultation[]>>
```
**Description:** Get all consultation requests.

## 🎁 Deals & Offers API

### Get Deals & Offers
```typescript
async getDealsOffers(published?: boolean): Promise<ApiResponse<DealOffer[]>>
```
**Description:** Get all deals and offers, optionally filtered by published status.

### Create Deal Offer
```typescript
async createDealOffer(deal: DealOfferInsert): Promise<ApiResponse<DealOffer>>
```
**Description:** Create a new deal or offer.

## 👥 Cofounder Posts API

### Get Cofounder Posts
```typescript
async getCofounderPosts(published?: boolean): Promise<ApiResponse<CofounderPost[]>>
```
**Description:** Get all cofounder posts, optionally filtered by published status.

### Create Cofounder Post
```typescript
async createCofounderPost(post: CofounderPostInsert): Promise<ApiResponse<CofounderPost>>
```
**Description:** Create a new cofounder post.

## 🎓 Cohorts API

### Get Cohorts
```typescript
async getCohorts(published?: boolean): Promise<ApiResponse<Cohort[]>>
```
**Description:** Get all cohorts, optionally filtered by published status.

### Get Current Cohort
```typescript
async getCurrentCohort(): Promise<ApiResponse<Cohort>>
```
**Description:** Get the currently active cohort.

## 🤝 Partnership Requests API

### Submit Partnership Request
```typescript
async submitPartnershipRequest(request: PartnershipRequestInsert): Promise<ApiResponse<PartnershipRequest>>
```
**Description:** Submit a new partnership request.

### Get Partnership Requests
```typescript
async getPartnershipRequests(): Promise<ApiResponse<PartnershipRequest[]>>
```
**Description:** Get all partnership requests.

## 📧 Contact Messages API

### Submit Contact Message
```typescript
async submitContactMessage(message: ContactMessageInsert): Promise<ApiResponse<ContactMessage>>
```
**Description:** Submit a new contact message.

### Get Contact Messages
```typescript
async getContactMessages(): Promise<ApiResponse<ContactMessage[]>>
```
**Description:** Get all contact messages.

## 🛠️ Utility Methods

### Search Content
```typescript
async searchContent(query: string, table: string): Promise<ApiResponse<any[]>>
```
**Description:** Search for content across any table using title, description, or content fields.

### Get Stats
```typescript
async getStats(): Promise<ApiResponse<any>>
```
**Description:** Get platform statistics including counts of profiles, startups, posts, events, resources, and applications.

### Update Application Status
```typescript
async updateApplicationStatus(table: string, id: string, status: string, reviewerId?: string, decisionNote?: string): Promise<ApiResponse<any>>
```
**Description:** Update the status of any application (incubation, investment, mentor, program, grant) with optional reviewer information and decision notes.

## 📊 Response Format

All API methods return a consistent response format:

```typescript
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: any;
}
```

### Success Response Example
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Example",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### Error Response Example
```json
{
  "success": false,
  "error": "Error message",
  "message": "User-friendly error message"
}
```

## 🔧 Usage Examples

### Basic Usage
```typescript
import apiService from '@/services/apiService';

// Get all published startups
const response = await apiService.getStartups(true);
if (response.success) {
  console.log('Startups:', response.data);
} else {
  console.error('Error:', response.error);
}
```

### Creating Content
```typescript
// Create a new blog post
const newPost = {
  title: "My First Blog Post",
  slug: "my-first-blog-post",
  summary: "A brief summary",
  content: "Full blog post content...",
  author_id: "user-uuid",
  published: false
};

const response = await apiService.createBlogPost(newPost);
if (response.success) {
  console.log('Post created:', response.data);
}
```

### Submitting Applications
```typescript
// Submit an incubation application
const application = {
  applicant_id: "user-uuid",
  founder_name: "John Doe",
  email: "john@example.com",
  startup_name: "My Startup",
  description: "Startup description...",
  // ... other fields
};

const response = await apiService.submitIncubationApplication(application);
if (response.success) {
  console.log('Application submitted:', response.data);
}
```

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install @supabase/supabase-js
   ```

2. **Import the Service**
   ```typescript
   import apiService from '@/services/apiService';
   ```

3. **Start Using the API**
   ```typescript
   // Example: Get all published blog posts
   const posts = await apiService.getBlogPosts(true);
   ```

## 🔒 Security Considerations

- All API calls require proper authentication
- Row Level Security (RLS) is enabled on all tables
- Input validation is handled at the database level
- Sensitive operations require appropriate user permissions

## 📝 Notes

- All timestamps are in ISO 8601 format
- UUIDs are used for all primary keys
- Array fields are supported for tags, skills, and other multi-value data
- JSONB fields are used for flexible data structures like metrics
- All tables include `created_at` and `updated_at` timestamps

## 🤝 Contributing

When adding new API methods:

1. Add the method to the `ApiService` class
2. Include proper TypeScript types
3. Add error handling
4. Update this documentation
5. Include usage examples

## 📞 Support

For API support and questions, please refer to the Supabase documentation or contact the development team.
