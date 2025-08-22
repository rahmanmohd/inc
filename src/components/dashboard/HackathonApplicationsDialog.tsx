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
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Calendar, 
  MapPin, 
  Users, 
  Trophy,
  Clock,
  User,
  Mail,
  Phone,
  GraduationCap,
  Code,
  Github,
  Linkedin,
  ExternalLink
} from 'lucide-react'

interface HackathonApplication {
  id: string
  user_id: string
  hackathon_id: string
  full_name: string
  email: string
  phone: string | null
  age: string | null
  city: string | null
  college: string | null
  graduation: string | null
  programming_languages: string | null
  experience: string | null
  frameworks: string | null
  specialization: string | null
  github_profile: string | null
  portfolio: string | null
  team_name: string | null
  team_size: string | null
  project_idea: string | null
  technical_skills: string | null
  previous_hackathons: string | null
  dietary_requirements: string | null
  accommodation: boolean
  linkedin_profile: string | null
  agreements: boolean
  status: string | null
  created_at: string
  updated_at: string
}

interface HackathonApplicationsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  hackathon: {
    id: string
    title: string
    subtitle: string
    start_date: string
    end_date: string
    location: string
    prize_pool: string
    expected_participants: number
  }
}

export const HackathonApplicationsDialog: React.FC<HackathonApplicationsDialogProps> = ({
  open,
  onOpenChange,
  hackathon
}) => {
  const { toast } = useToast()
  const [applications, setApplications] = useState<HackathonApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [experienceFilter, setExperienceFilter] = useState<string>('all')
  const [selectedApplication, setSelectedApplication] = useState<HackathonApplication | null>(null)
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false)

  useEffect(() => {
    if (open && hackathon) {
      fetchApplications()
    }
  }, [open, hackathon])

  const fetchApplications = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('hackathon_registrations')
        .select('*')
        .eq('hackathon_id', hackathon.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setApplications((data || []) as HackathonApplication[])
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
      application.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.college?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || application.status === statusFilter
    const matchesExperience = experienceFilter === 'all' || application.experience === experienceFilter

    return matchesSearch && matchesStatus && matchesExperience
  })

  const exportApplications = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'City', 'College', 'Experience', 'Programming Languages', 'Team Name', 'Project Idea', 'Status', 'Applied Date'],
      ...filteredApplications.map(app => [
        app.full_name,
        app.email,
        app.phone || '',
        app.city || '',
        app.college || '',
        app.experience || '',
        app.programming_languages || '',
        app.team_name || '',
        app.project_idea || '',
        app.status || 'pending',
        new Date(app.created_at).toLocaleDateString()
      ])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${hackathon.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_applications.csv`
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

      const oldStatus = currentApplication.status || 'pending'

      const { error } = await supabase
        .from('hackathon_registrations')
        .update({ status: newStatus })
        .eq('id', applicationId)

      if (error) throw error

      // Send status update email
      try {
        const emailResult = await EmailService.sendHackathonStatusUpdate(
          hackathon as { title: string; [key: string]: unknown },
          {
            email: currentApplication.email,
            full_name: currentApplication.full_name
          } as { email: string; full_name: string },
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

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-600">Approved</Badge>
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>
      case 'waitlisted':
        return <Badge className="bg-yellow-600">Waitlisted</Badge>
      default:
        return <Badge variant="secondary">Pending</Badge>
    }
  }

  const getExperienceBadge = (experience: string | null) => {
    switch (experience) {
      case 'beginner':
        return <Badge variant="outline" className="text-blue-600 border-blue-600">Beginner</Badge>
      case 'intermediate':
        return <Badge variant="outline" className="text-orange-600 border-orange-600">Intermediate</Badge>
      case 'advanced':
        return <Badge variant="outline" className="text-purple-600 border-purple-600">Advanced</Badge>
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

  if (!hackathon) return null

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex justify-between items-start">
              <div>
                <DialogTitle className="text-2xl">Applications for {hackathon.title}</DialogTitle>
                <p className="text-muted-foreground mt-1">
                  {hackathon.subtitle} • {formatDate(hackathon.start_date)} - {formatDate(hackathon.end_date)}
                </p>
              </div>
              <Button onClick={exportApplications} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </DialogHeader>

          {/* Hackathon Summary */}
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="waitlisted">Waitlisted</SelectItem>
              </SelectContent>
            </Select>
            <Select value={experienceFilter} onValueChange={setExperienceFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Experience Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
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
                {searchTerm || statusFilter !== 'all' || experienceFilter !== 'all' 
                  ? 'Try adjusting your filters' 
                  : 'Applications will appear here once users register'}
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
                          <h3 className="text-lg font-semibold">{application.full_name}</h3>
                          {getStatusBadge(application.status)}
                          {getExperienceBadge(application.experience)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
                          {application.city && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{application.city}</span>
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
                          value={application.status || 'pending'}
                          onValueChange={(value) => updateApplicationStatus(application.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="approved">Approve</SelectItem>
                            <SelectItem value="waitlisted">Waitlist</SelectItem>
                            <SelectItem value="rejected">Reject</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      {application.college && (
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-muted-foreground" />
                          <span>{application.college}</span>
                        </div>
                      )}
                      {application.programming_languages && (
                        <div className="flex items-center gap-2">
                          <Code className="h-4 w-4 text-muted-foreground" />
                          <span>{application.programming_languages}</span>
                        </div>
                      )}
                      {application.team_name && (
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>Team: {application.team_name} ({application.team_size} members)</span>
                        </div>
                      )}
                    </div>

                    {application.project_idea && (
                      <div className="mt-4 p-3 bg-muted rounded-lg">
                        <p className="text-sm font-medium mb-1">Project Idea:</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {application.project_idea}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2 mt-4">
                      {application.github_profile && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={application.github_profile} target="_blank" rel="noopener noreferrer">
                            <Github className="h-4 w-4 mr-2" />
                            GitHub
                          </a>
                        </Button>
                      )}
                      {application.linkedin_profile && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={application.linkedin_profile} target="_blank" rel="noopener noreferrer">
                            <Linkedin className="h-4 w-4 mr-2" />
                            LinkedIn
                          </a>
                        </Button>
                      )}
                      {application.portfolio && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={application.portfolio} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Portfolio
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
            <DialogTitle>Application Details - {selectedApplication?.full_name}</DialogTitle>
          </DialogHeader>
          
          {selectedApplication && (
            <div className="space-y-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Full Name</label>
                    <p className="text-sm text-muted-foreground">{selectedApplication.full_name}</p>
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
                    <label className="text-sm font-medium">Age</label>
                    <p className="text-sm text-muted-foreground">{selectedApplication.age || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">City</label>
                    <p className="text-sm text-muted-foreground">{selectedApplication.city || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">College/University</label>
                    <p className="text-sm text-muted-foreground">{selectedApplication.college || 'Not provided'}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Technical Skills */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Technical Skills</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Programming Languages</label>
                    <p className="text-sm text-muted-foreground">{selectedApplication.programming_languages || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Experience Level</label>
                    <p className="text-sm text-muted-foreground">{selectedApplication.experience || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Frameworks & Technologies</label>
                    <p className="text-sm text-muted-foreground">{selectedApplication.frameworks || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Specialization</label>
                    <p className="text-sm text-muted-foreground">{selectedApplication.specialization || 'Not provided'}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Project & Team */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Project & Team</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Team Name</label>
                    <p className="text-sm text-muted-foreground">{selectedApplication.team_name || 'Solo participant'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Team Size</label>
                    <p className="text-sm text-muted-foreground">{selectedApplication.team_size || '1'} member(s)</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Project Idea</label>
                    <p className="text-sm text-muted-foreground mt-1">{selectedApplication.project_idea || 'Not provided'}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Additional Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Previous Hackathons</label>
                    <p className="text-sm text-muted-foreground">{selectedApplication.previous_hackathons || 'None'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Dietary Requirements</label>
                    <p className="text-sm text-muted-foreground">{selectedApplication.dietary_requirements || 'None'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Accommodation Needed</label>
                    <Badge variant={selectedApplication.accommodation ? "default" : "outline"}>
                      {selectedApplication.accommodation ? "Yes" : "No"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Social Links */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Social Links</CardTitle>
                </CardHeader>
                <CardContent className="flex gap-2">
                  {selectedApplication.github_profile && (
                    <Button variant="outline" asChild>
                      <a href={selectedApplication.github_profile} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4 mr-2" />
                        GitHub Profile
                      </a>
                    </Button>
                  )}
                  {selectedApplication.linkedin_profile && (
                    <Button variant="outline" asChild>
                      <a href={selectedApplication.linkedin_profile} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="h-4 w-4 mr-2" />
                        LinkedIn Profile
                      </a>
                    </Button>
                  )}
                  {selectedApplication.portfolio && (
                    <Button variant="outline" asChild>
                      <a href={selectedApplication.portfolio} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Portfolio
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
