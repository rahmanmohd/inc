
import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { EmailService } from '@/lib/emailService'
import { Tables } from '@/types/supabase-latest'
import { 
  Building, 
  User, 
  Mail, 
  Phone, 
  GraduationCap, 
  Target, 
  Lightbulb, 
  Users, 
  DollarSign,
  ExternalLink,
  Upload
} from 'lucide-react'

type IncubationProgram = Tables<'incubation_programs'>

interface IncubationApplicationFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  program: IncubationProgram | null
  onSuccess: () => void
}

export const IncubationApplicationForm: React.FC<IncubationApplicationFormProps> = ({
  open,
  onOpenChange,
  program,
  onSuccess
}) => {
  const { toast } = useToast()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    founder_name: '',
    cofounder_name: '',
    email: '',
    phone: '',
    linkedin_profile: '',
    education: '',
    experience: '',
    startup_name: '',
    website: '',
    stage: '',
    industry: '',
    description: '',
    mission: '',
    vision: '',
    problem_statement: '',
    solution_description: '',
    target_market: '',
    business_model: '',
    revenue_model: '',
    current_traction: '',
    funding_requirements: '',
    team_size: 1,
    pitch_deck_url: '',
    financials_url: ''
  })

  useEffect(() => {
    if (user && open) {
      // Pre-fill with user data if available
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
        founder_name: user.email?.split('@')[0] || ''
      }))
    }
  }, [user, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('Current user object:', user)
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to apply for incubation programs",
        variant: "destructive"
      })
      return
    }

    if (!user.id) {
      console.error('User object missing ID:', user)
      toast({
        title: "Authentication Error",
        description: "User session is invalid. Please log out and log back in.",
        variant: "destructive"
      })
      return
    }

    if (!program) {
      toast({
        title: "Program Not Found",
        description: "Please select a valid incubation program",
        variant: "destructive"
      })
      return
    }

    // Validate program ID exists
    if (!program?.id) {
      toast({
        title: "Program Error",
        description: "Invalid program selected. Please try again.",
        variant: "destructive"
      })
      return
    }

    // Validate required fields
    const requiredFields = [
      'founder_name', 'email', 'startup_name', 'stage', 'industry', 
      'description', 'problem_statement', 'solution_description', 'target_market'
    ]
    
    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]) {
      toast({
        title: "Missing Information",
          description: `Please fill in ${field.replace('_', ' ')}`,
        variant: "destructive"
        })
        return
      }
    }

    setLoading(true)
    try {
      // Get current user from Supabase directly to ensure we have the right ID
      const { data: { user: supabaseUser }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !supabaseUser) {
        console.error('Failed to get authenticated user:', userError)
        toast({
          title: "Authentication Required",
          description: "Please log in to submit an application.",
          variant: "destructive"
        })
        return
      }
      
      console.log('Supabase user ID:', supabaseUser.id)

      const applicationData = {
        user_id: supabaseUser.id,
        program_id: program.id,
        founder_name: formData.founder_name,
        cofounder_name: formData.cofounder_name || null,
        email: formData.email,
        phone: formData.phone || null,
        linkedin_profile: formData.linkedin_profile || null,
        education: formData.education || null,
        experience: formData.experience || null,
        startup_name: formData.startup_name,
        website: formData.website || null,
        stage: formData.stage,
        industry: formData.industry,
        description: formData.description,
        mission: formData.mission || null,
        vision: formData.vision || null,
        problem_statement: formData.problem_statement,
        solution_description: formData.solution_description,
        target_market: formData.target_market,
        business_model: formData.business_model || null,
        revenue_model: formData.revenue_model || null,
        current_traction: formData.current_traction || null,
        funding_requirements: formData.funding_requirements || null,
        team_size: formData.team_size,
        pitch_deck_url: formData.pitch_deck_url || null,
        financials_url: formData.financials_url || null
      }

      console.log('Submitting application data:', applicationData)
      
      const { data: insertedData, error } = await supabase
        .from('incubation_applications_new')
        .insert(applicationData)
        .select()

      console.log('Application insert result:', { insertedData, error })
      
      if (error) throw error

      // Update program application count
      await supabase
        .from('incubation_programs')
        .update({ 
          application_count: (program.application_count ?? 0) + 1
        })
        .eq('id', program.id)

        // Send confirmation email
      try {
        const emailResult = await EmailService.sendIncubationApplicationConfirmation(
          program as unknown as { title: string; [key: string]: unknown },
          {
            email: user.email || '',
            full_name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email?.split('@')[0] || ''
          },
          formData
        )
        if (emailResult.success) {
          console.log('Confirmation email sent successfully')
        } else {
          console.warn('Failed to send confirmation email:', emailResult.error)
        }
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError)
        // Don't fail the application if email fails
      }

      toast({
        title: "Application Submitted!",
        description: `Your application for ${program.title} has been submitted successfully. Check your email for confirmation!`
      })

      onSuccess()
    } catch (error) {
      console.error('Error submitting application:', error)
      toast({
        title: "Application Failed",
        description: `Failed to submit application: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  if (!program) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Apply for {program.title}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Program Info */}
          <div className="lg:col-span-1">
            <div className="bg-muted p-4 rounded-lg space-y-4">
              <h3 className="font-semibold text-lg">{program.subtitle}</h3>
              <p className="text-sm text-muted-foreground">{program.description}</p>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span>{program.location}</span>
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
                {program.equity_requirement && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>Equity: {program.equity_requirement}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Application Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Founder Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Founder Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="founder_name">Founder Name *</Label>
                    <Input
                      id="founder_name"
                      value={formData.founder_name}
                      onChange={(e) => setFormData({ ...formData, founder_name: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cofounder_name">Co-founder Name</Label>
                    <Input
                      id="cofounder_name"
                      value={formData.cofounder_name}
                      onChange={(e) => setFormData({ ...formData, cofounder_name: e.target.value })}
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
                    <Label htmlFor="linkedin_profile">LinkedIn Profile</Label>
                    <Input
                      id="linkedin_profile"
                      value={formData.linkedin_profile}
                      onChange={(e) => setFormData({ ...formData, linkedin_profile: e.target.value })}
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="education">Education</Label>
                    <Input
                      id="education"
                      value={formData.education}
                      onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                      placeholder="e.g., B.Tech Computer Science"
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="experience">Relevant Experience</Label>
                    <Textarea
                      id="experience"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      placeholder="Describe your relevant work experience..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Startup Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Startup Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startup_name">Startup Name *</Label>
                    <Input
                      id="startup_name"
                      value={formData.startup_name}
                      onChange={(e) => setFormData({ ...formData, startup_name: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://yourstartup.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="stage">Development Stage *</Label>
                    <Select
                      value={formData.stage}
                      onValueChange={(value) => setFormData({ ...formData, stage: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select stage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="idea">Idea Stage</SelectItem>
                        <SelectItem value="mvp">MVP Development</SelectItem>
                        <SelectItem value="early_traction">Early Traction</SelectItem>
                        <SelectItem value="scaling">Scaling</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry *</Label>
                    <Input
                      id="industry"
                      value={formData.industry}
                      onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                      placeholder="e.g., FinTech, HealthTech, EdTech"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="team_size">Team Size</Label>
                    <Input
                      id="team_size"
                      type="number"
                      value={formData.team_size}
                      onChange={(e) => setFormData({ ...formData, team_size: parseInt(e.target.value) || 1 })}
                      min="1"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Startup Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of your startup..."
                    rows={3}
                    required
                  />
                </div>
              </div>

              {/* Business Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Business Details</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="problem_statement">Problem Statement *</Label>
                    <Textarea
                      id="problem_statement"
                      value={formData.problem_statement}
                      onChange={(e) => setFormData({ ...formData, problem_statement: e.target.value })}
                      placeholder="What problem are you solving?"
                      rows={3}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="solution_description">Solution Description *</Label>
                    <Textarea
                      id="solution_description"
                      value={formData.solution_description}
                      onChange={(e) => setFormData({ ...formData, solution_description: e.target.value })}
                      placeholder="How does your solution address the problem?"
                      rows={3}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="target_market">Target Market *</Label>
                    <Textarea
                      id="target_market"
                      value={formData.target_market}
                      onChange={(e) => setFormData({ ...formData, target_market: e.target.value })}
                      placeholder="Who is your target market?"
                      rows={2}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="business_model">Business Model</Label>
                      <Input
                        id="business_model"
                        value={formData.business_model}
                        onChange={(e) => setFormData({ ...formData, business_model: e.target.value })}
                        placeholder="e.g., SaaS, Marketplace, B2B"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="revenue_model">Revenue Model</Label>
                      <Input
                        id="revenue_model"
                        value={formData.revenue_model}
                        onChange={(e) => setFormData({ ...formData, revenue_model: e.target.value })}
                        placeholder="e.g., Subscription, Commission, License"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="current_traction">Current Traction</Label>
                    <Textarea
                      id="current_traction"
                      value={formData.current_traction}
                      onChange={(e) => setFormData({ ...formData, current_traction: e.target.value })}
                      placeholder="What traction have you achieved so far?"
                      rows={2}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="funding_requirements">Funding Requirements</Label>
                    <Input
                      id="funding_requirements"
                      value={formData.funding_requirements}
                      onChange={(e) => setFormData({ ...formData, funding_requirements: e.target.value })}
                      placeholder="e.g., ₹50 Lakhs for product development"
                    />
                  </div>
                </div>
              </div>

              {/* Vision & Mission */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Vision & Mission</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mission">Mission</Label>
                    <Textarea
                      id="mission"
                      value={formData.mission}
                      onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
                      placeholder="What is your startup's mission?"
                      rows={2}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="vision">Vision</Label>
                    <Textarea
                      id="vision"
                      value={formData.vision}
                      onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
                      placeholder="What is your long-term vision?"
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              {/* Documents & Links */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Documents & Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pitch_deck_url">Pitch Deck URL</Label>
                    <Input
                      id="pitch_deck_url"
                      value={formData.pitch_deck_url}
                      onChange={(e) => setFormData({ ...formData, pitch_deck_url: e.target.value })}
                      placeholder="https://drive.google.com/..."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="financials_url">Financial Statements URL</Label>
                    <Input
                      id="financials_url"
                      value={formData.financials_url}
                      onChange={(e) => setFormData({ ...formData, financials_url: e.target.value })}
                      placeholder="https://drive.google.com/..."
                    />
                  </div>
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
                  {loading ? 'Submitting...' : 'Submit Application'}
            </Button>
              </DialogFooter>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
