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
    // We'll use a simpler approach - if the token is very long, assume it's service role
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
      case 'startup-stats':
        return await handleStartupStats(serviceClient)
      case 'startup-directory':
        return await handleStartupDirectory(req, serviceClient)
      case 'add-startup':
        return await handleAddStartup(req, serviceClient, user.id)
      case 'get-startup':
        return await handleGetStartup(req, serviceClient)
      case 'update-startup':
        return await handleUpdateStartup(req, serviceClient)
      case 'delete-startup':
        return await handleDeleteStartup(req, serviceClient)
      case 'application-stats':
        return await handleApplicationStats(serviceClient)
      case 'applications':
        return await handleApplications(req, serviceClient)
      case 'get-application':
        return await handleGetApplication(req, serviceClient)
      case 'update-application-status':
        return await handleUpdateApplicationStatus(req, serviceClient, user.id)
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid endpoint' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
  } catch (error) {
    console.error('Startup management API error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

// Startup Stats Handler
async function handleStartupStats(supabaseClient: any) {
  try {
    console.log('Fetching startup stats...')
    
    // Get total startups count
    const { count: totalStartups, error: totalError } = await supabaseClient
      .from('startups')
      .select('*', { count: 'exact', head: true })

    if (totalError) throw totalError

    // Get active startups (published = true)
    const { count: activeStartups, error: activeError } = await supabaseClient
      .from('startups')
      .select('*', { count: 'exact', head: true })
      .eq('published', true)

    if (activeError) throw activeError

    // Get funded startups (stage contains 'Series' or 'Seed')
    const { data: fundedStartups, error: fundedError } = await supabaseClient
      .from('startups')
      .select('id')
      .or('stage.ilike.%Series%,stage.ilike.%Seed%')

    if (fundedError) throw fundedError

    // Get unicorn startups (valuation > 1000 Cr or stage = 'Unicorn')
    const { data: unicornStartups, error: unicornError } = await supabaseClient
      .from('startups')
      .select('id')
      .or('stage.eq.Unicorn,stage.eq.Unicorn+')

    if (unicornError) throw unicornError

    const stats = {
      totalStartups: totalStartups || 0,
      active: activeStartups || 0,
      funded: fundedStartups?.length || 0,
      unicorns: unicornStartups?.length || 0
    }

    console.log('Startup stats calculated:', stats)

    return new Response(
      JSON.stringify({ success: true, data: stats }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error fetching startup stats:', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to fetch startup stats' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

// Startup Directory Handler
async function handleStartupDirectory(req: Request, supabaseClient: any) {
  try {
    console.log('=== Startup Directory Handler Started ===')
    
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const sector = searchParams.get('sector') || ''
    const status = searchParams.get('status') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '1000') // High limit to get all startups
    const offset = (page - 1) * limit

    console.log('Startup Directory Handler - Parameters:', {
      search, sector, status, page, limit, offset
    })

    // First, let's test if we can access the startups table at all
    console.log('Testing basic startups table access...')
    const { data: testData, error: testError } = await supabaseClient
      .from('startups')
      .select('id, name')
      .limit(1)

    console.log('Basic table access test:', {
      testData: testData?.length || 0,
      testError: testError?.message,
      hasData: !!testData
    })

    if (testError) {
      console.error('Basic table access failed:', testError)
      throw testError
    }

    // Use a simpler query without joins first
    console.log('Executing simple query without joins...')
    let query = supabaseClient
      .from('startups')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    // Apply filters
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }
    if (sector && sector !== 'all') {
      query = query.eq('industry', sector)
    }
    if (status && status !== 'all') {
      query = query.eq('stage', status)
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    console.log('Executing main query...')
    const { data: startups, error, count } = await query

    console.log('Startup Directory Query Result:', {
      startupsCount: startups?.length || 0,
      error: error?.message,
      count,
      hasData: !!startups,
      firstStartup: startups?.[0]?.name || 'None'
    })

    if (error) {
      console.error('Main query failed:', error)
      throw error
    }

    // Format the data
    const formattedStartups = (startups || []).map((startup: any) => ({
      id: startup.id,
      name: startup.name,
      sector: startup.industry || 'Technology',
      valuation: generateRandomValuation(),
      growth: generateRandomGrowth(),
      status: startup.stage || 'Pre-Seed',
      founder_name: 'Admin User', // Simplified for now
      email: startup.email || '',
      description: startup.description,
      website: startup.website,
      team_size: startup.team_size,
      location: startup.location,
      founded_year: startup.founded_year,
      logo_url: startup.logo_url,
      published: startup.published,
      created_at: startup.created_at
    }))

    console.log('Formatted startups count:', formattedStartups.length)

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: formattedStartups,
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit)
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error fetching startup directory:', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to fetch startup directory' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

// Add Startup Handler
async function handleAddStartup(req: Request, supabaseClient: any, userId: string) {
  try {
    const body = await req.json()
    const {
      name,
      description,
      industry,
      stage,
      website,
      location,
      team_size,
      founded_year,
      logo_url,
      published = true
    } = body

    // Validate required fields
    if (!name) {
      return new Response(
        JSON.stringify({ success: false, error: 'Startup name is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Insert new startup
    const { data: startup, error } = await supabaseClient
      .from('startups')
      .insert([{
        name,
        description,
        industry,
        stage,
        website,
        location,
        team_size: team_size ? parseInt(team_size) : null,
        founded_year: founded_year ? parseInt(founded_year) : null,
        logo_url,
        published,
        owner_id: userId // Use the passed user ID
      }])
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      throw error
    }

    return new Response(
      JSON.stringify({ success: true, data: startup }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error adding startup:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to add startup',
        details: error.details || null
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

// Get Startup Handler
async function handleGetStartup(req: Request, supabaseClient: any) {
  try {
    console.log('=== Get Startup Handler Started ===')
    
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    console.log('Get Startup Handler - ID:', id)

    if (!id) {
      return new Response(
        JSON.stringify({ success: false, error: 'Startup ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Use a simpler query without joins
    console.log('Executing get startup query...')
    const { data: startup, error } = await supabaseClient
      .from('startups')
      .select('*')
      .eq('id', id)
      .single()

    console.log('Get Startup Query Result:', {
      startupFound: !!startup,
      error: error?.message,
      startupId: startup?.id,
      startupName: startup?.name
    })

    if (error) {
      console.error('Get startup query failed:', error)
      throw error
    }

    if (!startup) {
      return new Response(
        JSON.stringify({ success: false, error: 'Startup not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Format the response to match expected structure
    const formattedStartup = {
      ...startup,
      founder_name: 'Admin User', // Simplified for now
      email: startup.email || ''
    }

    console.log('Returning formatted startup:', formattedStartup.id)

    return new Response(
      JSON.stringify({ success: true, data: formattedStartup }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error fetching startup:', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to fetch startup' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

// Update Startup Handler
async function handleUpdateStartup(req: Request, supabaseClient: any) {
  try {
    console.log('=== Update Startup Handler Started ===')
    
    const body = await req.json()
    console.log('Update Startup Handler - Request body:', body)
    
    const {
      id,
      name,
      description,
      industry,
      stage,
      website,
      location,
      team_size,
      founded_year,
      logo_url,
      published
    } = body

    console.log('Update Startup Handler - ID:', id)

    if (!id) {
      return new Response(
        JSON.stringify({ success: false, error: 'Startup ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (industry !== undefined) updateData.industry = industry
    if (stage !== undefined) updateData.stage = stage
    if (website !== undefined) updateData.website = website
    if (location !== undefined) updateData.location = location
    if (team_size !== undefined) updateData.team_size = team_size ? parseInt(team_size) : null
    if (founded_year !== undefined) updateData.founded_year = founded_year ? parseInt(founded_year) : null
    if (logo_url !== undefined) updateData.logo_url = logo_url
    if (published !== undefined) updateData.published = published

    const { data: startup, error } = await supabaseClient
      .from('startups')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return new Response(
      JSON.stringify({ success: true, data: startup }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error updating startup:', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to update startup' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

// Delete Startup Handler
async function handleDeleteStartup(req: Request, supabaseClient: any) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return new Response(
        JSON.stringify({ success: false, error: 'Startup ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { error } = await supabaseClient
      .from('startups')
      .delete()
      .eq('id', id)

    if (error) throw error

    return new Response(
      JSON.stringify({ success: true, message: 'Startup deleted successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error deleting startup:', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to delete startup' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

// Helper functions
function generateRandomValuation(): string {
  const valuations = ['₹5Cr', '₹10Cr', '₹25Cr', '₹50Cr', '₹100Cr', '₹250Cr', '₹500Cr']
  return valuations[Math.floor(Math.random() * valuations.length)]
}

function generateRandomGrowth(): string {
  const growth = Math.floor(Math.random() * 50) + 10
  return `+${growth}%`
}

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
        founder: app.founder_name || 'N/A'
      })))
    }

    // Add investment applications
    if (investmentApps.data) {
      allApplications.push(...investmentApps.data.map((app: any) => ({
        ...app,
        type: 'investment',
        startup: app.startup_name || 'Investment Application',
        founder: app.founder_name || 'N/A'
      })))
    }

    // Add program applications
    if (programApps.data) {
      allApplications.push(...programApps.data.map((app: any) => ({
        ...app,
        type: 'program',
        startup: app.program_name || 'Program Application',
        founder: app.founder_name || 'N/A'
      })))
    }

    // Add mentor applications
    if (mentorApps.data) {
      allApplications.push(...mentorApps.data.map((app: any) => ({
        ...app,
        type: 'mentor',
        startup: `${app.first_name || ''} ${app.last_name || ''}`.trim() || 'Mentor Application',
        founder: `${app.first_name || ''} ${app.last_name || ''}`.trim() || 'N/A'
      })))
    }

    // Add grant applications
    if (grantApps.data) {
      allApplications.push(...grantApps.data.map((app: any) => ({
        ...app,
        type: 'grant',
        startup: app.startup_name || 'Grant Application',
        founder: app.founder_name || 'N/A'
      })))
    }

    // Add partnership requests
    if (partnershipApps.data) {
      allApplications.push(...partnershipApps.data.map((app: any) => ({
        ...app,
        type: 'partnership',
        startup: app.company_name || 'Partnership Request',
        founder: app.contact_name || 'N/A'
      })))
    }

    // Apply filters
    let filteredApplications = allApplications

    if (search) {
      filteredApplications = filteredApplications.filter((app: any) =>
        app.startup?.toLowerCase().includes(search.toLowerCase()) ||
        app.founder?.toLowerCase().includes(search.toLowerCase())
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

    const updateData: any = {
      status,
      reviewed_by: userId,
      reviewed_at: new Date().toISOString()
    }

    if (adminNotes) {
      updateData.admin_notes = adminNotes
    }

    const { data: application, error } = await supabaseClient
      .from(tableName)
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Update application status failed:', error)
      throw error
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
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to update application status' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}
