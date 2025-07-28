import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle, Clock, Users, TrendingUp, Target, Award, BookOpen, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";

const AboutUs = () => {
  const teamMembers = [
    {
      name: "Priya Sharma",
      role: "CEO",
      description: "Visionary leader with a passion for innovation and entrepreneurship.",
      avatar: "👩‍💼",
      linkedin: "https://linkedin.com/in/priyasharma"
    },
    {
      name: "Rajesh Kumar",
      role: "CTO",
      description: "Technology expert driving the platform's technical strategy and development.",
      avatar: "👨‍💻",
      linkedin: "https://linkedin.com/in/rajeshkumar"
    },
    {
      name: "Anita Singh",
      role: "Head of Incubation",
      description: "Dedicated to nurturing early-stage startups and helping them succeed.",
      avatar: "👩‍🎨",
      linkedin: "https://linkedin.com/in/anitasingh"
    },
    {
      name: "Vikram Patel",
      role: "Head of Investor Relations",
      description: "Connecting startups with the right investors to fuel their growth.",
      avatar: "👨‍💼",
      linkedin: "https://linkedin.com/in/vikrampatel"
    }
  ];

  const values = [
    {
      title: "Innovation",
      description: "We foster a culture of creativity and continuous improvement.",
      icon: <Lightbulb className="h-6 w-6 text-primary" />
    },
    {
      title: "Collaboration",
      description: "We believe in the power of teamwork and shared success.",
      icon: <Users className="h-6 w-6 text-primary" />
    },
    {
      title: "Impact",
      description: "We are committed to making a positive difference in the startup ecosystem.",
      icon: <TrendingUp className="h-6 w-6 text-primary" />
    },
    {
      title: "Integrity",
      description: "We operate with the highest ethical standards and transparency.",
      icon: <CheckCircle className="h-6 w-6 text-primary" />
    }
  ];

  const stats = [
    {
      label: "Startups Incubated",
      value: "500+",
      description: "Early-stage ventures nurtured"
    },
    {
      label: "Funding Facilitated",
      value: "₹100Cr+",
      description: "Capital raised for startups"
    },
    {
      label: "Mentors Engaged",
      value: "200+",
      description: "Experienced industry experts"
    },
    {
      label: "Jobs Created",
      value: "5,000+",
      description: "Employment opportunities generated"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-20 pb-12">
        {/* Header */}
        <section className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent mb-4">
            About Us
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Inc Combinator is India's leading startup accelerator and incubator, empowering entrepreneurs to build the next generation of innovative companies.
          </p>
        </section>

        {/* Values */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <Card key={value.title} className="bg-card-gradient border-border hover:shadow-orange-glow transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    {value.icon}
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <Card key={member.name} className="bg-card-gradient border-border hover:shadow-orange-glow transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={`https://avatar.vercel.sh/api/name=${member.name}`} alt={member.name} />
                      <AvatarFallback className="text-xl bg-primary/10 text-primary">
                        {member.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl">{member.name}</CardTitle>
                      <CardDescription className="text-muted-foreground">
                        {member.role}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{member.description}</p>
                  <Button variant="link" className="mt-4" onClick={() => window.open(member.linkedin, '_blank')}>
                    LinkedIn Profile
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <Card key={stat.label} className="bg-card-gradient border-border hover:shadow-orange-glow transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-center">{stat.value}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground text-center">
                    {stat.label}
                    <br />
                    {stat.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-16 mt-16 bg-gradient-to-r from-primary/10 to-orange-400/10 rounded-3xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Join Our Mission?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Whether you're a founder with a vision or an experienced mentor, we'd love to have you as part of our ecosystem.
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" className="bg-gradient-to-r from-primary to-orange-400 hover:shadow-orange-glow" asChild>
              <Link to="/incubation">
                Apply as Founder
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/become-mentor">
                Become a Mentor
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutUs;
