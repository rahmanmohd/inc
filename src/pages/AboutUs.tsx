import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Target, Users, Lightbulb, Award, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const AboutUs = () => {
  const values = [
    {
      icon: Lightbulb,
      title: "Innovation First",
      description: "We believe in crazy ideas that can transform millions of lives"
    },
    {
      icon: Users,
      title: "Founder-Centric",
      description: "Everything we do is designed to empower and support founders"
    },
    {
      icon: Heart,
      title: "Impact Driven",
      description: "Building solutions for India's biggest challenges and opportunities"
    },
    {
      icon: Globe,
      title: "Scale Mindset",
      description: "Thinking big, building for massive scale and global impact"
    }
  ];

  const team = [
    {
      name: "Rajesh Sharma",
      role: "Founder & CEO",
      background: "Ex-Flipkart, 15+ years in startups",
      emoji: "👨‍💼"
    },
    {
      name: "Priya Patel",
      role: "Head of Programs",
      background: "Ex-Google, Startup ecosystem expert",
      emoji: "👩‍💻"
    },
    {
      name: "Amit Kumar",
      role: "Investment Director",
      background: "Ex-Sequoia, 100+ startup investments",
      emoji: "👨‍💻"
    },
    {
      name: "Dr. Sunita Rao",
      role: "Mentor Network Head",
      background: "Ex-TCS CTO, Tech innovation leader",
      emoji: "👩‍🔬"
    }
  ];

  const milestones = [
    { year: "2022", event: "Inc Combinator Founded", description: "Started with a vision to transform Indian startup ecosystem" },
    { year: "2022", event: "First Cohort", description: "25 startups graduated from our inaugural program" },
    { year: "2023", event: "₹50Cr+ Funded", description: "Our startups raised significant funding rounds" },
    { year: "2023", event: "Corporate Partnerships", description: "Strategic partnerships with major Indian corporates" },
    { year: "2024", event: "Pan-India Expansion", description: "Programs launched across 10+ Indian cities" },
    { year: "2024", event: "International Recognition", description: "Featured as top accelerator by global startup publications" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Breadcrumbs />
      
      <main className="container mx-auto px-4 pb-12">
        {/* Hero Section */}
        <section className="pt-20 pb-16 bg-hero-gradient relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/95"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center space-y-8 animate-fade-in">
              <div className="space-y-4">
                <Badge variant="secondary" className="bg-primary/10 text-primary text-lg px-4 py-2">
                  🇮🇳 Made in India, For India
                </Badge>
                <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                  About{" "}
                  <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent animate-glow-pulse">
                    Inc Combinator
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                  We're on a mission to find and fund India's craziest founders who are building 
                  scalable solutions for the world's largest problems.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
              <Card className="p-8 bg-card-gradient border-border">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Target className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold">Our Mission</h2>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    To identify, nurture, and scale India's most promising startups that are solving 
                    real problems for real people. We believe in the power of crazy ideas backed by 
                    solid execution and relentless focus on customer validation.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                      Empower 10,000+ founders by 2030
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                      Create 100+ unicorns from India
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                      Impact 1 billion+ lives globally
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-8 bg-card-gradient border-border">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Award className="w-6 h-6 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold">Our Vision</h2>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    To make India the global startup capital by 2030. We envision an ecosystem where 
                    every great idea gets the support it needs to become a scalable, sustainable business 
                    that creates massive value for society.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                      World's largest startup ecosystem
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                      Global innovation hub
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                      Sustainable wealth creation
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-20 bg-muted/5">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl md:text-5xl font-bold">Our Values</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                The principles that guide everything we do
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {values.map((value, index) => (
                <Card key={index} className="p-6 bg-card-gradient border-border text-center hover:shadow-orange-glow transition-all duration-300">
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <value.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">{value.title}</h3>
                    <p className="text-muted-foreground text-sm">{value.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Our Journey */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl md:text-5xl font-bold">Our Journey</h2>
              <p className="text-xl text-muted-foreground">
                Key milestones in building India's startup ecosystem
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <div key={index} className="flex items-start space-x-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-primary-foreground font-bold text-sm">{milestone.year}</span>
                      </div>
                    </div>
                    <Card className="flex-1 p-6 bg-card-gradient border-border">
                      <h3 className="text-xl font-bold mb-2">{milestone.event}</h3>
                      <p className="text-muted-foreground">{milestone.description}</p>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Leadership Team */}
        <section className="py-20 bg-muted/5">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl md:text-5xl font-bold">Leadership Team</h2>
              <p className="text-xl text-muted-foreground">
                Experienced leaders driving startup success
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {team.map((member, index) => (
                <Card key={index} className="p-6 bg-card-gradient border-border text-center hover:shadow-orange-glow transition-all duration-300">
                  <div className="space-y-4">
                    <div className="text-4xl">{member.emoji}</div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold">{member.name}</h3>
                      <Badge variant="outline">{member.role}</Badge>
                      <p className="text-muted-foreground text-sm">{member.background}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="text-center py-16 bg-gradient-to-r from-primary/10 to-orange-400/10 rounded-3xl">
          <h2 className="text-3xl font-bold mb-4">Join the Inc Combinator Community</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Whether you're a founder with a groundbreaking idea or an experienced professional looking to give back, there's a place for you in our ecosystem.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/incubation">
              <Button size="lg" className="bg-gradient-to-r from-primary to-orange-400 hover:shadow-orange-glow">
                Apply as Founder
              </Button>
            </Link>
            <Link to="/become-mentor">
              <Button variant="outline" size="lg">
                Become a Mentor
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutUs;
