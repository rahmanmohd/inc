import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  Calendar,
  Loader2,
  RefreshCw,
  Users,
  FileText,
  Handshake,
  Building
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAppState } from '@/context/AppStateContext';
import adminApiService from '@/services/adminApiService';

interface GrowthMetrics {
  newStartups: number;
  applicationRate: number;
  investorEngagement: number;
  dealClaims: number;
  period: {
    current: string;
    previous: string;
  };
}

interface SectorData {
  sector: string;
  count: number;
  percentage: number;
}

interface ApplicationTrend {
  month: string;
  count: number;
}

interface InvestmentStage {
  stage: string;
  count: number;
}

interface MonthlyStats {
  startups: number;
  applications: number;
  deals: number;
  investors: number;
  month: string;
}

const AnalyticsManagement = () => {
  const { toast } = useToast();
  const { state } = useAppState();
  
  const [isLoading, setIsLoading] = useState(true);
  const [growthMetrics, setGrowthMetrics] = useState<GrowthMetrics | null>(null);
  const [sectorDistribution, setSectorDistribution] = useState<SectorData[]>([]);
  const [applicationTrends, setApplicationTrends] = useState<ApplicationTrend[]>([]);
  const [investmentStages, setInvestmentStages] = useState<InvestmentStage[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats | null>(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, [state.refreshTrigger]);

  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching analytics data...');

      const [
        growthResponse,
        sectorResponse,
        trendsResponse,
        stagesResponse,
        monthlyResponse
      ] = await Promise.all([
        adminApiService.getGrowthMetrics(),
        adminApiService.getSectorDistribution(),
        adminApiService.getApplicationTrends(),
        adminApiService.getInvestmentStages(),
        adminApiService.getMonthlyStats()
      ]);

      if (growthResponse.success) {
        setGrowthMetrics(growthResponse.data);
        console.log('Growth metrics loaded:', growthResponse.data);
      } else {
        console.error('Failed to load growth metrics:', growthResponse.error);
      }

      if (sectorResponse.success) {
        setSectorDistribution(sectorResponse.data);
        console.log('Sector distribution loaded:', sectorResponse.data);
      } else {
        console.error('Failed to load sector distribution:', sectorResponse.error);
      }

      if (trendsResponse.success) {
        setApplicationTrends(trendsResponse.data);
        console.log('Application trends loaded:', trendsResponse.data);
      } else {
        console.error('Failed to load application trends:', trendsResponse.error);
      }

      if (stagesResponse.success) {
        setInvestmentStages(stagesResponse.data);
        console.log('Investment stages loaded:', stagesResponse.data);
      } else {
        console.error('Failed to load investment stages:', stagesResponse.error);
      }

      if (monthlyResponse.success) {
        setMonthlyStats(monthlyResponse.data);
        console.log('Monthly stats loaded:', monthlyResponse.data);
      } else {
        console.error('Failed to load monthly stats:', monthlyResponse.error);
      }

    } catch (error) {
      console.error('Error fetching analytics data:', error);
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchAnalyticsData();
  };

  const formatGrowthRate = (rate: number) => {
    const isPositive = rate >= 0;
    return (
      <div className={`flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
        <span className="font-bold">{isPositive ? '+' : ''}{rate}%</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading analytics data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Comprehensive analytics and insights
          </p>
        </div>
        <Button variant="outline" onClick={handleRefresh}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Data
        </Button>
      </div>

      {/* Growth Metrics */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-600" />
          <h3 className="text-lg font-semibold">Growth Metrics</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Startups</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {growthMetrics ? formatGrowthRate(growthMetrics.newStartups) : '--'}
              </div>
              <p className="text-xs text-muted-foreground">vs previous month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Application Rate</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {growthMetrics ? formatGrowthRate(growthMetrics.applicationRate) : '--'}
              </div>
              <p className="text-xs text-muted-foreground">vs previous month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Investor Engagement</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {growthMetrics ? formatGrowthRate(growthMetrics.investorEngagement) : '--'}
              </div>
              <p className="text-xs text-muted-foreground">vs previous month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Deal Claims</CardTitle>
              <Handshake className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {growthMetrics ? formatGrowthRate(growthMetrics.dealClaims) : '--'}
              </div>
              <p className="text-xs text-muted-foreground">vs previous month</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Sectors */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-blue-600" />
              <CardTitle>Top Sectors</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sectorDistribution.slice(0, 5).map((sector, index) => (
                <div key={sector.sector} className="flex justify-between items-center">
                  <span className="text-sm font-medium">{sector.sector}</span>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-20 bg-muted rounded-full">
                      <div 
                        className={`h-2 rounded-full ${
                          index === 0 ? 'bg-blue-500' :
                          index === 1 ? 'bg-green-500' :
                          index === 2 ? 'bg-yellow-500' :
                          index === 3 ? 'bg-purple-500' :
                          'bg-gray-500'
                        }`}
                        style={{ width: `${sector.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-muted-foreground w-10">
                      {sector.percentage}%
                    </span>
                  </div>
                </div>
              ))}
              {sectorDistribution.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  No sector data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Investment Stages */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-orange-600" />
              <CardTitle>Investment Stages</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {investmentStages.slice(0, 6).map((stage, index) => (
                <div key={stage.stage} className="flex justify-between items-center">
                  <span className="text-sm font-medium">{stage.stage}</span>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-20 bg-muted rounded-full">
                      <div 
                        className={`h-2 rounded-full ${
                          index === 0 ? 'bg-orange-500' :
                          index === 1 ? 'bg-red-500' :
                          index === 2 ? 'bg-indigo-500' :
                          index === 3 ? 'bg-pink-500' :
                          index === 4 ? 'bg-cyan-500' :
                          'bg-gray-500'
                        }`}
                        style={{ 
                          width: `${Math.min(100, (stage.count / Math.max(...investmentStages.map(s => s.count))) * 100)}%` 
                        }}
                      ></div>
                    </div>
                    <span className="text-sm text-muted-foreground w-8">
                      {stage.count}
                    </span>
                  </div>
                </div>
              ))}
              {investmentStages.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  No investment stage data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Activity */}
      {monthlyStats && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <CardTitle>Monthly Activity ({monthlyStats.month})</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{monthlyStats.startups}</div>
                <p className="text-sm text-muted-foreground">New Startups</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{monthlyStats.applications}</div>
                <p className="text-sm text-muted-foreground">Applications</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{monthlyStats.deals}</div>
                <p className="text-sm text-muted-foreground">New Deals</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{monthlyStats.investors}</div>
                <p className="text-sm text-muted-foreground">New Investors</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AnalyticsManagement;
