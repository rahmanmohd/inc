import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase'
import { EmailService } from '@/lib/emailService'
import { Tables } from '@/types/supabase-latest'
import { 
  Search, 
  Download, 
  Eye, 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign,
  Clock,
  User,
  Mail,
  Phone,
  GraduationCap,
  Code,
  Github,
  Linkedin,
  ExternalLink,
  Building,
  Target,
  Lightbulb
} from 'lucide-react'

type IncubationApplication = Tables<'incubation_applications_new'>
type IncubationProgram = Tables<'incubation_programs'>

interface IncubationApplicationsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  program: IncubationProgram
}

export const IncubationApplicationsDialog: React.FC<IncubationApplicationsDialogProps> = ({
  open,
  onOpenChange,
  program
}) => {
  const { toast } = useToast()
  const [applications, setApplications] = useState<IncubationApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [stageFilter, setStageFilter] = useState<string>('all')
  const [selectedApplication, setSelectedApplication] = useState<IncubationApplication | null>(null)
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false)

  useEffect(() => {
    if (open && program) {
      fetchApplications()
    }
  }, [open, program])

  const fetchApplications = async () => {
    try {
      setLoading(true)
      console.log('Fetching applications for program ID:', program.id)
      
      const { data, error } = await supabase
        .from('incubation_applications_new')
        .select('*')
        .eq('program_id', program.id)
        .order('created_at', { ascending: false })

      console.log('Applications fetch result:', { data, error, count: data?.length })
      
      if (error) throw error
      setApplications((data || []) as IncubationApplication[])
    } catch (error) {
      console.error('Error fetching applications:', error)
      toast({
        title: "Error",
        description: "Failed to fetch applications",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredApplications = applications.filter(application => {
    const matchesSearch = 
      application.founder_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.startup_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.industry?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || application.status === statusFilter
    const matchesStage = stageFilter === 'all' || application.stage === stageFilter

    return matchesSearch && matchesStatus && matchesStage
  })

  const exportApplications = () => {
    const csvContent = [
      ['Founder Name', 'Startup Name', 'Email', 'Phone', 'Industry', 'Stage', 'Team Size', 'Status', 'Applied Date'],
      ...filteredApplications.map(app => [
        app.founder_name,
        app.startup_name,
        app.email,
        app.phone || '',
        app.industry || '',
        app.stage || '',
        app.team_size?.toString() || '',
        app.status || 'submitted',
        new Date(app.created_at).toLocaleDateString()
      ])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${program.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_applications.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const updateApplicationStatus = async (applicationId: string, newStatus: string) => {
    try {
      // Get the current application to get old status
      const currentApplication = applications.find(app => app.id === applicationId)
      if (!currentApplication) {
        throw new Error('Application not found')
      }

      const oldStatus = currentApplication.status || 'submitted'

      const { error } = await supabase
        .from('incubation_applications_new')
        .update({ 
          status: newStatus,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', applicationId)

      if (error) throw error

      // Send status update email
      try {
        const emailResult = await EmailService.sendIncubationStatusUpdate(
          { title: program.title } as { title: string; [key: string]: unknown },
          {
            email: currentApplication.email,
            founder_name: currentApplication.founder_name,
            startup_name: currentApplication.startup_name
          } as { email: string; founder_name: string; startup_name: string },
          oldStatus,
          newStatus
        )
        
        if (emailResult.success) {
          console.log('Status update email sent successfully')
        } else {
          console.warn('Failed to send status update email:', emailResult.error)
        }
      } catch (emailError) {
        console.error('Error sending status update email:', emailError)
        // Don't fail the status update if email fails
      }

      toast({
        title: "Success",
        description: `Application status updated to ${newStatus}. Email notification sent.`
      })

      fetchApplications()
    } catch (error) {
      console.error('Error updating application status:', error)
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive"
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-600">Approved</Badge>
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>
      case 'waitlisted':
        return <Badge className="bg-yellow-600">Waitlisted</Badge>
      case 'under_review':
        return <Badge className="bg-blue-600">Under Review</Badge>
      default:
        return <Badge variant="secondary">Submitted</Badge>
    }
  }

  const getStageBadge = (stage: string) => {
    switch (stage) {
      case 'idea':
        return <Badge variant="outline" className="text-blue-600 border-blue-600">Idea Stage</Badge>
      case 'mvp':
        return <Badge variant="outline" className="text-orange-600 border-orange-600">MVP</Badge>
      case 'early_traction':
        return <Badge variant="outline" className="text-purple-600 border-purple-600">Early Traction</Badge>
      case 'scaling':
        return <Badge variant="outline" className="text-green-600 border-green-600">Scaling</Badge>
      default:
        return <Badge variant="outline">{stage}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (!program) return null

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex justify-between items-start">
              <div>
                <DialogTitle className="text-2xl">Applications for {program.title}</DialogTitle>
                <p className="text-muted-foreground mt-1">
                  {program.subtitle} • {formatDate(program.start_date)} - {formatDate(program.end_date)}
                </p>
              </div>
              <Button onClick={exportApplications} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </DialogHeader>

          {/* Program Summary */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{applications.length}</div>
                  <div className="text-sm text-muted-foreground">Total Applications</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {applications.filter(app => app.status === 'approved').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Approved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {applications.filter(app => app.status === 'waitlisted').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Waitlisted</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {applications.filter(app => app.status === 'rejected').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Rejected</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="waitlisted">Waitlisted</SelectItem>
              </SelectContent>
            </Select>
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                <SelectItem value="idea">Idea Stage</SelectItem>
                <SelectItem value="mvp">MVP</SelectItem>
                <SelectItem value="early_traction">Early Traction</SelectItem>
                <SelectItem value="scaling">Scaling</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Applications List */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="pt-6">
                    <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                No applications found
              </h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' || stageFilter !== 'all' 
                  ? 'Try adjusting your filters' 
                  : 'Applications will appear here once users apply'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApplications.map((application) => (
                <Card key={application.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold">{application.founder_name}</h3>
                          {getStatusBadge(application.status)}
                          {getStageBadge(application.stage)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Building className="h-4 w-4" />
                            <span>{application.startup_name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            <span>{application.email}</span>
                          </div>
                          {application.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              <span>{application.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedApplication(application)
                            setViewDetailsOpen(true)
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Select
                          value={application.status}
                          onValueChange={(value) => updateApplicationStatus(application.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="submitted">Submitted</SelectItem>
                            <SelectItem value="under_review">Under Review</SelectItem>
                            <SelectItem value="approved">Approve</SelectItem>
                            <SelectItem value="waitlisted">Waitlist</SelectItem>
                            <SelectItem value="rejected">Reject</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      {application.industry && (
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-muted-foreground" />
                          <span>{application.industry}</span>
                        </div>
                      )}
                      {application.team_size && (
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{application.team_size} team members</span>
                        </div>
                      )}
                      {application.funding_requirements && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span>{application.funding_requirements}</span>
                        </div>
                      )}
                    </div>

                    {application.problem_statement && (
                      <div className="mt-4 p-3 bg-muted rounded-lg">
                        <p className="text-sm font-medium mb-1">Problem Statement:</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {application.problem_statement}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2 mt-4">
                      {application.linkedin_profile && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={application.linkedin_profile} target="_blank" rel="noopener noreferrer">
                            <Linkedin className="h-4 w-4 mr-2" />
                            LinkedIn
                          </a>
                        </Button>
                      )}
                      {application.website && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={application.website} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Website
                          </a>
                        </Button>
                      )}
                      {application.pitch_deck_url && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={application.pitch_deck_url} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4 mr-2" />
                            Pitch Deck
                          </a>
                        </Button>
                      )}
                    </div>

                    <div className="text-xs text-muted-foreground mt-3">
                      Applied on {formatDate(application.created_at)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Application Details Dialog */}
      <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Details - {selectedApplication?.founder_name}</DialogTitle>
          </DialogHeader>
          
          {selectedApplication && (
            <div className="space-y-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Founder Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Founder Name</label>
                    <p className="text-sm text-muted-foreground">{selectedApplication.founder_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Co-founder Name</label>
                    <p className="text-sm text-muted-foreground">{selectedApplication.cofounder_name || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="text-sm text-muted-foreground">{selectedApplication.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <p className="text-sm text-muted-foreground">{selectedApplication.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Education</label>
                    <p className="text-sm text-muted-foreground">{selectedApplication.education || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Experience</label>
                    <p className="text-sm text-muted-foreground">{selectedApplication.experience || 'Not provided'}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Startup Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Startup Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Startup Name</label>
                    <p className="text-sm text-muted-foreground">{selectedApplication.startup_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Industry</label>
                    <p className="text-sm text-muted-foreground">{selectedApplication.industry}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Stage</label>
                    <p className="text-sm text-muted-foreground">{selectedApplication.stage}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Team Size</label>
                    <p className="text-sm text-muted-foreground">{selectedApplication.team_size || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Website</label>
                    <p className="text-sm text-muted-foreground">{selectedApplication.website || 'Not provided'}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Business Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Business Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Problem Statement</label>
                    <p className="text-sm text-muted-foreground mt-1">{selectedApplication.problem_statement}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Solution Description</label>
                    <p className="text-sm text-muted-foreground mt-1">{selectedApplication.solution_description}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Target Market</label>
                    <p className="text-sm text-muted-foreground mt-1">{selectedApplication.target_market}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Business Model</label>
                    <p className="text-sm text-muted-foreground mt-1">{selectedApplication.business_model || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Revenue Model</label>
                    <p className="text-sm text-muted-foreground mt-1">{selectedApplication.revenue_model || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Current Traction</label>
                    <p className="text-sm text-muted-foreground mt-1">{selectedApplication.current_traction || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Funding Requirements</label>
                    <p className="text-sm text-muted-foreground mt-1">{selectedApplication.funding_requirements || 'Not provided'}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Vision & Mission */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Vision & Mission</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Mission</label>
                    <p className="text-sm text-muted-foreground mt-1">{selectedApplication.mission || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Vision</label>
                    <p className="text-sm text-muted-foreground mt-1">{selectedApplication.vision || 'Not provided'}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Links & Documents */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Links & Documents</CardTitle>
                </CardHeader>
                <CardContent className="flex gap-2">
                  {selectedApplication.linkedin_profile && (
                    <Button variant="outline" asChild>
                      <a href={selectedApplication.linkedin_profile} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="h-4 w-4 mr-2" />
                        LinkedIn Profile
                      </a>
                    </Button>
                  )}
                  {selectedApplication.website && (
                    <Button variant="outline" asChild>
                      <a href={selectedApplication.website} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Website
                      </a>
                    </Button>
                  )}
                  {selectedApplication.pitch_deck_url && (
                    <Button variant="outline" asChild>
                      <a href={selectedApplication.pitch_deck_url} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-2" />
                        Pitch Deck
                      </a>
                    </Button>
                  )}
                  {selectedApplication.financials_url && (
                    <Button variant="outline" asChild>
                      <a href={selectedApplication.financials_url} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-2" />
                        Financials
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
