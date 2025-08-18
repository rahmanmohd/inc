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
    const { type, applicationId, status, notes, adminId } = await req.json()

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log('Admin notification request:', { type, applicationId, status, notes, adminId })

    switch (type) {
      case 'status_update':
        return await handleStatusUpdate(supabase, applicationId, status, notes, adminId)
      case 'new_application':
        return await handleNewApplication(supabase, applicationId)
      case 'admin_notification':
        return await handleAdminNotification(supabase, applicationId)
      default:
        return new Response(
          JSON.stringify({ success: false, message: 'Invalid notification type' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
  } catch (error) {
    console.error('Error in admin notifications:', error)
    return new Response(
      JSON.stringify({ success: false, message: 'Internal server error', error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function handleStatusUpdate(supabase: any, applicationId: string, status: string, notes: string, adminId: string) {
  try {
    // Update application status in the appropriate table
    const tables = [
      'incubation_applications',
      'investment_applications',
      'mentor_applications',
      'program_applications',
      'grant_applications',
      'partnership_requests'
    ]

    let updated = false
    let applicationData = null

    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .update({
          status: status,
          admin_notes: notes,
          reviewed_by: adminId,
          reviewed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', applicationId)
        .select('*')
        .single()

      if (data && !error) {
        updated = true
        applicationData = data
        break
      }
    }

    if (!updated) {
      return new Response(
        JSON.stringify({ success: false, message: 'Application not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Log the status update
    await supabase.from('admin_activity_log').insert({
      action: 'status_update',
      admin_id: adminId,
      application_id: applicationId,
      application_type: applicationData.type || 'unknown',
      old_status: applicationData.status,
      new_status: status,
      notes: notes,
      created_at: new Date().toISOString()
    })

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Status updated successfully',
        data: applicationData
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error updating status:', error)
    return new Response(
      JSON.stringify({ success: false, message: 'Failed to update status', error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

async function handleNewApplication(supabase: any, applicationId: string) {
  try {
    // Create notification for admin about new application
    await supabase.from('admin_notifications').insert({
      type: 'new_application',
      application_id: applicationId,
      message: 'New application submitted',
      is_read: false,
      created_at: new Date().toISOString()
    })

    return new Response(
      JSON.stringify({ success: true, message: 'Notification created' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error creating new application notification:', error)
    return new Response(
      JSON.stringify({ success: false, message: 'Failed to create notification', error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

async function handleAdminNotification(supabase: any, applicationId: string) {
  try {
    // Get application details and create comprehensive notification
    const { data: application, error } = await supabase
      .from('program_applications')
      .select('*')
      .eq('id', applicationId)
      .single()

    if (error || !application) {
      return new Response(
        JSON.stringify({ success: false, message: 'Application not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create detailed notification
    await supabase.from('admin_notifications').insert({
      type: 'application_review',
      application_id: applicationId,
      application_type: 'program',
      applicant_name: application.founder_name || application.applicant_name,
      startup_name: application.startup_name,
      message: `New ${application.program_name} application from ${application.founder_name || application.applicant_name}`,
      is_read: false,
      priority: 'high',
      created_at: new Date().toISOString()
    })

    return new Response(
      JSON.stringify({ success: true, message: 'Admin notification created' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error creating admin notification:', error)
    return new Response(
      JSON.stringify({ success: false, message: 'Failed to create admin notification', error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}
