import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

// Email template specifically for hackathon status updates
const hackathonStatusTemplate = (data) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hackathon Registration Status Update</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="margin: 0; font-size: 28px;">Hackathon Registration Status Update 🚀</h1>
    <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">${data.hackathon_title || 'AI Innovation Challenge 2025'}</p>
  </div>
  
  <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
    <h2 style="color: #333; margin-top: 0;">Hi ${data.full_name || 'there'}!</h2>
    
    <p style="font-size: 16px; margin-bottom: 20px;">
      We have an update regarding your hackathon registration status.
    </p>
    
    <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #3b82f6;">Registration Status</h3>
      <p style="font-size: 18px; font-weight: bold; margin: 10px 0; color: ${data.status === 'approved' ? '#28a745' : data.status === 'rejected' ? '#dc3545' : '#ffc107'};">
        ${data.status ? data.status.toUpperCase() : 'PENDING'}
      </p>
      
      ${data.admin_notes ? `
      <h4 style="color: #333; margin-top: 20px;">Admin Notes:</h4>
      <p style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 10px 0; font-style: italic;">
        ${data.admin_notes}
      </p>
      ` : ''}
    </div>
    
    <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h4 style="margin-top: 0; color: #333;">Your Registration Details:</h4>
      <ul style="list-style: none; padding: 0;">
        <li style="margin: 8px 0;"><strong>Full Name:</strong> ${data.full_name}</li>
        <li style="margin: 8px 0;"><strong>Email:</strong> ${data.email}</li>
        <li style="margin: 8px 0;"><strong>Programming Languages:</strong> ${data.programming_languages}</li>
        <li style="margin: 8px 0;"><strong>Experience Level:</strong> ${data.experience}</li>
        ${data.specialization ? `<li style="margin: 8px 0;"><strong>Specialization:</strong> ${data.specialization}</li>` : ''}
        ${data.city ? `<li style="margin: 8px 0;"><strong>City:</strong> ${data.city}</li>` : ''}
      </ul>
    </div>
    
    ${data.status === 'approved' ? `
    <div style="background: #d4edda; color: #155724; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0;">🎉 Congratulations!</h3>
      <p><strong>You have been selected for the AI Innovation Challenge 2025!</strong></p>
      <ul>
        <li>You're officially registered for the hackathon</li>
        <li>Join our Discord community for networking and team formation</li>
        <li>Attend the pre-hackathon workshop sessions</li>
        <li>Get ready to build something amazing and innovative!</li>
        <li>We'll send you event details and schedule within 24 hours</li>
      </ul>
    </div>
    ` : data.status === 'rejected' ? `
    <div style="background: #f8d7da; color: #721c24; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0;">Thank you for your interest</h3>
      <p>Unfortunately, we couldn't select your application this time.</p>
      <ul>
        <li>We received many outstanding applications</li>
        <li>You may reapply for future hackathons and events</li>
        <li>Consider joining our other innovation programs</li>
        <li>We're here to support your learning and development journey</li>
        <li>Keep building and improving your skills!</li>
      </ul>
    </div>
    ` : `
    <div style="background: #fff3cd; color: #856404; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="margin-top: 0;">Application Under Review</h3>
      <p>Your hackathon registration is currently being reviewed.</p>
      <ul>
        <li>Our team is carefully evaluating your application</li>
        <li>We'll update you once a decision has been made</li>
        <li>Feel free to reach out with any questions</li>
        <li>Thank you for your patience during this process</li>
      </ul>
    </div>
    `}
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://inc-combinator.com/hackathon" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
        View Hackathon Details
      </a>
    </div>
    
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center;">
      <p style="color: #666; font-size: 14px;">
        Best regards,<br>
        <strong>Inc Combinator Team</strong>
      </p>
      <p style="color: #999; font-size: 12px; margin-top: 10px;">
        If you have any questions, please contact us at support@inc-combinator.com
      </p>
    </div>
  </div>
</body>
</html>
`;

// SendGrid API function
async function sendEmailWithSendGrid(to, subject, htmlContent) {
  const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY');
  const FROM_EMAIL = Deno.env.get('FROM_EMAIL') || 'muteeurrahmanmohammed@gmail.com';
  
  console.log('SendGrid configuration:', {
    apiKey: SENDGRID_API_KEY ? 'Configured' : 'Not configured',
    fromEmail: FROM_EMAIL,
    to: to,
    subject: subject
  });
  
  if (!SENDGRID_API_KEY) {
    throw new Error('SENDGRID_API_KEY not configured');
  }

  const requestBody = {
    personalizations: [
      {
        to: [
          {
            email: to
          }
        ]
      }
    ],
    from: {
      email: FROM_EMAIL,
      name: 'Inc Combinator'
    },
    subject: subject,
    content: [
      {
        type: 'text/html',
        value: htmlContent
      }
    ]
  };

  console.log('Sending email to:', to, 'Subject:', subject);

  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SENDGRID_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });

  console.log('SendGrid response status:', response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('SendGrid error response:', errorText);
    throw new Error(`SendGrid API error: ${response.status} - ${errorText}`);
  }

  const responseText = await response.text();
  console.log('Email sent successfully via SendGrid');
  
  return {
    success: true,
    message: 'Email sent successfully'
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('Hackathon status email function called');
    
    const requestData = await req.json();
    console.log('Request data:', requestData);

    // Extract data from request
    const {
      to,
      subject,
      template,
      data
    } = requestData;

    // Validate required fields
    if (!to) {
      throw new Error('Missing required field: to (email address)');
    }

    if (!data) {
      throw new Error('Missing required field: data (hackathon registration data)');
    }

    // Generate email subject if not provided
    const emailSubject = subject || `Hackathon Registration Status Update - ${data.status ? data.status.charAt(0).toUpperCase() + data.status.slice(1) : 'Update'}`;

    // Generate HTML content using the template
    const htmlContent = hackathonStatusTemplate(data);

    // Send the email
    console.log('Attempting to send hackathon status email...');
    const emailResult = await sendEmailWithSendGrid(to, emailSubject, htmlContent);

    console.log('Hackathon status email sent successfully:', {
      to: to,
      subject: emailSubject,
      status: data.status,
      timestamp: new Date().toISOString()
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Hackathon status email sent successfully',
        recipient: to,
        status: data.status,
        sent_at: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Hackathon status email function error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});
