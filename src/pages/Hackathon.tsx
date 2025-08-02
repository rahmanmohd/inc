import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, Users, Link } from "lucide-react";
import HackathonRegistrationDialog from "@/components/HackathonRegistrationDialog";
import { useNavigate } from "react-router-dom";

const Hackathon = () => {
  const navigate = useNavigate();

  const upcomingHackathons = [
    {
      id: 1,
      title: "AI Innovation Challenge",
      date: "Jan 20-22, 2025",
      location: "Online",
      description: "Develop AI solutions for healthcare, education, and sustainability.",
      prizes: "₹5,00,000 in prizes",
      participants: "500+ participants",
      link: "#"
    },
    {
      id: 2,
      title: "Web3 Hackathon",
      date: "Feb 10-12, 2025",
      location: "Bangalore",
      description: "Build decentralized applications on blockchain.",
      prizes: "₹7,50,000 in prizes",
      participants: "300+ participants",
      link: "#"
    },
    {
      id: 3,
      title: "Mobile App Hackathon",
      date: "Mar 5-7, 2025",
      location: "Mumbai",
      description: "Create innovative mobile apps for various industries.",
      prizes: "₹6,00,000 in prizes",
      participants: "400+ participants",
      link: "#"
    }
  ];

  const pastHackathons = [
    {
      id: 1,
      title: "Sustainable Solutions Hackathon",
      date: "Nov 15-17, 2024",
      location: "Delhi",
      description: "Developed sustainable solutions for environmental challenges.",
      winners: "Team EcoInnovators",
      participants: "250+ participants"
    },
    {
      id: 2,
      title: "FinTech Hackathon",
      date: "Oct 20-22, 2024",
      location: "Chennai",
      description: "Built innovative FinTech solutions for the banking sector.",
      winners: "Team FinGenius",
      participants: "300+ participants"
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
                🚀 Hackathon
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                Code, Innovate,{" "}
                <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
                  Transform
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                Join Inc Combinator's hackathons to build innovative solutions, learn new skills, 
                and connect with a vibrant community of developers and entrepreneurs.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 max-w-3xl mx-auto">
              <Card className="p-6 bg-card-gradient border-border">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-primary">5000+</div>
                  <div className="text-muted-foreground">Developers</div>
                </div>
              </Card>
              <Card className="p-6 bg-card-gradient border-border">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-primary">₹25L+</div>
                  <div className="text-muted-foreground">Prizes Awarded</div>
                </div>
              </Card>
              <Card className="p-6 bg-card-gradient border-border">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-primary">15+</div>
                  <div className="text-muted-foreground">Hackathons Hosted</div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Hackathons */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">Upcoming Hackathons</h2>
            <p className="text-xl text-muted-foreground">
              Explore our upcoming hackathons and register to showcase your skills
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {upcomingHackathons.map((hackathon) => (
              <Card key={hackathon.id} className="bg-card-gradient border-border hover:shadow-orange-glow transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">{hackathon.title}</CardTitle>
                  <CardDescription>{hackathon.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{hackathon.date}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{hackathon.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{hackathon.participants}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{hackathon.prizes}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Link className="w-4 h-4" />
                    <a href={hackathon.link} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                      More Info
                    </a>
                  </div>
                </CardContent>
                <div className="text-center mt-12">
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => navigate('/hackathon')}
                  >
                    Learn More
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Past Hackathons */}
      <section className="py-20 bg-muted/5">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">Past Hackathons</h2>
            <p className="text-xl text-muted-foreground">
              Explore our past hackathons and their success stories
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pastHackathons.map((hackathon) => (
              <Card key={hackathon.id} className="bg-card-gradient border-border hover:shadow-orange-glow transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">{hackathon.title}</CardTitle>
                  <CardDescription>{hackathon.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{hackathon.date}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{hackathon.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{hackathon.participants}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Winner: {hackathon.winners}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

        {/* Ready to Code Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <Card className="p-12 bg-card-gradient border-border text-center">
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold">
                  Ready to Code Your Way to{" "}
                  <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
                    Success?
                  </span>
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Join thousands of developers, designers, and entrepreneurs in our flagship hackathon. 
                  Build, learn, and win amazing prizes while solving real-world problems.
                </p>
                <div className="flex flex-col md:flex-row gap-4 justify-center pt-6">
                  <HackathonRegistrationDialog>
                    <Button variant="hero" size="lg" className="text-lg px-8 py-6">
                      Register Now
                    </Button>
                  </HackathonRegistrationDialog>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="text-lg px-8 py-6"
                    onClick={() => navigate('/resources')}
                  >
                    Learn More
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

export default Hackathon;
