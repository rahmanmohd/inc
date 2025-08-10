
# Inc Combinator - Comprehensive Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture & Technology Stack](#architecture--technology-stack)
3. [Page Structure & Navigation](#page-structure--navigation)
4. [Component System](#component-system)
5. [User Types & Dashboards](#user-types--dashboards)
6. [Forms & Data Management](#forms--data-management)
7. [Routing & Navigation](#routing--navigation)
8. [UI/UX Design System](#uiux-design-system)
9. [Development Guidelines](#development-guidelines)
10. [Deployment & Integration](#deployment--integration)

## Project Overview

Inc Combinator is a comprehensive startup accelerator platform built with React, featuring multiple user types, dashboards, and integrated workflows for entrepreneurs, co-founders, investors, and administrators.

### Key Features
- Multi-user dashboard system (Startup, Admin, User, Co-founder)
- Comprehensive application management
- Co-founder matching platform
- Event and hackathon management
- Resource center and learning materials
- Investment tracking and deal management

## Architecture & Technology Stack

### Frontend Framework
- **React 18.3.1** with TypeScript
- **Vite** for build tooling and development server
- **React Router DOM 6.26.2** for navigation

### UI Framework
- **Tailwind CSS** for styling with semantic tokens
- **shadcn/ui** component library
- **Radix UI** primitives for accessibility
- **Lucide React** for icons

### State Management & Data
- **React Hook Form 7.53.0** for form management
- **Zod 3.23.8** for schema validation
- **TanStack React Query 5.56.2** for data fetching
- **Supabase Integration** (enabled for backend functionality)

## Page Structure & Navigation

### Public Pages
```
├── / (Index) - Homepage with hero section and features
├── /about - About Us with Advisory Board
├── /contact - Contact information and forms
├── /philosophy - Inc Combinator philosophy and methodology
├── /privacy-policy - Privacy policy
├── /terms-conditions - Terms and conditions
```

### Program Pages
```
├── /incubation - Incubation program details
├── /mvp-lab - MVP Lab program
├── /inclab - INC Lab details
├── /hackathon - Hackathon events listing
├── /hackathon/:id - Individual hackathon details
├── /past-events - Historical events
```

### Application & User Pages
```
├── /login - User authentication
├── /register - User registration
├── /forgot-password - Password recovery
├── /all-applications - Application management
├── /program-details - Detailed program information
├── /consultation-booking - Schedule consultations
```

### Community & Resources
```
├── /startup-directory - Directory of startups
├── /startup-profile/:id - Individual startup profiles
├── /meet-cofounder - Co-founder matching
├── /investor-centre - Investor portal
├── /investor-profile/:id - Individual investor profiles
├── /resources - Learning resources
├── /deals - Available deals and offers
├── /blogs - Blog articles
├── /blog/:id - Individual blog posts
├── /news - News and updates
├── /success-stories - Success story showcase
├── /become-mentor - Mentor application
```

### Dashboard Pages
```
├── /startup-dashboard - Startup founder dashboard
├── /admin-dashboard - Administrator dashboard
├── /user-dashboard - General user dashboard
├── /cofounder-dashboard - Co-founder specific dashboard
```

### Utility & Support
```
├── /cloud-credits - Cloud credit information
├── /grants-funding - Funding and grants
├── /partnership - Partnership opportunities
├── /current-cohort - Current program cohort
├── /featured-startups - Featured startup showcase
├── /requirements - Co-founder requirements
```

## Component System

### Core Components
- **Navigation.tsx** - Main navigation with user authentication state
- **Footer.tsx** - Site footer with links and information
- **AuthButton.tsx** - Authentication status and controls
- **Breadcrumbs.tsx** - Navigation breadcrumbs (available but not yet implemented)

### Dialog Components
- **ApplicationDialog.tsx** - Application form modal
- **CofounderPostDialog.tsx** - Co-founder requirement posting
- **CofounderDetailsDialog.tsx** - Co-founder profile details
- **StartupProfileDialog.tsx** - Startup profile management
- **IncApplicationDialog.tsx** - Inc Combinator application
- **HackathonRegistrationDialog.tsx** - Event registration
- **ConsultationDialog.tsx** - Consultation booking
- **InvestmentApplicationDialog.tsx** - Investment applications
- **PitchSubmissionDialog.tsx** - Pitch deck submission

### Dashboard Components
```
src/components/dashboard/
├── AdminOverview.tsx - Admin dashboard overview
├── StartupOverview.tsx - Startup dashboard overview
├── ApplicationStatus.tsx - Application tracking
├── StartupManagement.tsx - Startup management tools
├── ApplicationManagement.tsx - Application oversight
├── InvestorManagement.tsx - Investor relationship management
└── InvestmentTable.tsx - Investment tracking table
```

### Form Components
```
src/components/incubation/
├── FounderInfoSection.tsx - Founder information forms
└── StartupInfoSection.tsx - Startup detail forms

src/components/hackathon/
├── PersonalInfoSection.tsx - Personal information
└── TechnicalSkillsSection.tsx - Technical skill assessment
```

## User Types & Dashboards

### 1. Startup Dashboard (`/startup-dashboard`)
**Target User:** Startup founders and teams
**Features:**
- Application status tracking
- Investment opportunity management
- Deal browsing and claiming
- Co-founder requirement posting
- Program overview and progress

### 2. Admin Dashboard (`/admin-dashboard`)
**Target User:** Inc Combinator administrators
**Features:**
- Startup portfolio management
- Application review and approval
- Investor relationship management
- Deal creation and management
- Content and analytics oversight
- User management across all types

### 3. User Dashboard (`/user-dashboard`)
**Target User:** General applicants and participants
**Features:**
- Application tracking across programs
- Event registration and management
- Co-founder opportunity browsing
- Learning resource access
- Community participation

### 4. Co-founder Dashboard (`/cofounder-dashboard`)
**Target User:** Professionals seeking co-founder opportunities
**Features:**
- Co-founder post management
- Application review and response
- Opportunity matching with AI scoring
- Profile analytics and performance
- Networking and communication tools

## Forms & Data Management

### Application Forms
- **Incubation Application** - Comprehensive startup application
- **Hackathon Registration** - Event participation
- **Co-founder Requirements** - Posting co-founder needs
- **Mentor Application** - Professional mentor onboarding
- **Investment Application** - Funding requests

### Form Features
- **Validation** - Zod schema validation
- **Multi-step Forms** - Complex applications broken into sections
- **Auto-save** - Draft functionality (requires Supabase)
- **File Upload** - Document and image handling
- **Real-time Updates** - Progress tracking

## Routing & Navigation

### Route Configuration
All routes are defined in `src/App.tsx` using React Router DOM v6:

```typescript
// Main application routes
<Route path="/" element={<Index />} />
<Route path="/startup-dashboard" element={<StartupDashboard />} />
<Route path="/admin-dashboard" element={<AdminDashboard />} />
<Route path="/user-dashboard" element={<UserDashboard />} />
<Route path="/cofounder-dashboard" element={<CofounderDashboard />} />

// Parameterized routes
<Route path="/hackathon/:id" element={<HackathonDetail />} />
<Route path="/startup-profile/:id" element={<StartupProfile />} />
<Route path="/investor-profile/:id" element={<InvestorProfile />} />
<Route path="/blog/:id" element={<BlogDetail />} />

// Catch-all route
<Route path="*" element={<NotFound />} />
```

### Navigation Patterns
- **Link Components** - React Router Link for internal navigation
- **Button Navigation** - Programmatic navigation with useNavigate
- **Breadcrumb Support** - Hierarchical navigation (component available)
- **Deep Linking** - All pages support direct URL access

## UI/UX Design System

### Color System
The project uses a semantic color system defined in `src/index.css`:

```css
:root {
  --background: 210 100% 98%;
  --foreground: 210 15% 10%;
  --primary: 211 100% 50%;
  --secondary: 210 20% 95%;
  --muted: 210 20% 95%;
  --accent: 210 20% 90%;
  --destructive: 0 84% 60%;
}
```

### Component Variants
- **Button Variants:** default, destructive, outline, secondary, ghost, link, hero
- **Card Styles:** card-gradient with border-border
- **Badge Types:** default, secondary, destructive, outline
- **Form Elements:** Consistent styling with error states

### Responsive Design
- **Mobile-first approach** with Tailwind CSS
- **Breakpoints:** sm, md, lg, xl, 2xl
- **Grid Systems:** CSS Grid and Flexbox
- **Adaptive layouts** for all dashboard types

## Development Guidelines

### Code Organization
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── dashboard/      # Dashboard-specific components
│   ├── incubation/     # Program-specific components
│   └── hackathon/      # Event-specific components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── assets/             # Static assets
```

### Component Guidelines
- **Single Responsibility** - One component, one purpose
- **Prop Typing** - TypeScript interfaces for all props
- **Error Boundaries** - Graceful error handling
- **Accessibility** - ARIA labels and keyboard navigation
- **Performance** - Lazy loading and code splitting where appropriate

### State Management Patterns
- **Local State** - useState for component-specific state
- **Form State** - React Hook Form for complex forms
- **Server State** - TanStack Query for API data
- **Global State** - Context API for authentication state

## Deployment & Integration

### Supabase Integration
The project has Supabase enabled for:
- **Authentication** - Email/password and social login
- **Database** - PostgreSQL with Row Level Security
- **Storage** - File uploads and management
- **Real-time** - Live updates and notifications

### Build & Deploy
```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables
```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Performance Optimization
- **Code Splitting** - Lazy loading of routes
- **Image Optimization** - WebP format and lazy loading
- **Bundle Analysis** - Regular bundle size monitoring
- **Caching** - Service worker implementation (planned)

## Future Enhancements

### Planned Features
1. **Real-time Chat** - Co-founder and mentor communication
2. **Video Calls** - Integrated consultation platform
3. **AI Matching** - Enhanced co-founder and opportunity matching
4. **Mobile App** - React Native implementation
5. **Analytics Dashboard** - Advanced metrics and insights
6. **Payment Integration** - Stripe for program fees
7. **Email Automation** - Automated communication workflows
8. **API Documentation** - Comprehensive API docs

### Technical Improvements
- **Testing Suite** - Jest and React Testing Library
- **Storybook** - Component documentation
- **Performance Monitoring** - Real user metrics
- **Security Audit** - Regular security assessments
- **Accessibility Audit** - WCAG compliance verification

---

## Version History
- **v1.0.0** - Initial platform with basic functionality
- **v1.1.0** - Added dashboard system and user management
- **v1.2.0** - Implemented co-founder matching platform
- **v1.3.0** - Enhanced forms and navigation system
- **v1.4.0** - Current version with comprehensive dashboards

For questions or contributions, please refer to the development team or create an issue in the project repository.
