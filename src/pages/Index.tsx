import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Rocket, ShieldCheck, Code, Users, FileCode2, BarChart4, MessageSquare, Grip, HandMetal } from "lucide-react";
import ApplicationDialog from "@/components/ApplicationDialog";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const successStories = [
    {
      name: "HealthTech Innovations",
      company: "HealthTech",
      story: "Revolutionizing healthcare accessibility in rural India through AI-powered diagnostic tools.",
      funding: "₹15Cr Series A",
      year: "2023"
    },
    {
      name: "EduLearn Platform",
      company: "EdTech",
      story: "Personalized learning platform for K-12 students, improving student performance by 40%.",
      funding: "₹8Cr Seed",
      year: "2022"
    },
    {
      name: "GreenTech Solutions",
      company: "CleanTech",
      story: "Solar energy management system reducing energy costs by 60% for residential complexes.",
      funding: "₹25Cr Series A",
      year: "2023"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/95"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="bg-primary/10 text-primary text-lg px-4 py-2">
                🚀 Inc Combinator
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                Empowering the Next Generation of{" "}
                <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
                  Indian Startups
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                We provide comprehensive support, mentorship, and resources to help early-stage startups 
                transform their innovative ideas into successful, scalable businesses.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 max-w-4xl mx-auto">
              <Card className="p-6 bg-card-gradient border-border">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-primary">450+</div>
                  <div className="text-muted-foreground">Startups Incubated</div>
                </div>
              </Card>
              <Card className="p-6 bg-card-gradient border-border">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-primary">₹610Cr+</div>
                  <div className="text-muted-foreground">Total Funding Raised</div>
                </div>
              </Card>
              <Card className="p-6 bg-card-gradient border-border">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-primary">82%</div>
                  <div className="text-muted-foreground">Success Rate</div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">Our Programs</h2>
            <p className="text-xl text-muted-foreground">
              Explore our range of programs designed to support startups at every stage of their journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Hackathon */}
            <Card className="bg-card-gradient border-border hover:shadow-orange-glow transition-all duration-300">
              <CardHeader>
                <Rocket className="w-6 h-6 mb-4 text-primary" />
                <CardTitle className="text-2xl font-bold">Hackathon</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Intensive coding competition to build innovative solutions in 24 hours
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  <li>Build real-world projects</li>
                  <li>Network with industry experts</li>
                  <li>Win exciting prizes</li>
                </ul>
                <Button variant="outline" className="w-full" onClick={() => navigate('/hackathon')}>
                  Learn More
                </Button>
              </CardContent>
            </Card>

            {/* Incubation */}
            <Card className="bg-card-gradient border-border hover:shadow-orange-glow transition-all duration-300">
              <CardHeader>
                <ShieldCheck className="w-6 h-6 mb-4 text-primary" />
                <CardTitle className="text-2xl font-bold">Incubation</CardTitle>
                <CardDescription className="text-muted-foreground">
                  16-week program to validate your startup idea and build a scalable business
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  <li>Mentorship from industry leaders</li>
                  <li>Access to funding opportunities</li>
                  <li>Co-working space and resources</li>
                </ul>
                <Button variant="outline" className="w-full" onClick={() => navigate('/incubation')}>
                  Learn More
                </Button>
              </CardContent>
            </Card>

            {/* MVP Lab */}
            <Card className="bg-card-gradient border-border hover:shadow-orange-glow transition-all duration-300">
              <CardHeader>
                <Code className="w-6 h-6 mb-4 text-primary" />
                <CardTitle className="text-2xl font-bold">MVP Lab</CardTitle>
                <CardDescription className="text-muted-foreground">
                  8-week program to build and launch your Minimum Viable Product (MVP)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  <li>Technical guidance and support</li>
                  <li>Cloud credits and tools</li>
                  <li>Go-to-market strategy</li>
                </ul>
                <Button variant="outline" className="w-full" onClick={() => navigate('/mvp-lab')}>
                  Learn More
                </Button>
              </CardContent>
            </Card>

            {/* INC Lab */}
            <Card className="bg-card-gradient border-border hover:shadow-orange-glow transition-all duration-300">
              <CardHeader>
                <Users className="w-6 h-6 mb-4 text-primary" />
                <CardTitle className="text-2xl font-bold">INC Lab</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Deep innovation program for startups solving complex problems with cutting-edge technology
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="list-disc list-inside text-sm text-muted-foreground">
                  <li>Access to research and development</li>
                  <li>Collaboration with experts</li>
                  <li>IP protection and commercialization</li>
                </ul>
                <Button variant="outline" className="w-full" onClick={() => navigate('/inclab')}>
                  Learn More
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/5">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">Key Features</h2>
            <p className="text-xl text-muted-foreground">
              Explore the features that make Inc Combinator the ideal platform for startups
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Startup Directory */}
            <Card className="bg-card-gradient border-border hover:shadow-orange-glow transition-all duration-300">
              <CardHeader>
                <FileCode2 className="w-6 h-6 mb-4 text-primary" />
                <CardTitle className="text-2xl font-bold">Startup Directory</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Showcase your startup and connect with investors, mentors, and partners
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Get listed in our exclusive startup directory and increase your visibility
                </p>
                <Button variant="outline" className="w-full" onClick={() => navigate('/startup-directory')}>
                  Explore Startups
                </Button>
              </CardContent>
            </Card>

            {/* Investor Centre */}
            <Card className="bg-card-gradient border-border hover:shadow-orange-glow transition-all duration-300">
              <CardHeader>
                <BarChart4 className="w-6 h-6 mb-4 text-primary" />
                <CardTitle className="text-2xl font-bold">Investor Centre</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Access curated investment opportunities and connect with promising startups
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Discover high-potential startups and make informed investment decisions
                </p>
                <Button variant="outline" className="w-full" onClick={() => navigate('/investor-centre')}>
                  Find Startups
                </Button>
              </CardContent>
            </Card>

            {/* Co-founder Matching */}
            <Card className="bg-card-gradient border-border hover:shadow-orange-glow transition-all duration-300">
              <CardHeader>
                <MessageSquare className="w-6 h-6 mb-4 text-primary" />
                <CardTitle className="text-2xl font-bold">Co-founder Matching</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Find the perfect co-founder to complement your skills and drive your startup forward
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Connect with talented individuals and build a strong founding team
                </p>
                <Button variant="outline" className="w-full" onClick={() => navigate('/meet-cofounder')}>
                  Find a Co-founder
                </Button>
              </CardContent>
            </Card>

            {/* Resources Library */}
            <Card className="bg-card-gradient border-border hover:shadow-orange-glow transition-all duration-300">
              <CardHeader>
                <Grip className="w-6 h-6 mb-4 text-primary" />
                <CardTitle className="text-2xl font-bold">Resources Library</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Access a wealth of resources, tools, and templates to help you build and grow your startup
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Download essential guides, templates, and tools to accelerate your startup journey
                </p>
                <Button variant="outline" className="w-full" onClick={() => navigate('/resources')}>
                  Explore Resources
                </Button>
              </CardContent>
            </Card>

            {/* Mentorship Network */}
            <Card className="bg-card-gradient border-border hover:shadow-orange-glow transition-all duration-300">
              <CardHeader>
                <HandMetal className="w-6 h-6 mb-4 text-primary" />
                <CardTitle className="text-2xl font-bold">Mentorship Network</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Connect with experienced mentors who can provide guidance and support
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Get personalized advice and support from industry experts and successful entrepreneurs
                </p>
                <Button variant="outline" className="w-full" onClick={() => navigate('/about')}>
                  Find a Mentor
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Ready to Join Section */}
      <section className="py-20 bg-muted/5">
        <div className="container mx-auto px-4">
          <Card className="p-12 bg-card-gradient border-border text-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold">
                Ready to Join the{" "}
                <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
                  Next Cohort?
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Take the first step towards transforming your startup idea into a successful business. 
                Our comprehensive programs are designed to accelerate your growth.
              </p>
              <div className="flex flex-col md:flex-row gap-4 justify-center pt-6">
                <ApplicationDialog>
                  <Button variant="hero" size="lg" className="text-lg px-8 py-6">
                    Apply Now
                  </Button>
                </ApplicationDialog>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-8 py-6"
                  onClick={() => navigate('/current-cohort')}
                >
                  Program Details
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">Success Stories</h2>
            <p className="text-xl text-muted-foreground">
              Meet the entrepreneurs who transformed their ideas into successful businesses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <Card key={index} className="bg-card-gradient border-border hover:shadow-orange-glow transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-bold">{story.name[0]}</span>
                    </div>
                    <div>
                      <CardTitle className="text-lg">{story.name}</CardTitle>
                      <CardDescription>{story.company}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{story.story}</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-primary font-medium">{story.funding}</span>
                    <span className="text-muted-foreground">{story.year}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => navigate('/startup-profile')}
                  >
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/success-stories')}
            >
              View All Success Stories
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
