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
import { EmailService } from '@/lib/emailService'
import { Calendar, MapPin, Trophy, Users } from 'lucide-react'

interface Hackathon {
  id: string
  title: string
  subtitle: string
  description: string
  start_date: string
  end_date: string
  location: string
  prize_pool: string
  expected_participants: number
  registration_count?: number
}

interface HackathonRegistrationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  hackathon: Hackathon
  onSuccess: () => void
}

export const HackathonRegistrationDialog: React.FC<HackathonRegistrationDialogProps> = ({
  open,
  onOpenChange,
  hackathon,
  onSuccess
}) => {
  const { toast } = useToast()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  // Safety check - don't render if hackathon is not provided
  if (!hackathon) {
    return null
  }
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    age: '',
    city: '',
    college: '',
    graduation_year: '',
    programming_languages: '',
    experience: '',
    frameworks: '',
    specialization: '',
    github_profile: '',
    portfolio: '',
    team_name: '',
    team_size: '',
    university: '',
    track: '',
    project_idea: '',
    technical_skills: '',
    previous_hackathons: '',
    dietary_requirements: '',
    accommodation: false,
    linkedin_profile: '',
    agreements: false
  })

  useEffect(() => {
    if (user && open) {
      // Pre-fill with user data if available
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
        full_name: user.email?.split('@')[0] || ''
      }))
    }
  }, [user, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to register for hackathons",
        variant: "destructive"
      })
      return
    }

    if (!formData.agreements) {
      toast({
        title: "Agreement Required",
        description: "Please accept the terms and conditions",
        variant: "destructive"
      })
      return
    }

    // Validate required fields
    if (!formData.full_name || !formData.email || !formData.city || !formData.programming_languages || !formData.experience) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields marked with *",
        variant: "destructive"
      })
      return
    }

    // Validate hackathon ID format
    if (!hackathon.id || typeof hackathon.id !== 'string' || hackathon.id.length < 10) {
      toast({
        title: "Invalid Hackathon",
        description: "Hackathon data is invalid. Please try refreshing the page.",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      console.log('Submitting registration with data:', {
        user_id: user.id,
        hackathon_id: hackathon.id,
        hackathon: hackathon,
        formData: formData
      })
      
      // Prepare the registration data, filtering out empty strings
      const registrationData = {
        user_id: user.id,
        hackathon_id: hackathon.id,
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone || null,
        age: formData.age || null,
        city: formData.city,
        college: formData.college || null,
        graduation: formData.graduation_year || null,
        programming_languages: formData.programming_languages,
        experience: formData.experience,
        frameworks: formData.frameworks || null,
        specialization: formData.specialization || null,
        github_profile: formData.github_profile || null,
        portfolio: formData.portfolio || null,
        team_name: formData.team_name || null,
        team_size: formData.team_size || null,
        university: formData.university || null,
        track: formData.track || null,
        project_idea: formData.project_idea || null,
        technical_skills: formData.technical_skills || null,
        previous_hackathons: formData.previous_hackathons || null,
        dietary_requirements: formData.dietary_requirements || null,
        accommodation: formData.accommodation || false,
        linkedin_profile: formData.linkedin_profile || null,
        agreements: formData.agreements,
        hackathon_title: hackathon.title,
        source_type: 'hackathon_card'
      };

      console.log('Registration data to be inserted:', registrationData);

      const { error } = await supabase
        .from('hackathon_registrations')
        .insert(registrationData)

      if (error) throw error

      // Update hackathon registration count
      await supabase
        .from('hackathons')
        .update({ 
          registration_count: (hackathon.registration_count || 0) + 1
        })
        .eq('id', hackathon.id)

      // Send confirmation email
      try {
        const emailResult = await EmailService.sendHackathonRegistrationConfirmation(hackathon as any, user as any, formData)
        if (emailResult.success) {
          console.log('Confirmation email sent successfully')
        } else {
          console.warn('Failed to send confirmation email:', emailResult.error)
        }
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError)
        // Don't fail the registration if email fails
      }

      toast({
        title: "Registration Successful!",
        description: `You've been registered for ${hackathon.title}. Check your email for confirmation!`
      })

      onSuccess()
    } catch (error) {
      console.error('Error registering for hackathon:', error)
      
      // Show more specific error messages
      let errorMessage = "There was an error processing your registration. Please try again."
      
      if (error && typeof error === 'object' && 'message' in error) {
        if (error.message.includes('invalid input syntax for type uuid')) {
          errorMessage = "Invalid hackathon ID format. Please try refreshing the page."
        } else if (error.message.includes('duplicate key')) {
          errorMessage = "You have already registered for this hackathon."
        } else if (error.message.includes('foreign key')) {
          errorMessage = "Hackathon not found. Please try refreshing the page."
        } else {
          errorMessage = error.message
        }
      }
      
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Don't render if not open or no hackathon
  if (!open || !hackathon) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Register for {hackathon.title}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Hackathon Info */}
          <div className="lg:col-span-1">
            <div className="bg-muted p-4 rounded-lg space-y-4">
              <h3 className="font-semibold text-lg">{hackathon.subtitle}</h3>
              <p className="text-sm text-muted-foreground">{hackathon.description}</p>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{formatDate(hackathon.start_date)} - {formatDate(hackathon.end_date)}</span>
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
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name *</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="college">College/University</Label>
                    <Input
                      id="college"
                      value={formData.college}
                      onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Technical Skills */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Technical Skills</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="programming_languages">Programming Languages *</Label>
                    <Input
                      id="programming_languages"
                      value={formData.programming_languages}
                      onChange={(e) => setFormData({ ...formData, programming_languages: e.target.value })}
                      placeholder="e.g., Python, JavaScript, Java"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="experience">Experience Level *</Label>
                    <Select
                      value={formData.experience}
                      onValueChange={(value) => setFormData({ ...formData, experience: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner (0-1 years)</SelectItem>
                        <SelectItem value="intermediate">Intermediate (1-3 years)</SelectItem>
                        <SelectItem value="advanced">Advanced (3+ years)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="frameworks">Frameworks & Technologies</Label>
                    <Input
                      id="frameworks"
                      value={formData.frameworks}
                      onChange={(e) => setFormData({ ...formData, frameworks: e.target.value })}
                      placeholder="e.g., React, Django, TensorFlow"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="specialization">Area of Specialization</Label>
                    <Input
                      id="specialization"
                      value={formData.specialization}
                      onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                      placeholder="e.g., AI/ML, Web Development, Mobile"
                    />
                  </div>
                </div>
              </div>

              {/* Project & Team */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Project & Team</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="team_name">Team Name</Label>
                    <Input
                      id="team_name"
                      value={formData.team_name}
                      onChange={(e) => setFormData({ ...formData, team_name: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="team_size">Team Size</Label>
                    <Select
                      value={formData.team_size}
                      onValueChange={(value) => setFormData({ ...formData, team_size: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select team size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Solo (1 person)</SelectItem>
                        <SelectItem value="2">2 people</SelectItem>
                        <SelectItem value="3">3 people</SelectItem>
                        <SelectItem value="4">4 people</SelectItem>
                        <SelectItem value="5+">5+ people</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="project_idea">Project Idea</Label>
                    <Textarea
                      id="project_idea"
                      value={formData.project_idea}
                      onChange={(e) => setFormData({ ...formData, project_idea: e.target.value })}
                      placeholder="Briefly describe your project idea..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Additional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="github_profile">GitHub Profile</Label>
                    <Input
                      id="github_profile"
                      value={formData.github_profile}
                      onChange={(e) => setFormData({ ...formData, github_profile: e.target.value })}
                      placeholder="https://github.com/username"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="linkedin_profile">LinkedIn Profile</Label>
                    <Input
                      id="linkedin_profile"
                      value={formData.linkedin_profile}
                      onChange={(e) => setFormData({ ...formData, linkedin_profile: e.target.value })}
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="portfolio">Portfolio/Website</Label>
                    <Input
                      id="portfolio"
                      value={formData.portfolio}
                      onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="previous_hackathons">Previous Hackathons</Label>
                    <Input
                      id="previous_hackathons"
                      value={formData.previous_hackathons}
                      onChange={(e) => setFormData({ ...formData, previous_hackathons: e.target.value })}
                      placeholder="List any previous hackathons..."
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dietary_requirements">Dietary Requirements</Label>
                  <Input
                    id="dietary_requirements"
                    value={formData.dietary_requirements}
                    onChange={(e) => setFormData({ ...formData, dietary_requirements: e.target.value })}
                    placeholder="Any dietary restrictions or preferences..."
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="accommodation"
                    checked={formData.accommodation}
                    onCheckedChange={(checked) => setFormData({ ...formData, accommodation: checked as boolean })}
                  />
                  <Label htmlFor="accommodation">I need accommodation during the hackathon</Label>
                </div>
              </div>

              {/* Agreements */}
              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="agreements"
                    checked={formData.agreements}
                    onCheckedChange={(checked) => setFormData({ ...formData, agreements: checked as boolean })}
                    required
                  />
                  <Label htmlFor="agreements" className="text-sm">
                    I agree to the terms and conditions, code of conduct, and privacy policy. 
                    I confirm that all information provided is accurate and I am eligible to participate.
                  </Label>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Registration'}
                </Button>
              </DialogFooter>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}