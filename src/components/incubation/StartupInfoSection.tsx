
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";

interface StartupInfoSectionProps {
  formData: any;
  onInputChange: (field: string, value: string) => void;
}

const StartupInfoSection = ({ formData, onInputChange }: StartupInfoSectionProps) => {
  return (
    <Card className="p-6 bg-card-gradient border-border">
      <h3 className="text-xl font-semibold mb-4 text-primary">Startup Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startupName">Startup Name *</Label>
          <Input
            id="startupName"
            value={formData.startupName}
            onChange={(e) => onInputChange("startupName", e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="website">Website/App URL</Label>
          <Input
            id="website"
            value={formData.website}
            onChange={(e) => onInputChange("website", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="stage">Current Stage *</Label>
          <Select onValueChange={(value) => onInputChange("stage", value)}>
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
          <Select onValueChange={(value) => onInputChange("industry", value)}>
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
            onChange={(e) => onInputChange("description", e.target.value)}
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
              onChange={(e) => onInputChange("mission", e.target.value)}
              placeholder="What is your startup's mission?"
            />
          </div>
          <div>
            <Label htmlFor="vision">Vision Statement</Label>
            <Textarea
              id="vision"
              value={formData.vision}
              onChange={(e) => onInputChange("vision", e.target.value)}
              placeholder="Where do you see your startup in 5 years?"
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StartupInfoSection;
