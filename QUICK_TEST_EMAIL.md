# Quick Email Test for Debugging

## Test Command
Run this command to test the email function with enhanced logging:

```bash
curl -X POST https://ysxtcljsclkoatngtihl.supabase.co/functions/v1/send-hackathon-email \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzeHRjbGpzY2xrb2F0bmd0aWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4NDE5NjYsImV4cCI6MjA3MDQxNzk2Nn0.TLkkrBzwj6g6vQ-Hh52qBvRjYvAnHRTExf2CR2WqtIY" \
  -d '{
    "type": "incubation_application",
    "email": "tauqeermohd123580@gmail.com",
    "name": "Test User",
    "formData": {
      "founderName": "Test User",
      "startupName": "Test Startup",
      "email": "tauqeermohd123580@gmail.com",
      "phone": "1234567890",
      "industry": "Technology",
      "stage": "Idea Stage"
    }
  }'
```

## What to Check

After running this test:

1. **Check the API Response** - It should now include the specific SendGrid error message
2. **Check Supabase Logs** - Go to your Supabase dashboard and check the function logs for detailed error information
3. **Common SendGrid Issues**:
   - API key might be invalid or expired
   - Sender email (`muteeurrahmanmohammed@gmail.com`) might not be verified in SendGrid
   - SendGrid account might have restrictions

## Next Steps

Once we see the specific error, we can:
- Verify the SendGrid API key
- Check if the sender email is verified
- Update the configuration if needed

Run the test and share the response - it should now show us exactly what's wrong with SendGrid!
