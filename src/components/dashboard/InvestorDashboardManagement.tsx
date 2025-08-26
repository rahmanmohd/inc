import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { investorDashboardService } from '@/services/investorDashboardService';
import { 
  Users, 
  TrendingUp, 
  Briefcase, 
  BarChart3, 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  RefreshCw,
  Building2,
  Mail,
  Target,
  Award,
  Activity,
  FileText,
  DollarSign,
  Star
} from 'lucide-react';

interface InvestorDashboardData {
  investor_id: string;
  investor_name: string;
  organization: string;
  email: string;
  portfolio_count: number;
  deal_pipeline_count: number;
  blog_posts_count: number;
  total_invested: number;
  current_portfolio_value: number;
  average_roi: number;
  success_rate: number;
  last_activity: string;
  status: 'active' | 'inactive';
}

interface PortfolioCompany {
  id: string;
  investor_id: string;
  startup_name: string;
  sector: string;
  investment_amount: number;
  current_valuation: number;
  ownership_percentage: number;
  status: string;
  investment_date: string;
}

interface DealPipelineItem {
  id: string;
  investor_id: string;
  company_name: string;
  sector: string;
  requested_amount: number;
  stage: string;
  progress: number;
  status: string;
  created_at: string;
}

interface InvestmentApplication {
  id: string;
  startup_name: string;
  target_investor: string;
  funding_amount: string;
  funding_stage: string;
  status: string;
  created_at: string;
  applicant_email: string;
}

const InvestorDashboardManagement: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInvestor, setSelectedInvestor] = useState<string | null>(null);
  
  // Data states
  const [dashboardData, setDashboardData] = useState<InvestorDashboardData[]>([]);
  const [portfolioCompanies, setPortfolioCompanies] = useState<PortfolioCompany[]>([]);
  const [dealPipeline, setDealPipeline] = useState<DealPipelineItem[]>([]);
  const [investmentApplications, setInvestmentApplications] = useState<InvestmentApplication[]>([]);
  
  // Dialog states
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewDialogData, setViewDialogData] = useState<any>(null);

  const { toast } = useToast();

  // Fetch all investor dashboard data
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // This would typically come from a dedicated admin API that aggregates investor dashboard data
      // For now, we'll use the existing service and aggregate the data
      
      // Get all investor profiles
      const { data: investorProfiles } = await fetch('/api/admin/investor-profiles').then(r => r.json()).catch(() => ({ data: [] }));
      
      // Get portfolio companies
      const { data: portfolios } = await fetch('/api/admin/portfolio-companies').then(r => r.json()).catch(() => ({ data: [] }));
      
      // Get deal pipeline
      const { data: deals } = await fetch('/api/admin/deal-pipeline').then(r => r.json()).catch(() => ({ data: [] }));
      
      // Get investment applications
      const { data: applications } = await fetch('/api/admin/investment-applications').then(r => r.json()).catch(() => ({ data: [] }));
      
      setPortfolioCompanies(portfolios);
      setDealPipeline(deals);
      setInvestmentApplications(applications);
      
      // Aggregate dashboard data (fallback with sample data for now)
      const sampleDashboardData: InvestorDashboardData[] = [
        {
          investor_id: '1',
          investor_name: 'Sarah Investment Capital',
          organization: 'SIC Ventures',
          email: 'sarah@sicventures.com',
          portfolio_count: 25,
          deal_pipeline_count: 8,
          blog_posts_count: 12,
          total_invested: 450000000, // 45 Cr
          current_portfolio_value: 1800000000, // 180 Cr
          average_roi: 285,
          success_rate: 78,
          last_activity: '2024-12-20T10:30:00Z',
          status: 'active'
        },
        {
          investor_id: '2',
          investor_name: 'Tech Venture Partners',
          organization: 'TVP Fund',
          email: 'partners@tvpfund.com',
          portfolio_count: 18,
          deal_pipeline_count: 5,
          blog_posts_count: 8,
          total_invested: 320000000, // 32 Cr
          current_portfolio_value: 960000000, // 96 Cr
          average_roi: 200,
          success_rate: 65,
          last_activity: '2024-12-19T15:45:00Z',
          status: 'active'
        }
      ];
      
      setDashboardData(sampleDashboardData);
      
    } catch (error) {
      console.error('Error fetching investor dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load investor dashboard data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter investors
  const filteredInvestors = dashboardData.filter(investor => {
    const matchesSearch = investor.investor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         investor.organization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         investor.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || investor.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate aggregate stats
  const totalStats = {
    totalInvestors: dashboardData.length,
    activeInvestors: dashboardData.filter(i => i.status === 'active').length,
    totalPortfolioCompanies: dashboardData.reduce((sum, i) => sum + i.portfolio_count, 0),
    totalInvested: dashboardData.reduce((sum, i) => sum + i.total_invested, 0),
    totalCurrentValue: dashboardData.reduce((sum, i) => sum + i.current_portfolio_value, 0),
    avgROI: dashboardData.length > 0 ? dashboardData.reduce((sum, i) => sum + i.average_roi, 0) / dashboardData.length : 0
  };

  // Handle view investor details
  const handleViewInvestor = (investor: InvestorDashboardData) => {
    setViewDialogData(investor);
    setSelectedInvestor(investor.investor_id);
    setIsViewDialogOpen(true);
  };

  // Update investment application status
  const handleUpdateApplicationStatus = async (applicationId: string, newStatus: string) => {
    try {
      // This would call an admin API to update the status
      toast({
        title: "Status Updated",
        description: `Application status updated to ${newStatus}`,
      });
      fetchData(); // Refresh data
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Investor Dashboard Management</h2>
          <Button disabled>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Loading...</CardTitle>
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold bg-gray-200 h-8 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Investor Dashboard Management</h2>
        <Button onClick={fetchData}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Investors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalStats.totalInvestors}</p>
            <p className="text-xs text-green-600">
              {totalStats.activeInvestors} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Portfolio</CardTitle>
            <Briefcase className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalStats.totalPortfolioCompanies}</p>
            <p className="text-xs text-muted-foreground">companies</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">₹{(totalStats.totalInvested / 10000000).toFixed(1)}Cr</p>
            <p className="text-xs text-muted-foreground">across all investors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg ROI</CardTitle>
            <TrendingUp className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalStats.avgROI.toFixed(0)}%</p>
            <p className="text-xs text-muted-foreground">average return</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio Management</TabsTrigger>
          <TabsTrigger value="pipeline">Deal Pipeline</TabsTrigger>
          <TabsTrigger value="applications">Investment Applications</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search investors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Investor Dashboard Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Investor Dashboard Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredInvestors.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No investors found
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredInvestors.map((investor) => (
                    <Card key={investor.investor_id} className="relative">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold">{investor.investor_name}</h3>
                              <Badge variant={investor.status === 'active' ? 'default' : 'secondary'}>
                                {investor.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{investor.organization} • {investor.email}</p>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">{investor.portfolio_count}</div>
                                <div className="text-xs text-muted-foreground">Portfolio Companies</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-orange-600">{investor.deal_pipeline_count}</div>
                                <div className="text-xs text-muted-foreground">Deals in Pipeline</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">
                                  ₹{(investor.total_invested / 10000000).toFixed(1)}Cr
                                </div>
                                <div className="text-xs text-muted-foreground">Total Invested</div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600">{investor.average_roi}%</div>
                                <div className="text-xs text-muted-foreground">Average ROI</div>
                              </div>
                            </div>
                          </div>
                          
                          <Button
                            variant="outline"
                            onClick={() => handleViewInvestor(investor)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Portfolio Management Tab */}
        <TabsContent value="portfolio" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Companies Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Investor</TableHead>
                    <TableHead>Sector</TableHead>
                    <TableHead>Investment</TableHead>
                    <TableHead>Current Value</TableHead>
                    <TableHead>Ownership</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {portfolioCompanies.slice(0, 10).map((company) => (
                    <TableRow key={company.id}>
                      <TableCell className="font-medium">{company.startup_name}</TableCell>
                      <TableCell>{company.investor_id}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{company.sector}</Badge>
                      </TableCell>
                      <TableCell>₹{(company.investment_amount / 10000000).toFixed(1)}Cr</TableCell>
                      <TableCell>₹{(company.current_valuation / 10000000).toFixed(1)}Cr</TableCell>
                      <TableCell>{company.ownership_percentage}%</TableCell>
                      <TableCell>
                        <Badge variant={company.status === 'active' ? 'default' : 'secondary'}>
                          {company.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Deal Pipeline Tab */}
        <TabsContent value="pipeline" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Deal Pipeline Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Investor</TableHead>
                    <TableHead>Sector</TableHead>
                    <TableHead>Requested Amount</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dealPipeline.slice(0, 10).map((deal) => (
                    <TableRow key={deal.id}>
                      <TableCell className="font-medium">{deal.company_name}</TableCell>
                      <TableCell>{deal.investor_id}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{deal.sector}</Badge>
                      </TableCell>
                      <TableCell>₹{(deal.requested_amount / 10000000).toFixed(1)}Cr</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{deal.stage}</Badge>
                      </TableCell>
                      <TableCell>{deal.progress}%</TableCell>
                      <TableCell>
                        <Badge variant={deal.status === 'active' ? 'default' : 'secondary'}>
                          {deal.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Investment Applications Tab */}
        <TabsContent value="applications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Investment Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Startup</TableHead>
                    <TableHead>Target Investor</TableHead>
                    <TableHead>Funding Amount</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Applied Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {investmentApplications.slice(0, 10).map((application) => (
                    <TableRow key={application.id}>
                      <TableCell className="font-medium">{application.startup_name}</TableCell>
                      <TableCell>{application.target_investor}</TableCell>
                      <TableCell>{application.funding_amount}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{application.funding_stage}</Badge>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={application.status}
                          onValueChange={(value) => handleUpdateApplicationStatus(application.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="submitted">Submitted</SelectItem>
                            <SelectItem value="under_review">Under Review</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>{new Date(application.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Investor Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Investor Dashboard Details</DialogTitle>
          </DialogHeader>
          {viewDialogData && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">{viewDialogData.investor_name}</h3>
                  <p className="text-sm text-muted-foreground">{viewDialogData.organization}</p>
                  <p className="text-sm text-muted-foreground">{viewDialogData.email}</p>
                </div>
                <div className="text-right">
                  <Badge variant={viewDialogData.status === 'active' ? 'default' : 'secondary'}>
                    {viewDialogData.status}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{viewDialogData.portfolio_count}</div>
                    <div className="text-xs text-muted-foreground">Portfolio Companies</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">{viewDialogData.deal_pipeline_count}</div>
                    <div className="text-xs text-muted-foreground">Active Deals</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      ₹{(viewDialogData.total_invested / 10000000).toFixed(1)}Cr
                    </div>
                    <div className="text-xs text-muted-foreground">Total Invested</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">{viewDialogData.average_roi}%</div>
                    <div className="text-xs text-muted-foreground">Average ROI</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvestorDashboardManagement;
