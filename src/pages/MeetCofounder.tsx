
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, MapPin, Briefcase, Users, TrendingUp, Star, Plus, MessageCircle, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import CofounderPostDialog from "@/components/CofounderPostDialog";

const MeetCofounder = () => {
  const cofounderProfiles = [
    {
      id: 1,
      name: "Priya Sharma",
      role: "Technical Co-founder",
      skills: ["Full Stack", "AI/ML", "Cloud Architecture"],
      location: "Bangalore",
      experience: "8 years",
      lookingFor: "Business Co-founder",
      industries: ["FinTech", "HealthTech"],
      description: "Experienced tech leader looking for business co-founder to build next-gen healthcare solutions.",
      image: "👩‍💻",
      verified: true
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      role: "Business Co-founder",
      skills: ["Strategy", "Sales", "Marketing"],
      location: "Mumbai",
      experience: "12 years",
      lookingFor: "Technical Co-founder",
      industries: ["E-commerce", "SaaS"],
      description: "Former McKinsey consultant with deep domain expertise in scaling B2B businesses.",
      image: "👨‍💼",
      verified: true
    },
    {
      id: 3,
      name: "Anita Patel",
      role: "Product Co-founder",
      skills: ["Product Strategy", "UI/UX", "Data Analytics"],
      location: "Delhi",
      experience: "6 years",
      lookingFor: "Technical Co-founder",
      industries: ["EdTech", "Consumer"],
      description: "Product leader from Google looking to revolutionize online education in India.",
      image: "👩‍💼",
      verified: true
    },
    {
      id: 4,
      name: "Vikram Singh",
      role: "Technical Co-founder",
      skills: ["Backend", "DevOps", "Blockchain"],
      location: "Hyderabad",
      experience: "10 years",
      lookingFor: "Business Co-founder",
      industries: ["FinTech", "Blockchain"],
      description: "Blockchain expert building the future of decentralized finance in India.",
      image: "👨‍💻",
      verified: true
    }
  ];

  const successStories = [
    {
      startup: "TechHealth Solutions",
      founders: ["Dr. Priya", "Rajesh Kumar"],
      funding: "₹5Cr raised",
      story: "Met through our platform in Jan 2023"
    },
    {
      startup: "EduTech Innovations",
      founders: ["Anita Singh", "Vikram Patel"],
      funding: "₹2Cr raised",
      story: "Perfect match after 3 months of searching"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/95"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center space-y-8 animate-fade-in">
            <Badge variant="secondary" className="bg-primary/10 text-primary text-lg px-4 py-2">
              🤝 Find Your Co-founder
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Meet Your Perfect{" "}
              <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent animate-glow-pulse">
                Co-founder
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Connect with like-minded entrepreneurs, find your ideal business partner, 
              and build something amazing together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CofounderPostDialog>
                <Button size="lg" className="bg-gradient-to-r from-primary to-orange-400 hover:shadow-orange-glow">
                  <Plus className="mr-2 h-4 w-4" />
                  Post Your Requirement
                </Button>
              </CofounderPostDialog>
              <Button variant="outline" size="lg" onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}>
                <Search className="mr-2 h-4 w-4" />
                Browse Profiles
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <Card className="text-center p-6 bg-card-gradient border-border">
              <Users className="w-8 h-8 mx-auto mb-4 text-primary" />
              <div className="text-3xl font-bold text-primary mb-2">2,500+</div>
              <div className="text-muted-foreground">Active Co-founders</div>
            </Card>
            <Card className="text-center p-6 bg-card-gradient border-border">
              <TrendingUp className="w-8 h-8 mx-auto mb-4 text-primary" />
              <div className="text-3xl font-bold text-primary mb-2">200+</div>
              <div className="text-muted-foreground">Successful Matches</div>
            </Card>
            <Card className="text-center p-6 bg-card-gradient border-border">
              <Star className="w-8 h-8 mx-auto mb-4 text-primary" />
              <div className="text-3xl font-bold text-primary mb-2">₹100Cr+</div>
              <div className="text-muted-foreground">Funding Raised</div>
            </Card>
            <Card className="text-center p-6 bg-card-gradient border-border">
              <Briefcase className="w-8 h-8 mx-auto mb-4 text-primary" />
              <div className="text-3xl font-bold text-primary mb-2">95%</div>
              <div className="text-muted-foreground">Success Rate</div>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="browse" className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto mb-12">
              <TabsTrigger value="browse">Browse Profiles</TabsTrigger>
              <TabsTrigger value="post">Post Requirement</TabsTrigger>
              <TabsTrigger value="success">Success Stories</TabsTrigger>
            </TabsList>

            <TabsContent value="browse" className="space-y-8">
              {/* Filters */}
              <Card className="p-6 bg-card-gradient border-border">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search co-founders..." className="pl-10" />
                  </div>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">Technical Co-founder</SelectItem>
                      <SelectItem value="business">Business Co-founder</SelectItem>
                      <SelectItem value="product">Product Co-founder</SelectItem>
                      <SelectItem value="marketing">Marketing Co-founder</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bangalore">Bangalore</SelectItem>
                      <SelectItem value="mumbai">Mumbai</SelectItem>
                      <SelectItem value="delhi">Delhi</SelectItem>
                      <SelectItem value="hyderabad">Hyderabad</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fintech">FinTech</SelectItem>
                      <SelectItem value="healthtech">HealthTech</SelectItem>
                      <SelectItem value="edtech">EdTech</SelectItem>
                      <SelectItem value="ecommerce">E-commerce</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </Card>

              {/* Co-founder Profiles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cofounderProfiles.map((profile) => (
                  <Card key={profile.id} className="p-6 bg-card-gradient border-border hover:shadow-lg transition-all duration-300">
                    <div className="space-y-4">
                      <div className="flex items-start space-x-4">
                        <div className="text-4xl">{profile.image}</div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-xl font-bold">{profile.name}</h3>
                            {profile.verified && (
                              <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                                Verified
                              </Badge>
                            )}
                          </div>
                          <p className="text-primary font-medium">{profile.role}</p>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-2">
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3" />
                              <span>{profile.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Briefcase className="h-3 w-3" />
                              <span>{profile.experience}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-muted-foreground">{profile.description}</p>

                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium">Skills:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {profile.skills.map((skill) => (
                              <Badge key={skill} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Industries:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {profile.industries.map((industry) => (
                              <Badge key={industry} variant="secondary" className="text-xs">
                                {industry}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button className="flex-1">
                          <MessageCircle className="mr-2 h-4 w-4" />
                          Connect
                        </Button>
                        <Button variant="outline">
                          <UserPlus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="post" className="space-y-8">
              <Card className="p-8 bg-card-gradient border-border max-w-4xl mx-auto">
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl">Post Your Co-founder Requirement</CardTitle>
                  <CardDescription className="text-lg">
                    Tell us what you're looking for and we'll help you find the perfect match
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Your Role</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technical">Technical Co-founder</SelectItem>
                          <SelectItem value="business">Business Co-founder</SelectItem>
                          <SelectItem value="product">Product Co-founder</SelectItem>
                          <SelectItem value="marketing">Marketing Co-founder</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Looking For</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Co-founder type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technical">Technical Co-founder</SelectItem>
                          <SelectItem value="business">Business Co-founder</SelectItem>
                          <SelectItem value="product">Product Co-founder</SelectItem>
                          <SelectItem value="marketing">Marketing Co-founder</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Startup Idea</label>
                    <textarea 
                      className="w-full p-3 border rounded-md resize-none h-24"
                      placeholder="Describe your startup idea..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Industry</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fintech">FinTech</SelectItem>
                          <SelectItem value="healthtech">HealthTech</SelectItem>
                          <SelectItem value="edtech">EdTech</SelectItem>
                          <SelectItem value="ecommerce">E-commerce</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Location</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bangalore">Bangalore</SelectItem>
                          <SelectItem value="mumbai">Mumbai</SelectItem>
                          <SelectItem value="delhi">Delhi</SelectItem>
                          <SelectItem value="hyderabad">Hyderabad</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <CofounderPostDialog>
                    <Button size="lg" className="w-full bg-gradient-to-r from-primary to-orange-400 hover:shadow-orange-glow">
                      Post Requirement
                    </Button>
                  </CofounderPostDialog>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="success" className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Real entrepreneurs who found their perfect co-founder match through our platform
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {successStories.map((story, index) => (
                  <Card key={index} className="p-6 bg-card-gradient border-border">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="text-4xl">🚀</div>
                        <div>
                          <h3 className="text-xl font-bold">{story.startup}</h3>
                          <p className="text-muted-foreground">{story.founders.join(" & ")}</p>
                        </div>
                      </div>
                      <p className="text-muted-foreground">{story.story}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {story.funding}
                        </Badge>
                        <Button variant="outline" size="sm">
                          Read Full Story
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="text-center">
                <Button size="lg" asChild>
                  <Link to="/success-stories">
                    View All Success Stories
                  </Link>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-orange-400/10">
        <div className="container mx-auto px-4 text-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-bold">Get Started Today</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join thousands of entrepreneurs who have found their perfect co-founder match
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CofounderPostDialog>
                <Button size="lg" className="bg-gradient-to-r from-primary to-orange-400 hover:shadow-orange-glow">
                  Find Your Co-founder
                </Button>
              </CofounderPostDialog>
              <Button variant="outline" size="lg" asChild>
                <Link to="/success-stories">
                  Success Stories
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

export default MeetCofounder;
