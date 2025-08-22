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
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Check authentication
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let userId = null
    let isServiceRole = false

    // Check if it's a service role request
    if (authHeader.startsWith('Bearer ') && authHeader.length > 200) {
      // Service role request
      isServiceRole = true
      userId = 'service-role-user'
    } else {
      // Regular JWT request
      const token = authHeader.replace('Bearer ', '')
      const { data: { user }, error: authError } = await supabase.auth.getUser(token)
      
      if (authError || !user) {
        return new Response(
          JSON.stringify({ error: 'Invalid token', details: authError?.message }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      userId = user.id
    }

    // Check if user is admin (for non-service role requests)
    if (!isServiceRole) {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single()

      if (profileError || profile?.role !== 'admin') {
  return new Response(
          JSON.stringify({ error: 'Unauthorized', details: 'Admin access required' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    const { pathname } = new URL(req.url)
    const pathParts = pathname.split('/').filter(Boolean)
    const endpoint = pathParts[pathParts.length - 1]

    console.log('Deal Management API - Endpoint:', endpoint, 'User ID:', userId)

    switch (endpoint) {
      case 'deal-stats':
        return await handleDealStats(supabase)
      
      case 'deal-directory':
        return await handleDealDirectory(supabase, req)
      
      case 'add-deal':
        return await handleAddDeal(supabase, req, userId, isServiceRole)
      
      case 'get-deal':
        return await handleGetDeal(supabase, req)
      
      case 'update-deal':
        return await handleUpdateDeal(supabase, req, userId)
      
      case 'delete-deal':
        return await handleDeleteDeal(supabase, req)
      
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid endpoint' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
  } catch (error) {
    console.error('Deal Management API Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function handleDealStats(supabase: any) {
  try {
    console.log('Fetching deal stats...')
    
    // Get total deals
    const { count: totalDeals, error: totalError } = await supabase
      .from('deals')
      .select('*', { count: 'exact', head: true })

    if (totalError) {
      console.error('Error fetching total deals:', totalError)
      throw totalError
    }

    // Get active deals
    const { count: activeDeals, error: activeError } = await supabase
      .from('deals')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')

    if (activeError) {
      console.error('Error fetching active deals:', activeError)
      throw activeError
    }

    // Get total value
    const { data: valueData, error: valueError } = await supabase
      .from('deals')
      .select('deal_value')

    if (valueError) {
      console.error('Error fetching deal values:', valueError)
      throw valueError
    }

    const totalValue = valueData?.reduce((sum: number, deal: any) => {
      return sum + (parseFloat(deal.deal_value) || 0)
    }, 0) || 0

    // Get claims this month
    const currentDate = new Date()
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

    const { count: claimsThisMonth, error: claimsError } = await supabase
      .from('deals')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', firstDayOfMonth.toISOString())
      .lte('created_at', lastDayOfMonth.toISOString())

    if (claimsError) {
      console.error('Error fetching claims this month:', claimsError)
      throw claimsError
    }

    const stats = {
      totalDeals: totalDeals || 0,
      activeDeals: activeDeals || 0,
      totalValue: totalValue.toFixed(2),
      claimsThisMonth: claimsThisMonth || 0
    }

    console.log('Deal stats:', stats)

    return new Response(
      JSON.stringify({ success: true, data: stats }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in handleDealStats:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch deal stats', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

async function handleDealDirectory(supabase: any, req: Request) {
  try {
    const url = new URL(req.url)
    const search = url.searchParams.get('search') || ''
    const status = url.searchParams.get('status') || ''
    const limit = parseInt(url.searchParams.get('limit') || '50')
    const offset = parseInt(url.searchParams.get('offset') || '0')

    console.log('Fetching deal directory with params:', { search, status, limit, offset })

    let query = supabase
      .from('deals')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    if (search) {
      query = query.or(`deal_name.ilike.%${search}%,startup_name.ilike.%${search}%,investor_name.ilike.%${search}%`)
    }

    if (status) {
      query = query.eq('status', status)
    }

    const { data: deals, error, count } = await query
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching deals:', error)
      throw error
    }

    console.log(`Found ${deals?.length || 0} deals (total: ${count})`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: deals || [], 
        count: count || 0,
        pagination: {
          limit,
          offset,
          hasMore: (offset + limit) < (count || 0)
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in handleDealDirectory:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch deals', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

async function handleAddDeal(supabase: any, req: Request, userId: string, isServiceRole: boolean) {
  try {
    const body = await req.json()
    console.log('Adding deal with data:', body)

    const dealData = {
      deal_name: body.deal_name,
      startup_name: body.startup_name,
      investor_name: body.investor_name,
      deal_value: body.deal_value,
      deal_stage: body.deal_stage,
      sector: body.sector,
      description: body.description,
      status: body.status || 'active',
      created_by: isServiceRole ? null : userId,
      created_at: new Date().toISOString()
    }

    console.log('Deal data to insert:', dealData)

    const { data, error } = await supabase
      .from('deals')
      .insert([dealData])
      .select()
      .single()

    if (error) {
      console.error('Error adding deal:', error)
      throw error
    }

    console.log('Deal added successfully:', data)

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in handleAddDeal:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to add deal', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

async function handleGetDeal(supabase: any, req: Request) {
  try {
    const url = new URL(req.url)
    const dealId = url.searchParams.get('id')

    if (!dealId) {
      return new Response(
        JSON.stringify({ error: 'Deal ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Fetching deal with ID:', dealId)

    const { data, error } = await supabase
      .from('deals')
      .select('*')
      .eq('id', dealId)
      .single()

    if (error) {
      console.error('Error fetching deal:', error)
      throw error
    }

    console.log('Deal fetched successfully:', data)

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in handleGetDeal:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch deal', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

async function handleUpdateDeal(supabase: any, req: Request, userId: string) {
  try {
    const body = await req.json()
    const dealId = body.id

    if (!dealId) {
      return new Response(
        JSON.stringify({ error: 'Deal ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Updating deal with ID:', dealId, 'Data:', body)

    const updateData = {
      deal_name: body.deal_name,
      startup_name: body.startup_name,
      investor_name: body.investor_name,
      deal_value: body.deal_value,
      deal_stage: body.deal_stage,
      sector: body.sector,
      description: body.description,
      status: body.status,
      updated_at: new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('deals')
      .update(updateData)
      .eq('id', dealId)
      .select()
      .single()

    if (error) {
      console.error('Error updating deal:', error)
      throw error
    }

    console.log('Deal updated successfully:', data)

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in handleUpdateDeal:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to update deal', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

async function handleDeleteDeal(supabase: any, req: Request) {
  try {
    const url = new URL(req.url)
    const dealId = url.searchParams.get('id')

    if (!dealId) {
      return new Response(
        JSON.stringify({ error: 'Deal ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Deleting deal with ID:', dealId)

    const { error } = await supabase
      .from('deals')
      .delete()
      .eq('id', dealId)

    if (error) {
      console.error('Error deleting deal:', error)
      throw error
    }

    console.log('Deal deleted successfully')

    return new Response(
      JSON.stringify({ success: true, message: 'Deal deleted successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in handleDeleteDeal:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to delete deal', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}