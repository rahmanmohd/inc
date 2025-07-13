
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface ApplicationDialogProps {
  children: React.ReactNode;
  program?: string;
  type?: string;
  title?: string;
  description?: string;
}

const ApplicationDialog = ({ 
  children, 
  program = "INClab",
  type,
  title,
  description
}: ApplicationDialogProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Application Submitted!",
      description: `Your application to ${program} has been submitted successfully. We'll review and get back to you within 48 hours.`,
    });
    setOpen(false);
  };

  // Use custom title if provided, otherwise default
  const dialogTitle = title || `Apply to ${program}`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input id="firstName" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input id="lastName" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input type="email" id="email" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input type="tel" id="phone" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="startupName">Startup Name</Label>
            <Input id="startupName" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stage">Current Stage</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="idea">Idea Stage</SelectItem>
                <SelectItem value="mvp">MVP Developed</SelectItem>
                <SelectItem value="early-traction">Early Traction</SelectItem>
                <SelectItem value="growth">Growth Stage</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="problem">Problem Statement *</Label>
            <Textarea 
              id="problem" 
              placeholder="Describe the problem you're solving..."
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="solution">Solution *</Label>
            <Textarea 
              id="solution" 
              placeholder="Describe your solution..."
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="market">Target Market *</Label>
            <Textarea 
              id="market" 
              placeholder="Describe your target market and size..."
              required 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="traction">Current Traction</Label>
            <Textarea 
              id="traction" 
              placeholder="Users, revenue, partnerships, etc..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="funding">Funding Requirements</Label>
            <Input id="funding" placeholder="e.g., ₹25L, ₹1Cr" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="why">Why Inc Combinator? *</Label>
            <Textarea 
              id="why" 
              placeholder="Why do you want to join our program?"
              required 
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="hero" className="flex-1">
              Submit Application
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationDialog;
