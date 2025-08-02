
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { MapPin, Calendar, Users, TrendingUp, ExternalLink, Mail, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";

const StartupProfile = () => {
  const navigate = useNavigate();

  // Sample startup data
  const startup = {
    id: 1,
    name: "HealthTech Innovations",
    tagline: "AI-powered healthcare solutions for rural India",
    sector: "HealthTech",
    stage: "Series A",
    founded: "2023",
    location: "Bangalore, India",
    employees: "25-50",
    website: "https://healthtechinnovations.com",
    email: "contact@healthtechinnovations.com",
    phone: "+91 98765 43210",
    valuation: "₹50Cr",
    funding: "₹15Cr raised",
    description: "HealthTech Innovations is revolutionizing healthcare accessibility in rural India through AI-powered diagnostic tools and telemedicine platforms. Our solutions help bridge the gap between urban medical expertise and rural healthcare needs.",
    founders: [
      { name: "Dr. Priya Sharma", role: "CEO & Co-founder", image: "/placeholder.svg" },
      { name: "Rajesh Kumar", role: "CTO & Co-founder", image: "/placeholder.svg" }
    ],
    achievements: [
      "Serving 200+ rural healthcare centers",
      "50,000+ patients diagnosed",
      "Winner of National HealthTech Award 2023",
      "Featured in Forbes India 30 Under 30"
    ],
    metrics: {
      revenue: "₹2.5Cr ARR",
      growth: "300% YoY",
      customers: "200+",
      retention: "95%"
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/95"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Company Info */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src="/placeholder.svg" alt={startup.name} />
                    <AvatarFallback className="text-2xl">HT</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h1 className="text-4xl font-bold">{startup.name}</h1>
                    <p className="text-xl text-muted-foreground mt-2">{startup.tagline}</p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Badge variant="default">{startup.sector}</Badge>
                      <Badge variant="outline">{startup.stage}</Badge>
                      <Badge variant="secondary">Inc Combinator Alumni</Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>{startup.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Founded {startup.founded}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>{startup.employees} employees</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>{startup.valuation} valuation</span>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                <Card className="p-6">
                  <div className="space-y-4">
                    <Button className="w-full" onClick={() => window.open(startup.website, '_blank')}>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit Website
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => window.open(`mailto:${startup.email}`)}>
                      <Mail className="w-4 h-4 mr-2" />
                      Contact
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => navigate('/investor-centre')}>
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Investment Info
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* About */}
                <Card>
                  <CardHeader>
                    <CardTitle>About {startup.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{startup.description}</p>
                  </CardContent>
                </Card>

                {/* Founders */}
                <Card>
                  <CardHeader>
                    <CardTitle>Founding Team</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {startup.founders.map((founder, index) => (
                        <div key={index} className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage src={founder.image} alt={founder.name} />
                            <AvatarFallback>{founder.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{founder.name}</h4>
                            <p className="text-sm text-muted-foreground">{founder.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Achievements */}
                <Card>
                  <CardHeader>
                    <CardTitle>Key Achievements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {startup.achievements.map((achievement, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm">{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle>Key Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Revenue</span>
                        <span className="font-medium">{startup.metrics.revenue}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Growth</span>
                        <span className="font-medium text-green-600">{startup.metrics.growth}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Customers</span>
                        <span className="font-medium">{startup.metrics.customers}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Retention</span>
                        <span className="font-medium">{startup.metrics.retention}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact */}
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-sm">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span>{startup.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>{startup.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                        <span>{startup.website}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default StartupProfile;
