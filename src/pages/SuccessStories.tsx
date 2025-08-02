
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, TrendingUp, Users, DollarSign, ExternalLink } from "lucide-react";

const SuccessStories = () => {
  const successStories = [
    {
      id: 1,
      companyName: "HealthTech Innovations",
      founderName: "Dr. Priya Sharma",
      industry: "HealthTech",
      program: "MVP Lab",
      cohort: "2023 Batch 1",
      description: "AI-powered diagnostic platform for rural healthcare centers",
      metrics: {
        revenue: "₹2.5Cr ARR",
        funding: "₹15Cr Series A",
        users: "50,000+",
        growth: "300% YoY"
      },
      story: "Started with just an idea to make healthcare accessible in rural India. Through MVP Lab, we built our AI diagnostic platform in 8 weeks. The technical mentorship and cloud credits were game-changers.",
      achievements: [
        "Won National Healthcare Innovation Award 2023",
        "Deployed in 200+ rural healthcare centers",
        "Featured in Forbes India 30 Under 30",
        "Partnership with Government of Karnataka"
      ],
      image: "🏥",
      website: "https://healthtechinnovations.in"
    },
    {
      id: 2,
      companyName: "EduLearn Platform",
      founderName: "Rajesh Kumar & Sneha Patel",
      industry: "EdTech",
      program: "Incubation Program",
      cohort: "2022 Batch 3",
      description: "Personalized learning platform for K-12 students",
      metrics: {
        revenue: "₹1.8Cr ARR",
        funding: "₹8Cr Seed",
        users: "100,000+",
        growth: "250% YoY"
      },
      story: "Two teachers turned entrepreneurs, we joined the incubation program with a passion for improving education. The 16-week program helped us validate our product-market fit and scale rapidly.",
      achievements: [
        "Serving 500+ schools across India",
        "Improved student performance by 40%",
        "Winner of EdTech Startup of the Year 2022",
        "Expanded to 15 Indian languages"
      ],
      image: "📚",
      website: "https://edulearn.co.in"
    },
    {
      id: 3,
      companyName: "GreenTech Solutions",
      founderName: "Arjun Mehta",
      industry: "CleanTech",
      program: "INC Lab",
      cohort: "2023 Batch 2",
      description: "Solar energy management system for residential complexes",
      metrics: {
        revenue: "₹5Cr ARR",
        funding: "₹25Cr Series A",
        users: "10,000+",
        growth: "400% YoY"
      },
      story: "Climate change drove me to start GreenTech. INC Lab's focus on deep innovation helped us develop cutting-edge solar management technology that's now used in 1000+ residential complexes.",
      achievements: [
        "Reduced energy costs by 60% for clients",
        "Installed in 1000+ residential complexes",
        "Green Energy Innovation Award 2023",
        "Carbon footprint reduction of 50,000 tons CO2"
      ],
      image: "🌱",
      website: "https://greentech.solutions"
    },
    {
      id: 4,
      companyName: "FinFlow Technologies",
      founderName: "Kavya Agarwal",
      industry: "FinTech",
      program: "Hackathon Winner → MVP Lab",
      cohort: "2022 Hackathon → 2023 Batch 1",
      description: "Digital lending platform for SMEs and MSMEs",
      metrics: {
        revenue: "₹12Cr ARR",
        funding: "₹40Cr Series A",
        users: "25,000+",
        growth: "500% YoY"
      },
      story: "Won the 2022 hackathon with our lending algorithm idea. The journey from hackathon to MVP Lab to Series A funding has been incredible. The mentorship and network access were invaluable.",
      achievements: [
        "Disbursed ₹200Cr+ in loans",
        "Default rate <2% (industry avg 8%)",
        "Partnership with 15+ banks",
        "MSME Enabler of the Year 2023"
      ],
      image: "💰",
      website: "https://finflow.tech"
    },
    {
      id: 5,
      companyName: "AgriConnect",
      founderName: "Ravi Singh & Team",
      industry: "AgriTech",
      program: "Rural Innovation Grant → Incubation",
      cohort: "2022 Grant → 2023 Batch 2",
      description: "Farm-to-fork supply chain platform connecting farmers directly with consumers",
      metrics: {
        revenue: "₹3Cr ARR",
        funding: "₹12Cr Seed",
        users: "15,000+",
        growth: "350% YoY"
      },
      story: "Started with the Rural Innovation Grant to solve farmer income problems. The incubation program helped us scale from 100 farmers to 10,000+ farmers across 5 states.",
      achievements: [
        "Connected 10,000+ farmers to markets",
        "Increased farmer income by 40%",
        "Zero wastage supply chain model",
        "National Rural Innovation Award 2023"
      ],
      image: "🌾",
      website: "https://agriconnect.in"
    },
    {
      id: 6,
      companyName: "TechCraft Studios",
      founderName: "Amit Verma & Pooja Jain",
      industry: "Gaming/Entertainment",
      program: "MVP Lab",
      cohort: "2023 Batch 3",
      description: "Mobile gaming platform with focus on Indian cultural games",
      metrics: {
        revenue: "₹1.2Cr ARR",
        funding: "₹5Cr Pre-Series A",
        users: "200,000+",
        growth: "600% YoY"
      },
      story: "Two gaming enthusiasts who wanted to create games that celebrate Indian culture. MVP Lab helped us build our platform and launch 5 games in just 6 months.",
      achievements: [
        "5 games with 1M+ downloads each",
        "Featured on Google Play Store",
        "Gaming Innovation Award 2023",
        "Expanding to Southeast Asia"
      ],
      image: "🎮",
      website: "https://techcraft.games"
    }
  ];

  const programStats = [
    { program: "MVP Lab", startups: 120, successRate: "87%", totalFunding: "₹200Cr+" },
    { program: "Incubation", startups: 85, successRate: "82%", totalFunding: "₹150Cr+" },
    { program: "INC Lab", startups: 45, successRate: "91%", totalFunding: "₹180Cr+" },
    { program: "Hackathon", startups: 200, successRate: "65%", totalFunding: "₹80Cr+" }
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
                ⭐ Success Stories
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                From{" "}
                <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
                  Ideas to Unicorns
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                Meet the entrepreneurs who turned their dreams into successful businesses 
                with Inc Combinator's support and guidance.
              </p>
            </div>

            {/* Overall Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-8 max-w-6xl mx-auto">
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
              <Card className="p-6 bg-card-gradient border-border">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-primary">50,000+</div>
                  <div className="text-muted-foreground">Jobs Created</div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="space-y-16">
            {successStories.map((story, index) => (
              <Card key={story.id} className="p-8 bg-card-gradient border-border hover:shadow-orange-glow transition-all duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Company Info */}
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-6xl mb-4">{story.image}</div>
                      <h3 className="text-2xl font-bold">{story.companyName}</h3>
                      <p className="text-primary font-medium">{story.founderName}</p>
                      <div className="flex flex-wrap gap-2 justify-center mt-3">
                        <Badge variant="outline">{story.industry}</Badge>
                        <Badge variant="secondary">{story.program}</Badge>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <Button variant="outline" size="sm" onClick={() => window.open(story.website, '_blank')}>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Visit Website
                      </Button>
                    </div>
                  </div>

                  {/* Story & Metrics */}
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold mb-2">About</h4>
                      <p className="text-muted-foreground mb-4">{story.description}</p>
                      <p className="text-muted-foreground italic">"{story.story}"</p>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-background rounded-lg">
                        <div className="flex items-center justify-center mb-1">
                          <DollarSign className="w-4 h-4 text-primary" />
                        </div>
                        <div className="font-bold text-primary">{story.metrics.revenue}</div>
                        <div className="text-xs text-muted-foreground">Revenue</div>
                      </div>
                      <div className="text-center p-3 bg-background rounded-lg">
                        <div className="flex items-center justify-center mb-1">
                          <TrendingUp className="w-4 h-4 text-primary" />
                        </div>
                        <div className="font-bold text-primary">{story.metrics.funding}</div>
                        <div className="text-xs text-muted-foreground">Funding</div>
                      </div>
                      <div className="text-center p-3 bg-background rounded-lg">
                        <div className="flex items-center justify-center mb-1">
                          <Users className="w-4 h-4 text-primary" />
                        </div>
                        <div className="font-bold text-primary">{story.metrics.users}</div>
                        <div className="text-xs text-muted-foreground">Users</div>
                      </div>
                      <div className="text-center p-3 bg-background rounded-lg">
                        <div className="flex items-center justify-center mb-1">
                          <Star className="w-4 h-4 text-primary" />
                        </div>
                        <div className="font-bold text-primary">{story.metrics.growth}</div>
                        <div className="text-xs text-muted-foreground">Growth</div>
                      </div>
                    </div>

                    {/* Achievements */}
                    <div>
                      <h4 className="text-lg font-semibold mb-3">Key Achievements</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {story.achievements.map((achievement, achievementIndex) => (
                          <div key={achievementIndex} className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm text-muted-foreground">{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Program Stats */}
      <section className="py-20 bg-muted/5">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">Success by Program</h2>
            <p className="text-xl text-muted-foreground">
              Each program has its own track record of creating successful startups
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {programStats.map((stat, index) => (
              <Card key={index} className="p-6 bg-card-gradient border-border text-center">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">{stat.program}</h3>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-primary">{stat.startups}</div>
                    <div className="text-sm text-muted-foreground">Startups</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-lg font-bold text-green-600">{stat.successRate}</div>
                    <div className="text-sm text-muted-foreground">Success Rate</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-lg font-bold text-orange-400">{stat.totalFunding}</div>
                    <div className="text-sm text-muted-foreground">Total Funding</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="p-12 bg-card-gradient border-border text-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold">
                Ready to Write{" "}
                <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
                  Your Success Story?
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Join hundreds of entrepreneurs who have transformed their ideas into 
                successful businesses. Your success story could be next.
              </p>
              <div className="flex flex-col md:flex-row gap-4 justify-center pt-6">
                <Button variant="hero" size="lg" className="text-lg px-8 py-6">
                  Apply to Programs
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                  Schedule a Call
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SuccessStories;
