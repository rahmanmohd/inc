import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Edit, Plus, Search, DollarSign, Building, TrendingUp, Users } from "lucide-react";
import { useState } from "react";

interface InvestorManagementProps {
  investors: Array<{
    id: number;
    name: string;
    checkSize: string;
    portfolio: number;
    stage: string;
    status: string;
  }>;
}

const InvestorManagement = ({ investors }: InvestorManagementProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredInvestors = investors.filter(investor => {
    const matchesSearch = investor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         investor.stage.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = stageFilter === "all" || investor.stage.includes(stageFilter);
    const matchesStatus = statusFilter === "all" || investor.status === statusFilter;
    
    return matchesSearch && matchesStage && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return <Badge className="bg-green-500 text-white hover:bg-green-600">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-500 text-white hover:bg-gray-600">Inactive</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStageBadge = (stage: string) => {
    if (stage.includes("Pre-Seed")) {
      return <Badge variant="outline" className="border-purple-300 text-purple-700">Pre-Seed</Badge>;
    } else if (stage.includes("Seed")) {
      return <Badge variant="outline" className="border-blue-300 text-blue-700">Seed</Badge>;
    } else if (stage.includes("Series A")) {
      return <Badge variant="outline" className="border-green-300 text-green-700">Series A+</Badge>;
    } else {
      return <Badge variant="outline">{stage}</Badge>;
    }
  };

  const getStatusCount = (status: string) => {
    return investors.filter(inv => inv.status.toLowerCase() === status.toLowerCase()).length;
  };

  const getTotalPortfolio = () => {
    return investors.reduce((sum, inv) => sum + inv.portfolio, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Investor Management</h2>
          <p className="text-muted-foreground">Manage and oversee all registered investors</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add New Investor
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Total Investors</p>
                <p className="text-2xl font-bold">{investors.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Active</p>
                <p className="text-2xl font-bold text-green-600">{getStatusCount('Active')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Total Portfolio</p>
                <p className="text-2xl font-bold text-blue-600">{getTotalPortfolio()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Avg. Portfolio</p>
                <p className="text-2xl font-bold text-purple-600">{Math.round(getTotalPortfolio() / investors.length)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Investor List */}
      <Card>
        <CardHeader>
          <CardTitle>Investor Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search investors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                <SelectItem value="Pre-Seed">Pre-Seed</SelectItem>
                <SelectItem value="Seed">Seed</SelectItem>
                <SelectItem value="Series A">Series A+</SelectItem>
                <SelectItem value="Series B">Series B+</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {filteredInvestors.length === 0 ? (
              <div className="text-center py-8">
                <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No investors found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              filteredInvestors.map((investor) => (
                <Card key={investor.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-lg">{investor.name}</h3>
                          {getStatusBadge(investor.status)}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">Check Size:</span> {investor.checkSize}
                          </div>
                          <div>
                            <span className="font-medium">Portfolio:</span> {investor.portfolio} companies
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">Stage Focus:</span> 
                            {getStageBadge(investor.stage)}
                          </div>
                          <div>
                            <span className="font-medium">Investment Type:</span> Equity
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View Profile
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-4 pt-4 border-t">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-muted-foreground">Sector Focus:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            <Badge variant="secondary" className="text-xs">FinTech</Badge>
                            <Badge variant="secondary" className="text-xs">HealthTech</Badge>
                            <Badge variant="secondary" className="text-xs">AI/ML</Badge>
                          </div>
                        </div>
                        <div>
                          <span className="font-medium text-muted-foreground">Recent Investments:</span>
                          <p className="text-sm mt-1">5 in last 6 months</p>
                        </div>
                        <div>
                          <span className="font-medium text-muted-foreground">Success Rate:</span>
                          <p className="text-sm mt-1 text-green-600 font-medium">78% portfolio success</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Investment Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Investment Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Sequoia Capital India</p>
                  <p className="text-sm text-muted-foreground">Invested ₹25Cr in HealthTech startup</p>
                </div>
                <span className="text-xs text-muted-foreground">2 days ago</span>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Accel Partners</p>
                  <p className="text-sm text-muted-foreground">Led Series A round of ₹15Cr</p>
                </div>
                <span className="text-xs text-muted-foreground">1 week ago</span>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Matrix Partners</p>
                  <p className="text-sm text-muted-foreground">Participated in ₹8Cr seed round</p>
                </div>
                <span className="text-xs text-muted-foreground">2 weeks ago</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Investment Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Pre-Seed</span>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-20 bg-muted rounded-full">
                    <div className="h-2 w-6 bg-purple-500 rounded-full"></div>
                  </div>
                  <span className="text-sm">15%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>Seed</span>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-20 bg-muted rounded-full">
                    <div className="h-2 w-12 bg-blue-500 rounded-full"></div>
                  </div>
                  <span className="text-sm">35%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>Series A</span>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-20 bg-muted rounded-full">
                    <div className="h-2 w-16 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-sm">40%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>Series B+</span>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-20 bg-muted rounded-full">
                    <div className="h-2 w-4 bg-orange-500 rounded-full"></div>
                  </div>
                  <span className="text-sm">10%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InvestorManagement;