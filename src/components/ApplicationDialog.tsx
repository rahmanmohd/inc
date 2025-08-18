
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useAuthUI } from "@/context/AuthUIContext";
import apiService from "@/services/apiService";
import emailService from "@/services/emailService";

interface ApplicationDialogProps {
  children: React.ReactNode;
  program?: string;
  type?: string;
  title?: string;
  description?: string;
}

const ApplicationDialog = ({ 
  children, 
  program = "INClab",
  type,
  title,
  description
}: ApplicationDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const { openLogin } = useAuthUI();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    startupName: "",
    stage: "",
    problem: "",
    solution: "",
    market: "",
    traction: "",
    funding: "",
    why: ""
  });

  const handleOpenChange = (next: boolean) => {
    if (next && !isAuthenticated) {
      openLogin();
      return;
    }
    setOpen(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'problem', 'solution', 'market', 'why'];
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

    try {
      // Ensure user profile exists
      const profileResponse = await apiService.ensureUserProfile(user.id, formData.email);
      if (!profileResponse.success) {
        throw new Error('Failed to create user profile. Please try again.');
      }

      // Prepare application data for Supabase
      const applicationData = {
        applicant_id: user.id,
        user_id: user.id,
        program: program,
        program_name: program,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        startup_name: formData.startupName || null,
        stage: formData.stage || null,
        current_stage: formData.stage || null,
        problem: formData.problem,
        problem_statement: formData.problem,
        solution: formData.solution,
        solution_description: formData.solution,
        market: formData.market,
        target_market: formData.market,
        traction: formData.traction || null,
        current_traction: formData.traction || null,
        funding: formData.funding || null,
        funding_requirements: formData.funding || null,
        why: formData.why,
        why_join: formData.why,
        status: 'pending'
      };

      // Submit application using API service
      const response = await apiService.submitProgramApplication(applicationData);

      if (response.success) {
        // Send confirmation email
        const emailResponse = await emailService.sendProgramApplicationEmail(
          formData.email,
          `${formData.firstName} ${formData.lastName}`,
          { ...formData, program }
        );

        if (emailResponse.success) {
          toast({
            title: "Application Submitted Successfully! 🚀",
            description: `Your ${program} application has been submitted and confirmation email sent. You can submit additional applications anytime. We'll review and get back to you within 7-10 business days.`,
          });
        } else {
          toast({
            title: "Application Submitted Successfully! 🚀",
            description: `Your ${program} application has been submitted. You can submit additional applications anytime. We'll review and get back to you within 7-10 business days.`,
          });
        }
        
        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          startupName: "",
          stage: "",
          problem: "",
          solution: "",
          market: "",
          traction: "",
          funding: "",
          why: ""
        });
        
        setOpen(false);
      } else {
        toast({
          title: "Submission Failed",
          description: response.message || "Failed to submit application. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Program application error:', error);
      toast({
        title: "Submission Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Use custom title if provided, otherwise default
  const dialogTitle = title || `Apply to ${program}`;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input 
                id="firstName" 
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input 
                id="lastName" 
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                required 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input 
              type="email" 
              id="email" 
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input 
              type="tel" 
              id="phone" 
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="startupName">Startup Name</Label>
            <Input 
              id="startupName" 
              value={formData.startupName}
              onChange={(e) => handleInputChange("startupName", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stage">Current Stage</Label>
            <Select value={formData.stage} onValueChange={(value) => handleInputChange("stage", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="idea">Idea Stage</SelectItem>
                <SelectItem value="mvp">MVP Developed</SelectItem>
                <SelectItem value="early-traction">Early Traction</SelectItem>
                <SelectItem value="growth">Growth Stage</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="problem">Problem Statement *</Label>
            <Textarea 
              id="problem" 
              placeholder="Describe the problem you're solving..."
              value={formData.problem}
              onChange={(e) => handleInputChange("problem", e.target.value)}
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="solution">Solution *</Label>
            <Textarea 
              id="solution" 
              placeholder="Describe your solution..."
              value={formData.solution}
              onChange={(e) => handleInputChange("solution", e.target.value)}
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="market">Target Market *</Label>
            <Textarea 
              id="market" 
              placeholder="Describe your target market and size..."
              value={formData.market}
              onChange={(e) => handleInputChange("market", e.target.value)}
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="traction">Current Traction</Label>
            <Textarea 
              id="traction" 
              placeholder="Users, revenue, partnerships, etc..."
              value={formData.traction}
              onChange={(e) => handleInputChange("traction", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="funding">Funding Requirements</Label>
            <Input 
              id="funding" 
              placeholder="e.g., ₹25L, ₹1Cr"
              value={formData.funding}
              onChange={(e) => handleInputChange("funding", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="why">Why Inc Combinator? *</Label>
            <Textarea 
              id="why" 
              placeholder="Why do you want to join our program?"
              value={formData.why}
              onChange={(e) => handleInputChange("why", e.target.value)}
              required 
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1" disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="hero" className="flex-1" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationDialog;
