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
import startupDashboardService from "@/services/startupDashboardService";
import emailService from "@/services/emailService";

interface InvestmentApplicationDialogProps {
  children: React.ReactNode;
}

const InvestmentApplicationDialog = ({ children }: InvestmentApplicationDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const { openLogin } = useAuthUI();

  const [formData, setFormData] = useState({
    investor: "",
    amount: "",
    stage: "",
    valuation: "",
    useOfFunds: "",
    businessModel: "",
    revenue: "",
    traction: "",
    teamSize: "",
    pitchDeck: "",
    financials: ""
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
    const requiredFields = ['investor', 'amount', 'stage', 'useOfFunds', 'businessModel'];
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
      // Prepare application data for Supabase
      const applicationData = {
        applicant_id: user.id,
        user_id: user.id,
        investor: formData.investor,
        amount: formData.amount,
        stage: formData.stage,
        valuation: formData.valuation || null,
        use_of_funds: formData.useOfFunds,
        business_model: formData.businessModel,
        revenue: formData.revenue || null,
        traction: formData.traction || null,
        team_size: formData.teamSize ? parseInt(formData.teamSize) : null,
        pitch_deck_url: formData.pitchDeck || null,
        financials_url: formData.financials || null,
        status: 'pending'
      };

      // Submit application using startup dashboard service
      const response = await startupDashboardService.submitInvestmentApplication(applicationData);

      if (response.success) {
        // Send confirmation email
        const emailResponse = await emailService.sendInvestmentApplicationEmail(
          user.email || 'user@example.com',
          user.name || 'User',
          formData
        );

        if (emailResponse.success) {
          toast({
            title: "Investment Application Submitted Successfully! 🚀",
            description: "Your investment application has been submitted and confirmation email sent. You can submit additional applications anytime. We'll review and get back to you within 7 business days.",
          });
        } else {
          toast({
            title: "Investment Application Submitted Successfully! 🚀",
            description: "Your investment application has been submitted. You can submit additional applications anytime. We'll review and get back to you within 7 business days.",
          });
        }
        
        // Reset form
        setFormData({
          investor: "",
          amount: "",
          stage: "",
          valuation: "",
          useOfFunds: "",
          businessModel: "",
          revenue: "",
          traction: "",
          teamSize: "",
          pitchDeck: "",
          financials: ""
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
      console.error('Investment application error:', error);
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Apply for Investment</DialogTitle>
          <DialogDescription>
            Submit your investment application with detailed business information.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="investor">Target Investor *</Label>
              <Select value={formData.investor} onValueChange={(value) => handleInputChange("investor", value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select investor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sequoia">Sequoia Capital India</SelectItem>
                  <SelectItem value="accel">Accel Partners</SelectItem>
                  <SelectItem value="matrix">Matrix Partners</SelectItem>
                  <SelectItem value="lightspeed">Lightspeed Ventures</SelectItem>
                  <SelectItem value="nexus">Nexus Venture Partners</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Funding Amount *</Label>
              <Input
                id="amount"
                placeholder="e.g., ₹2.5 Cr"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stage">Funding Stage *</Label>
              <Select value={formData.stage} onValueChange={(value) => handleInputChange("stage", value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pre-seed">Pre-Seed</SelectItem>
                  <SelectItem value="seed">Seed</SelectItem>
                  <SelectItem value="series-a">Series A</SelectItem>
                  <SelectItem value="series-b">Series B</SelectItem>
                  <SelectItem value="series-c">Series C+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="valuation">Current Valuation</Label>
              <Input
                id="valuation"
                placeholder="e.g., ₹10 Cr"
                value={formData.valuation}
                onChange={(e) => handleInputChange("valuation", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="useOfFunds">Use of Funds *</Label>
            <Textarea
              id="useOfFunds"
              placeholder="Describe how you plan to use the funding..."
              value={formData.useOfFunds}
              onChange={(e) => handleInputChange("useOfFunds", e.target.value)}
              className="min-h-[100px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessModel">Business Model *</Label>
            <Textarea
              id="businessModel"
              placeholder="Describe your business model and revenue streams..."
              value={formData.businessModel}
              onChange={(e) => handleInputChange("businessModel", e.target.value)}
              className="min-h-[100px]"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="revenue">Monthly Revenue</Label>
              <Input
                id="revenue"
                placeholder="e.g., ₹5 Lakh"
                value={formData.revenue}
                onChange={(e) => handleInputChange("revenue", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="traction">User Traction</Label>
              <Input
                id="traction"
                placeholder="e.g., 10,000 users"
                value={formData.traction}
                onChange={(e) => handleInputChange("traction", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="teamSize">Team Size</Label>
              <Input
                id="teamSize"
                placeholder="e.g., 8 people"
                value={formData.teamSize}
                onChange={(e) => handleInputChange("teamSize", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pitchDeck">Pitch Deck URL</Label>
              <Input
                id="pitchDeck"
                placeholder="https://drive.google.com/..."
                value={formData.pitchDeck}
                onChange={(e) => handleInputChange("pitchDeck", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="financials">Financial Statements URL</Label>
              <Input
                id="financials"
                placeholder="https://drive.google.com/..."
                value={formData.financials}
                onChange={(e) => handleInputChange("financials", e.target.value)}
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

export default InvestmentApplicationDialog;