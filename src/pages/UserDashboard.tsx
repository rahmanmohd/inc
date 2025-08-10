
import Navigation from "@/components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, Users, Trophy, BookOpen, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import HackathonRegistrationDialog from "@/components/HackathonRegistrationDialog";
import ApplicationDialog from "@/components/ApplicationDialog";

const UserDashboard = () => {
  const navigate = useNavigate();
  
  const userProfile = {
    name: "Alex Johnson",
    role: "Co-founder & Developer",
    profileCompletion: 85,
    joinDate: "March 2024",
    applicationType: "Co-founder"
  };

  const myApplications = [
    { id: 1, program: "MVP Lab", status: "Under Review", submittedDate: "Dec 20, 2024", progress: 60 },
    { id: 2, program: "Incubation Program", status: "Approved", submittedDate: "Dec 15, 2024", progress: 100 },
    { id: 3, program: "Hackathon 2024", status: "Registered", submittedDate: "Dec 18, 2024", progress: 100 }
  ];

  const upcomingEvents = [
    { id: 1, title: "AI Innovation Hackathon", date: "Jan 15, 2025", type: "Hackathon", status: "Registered" },
    { id: 2, title: "Startup Pitch Day", date: "Jan 22, 2025", type: "Pitch Event", status: "Available" },
    { id: 3, title: "Tech Workshop: React Advanced", date: "Jan 28, 2025", type: "Workshop", status: "Available" }
  ];

  const cofounderOpportunities = [
    { id: 1, company: "AI Healthcare Solutions", role: "Technical Co-founder", equity: "15-20%", stage: "Idea", posted: "2 days ago" },
    { id: 2, company: "GreenTech Startup", role: "CTO", equity: "10-15%", stage: "MVP", posted: "5 days ago" },
    { id: 3, company: "EdTech Platform", role: "Technical Lead", equity: "8-12%", stage: "Pre-Seed", posted: "1 week ago" }
  ];

  const learningResources = [
    { title: "Startup Fundamentals", progress: 75, duration: "4 hours", type: "Course" },
    { title: "Technical Leadership", progress: 45, duration: "6 hours", type: "Workshop" },
    { title: "Pitch Deck Mastery", progress: 90, duration: "3 hours", type: "Masterclass" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-20 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent mb-2">
            Welcome back, {userProfile.name}
          </h1>
          <p className="text-muted-foreground">Manage your applications and track your entrepreneurial journey</p>
        </div>

        {/* Profile Overview */}
        <Card className="mb-8 bg-card-gradient border-border">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{userProfile.name}</CardTitle>
                <CardDescription className="text-lg">{userProfile.role}</CardDescription>
                <Badge variant="secondary" className="mt-2">{userProfile.applicationType}</Badge>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Profile Completion</div>
                <div className="text-2xl font-bold text-primary">{userProfile.profileCompletion}%</div>
                <Progress value={userProfile.profileCompletion} className="w-32 mt-2" />
              </div>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="cofounder">Co-founder</TabsTrigger>
            <TabsTrigger value="learning">Learning</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Applications</h2>
              <ApplicationDialog program="New Application">
                <Button>Submit New Application</Button>
              </ApplicationDialog>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myApplications.map((application) => (
                <Card key={application.id} className="bg-card-gradient border-border">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{application.program}</CardTitle>
                      <Badge variant={
                        application.status === "Approved" ? "default" : 
                        application.status === "Under Review" ? "secondary" : "outline"
                      }>
                        {application.status}
                      </Badge>
                    </div>
                    <CardDescription>Submitted: {application.submittedDate}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progress</span>
                          <span>{application.progress}%</span>
                        </div>
                        <Progress value={application.progress} />
                      </div>
                      <Button variant="outline" className="w-full" size="sm">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Upcoming Events</h2>
              <Button onClick={() => navigate('/hackathon')}>Browse All Events</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="bg-card-gradient border-border">
                  <CardHeader>
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <CardDescription className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{event.date}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Badge variant="outline">{event.type}</Badge>
                      {event.status === "Registered" ? (
                        <Badge variant="default">Registered</Badge>
                      ) : (
                        <HackathonRegistrationDialog>
                          <Button className="w-full" size="sm">Register Now</Button>
                        </HackathonRegistrationDialog>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="cofounder" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Co-founder Opportunities</h2>
              <Button onClick={() => navigate('/meet-cofounder')}>View All Opportunities</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cofounderOpportunities.map((opportunity) => (
                <Card key={opportunity.id} className="bg-card-gradient border-border">
                  <CardHeader>
                    <CardTitle className="text-lg">{opportunity.company}</CardTitle>
                    <CardDescription>{opportunity.role}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span>Equity:</span>
                        <span className="font-medium">{opportunity.equity}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Stage:</span>
                        <Badge variant="outline" className="text-xs">{opportunity.stage}</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">Posted {opportunity.posted}</div>
                      <Button className="w-full" size="sm">Apply Now</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="learning" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Learning Resources</h2>
              <Button onClick={() => navigate('/resources')}>Browse All Resources</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {learningResources.map((resource, index) => (
                <Card key={index} className="bg-card-gradient border-border">
                  <CardHeader>
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                    <CardDescription className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{resource.duration}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Badge variant="outline">{resource.type}</Badge>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Progress</span>
                          <span>{resource.progress}%</span>
                        </div>
                        <Progress value={resource.progress} />
                      </div>
                      <Button className="w-full" size="sm">
                        {resource.progress === 0 ? "Start Learning" : "Continue"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="community" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-card-gradient border-border">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5" />
                    <span>Discussion Forums</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Connect with fellow entrepreneurs and share insights.
                  </p>
                  <Button className="w-full" size="sm">Join Discussions</Button>
                </CardContent>
              </Card>

              <Card className="bg-card-gradient border-border">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>Networking Events</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Attend virtual and in-person networking sessions.
                  </p>
                  <Button className="w-full" size="sm">View Events</Button>
                </CardContent>
              </Card>

              <Card className="bg-card-gradient border-border">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Trophy className="w-5 h-5" />
                    <span>Success Stories</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Read inspiring stories from our alumni.
                  </p>
                  <Button className="w-full" size="sm" onClick={() => navigate('/success-stories')}>
                    Read Stories
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default UserDashboard;
