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
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { method } = req
    const url = new URL(req.url)
    const path = url.pathname.split('/').pop()

    switch (method) {
      case 'GET':
        if (path === 'list') {
          return await getPublicHackathons(supabaseClient)
        } else if (path && path !== 'list') {
          return await getPublicHackathon(supabaseClient, path)
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

// Get all published hackathons (public view)
async function getPublicHackathons(supabase: any) {
  const today = new Date().toISOString()
  
  const { data, error } = await supabase
    .from('hackathons')
    .select('*')
    .eq('published', true)
    .gte('end_date', today)
    .order('start_date', { ascending: true })

  if (error) throw error

  // Add registration status to each hackathon
  const hackathonsWithStatus = data?.map(hackathon => {
    const now = new Date()
    const regOpen = hackathon.registration_open_date ? new Date(hackathon.registration_open_date) : null
    const regClose = hackathon.registration_close_date ? new Date(hackathon.registration_close_date) : null
    
    let registrationStatus = 'closed'
    if (regOpen && regClose) {
      if (now >= regOpen && now <= regClose) {
        registrationStatus = 'registration_open'
      } else if (now < regOpen) {
        registrationStatus = 'registration_soon'
      }
    } else if (regOpen && now >= regOpen) {
      registrationStatus = 'registration_open'
    } else if (regOpen && now < regOpen) {
      registrationStatus = 'registration_soon'
    }

    return {
      ...hackathon,
      registration_status: registrationStatus
    }
  }) || []

  return new Response(
    JSON.stringify({ data: hackathonsWithStatus }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

// Get single public hackathon
async function getPublicHackathon(supabase: any, id: string) {
  const { data, error } = await supabase
    .from('hackathons')
    .select('*')
    .eq('id', id)
    .eq('status', 'published')
    .single()

  if (error) throw error

  // Add registration status
  const now = new Date()
  const regOpen = data.registration_open_date ? new Date(data.registration_open_date) : null
  const regClose = data.registration_close_date ? new Date(data.registration_close_date) : null
  
  let registrationStatus = 'closed'
  if (regOpen && regClose) {
    if (now >= regOpen && now <= regClose) {
      registrationStatus = 'registration_open'
    } else if (now < regOpen) {
      registrationStatus = 'registration_soon'
    }
  } else if (regOpen && now >= regOpen) {
    registrationStatus = 'registration_open'
  } else if (regOpen && now < regOpen) {
    registrationStatus = 'registration_soon'
  }

  const hackathonWithStatus = {
    ...data,
    registration_status: registrationStatus
  }

  return new Response(
    JSON.stringify({ data: hackathonWithStatus }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}
