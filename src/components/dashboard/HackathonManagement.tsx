import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase'
import { AddHackathonDialog } from './AddHackathonDialog'
import { HackathonApplicationsDialog } from './HackathonApplicationsDialog'
import type { Tables } from '@/types/supabase-latest'
import { Plus, Edit, Trash2, Calendar, MapPin, Users, Trophy, FileText } from 'lucide-react'

export const HackathonManagement: React.FC = () => {
  const { toast } = useToast()
  const [hackathons, setHackathons] = useState<Tables<'hackathons'>[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingHackathon, setEditingHackathon] = useState<Tables<'hackathons'> | null>(null)
  const [applicationsDialogOpen, setApplicationsDialogOpen] = useState(false)
  const [selectedHackathonForApplications, setSelectedHackathonForApplications] = useState<Tables<'hackathons'> | null>(null)

  useEffect(() => {
    fetchHackathons()
  }, [])

  const fetchHackathons = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('hackathons')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      
      // Sort hackathons to show "Tech Innovation Hackathon 2024" first
      const sortedHackathons = (data || []).sort((a, b) => {
        if (a.title === 'Tech Innovation Hackathon 2024') return -1
        if (b.title === 'Tech Innovation Hackathon 2024') return 1
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
      })
      
      setHackathons(sortedHackathons)
    } catch (error) {
      console.error('Error fetching hackathons:', error)
      toast({
        title: "Error",
        description: "Failed to fetch hackathons",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (hackathon: Tables<'hackathons'>) => {
    setEditingHackathon(hackathon)
    setDialogOpen(true)
  }

  const handleViewApplications = (hackathon: Tables<'hackathons'>) => {
    setSelectedHackathonForApplications(hackathon)
    setApplicationsDialogOpen(true)
  }

  const handleDelete = async (hackathon: Tables<'hackathons'>) => {
    if (!confirm('Are you sure you want to delete this hackathon? This action cannot be undone.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('hackathons')
        .delete()
        .eq('id', hackathon.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Hackathon deleted successfully"
      })

      fetchHackathons()
    } catch (error) {
      console.error('Error deleting hackathon:', error)
      toast({
        title: "Error",
        description: "Failed to delete hackathon",
        variant: "destructive"
      })
    }
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    setEditingHackathon(null)
  }

  const handleSuccess = () => {
    fetchHackathons()
    // Show success message and suggest refreshing the public page
    toast({
      title: "Success",
      description: "Hackathon updated successfully! The public page will reflect changes shortly.",
    })
  }

  const filteredHackathons = hackathons.filter(hackathon => {
    const matchesSearch = hackathon.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hackathon.subtitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hackathon.location?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || hackathon.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'published':
        return 'default'
      case 'draft':
        return 'secondary'
      case 'cancelled':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Hackathon Management</h2>
          <Button disabled>
            <Plus className="mr-2 h-4 w-4" />
            Add Hackathon
          </Button>
        </div>
        <div className="text-center py-8">Loading hackathons...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Hackathon Management</h2>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Hackathon
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search hackathons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Hackathons Grid */}
      <div className="grid gap-6">
        {filteredHackathons.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm || statusFilter !== 'all' ? 'No hackathons match your filters' : 'No hackathons found'}
          </div>
        ) : (
                     filteredHackathons.map((hackathon) => (
             <Card 
               key={hackathon.id} 
               className={`overflow-hidden ${
                 hackathon.title === 'Tech Innovation Hackathon 2024' 
                   ? 'ring-2 ring-primary/20 bg-gradient-to-r from-primary/5 to-orange-400/5' 
                   : ''
               }`}
             >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                                         <div className="flex items-center gap-2">
                       <CardTitle className="text-xl">{hackathon.title}</CardTitle>
                       <Badge variant={getStatusBadgeVariant(hackathon.status || 'draft')}>
                         {hackathon.status || 'draft'}
                       </Badge>
                       {hackathon.published && (
                         <Badge variant="outline">Public</Badge>
                       )}
                       {hackathon.title === 'Tech Innovation Hackathon 2024' && (
                         <Badge className="bg-gradient-to-r from-primary to-orange-400 text-white">
                           Featured
                         </Badge>
                       )}
                     </div>
                    <p className="text-muted-foreground">{hackathon.subtitle}</p>
                  </div>
                                     <div className="flex gap-2">
                     <Button
                       variant="outline"
                       size="sm"
                       onClick={() => handleViewApplications(hackathon)}
                     >
                       <FileText className="h-4 w-4 mr-2" />
                       View Applications
                     </Button>
                     <Button
                       variant="outline"
                       size="sm"
                       onClick={() => handleEdit(hackathon)}
                     >
                       <Edit className="h-4 w-4" />
                     </Button>
                     {/* Hide delete button for Tech Innovation Hackathon 2024 */}
                     {hackathon.title !== 'Tech Innovation Hackathon 2024' && (
                       <Button
                         variant="outline"
                         size="sm"
                         onClick={() => handleDelete(hackathon)}
                       >
                         <Trash2 className="h-4 w-4" />
                       </Button>
                     )}
                   </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{hackathon.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {hackathon.start_date && formatDate(hackathon.start_date)} - {hackathon.end_date && formatDate(hackathon.end_date)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{hackathon.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                    <span>{hackathon.prize_pool || 'TBD'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{hackathon.expected_participants || 0} expected</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>{hackathon.registration_count || 0} applications</span>
                  </div>
                </div>

                {hackathon.registration_open_date && hackathon.registration_close_date && (
                  <div className="text-sm text-muted-foreground">
                    Registration: {formatDate(hackathon.registration_open_date)} - {formatDate(hackathon.registration_close_date)}
                  </div>
                )}

                {hackathon.tags && hackathon.tags.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {hackathon.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add/Edit Dialog */}
      <AddHackathonDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        hackathon={editingHackathon}
        onSuccess={handleSuccess}
      />

      {/* Applications Dialog */}
      {selectedHackathonForApplications && (
        <HackathonApplicationsDialog
          open={applicationsDialogOpen}
          onOpenChange={setApplicationsDialogOpen}
          hackathon={selectedHackathonForApplications}
        />
      )}
    </div>
  )
}