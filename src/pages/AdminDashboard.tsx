import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Building2, Users, TrendingUp, DollarSign, FileText, Star, Search, Plus, Eye } from "lucide-react";

const AdminDashboard = () => {
  const stats = {
    totalStartups: 1247,
    activeApplications: 89,
    totalInvestors: 156,
    totalDeals: 234,
    monthlyGrowth: 12.5
  };

  const recentApplications = [
    { id: 1, startup: "AI Healthcare Solutions", founder: "Priya Sharma", stage: "Seed", status: "Under Review", date: "Dec 20, 2024" },
    { id: 2, startup: "GreenTech Innovations", founder: "Rahul Verma", stage: "Pre-Seed", status: "Approved", date: "Dec 19, 2024" },
    { id: 3, startup: "EdTech Platform", founder: "Anita Singh", stage: "Series A", status: "Pending", date: "Dec 18, 2024" }
  ];

  const topStartups = [
    { id: 1, name: "AI Healthcare Solutions", sector: "HealthTech", valuation: "₹50Cr", growth: "+45%", status: "Series A" },
    { id: 2, name: "GreenTech Innovations", sector: "CleanTech", valuation: "₹30Cr", growth: "+38%", status: "Seed" },
    { id: 3, name: "EdTech Platform", sector: "Education", valuation: "₹25Cr", growth: "+32%", status: "Pre-Seed" }
  ];

  const investors = [
    { id: 1, name: "Sequoia Capital India", checkSize: "₹5-50Cr", portfolio: 45, stage: "Series A+", status: "Active" },
    { id: 2, name: "Accel Partners", checkSize: "₹2-25Cr", portfolio: 38, stage: "Seed-Series B", status: "Active" },
    { id: 3, name: "Matrix Partners", checkSize: "₹1-15Cr", portfolio: 52, stage: "Pre-Seed-Series A", status: "Active" }
  ];

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
          </TabsContent>

          <TabsContent value="startups" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Startup Directory</h2>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search startups..." className="pl-10" />
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Startup
                </Button>
              </div>
            </div>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Startup Name</TableHead>
                      <TableHead>Founder</TableHead>
                      <TableHead>Sector</TableHead>
                      <TableHead>Stage</TableHead>
                      <TableHead>Valuation</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topStartups.map((startup) => (
                      <TableRow key={startup.id}>
                        <TableCell className="font-medium">{startup.name}</TableCell>
                        <TableCell>John Doe</TableCell>
                        <TableCell>{startup.sector}</TableCell>
                        <TableCell>{startup.status}</TableCell>
                        <TableCell>{startup.valuation}</TableCell>
                        <TableCell>
                          <Badge variant="default">Active</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">Edit</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Application Management</h2>
              <div className="flex space-x-2">
                <Button variant="outline">Export</Button>
                <Button variant="outline">Filter</Button>
              </div>
            </div>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Startup</TableHead>
                      <TableHead>Founder</TableHead>
                      <TableHead>Stage</TableHead>
                      <TableHead>Applied Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentApplications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium">{app.startup}</TableCell>
                        <TableCell>{app.founder}</TableCell>
                        <TableCell>{app.stage}</TableCell>
                        <TableCell>{app.date}</TableCell>
                        <TableCell>
                          <Badge variant={app.status === "Approved" ? "default" : app.status === "Under Review" ? "secondary" : "outline"}>
                            {app.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>4.2</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">Review</Button>
                            <Button variant="outline" size="sm">Contact</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="investors" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Investor Management</h2>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Investor
              </Button>
            </div>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Investor Name</TableHead>
                      <TableHead>Check Size</TableHead>
                      <TableHead>Portfolio</TableHead>
                      <TableHead>Investment Stage</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {investors.map((investor) => (
                      <TableRow key={investor.id}>
                        <TableCell className="font-medium">{investor.name}</TableCell>
                        <TableCell>{investor.checkSize}</TableCell>
                        <TableCell>{investor.portfolio} companies</TableCell>
                        <TableCell>{investor.stage}</TableCell>
                        <TableCell>
                          <Badge variant="default">{investor.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">View</Button>
                            <Button variant="outline" size="sm">Edit</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
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
                  <Button className="w-full mt-4" variant="outline">Manage Blogs</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>News Articles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary mb-2">18</div>
                  <p className="text-sm text-muted-foreground">Latest updates</p>
                  <Button className="w-full mt-4" variant="outline">Manage News</Button>
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