import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { userDashboardService } from "@/services/userDashboardService";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Linkedin, 
  Github, 
  Building, 
  Eye, 
  Calendar,
  Star,
  Target,
  Zap,
  Award,
  TrendingUp,
  Users,
  Clock,
  ExternalLink
} from "lucide-react";

interface ViewProfileDialogProps {
  children: React.ReactNode;
}

interface UserProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  email: string;
  phone?: string;
  company?: string;
  bio?: string;
  location?: string;
  website?: string;
  linkedin_profile?: string;
  github_profile?: string;
  skills?: string[];
  role: string;
  created_at: string;
  profile_completion?: number;
}

const ViewProfileDialog = ({ children }: ViewProfileDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load profile data when dialog opens
  useEffect(() => {
    if (open && user?.id) {
      loadProfileData();
    }
  }, [open, user?.id]);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const profileData = await userDashboardService.getUserProfile(user!.id);
      if (profileData) {
        // Calculate profile completion if not available
        if (!profileData.profile_completion) {
          const completion = await userDashboardService.calculateProfileCompletion(user!.id);
          profileData.profile_completion = completion;
        }
        setProfile(profileData);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'entrepreneur': return <Target className="h-5 w-5" />;
      case 'investor': return <Zap className="h-5 w-5" />;
      case 'mentor': return <Star className="h-5 w-5" />;
      case 'admin': return <User className="h-5 w-5" />;
      default: return <User className="h-5 w-5" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'entrepreneur': return 'Entrepreneur';
      case 'investor': return 'Investor';
      case 'mentor': return 'Mentor';
      case 'admin': return 'Administrator';
      default: return 'User';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'entrepreneur': return 'bg-blue-100 text-blue-800';
      case 'investor': return 'bg-green-100 text-green-800';
      case 'mentor': return 'bg-purple-100 text-purple-800';
      case 'admin': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getMemberSince = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) return `${diffDays} days`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months`;
    return `${Math.floor(diffDays / 365)} years`;
  };

  const openExternalLink = (url: string) => {
    if (url && !url.startsWith('http')) {
      url = 'https://' + url;
    }
    window.open(url, '_blank');
  };

  if (!profile) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Eye className="h-6 w-6 text-orange-500" />
            View Profile
          </DialogTitle>
          <DialogDescription>
            Your complete profile information and achievements
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Profile Header */}
            <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                      {profile.first_name?.[0] || profile.last_name?.[0] || 'U'}
                    </div>
                    <div className="space-y-3">
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900">
                          {profile.first_name && profile.last_name 
                            ? `${profile.first_name} ${profile.last_name}`
                            : 'Your Name'
                          }
                        </h2>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={`${getRoleColor(profile.role)} flex items-center gap-1`}>
                            {getRoleIcon(profile.role)}
                            {getRoleLabel(profile.role)}
                          </Badge>
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Member since {getMemberSince(profile.created_at)}
                          </Badge>
                        </div>
                      </div>
                      
                      {profile.company && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <Building className="h-4 w-4" />
                          <span>{profile.company}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Profile Completion */}
                  <div className="text-right">
                    <div className="text-4xl font-bold text-orange-600">
                      {profile.profile_completion || 0}%
                    </div>
                    <div className="text-sm text-gray-600">Profile Complete</div>
                    <div className="w-24 h-2 bg-gray-200 rounded-full mt-2">
                      <div 
                        className="h-2 bg-orange-500 rounded-full transition-all duration-300"
                        style={{ width: `${profile.profile_completion || 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About Me */}
            {profile.bio && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-orange-500" />
                    About Me
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
                </CardContent>
              </Card>
            )}

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-orange-500" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="h-5 w-5 text-gray-500" />
                    <div>
                      <div className="text-sm text-gray-500">Email</div>
                      <div className="font-medium">{profile.email}</div>
                    </div>
                  </div>
                  
                  {profile.phone && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Phone className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-500">Phone</div>
                        <div className="font-medium">{profile.phone}</div>
                      </div>
                    </div>
                  )}
                  
                  {profile.location && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <MapPin className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-500">Location</div>
                        <div className="font-medium">{profile.location}</div>
                      </div>
                    </div>
                  )}
                  
                  {profile.website && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Globe className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-500">Website</div>
                        <Button
                          variant="link"
                          className="p-0 h-auto font-medium text-blue-600 hover:text-blue-800"
                          onClick={() => openExternalLink(profile.website!)}
                        >
                          {profile.website}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            {(profile.linkedin_profile || profile.github_profile) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-orange-500" />
                    Social & Professional Links
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.linkedin_profile && (
                      <Button
                        variant="outline"
                        className="h-auto p-4 justify-start"
                        onClick={() => openExternalLink(profile.linkedin_profile!)}
                      >
                        <Linkedin className="h-5 w-5 text-blue-600 mr-3" />
                        <div className="text-left">
                          <div className="font-medium">LinkedIn Profile</div>
                          <div className="text-sm text-gray-500">Connect professionally</div>
                        </div>
                      </Button>
                    )}
                    
                    {profile.github_profile && (
                      <Button
                        variant="outline"
                        className="h-auto p-4 justify-start"
                        onClick={() => openExternalLink(profile.github_profile!)}
                      >
                        <Github className="h-5 w-5 text-gray-800 mr-3" />
                        <div className="text-left">
                          <div className="font-medium">GitHub Profile</div>
                          <div className="text-sm text-gray-500">View code projects</div>
                        </div>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Skills */}
            {profile.skills && profile.skills.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-orange-500" />
                    Skills & Expertise
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Profile Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-orange-500" />
                  Profile Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {profile.profile_completion || 0}%
                    </div>
                    <div className="text-sm text-gray-600">Completion</div>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {profile.skills?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Skills</div>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {getMemberSince(profile.created_at)}
                    </div>
                    <div className="text-sm text-gray-600">Member</div>
                  </div>
                  
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {profile.role === 'entrepreneur' ? 'Active' : 'Verified'}
                    </div>
                    <div className="text-sm text-gray-600">Status</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Close
              </Button>
              <Button
                className="bg-orange-600 hover:bg-orange-700"
                onClick={() => setOpen(false)}
              >
                <User className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewProfileDialog;
