import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import AdminOverview from "@/components/dashboard/AdminOverview";
import StartupManagement from "@/components/dashboard/StartupManagement";
import ApplicationManagement from "@/components/dashboard/ApplicationManagement";
import InvestorManagement from "@/components/dashboard/InvestorManagement";
import adminApiService, { type AdminStats, type StartupData, type InvestorData } from "@/services/adminApiService";

const AdminDashboard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [realStats, setRealStats] = useState<AdminStats | null>(null);
  const [realStartups, setRealStartups] = useState<StartupData[]>([]);
  const [realInvestors, setRealInvestors] = useState<InvestorData[]>([]);
  
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

  useEffect(() => {
    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchData = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching admin dashboard data...');
      
      // Fetch all real-time data in parallel
      const [statsResponse, startupsResponse, investorsResponse] = await Promise.all([
        adminApiService.getDashboardStats(),
        adminApiService.getAllStartups(),
        adminApiService.getAllInvestors()
      ]);

      if (statsResponse.success) {
        setRealStats(statsResponse.data!);
        console.log('Dashboard stats loaded:', statsResponse.data);
      }

      if (startupsResponse.success) {
        setRealStartups(startupsResponse.data!);
        console.log(`Loaded ${startupsResponse.data!.length} startups`);
      }

      if (investorsResponse.success) {
        setRealInvestors(investorsResponse.data!);
        console.log(`Loaded ${investorsResponse.data!.length} investors`);
      }

      toast({
        title: "Data Loaded",
        description: "Real-time dashboard data loaded successfully",
      });
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast({
        title: "Error",
        description: "Failed to load real-time data. Using fallback data.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading real-time admin dashboard...</span>
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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent mb-2">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">Manage Inc Combinator ecosystem and operations</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="startups">Startups</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="investors">Investors</TabsTrigger>
            <TabsTrigger value="deals">Deals</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <AdminOverview 
              stats={stats} 
              recentApplications={fallbackApplications} 
              topStartups={startups} 
            />
          </TabsContent>

          <TabsContent value="startups" className="space-y-6">
            <StartupManagement startups={startups} />
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <ApplicationManagement applications={fallbackApplications} />
          </TabsContent>

          <TabsContent value="investors" className="space-y-6">
            <InvestorManagement investors={investors} />
          </TabsContent>

          <TabsContent value="deals" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Deal Management</h2>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create New Deal
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Active Deals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary mb-2">42</div>
                  <p className="text-sm text-muted-foreground">Currently live deals</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Total Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary mb-2">₹12.5L</div>
                  <p className="text-sm text-muted-foreground">Worth of benefits</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Claims This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary mb-2">156</div>
                  <p className="text-sm text-muted-foreground">+23% from last month</p>
                </CardContent>
              </Card>
            </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Growth Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>New Startups</span>
                      <span className="font-bold text-green-600">+12.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Application Rate</span>
                      <span className="font-bold text-green-600">+8.3%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Investor Engagement</span>
                      <span className="font-bold text-green-600">+15.7%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Deal Claims</span>
                      <span className="font-bold text-green-600">+23.1%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Top Sectors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>FinTech</span>
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-20 bg-muted rounded-full">
                          <div className="h-2 w-16 bg-primary rounded-full"></div>
                        </div>
                        <span className="text-sm">32%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>HealthTech</span>
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-20 bg-muted rounded-full">
                          <div className="h-2 w-12 bg-orange-400 rounded-full"></div>
                        </div>
                        <span className="text-sm">24%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>EdTech</span>
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-20 bg-muted rounded-full">
                          <div className="h-2 w-8 bg-green-400 rounded-full"></div>
                        </div>
                        <span className="text-sm">18%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
