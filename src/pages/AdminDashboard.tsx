import { useState, useEffect, useCallback } from "react";
import Navigation from "@/components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, RefreshCw, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useAppState } from "@/context/AppStateContext";
import AdminOverview from "@/components/dashboard/AdminOverview";
import StartupManagement from "@/components/dashboard/StartupManagement";
import ApplicationManagement from "@/components/dashboard/ApplicationManagement";
import InvestorManagement from "@/components/dashboard/InvestorManagement";
import InvestorDashboardManagement from "@/components/dashboard/InvestorDashboardManagement";
import DealManagement from "@/components/dashboard/DealManagement";
import AnalyticsManagement from "@/components/dashboard/AnalyticsManagement";
import { ProgramsManagement } from "@/components/dashboard/ProgramsManagement";
import { EmailLogsView } from "@/components/dashboard/EmailLogsView";
import adminApiService, { type AdminStats, type StartupData, type InvestorData } from "@/services/adminApiService";

const AdminDashboard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { state } = useAppState();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [realStats, setRealStats] = useState<AdminStats | null>(null);
  const [realStartups, setRealStartups] = useState<StartupData[]>([]);
  const [realInvestors, setRealInvestors] = useState<InvestorData[]>([]);
  const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null);
  
  // Fallback static data
  const fallbackStats = {
    totalStartups: 1247,
    activeApplications: 89,
    totalInvestors: 156,
    totalDeals: 234,
    monthlyGrowth: 12.5
  };

  const fallbackApplications = [
    { id: 1, startup: "AI Healthcare Solutions", founder: "Priya Sharma", stage: "Seed", status: "Under Review", date: "Dec 20, 2024" },
    { id: 2, startup: "GreenTech Innovations", founder: "Rahul Verma", stage: "Pre-Seed", status: "Approved", date: "Dec 19, 2024" },
    { id: 3, startup: "EdTech Platform", founder: "Anita Singh", stage: "Series A", status: "Pending", date: "Dec 18, 2024" }
  ];

  const fallbackStartups = [
    { id: 1, name: "AI Healthcare Solutions", sector: "HealthTech", valuation: "₹50Cr", growth: "+45%", status: "Series A" },
    { id: 2, name: "GreenTech Innovations", sector: "CleanTech", valuation: "₹30Cr", growth: "+38%", status: "Seed" },
    { id: 3, name: "EdTech Platform", sector: "Education", valuation: "₹25Cr", growth: "+32%", status: "Pre-Seed" }
  ];

  const fallbackInvestors = [
    { id: 1, name: "Sequoia Capital India", checkSize: "₹5-50Cr", portfolio: 45, stage: "Series A+", status: "Active" },
    { id: 2, name: "Accel Partners", checkSize: "₹2-25Cr", portfolio: 38, stage: "Seed-Series B", status: "Active" },
    { id: 3, name: "Matrix Partners", checkSize: "₹1-15Cr", portfolio: 52, stage: "Pre-Seed-Series A", status: "Active" }
  ];

  // Memoized fetch function to prevent unnecessary re-renders
  const fetchData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setHasError(false);
      
      console.log('Fetching admin dashboard data...');
      
      // Fetch all real-time data in parallel with timeout
      const timeoutId = setTimeout(() => {
        throw new Error('Request timeout');
      }, 15000); // 15 second timeout
      
      const [statsResponse, topStartupsResponse, investorsResponse] = await Promise.all([
        adminApiService.getDashboardStats(),
        adminApiService.getTopStartups(),
        adminApiService.getAllInvestors()
      ]);
      
      clearTimeout(timeoutId);

      // Update state with successful responses
      if (statsResponse.success) {
        setRealStats(statsResponse.data!);
        console.log('Dashboard stats loaded:', statsResponse.data);
      }

      if (topStartupsResponse.success) {
        setRealStartups(topStartupsResponse.data!);
        console.log(`Loaded ${topStartupsResponse.data!.length} top startups`);
      }

      if (investorsResponse.success) {
        setRealInvestors(investorsResponse.data!);
        console.log(`Loaded ${investorsResponse.data!.length} investors`);
      }

      setLastFetchTime(new Date());
      
      if (isRefresh) {
        toast({
          title: "Data Refreshed",
          description: "Dashboard data updated successfully",
        });
      } else {
        toast({
          title: "Data Loaded",
          description: "Real-time dashboard data loaded successfully",
                });
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setHasError(true);
      
      const errorMessage = error instanceof Error && error.message === 'Request timeout' 
        ? "Request timed out. Please check your connection and try again."
        : "Failed to load real-time data. Using fallback data.";
        
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [toast]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh when global refresh is triggered
  useEffect(() => {
    if (state.refreshTrigger > 0) {
      fetchData(true);
    }
  }, [state.refreshTrigger, fetchData]);

  // Manual refresh function
  const handleRefresh = () => {
    fetchData(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-lg font-medium">Loading Admin Dashboard...</span>
          </div>
          <p className="text-muted-foreground">Fetching real-time data from the database</p>
        </div>
      </div>
    );
  }

  // Use real data if available, otherwise fall back to static data
  const stats = realStats || fallbackStats;
  const startups = realStartups.length > 0 ? realStartups.map(startup => ({
    id: parseInt(startup.id) || 0,
    name: startup.name,
    sector: startup.sector,
    valuation: startup.valuation,
    growth: startup.growth,
    status: startup.status
  })) : fallbackStartups;
  
  const investors = realInvestors.length > 0 ? realInvestors.map(investor => ({
    id: parseInt(investor.id) || 0,
    name: investor.name,
    checkSize: investor.checkSize,
    portfolio: investor.portfolio,
    stage: investor.stage,
    status: investor.status
  })) : fallbackInvestors;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-20 pb-12">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent mb-2">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground">Manage Inc Combinator ecosystem and operations</p>
              {lastFetchTime && (
                <p className="text-xs text-muted-foreground mt-1">
                  Last updated: {lastFetchTime.toLocaleTimeString()}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {hasError && (
                <div className="flex items-center gap-1 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">Connection Error</span>
                </div>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                {isRefreshing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                <span className="ml-2">
                  {isRefreshing ? 'Refreshing...' : 'Refresh'}
                </span>
              </Button>
            </div>
          </div>
        </div>

        {/* Updated with Programs section */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="flex w-full flex-nowrap h-12">
            <TabsTrigger value="overview" className="flex-1 basis-0 justify-center px-2 py-2 text-sm">Overview</TabsTrigger>
            <TabsTrigger value="startups" className="flex-1 basis-0 justify-center px-2 py-2 text-sm">Startups</TabsTrigger>
            <TabsTrigger value="applications" className="flex-1 basis-0 justify-center px-2 py-2 text-sm">Applications</TabsTrigger>
            <TabsTrigger value="investors" className="flex-1 basis-0 justify-center px-2 py-2 text-sm">Investors</TabsTrigger>
            <TabsTrigger value="deals" className="flex-1 basis-0 justify-center px-2 py-2 text-sm">Deals</TabsTrigger>
            <TabsTrigger value="programs" className="flex-1 basis-0 justify-center px-2 py-2 text-sm">Programs</TabsTrigger>
            <TabsTrigger value="content" className="flex-1 basis-0 justify-center px-2 py-2 text-sm">Content</TabsTrigger>
            <TabsTrigger value="analytics" className="flex-1 basis-0 justify-center px-2 py-2 text-sm">Analytics</TabsTrigger>
            <TabsTrigger value="settings" className="flex-1 basis-0 justify-center px-2 py-2 text-sm">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <AdminOverview 
              stats={stats} 
              recentApplications={fallbackApplications} 
              topStartups={startups} 
            />
          </TabsContent>

          <TabsContent value="startups" className="space-y-6">
            <StartupManagement />
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <ApplicationManagement applications={fallbackApplications} />
          </TabsContent>

          <TabsContent value="investors" className="space-y-6">
            <Tabs defaultValue="directory" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="directory">Investor Directory</TabsTrigger>
                <TabsTrigger value="dashboards">Dashboard Management</TabsTrigger>
              </TabsList>
              
              <TabsContent value="directory">
                <InvestorManagement />
              </TabsContent>
              
              <TabsContent value="dashboards">
                <InvestorDashboardManagement />
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="deals" className="space-y-6">
            <DealManagement />
          </TabsContent>

          <TabsContent value="programs" className="space-y-6">
            <ProgramsManagement />
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Blog Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary mb-2">24</div>
                  <p className="text-sm text-muted-foreground">Published this month</p>
                  <Button className="w-full mt-4" variant="outline" onClick={() => {
                    toast({
                      title: "Blog Management",
                      description: "Opening blog management interface...",
                    });
                  }}>Manage Blogs</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>News Articles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary mb-2">18</div>
                  <p className="text-sm text-muted-foreground">Latest updates</p>
                  <Button className="w-full mt-4" variant="outline" onClick={() => {
                    toast({
                      title: "News Management",
                      description: "Opening news management interface...",
                    });
                  }}>Manage News</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Directory</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary mb-2">1,247</div>
                  <p className="text-sm text-muted-foreground">Listed startups</p>
                  <Button className="w-full mt-4" variant="outline">Manage Directory</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Co-founder Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary mb-2">89</div>
                  <p className="text-sm text-muted-foreground">Active listings</p>
                  <Button className="w-full mt-4" variant="outline">Manage Posts</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsManagement />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Email System</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary mb-2">Active</div>
                  <p className="text-sm text-muted-foreground">Email notifications running</p>
                  <Button className="w-full mt-4" variant="outline" onClick={() => {
                    toast({
                      title: "Email Settings",
                      description: "Opening email management interface...",
                    });
                  }}>Manage Emails</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary mb-2">Config</div>
                  <p className="text-sm text-muted-foreground">System configuration</p>
                  <Button className="w-full mt-4" variant="outline">System Config</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary mb-2">Users</div>
                  <p className="text-sm text-muted-foreground">Manage admin users</p>
                  <Button className="w-full mt-4" variant="outline">Manage Users</Button>
                </CardContent>
              </Card>
            </div>
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Email Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <EmailLogsView />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
