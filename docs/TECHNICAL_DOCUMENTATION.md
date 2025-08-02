
# Inc Combinator - Technical Documentation

## Project Overview
Inc Combinator is a comprehensive startup incubator platform built with React, TypeScript, and Tailwind CSS. The platform provides various programs for entrepreneurs including hackathons, incubation programs, MVP labs, and co-founder matching services.

## Architecture

### Frontend Stack
- **Framework**: React 18 with TypeScript
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Query (@tanstack/react-query)
- **UI Components**: Custom components built on Radix UI primitives
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (buttons, cards, etc.)
│   ├── dashboard/      # Dashboard-specific components
│   └── *.tsx           # Feature-specific components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── assets/             # Static assets
```

## Pages and Routes

### Public Pages
- `/` - Homepage with hero section and program overview
- `/hackathon` - Hackathon program details and registration
- `/incubation` - 16-week incubation program information
- `/mvp-lab` - 8-week MVP development program
- `/inclab` - Deep innovation program details
- `/resources` - Learning resources and tools
- `/partnership` - Partnership opportunities and application
- `/about` - About Inc Combinator and team
- `/contact` - Contact information and form
- `/startup-directory` - Directory of startups in the ecosystem
- `/startup-profile` - Individual startup profile page
- `/deals` - Available deals and benefits for startups
- `/blogs` - Blog posts and articles
- `/blog/:id` - Individual blog post
- `/news` - Latest news and updates
- `/meet-cofounder` - Co-founder matching platform
- `/investor-centre` - Investor portal and information
- `/current-cohort` - Information about current cohort
- `/featured-startups` - Showcase of featured startups
- `/philosophy` - Inc Combinator's philosophy and approach
- `/success-stories` - Success stories and case studies
- `/all-applications` - Application status and management
- `/privacy-policy` - Privacy policy
- `/terms-conditions` - Terms and conditions

### Dashboard Pages
- `/startup-dashboard` - Startup founder dashboard
- `/admin-dashboard` - Administrative dashboard

## Key Features

### Application System
- Multi-step application forms for different programs
- Form validation using React Hook Form and Zod
- Dialog-based application flows

### Dashboard System
- **Startup Dashboard**: Application tracking, deal management, co-founder posting
- **Admin Dashboard**: Startup management, application review, content management

### Co-founder Matching
- Post co-founder requirements
- Browse available co-founders
- Application management system

### Content Management
- Blog system with detailed pages
- News section
- Resource library

## Components Architecture

### Dialog Components
- `ApplicationDialog` - General application form
- `HackathonRegistrationDialog` - Hackathon-specific registration
- `CofounderPostDialog` - Co-founder requirement posting
- `InvestmentApplicationDialog` - Investment application form
- `ConsultationDialog` - Schedule consultation meetings
- `PitchSubmissionDialog` - Pitch deck submission

### Dashboard Components
- `AdminOverview` - Admin dashboard overview with statistics
- `StartupOverview` - Startup dashboard overview
- `ApplicationStatus` - Application tracking component
- `InvestmentTable` - Investment applications table
- `StartupManagement` - Admin startup management
- `ApplicationManagement` - Admin application review
- `InvestorManagement` - Admin investor management

### Form Components
- `HackathonRegistrationForm` - Multi-step hackathon registration
- `IncubationApplicationForm` - Incubation program application
- Various section components for form organization

## Styling System

### Design Tokens
- Custom CSS variables defined in `index.css`
- Tailwind configuration with custom colors and utilities
- Responsive design patterns
- Dark/light mode support preparation

### Custom Utilities
- `bg-hero-gradient` - Hero section gradient background
- `bg-card-gradient` - Card gradient backgrounds
- `shadow-orange-glow` - Orange glow effect for hover states
- Animation utilities for fade-in effects

## State Management

### React Query
- API data fetching and caching
- Server state synchronization
- Loading and error state management

### Local State
- Form state managed by React Hook Form
- UI state (modals, tabs) managed by local useState
- Navigation state handled by React Router

## Authentication (To Be Implemented)
The platform is designed to support multiple user types:
- **Startup Founders**: Access to startup dashboard, applications, co-founder matching
- **Investors**: Access to investor centre, startup directory, investment opportunities  
- **Admins**: Full platform management capabilities
- **Mentors**: Access to mentor resources and startup connections

*Note: Authentication implementation requires Supabase integration*

## Form Validation
- Zod schemas for type-safe validation
- React Hook Form integration
- Real-time validation feedback
- Multi-step form support

## Responsive Design
- Mobile-first approach
- Breakpoint system: sm, md, lg, xl, 2xl
- Flexible grid layouts
- Touch-friendly interface elements

## Performance Optimizations
- Code splitting by routes
- Lazy loading of dialog components
- Optimized image handling
- Minimal bundle size with tree shaking

## Development Guidelines

### Component Creation
- Use TypeScript for all components
- Follow the existing naming conventions
- Implement proper prop typing
- Include error boundaries where appropriate

### Styling Guidelines
- Use Tailwind classes exclusively
- Follow the design system tokens
- Implement responsive design patterns
- Test across different screen sizes

### State Management
- Use React Query for server state
- Keep local state minimal and focused
- Implement proper error handling
- Follow React best practices

## Future Enhancements
- Real-time notifications
- Advanced search and filtering
- Payment integration
- Mobile application
- API integrations with third-party services
- Advanced analytics dashboard
- Automated matching algorithms

## Deployment
- Built with Vite for optimal production builds
- Static file generation
- Environment variable configuration
- CDN-ready asset optimization

This documentation provides a comprehensive overview of the Inc Combinator platform architecture and implementation details.
