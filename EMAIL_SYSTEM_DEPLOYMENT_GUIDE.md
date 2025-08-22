# 📧 Email Notification System Deployment Guide

This guide will help you deploy the automatic email notification system for hackathon registrations and status updates using SendGrid.

## 🚀 **Prerequisites**

- Supabase project with Edge Functions enabled
- SendGrid account with API key
- Supabase CLI installed (optional - can use Dashboard)
- Access to Supabase dashboard

## 📋 **Step 1: Set Up SendGrid**

### 1.1 Create SendGrid Account
1. Go to [SendGrid.com](https://sendgrid.com) and create an account
2. Verify your sender email address
3. Generate an API key with "Mail Send" permissions

### 1.2 Get SendGrid API Key
- Go to **Settings → API Keys**
- Click **Create API Key**
- Name it: `Inc Combinator Email Service`
- Select **Restricted Access** and choose **Mail Send**
- Copy the generated API key

## 📋 **Step 2: Deploy the Edge Function**

### 2.1 Via Supabase Dashboard (Recommended)
1. Go to your **Supabase Dashboard**
2. Navigate to **Edge Functions**
3. Click **Create a new function**
4. Name it: `email-service`
5. Copy the code from `supabase/functions/email-service/index.ts`
6. Click **Deploy**

### 2.2 Via Supabase CLI (Alternative)
```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Deploy the function
supabase functions deploy email-service
```

## ⚙️ **Step 3: Configure Environment Variables**

### 3.1 Set Edge Function Environment Variables
In your **Supabase Dashboard → Edge Functions → email-service → Settings**:

```env
SENDGRID_API_KEY=your_sendgrid_api_key_here
FROM_EMAIL=muteeurrahmanmohammed@gmail.com
```

### 3.2 Set Frontend Environment Variables
In your `.env.local` file:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## 🗄️ **Step 4: Create Database Tables**

### 4.1 Run the email logs migration
Go to your **Supabase Dashboard → SQL Editor** and run:

```sql
-- Create email_logs table for tracking email activities
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient TEXT NOT NULL,
  type TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  error_message TEXT,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_email_logs_recipient ON email_logs(recipient);
CREATE INDEX IF NOT EXISTS idx_email_logs_type ON email_logs(type);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON email_logs(sent_at);

-- Add RLS policies
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view email logs
CREATE POLICY "Admins can view email logs" ON email_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Only service role can insert/update email logs
CREATE POLICY "Service role can manage email logs" ON email_logs
  FOR ALL USING (auth.role() = 'service_role');
```

## 🔐 **Step 5: Configure RLS Policies**

### 5.1 Ensure hackathons table has proper policies
Run this SQL to verify/fix RLS policies:

```sql
-- Fix the RLS policies for hackathons table
DROP POLICY IF EXISTS "Public can view published hackathons" ON hackathons;
DROP POLICY IF EXISTS "Users can view their own hackathons" ON hackathons;
DROP POLICY IF EXISTS "Users can manage their own hackathons" ON hackathons;

-- Create correct policies
-- Policy for public to view published hackathons
CREATE POLICY "Public can view published hackathons" ON hackathons
  FOR SELECT USING (published = true);

-- Policy for users to view their own hackathons
CREATE POLICY "Users can view their own hackathons" ON hackathons
  FOR SELECT USING (auth.uid() = created_by);

-- Policy for users to manage their own hackathons
CREATE POLICY "Users can manage their own hackathons" ON hackathons
  FOR ALL USING (auth.uid() = created_by);
```

## 🧪 **Step 6: Test the System**

### 6.1 Test Registration Email
1. Go to your hackathon page (`/hackathon`)
2. Click "Register for Next Hackathon"
3. Fill out and submit the form
4. Check your email for confirmation
5. Check **Admin Dashboard → Emails** tab for email logs

### 6.2 Test Status Update Email
1. Go to **Admin Dashboard → Hackathons**
2. Click "View Applications" on any hackathon
3. Change an application status
4. Check the user's email for status update
5. Check email logs in admin dashboard

## 🔍 **Step 7: Monitor and Debug**

### 7.1 Check Email Logs
- Go to **Admin Dashboard → Emails** tab
- View all email activities
- Monitor success/failure rates
- Check error messages for failed emails

### 7.2 Edge Function Logs
- Go to **Supabase Dashboard → Edge Functions → email-service**
- Click on "Logs" to see function execution logs
- Monitor for any errors or issues

### 7.3 SendGrid Dashboard
- Check **SendGrid Dashboard → Activity** for email delivery status
- Monitor bounce rates and spam reports
- Check API usage and limits

## 🚨 **Troubleshooting**

### Common Issues and Solutions

#### Issue 1: Emails not sending
**Symptoms:** Registration succeeds but no email received
**Solutions:**
- Check Edge Function logs for errors
- Verify SendGrid API key is correct
- Check if FROM_EMAIL is verified in SendGrid
- Ensure SendGrid account is active

#### Issue 2: SendGrid API errors
**Symptoms:** 401, 403, or other API errors
**Solutions:**
- Verify API key has "Mail Send" permissions
- Check if API key is correct
- Ensure SendGrid account is not suspended
- Check API usage limits

#### Issue 3: Edge Function deployment fails
**Symptoms:** `supabase functions deploy` command fails
**Solutions:**
- Ensure Supabase CLI is up to date
- Check if you're logged in to Supabase CLI
- Verify project reference is correct
- Use Dashboard method as alternative

#### Issue 4: RLS policy errors
**Symptoms:** Database permission denied errors
**Solutions:**
- Run the RLS policy SQL commands
- Ensure user has proper role in profiles table
- Check if RLS is enabled on tables

#### Issue 5: Email logs not showing
**Symptoms:** Admin can't see email logs
**Solutions:**
- Verify admin role in profiles table
- Check RLS policies on email_logs table
- Ensure EmailLogsView component is properly imported

## 📊 **Monitoring and Analytics**

### Email Statistics
The system automatically tracks:
- Total emails sent
- Success/failure rates
- Email types (registration, status update)
- Delivery timestamps
- Error messages for failed emails

### SendGrid Analytics
- Email delivery rates
- Bounce rates
- Spam reports
- Geographic delivery data
- Device and client statistics

### Performance Metrics
- Email delivery time
- Success rate percentage
- Most common failure reasons
- Peak usage times

## 🔒 **Security Considerations**

### Data Protection
- Email logs are only visible to admins
- SendGrid API key should be kept secure
- RLS policies prevent unauthorized access
- Email content is sanitized and validated

### Rate Limiting
- SendGrid has built-in rate limiting
- Monitor for spam/abuse patterns
- Set reasonable limits per user per day
- Implement exponential backoff for retries

## 📈 **Scaling Considerations**

### For High Volume
- SendGrid handles high volume automatically
- Consider implementing email queuing system
- Add retry logic for failed emails
- Monitor SendGrid quotas and upgrade if needed

### Performance Optimization
- Batch email sending when possible
- Use async/await for non-blocking operations
- Implement email templates caching
- Monitor Edge Function execution times

## 🎯 **Best Practices**

### Email Content
- Keep emails concise and actionable
- Use clear subject lines
- Include relevant hackathon details
- Provide next steps for users

### Error Handling
- Never fail registration if email fails
- Log all email errors for debugging
- Provide fallback notifications
- Implement retry mechanisms

### User Experience
- Send immediate confirmation emails
- Include relevant links and information
- Use consistent branding and styling
- Provide clear call-to-action buttons

## 📞 **Support and Maintenance**

### Regular Maintenance
- Monitor email delivery rates
- Check for failed email patterns
- Update email templates as needed
- Review and optimize RLS policies

### Updates and Upgrades
- Keep Edge Functions updated
- Monitor Supabase platform updates
- Test email system after major changes
- Backup email templates and configurations

### SendGrid Maintenance
- Monitor account health
- Check for API changes
- Review email deliverability reports
- Update sender authentication if needed

---

## 🎉 **Congratulations!**

Your email notification system is now fully deployed and operational with SendGrid integration. Users will receive automatic emails for:

✅ **Hackathon Registration Confirmations**  
✅ **Application Status Updates**  
✅ **Admin Notifications**  

The system includes:
- Professional HTML email templates
- SendGrid integration for reliable delivery
- Comprehensive logging and monitoring
- Error handling and fallback mechanisms
- Admin dashboard for email management

## 🔗 **Useful Links**

- [SendGrid Documentation](https://docs.sendgrid.com/)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Email Template Best Practices](https://sendgrid.com/blog/email-template-best-practices/)

For any issues or questions, check the troubleshooting section above or refer to the SendGrid and Supabase documentation.
