
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Star, Linkedin, Briefcase, GraduationCap, Users } from "lucide-react";

interface CofounderDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cofounder: {
    id: number;
    name: string;
    role: string;
    expertise: string;
    experience: string;
    location: string;
    company: string;
    bio: string;
    skills: string[];
    lookingFor: string;
    availability: string;
    linkedin: string;
    rating: number;
    avatar: string;
  };
  onConnect: () => void;
}

const CofounderDetailsDialog = ({ open, onOpenChange, cofounder, onConnect }: CofounderDetailsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-4">
            <span className="text-4xl">{cofounder.avatar}</span>
            <div>
              <h2 className="text-2xl font-bold">{cofounder.name}</h2>
              <p className="text-primary font-medium">{cofounder.role}</p>
            </div>
          </DialogTitle>
          <DialogDescription>
            {cofounder.expertise} • {cofounder.experience} experience
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Rating and Availability */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{cofounder.rating}</span>
              </div>
              <Badge variant="secondary">{cofounder.availability}</Badge>
            </div>
            <Button onClick={() => window.open(`https://${cofounder.linkedin}`, '_blank')} variant="outline">
              <Linkedin className="h-4 w-4 mr-2" />
              LinkedIn
            </Button>
          </div>

          {/* Bio */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">About</h3>
              <p className="text-muted-foreground">{cofounder.bio}</p>
            </CardContent>
          </Card>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{cofounder.location}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Briefcase className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Previous Company</p>
                    <p className="font-medium">{cofounder.company}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Experience</p>
                    <p className="font-medium">{cofounder.experience}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Looking For</p>
                    <p className="font-medium">{cofounder.lookingFor}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3">Skills & Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {cofounder.skills.map((skill) => (
                    <Badge key={skill} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex space-x-4">
            <Button onClick={onConnect} className="flex-1">
              Connect with {cofounder.name}
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CofounderDetailsDialog;
