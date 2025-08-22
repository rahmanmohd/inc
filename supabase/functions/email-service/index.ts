import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

// Email templates
const emailTemplates = {
  'hackathon_registration': (data) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 30px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">Hackathon Registration Confirmed! 🚀</h1>
      </div>
      
      <div style="padding: 30px; background: #fff;">
        <h2>Hi ${data.name || data.full_name || 'there'},</h2>
        <p>Your registration for <strong>${data.hackathon_title || 'AI Innovation Challenge 2025'}</strong> has been confirmed!</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Registration Details:</h3>
          <ul>
            <li><strong>Full Name:</strong> ${data.full_name || data.name}</li>
            <li><strong>Email:</strong> ${data.email}</li>
            <li><strong>Phone:</strong> ${data.phone || 'Not provided'}</li>
            <li><strong>City:</strong> ${data.city || 'Not provided'}</li>
            <li><strong>College:</strong> ${data.college || 'Not provided'}</li>
            <li><strong>Graduation Year:</strong> ${data.graduation || 'Not provided'}</li>
            <li><strong>Programming Languages:</strong> ${data.programming_languages || 'Not provided'}</li>
            <li><strong>Experience:</strong> ${data.experience || 'Not provided'}</li>
            <li><strong>Frameworks:</strong> ${data.frameworks || 'Not provided'}</li>
            <li><strong>Specialization:</strong> ${data.specialization || 'Not provided'}</li>
          </ul>
        </div>
        
        <h3>What happens next?</h3>
        <ul>
          <li>You'll receive event details and schedule within 24 hours</li>
          <li>Join our Discord community for team formation</li>
          <li>Attend the pre-hackathon workshop</li>
          <li>Get ready to build something amazing!</li>
        </ul>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://inc-combinator.com/hackathon" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View Event Details
          </a>
        </div>
        
        <p>We're excited to see what you'll build!</p>
        
        <p>Best regards,<br>
        The Inc Combinator Team</p>
      </div>
    </div>
  `,
  
  'hackathon_status_update': (data) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 30px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">Hackathon Registration Status Update 🚀</h1>
      </div>
      
      <div style="padding: 30px; background: #fff;">
        <h2>Hi ${data.full_name || 'there'},</h2>
        <p>Your hackathon registration has been reviewed and the status has been updated.</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Registration Details:</h3>
          <ul>
            <li><strong>Full Name:</strong> ${data.full_name || 'N/A'}</li>
            <li><strong>Programming Languages:</strong> ${data.programming_languages || 'N/A'}</li>
            <li><strong>Experience Level:</strong> ${data.experience || 'N/A'}</li>
            <li><strong>Previous Status:</strong> ${data.oldStatus || 'Pending'}</li>
            <li><strong>New Status:</strong> <span style="color: ${data.newStatus === 'approved' ? '#10b981' : data.newStatus === 'rejected' ? '#ef4444' : '#f59e0b'}; font-weight: bold;">${data.newStatus?.toUpperCase()}</span></li>
          </ul>
        </div>
        
        ${data.newStatus === 'approved' ? `
        <h3>🎉 Congratulations! Your hackathon registration has been approved!</h3>
        <ul>
          <li>You're officially registered for the hackathon</li>
          <li>Join our Discord community for networking and team formation</li>
          <li>Attend the pre-hackathon workshop sessions</li>
          <li>Get ready to build something amazing and innovative!</li>
        </ul>
        ` : data.newStatus === 'rejected' ? `
        <h3>Hackathon Registration Review Complete</h3>
        <ul>
          <li>We've carefully reviewed your hackathon registration</li>
          <li>You may reapply for future hackathons and events</li>
          <li>Consider joining our other innovation programs</li>
          <li>We're here to support your learning and development journey</li>
        </ul>
        ` : `
        <h3>Hackathon Registration Under Review</h3>
        <ul>
          <li>Your hackathon registration is being carefully reviewed</li>
          <li>We'll provide updates as the review progresses</li>
          <li>Feel free to reach out with any questions</li>
          <li>Thank you for your patience</li>
        </ul>
        `}
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://inc-combinator.com/hackathon" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View Hackathon Details
          </a>
        </div>
        
        <p>Best regards,<br>
        The Inc Combinator Team</p>
      </div>
    </div>
  `,

  'incubation_application': (data) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">Incubation Application Submitted! 🚀</h1>
      </div>
      
      <div style="padding: 30px; background: #fff;">
        <h2>Hi ${data.founder_name || 'there'},</h2>
        <p>Your application for <strong>${data.program_title || 'Tech Innovation Incubation Program 2024'}</strong> has been successfully submitted!</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Application Details:</h3>
          <ul>
            <li><strong>Startup Name:</strong> ${data.startup_name || 'N/A'}</li>
            <li><strong>Founder Name:</strong> ${data.founder_name || 'N/A'}</li>
            <li><strong>Email:</strong> ${data.email || 'N/A'}</li>
            <li><strong>Phone:</strong> ${data.phone || 'Not provided'}</li>
            <li><strong>Industry:</strong> ${data.industry || 'N/A'}</li>
            <li><strong>Stage:</strong> ${data.stage || 'N/A'}</li>
            <li><strong>Team Size:</strong> ${data.team_size || 'Not specified'}</li>
          </ul>
        </div>
        
        <h3>What happens next?</h3>
        <ul>
          <li>Our team will review your application within 5-7 business days</li>
          <li>You'll receive an email with the review decision</li>
          <li>If approved, we'll schedule an interview to discuss next steps</li>
          <li>Join our startup community for networking opportunities</li>
        </ul>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://inc-combinator.com/incubation" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View Program Details
          </a>
        </div>
        
        <p>We're excited about your startup journey and look forward to potentially working together!</p>
        
        <p>Best regards,<br>
        The Inc Combinator Team</p>
      </div>
    </div>
  `,

  'incubation_status_update': (data) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">Incubation Application Status Update 🚀</h1>
      </div>
      
      <div style="padding: 30px; background: #fff;">
        <h2>Hi ${data.founder_name || 'there'},</h2>
        <p>Your incubation application has been reviewed and the status has been updated.</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Application Details:</h3>
          <ul>
            <li><strong>Startup Name:</strong> ${data.startup_name || 'N/A'}</li>
            <li><strong>Program:</strong> ${data.program_title || 'N/A'}</li>
            <li><strong>Previous Status:</strong> ${data.oldStatus || 'Submitted'}</li>
            <li><strong>New Status:</strong> <span style="color: ${data.newStatus === 'approved' ? '#10b981' : data.newStatus === 'rejected' ? '#ef4444' : '#f59e0b'}; font-weight: bold;">${data.newStatus?.toUpperCase()}</span></li>
          </ul>
        </div>
        
        ${data.newStatus === 'approved' ? `
        <h3>🎉 Congratulations! Your incubation application has been approved!</h3>
        <ul>
          <li>Welcome to our incubation program!</li>
          <li>We'll schedule an onboarding session within the next week</li>
          <li>You'll receive access to our resources and mentorship network</li>
          <li>Get ready to accelerate your startup growth!</li>
        </ul>
        ` : data.newStatus === 'rejected' ? `
        <h3>Incubation Application Review Complete</h3>
        <ul>
          <li>We've carefully reviewed your application</li>
          <li>You may reapply for future programs</li>
          <li>Consider joining our other startup support programs</li>
          <li>We're here to support your entrepreneurial journey</li>
        </ul>
        ` : `
        <h3>Incubation Application Under Review</h3>
        <ul>
          <li>Your application is being carefully reviewed</li>
          <li>We'll provide updates as the review progresses</li>
          <li>Feel free to reach out with any questions</li>
          <li>Thank you for your patience</li>
        </ul>
        `}
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://inc-combinator.com/incubation" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View Incubation Programs
          </a>
        </div>
        
        <p>Best regards,<br>
        The Inc Combinator Team</p>
      </div>
    </div>
  `
};

// SendGrid API function
async function sendEmailWithSendGrid(to, subject, htmlContent) {
  const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY');
  const FROM_EMAIL = Deno.env.get('FROM_EMAIL') || 'muteeurrahmanmohammed@gmail.com';
  
  // Debug environment variables
  console.log('Environment variables debug:', {
    SENDGRID_API_KEY_EXISTS: !!SENDGRID_API_KEY,
    SENDGRID_API_KEY_LENGTH: SENDGRID_API_KEY?.length || 0,
    SENDGRID_API_KEY_FIRST_10: SENDGRID_API_KEY?.substring(0, 10) || 'null',
    FROM_EMAIL: FROM_EMAIL,
    ALL_ENV_VARS: Object.keys(Deno.env.toObject())
  });
  
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
  
  console.log('SendGrid request body:', JSON.stringify(requestBody, null, 2));
  
  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SENDGRID_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  });
  
  console.log('SendGrid response status:', response.status);
  console.log('SendGrid response headers:', Object.fromEntries(response.headers.entries()));
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('SendGrid error response:', errorText);
    throw new Error(`SendGrid API error: ${response.status} - ${errorText}`);
  }
  
  // Handle empty response
  const responseText = await response.text();
  console.log('SendGrid raw response:', responseText);
  
  if (!responseText) {
    console.log('SendGrid returned empty response - this is normal for successful email sends');
    return {
      message: 'Email sent successfully (empty response)'
    };
  }
  
  try {
    const responseData = JSON.parse(responseText);
    console.log('SendGrid success response:', responseData);
    return responseData;
  } catch (parseError) {
    console.error('Failed to parse SendGrid response as JSON:', parseError);
    console.log('Raw response was:', responseText);
    return {
      message: 'Email sent successfully (non-JSON response)',
      raw: responseText
    };
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }
  
  try {
    const { type, email, name, formData, ...otherData } = await req.json();
    
    // Validate required fields
    if (!type || !email) {
      throw new Error('Missing required fields: type and email');
    }
    
    // Get the email template
    const templateFunction = emailTemplates[type];
    if (!templateFunction) {
      throw new Error(`Template '${type}' not found`);
    }
    
    // Generate HTML content
    const htmlContent = templateFunction({
      ...formData,
      ...otherData,
      name
    });
    
    // Determine subject based on type
    let subject = '';
    switch(type) {
      case 'hackathon_registration':
        subject = 'Hackathon Registration Confirmed - Inc Combinator';
        break;
      case 'hackathon_status_update':
        subject = 'Hackathon Registration Status Update - Inc Combinator';
        break;
      case 'incubation_application':
        subject = 'Incubation Application Submitted - Inc Combinator';
        break;
      case 'incubation_status_update':
        subject = 'Incubation Application Status Update - Inc Combinator';
        break;
      default:
        subject = 'Application Submitted - Inc Combinator';
    }
    
    // Send the actual email
    try {
      console.log('Attempting to send email via SendGrid...');
      const sendGridResponse = await sendEmailWithSendGrid(email, subject, htmlContent);
      console.log('SendGrid response:', sendGridResponse);
      console.log('Email sent successfully:', {
        to: email,
        subject,
        type,
        timestamp: new Date().toISOString()
      });
      
      return new Response(JSON.stringify({
        success: true,
        message: 'Email sent successfully',
        type: type,
        recipient: email,
        sent_at: new Date().toISOString()
      }), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 200
      });
    } catch (emailError) {
      console.error('Email sending failed with error:', emailError);
      console.error('Error details:', {
        message: emailError.message,
        stack: emailError.stack
      });
      
      // Fallback: log the email instead of failing
      console.log('Email would be sent (fallback):', {
        to: email,
        subject,
        type,
        htmlContent: htmlContent.substring(0, 200) + '...'
      });
      
      return new Response(JSON.stringify({
        success: true,
        message: 'Email logged (SendGrid error)',
        type: type,
        recipient: email,
        note: 'Check Supabase logs for email content and error details',
        error: emailError.message
      }), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 200
      });
    }
  } catch (error) {
    console.error('Email function error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 400
    });
  }
});
