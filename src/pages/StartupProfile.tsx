
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Users, DollarSign, TrendingUp, Building, Calendar, ExternalLink, Mail, Phone, Globe } from "lucide-react";

const StartupProfile = () => {
  const startupData = {
    name: "TechFlow Solutions",
    tagline: "Streamlining business operations with AI-powered automation",
    logo: "/placeholder.svg",
    website: "www.techflowsolutions.com",
    location: "Bangalore, India",
    founded: "2022",
    stage: "Series A",
    industry: "SaaS",
    employees: "25-50",
    revenue: "₹2.5 Cr ARR",
    description: "TechFlow Solutions is revolutionizing business process automation through advanced AI and machine learning technologies. Our platform helps enterprises reduce operational costs by 40% while improving efficiency.",
    funding: "₹15 Cr",
    investors: ["Accel Partners", "Matrix Partners", "Sequoia Capital"]
  };

  const founders = [
    {
      name: "Amit Kumar",
      role: "CEO & Co-founder",
      image: "/placeholder.svg",
      background: "Ex-Google, IIT Delhi"
    },
    {
      name: "Priya Sharma",
      role: "CTO & Co-founder", 
      image: "/placeholder.svg",
      background: "Ex-Microsoft, IIT Bombay"
    }
  ];

  const metrics = [
    { label: "Monthly Active Users", value: "50K+", growth: "+150% YoY" },
    { label: "Customer Retention", value: "95%", growth: "+5% QoQ" },
    { label: "Enterprise Clients", value: "200+", growth: "+200% YoY" },
    { label: "Revenue Growth", value: "300%", growth: "YoY" }
  ];

  const milestones = [
    { date: "Jan 2024", event: "Series A funding of ₹15 Cr", type: "funding" },
    { date: "Oct 2023", event: "Reached ₹2 Cr ARR", type: "revenue" },
    { date: "Jul 2023", event: "Launched Enterprise Suite", type: "product" },
    { date: "Mar 2023", event: "Seed funding of ₹3 Cr", type: "funding" },
    { date: "Jan 2022", event: "Company Founded", type: "milestone" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-20 pb-12">
        {/* Header */}
        <div className="mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={startupData.logo} alt={startupData.name} />
                  <AvatarFallback className="text-2xl">TF</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold">{startupData.name}</h1>
                  <p className="text-xl text-muted-foreground">{startupData.tagline}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{startupData.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{startupData.website}</span>
                    </div>
                  </div>
                  <p className="mt-4 text-muted-foreground max-w-2xl">{startupData.description}</p>
                </div>
                <div className="flex flex-col space-y-2">
                  <Button>
                    <Mail className="mr-2 h-4 w-4" />
                    Contact Startup
                  </Button>
                  <Button variant="outline">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Visit Website
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="pt-4 text-center">
              <div className="text-sm text-muted-foreground">Stage</div>
              <div className="font-bold text-primary">{startupData.stage}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <div className="text-sm text-muted-foreground">Industry</div>
              <div className="font-bold text-primary">{startupData.industry}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <div className="text-sm text-muted-foreground">Founded</div>
              <div className="font-bold text-primary">{startupData.founded}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <div className="text-sm text-muted-foreground">Employees</div>
              <div className="font-bold text-primary">{startupData.employees}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <div className="text-sm text-muted-foreground">Revenue</div>
              <div className="font-bold text-primary">{startupData.revenue}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <div className="text-sm text-muted-foreground">Funding</div>
              <div className="font-bold text-primary">{startupData.funding}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Founders */}
            <Card>
              <CardHeader>
                <CardTitle>Founding Team</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {founders.map((founder, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <Avatar>
                        <AvatarImage src={founder.image} alt={founder.name} />
                        <AvatarFallback>{founder.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{founder.name}</h4>
                        <p className="text-sm text-primary">{founder.role}</p>
                        <p className="text-xs text-muted-foreground">{founder.background}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Key Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Key Metrics</CardTitle>
                <CardDescription>Performance indicators and growth metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {metrics.map((metric, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">{metric.label}</p>
                          <p className="text-2xl font-bold text-primary">{metric.value}</p>
                        </div>
                        <Badge variant="secondary" className="text-green-600">
                          {metric.growth}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Investors */}
            <Card>
              <CardHeader>
                <CardTitle>Investors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {startupData.investors.map((investor) => (
                    <Badge key={investor} variant="outline" className="px-3 py-1">
                      {investor}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Company Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {milestones.map((milestone, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-3 h-3 rounded-full mt-2 ${
                      milestone.type === 'funding' ? 'bg-green-500' :
                      milestone.type === 'revenue' ? 'bg-blue-500' :
                      milestone.type === 'product' ? 'bg-purple-500' : 'bg-orange-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{milestone.event}</p>
                      <p className="text-xs text-muted-foreground">{milestone.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default StartupProfile;
