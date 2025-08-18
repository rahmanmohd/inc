
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useAuthUI } from "@/context/AuthUIContext";
import { Loader2 } from "lucide-react";
import PersonalInfoSection from "./hackathon/PersonalInfoSection";
import TechnicalSkillsSection from "./hackathon/TechnicalSkillsSection";
import apiService from "@/services/apiService";
import emailService from "@/services/emailService";

interface HackathonRegistrationFormProps {
  children: React.ReactNode;
  hackathonId?: string;
  hackathonTitle?: string;
}

const HackathonRegistrationForm = ({ children, hackathonId = "1", hackathonTitle = "AI Innovation Challenge 2025" }: HackathonRegistrationFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const { openLogin } = useAuthUI();
  
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: "",
    email: "",
    phone: "",
    age: "",
    city: "",
    college: "",
    graduation: "",
    
    // Technical Skills
    programmingLanguages: "",
    experience: "",
    frameworks: "",
    specialization: "",
    githubProfile: "",
    portfolio: "",
    
    agreements: false
  });

  const handleOpenChange = (next: boolean) => {
    if (next && !isAuthenticated) {
      openLogin();
      return;
    }
    setIsOpen(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreements) {
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
    const requiredFields = ['fullName', 'email', 'phone', 'age', 'city', 'programmingLanguages', 'experience'];
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
      const profileResponse = await apiService.ensureUserProfile(user.id, formData.email);
      if (!profileResponse.success) {
        throw new Error('Failed to create user profile. Please try again.');
      }

      // Prepare registration data for Supabase
      const registrationData = {
        user_id: user.id,
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        age: formData.age,
        city: formData.city,
        college: formData.college || null,
        graduation: formData.graduation || null,
        programming_languages: formData.programmingLanguages,
        experience: formData.experience,
        frameworks: formData.frameworks || null,
        specialization: formData.specialization || null,
        github_profile: formData.githubProfile || null,
        portfolio: formData.portfolio || null,
        agreements: formData.agreements
      };

      // Submit registration using API service
      const response = await apiService.registerForHackathon(registrationData);

      if (response.success) {
        // Send confirmation email
        const emailResponse = await emailService.sendHackathonRegistrationEmail(
          formData.email,
          formData.fullName,
          formData
        );

        if (emailResponse.success) {
          toast({
            title: "Registration Successful! 🚀",
            description: "You're registered for the hackathon and confirmation email sent. You can register for additional hackathons anytime. Check your email for confirmation and further details.",
          });
        } else {
          toast({
            title: "Registration Successful! 🚀",
            description: "You're registered for the hackathon. You can register for additional hackathons anytime. Check your email for confirmation and further details.",
          });
        }
        
        // Reset form
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          age: "",
          city: "",
          college: "",
          graduation: "",
          programmingLanguages: "",
          experience: "",
          frameworks: "",
          specialization: "",
          githubProfile: "",
          portfolio: "",
          agreements: false
        });
        
        setIsOpen(false);
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

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Pre-fill form with user data if available
  const handleOpen = () => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName || "",
        email: user.email || ""
      }));
    }
    setIsOpen(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <div onClick={handleOpen}>
          {children}
        </div>
      </DialogTrigger>
      
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-card">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
            Hackathon Registration
          </DialogTitle>
          <p className="text-center text-muted-foreground">Register for {hackathonTitle}</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          <PersonalInfoSection formData={formData} onInputChange={handleInputChange} />
          <TechnicalSkillsSection formData={formData} onInputChange={handleInputChange} />

          {/* Agreement */}
          <div className="flex items-start space-x-2">
            <Checkbox
              id="agreements"
              checked={formData.agreements}
              onCheckedChange={(checked) => handleInputChange("agreements", checked as boolean)}
            />
            <Label htmlFor="agreements" className="text-sm leading-5">
              I agree to the hackathon terms & conditions and confirm that all information provided is accurate. 
              I understand that participation is subject to approval and may include interviews.
            </Label>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1" disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="hero" className="flex-1" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                "Register for Hackathon 🚀"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default HackathonRegistrationForm;
