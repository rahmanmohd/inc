import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Admin status update function called');

    const { type, applicationId, status, notes, adminId, email, name, formData } = await req.json();

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let result: any = {};

    switch (type) {
      case 'status_update':
        result = await handleStatusUpdate(supabase, applicationId, status, notes, adminId);
        break;
      case 'send_email':
        result = await handleEmailNotification(email, name, formData);
        break;
      case 'admin_notification':
        result = await handleAdminNotification(supabase, formData);
        break;
      default:
        throw new Error('Invalid notification type');
    }

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in admin status update function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

async function handleStatusUpdate(supabase: any, applicationId: string, status: string, notes: string, adminId: string) {
  console.log('Handling status update:', { applicationId, status, adminId });

  const updateData = {
    status,
    admin_notes: notes,
    reviewed_by: adminId,
    reviewed_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  // Try to update in different application tables
  const tables = [
    'incubation_applications',
    'investment_applications', 
    'program_applications',
    'mentor_applications',
    'consultations',
    'hackathon_registrations',
    'grant_applications',
    'partnership_requests'
  ];

  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .update(updateData)
        .eq('id', applicationId)
        .select()
        .single();

      if (data && !error) {
        console.log(`Status updated successfully in ${table}`);
        
        // Log admin activity
        await supabase
          .from('admin_activity_log')
          .insert({
            admin_id: adminId,
            action: 'status_update',
            table_name: table,
            record_id: applicationId,
            details: { status, notes },
            created_at: new Date().toISOString()
          });

        return { table, updatedRecord: data };
      }
    } catch (tableError) {
      console.log(`Application not found in ${table}`);
    }
  }

  throw new Error('Application not found in any table');
}

async function handleEmailNotification(email: string, name: string, formData: any) {
  console.log('Sending email notification:', { email, name, type: formData.applicationType });

  const sendGridApiKey = Deno.env.get('SENDGRID_API_KEY');
  const fromEmail = Deno.env.get('FROM_EMAIL');

  if (!sendGridApiKey || !fromEmail) {
    throw new Error('Email configuration missing');
  }

  const emailContent = generateStatusUpdateEmail(name, formData);

  const emailData = {
    personalizations: [
      {
        to: [{ email: email, name: name }],
        subject: `Application Status Update - ${formData.status.toUpperCase()}`
      }
    ],
    from: { email: fromEmail, name: 'Inc Combinator Admin' },
    content: [
      {
        type: 'text/html',
        value: emailContent
      }
    ]
  };

  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${sendGridApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(emailData),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error('SendGrid API error:', response.status, errorData);
    throw new Error(`SendGrid API error: ${response.status} - ${errorData}`);
  }

  console.log('Email sent successfully');
  return { emailSent: true, recipient: email };
}

async function handleAdminNotification(supabase: any, notificationData: any) {
  console.log('Creating admin notification:', notificationData);

  const { data, error } = await supabase
    .from('admin_notifications')
    .insert({
      type: notificationData.type || 'general',
      title: notificationData.title,
      message: notificationData.message,
      priority: notificationData.priority || 'medium',
      metadata: notificationData.metadata || {},
      created_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

function generateStatusUpdateEmail(name: string, formData: any): string {
  const { status, applicationType, notes, reviewedAt } = formData;
  
  const statusColor = getStatusColor(status);
  const statusMessage = getStatusMessage(status, applicationType);

  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Application Status Update</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f97316, #ea580c); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .status-badge { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: bold; color: white; background: ${statusColor}; }
            .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f97316; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🚀 Inc Combinator</h1>
                <h2>Application Status Update</h2>
            </div>
            <div class="content">
                <p>Dear ${name},</p>
                
                <p>We wanted to update you on the status of your ${applicationType} application.</p>
                
                <div class="info-box">
                    <h3>Current Status</h3>
                    <p><span class="status-badge">${status.toUpperCase()}</span></p>
                    <p>${statusMessage}</p>
                </div>
                
                ${notes ? `
                <div class="info-box">
                    <h3>Admin Notes</h3>
                    <p>${notes}</p>
                </div>
                ` : ''}
                
                <div class="info-box">
                    <h3>Next Steps</h3>
                    ${getNextSteps(status)}
                </div>
                
                <p>If you have any questions about your application, please don't hesitate to reach out to our team.</p>
                
                <p>Best regards,<br>
                <strong>Inc Combinator Team</strong></p>
            </div>
            <div class="footer">
                <p>This is an automated message from Inc Combinator Admin System</p>
                <p>Updated on: ${new Date(reviewedAt).toLocaleString()}</p>
            </div>
        </div>
    </body>
    </html>
  `;
}

function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'approved': return '#10b981';
    case 'rejected': return '#ef4444';
    case 'under review': return '#f59e0b';
    case 'pending': return '#6b7280';
    default: return '#6b7280';
  }
}

function getStatusMessage(status: string, applicationType: string): string {
  switch (status.toLowerCase()) {
    case 'approved':
      return `Congratulations! Your ${applicationType} application has been approved. We're excited to welcome you to our program.`;
    case 'rejected':
      return `Thank you for your interest in our ${applicationType} program. After careful consideration, we're unable to move forward with your application at this time.`;
    case 'under review':
      return `Your ${applicationType} application is currently under review by our team. We'll update you soon with our decision.`;
    case 'pending':
      return `Your ${applicationType} application has been received and is pending initial review.`;
    default:
      return `Your ${applicationType} application status has been updated.`;
  }
}

function getNextSteps(status: string): string {
  switch (status.toLowerCase()) {
    case 'approved':
      return `
        <ul>
          <li>You'll receive a welcome package with program details within 24-48 hours</li>
          <li>A program coordinator will contact you to schedule an onboarding session</li>
          <li>Please prepare any required documentation as outlined in the welcome package</li>
        </ul>
      `;
    case 'rejected':
      return `
        <ul>
          <li>We encourage you to apply again in the future as your startup grows</li>
          <li>Consider attending our public events and workshops to strengthen your application</li>
          <li>Feel free to reach out for feedback on areas for improvement</li>
        </ul>
      `;
    case 'under review':
      return `
        <ul>
          <li>No action required from you at this time</li>
          <li>We may reach out if we need additional information</li>
          <li>Typical review time is 5-7 business days</li>
        </ul>
      `;
    default:
      return `
        <ul>
          <li>Please wait for further updates from our team</li>
          <li>You can contact us if you have any questions</li>
        </ul>
      `;
  }
}
