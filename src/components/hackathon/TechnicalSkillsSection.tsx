
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";

interface TechnicalSkillsSectionProps {
  formData: any;
  onInputChange: (field: string, value: string) => void;
}

const TechnicalSkillsSection = ({ formData, onInputChange }: TechnicalSkillsSectionProps) => {
  return (
    <Card className="p-6 bg-card-gradient border-border">
      <h3 className="text-xl font-semibold mb-4 text-primary">Technical Skills</h3>
      <div className="space-y-4">
        <div>
          <Label htmlFor="programmingLanguages">Programming Languages *</Label>
          <Input
            id="programmingLanguages"
            value={formData.programmingLanguages}
            onChange={(e) => onInputChange("programmingLanguages", e.target.value)}
            placeholder="e.g., Python, JavaScript, Java, C++"
            required
          />
        </div>
        <div>
          <Label htmlFor="experience">Years of Programming Experience *</Label>
          <Select onValueChange={(value) => onInputChange("experience", value)}>
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
            onChange={(e) => onInputChange("frameworks", e.target.value)}
            placeholder="e.g., React, Node.js, Django, Flutter"
          />
        </div>
        <div>
          <Label htmlFor="specialization">Area of Specialization</Label>
          <Select onValueChange={(value) => onInputChange("specialization", value)}>
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
              onChange={(e) => onInputChange("githubProfile", e.target.value)}
              placeholder="https://github.com/username"
            />
          </div>
          <div>
            <Label htmlFor="portfolio">Portfolio/Personal Website</Label>
            <Input
              id="portfolio"
              value={formData.portfolio}
              onChange={(e) => onInputChange("portfolio", e.target.value)}
              placeholder="https://yourportfolio.com"
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TechnicalSkillsSection;
