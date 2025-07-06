import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertCircle, TrendingUp, Users, DollarSign, FileText, Plus } from "lucide-react";
import CofounderPostDialog from "@/components/CofounderPostDialog";
import InvestmentApplicationDialog from "@/components/InvestmentApplicationDialog";
import { useNavigate } from "react-router-dom";

const StartupDashboard = () => {
  const navigate = useNavigate();
  const applicationStatus = {
    stage: "Under Review",
    progress: 65,
    submittedDate: "Dec 15, 2024",
    nextReview: "Jan 5, 2025"
  };

  const investmentApplications = [
    { id: 1, investor: "Sequoia Capital", amount: "₹2.5Cr", status: "In Progress", date: "Dec 20, 2024" },
    { id: 2, investor: "Accel Partners", amount: "₹1.8Cr", status: "Pending", date: "Dec 18, 2024" },
    { id: 3, investor: "Matrix Partners", amount: "₹3.2Cr", status: "Under Review", date: "Dec 10, 2024" }
  ];

  const deals = [
    { id: 1, title: "AWS Credits", value: "$5000", status: "Active", expires: "Mar 2025" },
    { id: 2, title: "Notion Pro", value: "50% Off", status: "Claimed", expires: "Dec 2024" },
    { id: 3, title: "Stripe Fees", value: "Waived", status: "Pending", expires: "Feb 2025" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-20 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent mb-2">
            Startup Dashboard
          </h1>
          <p className="text-muted-foreground">Manage your startup journey with Inc Combinator</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="application">Application</TabsTrigger>
            <TabsTrigger value="investment">Investment</TabsTrigger>
            <TabsTrigger value="deals">Deals</TabsTrigger>
            <TabsTrigger value="cofounder">Co-founder</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
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
                  <div className="text-2xl font-bold text-primary">3</div>
                  <p className="text-xs text-muted-foreground">Worth ₹2.5L+ in value</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Investment Apps</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">3</div>
                  <p className="text-xs text-muted-foreground">₹7.5Cr total applied</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Co-founder Posts</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">2</div>
                  <p className="text-xs text-muted-foreground">12 applications received</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm">Application moved to review stage</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm">New co-founder application received</p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm">AWS credits deal activated</p>
                      <p className="text-xs text-muted-foreground">3 days ago</p>
                    </div>
                  </div>
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
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    Update Application
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="application" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Application Status</CardTitle>
                <CardDescription>Track your Inc Combinator application progress</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Current Stage: {applicationStatus.stage}</h3>
                    <p className="text-sm text-muted-foreground">Submitted on {applicationStatus.submittedDate}</p>
                  </div>
                  <Badge variant="secondary">{applicationStatus.progress}% Complete</Badge>
                </div>
                <Progress value={applicationStatus.progress} className="h-2" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="p-4 border rounded-lg">
                    <div className="w-8 h-8 bg-green-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <p className="font-medium">Application Submitted</p>
                    <p className="text-xs text-muted-foreground">Dec 15, 2024</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="w-8 h-8 bg-primary rounded-full mx-auto mb-2 flex items-center justify-center">
                      <span className="text-white text-sm">2</span>
                    </div>
                    <p className="font-medium">Under Review</p>
                    <p className="text-xs text-muted-foreground">In Progress</p>
                  </div>
                  <div className="p-4 border rounded-lg opacity-50">
                    <div className="w-8 h-8 bg-muted rounded-full mx-auto mb-2 flex items-center justify-center">
                      <span className="text-muted-foreground text-sm">3</span>
                    </div>
                    <p className="font-medium">Final Decision</p>
                    <p className="text-xs text-muted-foreground">Expected: Jan 5, 2025</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-blue-500" />
                  <p className="text-sm">Next review scheduled for {applicationStatus.nextReview}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="investment" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Investment Applications</h2>
              <InvestmentApplicationDialog>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Application
                </Button>
              </InvestmentApplicationDialog>
            </div>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Investor</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {investmentApplications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-medium">{app.investor}</TableCell>
                        <TableCell>{app.amount}</TableCell>
                        <TableCell>
                          <Badge variant={app.status === "In Progress" ? "default" : "secondary"}>
                            {app.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{app.date}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">View Details</Button>
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
              <h2 className="text-2xl font-bold">Available Deals</h2>
              <Button variant="outline" onClick={() => navigate('/deals')}>Browse All Deals</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {deals.map((deal) => (
                <Card key={deal.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{deal.title}</CardTitle>
                      <Badge variant={deal.status === "Active" ? "default" : deal.status === "Claimed" ? "secondary" : "outline"}>
                        {deal.status}
                      </Badge>
                    </div>
                    <CardDescription className="text-2xl font-bold text-primary">{deal.value}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">Expires: {deal.expires}</p>
                    <Button className="w-full" disabled={deal.status === "Claimed"}>
                      {deal.status === "Claimed" ? "Already Claimed" : "Claim Deal"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="cofounder" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Co-founder Requirements</h2>
              <CofounderPostDialog>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Post New Requirement
                </Button>
              </CofounderPostDialog>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Looking for CTO</CardTitle>
                  <CardDescription>Posted 3 days ago • 8 applications</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">Seeking a technical co-founder with experience in AI/ML and full-stack development...</p>
                  <div className="flex space-x-2">
                    <Badge>AI/ML</Badge>
                    <Badge>Full-stack</Badge>
                    <Badge>5+ years exp</Badge>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <Button size="sm">View Applications (8)</Button>
                    <Button variant="outline" size="sm">Edit Post</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Looking for CMO</CardTitle>
                  <CardDescription>Posted 1 week ago • 4 applications</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">Need a marketing co-founder with expertise in growth hacking and digital marketing...</p>
                  <div className="flex space-x-2">
                    <Badge>Growth Hacking</Badge>
                    <Badge>Digital Marketing</Badge>
                    <Badge>B2B SaaS</Badge>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <Button size="sm">View Applications (4)</Button>
                    <Button variant="outline" size="sm">Edit Post</Button>
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

export default StartupDashboard;