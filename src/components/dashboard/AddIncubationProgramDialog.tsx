import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { Tables } from '@/types/supabase-latest'
import { Calendar, MapPin, Users, DollarSign, Clock, Tag } from 'lucide-react'

type IncubationProgram = Tables<'incubation_programs'>

interface AddIncubationProgramDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  program: IncubationProgram | null
  onSuccess: () => void
}

export const AddIncubationProgramDialog: React.FC<AddIncubationProgramDialogProps> = ({
  open,
  onOpenChange,
  program,
  onSuccess
}) => {
  const { toast } = useToast()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    start_date: '',
    end_date: '',
    application_open_date: '',
    application_close_date: '',
    location: '',
    duration: '',
    equity_requirement: '',
    funding_amount: '',
    expected_startups: 20,
    tags: [] as string[],
    cover_image_url: '',
    status: 'draft',
    published: false,
    is_default: false
  })

  useEffect(() => {
    if (program) {
      setFormData({
        title: program.title || '',
        subtitle: program.subtitle || '',
        description: program.description || '',
        start_date: program.start_date ? new Date(program.start_date).toISOString().split('T')[0] : '',
        end_date: program.end_date ? new Date(program.end_date).toISOString().split('T')[0] : '',
        application_open_date: program.application_open_date ? new Date(program.application_open_date).toISOString().split('T')[0] : '',
        application_close_date: program.application_close_date ? new Date(program.application_close_date).toISOString().split('T')[0] : '',
        location: program.location || '',
        duration: program.duration || '',
        equity_requirement: program.equity_requirement || '',
        funding_amount: program.funding_amount || '',
        expected_startups: program.expected_startups || 20,
        tags: program.tags || [],
        cover_image_url: program.cover_image_url || '',
        status: program.status || 'draft',
        published: program.published || false,
        is_default: program.is_default || false
      })
    } else {
      setFormData({
        title: '',
        subtitle: '',
        description: '',
        start_date: '',
        end_date: '',
        application_open_date: '',
        application_close_date: '',
        location: '',
        duration: '',
        equity_requirement: '',
        funding_amount: '',
        expected_startups: 20,
        tags: [],
        cover_image_url: '',
        status: 'draft',
        published: false,
        is_default: false
      })
    }
  }, [program, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to manage incubation programs",
        variant: "destructive"
      })
      return
    }

    // Validate required fields
    if (!formData.title || !formData.description || !formData.start_date || !formData.end_date || !formData.location) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields marked with *",
        variant: "destructive"
      })
      return
    }

    // Validate dates
    const startDate = new Date(formData.start_date)
    const endDate = new Date(formData.end_date)
    const appOpenDate = formData.application_open_date ? new Date(formData.application_open_date) : null
    const appCloseDate = formData.application_close_date ? new Date(formData.application_close_date) : null

    if (endDate <= startDate) {
      toast({
        title: "Invalid Dates",
        description: "End date must be after start date",
        variant: "destructive"
      })
      return
    }

    if (appOpenDate && appCloseDate && appCloseDate <= appOpenDate) {
      toast({
        title: "Invalid Dates",
        description: "Application close date must be after application open date",
        variant: "destructive"
      })
      return
    }

    if (appOpenDate && startDate && appOpenDate >= startDate) {
      toast({
        title: "Invalid Dates",
        description: "Application open date must be before program start date",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      const programData = {
        title: formData.title,
        subtitle: formData.subtitle || null,
        description: formData.description,
        start_date: formData.start_date + 'T00:00:00Z',
        end_date: formData.end_date + 'T23:59:59Z',
        application_open_date: formData.application_open_date ? formData.application_open_date + 'T00:00:00Z' : null,
        application_close_date: formData.application_close_date ? formData.application_close_date + 'T23:59:59Z' : null,
        location: formData.location,
        duration: formData.duration || null,
        equity_requirement: formData.equity_requirement || null,
        funding_amount: formData.funding_amount || null,
        expected_startups: formData.expected_startups,
        tags: formData.tags.length > 0 ? formData.tags : null,
        cover_image_url: formData.cover_image_url || null,
        status: formData.status,
        published: formData.published,
        is_default: formData.is_default,
        created_by: user.id
      }

      if (program) {
        // Update existing program
        const { error } = await supabase
          .from('incubation_programs')
          .update(programData)
          .eq('id', program.id)

        if (error) throw error
      } else {
        // Create new program
        const { error } = await supabase
          .from('incubation_programs')
          .insert(programData)

        if (error) throw error
      }

      onSuccess()
    } catch (error) {
      console.error('Error saving incubation program:', error)
      toast({
        title: "Error",
        description: `Failed to save incubation program: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleTagsChange = (value: string) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
    setFormData({ ...formData, tags })
  }

  const handleDelete = async () => {
    if (!program) return

    if (confirm(`Are you sure you want to delete "${program.title}"?`)) {
      try {
        setLoading(true)
        const { error } = await supabase
          .from('incubation_programs')
          .delete()
          .eq('id', program.id)

        if (error) throw error

        toast({
          title: "Success",
          description: "Incubation program deleted successfully"
        })
        onSuccess()
      } catch (error) {
        console.error('Error deleting incubation program:', error)
        toast({
          title: "Error",
          description: "Failed to delete incubation program",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {program ? 'Edit Incubation Program' : 'Add New Incubation Program'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Program Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Tech Innovation Incubation Program 2024"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="e.g., Transform Your Startup with Expert Mentorship"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed description of the incubation program..."
                rows={4}
                required
              />
            </div>
          </div>

          {/* Program Dates */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Program Dates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Program Start Date *</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="end_date">Program End Date *</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="application_open_date">Application Open Date</Label>
                <Input
                  id="application_open_date"
                  type="date"
                  value={formData.application_open_date}
                  onChange={(e) => setFormData({ ...formData, application_open_date: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="application_close_date">Application Close Date</Label>
                <Input
                  id="application_close_date"
                  type="date"
                  value={formData.application_close_date}
                  onChange={(e) => setFormData({ ...formData, application_close_date: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Program Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Program Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Hybrid (Online + Bangalore)"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="e.g., 10 months"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="equity_requirement">Equity Requirement</Label>
                <Input
                  id="equity_requirement"
                  value={formData.equity_requirement}
                  onChange={(e) => setFormData({ ...formData, equity_requirement: e.target.value })}
                  placeholder="e.g., 5-15% equity"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="funding_amount">Funding Amount</Label>
                <Input
                  id="funding_amount"
                  value={formData.funding_amount}
                  onChange={(e) => setFormData({ ...formData, funding_amount: e.target.value })}
                  placeholder="e.g., Up to ₹50 Lakhs"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expected_startups">Expected Startups</Label>
                <Input
                  id="expected_startups"
                  type="number"
                  value={formData.expected_startups}
                  onChange={(e) => setFormData({ ...formData, expected_startups: parseInt(e.target.value) || 0 })}
                  min="1"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Additional Information</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags.join(', ')}
                  onChange={(e) => handleTagsChange(e.target.value)}
                  placeholder="e.g., tech, startup, incubation, mentorship, funding"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cover_image_url">Cover Image URL</Label>
                <Input
                  id="cover_image_url"
                  value={formData.cover_image_url}
                  onChange={(e) => setFormData({ ...formData, cover_image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) => setFormData({ ...formData, published: checked as boolean })}
                />
                <Label htmlFor="published">Make Public</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_default"
                  checked={formData.is_default}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_default: checked as boolean })}
                />
                <Label htmlFor="is_default">Featured Program</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <div className="flex gap-2">
              {program && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  Delete
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : program ? 'Update Program' : 'Create Program'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
