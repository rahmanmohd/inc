import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import startupDashboardService from "@/services/startupDashboardService";
import StartupOverview from "@/components/dashboard/StartupOverview";
import ApplicationStatus from "@/components/dashboard/ApplicationStatus";
import InvestmentTable from "@/components/dashboard/InvestmentTable";
import CofounderPostDialog from "@/components/CofounderPostDialog";

const StartupDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [applicationStatus, setApplicationStatus] = useState({
    stage: "Under Review",
    progress: 65,
    submittedDate: "Dec 15, 2024",
    nextReview: "Jan 5, 2025"
  });
  const [deals, setDeals] = useState([
    { id: 1, title: "AWS Credits", value: "₹50,000", status: "Active", expires: "Jan 15, 2025" },
    { id: 2, title: "Google Cloud Credits", value: "₹30,000", status: "Active", expires: "Feb 10, 2025" },
    { id: 3, title: "Notion Pro", value: "₹12,000", status: "Claimed", expires: "Dec 31, 2024" }
  ]);
  const [dashboardStats, setDashboardStats] = useState({
    activeDeals: 3,
    dealsValue: "₹2.5L+",
    investmentApps: 3,
    totalApplied: "₹7.5Cr",
    cofounderPosts: 2,
    applicationsReceived: 12
  });
  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: "application", message: "Application moved to review stage", time: "2 hours ago", color: "bg-primary" },
    { id: 2, type: "cofounder", message: "New co-founder application received", time: "1 day ago", color: "bg-orange-400" },
    { id: 3, type: "deal", message: "AWS credits deal activated", time: "3 days ago", color: "bg-green-400" }
  ]);
  const [cofounderPosts, setCofounderPosts] = useState([
    {
      id: 1,
      title: "Looking for CTO",
      description: "Seeking a technical co-founder with experience in AI/ML and full-stack development...",
      postedDate: "3 days ago",
      applications: 8,
      skills: ["AI/ML", "Full-stack", "5+ years exp"]
    },
    {
      id: 2,
      title: "Looking for CMO",
      description: "Need a marketing co-founder with expertise in growth hacking and digital marketing...",
      postedDate: "1 week ago",
      applications: 4,
      skills: ["Growth Hacking", "Digital Marketing", "B2B SaaS"]
    }
  ]);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      
      // Fetch user applications
      const applicationsResponse = await startupDashboardService.getUserApplications(user.id);
      if (applicationsResponse.success) {
        const apps = applicationsResponse.data;
        
        // Get the most recent application for status
        const recentApp = apps.incubation?.[0] || apps.program?.[0] || apps.investment?.[0];
        if (recentApp) {
          setApplicationStatus({
            stage: recentApp.status || "Under Review",
            progress: getProgressFromStatus(recentApp.status),
            submittedDate: new Date(recentApp.created_at).toLocaleDateString(),
            nextReview: getNextReviewDate(recentApp.created_at)
          });
        }
        
        // Update investment applications count
        const investmentCount = apps.investment?.length || 0;
        const totalApplied = apps.investment?.reduce((sum: number, app: any) => {
          return sum + (parseFloat(app.funding_amount?.replace(/[^\d.]/g, '') || '0'));
        }, 0);
        
        setDashboardStats(prev => ({
          ...prev,
          investmentApps: investmentCount,
          totalApplied: `₹${(totalApplied / 10000000).toFixed(1)}Cr`
        }));
      }
      
      // Fetch cofounder posts
      const cofounderResponse = await startupDashboardService.getCofounderPosts();
      if (cofounderResponse.success && cofounderResponse.data) {
        const userPosts = cofounderResponse.data.filter((post: any) => post.user_id === user.id);
        setCofounderPosts(userPosts.map((post: any) => ({
          id: post.id,
          title: post.title,
          description: post.description,
          postedDate: getTimeAgo(post.created_at),
          applications: post.applications_count || 0,
          skills: post.required_skills || []
        })));
        
        setDashboardStats(prev => ({
          ...prev,
          cofounderPosts: userPosts.length,
          applicationsReceived: userPosts.reduce((sum: number, post: any) => sum + (post.applications_count || 0), 0)
        }));
      }
      
      // Fetch deals (mock data for now, can be replaced with real API)
      // setDeals(realDealsData);
      
      // Fetch recent activity
      const activityResponse = await startupDashboardService.getUserActivity(user.id);
      if (activityResponse.success && activityResponse.data) {
        setRecentActivity(activityResponse.data.map((activity: any) => ({
          id: activity.id,
          type: activity.type,
          message: activity.message,
          time: getTimeAgo(activity.created_at),
          color: getActivityColor(activity.type)
        })));
      }
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper functions
  const getProgressFromStatus = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'submitted':
      case 'pending':
        return 25;
      case 'under_review':
      case 'review':
        return 65;
      case 'approved':
        return 100;
      case 'rejected':
        return 100;
      default:
        return 25;
    }
  };

  const getNextReviewDate = (createdAt: string) => {
    const date = new Date(createdAt);
    date.setDate(date.getDate() + 21); // 3 weeks from submission
    return date.toLocaleDateString();
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)} days ago`;
    } else {
      return `${Math.floor(diffInHours / 168)} weeks ago`;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'application':
        return 'bg-primary';
      case 'cofounder':
        return 'bg-orange-400';
      case 'deal':
        return 'bg-green-400';
      default:
        return 'bg-gray-400';
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user?.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 pt-20 pb-12">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading dashboard...</span>
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
            Startup Dashboard
          </h1>
          <p className="text-muted-foreground">Manage your startup journey with Inc Combinator</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="application">Application</TabsTrigger>
            <TabsTrigger value="investment">Investment</TabsTrigger>
            <TabsTrigger value="deals">Deals</TabsTrigger>
            <TabsTrigger value="cofounder">Co-founder</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <StartupOverview 
              applicationStatus={applicationStatus} 
              dashboardStats={dashboardStats}
              recentActivity={recentActivity}
            />
          </TabsContent>

          <TabsContent value="application" className="space-y-6">
            <ApplicationStatus applicationStatus={applicationStatus} />
          </TabsContent>

          <TabsContent value="investment" className="space-y-6">
            <InvestmentTable userId={user?.id} />
          </TabsContent>

          <TabsContent value="deals" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Available Deals</h2>
              <Button variant="outline" onClick={() => navigate('/deals')}>Browse All Deals</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {deals.map((deal) => (
                <Card key={deal.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{deal.title}</CardTitle>
                      <Badge variant={deal.status === "Active" ? "default" : deal.status === "Claimed" ? "secondary" : "outline"}>
                        {deal.status}
                      </Badge>
                    </div>
                    <CardDescription className="text-2xl font-bold text-primary">{deal.value}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">Expires: {deal.expires}</p>
                    <Button className="w-full" disabled={deal.status === "Claimed"}>
                      {deal.status === "Claimed" ? "Already Claimed" : "Claim Deal"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="cofounder" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Co-founder Requirements</h2>
              <CofounderPostDialog>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Post New Requirement
                </Button>
              </CofounderPostDialog>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {cofounderPosts.length > 0 ? (
                cofounderPosts.map((post) => (
                  <Card key={post.id}>
                    <CardHeader>
                      <CardTitle>{post.title}</CardTitle>
                      <CardDescription>Posted {post.postedDate} • {post.applications} applications</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-4">{post.description}</p>
                      <div className="flex space-x-2">
                        {post.skills.map((skill, index) => (
                          <Badge key={index}>{skill}</Badge>
                        ))}
                      </div>
                      <div className="mt-4 flex space-x-2">
                        <Button size="sm">View Applications ({post.applications})</Button>
                        <Button variant="outline" size="sm">Edit Post</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-2 text-center py-8">
                  <p className="text-muted-foreground">No co-founder posts yet. Create your first post to find the perfect co-founder!</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default StartupDashboard;