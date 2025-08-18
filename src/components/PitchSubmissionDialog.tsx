
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useAuthUI } from "@/context/AuthUIContext";
import apiService from "@/services/apiService";

interface PitchSubmissionDialogProps {
  children: React.ReactNode;
}

const PitchSubmissionDialog = ({ children }: PitchSubmissionDialogProps) => {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const { openLogin } = useAuthUI();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    startupName: "",
    founderName: "",
    email: "",
    phone: "",
    stage: "",
    sector: "",
    fundingRequired: "",
    monthlyRevenue: "",
    teamSize: "",
    location: "",
    description: "",
    useOfFunds: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleOpenChange = (next: boolean) => {
    if (next && !isAuthenticated) {
      openLogin();
      return;
    }
    setIsOpen(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = ['startupName', 'founderName', 'email', 'stage', 'sector', 'fundingRequired', 'description', 'useOfFunds'];
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
      // Prepare investment application data for Supabase (treating pitch as investment application)
      const applicationData = {
        user_id: user?.id || '',
        target_investor: 'pitch-submission', // Special identifier for pitch submissions
        funding_amount: formData.fundingRequired,
        funding_stage: formData.stage,
        current_valuation: null,
        use_of_funds: formData.useOfFunds,
        business_model: formData.description, // Using description as business model
        monthly_revenue: formData.monthlyRevenue || null,
        user_traction: null,
        team_size: formData.teamSize || null,
        pitch_deck_url: null,
        financial_statements_url: null,
        status: 'pending' as const,
        // Additional pitch-specific fields (these might need to be added to the database schema)
        startup_name: formData.startupName,
        founder_name: formData.founderName,
        sector: formData.sector,
        location: formData.location || null
      };

      // Submit application using API service
      const response = await apiService.submitInvestmentApplication(applicationData);

      if (response.success) {
        toast({
          title: "Pitch Submitted Successfully! 🚀",
          description: "We'll review your pitch within 48 hours and connect you with relevant investors.",
        });
        
        // Reset form
        setFormData({
          startupName: "",
          founderName: "",
          email: "",
          phone: "",
          stage: "",
          sector: "",
          fundingRequired: "",
          monthlyRevenue: "",
          teamSize: "",
          location: "",
          description: "",
          useOfFunds: ""
        });
        
        setIsOpen(false);
      } else {
        toast({
          title: "Submission Failed",
          description: response.message || "Failed to submit pitch. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Pitch submission error:', error);
      toast({
        title: "Submission Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit Your Pitch</DialogTitle>
          <DialogDescription>
            Tell us about your startup and we'll connect you with the right investors.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="startupName">Startup Name *</Label>
                <Input
                  id="startupName"
                  value={formData.startupName}
                  onChange={(e) => handleInputChange("startupName", e.target.value)}
                  placeholder="Your startup name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="founderName">Founder Name *</Label>
                <Input
                  id="founderName"
                  value={formData.founderName}
                  onChange={(e) => handleInputChange("founderName", e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
              <div>
                <Label htmlFor="stage">Current Stage *</Label>
                <Select value={formData.stage} onValueChange={(value) => handleInputChange("stage", value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pre-seed">Pre-Seed</SelectItem>
                    <SelectItem value="seed">Seed</SelectItem>
                    <SelectItem value="series-a">Series A</SelectItem>
                    <SelectItem value="series-b">Series B</SelectItem>
                    <SelectItem value="series-c">Series C</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
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
                    <SelectItem value="consumer">Consumer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="fundingRequired">Funding Required *</Label>
                <Input
                  id="fundingRequired"
                  value={formData.fundingRequired}
                  onChange={(e) => handleInputChange("fundingRequired", e.target.value)}
                  placeholder="e.g., ₹2 Crores"
                  required
                />
              </div>
              <div>
                <Label htmlFor="monthlyRevenue">Monthly Revenue</Label>
                <Input
                  id="monthlyRevenue"
                  value={formData.monthlyRevenue}
                  onChange={(e) => handleInputChange("monthlyRevenue", e.target.value)}
                  placeholder="e.g., ₹5 Lakhs"
                />
              </div>
              <div>
                <Label htmlFor="teamSize">Team Size</Label>
                <Select value={formData.teamSize} onValueChange={(value) => handleInputChange("teamSize", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-5">1-5 members</SelectItem>
                    <SelectItem value="6-10">6-10 members</SelectItem>
                    <SelectItem value="11-25">11-25 members</SelectItem>
                    <SelectItem value="26-50">26-50 members</SelectItem>
                    <SelectItem value="50+">50+ members</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Select value={formData.location} onValueChange={(value) => handleInputChange("location", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bangalore">Bangalore</SelectItem>
                    <SelectItem value="mumbai">Mumbai</SelectItem>
                    <SelectItem value="delhi">Delhi NCR</SelectItem>
                    <SelectItem value="pune">Pune</SelectItem>
                    <SelectItem value="hyderabad">Hyderabad</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div>
            <Label htmlFor="description">Startup Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Briefly describe your startup, the problem you're solving, and your traction..."
              rows={4}
              required
            />
          </div>
          <div>
            <Label htmlFor="useOfFunds">Use of Funds *</Label>
            <Textarea
              id="useOfFunds"
              value={formData.useOfFunds}
              onChange={(e) => handleInputChange("useOfFunds", e.target.value)}
              placeholder="How will you use the funding? (hiring, marketing, product development, etc.)"
              rows={3}
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-primary to-orange-400" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit Pitch"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PitchSubmissionDialog;
