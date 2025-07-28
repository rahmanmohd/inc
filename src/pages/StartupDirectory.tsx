
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Filter, MapPin, TrendingUp, Users, ExternalLink, Star } from "lucide-react";
import { Link } from "react-router-dom";

const StartupDirectory = () => {
  const startups = [
    {
      id: 1,
      name: "HealthTech Solutions",
      description: "AI-powered diagnostic platform for rural healthcare",
      industry: "HealthTech",
      stage: "Series A",
      location: "Bangalore",
      funding: "₹5 Crores",
      employees: "25-50",
      founders: ["Dr. Priya Sharma", "Rajesh Kumar"],
      logo: "🏥",
      verified: true,
      featured: true
    },
    {
      id: 2,
      name: "EduLearn Platform",
      description: "Personalized learning platform for K-12 students",
      industry: "EdTech",
      stage: "Seed",
      location: "Mumbai",
      funding: "₹2 Crores",
      employees: "11-25",
      founders: ["Anita Singh", "Vikram Patel"],
      logo: "📚",
      verified: true,
      featured: false
    },
    {
      id: 3,
      name: "GreenEnergy Systems",
      description: "Solar energy solutions for urban households",
      industry: "CleanTech",
      stage: "Series B",
      location: "Delhi",
      funding: "₹15 Crores",
      employees: "51-100",
      founders: ["Amit Gupta", "Kavya Reddy"],
      logo: "☀️",
      verified: true,
      featured: true
    },
    {
      id: 4,
      name: "FinPay Solutions",
      description: "Digital payment platform for small businesses",
      industry: "FinTech",
      stage: "Series A",
      location: "Pune",
      funding: "₹8 Crores",
      employees: "26-50",
      founders: ["Rohit Sharma", "Neha Agarwal"],
      logo: "💳",
      verified: true,
      featured: false
    },
    {
      id: 5,
      name: "AgriTech Innovations",
      description: "Smart farming solutions using IoT and AI",
      industry: "AgriTech",
      stage: "Seed",
      location: "Hyderabad",
      funding: "₹3 Crores",
      employees: "11-25",
      founders: ["Suresh Reddy", "Lakshmi Devi"],
      logo: "🌾",
      verified: true,
      featured: false
    },
    {
      id: 6,
      name: "LogiTrack Systems",
      description: "Supply chain optimization for e-commerce",
      industry: "Logistics",
      stage: "Series A",
      location: "Chennai",
      funding: "₹6 Crores",
      employees: "26-50",
      founders: ["Karthik Nair", "Priya Menon"],
      logo: "📦",
      verified: true,
      featured: true
    }
  ];

  const industries = ["All Industries", "FinTech", "HealthTech", "EdTech", "CleanTech", "AgriTech", "Logistics"];
  const stages = ["All Stages", "Pre-Seed", "Seed", "Series A", "Series B", "Series C", "Growth"];
  const locations = ["All Locations", "Bangalore", "Mumbai", "Delhi", "Pune", "Hyderabad", "Chennai"];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/95"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center space-y-8 animate-fade-in">
            <Badge variant="secondary" className="bg-primary/10 text-primary text-lg px-4 py-2">
              🚀 Startup Directory
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Discover{" "}
              <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent animate-glow-pulse">
                Innovation
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Explore India's most promising startups, connect with founders, 
              and discover investment opportunities in our curated directory.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <Card className="text-center p-6 bg-card-gradient border-border">
              <TrendingUp className="w-8 h-8 mx-auto mb-4 text-primary" />
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Active Startups</div>
            </Card>
            <Card className="text-center p-6 bg-card-gradient border-border">
              <Users className="w-8 h-8 mx-auto mb-4 text-primary" />
              <div className="text-3xl font-bold text-primary mb-2">₹500Cr+</div>
              <div className="text-muted-foreground">Total Funding</div>
            </Card>
            <Card className="text-center p-6 bg-card-gradient border-border">
              <Star className="w-8 h-8 mx-auto mb-4 text-primary" />
              <div className="text-3xl font-bold text-primary mb-2">150+</div>
              <div className="text-muted-foreground">Success Stories</div>
            </Card>
            <Card className="text-center p-6 bg-card-gradient border-border">
              <MapPin className="w-8 h-8 mx-auto mb-4 text-primary" />
              <div className="text-3xl font-bold text-primary mb-2">25+</div>
              <div className="text-muted-foreground">Cities</div>
            </Card>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-background">
        <div className="container mx-auto px-4">
          <Card className="p-6 bg-card-gradient border-border">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search startups..." className="pl-10" />
              </div>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry.toLowerCase().replace(" ", "-")}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Stage" />
                </SelectTrigger>
                <SelectContent>
                  {stages.map((stage) => (
                    <SelectItem key={stage} value={stage.toLowerCase().replace(" ", "-")}>
                      {stage}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location.toLowerCase().replace(" ", "-")}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Card>
        </div>
      </section>

      {/* Featured Startups */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-4 flex items-center">
              <Star className="w-6 h-6 mr-2 text-primary" />
              Featured Startups
            </h2>
            <p className="text-muted-foreground">Hand-picked startups making waves in their respective industries</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {startups.filter(startup => startup.featured).map((startup) => (
              <Card key={startup.id} className="p-6 bg-card-gradient border-border hover:shadow-lg transition-all duration-300">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">{startup.logo}</div>
                      <div>
                        <h3 className="text-xl font-bold">{startup.name}</h3>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">{startup.industry}</Badge>
                          {startup.verified && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                              Verified
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  </div>

                  <p className="text-muted-foreground text-sm">{startup.description}</p>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Stage:</span>
                      <p className="font-medium">{startup.stage}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Funding:</span>
                      <p className="font-medium text-primary">{startup.funding}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Location:</span>
                      <p className="font-medium">{startup.location}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Team:</span>
                      <p className="font-medium">{startup.employees}</p>
                    </div>
                  </div>

                  <div>
                    <span className="text-muted-foreground text-sm">Founders:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {startup.founders.map((founder) => (
                        <Badge key={founder} variant="secondary" className="text-xs">
                          {founder}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button className="flex-1" asChild>
                      <Link to={`/startup-profile/${startup.id}`}>
                        View Profile
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* All Startups */}
      <section className="py-12 bg-muted/5">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-4">All Startups</h2>
            <p className="text-muted-foreground">Browse through our complete directory of innovative startups</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {startups.map((startup) => (
              <Card key={startup.id} className="p-6 bg-card-gradient border-border hover:shadow-md transition-all duration-300">
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">{startup.logo}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-bold">{startup.name}</h3>
                      {startup.verified && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                          Verified
                        </Badge>
                      )}
                      {startup.featured && (
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm mb-3">{startup.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>{startup.industry}</span>
                      <span>•</span>
                      <span>{startup.stage}</span>
                      <span>•</span>
                      <span>{startup.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="outline" className="text-xs">{startup.funding}</Badge>
                      <Badge variant="outline" className="text-xs">{startup.employees}</Badge>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Button size="sm" asChild>
                      <Link to={`/startup-profile/${startup.id}`}>
                        View
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm">
                      Connect
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Startups
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-orange-400/10">
        <div className="container mx-auto px-4 text-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-bold">Ready to Join the Directory?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Get your startup featured in our directory and connect with investors, 
              mentors, and potential partners.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-primary to-orange-400 hover:shadow-orange-glow" asChild>
                <Link to="/incubation">
                  Join Inc Combinator
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/contact">
                  Get Listed
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default StartupDirectory;
