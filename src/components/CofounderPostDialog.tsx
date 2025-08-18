import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useAuthUI } from "@/context/AuthUIContext";
import startupDashboardService from "@/services/startupDashboardService";
import emailService from "@/services/emailService";

interface CofounderPostDialogProps {
  children: React.ReactNode;
}

const CofounderPostDialog = ({ children }: CofounderPostDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const { openLogin } = useAuthUI();

  const [formData, setFormData] = useState({
    title: "",
    role: "",
    description: "",
    experience: "",
    equity: "",
    location: "",
    commitment: "",
    salary: ""
  });

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = ['title', 'role', 'description', 'experience'];
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
        description: "Please log in to post your requirement",
        variant: "destructive"
      });
      openLogin();
      return;
    }

    setIsLoading(true);

    try {
      // Prepare post data
      const postData = {
        user_id: user.id,
        title: formData.title,
        role: formData.role,
        description: formData.description,
        experience: formData.experience,
        equity: formData.equity,
        skills: skills,
        location: formData.location,
        commitment: formData.commitment,
        salary: formData.salary
      };

      // Submit cofounder post
      const response = await startupDashboardService.submitCofounderPost(postData);

      if (response.success) {
        // Send confirmation email
        try {
          await emailService.sendCofounderPostEmail(
            user.email || 'user@example.com',
            user.name || 'User',
            postData
          );
        } catch (emailError) {
          console.error('Email sending failed:', emailError);
        }

        toast({
          title: "Co-founder Requirement Posted Successfully! 🚀",
          description: "Your co-founder requirement has been posted and is now visible to potential co-founders. You'll receive applications directly.",
        });
        
        // Reset form
        setFormData({
          title: "",
          role: "",
          description: "",
          experience: "",
          equity: "",
          location: "",
          commitment: "",
          salary: ""
        });
        setSkills([]);
        setOpen(false);
      } else {
        toast({
          title: "Posting Failed",
          description: response.message || "Failed to post requirement. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Cofounder post error:', error);
      toast({
        title: "Posting Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (next: boolean) => {
    if (next && !isAuthenticated) {
      openLogin();
      return;
    }
    setOpen(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Post Co-founder Requirement</DialogTitle>
          <DialogDescription>
            Find the perfect co-founder for your startup by posting detailed requirements.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Position Title</Label>
              <Input
                id="title"
                placeholder="e.g., Co-founder & CTO"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role Type</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cto">CTO (Technical)</SelectItem>
                  <SelectItem value="cmo">CMO (Marketing)</SelectItem>
                  <SelectItem value="coo">COO (Operations)</SelectItem>
                  <SelectItem value="cfo">CFO (Finance)</SelectItem>
                  <SelectItem value="general">General Co-founder</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the role, responsibilities, and what you're looking for..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="min-h-[120px]"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="experience">Experience Required</Label>
              <Select value={formData.experience} onValueChange={(value) => setFormData({...formData, experience: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-2">0-2 years</SelectItem>
                  <SelectItem value="3-5">3-5 years</SelectItem>
                  <SelectItem value="5-10">5-10 years</SelectItem>
                  <SelectItem value="10+">10+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="equity">Equity Offering (%)</Label>
              <Input
                id="equity"
                placeholder="e.g., 10-25"
                value={formData.equity}
                onChange={(e) => setFormData({...formData, equity: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Required Skills</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a skill..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              />
              <Button type="button" onClick={addSkill} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                  {skill}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeSkill(skill)} />
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="e.g., Remote, Mumbai"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="commitment">Commitment</Label>
              <Select value={formData.commitment} onValueChange={(value) => setFormData({...formData, commitment: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select commitment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="salary">Salary (Optional)</Label>
              <Input
                id="salary"
                placeholder="e.g., ₹50,000/month"
                value={formData.salary}
                onChange={(e) => setFormData({...formData, salary: e.target.value})}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : (
                "Post Requirement"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CofounderPostDialog;