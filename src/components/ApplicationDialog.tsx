import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const ApplicationDialog = ({ triggerText = "Apply Now", variant = "hero" as const }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    // Founder Information
    founderName: "",
    coFounderName: "",
    email: "",
    phone: "",
    linkedIn: "",
    experience: "",
    
    // Startup Information
    startupName: "",
    website: "",
    industry: "",
    stage: "",
    description: "",
    problemSolved: "",
    solution: "",
    targetMarket: "",
    businessModel: "",
    
    // Traction & Metrics
    revenue: "",
    users: "",
    funding: "",
    teamSize: "",
    keyMetrics: "",
    
    // Program Specific
    programType: "",
    whyIncCombinator: "",
    goals: "",
    challenges: "",
    
    // Additional
    pitchDeck: "",
    demo: "",
    references: "",
    agreements: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.agreements) {
      toast({
        title: "Agreement Required",
        description: "Please accept the terms and conditions",
        variant: "destructive"
      });
      return;
    }

    // Here you would typically send to backend
    console.log("Application submitted:", formData);
    
    toast({
      title: "Application Submitted Successfully! 🚀",
      description: "We'll review your application and get back to you within 5-7 business days.",
    });
    
    setIsOpen(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size="lg">
          {triggerText}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
            Inc Combinator Application
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Founder Information */}
          <Card className="p-6 bg-card-gradient border-border">
            <h3 className="text-xl font-semibold mb-4 text-primary">Founder Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="founderName">Lead Founder Name *</Label>
                <Input
                  id="founderName"
                  value={formData.founderName}
                  onChange={(e) => handleInputChange("founderName", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="coFounderName">Co-Founder Name</Label>
                <Input
                  id="coFounderName"
                  value={formData.coFounderName}
                  onChange={(e) => handleInputChange("coFounderName", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="linkedIn">LinkedIn Profile</Label>
                <Input
                  id="linkedIn"
                  value={formData.linkedIn}
                  onChange={(e) => handleInputChange("linkedIn", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="experience">Years of Experience</Label>
                <Select onValueChange={(value) => handleInputChange("experience", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-2">0-2 years</SelectItem>
                    <SelectItem value="3-5">3-5 years</SelectItem>
                    <SelectItem value="6-10">6-10 years</SelectItem>
                    <SelectItem value="10+">10+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Startup Information */}
          <Card className="p-6 bg-card-gradient border-border">
            <h3 className="text-xl font-semibold mb-4 text-primary">Startup Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startupName">Startup Name *</Label>
                <Input
                  id="startupName"
                  value={formData.startupName}
                  onChange={(e) => handleInputChange("startupName", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="website">Website URL</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="industry">Industry *</Label>
                <Select onValueChange={(value) => handleInputChange("industry", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fintech">FinTech</SelectItem>
                    <SelectItem value="healthtech">HealthTech</SelectItem>
                    <SelectItem value="edtech">EdTech</SelectItem>
                    <SelectItem value="agritech">AgriTech</SelectItem>
                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                    <SelectItem value="saas">SaaS</SelectItem>
                    <SelectItem value="ai-ml">AI/ML</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="stage">Current Stage *</Label>
                <Select onValueChange={(value) => handleInputChange("stage", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="idea">Idea Stage</SelectItem>
                    <SelectItem value="prototype">Prototype</SelectItem>
                    <SelectItem value="mvp">MVP</SelectItem>
                    <SelectItem value="early-traction">Early Traction</SelectItem>
                    <SelectItem value="scaling">Scaling</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="mt-4 space-y-4">
              <div>
                <Label htmlFor="description">Startup Description (One-liner) *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe your startup in one compelling sentence"
                  required
                />
              </div>
              <div>
                <Label htmlFor="problemSolved">Problem You're Solving *</Label>
                <Textarea
                  id="problemSolved"
                  value={formData.problemSolved}
                  onChange={(e) => handleInputChange("problemSolved", e.target.value)}
                  placeholder="What major problem are you addressing?"
                  required
                />
              </div>
              <div>
                <Label htmlFor="solution">Your Solution *</Label>
                <Textarea
                  id="solution"
                  value={formData.solution}
                  onChange={(e) => handleInputChange("solution", e.target.value)}
                  placeholder="How are you solving this problem?"
                  required
                />
              </div>
            </div>
          </Card>

          {/* Traction & Metrics */}
          <Card className="p-6 bg-card-gradient border-border">
            <h3 className="text-xl font-semibold mb-4 text-primary">Traction & Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="revenue">Monthly Revenue (₹)</Label>
                <Input
                  id="revenue"
                  value={formData.revenue}
                  onChange={(e) => handleInputChange("revenue", e.target.value)}
                  placeholder="0 if pre-revenue"
                />
              </div>
              <div>
                <Label htmlFor="users">Total Users/Customers</Label>
                <Input
                  id="users"
                  value={formData.users}
                  onChange={(e) => handleInputChange("users", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="funding">Previous Funding (₹)</Label>
                <Input
                  id="funding"
                  value={formData.funding}
                  onChange={(e) => handleInputChange("funding", e.target.value)}
                  placeholder="0 if no funding"
                />
              </div>
              <div>
                <Label htmlFor="teamSize">Team Size</Label>
                <Input
                  id="teamSize"
                  value={formData.teamSize}
                  onChange={(e) => handleInputChange("teamSize", e.target.value)}
                />
              </div>
            </div>
            <div className="mt-4">
              <Label htmlFor="keyMetrics">Key Metrics & Growth</Label>
              <Textarea
                id="keyMetrics"
                value={formData.keyMetrics}
                onChange={(e) => handleInputChange("keyMetrics", e.target.value)}
                placeholder="Share your key performance metrics and growth rate"
              />
            </div>
          </Card>

          {/* Program Specific */}
          <Card className="p-6 bg-card-gradient border-border">
            <h3 className="text-xl font-semibold mb-4 text-primary">Program Details</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="programType">Program Type *</Label>
                <Select onValueChange={(value) => handleInputChange("programType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select program" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mvp-lab">MVP Lab</SelectItem>
                    <SelectItem value="incubation">Incubation Program</SelectItem>
                    <SelectItem value="hackathon">Hackathon Track</SelectItem>
                    <SelectItem value="inclab">INC Lab</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="whyIncCombinator">Why Inc Combinator? *</Label>
                <Textarea
                  id="whyIncCombinator"
                  value={formData.whyIncCombinator}
                  onChange={(e) => handleInputChange("whyIncCombinator", e.target.value)}
                  placeholder="Why do you want to join Inc Combinator specifically?"
                  required
                />
              </div>
              <div>
                <Label htmlFor="goals">Goals for Next 6 Months *</Label>
                <Textarea
                  id="goals"
                  value={formData.goals}
                  onChange={(e) => handleInputChange("goals", e.target.value)}
                  placeholder="What do you want to achieve in the next 6 months?"
                  required
                />
              </div>
            </div>
          </Card>

          {/* Additional Information */}
          <Card className="p-6 bg-card-gradient border-border">
            <h3 className="text-xl font-semibold mb-4 text-primary">Additional Information</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="pitchDeck">Pitch Deck URL</Label>
                <Input
                  id="pitchDeck"
                  value={formData.pitchDeck}
                  onChange={(e) => handleInputChange("pitchDeck", e.target.value)}
                  placeholder="Google Drive/Dropbox link to your pitch deck"
                />
              </div>
              <div>
                <Label htmlFor="demo">Product Demo URL</Label>
                <Input
                  id="demo"
                  value={formData.demo}
                  onChange={(e) => handleInputChange("demo", e.target.value)}
                  placeholder="Link to your product demo or video"
                />
              </div>
              <div>
                <Label htmlFor="references">References</Label>
                <Textarea
                  id="references"
                  value={formData.references}
                  onChange={(e) => handleInputChange("references", e.target.value)}
                  placeholder="Any references, mentors, or notable advisors"
                />
              </div>
            </div>
          </Card>

          {/* Agreement */}
          <div className="flex items-start space-x-2">
            <Checkbox
              id="agreements"
              checked={formData.agreements}
              onCheckedChange={(checked) => handleInputChange("agreements", checked)}
            />
            <Label htmlFor="agreements" className="text-sm leading-5">
              I agree to the Terms & Conditions and confirm that all information provided is accurate. 
              I understand that Inc Combinator will review this application and contact me within 5-7 business days.
            </Label>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="hero" className="flex-1">
              Submit Application 🚀
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationDialog;