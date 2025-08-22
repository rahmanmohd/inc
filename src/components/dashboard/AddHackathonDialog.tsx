import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase'
import type { Tables, TablesInsert } from '@/types/supabase-latest'

interface AddHackathonDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  hackathon?: Tables<'hackathons'> | null
  onSuccess: () => void
}

export const AddHackathonDialog: React.FC<AddHackathonDialogProps> = ({
  open,
  onOpenChange,
  hackathon,
  onSuccess
}) => {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<TablesInsert<'hackathons'>>>({
    title: '',
    subtitle: '',
    description: '',
    start_date: '',
    end_date: '',
    registration_open_date: '',
    registration_close_date: '',
    location: '',
    prize_pool: '',
    expected_participants: 100,
    tags: [],
    status: 'draft',
    published: false
  })

  useEffect(() => {
    if (hackathon) {
      setFormData({
        title: hackathon.title || '',
        subtitle: hackathon.subtitle || '',
        description: hackathon.description || '',
        start_date: hackathon.start_date ? new Date(hackathon.start_date).toISOString().split('T')[0] : '',
        end_date: hackathon.end_date ? new Date(hackathon.end_date).toISOString().split('T')[0] : '',
        registration_open_date: hackathon.registration_open_date ? new Date(hackathon.registration_open_date).toISOString().split('T')[0] : '',
        registration_close_date: hackathon.registration_close_date ? new Date(hackathon.registration_close_date).toISOString().split('T')[0] : '',
        location: hackathon.location || '',
        prize_pool: hackathon.prize_pool || '',
        expected_participants: hackathon.expected_participants || 100,
        tags: hackathon.tags || [],
        status: hackathon.status || 'draft',
        published: hackathon.published || false
      })
    } else {
      setFormData({
        title: '',
        subtitle: '',
        description: '',
        start_date: '',
        end_date: '',
        registration_open_date: '',
        registration_close_date: '',
        location: '',
        prize_pool: '',
        expected_participants: 100,
        tags: [],
        status: 'draft',
        published: false
      })
    }
  }, [hackathon])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate required fields
      if (!formData.title || !formData.subtitle || !formData.description || !formData.start_date || !formData.end_date || !formData.location) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive"
        })
        return
      }

      // Validate dates
      const startDate = new Date(formData.start_date)
      const endDate = new Date(formData.end_date)
      if (startDate >= endDate) {
        toast({
          title: "Validation Error",
          description: "Start date must be before end date",
          variant: "destructive"
        })
        return
      }

      if (formData.registration_open_date && formData.registration_close_date) {
        const regOpen = new Date(formData.registration_open_date)
        const regClose = new Date(formData.registration_close_date)
        if (regOpen >= regClose) {
          toast({
            title: "Validation Error",
            description: "Registration open date must be before close date",
            variant: "destructive"
          })
          return
        }
      }

      // Convert dates to ISO strings
      const hackathonData = {
        ...formData,
        start_date: new Date(formData.start_date!).toISOString(),
        end_date: new Date(formData.end_date!).toISOString(),
        registration_open_date: formData.registration_open_date ? new Date(formData.registration_open_date).toISOString() : null,
        registration_close_date: formData.registration_close_date ? new Date(formData.registration_close_date).toISOString() : null,
        expected_participants: parseInt(formData.expected_participants?.toString() || '100')
      }

      if (hackathon) {
        // Update existing hackathon
        const { error } = await supabase
          .from('hackathons')
          .update(hackathonData)
          .eq('id', hackathon.id)

        if (error) throw error

        toast({
          title: "Success",
          description: "Hackathon updated successfully"
        })
      } else {
        // Create new hackathon
        const { error } = await supabase
          .from('hackathons')
          .insert(hackathonData)

        if (error) throw error

        toast({
          title: "Success",
          description: "Hackathon created successfully"
        })
      }

      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error('Error saving hackathon:', error)
      toast({
        title: "Error",
        description: "Failed to save hackathon",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!hackathon) return

    if (!confirm('Are you sure you want to delete this hackathon? This action cannot be undone.')) {
      return
    }

    setLoading(true)
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

      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error('Error deleting hackathon:', error)
      toast({
        title: "Error",
        description: "Failed to delete hackathon",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {hackathon ? 'Edit Hackathon' : 'Add New Hackathon'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="AI Innovation Challenge 2025"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle/Category *</Label>
              <Input
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="Artificial Intelligence & Machine Learning"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Build AI solutions for real-world problems in healthcare, education, and sustainability."
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date *</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date">End Date *</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="registration_open_date">Registration Open Date</Label>
              <Input
                id="registration_open_date"
                type="date"
                value={formData.registration_open_date}
                onChange={(e) => setFormData({ ...formData, registration_open_date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="registration_close_date">Registration Close Date</Label>
              <Input
                id="registration_close_date"
                type="date"
                value={formData.registration_close_date}
                onChange={(e) => setFormData({ ...formData, registration_close_date: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Bangalore, India"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="prize_pool">Prize Pool</Label>
              <Input
                id="prize_pool"
                value={formData.prize_pool}
                onChange={(e) => setFormData({ ...formData, prize_pool: e.target.value })}
                placeholder="₹10 Lakhs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expected_participants">Expected Participants</Label>
              <Input
                id="expected_participants"
                type="number"
                value={formData.expected_participants}
                onChange={(e) => setFormData({ ...formData, expected_participants: parseInt(e.target.value) || 100 })}
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as any })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="published"
              checked={formData.published}
              onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
            />
            <Label htmlFor="published">Published (visible to public)</Label>
          </div>

          <DialogFooter className="flex justify-between">
            <div className="flex gap-2">
              {hackathon && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  Delete
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : (hackathon ? 'Update' : 'Create')}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
