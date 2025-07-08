import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Users, Calendar, ArrowDown } from "lucide-react";
import ApplicationDialog from "@/components/ApplicationDialog";

const Incubation = () => {
  const incubationPlans = [
    {
      name: "Pre-Seed Track",
      duration: "3 Months",
      investment: "₹25L for 8% equity",
      features: [
        "MVP Development Support",
        "Product-Market Fit Validation", 
        "Go-to-Market Strategy",
        "₹5L Cloud Credits",
        "Weekly 1:1 Mentorship",
        "Legal & Compliance Setup"
      ],
      ideal: "Early-stage founders with validated ideas"
    },
    {
      name: "Seed Track",
      duration: "6 Months", 
      investment: "₹1Cr for 12% equity",
      features: [
        "Advanced Technical Team",
        "Series A Preparation",
        "Corporate Partnerships",
        "₹15L Cloud Credits", 
        "Board Advisory",
        "International Market Entry"
      ],
      ideal: "Startups with proven traction and revenue"
    },
    {
      name: "Scale Track",
      duration: "12 Months",
      investment: "₹5Cr for 15% equity", 
      features: [
        "Complete Tech Infrastructure",
        "Multi-city Expansion Support",
        "Series B Fundraising",
        "₹50L Cloud Credits",
        "C-Suite Advisory",
        "IPO Preparation Guidance"
      ],
      ideal: "High-growth startups ready to scale nationally"
    }
  ];

  const successStories = [
    {
      company: "AgriLink",
      founder: "Rajesh Patel",
      sector: "AgriTech",
      stage: "Series A - ₹50Cr",
      impact: "2M+ farmers served",
      story: "From a hackathon idea to India's largest farmer network platform"
    },
    {
      company: "HealthBridge Pro",
      founder: "Dr. Priya Singh", 
      sector: "HealthTech",
      stage: "Series B - ₹200Cr",
      impact: "10M+ consultations",
      story: "Revolutionizing rural healthcare with AI-powered diagnostics"
    },
    {
      company: "EduTech Bharat",
      founder: "Vikash Kumar",
      sector: "EdTech", 
      stage: "Acquired by BYJU'S",
      impact: "5M+ students",
      story: "Vernacular language learning platform acquired for ₹500Cr"
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
                🎯 Scale. Grow. Dominate.
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                Build The Next{" "}
                <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent animate-glow-pulse">
                  Indian Unicorn
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                Our intensive incubation program transforms validated startups into 
                market-dominating companies. From idea to IPO, we're your growth partner.
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-center items-center pt-4">
              <ApplicationDialog
                type="incubation"
                title="Apply for Incubation Program"
                description="Join our intensive incubation program to transform your startup into a market leader"
              >
                <Button variant="hero" size="lg" className="text-lg px-8 py-6">
                  Apply for Incubation
                </Button>
              </ApplicationDialog>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                Meet Our Portfolio
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-8 max-w-5xl mx-auto">
              <Card className="p-6 bg-card-gradient border-border">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-primary">200+</div>
                  <div className="text-muted-foreground">Startups Incubated</div>
                </div>
              </Card>
              <Card className="p-6 bg-card-gradient border-border">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-primary">₹5000Cr+</div>
                  <div className="text-muted-foreground">Total Valuation</div>
                </div>
              </Card>
              <Card className="p-6 bg-card-gradient border-border">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-primary">15+</div>
                  <div className="text-muted-foreground">Unicorns Created</div>
                </div>
              </Card>
              <Card className="p-6 bg-card-gradient border-border">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-primary">95%</div>
                  <div className="text-muted-foreground">Success Rate</div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Incubation Plans */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">
              Incubation{" "}
              <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
                Programs
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Tailored programs for every stage of your startup journey
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {incubationPlans.map((plan, index) => (
              <Card key={index} className={`p-8 bg-card-gradient border-border hover:shadow-orange-glow transition-all duration-300 relative ${index === 1 ? 'scale-105 border-primary' : ''}`}>
                {index === 1 && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                    Most Popular
                  </Badge>
                )}
                <div className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                    <div className="flex items-center space-x-4">
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        {plan.duration}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm">{plan.ideal}</p>
                  </div>

                  <div className="text-center py-4">
                    <div className="text-3xl font-bold text-primary">{plan.investment}</div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">What's Included:</h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <ApplicationDialog
                    type="incubation"
                    title={`Apply for ${plan.name}`}
                    description={`Join our ${plan.name} program tailored for ${plan.ideal.toLowerCase()}`}
                  >
                    <Button variant={index === 1 ? "hero" : "outline"} className="w-full">
                      Apply Now
                    </Button>
                  </ApplicationDialog>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-muted/5">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">Success Stories</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From our incubator to market leaders
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {successStories.map((story, index) => (
              <Card key={index} className="p-8 bg-card-gradient border-border hover:shadow-orange-glow transition-all duration-300">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      {story.sector}
                    </Badge>
                    <h3 className="text-2xl font-bold">{story.company}</h3>
                    <p className="text-muted-foreground">Founded by {story.founder}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Current Stage:</span>
                      <span className="font-semibold text-primary">{story.stage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Impact:</span>
                      <span className="font-semibold">{story.impact}</span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground italic">
                    "{story.story}"
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">Application Process</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From application to acceptance in 4 simple steps
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="bg-card-gradient border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center space-x-4">
                    <Badge className="bg-primary text-primary-foreground">1</Badge>
                    <span>Submit Application</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pl-12">
                  Complete our comprehensive application form with your startup details, team information, market analysis, and growth projections. Include a 2-minute pitch video.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="bg-card-gradient border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center space-x-4">
                    <Badge className="bg-primary text-primary-foreground">2</Badge>
                    <span>Initial Screening</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pl-12">
                  Our team reviews applications based on market potential, team strength, traction metrics, and scalability. Top 20% move to the next round within 2 weeks.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-card-gradient border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center space-x-4">
                    <Badge className="bg-primary text-primary-foreground">3</Badge>
                    <span>Pitch & Interview</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pl-12">
                  Selected startups pitch to our partner panel including successful entrepreneurs, VCs, and industry experts. Deep-dive interviews assess founder-market fit.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="bg-card-gradient border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center space-x-4">
                    <Badge className="bg-primary text-primary-foreground">4</Badge>
                    <span>Final Selection</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pl-12">
                  Final cohort of 10-15 startups is selected. Immediate onboarding begins with legal documentation, mentor assignment, and program kickoff.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="text-center pt-16">
            <ApplicationDialog
              type="incubation"
              title="Apply for Incubation Program"
              description="Start your journey with Inc Combinator's incubation program"
            >
              <Button variant="hero" size="lg" className="text-lg px-8 py-6">
                Start Your Application
              </Button>
            </ApplicationDialog>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Incubation;
