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
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { pathname } = new URL(req.url)
    const path = pathname.split('/').pop()

    // Get user from JWT
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if user is admin
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Route to appropriate handler
    switch (path) {
      case 'dashboard-stats':
        return await handleDashboardStats(supabaseClient)
      case 'recent-applications':
        return await handleRecentApplications(supabaseClient)
      case 'top-startups':
        return await handleTopStartups(supabaseClient)
      case 'application-details':
        return await handleApplicationDetails(req, supabaseClient)
      case 'update-application-status':
        return await handleUpdateApplicationStatus(req, supabaseClient)
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid endpoint' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
  } catch (error) {
    console.error('Admin dashboard API error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

// Dashboard Stats Handler
async function handleDashboardStats(supabaseClient: any) {
  try {
    // Get total startups (users with startup profiles)
    const { count: totalStartups } = await supabaseClient
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('user_type', 'startup')

    // Get active applications (pending status)
    const { count: activeApplications } = await supabaseClient
      .from('incubation_applications')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')

    // Get total investors
    const { count: totalInvestors } = await supabaseClient
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('user_type', 'investor')

    // Get active deals (approved applications)
    const { count: activeDeals } = await supabaseClient
      .from('incubation_applications')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved')

    // Get total users
    const { count: totalUsers } = await supabaseClient
      .from('profiles')
      .select('*', { count: 'exact', head: true })

    // Calculate monthly growth (simplified)
    const lastMonth = new Date()
    lastMonth.setMonth(lastMonth.getMonth() - 1)
    
    const { count: lastMonthApplications } = await supabaseClient
      .from('incubation_applications')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', lastMonth.toISOString())

    const { count: thisMonthApplications } = await supabaseClient
      .from('incubation_applications')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', new Date().toISOString().slice(0, 7) + '-01')

    const monthlyGrowth = lastMonthApplications > 0 
      ? ((thisMonthApplications - lastMonthApplications) / lastMonthApplications) * 100 
      : 0

    const stats = {
      totalStartups: totalStartups || 0,
      activeApplications: activeApplications || 0,
      totalInvestors: totalInvestors || 0,
      totalDeals: activeDeals || 0,
      monthlyGrowth: Math.round(monthlyGrowth * 10) / 10,
      totalUsers: totalUsers || 0,
      pendingApplications: activeApplications || 0,
      approvedApplications: activeDeals || 0,
      rejectedApplications: 0, // Will be calculated separately if needed
      communityMembers: totalUsers || 0
    }

    return new Response(
      JSON.stringify({ success: true, data: stats }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to fetch dashboard stats' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

// Recent Applications Handler
async function handleRecentApplications(supabaseClient: any) {
  try {
    // Get recent applications from all tables
    const [incubationApps, investmentApps, programApps, hackathonApps] = await Promise.all([
      supabaseClient
        .from('incubation_applications')
        .select(`
          id,
          startup_name,
          founder_name,
          stage,
          status,
          created_at,
          email,
          phone,
          description,
          admin_notes,
          reviewed_by,
          reviewed_at,
          profiles:applicant_id (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false })
        .limit(10),

      supabaseClient
        .from('investment_applications')
        .select(`
          id,
          startup_name,
          founder_name,
          funding_stage,
          status,
          created_at,
          email,
          phone,
          description,
          admin_notes,
          reviewed_by,
          reviewed_at,
          profiles:applicant_id (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false })
        .limit(10),

      supabaseClient
        .from('program_applications')
        .select(`
          id,
          startup_name,
          founder_name,
          current_stage,
          status,
          created_at,
          email,
          phone,
          description,
          admin_notes,
          reviewed_by,
          reviewed_at,
          profiles:applicant_id (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false })
        .limit(10),

      supabaseClient
        .from('hackathon_registrations')
        .select(`
          id,
          team_name,
          full_name,
          track,
          status,
          created_at,
          email,
          phone,
          project_idea,
          admin_notes,
          reviewed_by,
          reviewed_at,
          profiles:user_id (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false })
        .limit(10)
    ])

    // Combine and format all applications
    const allApplications = [
      ...(incubationApps.data || []).map(app => ({
        ...app,
        type: 'incubation',
        startup: app.startup_name,
        founder: app.founder_name,
        stage: app.stage,
        date: new Date(app.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      })),
      ...(investmentApps.data || []).map(app => ({
        ...app,
        type: 'investment',
        startup: app.startup_name,
        founder: app.founder_name,
        stage: app.funding_stage,
        date: new Date(app.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      })),
      ...(programApps.data || []).map(app => ({
        ...app,
        type: 'program',
        startup: app.startup_name,
        founder: app.founder_name,
        stage: app.current_stage,
        date: new Date(app.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      })),
      ...(hackathonApps.data || []).map(app => ({
        ...app,
        type: 'hackathon',
        startup: app.team_name,
        founder: app.full_name,
        stage: app.track,
        date: new Date(app.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      }))
    ]

    // Sort by creation date and take the most recent 10
    const recentApplications = allApplications
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 10)

    return new Response(
      JSON.stringify({ success: true, data: recentApplications }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error fetching recent applications:', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to fetch recent applications' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

// Top Startups Handler
async function handleTopStartups(supabaseClient: any) {
  try {
    // Get top performing startups based on various metrics
    const { data: topStartups, error } = await supabaseClient
      .from('profiles')
      .select(`
        id,
        full_name,
        company_name,
        sector,
        description,
        website,
        team_size,
        created_at,
        incubation_applications!inner (
          status,
          stage,
          created_at
        )
      `)
      .eq('user_type', 'startup')
      .eq('incubation_applications.status', 'approved')
      .order('created_at', { ascending: false })
      .limit(3)

    if (error) throw error

    // Format the data
    const formattedStartups = (topStartups || []).map((startup: any, index: number) => ({
      id: startup.id,
      name: startup.company_name || startup.full_name,
      sector: startup.sector || 'Technology',
      valuation: `₹${(Math.random() * 50 + 10).toFixed(0)}Cr`,
      growth: `+${(Math.random() * 30 + 20).toFixed(0)}%`,
      status: startup.incubation_applications?.[0]?.stage || 'Seed',
      founder_name: startup.full_name,
      email: startup.email,
      description: startup.description,
      website: startup.website,
      team_size: startup.team_size,
      created_at: startup.created_at
    }))

    return new Response(
      JSON.stringify({ success: true, data: formattedStartups }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error fetching top startups:', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to fetch top startups' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

// Application Details Handler
async function handleApplicationDetails(req: Request, supabaseClient: any) {
  try {
    const { applicationId, applicationType } = await req.json()

    let tableName = ''
    let selectFields = ''

    switch (applicationType) {
      case 'incubation':
        tableName = 'incubation_applications'
        selectFields = `
          *,
          profiles:applicant_id (
            full_name,
            email,
            phone
          )
        `
        break
      case 'investment':
        tableName = 'investment_applications'
        selectFields = `
          *,
          profiles:applicant_id (
            full_name,
            email,
            phone
          )
        `
        break
      case 'program':
        tableName = 'program_applications'
        selectFields = `
          *,
          profiles:applicant_id (
            full_name,
            email,
            phone
          )
        `
        break
      case 'hackathon':
        tableName = 'hackathon_registrations'
        selectFields = `
          *,
          profiles:user_id (
            full_name,
            email,
            phone
          )
        `
        break
      default:
        throw new Error('Invalid application type')
    }

    const { data: application, error } = await supabaseClient
      .from(tableName)
      .select(selectFields)
      .eq('id', applicationId)
      .single()

    if (error) throw error

    return new Response(
      JSON.stringify({ success: true, data: application }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error fetching application details:', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to fetch application details' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

// Update Application Status Handler
async function handleUpdateApplicationStatus(req: Request, supabaseClient: any) {
  try {
    const { applicationId, applicationType, status, adminNotes, sendEmail } = await req.json()

    let tableName = ''
    let updateData: any = {
      status,
      admin_notes: adminNotes,
      reviewed_by: (await supabaseClient.auth.getUser()).data.user?.id,
      reviewed_at: new Date().toISOString()
    }

    switch (applicationType) {
      case 'incubation':
        tableName = 'incubation_applications'
        break
      case 'investment':
        tableName = 'investment_applications'
        break
      case 'program':
        tableName = 'program_applications'
        break
      case 'hackathon':
        tableName = 'hackathon_registrations'
        break
      default:
        throw new Error('Invalid application type')
    }

    // Update the application status
    const { data: updatedApplication, error: updateError } = await supabaseClient
      .from(tableName)
      .update(updateData)
      .eq('id', applicationId)
      .select()
      .single()

    if (updateError) throw updateError

    // Send email notification if requested
    if (sendEmail && updatedApplication) {
      try {
        const emailData = {
          to: updatedApplication.email,
          type: `${applicationType}_status_update`,
          data: {
            applicationType,
            status,
            adminNotes,
            applicationDetails: updatedApplication
          }
        }

        // Call the email service
        const emailResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-hackathon-email`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(emailData)
        })

        if (!emailResponse.ok) {
          console.warn('Failed to send status update email')
        }
      } catch (emailError) {
        console.warn('Email sending failed:', emailError)
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: updatedApplication,
        message: 'Application status updated successfully'
      }),
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
