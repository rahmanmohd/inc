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
  Edit, 
  Trash2, 
  Eye, 
  Calendar, 
  Users, 
  Building,
  Star,
  Clock,
  TrendingUp,
  DollarSign
} from 'lucide-react'

interface IncLabProgram {
  id: string
  program_name: string
  start_date: string
  researchers: number
  status: string
  budget: string
  created_at: string
}

interface IncLabStats {
  total_programs: number
  active_programs: number
  total_researchers: number
  total_budget: string
}

export const IncLabManagement: React.FC = () => {
  const { toast } = useToast()
  const [programs, setPrograms] = useState<IncLabProgram[]>([
    {
      id: '1',
      program_name: 'Advanced Research Lab 2024',
      start_date: 'Jan 2024',
      researchers: 15,
      status: 'Active',
      budget: '₹50L',
      created_at: '2024-01-01'
    },
    {
      id: '2',
      program_name: 'Blockchain Innovation Lab',
      start_date: 'Mar 2024',
      researchers: 8,
      status: 'Planning',
      budget: '₹30L',
      created_at: '2024-03-01'
    }
  ])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const stats: IncLabStats = {
    total_programs: programs.length,
    active_programs: programs.filter(p => p.status === 'Active').length,
    total_researchers: programs.reduce((sum, p) => sum + p.researchers, 0),
    total_budget: '₹80L+'
  }

  const filteredPrograms = programs.filter(program => {
    const matchesSearch = program.program_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || program.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleAddProgram = () => {
    toast({
      title: "Add inclab",
      description: "Inc Lab program creation interface will be implemented soon",
    })
  }

  const handleEditProgram = (program: IncLabProgram) => {
    toast({
      title: "Edit Inc Lab Program",
      description: `Editing ${program.program_name}`,
    })
  }

  const handleDeleteProgram = (program: IncLabProgram) => {
    if (confirm(`Are you sure you want to delete "${program.program_name}"?`)) {
      setPrograms(programs.filter(p => p.id !== program.id))
      toast({
        title: "Success",
        description: "Inc Lab program deleted successfully"
      })
    }
  }

  const handleViewApplications = (program: IncLabProgram) => {
    toast({
      title: "View Applications",
      description: `Viewing researchers for ${program.program_name}`,
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-green-600">Active</Badge>
      case 'Planning':
        return <Badge className="bg-blue-600">Planning</Badge>
      case 'Completed':
        return <Badge variant="secondary">Completed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Inclab Management</h2>
          <p className="text-muted-foreground">
            Manage research laboratory programs and track researchers
          </p>
        </div>
        <Button onClick={handleAddProgram}>
          <Plus className="h-4 w-4 mr-2" />
          Add inclab
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Programs</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.total_programs}</div>
            <p className="text-xs text-muted-foreground">Research programs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Programs</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active_programs}</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Researchers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.total_researchers}</div>
            <p className="text-xs text-muted-foreground">Active researchers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.total_budget}</div>
            <p className="text-xs text-muted-foreground">Research funding</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search Inc Lab programs..."
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
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Planning">Planning</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
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
          <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">
            No Inc Lab programs found
          </h3>
          <p className="text-muted-foreground">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your filters' 
              : 'Create your first Inc Lab program to get started'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((program) => (
            <Card key={program.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="text-xs">
                    Inc Lab
                  </Badge>
                  <div className="flex gap-1">
                    {getStatusBadge(program.status)}
                  </div>
                </div>
                <CardTitle className="text-lg line-clamp-2">{program.program_name}</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Started: {program.start_date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{program.researchers} researchers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>Budget: {program.budget}</span>
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <div className="grid grid-cols-1 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewApplications(program)}
                      className="w-full justify-start"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Researchers ({program.researchers})
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
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteProgram(program)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 justify-start"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

