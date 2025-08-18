import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FileText, TrendingUp, DollarSign, Users, Plus } from "lucide-react";
import CofounderPostDialog from "@/components/CofounderPostDialog";
import InvestmentApplicationDialog from "@/components/InvestmentApplicationDialog";
import UpdateApplicationDialog from "@/components/UpdateApplicationDialog";
import { useNavigate } from "react-router-dom";

interface StartupOverviewProps {
  applicationStatus: {
    stage: string;
    progress: number;
    submittedDate: string;
    nextReview: string;
  };
  dashboardStats: {
    activeDeals: number;
    dealsValue: string;
    investmentApps: number;
    totalApplied: string;
    cofounderPosts: number;
    applicationsReceived: number;
  };
  recentActivity: Array<{
    id: number;
    type: string;
    message: string;
    time: string;
    color: string;
  }>;
}

const StartupOverview = ({ applicationStatus, dashboardStats, recentActivity }: StartupOverviewProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Application Status</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{applicationStatus.stage}</div>
            <Progress value={applicationStatus.progress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{dashboardStats.activeDeals}</div>
            <p className="text-xs text-muted-foreground">Worth {dashboardStats.dealsValue} in value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Investment Apps</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{dashboardStats.investmentApps}</div>
            <p className="text-xs text-muted-foreground">{dashboardStats.totalApplied} total applied</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Co-founder Posts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{dashboardStats.cofounderPosts}</div>
            <p className="text-xs text-muted-foreground">{dashboardStats.applicationsReceived} applications received</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className={`w-2 h-2 ${activity.color} rounded-full`}></div>
                  <div className="flex-1">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">No recent activity</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <CofounderPostDialog>
              <Button className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" />
                Post Co-founder Requirement
              </Button>
            </CofounderPostDialog>
            <InvestmentApplicationDialog>
              <Button variant="outline" className="w-full justify-start">
                <DollarSign className="mr-2 h-4 w-4" />
                Apply for Investment
              </Button>
            </InvestmentApplicationDialog>
            <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/deals')}>
              <TrendingUp className="mr-2 h-4 w-4" />
              Browse Active Deals
            </Button>
            <UpdateApplicationDialog>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Update Application
              </Button>
            </UpdateApplicationDialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StartupOverview;