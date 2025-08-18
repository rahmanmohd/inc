# Test Case for Email Edge Function

## Overview
This document provides test cases to manually verify the `send-hackathon-email` Edge Function is working correctly.

## Test Environment
- **Function URL**: `https://ysxtcljsclkoatngtihl.supabase.co/functions/v1/send-hackathon-email`
- **SendGrid API Key**: `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`
- **Sender Email**: `muteeurrahmanmohammed@gmail.com`

## Test Cases

### Test Case 1: Incubation Application Email
**Purpose**: Test the incubation application email template

**Request**:
```bash
curl -X POST https://ysxtcljsclkoatngtihl.supabase.co/functions/v1/send-hackathon-email \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzeHRjbGpzY2xrb2F0bmd0aWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4NDE5NjYsImV4cCI6MjA3MDQxNzk2Nn0.TLkkrBzwj6g6vQ-Hh52qBvRjYvAnHRTExf2CR2WqtIY" \
  -d '{
    "type": "incubation_application",
    "email": "test@example.com",
    "name": "John Doe",
    "formData": {
      "founderName": "John Doe",
      "startupName": "Test Startup",
      "email": "test@example.com",
      "phone": "1234567890",
      "linkedIn": "https://linkedin.com/in/johndoe",
      "industry": "Technology",
      "stage": "Idea Stage",
      "website": "https://teststartup.com"
    }
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "message": "Email sent successfully",
  "type": "incubation_application",
  "recipient": "test@example.com",
  "sent_at": "2024-12-15T..."
}
```

### Test Case 2: Hackathon Registration Email
**Purpose**: Test the hackathon registration email template

**Request**:
```bash
curl -X POST https://ysxtcljsclkoatngtihl.supabase.co/functions/v1/send-hackathon-email \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzeHRjbGpzY2xrb2F0bmd0aWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4NDE5NjYsImV4cCI6MjA3MDQxNzk2Nn0.TLkkrBzwj6g6vQ-Hh52qBvRjYvAnHRTExf2CR2WqtIY" \
  -d '{
    "type": "hackathon_registration",
    "email": "test@example.com",
    "name": "Jane Smith",
    "formData": {
      "full_name": "Jane Smith",
      "email": "test@example.com",
      "phone": "9876543210",
      "city": "New York",
      "college": "MIT",
      "graduation": "2025",
      "programming_languages": "JavaScript, Python, React",
      "experience": "2 years",
      "frameworks": "React, Node.js, Django",
      "specialization": "Full Stack Development"
    }
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "message": "Email sent successfully",
  "type": "hackathon_registration",
  "recipient": "test@example.com",
  "sent_at": "2024-12-15T..."
}
```

### Test Case 3: Investment Application Email
**Purpose**: Test the investment application email template

**Request**:
```bash
curl -X POST https://ysxtcljsclkoatngtihl.supabase.co/functions/v1/send-hackathon-email \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzeHRjbGpzY2xrb2F0bmd0aWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4NDE5NjYsImV4cCI6MjA3MDQxNzk2Nn0.TLkkrBzwj6g6vQ-Hh52qBvRjYvAnHRTExf2CR2WqtIY" \
  -d '{
    "type": "investment_application",
    "email": "test@example.com",
    "name": "Alice Johnson",
    "formData": {
      "founderName": "Alice Johnson",
      "startupName": "Innovation Labs",
      "email": "test@example.com",
      "phone": "5551234567",
      "industry": "Healthcare",
      "stage": "Seed Stage",
      "fundingAmount": "$500,000",
      "website": "https://innovationlabs.com"
    }
  }'
```

### Test Case 4: Mentor Application Email
**Purpose**: Test the mentor application email template

**Request**:
```bash
curl -X POST https://ysxtcljsclkoatngtihl.supabase.co/functions/v1/send-hackathon-email \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzeHRjbGpzY2xrb2F0bmd0aWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4NDE5NjYsImV4cCI6MjA3MDQxNzk2Nn0.TLkkrBzwj6g6vQ-Hh52qBvRjYvAnHRTExf2CR2WqtIY" \
  -d '{
    "type": "mentor_application",
    "email": "test@example.com",
    "name": "Dr. Robert Chen",
    "formData": {
      "fullName": "Dr. Robert Chen",
      "email": "test@example.com",
      "phone": "5559876543",
      "company": "Tech Ventures Inc",
      "position": "CTO",
      "expertiseAreas": "AI/ML, Product Strategy, Fundraising",
      "experience": "15 years",
      "linkedin": "https://linkedin.com/in/robertchen"
    }
  }'
```

### Test Case 5: Consultation Request Email
**Purpose**: Test the consultation request email template

**Request**:
```bash
curl -X POST https://ysxtcljsclkoatngtihl.supabase.co/functions/v1/send-hackathon-email \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzeHRjbGpzY2xrb2F0bmd0aWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4NDE5NjYsImV4cCI6MjA3MDQxNzk2Nn0.TLkkrBzwj6g6vQ-Hh52qBvRjYvAnHRTExf2CR2WqtIY" \
  -d '{
    "type": "consultation_request",
    "email": "test@example.com",
    "name": "Sarah Wilson",
    "formData": {
      "name": "Sarah Wilson",
      "email": "test@example.com",
      "phone": "5554567890",
      "company": "StartupXYZ",
      "startupStage": "MVP Stage",
      "consultationType": "Business Strategy",
      "preferredDate": "2024-12-20",
      "preferredTime": "2:00 PM",
      "description": "Need guidance on scaling our SaaS product"
    }
  }'
```

### Test Case 6: Contact Form Email
**Purpose**: Test the contact form email template

**Request**:
```bash
curl -X POST https://ysxtcljsclkoatngtihl.supabase.co/functions/v1/send-hackathon-email \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzeHRjbGpzY2xrb2F0bmd0aWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4NDE5NjYsImV4cCI6MjA3MDQxNzk2Nn0.TLkkrBzwj6g6vQ-Hh52qBvRjYvAnHRTExf2CR2WqtIY" \
  -d '{
    "type": "contact_form",
    "email": "test@example.com",
    "name": "Michael Brown",
    "formData": {
      "firstName": "Michael",
      "lastName": "Brown",
      "email": "test@example.com",
      "phone": "5557890123",
      "company": "Brown Enterprises",
      "inquiryType": "Partnership",
      "subject": "Business Partnership Inquiry",
      "message": "Interested in exploring partnership opportunities"
    }
  }'
```

### Test Case 7: Program Application Email
**Purpose**: Test the program application email template

**Request**:
```bash
curl -X POST https://ysxtcljsclkoatngtihl.supabase.co/functions/v1/send-hackathon-email \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzeHRjbGpzY2xrb2F0bmd0aWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4NDE5NjYsImV4cCI6MjA3MDQxNzk2Nn0.TLkkrBzwj6g6vQ-Hh52qBvRjYvAnHRTExf2CR2WqtIY" \
  -d '{
    "type": "program_application",
    "email": "test@example.com",
    "name": "David Lee",
    "formData": {
      "founderName": "David Lee",
      "email": "test@example.com",
      "phone": "5553210987",
      "company": "Lee Innovations",
      "industry": "Fintech",
      "stage": "Growth Stage",
      "website": "https://leeinnovations.com"
    }
  }'
```

### Test Case 8: Grant Application Email
**Purpose**: Test the grant application email template

**Request**:
```bash
curl -X POST https://ysxtcljsclkoatngtihl.supabase.co/functions/v1/send-hackathon-email \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzeHRjbGpzY2xrb2F0bmd0aWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4NDE5NjYsImV4cCI6MjA3MDQxNzk2Nn0.TLkkrBzwj6g6vQ-Hh52qBvRjYvAnHRTExf2CR2WqtIY" \
  -d '{
    "type": "grant_application",
    "email": "test@example.com",
    "name": "Emily Davis",
    "formData": {
      "founderName": "Emily Davis",
      "email": "test@example.com",
      "phone": "5556543210",
      "startupName": "GreenTech Solutions",
      "industry": "Clean Energy",
      "grantAmount": "$100,000",
      "purpose": "R&D for renewable energy technology",
      "website": "https://greentechsolutions.com"
    }
  }'
```

### Test Case 9: Partnership Request Email
**Purpose**: Test the partnership request email template

**Request**:
```bash
curl -X POST https://ysxtcljsclkoatngtihl.supabase.co/functions/v1/send-hackathon-email \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzeHRjbGpzY2xrb2F0bmd0aWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4NDE5NjYsImV4cCI6MjA3MDQxNzk2Nn0.TLkkrBzwj6g6vQ-Hh52qBvRjYvAnHRTExf2CR2WqtIY" \
  -d '{
    "type": "partnership_request",
    "email": "test@example.com",
    "name": "Lisa Anderson",
    "formData": {
      "contactName": "Lisa Anderson",
      "email": "test@example.com",
      "phone": "5558765432",
      "company": "Anderson Corp",
      "partnershipType": "Strategic Partnership",
      "industry": "Manufacturing",
      "proposal": "Joint venture for sustainable manufacturing",
      "website": "https://andersoncorp.com"
    }
  }'
```

### Test Case 10: Registration Email
**Purpose**: Test the registration email template

**Request**:
```bash
curl -X POST https://ysxtcljsclkoatngtihl.supabase.co/functions/v1/send-hackathon-email \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzeHRjbGpzY2xrb2F0bmd0aWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4NDE5NjYsImV4cCI6MjA3MDQxNzk2Nn0.TLkkrBzwj6g6vQ-Hh52qBvRjYvAnHRTExf2CR2WqtIY" \
  -d '{
    "type": "registration",
    "email": "test@example.com",
    "name": "Tom Wilson",
    "formData": {
      "firstName": "Tom",
      "lastName": "Wilson",
      "email": "test@example.com",
      "phone": "5552345678",
      "company": "Wilson Tech",
      "userType": "Entrepreneur",
      "bio": "Passionate about building innovative solutions"
    }
  }'
```

## Error Test Cases

### Test Case 11: Invalid Email Type
**Purpose**: Test error handling for invalid email type

**Request**:
```bash
curl -X POST https://ysxtcljsclkoatngtihl.supabase.co/functions/v1/send-hackathon-email \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzeHRjbGpzY2xrb2F0bmd0aWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4NDE5NjYsImV4cCI6MjA3MDQxNzk2Nn0.TLkkrBzwj6g6vQ-Hh52qBvRjYvAnHRTExf2CR2WqtIY" \
  -d '{
    "type": "invalid_type",
    "email": "test@example.com"
  }'
```

**Expected Response**:
```json
{
  "success": false,
  "error": "Template 'invalid_type' not found"
}
```

### Test Case 12: Missing Required Fields
**Purpose**: Test error handling for missing required fields

**Request**:
```bash
curl -X POST https://ysxtcljsclkoatngtihl.supabase.co/functions/v1/send-hackathon-email \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzeHRjbGpzY2xrb2F0bmd0aWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4NDE5NjYsImV4cCI6MjA3MDQxNzk2Nn0.TLkkrBzwj6g6vQ-Hh52qBvRjYvAnHRTExf2CR2WqtIY" \
  -d '{
    "type": "incubation_application"
  }'
```

**Expected Response**:
```json
{
  "success": false,
  "error": "Missing required fields: type and email"
}
```

## Testing Instructions

1. **Replace Email Address**: In all test cases, replace `test@example.com` with your actual email address to receive the test emails.

2. **Use Postman or curl**: You can use either Postman (GUI) or curl (command line) to execute these tests.

3. **Check Email Delivery**: After each successful test, check your email inbox (and spam folder) for the confirmation email.

4. **Verify Email Content**: Ensure the email contains:
   - Correct subject line
   - Proper HTML formatting
   - All form data displayed correctly
   - Working links (if any)

5. **Check Response**: Verify that the API response matches the expected format.

## Troubleshooting

### If emails are not received:
1. Check spam/junk folder
2. Verify SendGrid API key is valid
3. Check Supabase function logs for errors
4. Ensure sender email is verified in SendGrid

### If API returns 500 error:
1. Check function logs in Supabase dashboard
2. Verify request format matches expected schema
3. Ensure all required fields are provided

### If API returns 401 error:
1. Verify the Authorization Bearer token is correct
2. Check if the token has expired

## Success Criteria

A test is considered successful if:
- ✅ API returns `200` status code
- ✅ Response contains `"success": true`
- ✅ Email is received in the specified email address
- ✅ Email content matches the template format
- ✅ All form data is displayed correctly in the email

## Notes

- The function includes fallback logging if SendGrid fails
- All emails are sent from `muteeurrahmanmohammed@gmail.com`
- Email templates include responsive HTML design
- Each email type has a unique subject line and styling
