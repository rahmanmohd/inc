
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Cloud, Users, Code, TrendingUp, Globe, Download, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const Resources = () => {
  const resourceCategories = [
    {
      title: "Startup Toolkit",
      icon: BookOpen,
      resources: [
        { name: "Business Plan Template", type: "PDF", description: "Comprehensive template for Indian startups", link: "/resources/business-plan" },
        { name: "Financial Model Template", type: "Excel", description: "Revenue projections & funding calculator", link: "/resources/financial-model" },
        { name: "Pitch Deck Template", type: "PPT", description: "Investor-ready presentation template", link: "/resources/pitch-deck" },
        { name: "Legal Compliance Guide", type: "PDF", description: "Indian startup legal requirements", link: "/resources/legal-guide" }
      ]
    },
    {
      title: "Cloud Credits",
      icon: Cloud,
      resources: [
        { name: "AWS Activate Credits", type: "Credit", description: "Up to $10,000 in AWS credits", link: "/resources/aws-credits" },
        { name: "Google Cloud Credits", type: "Credit", description: "Up to $20,000 in GCP credits", link: "/resources/gcp-credits" },
        { name: "Microsoft Azure", type: "Credit", description: "Up to $15,000 in Azure credits", link: "/resources/azure-credits" },
        { name: "Digital Ocean", type: "Credit", description: "$5,000 in hosting credits", link: "/resources/digitalocean-credits" }
      ]
    },
    {
      title: "Development Tools",
      icon: Code,
      resources: [
        { name: "GitHub Enterprise", type: "Tool", description: "Free premium GitHub access", link: "/resources/github-enterprise" },
        { name: "Figma Professional", type: "Tool", description: "Design tool for startups", link: "/resources/figma-pro" },
        { name: "Notion Workspace", type: "Tool", description: "Team collaboration platform", link: "/resources/notion-workspace" },
        { name: "Slack Business+", type: "Tool", description: "Premium communication tool", link: "/resources/slack-business" }
      ]
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
            <div className="space-y-4">
              <Badge variant="secondary" className="bg-primary/10 text-primary text-lg px-4 py-2">
                🛠️ Resources & Tools
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                Startup{" "}
                <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent animate-glow-pulse">
                  Arsenal
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                Everything you need to build, scale, and succeed. From cloud credits to legal templates, 
                we've got your startup covered.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-8 max-w-5xl mx-auto">
              <Card className="p-6 bg-card-gradient border-border">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-primary">$200K+</div>
                  <div className="text-muted-foreground">Worth of Credits</div>
                </div>
              </Card>
              <Card className="p-6 bg-card-gradient border-border">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-primary">50+</div>
                  <div className="text-muted-foreground">Premium Tools</div>
                </div>
              </Card>
              <Card className="p-6 bg-card-gradient border-border">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-primary">100+</div>
                  <div className="text-muted-foreground">Templates</div>
                </div>
              </Card>
              <Card className="p-6 bg-card-gradient border-border">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-primary">24/7</div>
                  <div className="text-muted-foreground">Support</div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Resource Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="toolkit" className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto mb-16">
              <TabsTrigger value="toolkit">Startup Toolkit</TabsTrigger>
              <TabsTrigger value="credits">Cloud Credits</TabsTrigger>
              <TabsTrigger value="tools">Dev Tools</TabsTrigger>
            </TabsList>

            {resourceCategories.map((category, categoryIndex) => (
              <TabsContent key={categoryIndex} value={categoryIndex === 0 ? "toolkit" : categoryIndex === 1 ? "credits" : "tools"}>
                <div className="space-y-8">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <category.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold">{category.title}</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                    {category.resources.map((resource, index) => (
                      <Card key={index} className="p-6 bg-card-gradient border-border hover:shadow-orange-glow transition-all duration-300">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center gap-3">
                                <h3 className="text-xl font-bold">{resource.name}</h3>
                                <Badge variant="outline" className="text-xs">{resource.type}</Badge>
                              </div>
                              <p className="text-muted-foreground">{resource.description}</p>
                            </div>
                            <ExternalLink className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <Button variant="outline" className="w-full" asChild>
                            <Link to={resource.link}>
                              <Download className="w-4 h-4 mr-2" />
                              Access Resource
                            </Link>
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* How to Access */}
      <section className="py-20 bg-muted/5">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold">How to Access Resources</h2>
            <p className="text-xl text-muted-foreground">
              Simple 3-step process to unlock all startup resources
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
              <Card className="p-8 bg-card-gradient border-border text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-foreground font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Apply to Program</h3>
                <p className="text-muted-foreground">Submit your startup application to any Inc Combinator program</p>
              </Card>

              <Card className="p-8 bg-card-gradient border-border text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-foreground font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Get Approved</h3>
                <p className="text-muted-foreground">Receive acceptance and access to your startup dashboard</p>
              </Card>

              <Card className="p-8 bg-card-gradient border-border text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-foreground font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Unlock Everything</h3>
                <p className="text-muted-foreground">Access all resources, credits, and tools immediately</p>
              </Card>
            </div>

            <Button size="lg" className="bg-gradient-to-r from-primary to-orange-400 hover:shadow-orange-glow mt-8" asChild>
              <Link to="/incubation">
                Start Your Application
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Resources;
