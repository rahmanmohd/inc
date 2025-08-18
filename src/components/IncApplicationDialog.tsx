
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useAuthUI } from "@/context/AuthUIContext";
import apiService from "@/services/apiService";

interface IncApplicationDialogProps {
  children: React.ReactNode;
}

const IncApplicationDialog = ({ children }: IncApplicationDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const { openLogin } = useAuthUI();
  
  const [formData, setFormData] = useState({
    startupName: "",
    founderName: "",
    email: "",
    phone: "",
    stage: "",
    sector: "",
    description: "",
    problem: "",
    solution: "",
    traction: "",
    funding: "",
    teamSize: "",
    website: ""
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
    const requiredFields = ['startupName', 'founderName', 'email', 'phone', 'stage', 'sector', 'description', 'problem', 'solution'];
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
      // Prepare application data for Supabase (treating as program application)
      const applicationData = {
        user_id: user?.id || '',
        program_name: 'INC Combinator',
        first_name: formData.founderName.split(' ')[0] || formData.founderName,
        last_name: formData.founderName.split(' ').slice(1).join(' ') || '',
        email: formData.email,
        phone: formData.phone,
        startup_name: formData.startupName,
        current_stage: formData.stage,
        problem_statement: formData.problem,
        solution_description: formData.solution,
        target_market: formData.sector, // Using sector as target market
        current_traction: formData.traction || null,
        funding_requirements: formData.funding || null,
        why_join: formData.description, // Using description as why join
        status: 'pending' as const
      };

      // Submit application using API service
      const response = await apiService.submitProgramApplication(applicationData);

      if (response.success) {
        toast({
          title: "Application Submitted Successfully! 🚀",
          description: "Your Inc Combinator application has been submitted successfully. We'll review it within 7 days.",
        });
        
        // Reset form
        setFormData({
          startupName: "",
          founderName: "",
          email: "",
          phone: "",
          stage: "",
          sector: "",
          description: "",
          problem: "",
          solution: "",
          traction: "",
          funding: "",
          teamSize: "",
          website: ""
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
      console.error('INC application error:', error);
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

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Apply to Inc Combinator</DialogTitle>
          <DialogDescription>
            Join India's premier startup incubator and accelerate your growth with mentorship, funding, and resources.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startupName">Startup Name *</Label>
              <Input
                id="startupName"
                value={formData.startupName}
                onChange={(e) => handleInputChange("startupName", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="founderName">Founder Name *</Label>
              <Input
                id="founderName"
                value={formData.founderName}
                onChange={(e) => handleInputChange("founderName", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stage">Current Stage *</Label>
              <Select value={formData.stage} onValueChange={(value) => handleInputChange("stage", value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="idea">Idea Stage</SelectItem>
                  <SelectItem value="mvp">MVP</SelectItem>
                  <SelectItem value="pre-seed">Pre-Seed</SelectItem>
                  <SelectItem value="seed">Seed</SelectItem>
                  <SelectItem value="early-growth">Early Growth</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sector">Industry Sector *</Label>
              <Select value={formData.sector} onValueChange={(value) => handleInputChange("sector", value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fintech">FinTech</SelectItem>
                  <SelectItem value="healthtech">HealthTech</SelectItem>
                  <SelectItem value="edtech">EdTech</SelectItem>
                  <SelectItem value="ecommerce">E-commerce</SelectItem>
                  <SelectItem value="saas">SaaS</SelectItem>
                  <SelectItem value="cleantech">CleanTech</SelectItem>
                  <SelectItem value="agritech">AgriTech</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="teamSize">Team Size</Label>
              <Input
                id="teamSize"
                placeholder="e.g., 3"
                value={formData.teamSize}
                onChange={(e) => handleInputChange("teamSize", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website/LinkedIn</Label>
              <Input
                id="website"
                placeholder="https://"
                value={formData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Startup Description *</Label>
              <Textarea
                id="description"
                placeholder="Briefly describe what your startup does..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="problem">Problem Statement *</Label>
              <Textarea
                id="problem"
                placeholder="What problem are you solving?"
                value={formData.problem}
                onChange={(e) => handleInputChange("problem", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="solution">Solution *</Label>
              <Textarea
                id="solution"
                placeholder="How does your product/service solve this problem?"
                value={formData.solution}
                onChange={(e) => handleInputChange("solution", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="traction">Traction & Metrics</Label>
              <Textarea
                id="traction"
                placeholder="Share your key metrics, users, revenue, partnerships..."
                value={formData.traction}
                onChange={(e) => handleInputChange("traction", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="funding">Funding History</Label>
              <Textarea
                id="funding"
                placeholder="Previous funding rounds, amounts, investors..."
                value={formData.funding}
                onChange={(e) => handleInputChange("funding", e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit Application"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default IncApplicationDialog;
