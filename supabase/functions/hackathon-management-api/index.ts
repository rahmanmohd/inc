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

    // Get user from JWT
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

    if (profile?.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { method } = req
    const url = new URL(req.url)
    const path = url.pathname.split('/').pop()

    switch (method) {
      case 'GET':
        if (path === 'list') {
          return await getHackathons(supabaseClient, url)
        } else if (path && path !== 'list') {
          return await getHackathon(supabaseClient, path)
        }
        break

      case 'POST':
        return await createHackathon(supabaseClient, req)

      case 'PUT':
        if (path && path !== 'list') {
          return await updateHackathon(supabaseClient, path, req)
        }
        break

      case 'DELETE':
        if (path && path !== 'list') {
          return await deleteHackathon(supabaseClient, path)
        }
        break

      default:
        return new Response(
          JSON.stringify({ error: 'Method not allowed' }),
          { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }

    return new Response(
      JSON.stringify({ error: 'Endpoint not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

// Get all hackathons (admin view)
async function getHackathons(supabase: any, url: URL) {
  const { data, error } = await supabase
    .from('hackathons')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error

  return new Response(
    JSON.stringify({ data }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

// Get single hackathon
async function getHackathon(supabase: any, id: string) {
  const { data, error } = await supabase
    .from('hackathons')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error

  return new Response(
    JSON.stringify({ data }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

// Create new hackathon
async function createHackathon(supabase: any, req: Request) {
  const body = await req.json()
  
  // Validate required fields
  const requiredFields = ['title', 'subtitle', 'description', 'start_date', 'end_date', 'location']
  for (const field of requiredFields) {
    if (!body[field]) {
      return new Response(
        JSON.stringify({ error: `Missing required field: ${field}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
  }

  // Validate dates
  const startDate = new Date(body.start_date)
  const endDate = new Date(body.end_date)
  if (startDate >= endDate) {
    return new Response(
      JSON.stringify({ error: 'Start date must be before end date' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  if (body.registration_open_date && body.registration_close_date) {
    const regOpen = new Date(body.registration_open_date)
    const regClose = new Date(body.registration_close_date)
    if (regOpen >= regClose) {
      return new Response(
        JSON.stringify({ error: 'Registration open date must be before close date' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
  }

  const { data, error } = await supabase
    .from('hackathons')
    .insert({
      ...body,
      created_by: (await supabase.auth.getUser()).data.user?.id,
      status: body.status || 'draft'
    })
    .select()
    .single()

  if (error) throw error

  return new Response(
    JSON.stringify({ data, message: 'Hackathon created successfully' }),
    { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

// Update hackathon
async function updateHackathon(supabase: any, id: string, req: Request) {
  const body = await req.json()
  
  // Validate dates if provided
  if (body.start_date && body.end_date) {
    const startDate = new Date(body.start_date)
    const endDate = new Date(body.end_date)
    if (startDate >= endDate) {
      return new Response(
        JSON.stringify({ error: 'Start date must be before end date' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
  }

  const { data, error } = await supabase
    .from('hackathons')
    .update({
      ...body,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  return new Response(
    JSON.stringify({ data, message: 'Hackathon updated successfully' }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

// Delete hackathon
async function deleteHackathon(supabase: any, id: string) {
  // Check if hackathon has registrations
  const { data: registrations } = await supabase
    .from('hackathon_registrations')
    .select('id')
    .eq('hackathon_id', id)
    .limit(1)

  if (registrations && registrations.length > 0) {
    return new Response(
      JSON.stringify({ error: 'Cannot delete hackathon with existing registrations' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  const { error } = await supabase
    .from('hackathons')
    .delete()
    .eq('id', id)

  if (error) throw error

  return new Response(
    JSON.stringify({ message: 'Hackathon deleted successfully' }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}
