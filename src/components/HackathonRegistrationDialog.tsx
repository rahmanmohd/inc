import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useAuthUI } from "@/context/AuthUIContext";
import { Loader2 } from "lucide-react";
import apiService from "@/services/apiService";
import emailService from "@/services/emailService";

interface HackathonRegistrationDialogProps {
  children: React.ReactNode;
  hackathonTitle?: string;
}

const HackathonRegistrationDialog = ({ children, hackathonTitle = "Upcoming Hackathon" }: HackathonRegistrationDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const { openLogin } = useAuthUI();

  const [formData, setFormData] = useState({
    teamName: "",
    teamLeader: "",
    teamLeaderEmail: "",
    teamLeaderPhone: "",
    teamSize: "",
    member2Name: "",
    member2Email: "",
    member3Name: "",
    member3Email: "",
    member4Name: "",
    member4Email: "",
    university: "",
    experience: "",
    track: "",
    projectIdea: "",
    technicalSkills: "",
    previousHackathons: "",
    dietaryRequirements: "",
    accommodation: false,
    terms: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.terms) {
      toast({
        title: "Agreement Required",
        description: "Please accept the terms and conditions",
        variant: "destructive"
      });
      return;
    }

    // Check authentication first
    if (!isAuthenticated || !user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to register for the hackathon",
        variant: "destructive"
      });
      openLogin();
      return;
    }

    // Validate required fields
    const requiredFields = ['teamName', 'teamLeader', 'teamLeaderEmail', 'teamLeaderPhone', 'teamSize', 'track', 'technicalSkills'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: `Please fill in all required fields: ${missingFields.join(', ')}`,
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Ensure user profile exists
      const profileResponse = await apiService.ensureUserProfile(user.id, formData.teamLeaderEmail);
      if (!profileResponse.success) {
        throw new Error('Failed to create user profile. Please try again.');
      }

      // Prepare registration data for Supabase
      const registrationData = {
        user_id: user.id,
        full_name: formData.teamLeader,
        email: formData.teamLeaderEmail,
        phone: formData.teamLeaderPhone,
        team_name: formData.teamName,
        team_size: formData.teamSize,
        university: formData.university || null,
        experience: formData.experience || null,
        track: formData.track,
        project_idea: formData.projectIdea || null,
        technical_skills: formData.technicalSkills,
        previous_hackathons: formData.previousHackathons || null,
        dietary_requirements: formData.dietaryRequirements || null,
        accommodation: formData.accommodation,
        agreements: formData.terms,
        // Team members data
        member2_name: formData.member2Name || null,
        member2_email: formData.member2Email || null,
        member3_name: formData.member3Name || null,
        member3_email: formData.member3Email || null,
        member4_name: formData.member4Name || null,
        member4_email: formData.member4Email || null
      };

      // Submit registration using API service
      const response = await apiService.registerForHackathon(registrationData);

      if (response.success) {
        // Send confirmation email
        const emailResponse = await emailService.sendHackathonRegistrationEmail(
          formData.teamLeaderEmail,
          formData.teamLeader,
          formData
        );

        if (emailResponse.success) {
          toast({
            title: "Registration Successful! 🚀",
            description: "Your team is registered for the hackathon and confirmation email sent. Check your email for confirmation and further details.",
          });
        } else {
          toast({
            title: "Registration Successful! 🚀",
            description: "Your team is registered for the hackathon. Check your email for confirmation and further details.",
          });
        }
        
        // Reset form
        setFormData({
          teamName: "",
          teamLeader: "",
          teamLeaderEmail: "",
          teamLeaderPhone: "",
          teamSize: "",
          member2Name: "",
          member2Email: "",
          member3Name: "",
          member3Email: "",
          member4Name: "",
          member4Email: "",
          university: "",
          experience: "",
          track: "",
          projectIdea: "",
          technicalSkills: "",
          previousHackathons: "",
          dietaryRequirements: "",
          accommodation: false,
          terms: false
        });
        
        setOpen(false);
      } else {
        toast({
          title: "Registration Failed",
          description: response.message || "Failed to register for hackathon. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (next: boolean) => {
    if (next && !isAuthenticated) {
      openLogin();
      return;
    }
    setOpen(next);
  };

  // Pre-fill form with user data if available
  const handleOpen = () => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        teamLeader: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName || "",
        teamLeaderEmail: user.email || ""
      }));
    }
    setOpen(true);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <div onClick={handleOpen}>
          {children}
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Register for {hackathonTitle}</DialogTitle>
          <DialogDescription>
            Fill out this form to register your team for the hackathon. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Team Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Team Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="teamName">Team Name *</Label>
                <Input
                  id="teamName"
                  placeholder="Enter your team name"
                  value={formData.teamName}
                  onChange={(e) => setFormData({...formData, teamName: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="teamSize">Team Size *</Label>
                <Select value={formData.teamSize} onValueChange={(value) => setFormData({...formData, teamSize: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Member</SelectItem>
                    <SelectItem value="2">2 Members</SelectItem>
                    <SelectItem value="3">3 Members</SelectItem>
                    <SelectItem value="4">4 Members</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Team Leader Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Team Leader Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="teamLeader">Full Name *</Label>
                <Input
                  id="teamLeader"
                  placeholder="Team leader's full name"
                  value={formData.teamLeader}
                  onChange={(e) => setFormData({...formData, teamLeader: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="teamLeaderEmail">Email *</Label>
                <Input
                  id="teamLeaderEmail"
                  type="email"
                  placeholder="Email address"
                  value={formData.teamLeaderEmail}
                  onChange={(e) => setFormData({...formData, teamLeaderEmail: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="teamLeaderPhone">Phone Number *</Label>
                <Input
                  id="teamLeaderPhone"
                  placeholder="+91 XXXXX XXXXX"
                  value={formData.teamLeaderPhone}
                  onChange={(e) => setFormData({...formData, teamLeaderPhone: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="university">University/Organization</Label>
                <Input
                  id="university"
                  placeholder="Your university or organization"
                  value={formData.university}
                  onChange={(e) => setFormData({...formData, university: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Team Members (Optional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="member2Name">Member 2 Name</Label>
                <Input
                  id="member2Name"
                  placeholder="Full name"
                  value={formData.member2Name}
                  onChange={(e) => setFormData({...formData, member2Name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="member2Email">Member 2 Email</Label>
                <Input
                  id="member2Email"
                  type="email"
                  placeholder="Email address"
                  value={formData.member2Email}
                  onChange={(e) => setFormData({...formData, member2Email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="member3Name">Member 3 Name</Label>
                <Input
                  id="member3Name"
                  placeholder="Full name"
                  value={formData.member3Name}
                  onChange={(e) => setFormData({...formData, member3Name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="member3Email">Member 3 Email</Label>
                <Input
                  id="member3Email"
                  type="email"
                  placeholder="Email address"
                  value={formData.member3Email}
                  onChange={(e) => setFormData({...formData, member3Email: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="member4Name">Member 4 Name</Label>
                <Input
                  id="member4Name"
                  placeholder="Full name"
                  value={formData.member4Name}
                  onChange={(e) => setFormData({...formData, member4Name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="member4Email">Member 4 Email</Label>
                <Input
                  id="member4Email"
                  type="email"
                  placeholder="Email address"
                  value={formData.member4Email}
                  onChange={(e) => setFormData({...formData, member4Email: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Hackathon Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Hackathon Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="track">Preferred Track *</Label>
                <Select value={formData.track} onValueChange={(value) => setFormData({...formData, track: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select track" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="agritech">AgriTech Track</SelectItem>
                    <SelectItem value="fintech">FinTech Track</SelectItem>
                    <SelectItem value="healthtech">HealthTech Track</SelectItem>
                    <SelectItem value="edtech">EdTech Track</SelectItem>
                    <SelectItem value="open">Open Innovation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Experience Level</Label>
                <Select value={formData.experience} onValueChange={(value) => setFormData({...formData, experience: value})}>
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
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="projectIdea">Project Idea (Brief Description)</Label>
              <Textarea
                id="projectIdea"
                placeholder="Briefly describe your project idea or problem you want to solve..."
                value={formData.projectIdea}
                onChange={(e) => setFormData({...formData, projectIdea: e.target.value})}
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="technicalSkills">Technical Skills *</Label>
              <Textarea
                id="technicalSkills"
                placeholder="List your team's technical skills (programming languages, frameworks, etc.)"
                value={formData.technicalSkills}
                onChange={(e) => setFormData({...formData, technicalSkills: e.target.value})}
                className="min-h-[80px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="previousHackathons">Previous Hackathon Experience</Label>
              <Textarea
                id="previousHackathons"
                placeholder="Tell us about your previous hackathon experiences and achievements"
                value={formData.previousHackathons}
                onChange={(e) => setFormData({...formData, previousHackathons: e.target.value})}
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Additional Information</h3>
            <div className="space-y-2">
              <Label htmlFor="dietaryRequirements">Dietary Requirements</Label>
              <Input
                id="dietaryRequirements"
                placeholder="Any dietary restrictions or preferences"
                value={formData.dietaryRequirements}
                onChange={(e) => setFormData({...formData, dietaryRequirements: e.target.value})}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="accommodation"
                checked={formData.accommodation}
                onCheckedChange={(checked) => setFormData({...formData, accommodation: checked as boolean})}
              />
              <Label htmlFor="accommodation">I need accommodation assistance</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={formData.terms}
                onCheckedChange={(checked) => setFormData({...formData, terms: checked as boolean})}
                required
              />
              <Label htmlFor="terms">I agree to the terms and conditions *</Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={!formData.terms || isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                "Register Team"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default HackathonRegistrationDialog;