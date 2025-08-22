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

    console.log('Analytics Management API - Endpoint:', endpoint, 'User ID:', userId)

    switch (endpoint) {
      case 'growth-metrics':
        return await handleGrowthMetrics(supabase)
      
      case 'sector-distribution':
        return await handleSectorDistribution(supabase)
      
      case 'application-trends':
        return await handleApplicationTrends(supabase)
      
      case 'investment-stages':
        return await handleInvestmentStages(supabase)
      
      case 'monthly-stats':
        return await handleMonthlyStats(supabase)
      
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid endpoint' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
  } catch (error) {
    console.error('Analytics Management API Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function handleGrowthMetrics(supabase: any) {
  try {
    console.log('Fetching growth metrics...')
    
    // Get current date and previous month
    const currentDate = new Date()
    const currentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const previousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)

    // New Startups Growth
    const { count: currentStartups } = await supabase
      .from('startups')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', currentMonth.toISOString())

    const { count: previousStartups } = await supabase
      .from('startups')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', previousMonth.toISOString())
      .lt('created_at', currentMonth.toISOString())

    const newStartupsGrowth = calculateGrowthRate(currentStartups || 0, previousStartups || 0)

    // Application Rate Growth
    const applicationTables = ['incubation_applications', 'investment_applications', 'program_applications', 'mentor_applications']
    let currentApplications = 0
    let previousApplications = 0

    for (const table of applicationTables) {
      const { count: current } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })
        .gte('created_at', currentMonth.toISOString())

      const { count: previous } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })
        .gte('created_at', previousMonth.toISOString())
        .lt('created_at', currentMonth.toISOString())

      currentApplications += current || 0
      previousApplications += previous || 0
    }

    const applicationRateGrowth = calculateGrowthRate(currentApplications, previousApplications)

    // Investor Engagement (based on deals and investments)
    const { count: currentDeals } = await supabase
      .from('deals')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', currentMonth.toISOString())

    const { count: previousDeals } = await supabase
      .from('deals')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', previousMonth.toISOString())
      .lt('created_at', currentMonth.toISOString())

    const investorEngagementGrowth = calculateGrowthRate(currentDeals || 0, previousDeals || 0)

    // Deal Claims (active deals)
    const { count: currentActiveDeal } = await supabase
      .from('deals')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')
      .gte('created_at', currentMonth.toISOString())

    const { count: previousActiveDeals } = await supabase
      .from('deals')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')
      .gte('created_at', previousMonth.toISOString())
      .lt('created_at', currentMonth.toISOString())

    const dealClaimsGrowth = calculateGrowthRate(currentActiveDeal || 0, previousActiveDeals || 0)

    const growthMetrics = {
      newStartups: newStartupsGrowth,
      applicationRate: applicationRateGrowth,
      investorEngagement: investorEngagementGrowth,
      dealClaims: dealClaimsGrowth,
      period: {
        current: currentMonth.toISOString(),
        previous: previousMonth.toISOString()
      }
    }

    console.log('Growth metrics:', growthMetrics)

    return new Response(
      JSON.stringify({ success: true, data: growthMetrics }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in handleGrowthMetrics:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch growth metrics', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

async function handleSectorDistribution(supabase: any) {
  try {
    console.log('Fetching sector distribution...')
    
    // Get sector distribution from startups
    const { data: startups } = await supabase
      .from('startups')
      .select('industry')

    // Get sector distribution from deals
    const { data: deals } = await supabase
      .from('deals')
      .select('sector')

    // Combine and count sectors
    const sectorCounts: { [key: string]: number } = {}
    let totalCount = 0

    // Count from startups
    if (startups) {
      startups.forEach((startup: any) => {
        if (startup.industry) {
          sectorCounts[startup.industry] = (sectorCounts[startup.industry] || 0) + 1
          totalCount++
        }
      })
    }

    // Count from deals
    if (deals) {
      deals.forEach((deal: any) => {
        if (deal.sector) {
          sectorCounts[deal.sector] = (sectorCounts[deal.sector] || 0) + 1
          totalCount++
        }
      })
    }

    // Convert to percentage and sort
    const sectorDistribution = Object.entries(sectorCounts)
      .map(([sector, count]) => ({
        sector,
        count,
        percentage: totalCount > 0 ? Math.round((count / totalCount) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10) // Top 10 sectors

    // If no real data, provide sample data
    if (sectorDistribution.length === 0) {
      const sampleSectors = [
        { sector: 'FinTech', count: 32, percentage: 32 },
        { sector: 'HealthTech', count: 24, percentage: 24 },
        { sector: 'EdTech', count: 18, percentage: 18 },
        { sector: 'E-commerce', count: 15, percentage: 15 },
        { sector: 'Others', count: 11, percentage: 11 }
      ]
      return new Response(
        JSON.stringify({ success: true, data: sampleSectors }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Sector distribution:', sectorDistribution)

    return new Response(
      JSON.stringify({ success: true, data: sectorDistribution }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in handleSectorDistribution:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch sector distribution', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

async function handleApplicationTrends(supabase: any) {
  try {
    console.log('Fetching application trends...')
    
    // Get applications from last 6 months
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const applicationTables = ['incubation_applications', 'investment_applications', 'program_applications', 'mentor_applications']
    const monthlyData: { [key: string]: number } = {}

    for (const table of applicationTables) {
      const { data: applications } = await supabase
        .from(table)
        .select('created_at')
        .gte('created_at', sixMonthsAgo.toISOString())

      if (applications) {
        applications.forEach((app: any) => {
          const date = new Date(app.created_at)
          const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
          monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1
        })
      }
    }

    // Convert to array and sort by date
    const trends = Object.entries(monthlyData)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())

    console.log('Application trends:', trends)

    return new Response(
      JSON.stringify({ success: true, data: trends }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in handleApplicationTrends:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch application trends', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

async function handleInvestmentStages(supabase: any) {
  try {
    console.log('Fetching investment stages...')
    
    // Get deal stages from deals table
    const { data: deals } = await supabase
      .from('deals')
      .select('deal_stage')

    // Count stages
    const stageCounts: { [key: string]: number } = {}

    // Count from deals
    if (deals) {
      deals.forEach((deal: any) => {
        if (deal.deal_stage) {
          stageCounts[deal.deal_stage] = (stageCounts[deal.deal_stage] || 0) + 1
        }
      })
    }

    // Convert to array and sort
    const investmentStages = Object.entries(stageCounts)
      .map(([stage, count]) => ({ stage, count }))
      .sort((a, b) => b.count - a.count)

    // If no real data, provide sample data
    if (investmentStages.length === 0) {
      const sampleStages = [
        { stage: 'Pre-Seed', count: 45 },
        { stage: 'Seed', count: 89 },
        { stage: 'Series A', count: 34 },
        { stage: 'Series B+', count: 12 }
      ]
      return new Response(
        JSON.stringify({ success: true, data: sampleStages }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Investment stages:', investmentStages)

    return new Response(
      JSON.stringify({ success: true, data: investmentStages }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in handleInvestmentStages:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch investment stages', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

async function handleMonthlyStats(supabase: any) {
  try {
    console.log('Fetching monthly stats...')
    
    const currentDate = new Date()
    const currentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    
    // Get monthly stats for various metrics
    const [startupsCount, applicationsCount, dealsCount, investorsCount] = await Promise.all([
      supabase.from('startups').select('*', { count: 'exact', head: true }).gte('created_at', currentMonth.toISOString()),
      supabase.from('incubation_applications').select('*', { count: 'exact', head: true }).gte('created_at', currentMonth.toISOString()),
      supabase.from('deals').select('*', { count: 'exact', head: true }).gte('created_at', currentMonth.toISOString()),
      supabase.from('investors').select('*', { count: 'exact', head: true }).gte('created_at', currentMonth.toISOString())
    ])

    const monthlyStats = {
      startups: startupsCount.count || 0,
      applications: applicationsCount.count || 0,
      deals: dealsCount.count || 0,
      investors: investorsCount.count || 0,
      month: currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    }

    console.log('Monthly stats:', monthlyStats)

    return new Response(
      JSON.stringify({ success: true, data: monthlyStats }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in handleMonthlyStats:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch monthly stats', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

// Helper function to calculate growth rate
function calculateGrowthRate(current: number, previous: number): number {
  if (previous === 0) {
    return current > 0 ? 100 : 0
  }
  return Math.round(((current - previous) / previous) * 100 * 10) / 10 // Round to 1 decimal
}