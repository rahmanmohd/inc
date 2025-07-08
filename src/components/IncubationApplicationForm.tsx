
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface IncubationApplicationFormProps {
  children: React.ReactNode;
}

const IncubationApplicationForm = ({ children }: IncubationApplicationFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
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
    
    // Problem & Solution
    problemStatement: "",
    solutionDescription: "",
    uniqueValue: "",
    targetCustomers: "",
    marketSize: "",
    competition: "",
    competitiveAdvantage: "",
    
    // Business Model & Traction
    businessModel: "",
    revenueModel: "",
    currentRevenue: "",
    customers: "",
    partnerships: "",
    milestones: "",
    
    // Team & Resources
    teamSize: "",
    keyTeamMembers: "",
    advisors: "",
    currentLocation: "",
    workingStatus: "",
    
    // Funding & Growth
    previousFunding: "",
    fundingNeeds: "",
    useOfFunds: "",
    growthStrategy: "",
    scalingPlan: "",
    
    // Incubation Specific
    whyIncubation: "",
    expectations: "",
    mentorshipNeeds: "",
    programDuration: "",
    
    // Additional
    pitchDeck: "",
    businessPlan: "",
    financialProjections: "",
    references: "",
    agreements: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreements) {
      toast({
        title: "Agreement Required",
        description: "Please accept the terms and conditions",
        variant: "destructive"
      });
      return;
    }

    console.log("Incubation application submitted:", formData);
    
    toast({
      title: "Application Submitted Successfully! 🚀",
      description: "We'll review your application and get back to you within 7-10 business days.",
    });
    
    setIsOpen(false);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
                <Label htmlFor="coFounderName">Co-Founder Name(s)</Label>
                <Input
                  id="coFounderName"
                  value={formData.coFounderName}
                  onChange={(e) => handleInputChange("coFounderName", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
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
                <Label htmlFor="education">Educational Background</Label>
                <Input
                  id="education"
                  value={formData.education}
                  onChange={(e) => handleInputChange("education", e.target.value)}
                  placeholder="e.g., B.Tech Computer Science, IIT Delhi"
                />
              </div>
            </div>
            <div className="mt-4">
              <Label htmlFor="experience">Professional Experience *</Label>
              <Textarea
                id="experience"
                value={formData.experience}
                onChange={(e) => handleInputChange("experience", e.target.value)}
                placeholder="Describe your professional background and relevant experience..."
                required
              />
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
                <Label htmlFor="website">Website/App URL</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="stage">Current Stage *</Label>
                <Select onValueChange={(value) => handleInputChange("stage", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="idea">Idea Stage</SelectItem>
                    <SelectItem value="prototype">Prototype Developed</SelectItem>
                    <SelectItem value="mvp">MVP Launched</SelectItem>
                    <SelectItem value="early-traction">Early Traction</SelectItem>
                    <SelectItem value="revenue">Generating Revenue</SelectItem>
                    <SelectItem value="scaling">Ready to Scale</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="industry">Industry Sector *</Label>
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
                    <SelectItem value="saas">SaaS/B2B Software</SelectItem>
                    <SelectItem value="iot">IoT/Hardware</SelectItem>
                    <SelectItem value="ai-ml">AI/Machine Learning</SelectItem>
                    <SelectItem value="blockchain">Blockchain/Web3</SelectItem>
                    <SelectItem value="cleantech">CleanTech/Sustainability</SelectItem>
                    <SelectItem value="social-impact">Social Impact</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <Label htmlFor="description">Startup Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Provide a clear, concise description of your startup..."
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mission">Mission Statement</Label>
                  <Textarea
                    id="mission"
                    value={formData.mission}
                    onChange={(e) => handleInputChange("mission", e.target.value)}
                    placeholder="What is your startup's mission?"
                  />
                </div>
                <div>
                  <Label htmlFor="vision">Vision Statement</Label>
                  <Textarea
                    id="vision"
                    value={formData.vision}
                    onChange={(e) => handleInputChange("vision", e.target.value)}
                    placeholder="Where do you see your startup in 5 years?"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Problem & Solution */}
          <Card className="p-6 bg-card-gradient border-border">
            <h3 className="text-xl font-semibold mb-4 text-primary">Problem & Solution</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="problemStatement">Problem Statement *</Label>
                <Textarea
                  id="problemStatement"
                  value={formData.problemStatement}
                  onChange={(e) => handleInputChange("problemStatement", e.target.value)}
                  placeholder="What specific problem are you solving? Why is it important?"
                  required
                />
              </div>
              <div>
                <Label htmlFor="solutionDescription">Solution Description *</Label>
                <Textarea
                  id="solutionDescription"
                  value={formData.solutionDescription}
                  onChange={(e) => handleInputChange("solutionDescription", e.target.value)}
                  placeholder="How does your solution address the problem?"
                  required
                />
              </div>
              <div>
                <Label htmlFor="uniqueValue">Unique Value Proposition *</Label>
                <Textarea
                  id="uniqueValue"
                  value={formData.uniqueValue}
                  onChange={(e) => handleInputChange("uniqueValue", e.target.value)}
                  placeholder="What makes your solution unique and valuable?"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="targetCustomers">Target Customers *</Label>
                  <Textarea
                    id="targetCustomers"
                    value={formData.targetCustomers}
                    onChange={(e) => handleInputChange("targetCustomers", e.target.value)}
                    placeholder="Who are your target customers?"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="marketSize">Market Size & Opportunity</Label>
                  <Textarea
                    id="marketSize"
                    value={formData.marketSize}
                    onChange={(e) => handleInputChange("marketSize", e.target.value)}
                    placeholder="Size of your target market and growth potential"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="competition">Key Competitors</Label>
                  <Textarea
                    id="competition"
                    value={formData.competition}
                    onChange={(e) => handleInputChange("competition", e.target.value)}
                    placeholder="Who are your main competitors?"
                  />
                </div>
                <div>
                  <Label htmlFor="competitiveAdvantage">Competitive Advantage</Label>
                  <Textarea
                    id="competitiveAdvantage"
                    value={formData.competitiveAdvantage}
                    onChange={(e) => handleInputChange("competitiveAdvantage", e.target.value)}
                    placeholder="What gives you an edge over competitors?"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Business Model & Traction */}
          <Card className="p-6 bg-card-gradient border-border">
            <h3 className="text-xl font-semibold mb-4 text-primary">Business Model & Traction</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="businessModel">Business Model *</Label>
                  <Textarea
                    id="businessModel"
                    value={formData.businessModel}
                    onChange={(e) => handleInputChange("businessModel", e.target.value)}
                    placeholder="How does your business operate?"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="revenueModel">Revenue Model *</Label>
                  <Textarea
                    id="revenueModel"
                    value={formData.revenueModel}
                    onChange={(e) => handleInputChange("revenueModel", e.target.value)}
                    placeholder="How do you make money?"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="currentRevenue">Current Monthly Revenue</Label>
                  <Input
                    id="currentRevenue"
                    value={formData.currentRevenue}
                    onChange={(e) => handleInputChange("currentRevenue", e.target.value)}
                    placeholder="e.g., ₹2,50,000 or 0 if pre-revenue"
                  />
                </div>
                <div>
                  <Label htmlFor="customers">Current Customers/Users</Label>
                  <Input
                    id="customers"
                    value={formData.customers}
                    onChange={(e) => handleInputChange("customers", e.target.value)}
                    placeholder="Number of paying customers or active users"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="partnerships">Key Partnerships</Label>
                <Textarea
                  id="partnerships"
                  value={formData.partnerships}
                  onChange={(e) => handleInputChange("partnerships", e.target.value)}
                  placeholder="Any strategic partnerships or collaborations"
                />
              </div>
              <div>
                <Label htmlFor="milestones">Key Milestones Achieved</Label>
                <Textarea
                  id="milestones"
                  value={formData.milestones}
                  onChange={(e) => handleInputChange("milestones", e.target.value)}
                  placeholder="Major achievements, awards, recognitions, product launches, etc."
                />
              </div>
            </div>
          </Card>

          {/* Team & Resources */}
          <Card className="p-6 bg-card-gradient border-border">
            <h3 className="text-xl font-semibold mb-4 text-primary">Team & Resources</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="teamSize">Current Team Size</Label>
                  <Input
                    id="teamSize"
                    value={formData.teamSize}
                    onChange={(e) => handleInputChange("teamSize", e.target.value)}
                    placeholder="e.g., 5 people"
                  />
                </div>
                <div>
                  <Label htmlFor="currentLocation">Current Location</Label>
                  <Input
                    id="currentLocation"
                    value={formData.currentLocation}
                    onChange={(e) => handleInputChange("currentLocation", e.target.value)}
                    placeholder="City, State"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="keyTeamMembers">Key Team Members & Roles</Label>
                <Textarea
                  id="keyTeamMembers"
                  value={formData.keyTeamMembers}
                  onChange={(e) => handleInputChange("keyTeamMembers", e.target.value)}
                  placeholder="List key team members, their roles, and relevant background"
                />
              </div>
              <div>
                <Label htmlFor="advisors">Advisors/Mentors</Label>
                <Textarea
                  id="advisors"
                  value={formData.advisors}
                  onChange={(e) => handleInputChange("advisors", e.target.value)}
                  placeholder="Any advisors or mentors currently supporting your startup"
                />
              </div>
              <div>
                <Label htmlFor="workingStatus">Current Working Status</Label>
                <Select onValueChange={(value) => handleInputChange("workingStatus", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Working on startup full-time</SelectItem>
                    <SelectItem value="part-time">Working part-time while employed</SelectItem>
                    <SelectItem value="student">Student working part-time</SelectItem>
                    <SelectItem value="transition">Planning to transition full-time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Funding & Growth */}
          <Card className="p-6 bg-card-gradient border-border">
            <h3 className="text-xl font-semibold mb-4 text-primary">Funding & Growth Plans</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="previousFunding">Previous Funding</Label>
                  <Input
                    id="previousFunding"
                    value={formData.previousFunding}
                    onChange={(e) => handleInputChange("previousFunding", e.target.value)}
                    placeholder="e.g., ₹10 Lakhs bootstrapped, ₹50 Lakhs seed"
                  />
                </div>
                <div>
                  <Label htmlFor="fundingNeeds">Funding Required</Label>
                  <Input
                    id="fundingNeeds"
                    value={formData.fundingNeeds}
                    onChange={(e) => handleInputChange("fundingNeeds", e.target.value)}
                    placeholder="e.g., ₹1 Crore for next 18 months"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="useOfFunds">Use of Funds</Label>
                <Textarea
                  id="useOfFunds"
                  value={formData.useOfFunds}
                  onChange={(e) => handleInputChange("useOfFunds", e.target.value)}
                  placeholder="How will you use the funding? (hiring, marketing, product development, etc.)"
                />
              </div>
              <div>
                <Label htmlFor="growthStrategy">Growth Strategy</Label>
                <Textarea
                  id="growthStrategy"
                  value={formData.growthStrategy}
                  onChange={(e) => handleInputChange("growthStrategy", e.target.value)}
                  placeholder="What's your plan for acquiring customers and growing the business?"
                />
              </div>
              <div>
                <Label htmlFor="scalingPlan">Scaling Plan</Label>
                <Textarea
                  id="scalingPlan"
                  value={formData.scalingPlan}
                  onChange={(e) => handleInputChange("scalingPlan", e.target.value)}
                  placeholder="How do you plan to scale your startup geographically and operationally?"
                />
              </div>
            </div>
          </Card>

          {/* Incubation Specific */}
          <Card className="p-6 bg-card-gradient border-border">
            <h3 className="text-xl font-semibold mb-4 text-primary">Incubation Program</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="whyIncubation">Why do you want to join our incubation program? *</Label>
                <Textarea
                  id="whyIncubation"
                  value={formData.whyIncubation}
                  onChange={(e) => handleInputChange("whyIncubation", e.target.value)}
                  placeholder="What specific value do you expect from our incubation program?"
                  required
                />
              </div>
              <div>
                <Label htmlFor="expectations">What are your expectations from the program?</Label>
                <Textarea
                  id="expectations"
                  value={formData.expectations}
                  onChange={(e) => handleInputChange("expectations", e.target.value)}
                  placeholder="What do you hope to achieve during the incubation period?"
                />
              </div>
              <div>
                <Label htmlFor="mentorshipNeeds">Specific Mentorship Needs</Label>
                <Textarea
                  id="mentorshipNeeds"
                  value={formData.mentorshipNeeds}
                  onChange={(e) => handleInputChange("mentorshipNeeds", e.target.value)}
                  placeholder="What areas do you need mentorship in? (e.g., product, sales, fundraising)"
                />
              </div>
              <div>
                <Label htmlFor="programDuration">Preferred Program Duration</Label>
                <Select onValueChange={(value) => handleInputChange("programDuration", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3-months">3 months</SelectItem>
                    <SelectItem value="6-months">6 months</SelectItem>
                    <SelectItem value="12-months">12 months</SelectItem>
                    <SelectItem value="flexible">Flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Additional Documents */}
          <Card className="p-6 bg-card-gradient border-border">
            <h3 className="text-xl font-semibold mb-4 text-primary">Supporting Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Label htmlFor="businessPlan">Business Plan URL</Label>
                <Input
                  id="businessPlan"
                  value={formData.businessPlan}
                  onChange={(e) => handleInputChange("businessPlan", e.target.value)}
                  placeholder="Link to detailed business plan"
                />
              </div>
              <div>
                <Label htmlFor="financialProjections">Financial Projections URL</Label>
                <Input
                  id="financialProjections"
                  value={formData.financialProjections}
                  onChange={(e) => handleInputChange("financialProjections", e.target.value)}
                  placeholder="Link to financial projections/model"
                />
              </div>
              <div>
                <Label htmlFor="references">References</Label>
                <Input
                  id="references"
                  value={formData.references}
                  onChange={(e) => handleInputChange("references", e.target.value)}
                  placeholder="Professional references or recommendations"
                />
              </div>
            </div>
          </Card>

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

export default IncubationApplicationForm;
