import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useAuthUI } from "@/context/AuthUIContext";
import { useAppState } from "@/context/AppStateContext";
import apiService from "@/services/apiService";
import emailService from "@/services/emailService";
import { Loader2 } from "lucide-react";

interface PartnershipFormDialogProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const PartnershipFormDialog = ({ 
  children, 
  title = "Become a Partner",
  description = "Let's explore how we can create value together"
}: PartnershipFormDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const { openLogin } = useAuthUI();
  const { 
    state: { forms }, 
    setFormSubmitting, 
    setFormSubmitted, 
    resetForm,
    triggerGlobalRefresh 
  } = useAppState();
  
  const isLoading = forms.partnership.isSubmitting;
  
  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      resetForm('partnership');
      setFormData({
        companyName: "",
        industry: "",
        contactName: "",
        email: "",
        phone: "",
        partnershipType: "",
        companyDetails: "",
        partnershipGoals: "",
        timeline: ""
      });
    }
  }, [isOpen, resetForm]);
  
  const [formData, setFormData] = useState({
    companyName: "",
    industry: "",
    contactName: "",
    email: "",
    phone: "",
    partnershipType: "",
    companyDetails: "",
    partnershipGoals: "",
    timeline: ""
  });

  const handleOpenChange = (next: boolean) => {
    if (next && !isAuthenticated) {
      openLogin();
      return;
    }
    setIsOpen(next);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit a partnership request.",
        variant: "destructive"
      });
      return;
    }

    // Client-side validation for required fields
    const missing: string[] = [];
    if (!formData.companyName.trim()) missing.push("Company Name");
    if (!formData.industry.trim()) missing.push("Industry");
    if (!formData.contactName.trim()) missing.push("Contact Person");
    if (!formData.email.trim()) missing.push("Email");
    if (!formData.partnershipType.trim()) missing.push("Partnership Type");
    if (!formData.companyDetails.trim()) missing.push("Company Details");
    if (!formData.partnershipGoals.trim()) missing.push("Partnership Goals");

    if (missing.length > 0) {
      toast({
        title: "Missing required fields",
        description: `Please fill: ${missing.join(', ')}`,
        variant: "destructive"
      });
      return;
    }

    setFormSubmitting('partnership', true);

    try {
      // Prepare the partnership request data
      const partnershipData = {
        user_id: user?.id,
        company_name: formData.companyName,
        industry: formData.industry,
        contact_name: formData.contactName,
        email: formData.email,
        phone: formData.phone || null,
        partnership_type: formData.partnershipType,
        company_details: formData.companyDetails,
        partnership_goals: formData.partnershipGoals,
        timeline: formData.timeline || null,
        status: 'submitted'
      };

      // Submit to database
      const dbResponse = await apiService.submitPartnershipRequest(partnershipData);

      if (!dbResponse.success) {
        console.error('Partnership DB insert error:', dbResponse.error);
        const errMessage = typeof dbResponse.error === 'string'
          ? dbResponse.error
          : (dbResponse.error && (dbResponse.error.message || dbResponse.error.details || dbResponse.error.hint))
            || 'Failed to submit partnership request';
        throw new Error(errMessage);
      }

      // Send confirmation email (best-effort)
      console.log('Sending confirmation email...');
      const emailResponse = await emailService.sendPartnershipRequestEmail(
        formData.email,
        formData.contactName,
        {
          companyName: formData.companyName,
          industry: formData.industry,
          contactName: formData.contactName,
          email: formData.email,
          phone: formData.phone,
          partnershipType: formData.partnershipType,
          companyDetails: formData.companyDetails,
          partnershipGoals: formData.partnershipGoals,
          timeline: formData.timeline
        }
      );

      console.log('Email response:', emailResponse);

      if (!emailResponse.success) {
        console.warn('Email sending failed:', emailResponse.error);
        // Show a warning toast about email failure
        toast({
          title: "Partnership Request Submitted! 🤝",
          description: "Your request has been submitted successfully! However, we couldn't send a confirmation email. Please check your spam folder or contact us if you don't receive a response within 7-10 business days.",
          variant: "default"
        });
      } else {
        console.log('Email sent successfully');
      }

      // Success notification
      if (emailResponse.success) {
        toast({
          title: "Partnership Request Submitted! 🤝",
          description: "Thank you for your interest in partnering with us. We've sent a confirmation email to your inbox. We'll review your request and get back to you within 7-10 business days.",
        });
      }

      // Mark form as submitted and trigger global refresh
      setFormSubmitted('partnership');
      triggerGlobalRefresh();
      
      // Reset form and close dialog
      setFormData({
        companyName: "",
        industry: "",
        contactName: "",
        email: "",
        phone: "",
        partnershipType: "",
        companyDetails: "",
        partnershipGoals: "",
        timeline: ""
      });
      setIsOpen(false);

    } catch (error) {
      console.error('Partnership form submission error:', error);
      const message = (error instanceof Error && error.message)
        || (typeof error === 'string' ? error : '')
        || 'Failed to submit partnership request. Please try again.';
      toast({
        title: "Submission Failed",
        description: message,
        variant: "destructive"
      });
    } finally {
      setFormSubmitting('partnership', false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="companyName">Company Name *</Label>
              <Input 
                id="companyName" 
                value={formData.companyName}
                onChange={(e) => handleInputChange("companyName", e.target.value)}
                placeholder="Your company name" 
                required 
              />
            </div>
            <div>
              <Label htmlFor="industry">Industry *</Label>
              <Select value={formData.industry} onValueChange={(value) => handleInputChange("industry", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fintech">FinTech</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="real-estate">Real Estate</SelectItem>
                  <SelectItem value="logistics">Logistics</SelectItem>
                  <SelectItem value="media">Media & Entertainment</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="contactName">Contact Person *</Label>
              <Input 
                id="contactName" 
                value={formData.contactName}
                onChange={(e) => handleInputChange("contactName", e.target.value)}
                placeholder="Full name" 
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
                placeholder="Business email" 
                required 
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="Contact number" 
              />
            </div>
            <div>
              <Label htmlFor="partnershipType">Partnership Type *</Label>
              <Select value={formData.partnershipType} onValueChange={(value) => handleInputChange("partnershipType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="corporate">Corporate Innovation</SelectItem>
                  <SelectItem value="venture">Venture Partnership</SelectItem>
                  <SelectItem value="technology">Technology Integration</SelectItem>
                  <SelectItem value="mentorship">Mentorship Program</SelectItem>
                  <SelectItem value="marketing">Marketing Partnership</SelectItem>
                  <SelectItem value="distribution">Distribution Partnership</SelectItem>
                  <SelectItem value="research">Research Collaboration</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="companyDetails">Company Details *</Label>
            <Textarea
              id="companyDetails"
              value={formData.companyDetails}
              onChange={(e) => handleInputChange("companyDetails", e.target.value)}
              placeholder="Brief description of your company, size, and key business areas"
              rows={3}
              required
            />
          </div>

          <div>
            <Label htmlFor="partnershipGoals">Partnership Goals *</Label>
            <Textarea
              id="partnershipGoals"
              value={formData.partnershipGoals}
              onChange={(e) => handleInputChange("partnershipGoals", e.target.value)}
              placeholder="What do you hope to achieve through this partnership? What value can you bring?"
              rows={4}
              required
            />
          </div>

          <div>
            <Label htmlFor="timeline">Preferred Timeline</Label>
            <Select value={formData.timeline} onValueChange={(value) => handleInputChange("timeline", value)}>
              <SelectTrigger>
                <SelectValue placeholder="When would you like to start?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immediately</SelectItem>
                <SelectItem value="1month">Within 1 month</SelectItem>
                <SelectItem value="3months">Within 3 months</SelectItem>
                <SelectItem value="6months">Within 6 months</SelectItem>
                <SelectItem value="flexible">Flexible</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1" disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="hero" className="flex-1" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Partnership Request 🤝"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PartnershipFormDialog;
