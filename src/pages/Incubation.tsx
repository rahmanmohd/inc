
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight, Users, Calendar, TrendingUp, Target, Clock, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import IncubationApplicationForm from "@/components/IncubationApplicationForm";

const Incubation = () => {
  const programBenefits = [
    {
      icon: Users,
      title: "Mentorship Network",
      description: "Access to 200+ successful entrepreneurs and industry experts"
    },
    {
      icon: TrendingUp,
      title: "Funding Support",
      description: "Direct access to VCs, angels, and government funding programs"
    },
    {
      icon: Target,
      title: "Market Access",
      description: "Connect with customers, partners, and distribution channels"
    },
    {
      icon: BookOpen,
      title: "Resources & Tools",
      description: "Premium tools, legal support, and business resources worth $200K+"
    }
  ];

  const programStructure = [
    {
      phase: "Application & Selection",
      duration: "2 weeks",
      description: "Apply with your startup idea and go through our selection process"
    },
    {
      phase: "Ideation & Validation",
      duration: "4 weeks",
      description: "Refine your idea, validate the market, and build your MVP"
    },
    {
      phase: "Product Development",
      duration: "8 weeks",
      description: "Build your product with technical mentorship and user feedback"
    },
    {
      phase: "Go-to-Market",
      duration: "8 weeks",
      description: "Launch your product, acquire customers, and scale your business"
    },
    {
      phase: "Funding & Scale",
      duration: "4 weeks",
      description: "Prepare for funding rounds and scale your operations"
    }
  ];

  const successMetrics = [
    { label: "Startups Incubated", value: "500+", icon: "🚀" },
    { label: "Success Rate", value: "85%", icon: "📈" },
    { label: "Average Funding", value: "₹2.5Cr", icon: "💰" },
    { label: "Job Creation", value: "5,000+", icon: "👥" }
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
              🚀 Incubation Program
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Turn Your Idea Into a{" "}
              <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent animate-glow-pulse">
                Successful Startup
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Join India's premier startup incubation program. Get mentorship, funding, 
              and resources to build the next unicorn.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <IncubationApplicationForm>
                <Button size="lg" className="bg-gradient-to-r from-primary to-orange-400 hover:shadow-orange-glow">
                  Apply Now
                </Button>
              </IncubationApplicationForm>
              <Button variant="outline" size="lg" asChild>
                <Link to="/program-details">
                  Program Details
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Success Metrics */}
      <section className="py-16 bg-muted/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {successMetrics.map((metric, index) => (
              <Card key={index} className="text-center p-6 bg-card-gradient border-border">
                <div className="text-4xl mb-4">{metric.icon}</div>
                <div className="text-3xl font-bold text-primary mb-2">{metric.value}</div>
                <div className="text-muted-foreground">{metric.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Program Benefits */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">What You'll Get</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive support to take your startup from idea to market success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {programBenefits.map((benefit, index) => (
              <Card key={index} className="p-6 bg-card-gradient border-border text-center hover:shadow-lg transition-all duration-300">
                <benefit.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Program Structure */}
      <section className="py-20 bg-muted/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Program Structure</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our proven 6-month program designed to accelerate your startup journey
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {programStructure.map((phase, index) => (
              <div key={index} className="relative">
                <div className="flex items-start space-x-6 mb-8">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-primary-foreground font-bold">{index + 1}</span>
                    </div>
                  </div>
                  <Card className="flex-1 p-6 bg-card-gradient border-border">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold">{phase.phase}</h3>
                      <Badge variant="outline" className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{phase.duration}</span>
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">{phase.description}</p>
                  </Card>
                </div>
                {index < programStructure.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-8 bg-border"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Selection Criteria */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold">Selection Criteria</h2>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  We look for passionate founders with innovative ideas and the drive to execute.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold mb-1">Innovative Solution</h4>
                    <p className="text-muted-foreground">Address a real problem with a unique approach</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold mb-1">Market Potential</h4>
                    <p className="text-muted-foreground">Large addressable market with growth potential</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold mb-1">Strong Team</h4>
                    <p className="text-muted-foreground">Committed founders with relevant experience</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold mb-1">Execution Ability</h4>
                    <p className="text-muted-foreground">Demonstrated ability to execute and iterate</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-orange-400/20 rounded-3xl flex items-center justify-center">
                <div className="text-8xl">🎯</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-20 bg-muted/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Application Process</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Simple 4-step process to join our incubation program
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="p-6 bg-card-gradient border-border text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-foreground font-bold">1</span>
              </div>
              <h3 className="text-lg font-bold mb-2">Apply Online</h3>
              <p className="text-muted-foreground text-sm">Submit your application with startup details</p>
            </Card>

            <Card className="p-6 bg-card-gradient border-border text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-foreground font-bold">2</span>
              </div>
              <h3 className="text-lg font-bold mb-2">Initial Review</h3>
              <p className="text-muted-foreground text-sm">Our team reviews your application</p>
            </Card>

            <Card className="p-6 bg-card-gradient border-border text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-foreground font-bold">3</span>
              </div>
              <h3 className="text-lg font-bold mb-2">Pitch & Interview</h3>
              <p className="text-muted-foreground text-sm">Present your idea to our selection committee</p>
            </Card>

            <Card className="p-6 bg-card-gradient border-border text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-foreground font-bold">4</span>
              </div>
              <h3 className="text-lg font-bold mb-2">Final Selection</h3>
              <p className="text-muted-foreground text-sm">Get selected and start your journey</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-orange-400/10">
        <div className="container mx-auto px-4 text-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-bold">Ready to Start Your Journey?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join hundreds of successful startups who have transformed their ideas into thriving businesses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <IncubationApplicationForm>
                <Button size="lg" className="bg-gradient-to-r from-primary to-orange-400 hover:shadow-orange-glow">
                  Apply Now
                </Button>
              </IncubationApplicationForm>
              <Button variant="outline" size="lg" asChild>
                <Link to="/program-details">
                  Learn More
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

export default Incubation;
