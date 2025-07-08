
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

interface FounderInfoSectionProps {
  formData: any;
  onInputChange: (field: string, value: string) => void;
}

const FounderInfoSection = ({ formData, onInputChange }: FounderInfoSectionProps) => {
  return (
    <Card className="p-6 bg-card-gradient border-border">
      <h3 className="text-xl font-semibold mb-4 text-primary">Founder Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="founderName">Lead Founder Name *</Label>
          <Input
            id="founderName"
            value={formData.founderName}
            onChange={(e) => onInputChange("founderName", e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="coFounderName">Co-Founder Name(s)</Label>
          <Input
            id="coFounderName"
            value={formData.coFounderName}
            onChange={(e) => onInputChange("coFounderName", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => onInputChange("email", e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => onInputChange("phone", e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="linkedIn">LinkedIn Profile</Label>
          <Input
            id="linkedIn"
            value={formData.linkedIn}
            onChange={(e) => onInputChange("linkedIn", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="education">Educational Background</Label>
          <Input
            id="education"
            value={formData.education}
            onChange={(e) => onInputChange("education", e.target.value)}
            placeholder="e.g., B.Tech Computer Science, IIT Delhi"
          />
        </div>
      </div>
      <div className="mt-4">
        <Label htmlFor="experience">Professional Experience *</Label>
        <Textarea
          id="experience"
          value={formData.experience}
          onChange={(e) => onInputChange("experience", e.target.value)}
          placeholder="Describe your professional background and relevant experience..."
          required
        />
      </div>
    </Card>
  );
};

export default FounderInfoSection;
