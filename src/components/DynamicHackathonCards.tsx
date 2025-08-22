import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Users, Trophy, Clock } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { HackathonRegistrationDialog } from './HackathonRegistrationDialog'
import { supabase } from '@/lib/supabase'

interface Hackathon {
  id: string
  title: string
  subtitle: string
  description: string
  start_date: string
  end_date: string
  registration_open_date?: string
  registration_close_date?: string
  location: string
  prize_pool: string
  expected_participants: number
  tags: string[]
  registration_status: 'registration_open' | 'registration_soon' | 'closed'
}

export const DynamicHackathonCards: React.FC = () => {
  const { toast } = useToast()
  const [hackathons, setHackathons] = useState<Hackathon[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedHackathon, setSelectedHackathon] = useState<Hackathon | null>(null)
  const [registrationDialogOpen, setRegistrationDialogOpen] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchHackathons()
  }, [])

  const fetchHackathons = async () => {
    try {
      setLoading(true)
      
      // Use Supabase client directly
      const today = new Date().toISOString()
      
      const { data, error } = await supabase
        .from('hackathons')
        .select('*')
        .eq('published', true)
        .gte('end_date', today)
        .order('start_date', { ascending: true })

      if (error) throw error

      console.log('Fetched hackathons:', data) // Debug log

      // Add registration status to each hackathon
      const hackathonsWithStatus = data?.map(hackathon => {
        const now = new Date()
        const regOpen = hackathon.registration_open_date ? new Date(hackathon.registration_open_date) : null
        const regClose = hackathon.registration_close_date ? new Date(hackathon.registration_close_date) : null
        
        let registrationStatus: 'registration_open' | 'registration_soon' | 'closed' = 'closed'
        
        // If no registration dates are set, default to open for published hackathons
        if (!regOpen && !regClose) {
          registrationStatus = 'registration_open'
        } else if (regOpen && regClose) {
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

      setHackathons(hackathonsWithStatus)
    } catch (error) {
      console.error('Error fetching hackathons:', error)
      toast({
        title: "Error",
        description: "Failed to load upcoming hackathons",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = (hackathon: Hackathon) => {
    setSelectedHackathon(hackathon)
    setRegistrationDialogOpen(true)
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchHackathons()
    setRefreshing(false)
    toast({
      title: "Refreshed",
      description: "Hackathon list updated successfully!"
    })
  }

  const handleRegistrationSuccess = () => {
    setRegistrationDialogOpen(false)
    setSelectedHackathon(null)
    toast({
      title: "Success",
      description: "Registration submitted successfully!"
    })
    // Optionally refresh hackathons to update registration counts
    fetchHackathons()
  }

  const getRegistrationButton = (hackathon: Hackathon) => {
    switch (hackathon.registration_status) {
      case 'registration_open':
        return (
          <Button 
            onClick={() => handleRegister(hackathon)}
            className="w-full bg-orange-600 hover:bg-orange-700"
          >
            Register Now
          </Button>
        )
      case 'registration_soon':
        return (
          <Button 
            disabled 
            className="w-full bg-gray-400 cursor-not-allowed"
          >
            Registration Opens Soon
          </Button>
        )
      case 'closed':
        return (
          <Button 
            disabled 
            className="w-full bg-gray-400 cursor-not-allowed"
          >
            Registration Closed
          </Button>
        )
      default:
        return (
          <Button 
            disabled 
            className="w-full bg-gray-400 cursor-not-allowed"
          >
            Registration TBD
          </Button>
        )
    }
  }

  const getStatusBadge = (hackathon: Hackathon) => {
    switch (hackathon.registration_status) {
      case 'registration_open':
        return <Badge className="bg-orange-600">Registration Open</Badge>
      case 'registration_soon':
        return <Badge variant="secondary">Coming Soon</Badge>
      case 'closed':
        return <Badge variant="outline">Registration Closed</Badge>
      default:
        return <Badge variant="outline">TBD</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (hackathons.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-muted-foreground mb-2">
          No upcoming hackathons
        </h3>
        <p className="text-muted-foreground mb-4">
          Check back soon for exciting new opportunities!
        </p>
        <Button 
          variant="outline" 
          onClick={fetchHackathons}
          className="mx-auto"
        >
          Refresh
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hackathons.map((hackathon) => (
          <Card key={hackathon.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start mb-2">
                {getStatusBadge(hackathon)}
              </div>
              <CardTitle className="text-xl leading-tight">{hackathon.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{hackathon.subtitle}</p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {hackathon.description}
              </p>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {formatDate(hackathon.start_date)} - {formatDate(hackathon.end_date)}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{hackathon.location}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                  <span>Prize Pool: {hackathon.prize_pool}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{hackathon.expected_participants}+ participants expected</span>
                </div>
                
                {hackathon.registration_open_date && hackathon.registration_close_date && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Register by: {formatDate(hackathon.registration_close_date)}
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-2">
                {getRegistrationButton(hackathon)}
                
                <Button 
                  variant="outline" 
                  className="w-full mt-2"
                  onClick={() => {
                    // Handle learn more - could open a detailed view
                    toast({
                      title: "Learn More",
                      description: `More details about ${hackathon.title} coming soon!`
                    })
                  }}
                >
                  Learn More
                </Button>
              </div>

              {hackathon.tags && hackathon.tags.length > 0 && (
                <div className="flex gap-2 flex-wrap pt-2">
                  {hackathon.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {hackathon.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{hackathon.tags.length - 3} more
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Registration Dialog */}
      {selectedHackathon && (
        <HackathonRegistrationDialog
          open={registrationDialogOpen}
          onOpenChange={setRegistrationDialogOpen}
          hackathon={selectedHackathon}
          onSuccess={handleRegistrationSuccess}
        />
      )}
    </>
  )
}
