import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, X } from "lucide-react";
import hackathonService from "@/services/hackathonService";

interface ProjectSubmissionFormProps {
  children: React.ReactNode;
  hackathonId: string;
  hackathonTitle: string;
}

const ProjectSubmissionForm = ({ children, hackathonId, hackathonTitle }: ProjectSubmissionFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    teamName: "",
    projectTitle: "",
    projectDescription: "",
    teamMembers: [""],
    technologies: [""],
    githubRepo: "",
    demoLink: "",
    presentationLink: "",
    track: ""
  });

  const tracks = [
    { value: "ai-ml", label: "AI/ML Track" },
    { value: "web-development", label: "Web Development" },
    { value: "mobile-apps", label: "Mobile Apps" },
    { value: "blockchain-web3", label: "Blockchain/Web3" },
    { value: "iot-hardware", label: "IoT & Hardware" },
    { value: "open-innovation", label: "Open Innovation" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = ['teamName', 'projectTitle', 'projectDescription', 'track'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: `Please fill in all required fields: ${missingFields.join(', ')}`,
        variant: "destructive"
      });
      return;
    }

    // Validate team members
    const validTeamMembers = formData.teamMembers.filter(member => member.trim() !== "");
    if (validTeamMembers.length === 0) {
      toast({
        title: "Team Members Required",
        description: "Please add at least one team member",
        variant: "destructive"
      });
      return;
    }

    // Validate technologies
    const validTechnologies = formData.technologies.filter(tech => tech.trim() !== "");
    if (validTechnologies.length === 0) {
      toast({
        title: "Technologies Required",
        description: "Please add at least one technology",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const submissionData = {
        hackathonId,
        teamName: formData.teamName,
        projectTitle: formData.projectTitle,
        projectDescription: formData.projectDescription,
        teamMembers: validTeamMembers,
        technologies: validTechnologies,
        githubRepo: formData.githubRepo || undefined,
        demoLink: formData.demoLink || undefined,
        presentationLink: formData.presentationLink || undefined,
        track: formData.track,
        status: 'submitted' as const
      };

      const response = await hackathonService.submitProject(submissionData);

      if (response.success) {
        toast({
          title: "Project Submitted Successfully! 🚀",
          description: "Your project has been submitted. Check your email for confirmation.",
        });
        
        // Reset form
        setFormData({
          teamName: "",
          projectTitle: "",
          projectDescription: "",
          teamMembers: [""],
          technologies: [""],
          githubRepo: "",
          demoLink: "",
          presentationLink: "",
          track: ""
        });
        
        setIsOpen(false);
      } else {
        toast({
          title: "Submission Failed",
          description: response.message || "Failed to submit project. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Project submission error:', error);
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

  const addTeamMember = () => {
    setFormData(prev => ({
      ...prev,
      teamMembers: [...prev.teamMembers, ""]
    }));
  };

  const removeTeamMember = (index: number) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((_, i) => i !== index)
    }));
  };

  const updateTeamMember = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.map((member, i) => i === index ? value : member)
    }));
  };

  const addTechnology = () => {
    setFormData(prev => ({
      ...prev,
      technologies: [...prev.technologies, ""]
    }));
  };

  const removeTechnology = (index: number) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index)
    }));
  };

  const updateTechnology = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.map((tech, i) => i === index ? value : tech)
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div onClick={() => setIsOpen(true)}>
          {children}
        </div>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
            Project Submission
          </DialogTitle>
          <p className="text-center text-muted-foreground">Submit your hackathon project for ${hackathonTitle}</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Project Information */}
          <Card className="p-6 bg-card-gradient border-border">
            <h3 className="text-xl font-semibold mb-4 text-primary">Project Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="teamName">Team Name *</Label>
                <Input
                  id="teamName"
                  value={formData.teamName}
                  onChange={(e) => handleInputChange("teamName", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="projectTitle">Project Title *</Label>
                <Input
                  id="projectTitle"
                  value={formData.projectTitle}
                  onChange={(e) => handleInputChange("projectTitle", e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="mt-4">
              <Label htmlFor="projectDescription">Project Description *</Label>
              <Textarea
                id="projectDescription"
                value={formData.projectDescription}
                onChange={(e) => handleInputChange("projectDescription", e.target.value)}
                placeholder="Describe your project, its features, and the problem it solves..."
                rows={4}
                required
              />
            </div>
            <div className="mt-4">
              <Label htmlFor="track">Competition Track *</Label>
              <Select onValueChange={(value) => handleInputChange("track", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a track" />
                </SelectTrigger>
                <SelectContent>
                  {tracks.map((track) => (
                    <SelectItem key={track.value} value={track.value}>
                      {track.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Team Members */}
          <Card className="p-6 bg-card-gradient border-border">
            <h3 className="text-xl font-semibold mb-4 text-primary">Team Members</h3>
            <div className="space-y-3">
              {formData.teamMembers.map((member, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={member}
                    onChange={(e) => updateTeamMember(index, e.target.value)}
                    placeholder={`Team member ${index + 1} name and email`}
                    className="flex-1"
                  />
                  {formData.teamMembers.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeTeamMember(index)}
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addTeamMember}
                disabled={isLoading}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Team Member
              </Button>
            </div>
          </Card>

          {/* Technologies */}
          <Card className="p-6 bg-card-gradient border-border">
            <h3 className="text-xl font-semibold mb-4 text-primary">Technologies Used</h3>
            <div className="space-y-3">
              {formData.technologies.map((tech, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={tech}
                    onChange={(e) => updateTechnology(index, e.target.value)}
                    placeholder={`Technology ${index + 1}`}
                    className="flex-1"
                  />
                  {formData.technologies.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeTechnology(index)}
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addTechnology}
                disabled={isLoading}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Technology
              </Button>
            </div>
          </Card>

          {/* Links */}
          <Card className="p-6 bg-card-gradient border-border">
            <h3 className="text-xl font-semibold mb-4 text-primary">Project Links</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="githubRepo">GitHub Repository</Label>
                <Input
                  id="githubRepo"
                  value={formData.githubRepo}
                  onChange={(e) => handleInputChange("githubRepo", e.target.value)}
                  placeholder="https://github.com/username/repository"
                />
              </div>
              <div>
                <Label htmlFor="demoLink">Demo Link</Label>
                <Input
                  id="demoLink"
                  value={formData.demoLink}
                  onChange={(e) => handleInputChange("demoLink", e.target.value)}
                  placeholder="https://your-demo-link.com"
                />
              </div>
              <div>
                <Label htmlFor="presentationLink">Presentation Link</Label>
                <Input
                  id="presentationLink"
                  value={formData.presentationLink}
                  onChange={(e) => handleInputChange("presentationLink", e.target.value)}
                  placeholder="https://slides.com/presentation"
                />
              </div>
            </div>
          </Card>

          <div className="flex gap-4 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)} 
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="hero" 
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Project 🚀"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectSubmissionForm;
