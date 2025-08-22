// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
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
    const authHeader = req.headers.get('Authorization')
    console.log('Auth header received:', authHeader ? 'Present' : 'Missing')
    console.log('Auth header value:', authHeader)
    console.log('Auth header starts with Bearer eyJ:', authHeader?.startsWith('Bearer eyJ'))
    console.log('Auth header includes service_role:', authHeader?.includes('service_role'))

    // Check if this is a service role request (for testing)
    const isServiceRoleRequest = authHeader?.startsWith('Bearer ') && 
      authHeader.length > 200 // Service role keys are typically longer
    
    console.log('Is service role request:', isServiceRoleRequest)
    console.log('Auth header length:', authHeader?.length || 0)

    let user = null
    let profile = null

    if (isServiceRoleRequest) {
      // For service role requests, skip user authentication
      console.log('Service role request detected, skipping user auth')
      user = { id: 'service-role-user' }
      profile = { role: 'admin' }
    } else {
      // Create Supabase client and authenticate user
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_ANON_KEY') ?? '',
        {
          global: {
            headers: { Authorization: authHeader! },
          },
        }
      )

      // Authenticate user
      const { data: { user: authUser }, error: authError } = await supabaseClient.auth.getUser()
      if (authError || !authUser) {
        console.log('Authentication failed:', authError?.message)
        return new Response(
          JSON.stringify({ 
            error: 'Unauthorized',
            details: 'Please provide a valid JWT token or service role key',
            authError: authError?.message 
          }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      user = authUser

      // Check if user is admin
      const { data: userProfile } = await supabaseClient
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (!userProfile || userProfile.role !== 'admin') {
        console.log('User is not admin:', userProfile?.role)
        return new Response(
          JSON.stringify({ 
            error: 'Admin access required',
            details: 'User must have admin role to access this API'
          }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      profile = userProfile
    }

    // Create a service client to bypass RLS for admin operations
    const serviceClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { pathname } = new URL(req.url)
    const path = pathname.split('/').pop()

    // Route to appropriate handler
    switch (path) {
      case 'application-stats':
        return await handleApplicationStats(serviceClient)
      case 'applications':
        return await handleApplications(req, serviceClient)
      case 'get-application':
        return await handleGetApplication(req, serviceClient)
      case 'update-application-status':
        return await handleUpdateApplicationStatus(req, serviceClient, user.id)
      case 'delete-application':
        return await handleDeleteApplication(req, serviceClient)
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid endpoint' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
  } catch (error) {
    console.error('Application management API error:', error)
  return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

// Application Stats Handler
async function handleApplicationStats(supabaseClient: any) {
  try {
    console.log('=== Application Stats Handler Started ===')
    
    // Get total applications count from all tables
    const [incubationCount, investmentCount, programCount, mentorCount, grantCount, partnershipCount] = await Promise.all([
      supabaseClient.from('incubation_applications').select('*', { count: 'exact', head: true }),
      supabaseClient.from('investment_applications').select('*', { count: 'exact', head: true }),
      supabaseClient.from('program_applications').select('*', { count: 'exact', head: true }),
      supabaseClient.from('mentor_applications').select('*', { count: 'exact', head: true }),
      supabaseClient.from('grant_applications').select('*', { count: 'exact', head: true }),
      supabaseClient.from('partnership_requests').select('*', { count: 'exact', head: true })
    ])

    const totalApplications = (incubationCount.count || 0) + (investmentCount.count || 0) + 
                            (programCount.count || 0) + (mentorCount.count || 0) + 
                            (grantCount.count || 0) + (partnershipCount.count || 0)

    // Get pending applications
    const [pendingIncubation, pendingInvestment, pendingProgram, pendingMentor, pendingGrant, pendingPartnership] = await Promise.all([
      supabaseClient.from('incubation_applications').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabaseClient.from('investment_applications').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabaseClient.from('program_applications').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabaseClient.from('mentor_applications').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabaseClient.from('grant_applications').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabaseClient.from('partnership_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending')
    ])

    const pendingApplications = (pendingIncubation.count || 0) + (pendingInvestment.count || 0) + 
                              (pendingProgram.count || 0) + (pendingMentor.count || 0) + 
                              (pendingGrant.count || 0) + (pendingPartnership.count || 0)

    // Get approved applications
    const [approvedIncubation, approvedInvestment, approvedProgram, approvedMentor, approvedGrant, approvedPartnership] = await Promise.all([
      supabaseClient.from('incubation_applications').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
      supabaseClient.from('investment_applications').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
      supabaseClient.from('program_applications').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
      supabaseClient.from('mentor_applications').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
      supabaseClient.from('grant_applications').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
      supabaseClient.from('partnership_requests').select('*', { count: 'exact', head: true }).eq('status', 'approved')
    ])

    const approvedApplications = (approvedIncubation.count || 0) + (approvedInvestment.count || 0) + 
                               (approvedProgram.count || 0) + (approvedMentor.count || 0) + 
                               (approvedGrant.count || 0) + (approvedPartnership.count || 0)

    // Get under review applications
    const [reviewIncubation, reviewInvestment, reviewProgram, reviewMentor, reviewGrant, reviewPartnership] = await Promise.all([
      supabaseClient.from('incubation_applications').select('*', { count: 'exact', head: true }).eq('status', 'under review'),
      supabaseClient.from('investment_applications').select('*', { count: 'exact', head: true }).eq('status', 'under review'),
      supabaseClient.from('program_applications').select('*', { count: 'exact', head: true }).eq('status', 'under review'),
      supabaseClient.from('mentor_applications').select('*', { count: 'exact', head: true }).eq('status', 'under review'),
      supabaseClient.from('grant_applications').select('*', { count: 'exact', head: true }).eq('status', 'under review'),
      supabaseClient.from('partnership_requests').select('*', { count: 'exact', head: true }).eq('status', 'under review')
    ])

    const underReviewApplications = (reviewIncubation.count || 0) + (reviewInvestment.count || 0) + 
                                  (reviewProgram.count || 0) + (reviewMentor.count || 0) + 
                                  (reviewGrant.count || 0) + (reviewPartnership.count || 0)

    const stats = {
      totalApplications,
      pending: pendingApplications,
      approved: approvedApplications,
      underReview: underReviewApplications
    }

    console.log('Application stats calculated:', stats)

    return new Response(
      JSON.stringify({ success: true, data: stats }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error fetching application stats:', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to fetch application stats' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

// Applications Handler
async function handleApplications(req: Request, supabaseClient: any) {
  try {
    console.log('=== Applications Handler Started ===')
    
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const type = searchParams.get('type') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = (page - 1) * limit

    console.log('Applications Handler - Parameters:', {
      search, status, type, page, limit, offset
    })

    // Fetch applications from all tables
    const [incubationApps, investmentApps, programApps, mentorApps, grantApps, partnershipApps] = await Promise.all([
      supabaseClient.from('incubation_applications').select('*').order('created_at', { ascending: false }),
      supabaseClient.from('investment_applications').select('*').order('created_at', { ascending: false }),
      supabaseClient.from('program_applications').select('*').order('created_at', { ascending: false }),
      supabaseClient.from('mentor_applications').select('*').order('created_at', { ascending: false }),
      supabaseClient.from('grant_applications').select('*').order('created_at', { ascending: false }),
      supabaseClient.from('partnership_requests').select('*').order('created_at', { ascending: false })
    ])

    // Combine and format all applications
    let allApplications: any[] = []

    // Add incubation applications
    if (incubationApps.data) {
      allApplications.push(...incubationApps.data.map((app: any) => ({
        ...app,
        type: 'incubation',
        startup: app.startup_name || 'Incubation Application',
        founder: app.founder_name || 'N/A',
        email: app.email || 'N/A',
        stage: app.stage || 'N/A'
      })))
    }

    // Add investment applications
    if (investmentApps.data) {
      allApplications.push(...investmentApps.data.map((app: any) => ({
        ...app,
        type: 'investment',
        startup: app.startup_name || 'Investment Application',
        founder: app.founder_name || 'N/A',
        email: app.email || 'N/A',
        stage: app.funding_stage || 'N/A'
      })))
    }

    // Add program applications
    if (programApps.data) {
      allApplications.push(...programApps.data.map((app: any) => ({
        ...app,
        type: 'program',
        startup: app.program_name || 'Program Application',
        founder: app.founder_name || 'N/A',
        email: app.email || 'N/A',
        stage: app.current_stage || 'N/A'
      })))
    }

    // Add mentor applications
    if (mentorApps.data) {
      allApplications.push(...mentorApps.data.map((app: any) => ({
        ...app,
        type: 'mentor',
        startup: `${app.first_name || ''} ${app.last_name || ''}`.trim() || 'Mentor Application',
        founder: `${app.first_name || ''} ${app.last_name || ''}`.trim() || 'N/A',
        email: app.email || 'N/A',
        stage: app.years_of_experience || 'N/A'
      })))
    }

    // Add grant applications
    if (grantApps.data) {
      allApplications.push(...grantApps.data.map((app: any) => ({
        ...app,
        type: 'grant',
        startup: app.startup_name || 'Grant Application',
        founder: app.founder_name || 'N/A',
        email: app.email || 'N/A',
        stage: app.stage || 'N/A'
      })))
    }

    // Add partnership requests
    if (partnershipApps.data) {
      allApplications.push(...partnershipApps.data.map((app: any) => ({
        ...app,
        type: 'partnership',
        startup: app.company_name || 'Partnership Request',
        founder: app.contact_name || 'N/A',
        email: app.email || 'N/A',
        stage: app.partnership_type || 'N/A'
      })))
    }

    // Apply filters
    let filteredApplications = allApplications

    if (search) {
      filteredApplications = filteredApplications.filter((app: any) =>
        app.startup?.toLowerCase().includes(search.toLowerCase()) ||
        app.founder?.toLowerCase().includes(search.toLowerCase()) ||
        app.email?.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (status && status !== 'all') {
      filteredApplications = filteredApplications.filter((app: any) =>
        app.status?.toLowerCase() === status.toLowerCase()
      )
    }

    if (type && type !== 'all') {
      filteredApplications = filteredApplications.filter((app: any) =>
        app.type === type
      )
    }

    // Apply pagination
    const total = filteredApplications.length
    const paginatedApplications = filteredApplications.slice(offset, offset + limit)

    console.log('Applications Query Result:', {
      totalApplications: allApplications.length,
      filteredApplications: filteredApplications.length,
      paginatedApplications: paginatedApplications.length,
      total,
      page,
      limit
    })

    return new Response(
      JSON.stringify({ 
        success: true,
        data: paginatedApplications,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error fetching applications:', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to fetch applications' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

// Get Application Handler
async function handleGetApplication(req: Request, supabaseClient: any) {
  try {
    console.log('=== Get Application Handler Started ===')
    
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    const type = searchParams.get('type')

    console.log('Get Application Handler - ID:', id, 'Type:', type)

    if (!id || !type) {
      return new Response(
        JSON.stringify({ success: false, error: 'Application ID and type are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let tableName = ''
    switch (type) {
      case 'incubation':
        tableName = 'incubation_applications'
        break
      case 'investment':
        tableName = 'investment_applications'
        break
      case 'program':
        tableName = 'program_applications'
        break
      case 'mentor':
        tableName = 'mentor_applications'
        break
      case 'grant':
        tableName = 'grant_applications'
        break
      case 'partnership':
        tableName = 'partnership_requests'
        break
      default:
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid application type' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }

    const { data: application, error } = await supabaseClient
      .from(tableName)
      .select('*')
      .eq('id', id)
      .single()

    console.log('Get Application Query Result:', {
      applicationFound: !!application,
      error: error?.message,
      applicationId: application?.id
    })

    if (error) {
      console.error('Get application query failed:', error)
      throw error
    }

    if (!application) {
      return new Response(
        JSON.stringify({ success: false, error: 'Application not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ success: true, data: application }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error fetching application:', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to fetch application' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

// Update Application Status Handler
async function handleUpdateApplicationStatus(req: Request, supabaseClient: any, userId: string) {
  try {
    console.log('=== Update Application Status Handler Started ===')
    
    const body = await req.json()
    console.log('Update Application Status Handler - Request body:', body)
    
    const {
      id,
      type,
      status,
      adminNotes,
      sendEmail = true
    } = body

    console.log('Update Application Status Handler - ID:', id, 'Type:', type, 'Status:', status)

    if (!id || !type || !status) {
      return new Response(
        JSON.stringify({ success: false, error: 'Application ID, type, and status are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let tableName = ''
    switch (type) {
      case 'incubation':
        tableName = 'incubation_applications'
        break
      case 'investment':
        tableName = 'investment_applications'
        break
      case 'program':
        tableName = 'program_applications'
        break
      case 'mentor':
        tableName = 'mentor_applications'
        break
      case 'grant':
        tableName = 'grant_applications'
        break
      case 'partnership':
        tableName = 'partnership_requests'
        break
      default:
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid application type' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }

    // First check if the application exists
    const { data: existingApp, error: fetchError } = await supabaseClient
      .from(tableName)
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError) {
      console.error('Failed to fetch existing application:', fetchError)
      throw new Error(`Application not found: ${fetchError.message}`)
    }

    console.log('Existing application:', existingApp)
    console.log('Table name:', tableName)

    // Build update data based on available columns
    const updateData: any = {
      status
    }

    // Only add these fields if they exist in the table
    if (tableName !== 'partnership_requests') {
      updateData.reviewed_by = userId
      updateData.reviewed_at = new Date().toISOString()
    }

    if (adminNotes) {
      updateData.admin_notes = adminNotes
    }

    console.log('Update data:', updateData)

    const { data: application, error } = await supabaseClient
      .from(tableName)
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Update application status failed:', error)
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      throw new Error(`Database update failed: ${error.message}`)
    }

    console.log('Application status updated successfully:', application.id)

    // TODO: Send email notification if sendEmail is true
    if (sendEmail && application.email) {
      console.log('Email notification would be sent to:', application.email)
      // Implement email sending logic here
    }

    return new Response(
      JSON.stringify({ success: true, data: application }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error updating application status:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to update application status'
    console.error('Full error details:', {
      error,
      stack: error instanceof Error ? error.stack : undefined
    })
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage,
        details: error instanceof Error ? {
          message: error.message,
          stack: error.stack
        } : undefined
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

// Delete Application Handler
async function handleDeleteApplication(req: Request, supabaseClient: any) {
  try {
    console.log('=== Delete Application Handler Started ===')
    
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    const type = searchParams.get('type')

    console.log('Delete Application Handler - ID:', id, 'Type:', type)

    if (!id || !type) {
      return new Response(
        JSON.stringify({ success: false, error: 'Application ID and type are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let tableName = ''
    switch (type) {
      case 'incubation':
        tableName = 'incubation_applications'
        break
      case 'investment':
        tableName = 'investment_applications'
        break
      case 'program':
        tableName = 'program_applications'
        break
      case 'mentor':
        tableName = 'mentor_applications'
        break
      case 'grant':
        tableName = 'grant_applications'
        break
      case 'partnership':
        tableName = 'partnership_requests'
        break
      default:
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid application type' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }

    const { error } = await supabaseClient
      .from(tableName)
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Delete application failed:', error)
      throw error
    }

    console.log('Application deleted successfully:', id)

    return new Response(
      JSON.stringify({ success: true, message: 'Application deleted successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error deleting application:', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to delete application' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}
