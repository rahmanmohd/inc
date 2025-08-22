# Email Debugging Guide

## Issue: Confirmation Emails Not Being Received

After successfully submitting the partnership form, users are not receiving confirmation emails.

## Debugging Steps

### 1. **Check Browser Console**
- Open browser developer tools (F12)
- Go to Console tab
- Submit the partnership form
- Look for email-related logs:
  - "Sending confirmation email..."
  - "Email response: ..."
  - "Email sent successfully" or error messages

### 2. **Test Email Service Directly**
- Navigate to `/email-test` (if route is added) or use the EmailTest component
- Enter your email address
- Click "Send Test Email"
- Check console for detailed response

### 3. **Check Supabase Edge Function Logs**
- Go to Supabase Dashboard
- Navigate to Edge Functions
- Check logs for `send-hackathon-email` function
- Look for any errors or warnings

### 4. **Verify SendGrid Configuration**
- Check if SendGrid API key is properly configured
- Verify sender email is authenticated
- Check SendGrid dashboard for delivery status

### 5. **Common Email Issues**

#### **Spam Folder**
- Check spam/junk folder
- Add sender email to contacts
- Check email client settings

#### **SendGrid Configuration**
- API key might be invalid or expired
- Sender email not verified
- Rate limiting issues

#### **Supabase Edge Function**
- Function might be failing silently
- Environment variables not set
- CORS issues

## Current Implementation

### Email Service (`src/services/emailService.ts`)
- Uses Supabase Edge Function `send-hackathon-email`
- Sends partnership request emails via SendGrid
- Logs detailed responses for debugging

### Partnership Form (`src/components/PartnershipFormDialog.tsx`)
- Sends email after successful database insertion
- Shows different messages based on email success/failure
- Logs email response to console

### Email Template (`supabase/functions/send-hackathon-email/index.ts`)
- Has `partnership_request` template
- Uses SendGrid for delivery
- Includes fallback logging

## Testing Tools Created

### EmailTest Component (`src/components/EmailTest.tsx`)
- Standalone email testing component
- Sends test partnership request email
- Shows detailed success/error messages

### EmailTestPage (`src/pages/EmailTestPage.tsx`)
- Dedicated page for email testing
- Easy access to email debugging tools

## Next Steps

1. **Check browser console** when submitting partnership form
2. **Use EmailTest component** to test email service directly
3. **Check Supabase logs** for Edge Function errors
4. **Verify SendGrid configuration** in Supabase dashboard
5. **Test with different email addresses** to rule out spam filtering

## Expected Behavior

- Form submission should show success message
- Console should show "Email sent successfully"
- Confirmation email should arrive within 1-2 minutes
- Check spam folder if email doesn't appear in inbox

## Troubleshooting Commands

```bash
# Check Supabase Edge Function logs
npx supabase functions logs send-hackathon-email

# Deploy Edge Function if needed
npx supabase functions deploy send-hackathon-email

# Check function status
npx supabase functions list
```
