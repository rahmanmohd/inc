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
      case 'investor-stats':
        return await handleInvestorStats(serviceClient)
      case 'investor-directory':
        return await handleInvestorDirectory(req, serviceClient)
      case 'add-investor':
        return await handleAddInvestor(req, serviceClient, user.id)
      case 'get-investor':
        return await handleGetInvestor(req, serviceClient)
      case 'update-investor':
        return await handleUpdateInvestor(req, serviceClient)
      case 'delete-investor':
        return await handleDeleteInvestor(req, serviceClient)
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid endpoint' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
  } catch (error) {
    console.error('Investor management API error:', error)
  return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

// Investor Stats Handler
async function handleInvestorStats(supabaseClient: any) {
  try {
    console.log('=== Investor Stats Handler Started ===')
    
    // Get total investors count
    const { count: totalInvestors, error: totalError } = await supabaseClient
      .from('investors')
      .select('*', { count: 'exact', head: true })

    if (totalError) throw totalError

    // Get active investors (status = 'active')
    const { count: activeInvestors, error: activeError } = await supabaseClient
      .from('investors')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')

    if (activeError) throw activeError

    // Get total portfolio value
    const { data: portfolioData, error: portfolioError } = await supabaseClient
      .from('investors')
      .select('portfolio_value')

    if (portfolioError) throw portfolioError

    const totalPortfolio = portfolioData?.reduce((sum: number, investor: any) => 
      sum + (investor.portfolio_value || 0), 0) || 0

    // Calculate average portfolio
    const avgPortfolio = totalInvestors > 0 ? totalPortfolio / totalInvestors : 0

    const stats = {
      totalInvestors: totalInvestors || 0,
      active: activeInvestors || 0,
      totalPortfolio: totalPortfolio,
      avgPortfolio: Math.round(avgPortfolio * 100) / 100 // Round to 2 decimal places
    }

    console.log('Investor stats calculated:', stats)

    return new Response(
      JSON.stringify({ success: true, data: stats }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error fetching investor stats:', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to fetch investor stats' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

// Investor Directory Handler
async function handleInvestorDirectory(req: Request, supabaseClient: any) {
  try {
    console.log('=== Investor Directory Handler Started ===')
    
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const sector = searchParams.get('sector') || ''
    const status = searchParams.get('status') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '1000') // High limit to get all investors
    const offset = (page - 1) * limit

    console.log('Investor Directory Handler - Parameters:', {
      search, sector, status, page, limit, offset
    })

    // First, let's test if we can access the investors table at all
    console.log('Testing basic investors table access...')
    const { data: testData, error: testError } = await supabaseClient
      .from('investors')
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
      .from('investors')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    // Apply filters
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,email.ilike.%${search}%`)
    }
    if (sector && sector !== 'all') {
      query = query.contains('sectors', [sector])
    }
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    console.log('Executing main query...')
    const { data: investors, error, count } = await query

    console.log('Investor Directory Query Result:', {
      investorsCount: investors?.length || 0,
      error: error?.message,
      count,
      hasData: !!investors,
      firstInvestor: investors?.[0]?.name || 'None'
    })

    if (error) {
      console.error('Main query failed:', error)
      throw error
    }

    // Format the data
    const formattedInvestors = (investors || []).map((investor: any) => ({
      id: investor.id,
      name: investor.name,
      checkSize: investor.check_size || '₹1-10Cr',
      portfolio: investor.portfolio_count || 0,
      stage: investor.investment_stage || 'Seed-Series A',
      status: investor.status || 'active',
      email: investor.email || '',
      description: investor.description || '',
      sectors: investor.sectors || [],
      recent_investments: investor.recent_investments || 0,
      success_rate: investor.success_rate || 0,
      portfolio_value: investor.portfolio_value || 0,
      created_at: investor.created_at
    }))

    console.log('Formatted investors count:', formattedInvestors.length)

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: formattedInvestors,
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
    console.error('Error fetching investor directory:', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to fetch investor directory' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

// Add Investor Handler
async function handleAddInvestor(req: Request, supabaseClient: any, userId: string) {
  try {
    console.log('=== Add Investor Handler Started ===')
    console.log('User ID:', userId)
    
    const body = await req.json()
    console.log('Request body:', body)
    
    const {
      name,
      description,
      email,
      check_size,
      investment_stage,
      sectors,
      portfolio_count,
      portfolio_value,
      recent_investments,
      success_rate,
      status = 'active'
    } = body

    // Validate required fields
    if (!name) {
      return new Response(
        JSON.stringify({ success: false, error: 'Investor name is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const insertData = {
      name,
      description,
      email,
      check_size,
      investment_stage,
      sectors: sectors || [],
      portfolio_count: portfolio_count || 0,
      portfolio_value: portfolio_value || 0,
      recent_investments: recent_investments || 0,
      success_rate: success_rate || 0,
      status,
      created_by: userId === 'service-role-user' ? null : userId
    }
    
    console.log('Insert data:', insertData)

    // Insert new investor
    const { data: investor, error } = await supabaseClient
      .from('investors')
      .insert([insertData])
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      console.error('Error details:', error.details)
      console.error('Error hint:', error.hint)
      throw error
    }

    console.log('Investor added successfully:', investor)

    return new Response(
      JSON.stringify({ success: true, data: investor }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error adding investor:', error)
    console.error('Error message:', error.message)
    console.error('Error details:', error.details)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to add investor',
        details: error.details || null
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

// Get Investor Handler
async function handleGetInvestor(req: Request, supabaseClient: any) {
  try {
    console.log('=== Get Investor Handler Started ===')
    
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    console.log('Get Investor Handler - ID:', id)

    if (!id) {
      return new Response(
        JSON.stringify({ success: false, error: 'Investor ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Use a simpler query without joins
    console.log('Executing get investor query...')
    const { data: investor, error } = await supabaseClient
      .from('investors')
      .select('*')
      .eq('id', id)
      .single()

    console.log('Get Investor Query Result:', {
      investorFound: !!investor,
      error: error?.message,
      investorId: investor?.id,
      investorName: investor?.name
    })

    if (error) {
      console.error('Get investor query failed:', error)
      throw error
    }

    if (!investor) {
      return new Response(
        JSON.stringify({ success: false, error: 'Investor not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Returning investor:', investor.id)

    return new Response(
      JSON.stringify({ success: true, data: investor }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error fetching investor:', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to fetch investor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

// Update Investor Handler
async function handleUpdateInvestor(req: Request, supabaseClient: any) {
  try {
    console.log('=== Update Investor Handler Started ===')
    
    const body = await req.json()
    console.log('Update Investor Handler - Request body:', body)
    
    const {
      id,
      name,
      description,
      email,
      check_size,
      investment_stage,
      sectors,
      portfolio_count,
      portfolio_value,
      recent_investments,
      success_rate,
      status
    } = body

    console.log('Update Investor Handler - ID:', id)

    if (!id) {
      return new Response(
        JSON.stringify({ success: false, error: 'Investor ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (email !== undefined) updateData.email = email
    if (check_size !== undefined) updateData.check_size = check_size
    if (investment_stage !== undefined) updateData.investment_stage = investment_stage
    if (sectors !== undefined) updateData.sectors = sectors
    if (portfolio_count !== undefined) updateData.portfolio_count = portfolio_count
    if (portfolio_value !== undefined) updateData.portfolio_value = portfolio_value
    if (recent_investments !== undefined) updateData.recent_investments = recent_investments
    if (success_rate !== undefined) updateData.success_rate = success_rate
    if (status !== undefined) updateData.status = status

    const { data: investor, error } = await supabaseClient
      .from('investors')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return new Response(
      JSON.stringify({ success: true, data: investor }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error updating investor:', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to update investor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

// Delete Investor Handler
async function handleDeleteInvestor(req: Request, supabaseClient: any) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return new Response(
        JSON.stringify({ success: false, error: 'Investor ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { error } = await supabaseClient
      .from('investors')
      .delete()
      .eq('id', id)

    if (error) throw error

    return new Response(
      JSON.stringify({ success: true, message: 'Investor deleted successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error deleting investor:', error)
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to delete investor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}
