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
        <h2>Hi ${data.name || 'there'},</h2>
        <p>Your registration for <strong>AI Innovation Challenge 2025</strong> has been confirmed!</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Registration Details:</h3>
          <ul>
            <li><strong>Full Name:</strong> ${data.full_name || data.name}</li>
            <li><strong>Email:</strong> ${data.email}</li>
            <li><strong>Phone:</strong> ${data.phone}</li>
            <li><strong>City:</strong> ${data.city}</li>
            <li><strong>College:</strong> ${data.college}</li>
            <li><strong>Graduation Year:</strong> ${data.graduation}</li>
            <li><strong>Programming Languages:</strong> ${data.programming_languages}</li>
            <li><strong>Experience:</strong> ${data.experience}</li>
            <li><strong>Frameworks:</strong> ${data.frameworks}</li>
            <li><strong>Specialization:</strong> ${data.specialization}</li>
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

  'incubation_application': (data) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">Incubation Application Submitted! 🚀</h1>
      </div>
      
      <div style="padding: 30px; background: #fff;">
        <h2>Hi ${data.founderName || data.name},</h2>
        <p>Your incubation application for <strong>${data.startupName}</strong> has been submitted successfully!</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Application Details:</h3>
          <ul>
            <li><strong>Startup Name:</strong> ${data.startupName}</li>
            <li><strong>Founder Name:</strong> ${data.founderName}</li>
            <li><strong>Email:</strong> ${data.email}</li>
            <li><strong>Phone:</strong> ${data.phone}</li>
            <li><strong>LinkedIn:</strong> ${data.linkedIn || 'Not provided'}</li>
            <li><strong>Industry:</strong> ${data.industry}</li>
            <li><strong>Stage:</strong> ${data.stage}</li>
            <li><strong>Website:</strong> ${data.website || 'Not provided'}</li>
          </ul>
        </div>
        
        <h3>What happens next?</h3>
        <ul>
          <li>Our team will review your application within 7-10 business days</li>
          <li>You'll receive an email with the review decision</li>
          <li>If approved, you'll get access to our incubation resources</li>
          <li>Join our founder community for networking opportunities</li>
        </ul>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://inc-combinator.com/startup-dashboard" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View Your Dashboard
          </a>
        </div>
        
        <p>We're excited to review your application!</p>
        
        <p>Best regards,<br>
        The Inc Combinator Team</p>
      </div>
    </div>
  `,

  'investment_application': (data) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 30px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">Investment Application Submitted! 💰</h1>
      </div>
      
      <div style="padding: 30px; background: #fff;">
        <h2>Hi ${data.founderName || data.name},</h2>
        <p>Your investment application for <strong>${data.startupName}</strong> has been submitted successfully!</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Application Details:</h3>
          <ul>
            <li><strong>Startup Name:</strong> ${data.startupName}</li>
            <li><strong>Founder Name:</strong> ${data.founderName}</li>
            <li><strong>Email:</strong> ${data.email}</li>
            <li><strong>Phone:</strong> ${data.phone}</li>
            <li><strong>Industry:</strong> ${data.industry}</li>
            <li><strong>Stage:</strong> ${data.stage}</li>
            <li><strong>Funding Amount:</strong> ${data.fundingAmount}</li>
            <li><strong>Website:</strong> ${data.website || 'Not provided'}</li>
          </ul>
        </div>
        
        <h3>What happens next?</h3>
        <ul>
          <li>Our investment team will review your application within 10-14 business days</li>
          <li>You may be contacted for additional information or a pitch meeting</li>
          <li>If selected, you'll be invited for due diligence</li>
          <li>We'll keep you updated throughout the process</li>
        </ul>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://inc-combinator.com/investor-centre" style="background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View Investment Center
          </a>
        </div>
        
        <p>We're excited to review your investment opportunity!</p>
        
        <p>Best regards,<br>
        The Inc Combinator Team</p>
      </div>
    </div>
  `,

  'program_application': (data) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; padding: 30px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">Program Application Submitted! 🎯</h1>
      </div>
      
      <div style="padding: 30px; background: #fff;">
        <h2>Hi ${data.founderName || data.name},</h2>
        <p>Your program application has been submitted successfully!</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Application Details:</h3>
          <ul>
            <li><strong>Founder Name:</strong> ${data.founderName}</li>
            <li><strong>Email:</strong> ${data.email}</li>
            <li><strong>Phone:</strong> ${data.phone}</li>
            <li><strong>Company:</strong> ${data.company}</li>
            <li><strong>Industry:</strong> ${data.industry}</li>
            <li><strong>Stage:</strong> ${data.stage}</li>
            <li><strong>Website:</strong> ${data.website || 'Not provided'}</li>
          </ul>
        </div>
        
        <h3>What happens next?</h3>
        <ul>
          <li>Our program team will review your application within 5-7 business days</li>
          <li>You'll receive an email with the review decision</li>
          <li>If accepted, you'll get access to program resources and mentorship</li>
          <li>Join our exclusive program community</li>
        </ul>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://inc-combinator.com/programs" style="background: #8b5cf6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View Programs
          </a>
        </div>
        
        <p>We're excited to have you join our program!</p>
        
        <p>Best regards,<br>
        The Inc Combinator Team</p>
      </div>
    </div>
  `,

  'mentor_application': (data) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #06b6d4, #0891b2); color: white; padding: 30px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">Mentor Application Submitted! 👨‍🏫</h1>
      </div>
      
      <div style="padding: 30px; background: #fff;">
        <h2>Hi ${data.fullName || data.name},</h2>
        <p>Your mentor application has been submitted successfully!</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Application Details:</h3>
          <ul>
            <li><strong>Full Name:</strong> ${data.fullName}</li>
            <li><strong>Email:</strong> ${data.email}</li>
            <li><strong>Phone:</strong> ${data.phone}</li>
            <li><strong>Company:</strong> ${data.company}</li>
            <li><strong>Position:</strong> ${data.position}</li>
            <li><strong>Expertise Areas:</strong> ${data.expertiseAreas}</li>
            <li><strong>Experience:</strong> ${data.experience}</li>
            <li><strong>LinkedIn:</strong> ${data.linkedin || 'Not provided'}</li>
          </ul>
        </div>
        
        <h3>What happens next?</h3>
        <ul>
          <li>Our mentor team will review your application within 7-10 business days</li>
          <li>You may be contacted for an interview or additional information</li>
          <li>If approved, you'll be added to our mentor network</li>
          <li>You'll receive access to our mentor portal and resources</li>
        </ul>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://inc-combinator.com/mentor-dashboard" style="background: #06b6d4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View Mentor Portal
          </a>
        </div>
        
        <p>We're excited to potentially have you join our mentor network!</p>
        
        <p>Best regards,<br>
        The Inc Combinator Team</p>
      </div>
    </div>
  `,

  'consultation_request': (data) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #ec4899, #db2777); color: white; padding: 30px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">Consultation Request Submitted! 📅</h1>
      </div>
      
      <div style="padding: 30px; background: #fff;">
        <h2>Hi ${data.name},</h2>
        <p>Your consultation request has been submitted successfully!</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Consultation Details:</h3>
          <ul>
            <li><strong>Name:</strong> ${data.name}</li>
            <li><strong>Email:</strong> ${data.email}</li>
            <li><strong>Phone:</strong> ${data.phone}</li>
            <li><strong>Company:</strong> ${data.company || 'Not provided'}</li>
            <li><strong>Startup Stage:</strong> ${data.startupStage}</li>
            <li><strong>Consultation Type:</strong> ${data.consultationType}</li>
            <li><strong>Preferred Date:</strong> ${data.preferredDate}</li>
            <li><strong>Preferred Time:</strong> ${data.preferredTime}</li>
            <li><strong>Description:</strong> ${data.description}</li>
          </ul>
        </div>
        
        <h3>What happens next?</h3>
        <ul>
          <li>Our team will review your request within 24-48 hours</li>
          <li>We'll contact you to confirm the consultation details</li>
          <li>You'll receive a calendar invitation for the session</li>
          <li>Prepare any questions or materials you'd like to discuss</li>
        </ul>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://inc-combinator.com/consultation" style="background: #ec4899; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View Consultation Info
          </a>
        </div>
        
        <p>We're looking forward to our consultation session!</p>
        
        <p>Best regards,<br>
        The Inc Combinator Team</p>
      </div>
    </div>
  `,

  'contact_form': (data) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #6b7280, #4b5563); color: white; padding: 30px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">Contact Form Submitted! 📧</h1>
      </div>
      
      <div style="padding: 30px; background: #fff;">
        <h2>Hi ${data.firstName} ${data.lastName},</h2>
        <p>Thank you for contacting us! We've received your message and will get back to you soon.</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Message Details:</h3>
          <ul>
            <li><strong>Name:</strong> ${data.firstName} ${data.lastName}</li>
            <li><strong>Email:</strong> ${data.email}</li>
            <li><strong>Phone:</strong> ${data.phone || 'Not provided'}</li>
            <li><strong>Company:</strong> ${data.company || 'Not provided'}</li>
            <li><strong>Inquiry Type:</strong> ${data.inquiryType}</li>
            <li><strong>Subject:</strong> ${data.subject}</li>
            <li><strong>Message:</strong> ${data.message}</li>
          </ul>
        </div>
        
        <h3>What happens next?</h3>
        <ul>
          <li>Our team will review your message within 24-48 hours</li>
          <li>We'll respond to your inquiry via email</li>
          <li>If urgent, we may contact you by phone</li>
          <li>We're committed to providing excellent support</li>
        </ul>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://inc-combinator.com/contact" style="background: #6b7280; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Contact Us
          </a>
        </div>
        
        <p>Thank you for reaching out to us!</p>
        
        <p>Best regards,<br>
        The Inc Combinator Team</p>
      </div>
    </div>
  `,

  'grant_application': (data) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #84cc16, #65a30d); color: white; padding: 30px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">Grant Application Submitted! 🎁</h1>
      </div>
      
      <div style="padding: 30px; background: #fff;">
        <h2>Hi ${data.founderName || data.name},</h2>
        <p>Your grant application has been submitted successfully!</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Application Details:</h3>
          <ul>
            <li><strong>Founder Name:</strong> ${data.founderName}</li>
            <li><strong>Email:</strong> ${data.email}</li>
            <li><strong>Phone:</strong> ${data.phone}</li>
            <li><strong>Startup Name:</strong> ${data.startupName}</li>
            <li><strong>Industry:</strong> ${data.industry}</li>
            <li><strong>Grant Amount:</strong> ${data.grantAmount}</li>
            <li><strong>Purpose:</strong> ${data.purpose}</li>
            <li><strong>Website:</strong> ${data.website || 'Not provided'}</li>
          </ul>
        </div>
        
        <h3>What happens next?</h3>
        <ul>
          <li>Our grant committee will review your application within 14-21 business days</li>
          <li>You may be contacted for additional information or an interview</li>
          <li>If approved, you'll receive the grant funds</li>
          <li>We'll provide ongoing support and mentorship</li>
        </ul>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://inc-combinator.com/grants" style="background: #84cc16; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View Grants
          </a>
        </div>
        
        <p>We're excited to review your grant application!</p>
        
        <p>Best regards,<br>
        The Inc Combinator Team</p>
      </div>
    </div>
  `,

  'partnership_request': (data) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 30px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">Partnership Request Submitted! 🤝</h1>
      </div>
      
      <div style="padding: 30px; background: #fff;">
        <h2>Hi ${data.contactName || data.name},</h2>
        <p>Your partnership request has been submitted successfully!</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Partnership Details:</h3>
          <ul>
            <li><strong>Contact Name:</strong> ${data.contactName}</li>
            <li><strong>Email:</strong> ${data.email}</li>
            <li><strong>Phone:</strong> ${data.phone}</li>
            <li><strong>Company:</strong> ${data.company}</li>
            <li><strong>Partnership Type:</strong> ${data.partnershipType}</li>
            <li><strong>Industry:</strong> ${data.industry}</li>
            <li><strong>Proposal:</strong> ${data.proposal}</li>
            <li><strong>Website:</strong> ${data.website || 'Not provided'}</li>
          </ul>
        </div>
        
        <h3>What happens next?</h3>
        <ul>
          <li>Our partnership team will review your request within 7-10 business days</li>
          <li>We'll contact you to discuss the partnership opportunity</li>
          <li>If interested, we'll schedule a meeting to explore collaboration</li>
          <li>We're excited about potential partnership opportunities</li>
        </ul>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://inc-combinator.com/partnership" style="background: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View Partnership Info
          </a>
        </div>
        
        <p>We're looking forward to exploring this partnership opportunity!</p>
        
        <p>Best regards,<br>
        The Inc Combinator Team</p>
      </div>
    </div>
  `,

  'registration': (data) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #6366f1, #4f46e5); color: white; padding: 30px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">Welcome to Inc Combinator! 🎉</h1>
      </div>
      
      <div style="padding: 30px; background: #fff;">
        <h2>Hi ${data.firstName} ${data.lastName},</h2>
        <p>Welcome to Inc Combinator! Your account has been created successfully.</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Account Details:</h3>
          <ul>
            <li><strong>Name:</strong> ${data.firstName} ${data.lastName}</li>
            <li><strong>Email:</strong> ${data.email}</li>
            <li><strong>Phone:</strong> ${data.phone}</li>
            <li><strong>Company:</strong> ${data.company || 'Not provided'}</li>
            <li><strong>User Type:</strong> ${data.userType}</li>
            <li><strong>Bio:</strong> ${data.bio || 'Not provided'}</li>
          </ul>
        </div>
        
        <h3>Getting Started:</h3>
        <ul>
          <li>Complete your profile to unlock all features</li>
          <li>Explore our programs and opportunities</li>
          <li>Connect with other founders and mentors</li>
          <li>Join our community events and workshops</li>
        </ul>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://inc-combinator.com/dashboard" style="background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Go to Dashboard
          </a>
        </div>
        
        <p>We're excited to have you join our community!</p>
        
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
    return { message: 'Email sent successfully (empty response)' };
  }

  try {
    const responseData = JSON.parse(responseText);
    console.log('SendGrid success response:', responseData);
    return responseData;
  } catch (parseError) {
    console.error('Failed to parse SendGrid response as JSON:', parseError);
    console.log('Raw response was:', responseText);
    return { message: 'Email sent successfully (non-JSON response)', raw: responseText };
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
    const htmlContent = templateFunction({ ...formData, ...otherData, name });

    // Determine subject based on type
    let subject = '';
    switch (type) {
      case 'hackathon_registration':
        subject = 'Hackathon Registration Confirmed - Inc Combinator';
        break;
      case 'incubation_application':
        subject = 'Incubation Application Submitted - Inc Combinator';
        break;
      case 'investment_application':
        subject = 'Investment Application Submitted - Inc Combinator';
        break;
      case 'program_application':
        subject = 'Program Application Submitted - Inc Combinator';
        break;
      case 'mentor_application':
        subject = 'Mentor Application Submitted - Inc Combinator';
        break;
      case 'consultation_request':
        subject = 'Consultation Request Submitted - Inc Combinator';
        break;
      case 'contact_form':
        subject = 'Contact Form Submitted - Inc Combinator';
        break;
      case 'grant_application':
        subject = 'Grant Application Submitted - Inc Combinator';
        break;
      case 'partnership_request':
        subject = 'Partnership Request Submitted - Inc Combinator';
        break;
      case 'registration':
        subject = 'Welcome to Inc Combinator!';
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
