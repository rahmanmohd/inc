
import Navigation from "@/components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Eye, MessageSquare, TrendingUp, Star, DollarSign, Users, Target, Building, Calendar, ArrowUpRight, RefreshCw, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useInvestorDashboard } from "@/hooks/useInvestorDashboard";
import { useAuth } from "@/context/AuthContext";

import BlogManagement from "@/components/dashboard/BlogManagement";
import PortfolioManagement from "@/components/dashboard/PortfolioManagement";
import InvestorSettings from "@/components/dashboard/InvestorSettings";
import AddDealModal from "@/components/dashboard/AddDealModal";
import DealTest from "@/components/dashboard/DealTest";
import { useState } from "react";

const InvestorDashboard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [isAddDealModalOpen, setIsAddDealModalOpen] = useState(false);
  
  // Use the custom hook for dynamic data
  const {
    loading,
    error,
    investorProfile,
    portfolioCompanies,
    dealPipeline,
    blogPosts,
    investmentMetrics,
    newDealOpportunities,
    availableStartups,
    refreshData,
    addPortfolioCompany,
    updatePortfolioCompany,
    removePortfolioCompany,
    addDealToPipeline,
    updateDealInPipeline,
    removeDealFromPipeline,
    createBlogPost,
    updateBlogPost,
    deleteBlogPost,
    updateInvestorProfile
  } = useInvestorDashboard();

  // Default profile if none exists
  const defaultProfile = {
    name: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : "Your Investment Firm",
    type: "Venture Capital",
    checkSize: "₹1-5 Cr",
    totalPortfolio: portfolioCompanies.length,
    activeInvestments: portfolioCompanies.filter(c => c.status === 'active').length,
    successfulExits: portfolioCompanies.filter(c => c.status === 'exited').length,
    sectors: investorProfile?.sectors || ["FinTech", "HealthTech", "EdTech", "AI/ML"],
    stage: "Seed to Series A"
  };

  // Use dynamic data or fallback to defaults
  const profile = investorProfile ? {
    name: investorProfile.name || defaultProfile.name,
    type: investorProfile.organization || defaultProfile.type,
    checkSize: `${investorProfile.ticket_min || '₹1M'} - ${investorProfile.ticket_max || '₹5Cr'}`,
    totalPortfolio: portfolioCompanies.length,
    activeInvestments: portfolioCompanies.filter(c => c.status === 'active').length,
    successfulExits: portfolioCompanies.filter(c => c.status === 'exited').length,
    sectors: investorProfile.sectors || defaultProfile.sectors,
    stage: investorProfile.stages?.join(', ') || defaultProfile.stage
  } : defaultProfile;

  // Format investment metrics for display
  const formattedMetrics = investmentMetrics ? {
    totalInvested: `₹${(investmentMetrics.total_invested / 10000000).toFixed(1)} Cr`,
    currentPortfolioValue: `₹${(investmentMetrics.current_portfolio_value / 10000000).toFixed(1)} Cr`,
    averageROI: `${investmentMetrics.average_roi.toFixed(0)}%`,
    successRate: `${investmentMetrics.success_rate.toFixed(0)}%`
  } : {
    totalInvested: "₹0 Cr",
    currentPortfolioValue: "₹0 Cr",
    averageROI: "0%",
    successRate: "0%"
  };

  const handleViewPortfolio = (companyId: number) => {
    toast({
      title: "Portfolio Details",
      description: `Opening detailed view for portfolio company #${companyId}`,
    });
  };

  const handleReviewDeal = (dealId: string, source?: string) => {
    console.log('Reviewing deal:', dealId, 'Source:', source);
    if (source === 'admin_deal') {
      toast({
        title: "Review Deal",
        description: "You're reviewing an admin-created deal opportunity.",
      });
    } else {
      toast({
        title: "Review Application",
        description: "You're reviewing an investment application.",
      });
    }
  };

  const handleScheduleCall = (dealId: string) => {
    toast({
      title: "Schedule Call",
      description: `Scheduling call for deal #${dealId}`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge className="bg-orange-600">Active</Badge>
      case 'Exited':
        return <Badge variant="outline">Exited</Badge>
      case 'Under Review':
        return <Badge className="bg-yellow-600">Under Review</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  };

  const getSectorBadge = (sector: string) => {
    return <Badge variant="secondary">{sector}</Badge>
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navigation />
        <main className="container mx-auto px-4 pt-20 pb-12">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-orange-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">Loading Dashboard</h2>
              <p className="text-gray-400">Fetching your investor data...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navigation />
        <main className="container mx-auto px-4 pt-20 pb-12">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">Error Loading Dashboard</h2>
              <p className="text-gray-400 mb-4">{error}</p>
              <Button 
                onClick={refreshData}
                className="bg-orange-600 hover:bg-orange-700"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <main className="container mx-auto px-4 pt-20 pb-12">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent mb-2">
              Investor Dashboard
            </h1>
            <p className="text-gray-400">Manage your investment portfolio and deal pipeline</p>
          </div>
          <Button 
            onClick={refreshData}
            variant="outline" 
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Investor Profile Summary */}
        <Card className="mb-8 bg-gray-900 border-gray-800">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl text-white">{profile.name}</CardTitle>
                <CardDescription className="text-lg text-gray-300">{profile.type}</CardDescription>
                <div className="flex space-x-2 mt-2">
                  <Badge variant="outline" className="text-gray-300 border-gray-600">
                    Check Size: {profile.checkSize}
                  </Badge>
                  <Badge variant="outline" className="text-gray-300 border-gray-600">
                    {profile.stage}
                  </Badge>
                </div>
              </div>
              
              <div className="text-right space-y-1">
                <div className="text-2xl font-bold text-white">{profile.totalPortfolio}</div>
                <div className="text-sm text-gray-400">Total Portfolio</div>
                <div className="text-2xl font-bold text-green-500">{profile.activeInvestments}</div>
                <div className="text-sm text-gray-400">Active</div>
                <div className="text-2xl font-bold text-blue-500">{profile.successfulExits}</div>
                <div className="text-sm text-gray-400">Exits</div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Invested</CardTitle>
              <DollarSign className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">{formattedMetrics.totalInvested}</div>
              <p className="text-xs text-gray-400">Total Invested</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Portfolio Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{formattedMetrics.currentPortfolioValue}</div>
              <p className="text-xs text-gray-400">Portfolio Value</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Avg ROI</CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">{formattedMetrics.averageROI}</div>
              <p className="text-xs text-gray-400">Avg ROI</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Success Rate</CardTitle>
              <Target className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">{formattedMetrics.successRate}</div>
              <p className="text-xs text-gray-400">Success Rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Navigation Tabs */}
        <Tabs defaultValue="portfolio" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-gray-900 border-gray-800">
            <TabsTrigger value="portfolio" className="text-gray-300 hover:text-white data-[state=active]:text-white data-[state=active]:bg-gray-800">
              Portfolio
            </TabsTrigger>
            <TabsTrigger value="pipeline" className="text-gray-300 hover:text-white data-[state=active]:text-white data-[state=active]:bg-gray-800">
              Deal Pipeline
            </TabsTrigger>
            <TabsTrigger value="newdeals" className="text-gray-300 hover:text-white data-[state=active]:text-white data-[state=active]:bg-gray-800">
              New Deals
            </TabsTrigger>
            <TabsTrigger value="blogs" className="text-gray-300 hover:text-white data-[state=active]:text-white data-[state=active]:bg-gray-800">
              Blog Management
            </TabsTrigger>
            <TabsTrigger value="test" className="text-gray-300 hover:text-white data-[state=active]:text-white data-[state=active]:bg-gray-800">
              Test
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-gray-300 hover:text-white data-[state=active]:text-white data-[state=active]:bg-gray-800">
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="space-y-6">
            <PortfolioManagement 
              portfolioCompanies={portfolioCompanies}
              loading={loading}
              onRefresh={refreshData}
              onUpdateCompany={updatePortfolioCompany}
              onRemoveCompany={removePortfolioCompany}
            />
          </TabsContent>

          {/* Deal Pipeline Tab */}
          <TabsContent value="pipeline" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Deal Pipeline</h2>
              <Button 
                className="bg-orange-600 hover:bg-orange-700"
                onClick={() => setIsAddDealModalOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add New Deal
              </Button>
            </div>
            
            <div className="space-y-4">
              {dealPipeline.length === 0 ? (
                <Card className="bg-gray-900 border-gray-800">
                  <CardContent className="p-8 text-center">
                    <Target className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No Deals in Pipeline</h3>
                    <p className="text-gray-400 mb-4">Start tracking investment opportunities by adding your first deal.</p>
                    <Button 
                      onClick={() => setIsAddDealModalOpen(true)}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Deal
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                dealPipeline.map((deal) => (
                <Card key={deal.id} className="bg-gray-900 border-gray-800">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <h3 className="text-xl font-semibold text-white">{deal.company_name}</h3>
                          <Badge variant="outline" className="text-gray-300 border-gray-600">
                            {deal.sector}
                          </Badge>
                        </div>
                        <div className="text-gray-400 mb-3">
                          Founded {deal.founded_year} • {deal.team_size} team members
                        </div>
                        <div className="text-gray-300 mb-3">
                          Requested: ₹{(deal.requested_amount / 10000000).toFixed(1)} Cr • Revenue: {deal.revenue}
                        </div>
                        <div className="text-gray-300 mb-4">
                          Stage: {deal.stage}
                        </div>
                        <div className="flex items-center space-x-2 mb-4">
                          <Progress value={deal.progress} className="flex-1" />
                          <span className="text-sm text-gray-400">{deal.progress}%</span>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2 ml-6">
                        <Button 
                          onClick={() => handleReviewDeal(deal.id)}
                          className="bg-orange-600 hover:bg-orange-700"
                        >
                          Review
                        </Button>
                        <Button 
                          onClick={() => handleScheduleCall(deal.id)}
                          variant="outline"
                          className="border-gray-600 text-gray-300 hover:bg-gray-800"
                        >
                          Schedule Call
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* New Deals Tab */}
          <TabsContent value="newdeals" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">New Investment Opportunities</h2>
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                View All
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {newDealOpportunities.length === 0 ? (
                <Card className="bg-gray-900 border-gray-800 col-span-full">
                  <CardContent className="p-8 text-center">
                    <Star className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No New Opportunities</h3>
                    <p className="text-gray-400 mb-4">We're currently analyzing potential investment opportunities for you. Check back soon!</p>
                    <Button 
                      onClick={refreshData}
                      variant="outline" 
                      className="border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh Opportunities
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                newDealOpportunities.map((deal) => (
                <Card key={deal.id} className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-white">{deal.company_name}</CardTitle>
                        <CardDescription className="text-gray-400">
                          {deal.stage} • ₹{(deal.requested_amount / 10000000).toFixed(1)} Cr
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="h-5 w-5 text-yellow-500" />
                        <span className="text-yellow-500 font-semibold">{deal.match_score}% Match Score</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {deal.source === 'admin_deal' ? 'Admin Deal' : 'Application'}
                      </Badge>
                      <span className="text-xs text-gray-400">
                        {new Date(deal.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-300 mb-4">{deal.description}</p>
                    <div className="flex space-x-3">
                      <Button 
                        className="bg-orange-600 hover:bg-orange-700"
                        onClick={() => handleReviewDeal(deal.id, deal.source)}
                      >
                        Review Deal
                      </Button>
                      <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                        Learn More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Blog Management Tab */}
          <TabsContent value="blogs" className="space-y-6">
            <BlogManagement 
              blogPosts={blogPosts}
              loading={loading}
              onRefresh={refreshData}
              onCreateBlog={createBlogPost}
              onUpdateBlog={updateBlogPost}
              onDeleteBlog={deleteBlogPost}
            />
          </TabsContent>

          {/* Test Tab */}
          <TabsContent value="test" className="space-y-6">
            <DealTest />
          </TabsContent>

          {/* Settings Tab */}
                  <TabsContent value="settings" className="space-y-6">
          <InvestorSettings
            investorProfile={investorProfile}
            loading={loading}
            onUpdateProfile={updateInvestorProfile}
          />
        </TabsContent>
        
        <TabsContent value="test" className="space-y-6">
          <DealTest />
        </TabsContent>
        </Tabs>

        {/* Add Deal Modal */}
        <AddDealModal 
          isOpen={isAddDealModalOpen}
          onClose={() => setIsAddDealModalOpen(false)}
          onSuccess={refreshData}
        />
      </main>
    </div>
  );
};

export default InvestorDashboard;
