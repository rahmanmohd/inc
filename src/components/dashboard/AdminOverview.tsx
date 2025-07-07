import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, TrendingUp, DollarSign, FileText } from "lucide-react";

interface AdminOverviewProps {
  stats: {
    totalStartups: number;
    activeApplications: number;
    totalInvestors: number;
    totalDeals: number;
    monthlyGrowth: number;
  };
  recentApplications: Array<{
    id: number;
    startup: string;
    founder: string;
    stage: string;
    status: string;
    date: string;
  }>;
  topStartups: Array<{
    id: number;
    name: string;
    sector: string;
    valuation: string;
    growth: string;
    status: string;
  }>;
}

const AdminOverview = ({ stats, recentApplications, topStartups }: AdminOverviewProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Startups</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.totalStartups}</div>
            <p className="text-xs text-muted-foreground">+{stats.monthlyGrowth}% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.activeApplications}</div>
            <p className="text-xs text-muted-foreground">Pending review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Investors</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.totalInvestors}</div>
            <p className="text-xs text-muted-foreground">Verified partners</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.totalDeals}</div>
            <p className="text-xs text-muted-foreground">Live partnerships</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Community</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">5.2K</div>
            <p className="text-xs text-muted-foreground">Active members</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>Latest startup applications for review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentApplications.map((app) => (
                <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{app.startup}</h4>
                    <p className="text-sm text-muted-foreground">{app.founder} • {app.stage}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={app.status === "Approved" ? "default" : app.status === "Under Review" ? "secondary" : "outline"}>
                      {app.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{app.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing Startups</CardTitle>
            <CardDescription>Based on growth metrics and milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topStartups.map((startup, index) => (
                <div key={startup.id} className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">#{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{startup.name}</h4>
                    <p className="text-sm text-muted-foreground">{startup.sector} • {startup.valuation}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">{startup.growth}</p>
                    <Badge variant="outline">{startup.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview;