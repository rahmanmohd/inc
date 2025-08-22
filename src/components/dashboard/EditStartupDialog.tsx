import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import adminApiService from "@/services/adminApiService";

interface EditStartupDialogProps {
  children: React.ReactNode;
  startupId: string;
  onStartupUpdated: () => void;
}

interface StartupData {
  id: string;
  name: string;
  description?: string;
  industry?: string;
  stage?: string;
  website?: string;
  location?: string;
  team_size?: number;
  founded_year?: number;
  logo_url?: string;
  published: boolean;
}

const EditStartupDialog = ({ children, startupId, onStartupUpdated }: EditStartupDialogProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [startup, setStartup] = useState<StartupData | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    industry: "",
    stage: "",
    website: "",
    location: "",
    team_size: "",
    founded_year: "",
    logo_url: "",
    published: true
  });

  useEffect(() => {
    if (open && startupId) {
      fetchStartupDetails();
    }
  }, [open, startupId]);

  const fetchStartupDetails = async () => {
    setIsLoading(true);
    try {
      const response = await adminApiService.getStartup(startupId);
      if (response.success) {
        const startupData = response.data;
        setStartup(startupData);
        setFormData({
          name: startupData.name || "",
          description: startupData.description || "",
          industry: startupData.industry || "",
          stage: startupData.stage || "",
          website: startupData.website || "",
          location: startupData.location || "",
          team_size: startupData.team_size?.toString() || "",
          founded_year: startupData.founded_year?.toString() || "",
          logo_url: startupData.logo_url || "",
          published: startupData.published
        });
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to fetch startup details",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error fetching startup details:', error);
      toast({
        title: "Error",
        description: "Failed to fetch startup details",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Startup name is required",
        variant: "destructive"
      });
      return;
    }

    setIsUpdating(true);
    try {
      const response = await adminApiService.updateStartup({
        id: startupId,
        name: formData.name,
        description: formData.description || undefined,
        industry: formData.industry || undefined,
        stage: formData.stage || undefined,
        website: formData.website || undefined,
        location: formData.location || undefined,
        team_size: formData.team_size ? parseInt(formData.team_size) : undefined,
        founded_year: formData.founded_year ? parseInt(formData.founded_year) : undefined,
        logo_url: formData.logo_url || undefined,
        published: formData.published
      });

      if (response.success) {
        toast({
          title: "Success",
          description: "Startup updated successfully!",
        });
        setOpen(false);
        onStartupUpdated();
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to update startup",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error updating startup:', error);
      toast({
        title: "Error",
        description: "Failed to update startup. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (!startup && isLoading) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Startup</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading startup details...</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Startup</DialogTitle>
        </DialogHeader>
        {startup && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Startup Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter startup name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select value={formData.industry} onValueChange={(value) => handleInputChange("industry", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HealthTech">HealthTech</SelectItem>
                    <SelectItem value="CleanTech">CleanTech</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="FinTech">FinTech</SelectItem>
                    <SelectItem value="E-commerce">E-commerce</SelectItem>
                    <SelectItem value="AI/ML">AI/ML</SelectItem>
                    <SelectItem value="SaaS">SaaS</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Enter startup description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stage">Stage</Label>
                <Select value={formData.stage} onValueChange={(value) => handleInputChange("stage", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pre-Seed">Pre-Seed</SelectItem>
                    <SelectItem value="Seed">Seed</SelectItem>
                    <SelectItem value="Series A">Series A</SelectItem>
                    <SelectItem value="Series B">Series B</SelectItem>
                    <SelectItem value="Series C">Series C</SelectItem>
                    <SelectItem value="Unicorn">Unicorn</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  placeholder="https://example.com"
                  type="url"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="City, Country"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="team_size">Team Size</Label>
                <Input
                  id="team_size"
                  value={formData.team_size}
                  onChange={(e) => handleInputChange("team_size", e.target.value)}
                  placeholder="Number of employees"
                  type="number"
                  min="1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="founded_year">Founded Year</Label>
                <Input
                  id="founded_year"
                  value={formData.founded_year}
                  onChange={(e) => handleInputChange("founded_year", e.target.value)}
                  placeholder="2020"
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo_url">Logo URL</Label>
                <Input
                  id="logo_url"
                  value={formData.logo_url}
                  onChange={(e) => handleInputChange("logo_url", e.target.value)}
                  placeholder="https://example.com/logo.png"
                  type="url"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="published"
                checked={formData.published}
                onCheckedChange={(checked) => handleInputChange("published", checked as boolean)}
              />
              <Label htmlFor="published">Published (Visible to public)</Label>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isUpdating}>
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Startup"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditStartupDialog;
