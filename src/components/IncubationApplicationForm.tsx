
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useAuthUI } from "@/context/AuthUIContext";
import apiService from "@/services/apiService";
import emailService from "@/services/emailService";
import FounderInfoSection from "./incubation/FounderInfoSection";
import StartupInfoSection from "./incubation/StartupInfoSection";

interface IncubationApplicationFormProps {
  children: React.ReactNode;
}

const IncubationApplicationForm = ({ children }: IncubationApplicationFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const { openLogin } = useAuthUI();
  
  const [formData, setFormData] = useState({
    // Founder Information
    founderName: "",
    coFounderName: "",
    email: "",
    phone: "",
    linkedIn: "",
    education: "",
    experience: "",
    
    // Startup Information
    startupName: "",
    website: "",
    stage: "",
    industry: "",
    description: "",
    mission: "",
    vision: "",
    
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

    // Validate required fields
    const requiredFields = ['founderName', 'email', 'phone', 'experience', 'startupName', 'stage', 'industry', 'description'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: `Please fill in all required fields: ${missingFields.join(', ')}`,
        variant: "destructive"
      });
      return;
    }

    // Check authentication first
    if (!isAuthenticated || !user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit your application",
        variant: "destructive"
      });
      openLogin();
      return;
    }

    setIsLoading(true);

    // Add timeout to prevent indefinite loading
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Request Timeout",
        description: "The request is taking longer than expected. Please check your internet connection and try again.",
        variant: "destructive"
      });
    }, 20000); // Reduced to 20 seconds timeout

    try {
      console.log('User ID:', user?.id);
      console.log('Is Authenticated:', isAuthenticated);
      console.log('Form Data:', formData);
      
      if (!user?.id) {
        throw new Error('User not authenticated. Please log in and try again.');
      }

      // Ensure user profile exists
      const profileResponse = await apiService.ensureUserProfile(user.id, formData.email);
      if (!profileResponse.success) {
        throw new Error('Failed to create user profile. Please try again.');
      }
      
      // Prepare application data for Supabase
      const applicationData = {
        applicant_id: user.id,
        user_id: user.id,
        founder_name: formData.founderName,
        cofounder_name: formData.coFounderName || null,
        email: formData.email,
        phone: formData.phone,
        linkedin: formData.linkedIn || null,
        linkedin_profile: formData.linkedIn || null,
        education: formData.education || null,
        experience: formData.experience,
        startup_name: formData.startupName,
        website: formData.website || null,
        stage: formData.stage,
        industry: formData.industry,
        description: formData.description,
        mission: formData.mission || null,
        vision: formData.vision || null,
        status: 'pending'
      };

      console.log('Application Data:', applicationData);

      // Submit application using API service
      const response = await apiService.submitIncubationApplication(applicationData);

      clearTimeout(timeoutId); // Clear timeout on success
      console.log('API Response:', response);

      if (response.success) {
        // Send confirmation email
        console.log('IncubationApplicationForm: Sending email for:', formData.email);
        const emailResponse = await emailService.sendIncubationApplicationEmail(
          formData.email,
          formData.founderName,
          formData
        );

        console.log('IncubationApplicationForm: Email response:', emailResponse);

        if (emailResponse.success) {
          toast({
            title: "Application Submitted Successfully! 🚀",
            description: "Your incubation application has been submitted and confirmation email sent. You can submit additional applications anytime. We'll review and get back to you within 7-10 business days.",
          });
        } else {
          toast({
            title: "Application Submitted Successfully! 🚀",
            description: "Your incubation application has been submitted. You can submit additional applications anytime. We'll review and get back to you within 7-10 business days.",
          });
        }
        
        // Reset form
        setFormData({
          founderName: "",
          coFounderName: "",
          email: "",
          phone: "",
          linkedIn: "",
          education: "",
          experience: "",
          startupName: "",
          website: "",
          stage: "",
          industry: "",
          description: "",
          mission: "",
          vision: "",
          agreements: false
        });
        
        setIsOpen(false);
      } else {
        console.error('API Error:', response.error);
        toast({
          title: "Submission Failed",
          description: response.message || response.error?.message || "Failed to submit application. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      clearTimeout(timeoutId); // Clear timeout on error
      console.error('Incubation application error:', error);
      toast({
        title: "Submission Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-card">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
            Incubation Program Application
          </DialogTitle>
          <p className="text-center text-muted-foreground">Apply for comprehensive startup incubation and acceleration</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          <FounderInfoSection formData={formData} onInputChange={handleInputChange} />
          <StartupInfoSection formData={formData} onInputChange={handleInputChange} />

          {/* Agreement */}
          <div className="flex items-start space-x-2">
            <Checkbox
              id="agreements"
              checked={formData.agreements}
              onCheckedChange={(checked) => handleInputChange("agreements", checked as boolean)}
            />
            <Label htmlFor="agreements" className="text-sm leading-5">
              I agree to the incubation program terms & conditions and confirm that all information provided is accurate. 
              I understand that the selection process may include interviews and due diligence.
            </Label>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1" disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="hero" className="flex-1" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit Application 🚀"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default IncubationApplicationForm;
