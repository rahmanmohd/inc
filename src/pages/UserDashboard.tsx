
import Navigation from "@/components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  Clock, 
  Users, 
  Trophy, 
  BookOpen, 
  MessageSquare, 
  TrendingUp, 
  FileText, 
  CheckCircle, 
  Clock as ClockIcon,
  AlertCircle,
  BarChart3,
  Target,
  Award,
  Activity,
  Edit,
  MapPin,
  Mail,
  Phone,
  Globe,
  Linkedin,
  Github,
  Star,
  Zap,
  Lightbulb,
  RefreshCw,
  Search,
  ExternalLink,
  Play
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { HackathonRegistrationDialog } from "@/components/HackathonRegistrationDialog";
import ApplicationDialog from "@/components/ApplicationDialog";
import UserApplicationsHistory from "@/components/UserApplicationsHistory";
import EditProfileDialog from "@/components/EditProfileDialog";
import ViewProfileDialog from "@/components/ViewProfileDialog";
import { useUserDashboard } from "@/hooks/useUserDashboard";
import { format } from "date-fns";

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Use the custom dashboard hook for dynamic data
  const {
    profile,
    applicationStats,
    upcomingEvents,
    cofounderOpportunities,
    learningResources,
    recentActivity,
    achievements,
    communityPosts,
    loading,
    error,
    updateProfile,
    registerForEvent,
    cancelEventRegistration,
    applyForCofounderRole,
    updateLearningProgress,
    createCommunityPost,
    refreshData
  } = useUserDashboard();
  
  // Hackathon registration dialog state
  const [hackathonDialogOpen, setHackathonDialogOpen] = useState(false);
  const [selectedHackathon, setSelectedHackathon] = useState(null);
  
  // Get user's full name from auth context or profile
  const getUserFullName = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    } else if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    } else if (profile?.first_name) {
      return profile.first_name;
    } else if (user?.firstName) {
      return user.firstName;
    } else if (profile?.email) {
      return profile.email.split('@')[0];
    } else if (user?.email) {
      return user.email.split('@')[0];
    }
    return "User";
  };

  // Hackathon registration handlers
  const handleHackathonRegister = (event: { id: string | number; title: string; type: string; date: string }) => {
    // Create a mock hackathon object for the demo
    const mockHackathon = {
      id: event.id.toString(),
      title: event.title,
      subtitle: event.type,
      description: `Join us for ${event.title} on ${event.date}`,
      start_date: event.date,
      end_date: event.date,
      location: "Online",
      prize_pool: "TBD",
      expected_participants: 100
    };
    setSelectedHackathon(mockHackathon);
    setHackathonDialogOpen(true);
  };

  const handleHackathonSuccess = () => {
    setHackathonDialogOpen(false);
    setSelectedHackathon(null);
    toast({
      title: "Success",
      description: "Successfully registered for hackathon!"
    });
  };



  // Event handlers for dynamic actions
  const handleEventRegister = async (eventId: string) => {
    const success = await registerForEvent(eventId);
    if (success) {
      // Refresh events to show updated registration status
      refreshData();
    }
  };

  const handleEventCancel = async (eventId: string) => {
    const success = await cancelEventRegistration(eventId);
    if (success) {
      // Refresh events to show updated registration status
      refreshData();
    }
  };

  const handleCofounderApply = async (opportunityId: string) => {
    const coverLetter = "I am interested in this co-founder opportunity and would like to discuss further.";
    const success = await applyForCofounderRole(opportunityId, coverLetter);
    if (success) {
      // Refresh opportunities to show updated application status
      refreshData();
    }
  };

  const handleLearningProgress = async (resourceId: string, newProgress: number) => {
    const success = await updateLearningProgress(resourceId, newProgress);
    if (success) {
      // Progress updated successfully
    }
  };
  
  // Build user profile object from dynamic data
  const userProfile = {
    name: getUserFullName(),
    role: profile?.company ? `${profile.role} at ${profile.company}` : profile?.role || "Entrepreneur",
    profileCompletion: profile?.profile_completion || 0,
    joinDate: profile?.join_date ? format(new Date(profile.join_date), 'MMMM yyyy') : "Recently",
    applicationType: profile?.role || "Entrepreneur",
    location: profile?.location || "Not specified",
    email: profile?.email || user?.email || "Not specified",
    phone: profile?.phone || "Not specified",
    website: profile?.website || "Not specified",
    linkedin: profile?.linkedin_profile || "Not specified",
    github: profile?.github_profile || "Not specified",
    bio: profile?.bio || "Passionate entrepreneur building innovative solutions for tomorrow's challenges.",
    skills: profile?.skills || ["Product Management", "Business Development", "Market Research", "Team Leadership"],
    interests: profile?.interests || ["AI/ML", "FinTech", "HealthTech", "Sustainability"]
  };

  // Calculate analytics data from dynamic stats
  const analyticsData = {
    applicationSuccessRate: applicationStats.total > 0 ? Math.round((applicationStats.approved / applicationStats.total) * 100) : 0,
    averageResponseTime: "5-7 days",
    totalApplications: applicationStats.total,
    activeApplications: applicationStats.pending + applicationStats.submitted
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  // Format relative time helper
  const formatRelativeTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
      
      if (diffInHours < 1) return 'Just now';
      if (diffInHours < 24) return `${diffInHours} hours ago`;
      
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) return `${diffInDays} days ago`;
      
      const diffInWeeks = Math.floor(diffInDays / 7);
      if (diffInWeeks < 4) return `${diffInWeeks} weeks ago`;
      
      return format(date, 'MMM dd, yyyy');
    } catch {
      return 'Unknown';
    }
  };

  if (loading && !profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 pt-20 pb-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading your dashboard...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 pt-20 pb-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <AlertCircle className="w-8 h-8 text-destructive mx-auto mb-4" />
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={refreshData}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-20 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent mb-2">
            Welcome back, {userProfile.name}
          </h1>
          <p className="text-muted-foreground">Manage your applications and track your entrepreneurial journey</p>
        </div>

        {/* Enhanced Profile Overview */}
        <Card className="mb-8 bg-gradient-to-r from-gray-900 to-gray-800 border-gray-700 shadow-xl">
          <CardHeader className="pb-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {userProfile.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <CardTitle className="text-3xl text-white mb-2">{userProfile.name}</CardTitle>
                    <div className="flex items-center gap-3 mb-3">
                      <Badge variant="secondary" className="bg-orange-600 text-white px-3 py-1 text-sm">
                        {userProfile.applicationType}
                      </Badge>
                      <Badge variant="outline" className="border-orange-500 text-orange-400 px-3 py-1 text-sm">
                        Member since {userProfile.joinDate}
                      </Badge>
                    </div>
                    <p className="text-lg text-gray-300">{userProfile.role}</p>
                  </div>
                </div>
                
                {/* Profile Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-500 mb-2">{userProfile.profileCompletion}%</div>
                    <div className="text-sm text-gray-400 mb-2">Profile Completion</div>
                    <Progress value={userProfile.profileCompletion} className="h-2 bg-gray-700" />
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-500 mb-2">{analyticsData.totalApplications}</div>
                    <div className="text-sm text-gray-400">Total Applications</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-500 mb-2">{analyticsData.applicationSuccessRate}%</div>
                    <div className="text-sm text-gray-400">Success Rate</div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                <EditProfileDialog onProfileUpdated={refreshData}>
                  <Button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </EditProfileDialog>
                <ViewProfileDialog>
                  <Button 
                    variant="outline" 
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 px-6 py-2"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    View Profile
                  </Button>
                </ViewProfileDialog>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            {/* Contact & Social Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-orange-500" />
                  Contact Information
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Mail className="w-4 h-4 text-orange-500" />
                    <span>{userProfile.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Phone className="w-4 h-4 text-orange-500" />
                    <span>{userProfile.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <MapPin className="w-4 h-4 text-orange-500" />
                    <span>{userProfile.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Globe className="w-4 h-4 text-orange-500" />
                    <span>{userProfile.website}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-orange-500" />
                  Social & Skills
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Linkedin className="w-4 h-4 text-orange-500" />
                    <span>{userProfile.linkedin}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Github className="w-4 h-4 text-orange-500" />
                    <span>{userProfile.github}</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h5 className="text-sm font-medium text-gray-400 mb-2">Skills</h5>
                  <div className="flex flex-wrap gap-2">
                    {userProfile.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="bg-gray-700 text-gray-300 text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bio */}
            <div className="mt-6 pt-6 border-t border-gray-700">
              <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Star className="w-5 h-5 text-orange-500" />
                About Me
              </h4>
              <p className="text-gray-300 leading-relaxed">{userProfile.bio}</p>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="cofounder">Co-founder</TabsTrigger>
            <TabsTrigger value="learning">Learning</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
              <h2 className="text-2xl font-bold">My Applications</h2>
                <p className="text-muted-foreground">Track all your submitted applications and their status</p>
              </div>
              <div className="flex gap-2">
              <ApplicationDialog program="New Application">
                  <Button variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    New Application
                  </Button>
              </ApplicationDialog>
                <Button onClick={() => setHackathonDialogOpen(true)}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Register for Hackathon
                </Button>
              </div>
            </div>
            <UserApplicationsHistory />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Application Analytics</h2>
                <p className="text-muted-foreground">Detailed insights into your application performance</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Application Status Distribution */}
              <Card>
                  <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Application Status Distribution
                  </CardTitle>
                  <CardDescription>Breakdown of your application statuses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-primary rounded-full"></div>
                        <span>Approved</span>
                      </div>
                      <span className="font-semibold">{applicationStats.approved}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-primary/70 rounded-full"></div>
                        <span>Pending</span>
                      </div>
                      <span className="font-semibold">{applicationStats.pending}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-primary/50 rounded-full"></div>
                        <span>Submitted</span>
                      </div>
                      <span className="font-semibold">{applicationStats.submitted}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-primary/30 rounded-full"></div>
                        <span>Rejected</span>
                      </div>
                      <span className="font-semibold">{applicationStats.rejected}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Performance Metrics
                  </CardTitle>
                  <CardDescription>Key performance indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Success Rate</span>
                        <span className="text-sm font-bold">{analyticsData.applicationSuccessRate}%</span>
                      </div>
                      <Progress value={analyticsData.applicationSuccessRate} className="h-2" />
                    </div>
                      <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Active Applications</span>
                        <span className="text-sm font-bold">{analyticsData.activeApplications}</span>
                      </div>
                      <Progress value={(analyticsData.activeApplications / Math.max(analyticsData.totalApplications, 1)) * 100} className="h-2" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{analyticsData.totalApplications}</div>
                        <div className="text-xs text-muted-foreground">Total Applications</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{analyticsData.averageResponseTime}</div>
                        <div className="text-xs text-muted-foreground">Avg Response Time</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Your latest activities and achievements</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg animate-pulse">
                        <div className="w-5 h-5 bg-muted rounded-full"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-muted rounded w-3/4"></div>
                          <div className="h-3 bg-muted rounded w-1/2"></div>
                        </div>
                        <div className="h-3 bg-muted rounded w-16"></div>
                      </div>
                    ))}
                  </div>
                ) : recentActivity.length === 0 ? (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Recent Activity</h3>
                    <p className="text-muted-foreground">Your activities will appear here as you use the platform.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        {activity.activity_type === 'application_submitted' && <FileText className="w-5 h-5 text-primary" />}
                        {activity.activity_type === 'application_approved' && <CheckCircle className="w-5 h-5 text-green-500" />}
                        {activity.activity_type === 'event_registered' && <Calendar className="w-5 h-5 text-blue-500" />}
                        {activity.activity_type === 'course_completed' && <Trophy className="w-5 h-5 text-yellow-500" />}
                        {activity.activity_type === 'achievement_earned' && <Award className="w-5 h-5 text-purple-500" />}
                        {activity.activity_type === 'cofounder_applied' && <Users className="w-5 h-5 text-orange-500" />}
                        {!['application_submitted', 'application_approved', 'event_registered', 'course_completed', 'achievement_earned', 'cofounder_applied'].includes(activity.activity_type) && <Activity className="w-5 h-5 text-primary" />}
                        
                        <div className="flex-1">
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-sm text-muted-foreground">{activity.description}</p>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {formatRelativeTime(activity.created_at)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Upcoming Events</h2>
                <p className="text-muted-foreground">Discover and register for exciting events and hackathons</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={refreshData} variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Button onClick={() => navigate('/hackathon')} variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Browse All Events
                </Button>
              </div>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-muted rounded w-3/4"></div>
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-8 bg-muted rounded w-full"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : upcomingEvents.length === 0 ? (
              <Card className="p-8 text-center">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Upcoming Events</h3>
                <p className="text-muted-foreground mb-4">Check back later for exciting events and hackathons.</p>
                <Button onClick={() => navigate('/hackathon')}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Browse All Events
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.map((event) => (
                  <Card key={event.id} className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:shadow-lg transition-all duration-200">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                        <Badge variant={event.is_registered ? "default" : "secondary"}>
                          {event.is_registered ? "Registered" : "Available"}
                        </Badge>
                      </div>
                      <CardDescription className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(event.date)}</span>
                      </CardDescription>
                      {event.location && (
                        <CardDescription className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          <Badge variant="outline" className="w-fit">{event.type}</Badge>
                          {event.current_participants && event.max_participants && (
                            <Badge variant="outline" className="w-fit">
                              {event.current_participants}/{event.max_participants} registered
                            </Badge>
                          )}
                        </div>
                        
                        {event.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {event.description}
                          </p>
                        )}
                        
                        {event.is_registered ? (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-primary">
                              <CheckCircle className="w-4 h-4" />
                              <span className="text-sm font-medium">
                                {event.registration_status === 'cancelled' ? 'Registration Cancelled' : 'Successfully Registered'}
                              </span>
                            </div>
                            {event.registration_status === 'registered' && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleEventCancel(event.id)}
                              >
                                Cancel Registration
                              </Button>
                            )}
                          </div>
                        ) : (
                          <Button 
                            className="w-full" 
                            size="sm"
                            onClick={() => handleEventRegister(event.id)}
                            disabled={event.max_participants && event.current_participants >= event.max_participants}
                          >
                            <Calendar className="w-4 h-4 mr-2" />
                            {event.max_participants && event.current_participants >= event.max_participants 
                              ? 'Event Full' 
                              : 'Register Now'
                            }
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="cofounder" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Co-founder Opportunities</h2>
                <p className="text-muted-foreground">Find your next co-founder or join exciting startup teams</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={refreshData} variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Button onClick={() => navigate('/meet-cofounder')} variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  View All Opportunities
                </Button>
              </div>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-muted rounded w-3/4"></div>
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="h-4 bg-muted rounded w-full"></div>
                        <div className="h-8 bg-muted rounded w-full"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : cofounderOpportunities.length === 0 ? (
              <Card className="p-8 text-center">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Co-founder Opportunities</h3>
                <p className="text-muted-foreground mb-4">Check back later for exciting co-founder opportunities.</p>
                <Button onClick={() => navigate('/meet-cofounder')}>
                  <Users className="w-4 h-4 mr-2" />
                  View All Opportunities
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cofounderOpportunities.map((opportunity) => (
                  <Card key={opportunity.id} className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:shadow-lg transition-all duration-200">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{opportunity.company_name}</CardTitle>
                        <div className="flex flex-col gap-1">
                          {opportunity.stage && (
                            <Badge variant="outline" className="text-xs">{opportunity.stage}</Badge>
                          )}
                          {opportunity.has_applied && (
                            <Badge variant="default" className="text-xs">
                              {opportunity.application_status === 'pending' ? 'Applied' : opportunity.application_status}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <CardDescription className="text-base font-medium">{opportunity.role}</CardDescription>
                      {opportunity.location && (
                        <CardDescription className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>{opportunity.location}</span>
                          {opportunity.remote_friendly && (
                            <Badge variant="secondary" className="text-xs">Remote Friendly</Badge>
                          )}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {opportunity.description && (
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {opportunity.description}
                          </p>
                        )}
                        
                        <div className="space-y-2">
                          {opportunity.equity_range && (
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Equity:</span>
                              <span className="font-semibold text-primary">{opportunity.equity_range}</span>
                            </div>
                          )}
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">Posted:</span>
                            <span className="text-sm">{formatRelativeTime(opportunity.posted_date)}</span>
                          </div>
                        </div>
                        
                        {opportunity.has_applied ? (
                          <div className="flex items-center gap-2 text-primary">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              Application {opportunity.application_status || 'Submitted'}
                            </span>
                          </div>
                        ) : (
                          <Button 
                            className="w-full" 
                            size="sm"
                            onClick={() => handleCofounderApply(opportunity.id)}
                          >
                            <Users className="w-4 h-4 mr-2" />
                            Apply Now
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="learning" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Learning Resources</h2>
                <p className="text-muted-foreground">Enhance your skills with curated learning materials</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={refreshData} variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Button onClick={() => navigate('/resources')} variant="outline">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Browse All Resources
                </Button>
              </div>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-muted rounded w-3/4"></div>
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="h-4 bg-muted rounded w-full"></div>
                        <div className="h-8 bg-muted rounded w-full"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : learningResources.length === 0 ? (
              <Card className="p-8 text-center">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Learning Resources</h3>
                <p className="text-muted-foreground mb-4">Check back later for learning materials and courses.</p>
                <Button onClick={() => navigate('/resources')}>
                  <BookOpen className="w-4 h-4 mr-2" />
                  Browse All Resources
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {learningResources.map((resource) => (
                  <Card key={resource.id} className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:shadow-lg transition-all duration-200">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{resource.title}</CardTitle>
                        <div className="flex flex-col gap-1">
                          <Badge variant="outline" className="text-xs">{resource.type}</Badge>
                          {resource.difficulty && (
                            <Badge variant="secondary" className="text-xs">{resource.difficulty}</Badge>
                          )}
                        </div>
                      </div>
                      <CardDescription className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{resource.duration || 'Self-paced'}</span>
                      </CardDescription>
                      {resource.category && (
                        <CardDescription>
                          Category: {resource.category}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {resource.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {resource.description}
                          </p>
                        )}
                        
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-primary">Progress</span>
                            <span className="font-semibold text-primary">{resource.progress || 0}%</span>
                          </div>
                          <Progress value={resource.progress || 0} className="h-2" />
                        </div>
                        
                        <div className="flex gap-2">
                          {resource.completed ? (
                            <Button className="flex-1" size="sm" variant="outline">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Completed
                            </Button>
                          ) : resource.progress && resource.progress > 0 ? (
                            <Button 
                              className="flex-1" 
                              size="sm"
                              onClick={() => handleLearningProgress(resource.id, (resource.progress || 0) + 25)}
                            >
                              <Play className="w-4 h-4 mr-2" />
                              Continue
                            </Button>
                          ) : (
                            <Button 
                              className="flex-1" 
                              size="sm"
                              onClick={() => handleLearningProgress(resource.id, 25)}
                            >
                              <BookOpen className="w-4 h-4 mr-2" />
                              Start Learning
                            </Button>
                          )}
                          
                          {resource.url && (
                            <Button size="sm" variant="outline" onClick={() => window.open(resource.url, '_blank')}>
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        
                        {resource.tags && resource.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {resource.tags.slice(0, 3).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {resource.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{resource.tags.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="community" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Community</h2>
                <p className="text-muted-foreground">Connect with fellow entrepreneurs and grow your network</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={refreshData} variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Button onClick={() => navigate('/community')} variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Join Community
                </Button>
              </div>
            </div>
            
            {/* Community Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:shadow-lg transition-all duration-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-primary" />
                    <span>Network</span>
                  </CardTitle>
                  <CardDescription>Connect with other entrepreneurs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-2xl font-bold text-primary">1,247</div>
                    <div className="text-sm text-primary/70">Active members</div>
                    <Button className="w-full" size="sm" variant="outline">
                      <Users className="w-4 h-4 mr-2" />
                      View Network
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:shadow-lg transition-all duration-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Trophy className="w-5 h-5 text-primary" />
                    <span>Achievements</span>
                  </CardTitle>
                  <CardDescription>Track your milestones</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-2xl font-bold text-primary">{achievements.length}</div>
                    <div className="text-sm text-primary/70">Badges earned</div>
                    <Button className="w-full" size="sm" variant="outline">
                      <Award className="w-4 h-4 mr-2" />
                      View Achievements
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:shadow-lg transition-all duration-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    <span>Discussions</span>
                  </CardTitle>
                  <CardDescription>Participate in forums</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-2xl font-bold text-primary">{communityPosts.length}</div>
                    <div className="text-sm text-primary/70">Recent posts</div>
                    <Button className="w-full" size="sm" variant="outline">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Join Discussion
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Community Posts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Recent Community Posts
                </CardTitle>
                <CardDescription>Latest discussions from the community</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="p-4 border rounded-lg animate-pulse">
                        <div className="h-5 bg-muted rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-muted rounded w-full mb-2"></div>
                        <div className="flex justify-between">
                          <div className="h-3 bg-muted rounded w-20"></div>
                          <div className="h-3 bg-muted rounded w-16"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : communityPosts.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Recent Posts</h3>
                    <p className="text-muted-foreground mb-4">Be the first to start a discussion!</p>
                    <Button onClick={() => navigate('/community')}>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Start Discussion
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {communityPosts.slice(0, 5).map((post) => (
                      <div key={post.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium line-clamp-1">{post.title}</h4>
                          {post.category && (
                            <Badge variant="secondary" className="text-xs">{post.category}</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{post.content}</p>
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <span>By {post.author_name}</span>
                            <span>{post.likes_count} likes</span>
                            <span>{post.comments_count} comments</span>
                          </div>
                          <span>{formatRelativeTime(post.created_at)}</span>
                        </div>
                      </div>
                    ))}
                    {communityPosts.length > 5 && (
                      <div className="text-center pt-4">
                        <Button variant="outline" onClick={() => navigate('/community')}>
                          View All Posts
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Hackathon Registration Dialog */}
      {selectedHackathon && (
        <HackathonRegistrationDialog
          open={hackathonDialogOpen}
          onOpenChange={setHackathonDialogOpen}
          hackathon={selectedHackathon}
          onSuccess={handleHackathonSuccess}
        />
      )}
    </div>
  );
};

export default UserDashboard;
