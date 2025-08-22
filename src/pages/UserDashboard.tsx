
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
  Activity
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useAppState } from "@/context/AppStateContext";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { HackathonRegistrationDialog } from "@/components/HackathonRegistrationDialog";
import ApplicationDialog from "@/components/ApplicationDialog";
import UserApplicationsHistory from "@/components/UserApplicationsHistory";
import apiService from "@/services/apiService";

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { 
    state: { dashboards, refreshTrigger }, 
    setDashboardLoading, 
    setDashboardRefreshed,
    shouldRefreshDashboard 
  } = useAppState();
  
  const [applicationStats, setApplicationStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    submitted: 0
  });
  
  // Hackathon registration dialog state
  const [hackathonDialogOpen, setHackathonDialogOpen] = useState(false);
  const [selectedHackathon, setSelectedHackathon] = useState(null);
  
  const loading = dashboards.user.isLoading;
  
  // Get user's full name from auth context, fallback to "User" if not available
  const getUserFullName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    } else if (user?.firstName) {
      return user.firstName;
    } else if (user?.email) {
      // Extract name from email if no name is provided
      return user.email.split('@')[0];
    }
    return "User";
  };

  // Load user application statistics
  useEffect(() => {
    if (user?.id && shouldRefreshDashboard('user')) {
      loadApplicationStats();
    }
  }, [user?.id, refreshTrigger, shouldRefreshDashboard]);

  const loadApplicationStats = async () => {
    try {
      setDashboardLoading('user', true);
      const response = await apiService.getUserApplicationCount(user!.id);
      if (response.success) {
        setApplicationStats(response.data);
      }
    } catch (error) {
      console.error('Error loading application stats:', error);
    } finally {
      setDashboardRefreshed('user');
    }
  };

  // Hackathon registration handlers
  const handleHackathonRegister = (event: any) => {
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
  
  const userProfile = {
    name: getUserFullName(),
    role: user?.company ? `${user.role} at ${user.company}` : user?.role || "Entrepreneur",
    profileCompletion: 85,
    joinDate: "March 2024",
    applicationType: user?.role || "Entrepreneur"
  };

  // Calculate analytics data
  const analyticsData = {
    applicationSuccessRate: applicationStats.total > 0 ? Math.round((applicationStats.approved / applicationStats.total) * 100) : 0,
    averageResponseTime: "5-7 days",
    totalApplications: applicationStats.total,
    activeApplications: applicationStats.pending + applicationStats.submitted
  };



  const upcomingEvents = [
    { id: 1, title: "AI Innovation Hackathon", date: "Jan 15, 2025", type: "Hackathon", status: "Registered" },
    { id: 2, title: "Startup Pitch Day", date: "Jan 22, 2025", type: "Pitch Event", status: "Available" },
    { id: 3, title: "Tech Workshop: React Advanced", date: "Jan 28, 2025", type: "Workshop", status: "Available" }
  ];

  const cofounderOpportunities = [
    { id: 1, company: "AI Healthcare Solutions", role: "Technical Co-founder", equity: "15-20%", stage: "Idea", posted: "2 days ago" },
    { id: 2, company: "GreenTech Startup", role: "CTO", equity: "10-15%", stage: "MVP", posted: "5 days ago" },
    { id: 3, company: "EdTech Platform", role: "Technical Lead", equity: "8-12%", stage: "Pre-Seed", posted: "1 week ago" }
  ];

  const learningResources = [
    { title: "Startup Fundamentals", progress: 75, duration: "4 hours", type: "Course" },
    { title: "Technical Leadership", progress: 45, duration: "6 hours", type: "Workshop" },
    { title: "Pitch Deck Mastery", progress: 90, duration: "3 hours", type: "Masterclass" }
  ];

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

        {/* Profile Overview */}
        <Card className="mb-8 bg-card-gradient border-border">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{userProfile.name}</CardTitle>
                <CardDescription className="text-lg">{userProfile.role}</CardDescription>
                <Badge variant="secondary" className="mt-2">{userProfile.applicationType}</Badge>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Profile Completion</div>
                <div className="text-2xl font-bold text-primary">{userProfile.profileCompletion}%</div>
                <Progress value={userProfile.profileCompletion} className="w-32 mt-2" />
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-primary">Total Applications</p>
                  <p className="text-2xl font-bold text-primary">{analyticsData.totalApplications}</p>
                </div>
                <FileText className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-primary">Success Rate</p>
                  <p className="text-2xl font-bold text-primary">{analyticsData.applicationSuccessRate}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-primary">Active Applications</p>
                  <p className="text-2xl font-bold text-primary">{analyticsData.activeApplications}</p>
                </div>
                <Activity className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-primary">Avg Response Time</p>
                  <p className="text-2xl font-bold text-primary">{analyticsData.averageResponseTime}</p>
                </div>
                <ClockIcon className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

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
                <CardDescription>Your latest application activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <div className="flex-1">
                      <p className="font-medium">Application Approved</p>
                      <p className="text-sm text-muted-foreground">Your Incubation Program application was approved</p>
                    </div>
                    <span className="text-sm text-muted-foreground">2 days ago</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <ClockIcon className="w-5 h-5 text-primary" />
                    <div className="flex-1">
                      <p className="font-medium">Application Submitted</p>
                      <p className="text-sm text-muted-foreground">New MVP Lab application submitted successfully</p>
                    </div>
                    <span className="text-sm text-muted-foreground">1 week ago</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-primary" />
                    <div className="flex-1">
                      <p className="font-medium">Application Under Review</p>
                      <p className="text-sm text-muted-foreground">Hackathon registration is being reviewed</p>
                    </div>
                    <span className="text-sm text-muted-foreground">1 week ago</span>
                  </div>
            </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
              <h2 className="text-2xl font-bold">Upcoming Events</h2>
                <p className="text-muted-foreground">Discover and register for exciting events and hackathons</p>
              </div>
              <Button onClick={() => navigate('/hackathon')} variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Browse All Events
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:shadow-lg transition-all duration-200">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                      <Badge variant={event.status === "Registered" ? "default" : "secondary"}>
                        {event.status}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{event.date}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Badge variant="outline" className="w-fit">{event.type}</Badge>
                      {event.status === "Registered" ? (
                        <div className="flex items-center gap-2 text-primary">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Successfully Registered</span>
                        </div>
                      ) : (
                        <Button 
                          className="w-full" 
                          size="sm"
                          onClick={() => handleHackathonRegister(event)}
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          Register Now
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="cofounder" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
              <h2 className="text-2xl font-bold">Co-founder Opportunities</h2>
                <p className="text-muted-foreground">Find your next co-founder or join exciting startup teams</p>
              </div>
              <Button onClick={() => navigate('/meet-cofounder')} variant="outline">
                <Users className="w-4 h-4 mr-2" />
                View All Opportunities
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cofounderOpportunities.map((opportunity) => (
                <Card key={opportunity.id} className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:shadow-lg transition-all duration-200">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{opportunity.company}</CardTitle>
                      <Badge variant="outline" className="text-xs">{opportunity.stage}</Badge>
                    </div>
                    <CardDescription className="text-base font-medium">{opportunity.role}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Equity:</span>
                        <span className="font-semibold text-primary">{opportunity.equity}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Posted:</span>
                        <span className="text-sm">{opportunity.posted}</span>
                      </div>
                      <Button className="w-full" size="sm">
                        <Users className="w-4 h-4 mr-2" />
                        Apply Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="learning" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
              <h2 className="text-2xl font-bold">Learning Resources</h2>
                <p className="text-muted-foreground">Enhance your skills with curated learning materials</p>
              </div>
              <Button onClick={() => navigate('/resources')} variant="outline">
                <BookOpen className="w-4 h-4 mr-2" />
                Browse All Resources
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {learningResources.map((resource, index) => (
                <Card key={index} className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 hover:shadow-lg transition-all duration-200">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                      <Badge variant="outline" className="text-xs">{resource.type}</Badge>
                    </div>
                    <CardDescription className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{resource.duration}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-primary">Progress</span>
                          <span className="font-semibold text-primary">{resource.progress}%</span>
                        </div>
                        <Progress value={resource.progress} className="h-2" />
                      </div>
                      <Button className="w-full" size="sm">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Continue Learning
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="community" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Community</h2>
                <p className="text-muted-foreground">Connect with fellow entrepreneurs and grow your network</p>
              </div>
              <Button onClick={() => navigate('/community')} variant="outline">
                <Users className="w-4 h-4 mr-2" />
                Join Community
              </Button>
            </div>
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
                    <div className="text-2xl font-bold text-primary">12</div>
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
                    <div className="text-2xl font-bold text-primary">89</div>
                    <div className="text-sm text-primary/70">Active discussions</div>
                    <Button className="w-full" size="sm" variant="outline">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Join Discussion
                  </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
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
