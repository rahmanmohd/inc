import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, FileText, Users, DollarSign, TrendingUp, ChevronUp, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import adminApiService, { type AdminStats, type ApplicationWithDetails } from "@/services/adminApiService";

interface AdminOverviewProps {
  stats?: {
    totalStartups: number;
    activeApplications: number;
    totalInvestors: number;
    totalDeals: number;
    monthlyGrowth: number;
  };
  recentApplications?: Array<{
    id: number;
    startup: string;
    founder: string;
    stage: string;
    status: string;
    date: string;
  }>;
  topStartups?: Array<{
    id: number;
    name: string;
    sector: string;
    valuation: string;
    growth: string;
    status: string;
  }>;
}

const AdminOverview = ({ stats: propStats, recentApplications: propRecentApplications, topStartups: propTopStartups }: AdminOverviewProps) => {
  const [realStats, setRealStats] = useState<AdminStats | null>(null);
  const [realApplications, setRealApplications] = useState<ApplicationWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchRealData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchRealData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch real dashboard stats
      const statsResponse = await adminApiService.getDashboardStats();
      if (statsResponse.success) {
        setRealStats(statsResponse.data!);
      }

      // Fetch real applications
      const applicationsResponse = await adminApiService.getAllApplications();
      if (applicationsResponse.success) {
        setRealApplications(applicationsResponse.data!.slice(0, 3)); // Get latest 3
      }
    } catch (error) {
      console.error('Error fetching real data:', error);
      toast({
        title: "Error",
        description: "Failed to load real-time data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Use real data if available, otherwise fall back to props
  const stats = realStats || propStats || {
    totalStartups: 0,
    activeApplications: 0,
    totalInvestors: 0,
    totalDeals: 0,
    monthlyGrowth: 0
  };

  const recentApplications = realApplications.length > 0 ? 
    realApplications.map(app => ({
      id: parseInt(app.id) || 0,
      startup: app.startup,
      founder: app.founder,
      stage: app.stage,
      status: app.status,
      date: app.date
    })) : 
    propRecentApplications || [];

  const topStartups = propTopStartups || [
    { id: 1, name: "AI Healthcare Solutions", sector: "HealthTech", valuation: "₹50Cr", growth: "+45%", status: "Series A" },
    { id: 2, name: "GreenTech Innovations", sector: "CleanTech", valuation: "₹30Cr", growth: "+38%", status: "Seed" },
    { id: 3, name: "EdTech Platform", sector: "Education", valuation: "₹25Cr", growth: "+32%", status: "Pre-Seed" }
  ];
  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return <Badge className="bg-green-500 text-white hover:bg-green-600">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500 text-white hover:bg-red-600">Rejected</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">Pending</Badge>;
      case 'under review':
        return <Badge className="bg-orange-500 text-white hover:bg-orange-600">Under Review</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white hover:bg-gray-600">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading real-time data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Refresh Button */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Overview Dashboard</h3>
          <p className="text-sm text-muted-foreground">Real-time data from Supabase</p>
        </div>
        <button
          onClick={fetchRealData}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center space-x-2"
        >
          <TrendingUp className="h-4 w-4" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Startups</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.totalStartups}</div>
            <div className="flex items-center text-sm text-green-600 mt-1">
              <ChevronUp className="h-4 w-4 mr-1" />
              +{stats.monthlyGrowth}% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.activeApplications}</div>
            <p className="text-xs text-muted-foreground mt-1">Pending review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Investors</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.totalInvestors}</div>
            <p className="text-xs text-muted-foreground mt-1">Verified partners</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.totalDeals}</div>
            <p className="text-xs text-muted-foreground mt-1">Live partnerships</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Community</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">5.2K</div>
            <p className="text-xs text-muted-foreground mt-1">Active members</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
            <p className="text-sm text-muted-foreground">Latest startup applications for review</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentApplications.map((app) => (
              <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-semibold">{app.startup}</h4>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                    <span>{app.founder} • {app.stage}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {getStatusBadge(app.status)}
                  <span className="text-xs text-muted-foreground">{app.date}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Performing Startups */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Startups</CardTitle>
            <p className="text-sm text-muted-foreground">Based on growth metrics and milestones</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {topStartups.map((startup, index) => (
              <div key={startup.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">#{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">{startup.name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>{startup.sector} • {startup.valuation}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1 text-green-600">
                    <ChevronUp className="h-4 w-4" />
                    <span className="text-sm font-medium">{startup.growth}</span>
                  </div>
                  <Badge variant="outline">{startup.status}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview;