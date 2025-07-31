
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Target, Award, TrendingUp, ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const AboutUs = () => {
  const stats = [
    { label: "Startups Incubated", value: "500+", icon: TrendingUp },
    { label: "Success Stories", value: "150+", icon: Award },
    { label: "Mentors Network", value: "200+", icon: Users },
    { label: "Funding Raised", value: "₹500Cr+", icon: Target },
  ];

  const values = [
    {
      title: "Innovation First",
      description: "We believe in pushing boundaries and creating solutions that matter.",
      icon: "🚀"
    },
    {
      title: "Founder-Centric",
      description: "Everything we do is designed to empower and support entrepreneurs.",
      icon: "👥"
    },
    {
      title: "Community Driven",
      description: "Building a strong ecosystem where everyone grows together.",
      icon: "🤝"
    },
    {
      title: "Global Impact",
      description: "Creating startups that solve problems on a global scale.",
      icon: "🌍"
    }
  ];

  const team = [
    {
      name: "Rajesh Kumar",
      role: "Founder & CEO",
      description: "Former VP at Google India with 15+ years in tech",
      image: "👨‍💼"
    },
    {
      name: "Priya Sharma",
      role: "Head of Programs",
      description: "Ex-McKinsey consultant specializing in startup growth",
      image: "👩‍💼"
    },
    {
      name: "Amit Patel",
      role: "Head of Investments",
      description: "Former Sequoia Capital with 10+ years in VC",
      image: "👨‍💻"
    },
    {
      name: "Neha Singh",
      role: "Head of Community",
      description: "Building India's largest startup community",
      image: "👩‍🎓"
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
              🚀 About Inc Combinator
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Empowering{" "}
              <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent animate-glow-pulse">
                Tomorrow's
              </span>
              <br />
              Innovators
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              We're India's leading startup accelerator, transforming ideas into successful businesses 
              and connecting entrepreneurs with the resources they need to scale.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center p-6 bg-card-gradient border-border">
                <stat.icon className="w-8 h-8 mx-auto mb-4 text-primary" />
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold">Our Mission</h2>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  To create a thriving ecosystem where innovative startups can flourish, 
                  scale rapidly, and make a meaningful impact on society.
                </p>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">What We Do</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <p className="text-muted-foreground">Accelerate startup growth through structured programs</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <p className="text-muted-foreground">Connect entrepreneurs with investors and mentors</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <p className="text-muted-foreground">Provide resources, tools, and market access</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <p className="text-muted-foreground">Build a strong community of innovators</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-orange-400/20 rounded-full flex items-center justify-center">
                <div className="text-8xl">🎯</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/5">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-8 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">Our Values</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="p-6 bg-card-gradient border-border text-center">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-8 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">Meet Our Team</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experienced leaders dedicated to your success
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="p-6 bg-card-gradient border-border text-center">
                <div className="text-6xl mb-4">{member.image}</div>
                <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                <p className="text-primary font-medium mb-3">{member.role}</p>
                <p className="text-sm text-muted-foreground">{member.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-orange-400/10">
        <div className="container mx-auto px-4 text-center">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold">Ready to Join Us?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Whether you're a founder with a great idea or an experienced professional 
              looking to give back, we have opportunities for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-primary to-orange-400 hover:shadow-orange-glow" asChild>
                <Link to="/incubation">
                  Apply as Founder
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/become-mentor">
                  Become a Mentor
                  <ArrowRight className="ml-2 h-4 w-4" />
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

export default AboutUs;
