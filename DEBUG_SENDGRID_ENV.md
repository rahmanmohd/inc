# Debug SendGrid Environment Variables

## Issue
The SendGrid API key is still showing a 401 error even after setting it in Supabase secrets. Let's debug this step by step.

## Possible Issues

1. **Environment variable not set correctly**: The secret might not be named exactly `SENDGRID_API_KEY`
2. **Function not redeployed**: The function might still be using old code
3. **Invalid API key**: The new API key might also be invalid
4. **Permissions**: The API key might not have email sending permissions

## Debug Steps

### Step 1: Test with Enhanced Logging
Run this command to get detailed environment variable information:

```bash
curl -X POST https://ysxtcljsclkoatngtihl.supabase.co/functions/v1/send-hackathon-email \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzeHRjbGpzY2xrb2F0bmd0aWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4NDE5NjYsImV4cCI6MjA3MDQxNzk2Nn0.TLkkrBzwj6g6vQ-Hh52qBvRjYvAnHRTExf2CR2WqtIY" \
  -d '{
    "type": "incubation_application",
    "email": "tauqeermohd123580@gmail.com",
    "name": "Debug Test",
    "formData": {"founderName": "Debug Test"}
  }'
```

Look for the environment variable debug information in the Supabase logs.

### Step 2: Check Supabase Dashboard
1. Go to your Supabase dashboard
2. Navigate to Edge Functions
3. Click on `send-hackathon-email`
4. Check the "Settings" or "Secrets" section
5. Verify that `SENDGRID_API_KEY` and `FROM_EMAIL` are set

### Step 3: Verify SendGrid API Key
To test if your SendGrid API key is valid, you can test it directly:

```bash
curl -X POST https://api.sendgrid.com/v3/mail/send \
  -H "Authorization: Bearer YOUR_SENDGRID_API_KEY_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "personalizations": [{"to": [{"email": "tauqeermohd123580@gmail.com"}]}],
    "from": {"email": "muteeurrahmanmohammed@gmail.com"},
    "subject": "Test",
    "content": [{"type": "text/plain", "value": "Test email"}]
  }'
```

Replace `YOUR_SENDGRID_API_KEY_HERE` with your actual API key.

### Step 4: Common Solutions

1. **Redeploy the function** (if you haven't already):
   ```bash
   npx supabase functions deploy send-hackathon-email
   ```

2. **Check secret names** in Supabase dashboard - they must be exactly:
   - `SENDGRID_API_KEY`
   - `FROM_EMAIL`

3. **Verify sender email** in SendGrid:
   - Go to SendGrid dashboard
   - Check "Sender Authentication"
   - Ensure `muteeurrahmanmohammed@gmail.com` is verified

4. **Check API key permissions** in SendGrid:
   - Go to SendGrid dashboard
   - Check "API Keys"
   - Ensure the key has "Mail Send" permissions

## Next Steps

1. Run the debug test command
2. Check the logs in Supabase dashboard
3. Share the environment variable debug output
4. Verify the SendGrid settings

This will help us identify exactly what's going wrong!
