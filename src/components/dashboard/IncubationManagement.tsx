import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase'
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign,
  Clock,
  Star
} from 'lucide-react'
import { AddIncubationProgramDialog } from './AddIncubationProgramDialog'
import { IncubationApplicationsDialog } from './IncubationApplicationsDialog'
import { Tables } from '@/types/supabase-latest'

type IncubationProgram = Tables<'incubation_programs'>

export const IncubationManagement: React.FC = () => {
  const { toast } = useToast()
  const [programs, setPrograms] = useState<IncubationProgram[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [publishedFilter, setPublishedFilter] = useState<string>('all')
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editProgram, setEditProgram] = useState<IncubationProgram | null>(null)
  const [applicationsDialogOpen, setApplicationsDialogOpen] = useState(false)
  const [selectedProgram, setSelectedProgram] = useState<IncubationProgram | null>(null)
  const [applicationStats, setApplicationStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    recentApplications: [] as Array<{
      id: string
      founder_name: string
      startup_name: string
      stage: string
      status: string
      created_at: string
      incubation_programs?: { title: string }
    }>
  })

  useEffect(() => {
    fetchPrograms()
    fetchApplicationStats()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchPrograms = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('incubation_programs')
        .select('*')
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) throw error
      setPrograms(data || [])
    } catch (error) {
      console.error('Error fetching incubation programs:', error)
      toast({
        title: "Error",
        description: "Failed to fetch incubation programs",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchApplicationStats = async () => {
    try {
      // Get application statistics
      const { data: applications, error } = await supabase
        .from('incubation_applications_new')
        .select(`
          *,
          incubation_programs (
            title
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      const stats = {
        total: applications?.length || 0,
        pending: applications?.filter(app => app.status === 'submitted').length || 0,
        approved: applications?.filter(app => app.status === 'approved').length || 0,
        rejected: applications?.filter(app => app.status === 'rejected').length || 0,
        recentApplications: applications?.slice(0, 5) || []
      }

      setApplicationStats(stats)
    } catch (error) {
      console.error('Error fetching application stats:', error)
    }
  }

  const filteredPrograms = programs.filter(program => {
    const matchesSearch = 
      program.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.subtitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.location?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || program.status === statusFilter
    const matchesPublished = publishedFilter === 'all' || 
      (publishedFilter === 'published' && program.published) ||
      (publishedFilter === 'draft' && !program.published)

    return matchesSearch && matchesStatus && matchesPublished
  })

  const handleAddProgram = () => {
    setEditProgram(null)
    setAddDialogOpen(true)
  }

  const handleEditProgram = (program: IncubationProgram) => {
    setEditProgram(program)
    setAddDialogOpen(true)
  }

  const handleDeleteProgram = async (program: IncubationProgram) => {
    if (program.is_default) {
      toast({
        title: "Cannot Delete",
        description: "Default incubation program cannot be deleted",
        variant: "destructive"
      })
      return
    }

    if (confirm(`Are you sure you want to delete "${program.title}"?`)) {
      try {
        const { error } = await supabase
          .from('incubation_programs')
          .delete()
          .eq('id', program.id)

        if (error) throw error

        toast({
          title: "Success",
          description: "Incubation program deleted successfully"
        })
        fetchPrograms()
        fetchApplicationStats() // Refresh application stats
      } catch (error) {
        console.error('Error deleting incubation program:', error)
        toast({
          title: "Error",
          description: "Failed to delete incubation program",
          variant: "destructive"
        })
      }
    }
  }

  const handleViewApplications = (program: IncubationProgram) => {
    setSelectedProgram(program)
    setApplicationsDialogOpen(true)
  }

  const handleSuccess = () => {
    setAddDialogOpen(false)
    setEditProgram(null)
    fetchPrograms()
    fetchApplicationStats() // Refresh application stats
    toast({
      title: "Success",
      description: "Incubation program saved successfully"
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-600">Published</Badge>
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPublishedBadge = (published: boolean) => {
    return published ? 
      <Badge className="bg-blue-600">Public</Badge> : 
      <Badge variant="outline">Private</Badge>
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Incubation Programs</h2>
          <p className="text-muted-foreground">
            Manage incubation programs and track applications
          </p>
        </div>
        <Button onClick={handleAddProgram}>
          <Plus className="h-4 w-4 mr-2" />
          Add Program
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search programs..."
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
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
        <Select value={publishedFilter} onValueChange={setPublishedFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by visibility" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Visibility</SelectItem>
            <SelectItem value="published">Public</SelectItem>
            <SelectItem value="draft">Private</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Application Tracking Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Application Tracking</h3>
          <Button 
            variant="outline" 
            size="sm"
            onClick={fetchApplicationStats}
          >
            <Clock className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Application Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{applicationStats.total}</div>
              <p className="text-xs text-muted-foreground">All time submissions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{applicationStats.pending}</div>
              <p className="text-xs text-muted-foreground">Awaiting review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{applicationStats.approved}</div>
              <p className="text-xs text-muted-foreground">Accepted startups</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{applicationStats.rejected}</div>
              <p className="text-xs text-muted-foreground">Declined applications</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Applications Table */}
        {applicationStats.recentApplications.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Applications</CardTitle>
              <p className="text-sm text-muted-foreground">Latest 5 applications submitted</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {applicationStats.recentApplications.map((application) => (
                  <div key={application.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium">{application.founder_name}</p>
                          <p className="text-sm text-muted-foreground">{application.startup_name}</p>
                        </div>
                        <Badge className="ml-2">
                          {application.stage}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{application.incubation_programs?.title || 'N/A'}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(application.created_at)}
                      </p>
                    </div>
                    <div className="ml-4">
                      <Badge 
                        variant={
                          application.status === 'submitted' ? 'secondary' :
                          application.status === 'approved' ? 'default' : 'destructive'
                        }
                      >
                        {application.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Programs Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="pt-6">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredPrograms.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">
            No incubation programs found
          </h3>
          <p className="text-muted-foreground">
            {searchTerm || statusFilter !== 'all' || publishedFilter !== 'all' 
              ? 'Try adjusting your filters' 
              : 'Create your first incubation program to get started'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((program) => (
            <Card key={program.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    {program.is_default && (
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    )}
                    <Badge variant="outline" className="text-xs">
                      {program.is_default ? 'Featured' : 'Standard'}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    {getStatusBadge(program.status)}
                    {getPublishedBadge(program.published)}
                  </div>
                </div>
                <CardTitle className="text-lg line-clamp-2">{program.title}</CardTitle>
                {program.subtitle && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {program.subtitle}
                  </p>
                )}
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDate(program.start_date)} - {formatDate(program.end_date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{program.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{program.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{program.expected_startups} startups expected</span>
                  </div>
                  {program.funding_amount && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>{program.funding_amount}</span>
                    </div>
                  )}
                </div>

                {program.tags && program.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {program.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {program.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{program.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                <div className="space-y-3 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground font-medium">
                      📋 {program.application_count || 0} applications
                    </div>
                    {program.is_default && (
                      <Badge variant="default" className="bg-yellow-500 text-yellow-900">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewApplications(program)}
                      className="w-full justify-start"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Applications ({program.application_count || 0})
                    </Button>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditProgram(program)}
                        className="justify-start"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      
                      {!program.is_default ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteProgram(program)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 justify-start"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled
                          className="justify-start opacity-50"
                        >
                          <Star className="h-4 w-4 mr-2" />
                          Protected
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <AddIncubationProgramDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        program={editProgram}
        onSuccess={handleSuccess}
      />

      {/* Applications Dialog */}
      {selectedProgram && (
        <IncubationApplicationsDialog
          open={applicationsDialogOpen}
          onOpenChange={setApplicationsDialogOpen}
          program={selectedProgram}
        />
      )}
    </div>
  )
}
