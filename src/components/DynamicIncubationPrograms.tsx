import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase'
import { Tables } from '@/types/supabase-latest'
import { 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign, 
  Clock, 
  Star,
  RefreshCw,
  AlertCircle
} from 'lucide-react'

type IncubationProgram = Tables<'incubation_programs'>

interface DynamicIncubationProgramsProps {
  onApply?: (program: IncubationProgram) => void
}

export const DynamicIncubationPrograms: React.FC<DynamicIncubationProgramsProps> = ({ onApply }) => {
  const { toast } = useToast()
  const [programs, setPrograms] = useState<IncubationProgram[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPrograms()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchPrograms = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const today = new Date().toISOString().split('T')[0]
      
      const { data, error } = await supabase
        .from('incubation_programs')
        .select('*')
        .eq('published', true)
        .gte('end_date', today)
        .order('is_default', { ascending: false })
        .order('start_date', { ascending: true })

      console.log('Incubation programs fetch result:', { data, error, count: data?.length })
      
      if (error) throw error
      setPrograms(data || [])
    } catch (error) {
      console.error('Error fetching incubation programs:', error)
      setError('Failed to load upcoming incubation programs')
      toast({
        title: "Error",
        description: "Failed to load incubation programs",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const getApplicationStatus = (program: IncubationProgram) => {
    const now = new Date()
    const appOpen = program.application_open_date ? new Date(program.application_open_date) : null
    const appClose = program.application_close_date ? new Date(program.application_close_date) : null

    if (!appOpen || !appClose) {
      return { status: 'coming_soon', label: 'Coming Soon', color: 'bg-gray-500' }
    }

    if (now < appOpen) {
      return { status: 'future', label: 'Applications Open Soon', color: 'bg-blue-500' }
    } else if (now >= appOpen && now <= appClose) {
      return { status: 'open', label: 'Apply Now', color: 'bg-green-500' }
    } else {
      return { status: 'closed', label: 'Applications Closed', color: 'bg-red-500' }
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading incubation programs...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">
            {error}
          </h3>
          <Button onClick={fetchPrograms} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (programs.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">
            No upcoming incubation programs
          </h3>
          <p className="text-muted-foreground">
            Check back soon for new opportunities to accelerate your startup!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
             {/* Header */}
       <div className="text-center">
         <p className="text-muted-foreground mb-4">
           Transform your startup with expert mentorship, resources, and funding opportunities
         </p>
       </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((program) => {
          const appStatus = getApplicationStatus(program)
          
          return (
            <Card key={program.id} className="h-full flex flex-col hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-background via-background to-primary/5">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    {program.is_default && (
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    )}
                    <Badge variant={program.is_default ? "default" : "outline"} className="text-xs font-medium">
                      {program.is_default ? 'Featured' : 'Standard'}
                    </Badge>
                  </div>
                  <Badge className={`${appStatus.color} text-xs font-medium px-2 py-1`}>
                    {appStatus.label}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-bold line-clamp-2 mb-2">{program.title}</CardTitle>
                {program.subtitle && (
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {program.subtitle}
                  </p>
                )}
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                  {program.description}
                </p>
                
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg">
                    <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="font-medium">
                      {formatDate(program.start_date)} - {formatDate(program.end_date)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg">
                    <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="font-medium">{program.location}</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg">
                    <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="font-medium">{program.duration}</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg">
                    <Users className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="font-medium">{program.expected_startups} startups expected</span>
                  </div>
                  {program.funding_amount && (
                    <div className="flex items-center gap-3 p-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg border border-green-200/20">
                      <DollarSign className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="font-semibold text-green-700 dark:text-green-400">{program.funding_amount}</span>
                    </div>
                  )}
                  {program.equity_requirement && (
                    <div className="flex items-center gap-3 p-2 bg-orange-500/10 rounded-lg border border-orange-200/20">
                      <DollarSign className="h-4 w-4 text-orange-600 flex-shrink-0" />
                      <span className="font-semibold text-orange-700 dark:text-orange-400">Equity: {program.equity_requirement}</span>
                    </div>
                  )}
                </div>

                {program.tags && program.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {program.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs px-2 py-1 bg-primary/10 text-primary hover:bg-primary/20">
                        {tag}
                      </Badge>
                    ))}
                    {program.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs px-2 py-1 bg-muted text-muted-foreground">
                        +{program.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                <div className="mt-auto pt-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Applications:</span>
                    <span className="text-foreground font-semibold">{program.application_count || 0}</span>
                  </div>
                  <Button 
                    variant={appStatus.status === 'open' ? 'default' : 'outline'}
                    disabled={appStatus.status !== 'open'}
                    className={`w-full h-10 font-semibold transition-all duration-200 ${
                      appStatus.status === 'open' 
                        ? 'bg-gradient-to-r from-primary to-orange-400 hover:from-primary/90 hover:to-orange-400/90 shadow-lg hover:shadow-orange-500/25' 
                        : 'hover:bg-muted'
                    }`}
                    onClick={() => appStatus.status === 'open' && onApply?.(program)}
                  >
                    {appStatus.status === 'open' ? '🚀 Apply Now' : appStatus.label}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Refresh Button */}
      <div className="text-center">
        <Button onClick={fetchPrograms} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Programs
        </Button>
      </div>
    </div>
  )
}
