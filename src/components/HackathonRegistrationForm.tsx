
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

interface HackathonRegistrationFormProps {
  children: React.ReactNode;
}

const HackathonRegistrationForm = ({ children }: HackathonRegistrationFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
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
    
    // Hackathon Experience
    hackathonExperience: "",
    previousHackathons: "",
    achievements: "",
    teamPreference: "",
    
    // Project Ideas
    problemStatement: "",
    solutionIdea: "",
    techStack: "",
    
    // Additional
    motivation: "",
    expectations: "",
    dietaryRestrictions: "",
    tshirtSize: "",
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

    console.log("Hackathon registration submitted:", formData);
    
    toast({
      title: "Registration Successful! 🚀",
      description: "You're registered for the hackathon. Check your email for further details.",
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
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
            Hackathon Registration
          </DialogTitle>
          <p className="text-center text-muted-foreground">Join India's premier hackathon for innovative problem solvers</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <Card className="p-6 bg-card-gradient border-border">
            <h3 className="text-xl font-semibold mb-4 text-primary">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  required
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
                <Label htmlFor="age">Age *</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="college">College/University</Label>
                <Input
                  id="college"
                  value={formData.college}
                  onChange={(e) => handleInputChange("college", e.target.value)}
                />
              </div>
            </div>
            <div className="mt-4">
              <Label htmlFor="graduation">Graduation Year</Label>
              <Select onValueChange={(value) => handleInputChange("graduation", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select graduation year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2026">2026</SelectItem>
                  <SelectItem value="2027">2027</SelectItem>
                  <SelectItem value="working">Working Professional</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Technical Skills */}
          <Card className="p-6 bg-card-gradient border-border">
            <h3 className="text-xl font-semibold mb-4 text-primary">Technical Skills</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="programmingLanguages">Programming Languages *</Label>
                <Input
                  id="programmingLanguages"
                  value={formData.programmingLanguages}
                  onChange={(e) => handleInputChange("programmingLanguages", e.target.value)}
                  placeholder="e.g., Python, JavaScript, Java, C++"
                  required
                />
              </div>
              <div>
                <Label htmlFor="experience">Years of Programming Experience *</Label>
                <Select onValueChange={(value) => handleInputChange("experience", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner (0-1 years)</SelectItem>
                    <SelectItem value="intermediate">Intermediate (1-3 years)</SelectItem>
                    <SelectItem value="advanced">Advanced (3-5 years)</SelectItem>
                    <SelectItem value="expert">Expert (5+ years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="frameworks">Frameworks & Technologies</Label>
                <Input
                  id="frameworks"
                  value={formData.frameworks}
                  onChange={(e) => handleInputChange("frameworks", e.target.value)}
                  placeholder="e.g., React, Node.js, Django, Flutter"
                />
              </div>
              <div>
                <Label htmlFor="specialization">Area of Specialization</Label>
                <Select onValueChange={(value) => handleInputChange("specialization", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="web-development">Web Development</SelectItem>
                    <SelectItem value="mobile-development">Mobile Development</SelectItem>
                    <SelectItem value="data-science">Data Science/ML</SelectItem>
                    <SelectItem value="blockchain">Blockchain</SelectItem>
                    <SelectItem value="ai-ml">AI/Machine Learning</SelectItem>
                    <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
                    <SelectItem value="game-development">Game Development</SelectItem>
                    <SelectItem value="full-stack">Full Stack Development</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="githubProfile">GitHub Profile</Label>
                  <Input
                    id="githubProfile"
                    value={formData.githubProfile}
                    onChange={(e) => handleInputChange("githubProfile", e.target.value)}
                    placeholder="https://github.com/username"
                  />
                </div>
                <div>
                  <Label htmlFor="portfolio">Portfolio/Personal Website</Label>
                  <Input
                    id="portfolio"
                    value={formData.portfolio}
                    onChange={(e) => handleInputChange("portfolio", e.target.value)}
                    placeholder="https://yourportfolio.com"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Hackathon Experience */}
          <Card className="p-6 bg-card-gradient border-border">
            <h3 className="text-xl font-semibold mb-4 text-primary">Hackathon Experience</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="hackathonExperience">Have you participated in hackathons before?</Label>
                <Select onValueChange={(value) => handleInputChange("hackathonExperience", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="first-time">This is my first hackathon</SelectItem>
                    <SelectItem value="1-3">1-3 hackathons</SelectItem>
                    <SelectItem value="4-10">4-10 hackathons</SelectItem>
                    <SelectItem value="10+">More than 10 hackathons</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="previousHackathons">Previous Hackathons (if any)</Label>
                <Textarea
                  id="previousHackathons"
                  value={formData.previousHackathons}
                  onChange={(e) => handleInputChange("previousHackathons", e.target.value)}
                  placeholder="List hackathons you've participated in..."
                />
              </div>
              <div>
                <Label htmlFor="achievements">Achievements/Awards</Label>
                <Textarea
                  id="achievements"
                  value={formData.achievements}
                  onChange={(e) => handleInputChange("achievements", e.target.value)}
                  placeholder="Any awards, recognition, or notable projects..."
                />
              </div>
              <div>
                <Label htmlFor="teamPreference">Team Preference</Label>
                <Select onValueChange={(value) => handleInputChange("teamPreference", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select preference" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solo">I prefer to work solo</SelectItem>
                    <SelectItem value="have-team">I already have a team</SelectItem>
                    <SelectItem value="find-team">Help me find a team</SelectItem>
                    <SelectItem value="flexible">I'm flexible</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Project Ideas */}
          <Card className="p-6 bg-card-gradient border-border">
            <h3 className="text-xl font-semibold mb-4 text-primary">Project Ideas & Motivation</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="problemStatement">What problem would you like to solve?</Label>
                <Textarea
                  id="problemStatement"
                  value={formData.problemStatement}
                  onChange={(e) => handleInputChange("problemStatement", e.target.value)}
                  placeholder="Describe a problem you're passionate about solving..."
                />
              </div>
              <div>
                <Label htmlFor="solutionIdea">Initial Solution Idea</Label>
                <Textarea
                  id="solutionIdea"
                  value={formData.solutionIdea}
                  onChange={(e) => handleInputChange("solutionIdea", e.target.value)}
                  placeholder="Your initial thoughts on how to solve it..."
                />
              </div>
              <div>
                <Label htmlFor="techStack">Preferred Tech Stack</Label>
                <Input
                  id="techStack"
                  value={formData.techStack}
                  onChange={(e) => handleInputChange("techStack", e.target.value)}
                  placeholder="Technologies you'd like to use for your project"
                />
              </div>
              <div>
                <Label htmlFor="motivation">Why do you want to participate?</Label>
                <Textarea
                  id="motivation"
                  value={formData.motivation}
                  onChange={(e) => handleInputChange("motivation", e.target.value)}
                  placeholder="What motivates you to join this hackathon?"
                />
              </div>
            </div>
          </Card>

          {/* Additional Information */}
          <Card className="p-6 bg-card-gradient border-border">
            <h3 className="text-xl font-semibold mb-4 text-primary">Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dietaryRestrictions">Dietary Restrictions</Label>
                <Input
                  id="dietaryRestrictions"
                  value={formData.dietaryRestrictions}
                  onChange={(e) => handleInputChange("dietaryRestrictions", e.target.value)}
                  placeholder="Any dietary restrictions or allergies"
                />
              </div>
              <div>
                <Label htmlFor="tshirtSize">T-Shirt Size</Label>
                <Select onValueChange={(value) => handleInputChange("tshirtSize", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="xs">XS</SelectItem>
                    <SelectItem value="s">S</SelectItem>
                    <SelectItem value="m">M</SelectItem>
                    <SelectItem value="l">L</SelectItem>
                    <SelectItem value="xl">XL</SelectItem>
                    <SelectItem value="xxl">XXL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-4">
              <Label htmlFor="expectations">What do you expect to learn/achieve?</Label>
              <Textarea
                id="expectations"
                value={formData.expectations}
                onChange={(e) => handleInputChange("expectations", e.target.value)}
                placeholder="Your expectations from this hackathon..."
              />
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
              I agree to the hackathon rules, code of conduct, and terms & conditions. I understand that 
              I need to be present for the entire duration of the event and will work ethically.
            </Label>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="hero" className="flex-1">
              Register for Hackathon 🚀
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default HackathonRegistrationForm;
