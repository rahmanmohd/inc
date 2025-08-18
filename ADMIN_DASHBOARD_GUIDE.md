# Admin Dashboard Guide

## Overview

The Admin Dashboard provides comprehensive functionality for managing all user applications and submissions. It includes real-time notifications, application review capabilities, and automated email notifications.

## Features

### 🎯 Core Features

1. **Real-time Application Management**
   - View all applications from all forms
   - Filter by application type and status
   - Search by applicant name, startup, or email
   - Real-time updates every 30 seconds

2. **Application Review System**
   - Review application details
   - Approve or reject applications
   - Add admin notes and feedback
   - Track review history

3. **Automated Notifications**
   - Email notifications to users on status changes
   - Admin notifications for new applications
   - Activity logging for all admin actions

4. **Dashboard Analytics**
   - Total applications count
   - Pending applications count
   - Approved/rejected applications count
   - Total users count

### 📊 Dashboard Statistics

The admin dashboard displays key metrics:

- **Total Applications**: All-time submissions across all forms
- **Pending Review**: Applications awaiting admin review
- **Approved**: Successfully approved applications
- **Total Users**: Registered users in the system

### 🔍 Application Management

#### Viewing Applications
- All applications are displayed in a comprehensive table
- Applications are automatically categorized by type
- Status badges show current application state
- Submission dates are clearly displayed

#### Filtering & Search
- **Type Filter**: Filter by application type (Incubation, MVP Lab, Investment, etc.)
- **Status Filter**: Filter by status (Pending, Approved, Rejected, Under Review)
- **Search**: Search by applicant name, startup name, or email address

#### Application Review Process
1. **View Details**: Click the eye icon to view full application details
2. **Add Notes**: Include admin notes and feedback
3. **Take Action**: Approve or reject the application
4. **Email Notification**: User automatically receives status update email

### 📧 Email Notifications

#### Status Update Emails
When an admin approves or rejects an application, the user receives an automated email containing:

- Application status update
- Admin notes and feedback
- Next steps information
- Contact information for follow-up

#### Email Templates
The system uses different email templates for:
- Application approval
- Application rejection
- Status updates with notes
- General notifications

### 🔐 Security & Access Control

#### Admin Authentication
- Only users with `admin` role can access the dashboard
- Secure route protection with `RequireAdmin` component
- Session-based authentication

#### Row Level Security (RLS)
- All admin tables have RLS policies
- Only admin users can view and modify admin data
- Secure access to application data

### 🗄️ Database Structure

#### Admin Tables
1. **admin_notifications**: Stores admin notifications
2. **admin_activity_log**: Tracks all admin actions
3. **Application tables**: Enhanced with admin fields

#### Admin Fields Added
- `admin_notes`: Text field for admin feedback
- `reviewed_by`: UUID reference to admin user
- `reviewed_at`: Timestamp of review
- `status`: Application status tracking

### 🚀 API Integration

#### Admin API Methods
```typescript
// Get all applications
apiService.getAllApplications()

// Get dashboard statistics
apiService.getAdminDashboardStats()

// Update application status
apiService.updateApplicationStatus(applicationId, status, notes)
```

#### Edge Functions
- **admin-notifications**: Handles admin notifications and status updates
- **send-hackathon-email**: Sends email notifications

### 📱 Real-time Features

#### Auto-refresh
- Dashboard refreshes every 30 seconds
- New applications appear automatically
- Status changes update in real-time

#### Notifications
- Automatic notifications for new applications
- Email notifications for status changes
- Activity logging for audit trail

### 🎨 UI/UX Features

#### Responsive Design
- Mobile-friendly interface
- Responsive table layout
- Adaptive filtering system

#### Visual Indicators
- Color-coded status badges
- Loading states for actions
- Success/error notifications
- Progress indicators

#### Accessibility
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support

## Implementation Details

### Frontend Components

1. **AdminDashboard.tsx**: Main dashboard component
2. **RequireAdmin.tsx**: Route protection component
3. **AdminApplicationReview.tsx**: Application review dialog

### Backend Services

1. **apiService.ts**: Admin API methods
2. **emailService.ts**: Email notification service
3. **admin-notifications**: Supabase Edge Function

### Database Migrations

1. **20241215000004_admin_tables.sql**: Admin tables and triggers

## Usage Instructions

### Accessing the Dashboard
1. Log in as an admin user
2. Navigate to `/admin-dashboard`
3. Dashboard loads automatically with latest data

### Reviewing Applications
1. Click the eye icon to view application details
2. Review all application information
3. Add admin notes if needed
4. Click "Approve" or "Reject" button
5. User receives email notification automatically

### Managing Notifications
1. View unread notifications in the dashboard
2. Mark notifications as read
3. Filter notifications by type and priority

### Generating Reports
1. Use dashboard statistics for reporting
2. Export application data as needed
3. Track application trends over time

## Best Practices

### Application Review
- Always add meaningful admin notes
- Review applications within 48 hours
- Provide constructive feedback
- Follow consistent approval criteria

### Communication
- Use clear, professional language in notes
- Provide actionable feedback
- Include next steps when rejecting
- Maintain professional tone in emails

### Security
- Never share admin credentials
- Log out after each session
- Review activity logs regularly
- Report suspicious activity

## Troubleshooting

### Common Issues

1. **Dashboard not loading**
   - Check admin authentication
   - Verify database connection
   - Clear browser cache

2. **Applications not updating**
   - Check real-time refresh settings
   - Verify API endpoints
   - Check network connectivity

3. **Email notifications failing**
   - Verify SendGrid API key
   - Check email service configuration
   - Review email templates

### Support

For technical support:
1. Check application logs
2. Review error messages
3. Contact system administrator
4. Check Supabase dashboard for issues

## Future Enhancements

### Planned Features
- Advanced analytics dashboard
- Bulk application processing
- Custom email templates
- Application export functionality
- Advanced filtering options
- Dashboard customization
- Mobile app support

### Performance Optimizations
- Database query optimization
- Caching strategies
- Lazy loading implementation
- Image optimization
- CDN integration

---

This admin dashboard provides a comprehensive solution for managing all user applications with real-time updates, automated notifications, and secure access control.
