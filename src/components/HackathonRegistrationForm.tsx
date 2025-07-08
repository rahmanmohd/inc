
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import PersonalInfoSection from "./hackathon/PersonalInfoSection";
import TechnicalSkillsSection from "./hackathon/TechnicalSkillsSection";

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
