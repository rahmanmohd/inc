import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Code, Zap, Target, Users, Trophy } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { DynamicHackathonCards } from "@/components/DynamicHackathonCards";
import { HackathonRegistrationDialog } from "@/components/HackathonRegistrationDialog";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const Hackathon = () => {

  const tracks = [
    {
      name: "AI/ML Track",
      icon: "🤖",
      description: "Build intelligent solutions using artificial intelligence and machine learning",
      technologies: ["Python", "TensorFlow", "PyTorch", "OpenAI APIs"]
    },
    {
      name: "Web Development",
      icon: "🌐",
      description: "Create innovative web applications and platforms",
      technologies: ["React", "Node.js", "MongoDB", "AWS"]
    },
    {
      name: "Mobile Apps",
      icon: "📱",
      description: "Develop mobile applications for iOS and Android",
      technologies: ["React Native", "Flutter", "Swift", "Kotlin"]
    },
    {
      name: "Blockchain/Web3",
      icon: "⛓️",
      description: "Build decentralized applications and blockchain solutions",
      technologies: ["Solidity", "Ethereum", "Web3.js", "IPFS"]
    },
    {
      name: "IoT & Hardware",
      icon: "🔧",
      description: "Create IoT devices and hardware-based solutions",
      technologies: ["Arduino", "Raspberry Pi", "ESP32", "Sensors"]
    },
    {
      name: "Open Innovation",
      icon: "💡",
      description: "Think outside the box with creative and unique solutions",
      technologies: ["Any technology stack"]
    }
  ];

  const prizes = [
    {
      position: "1st Place",
      amount: "₹5,00,000",
      benefits: ["Cash Prize", "Incubation Program", "Mentorship", "AWS Credits"]
    },
    {
      position: "2nd Place",
      amount: "₹3,00,000",
      benefits: ["Cash Prize", "Mentorship Program", "Co-working Space", "GitHub Credits"]
    },
    {
      position: "3rd Place",
      amount: "₹2,00,000",
      benefits: ["Cash Prize", "Online Courses", "Startup Resources", "Networking"]
    }
  ];

  const pastWinners = [
    {
      year: "2024",
      winner: "HealthAI",
      project: "AI-powered diagnostic assistant for rural healthcare",
      prize: "₹5,00,000"
    },
    {
      year: "2023",
      winner: "EcoTrack",
      project: "IoT-based waste management system for smart cities",
      prize: "₹4,00,000"
    },
    {
      year: "2022",
      winner: "FinanceBot",
      project: "AI chatbot for financial literacy and investment guidance",
      prize: "₹3,50,000"
    }
  ];

  // Hackathon registration state
  const navigate = useNavigate();
  const { toast } = useToast();
  const [hackathonDialogOpen, setHackathonDialogOpen] = useState(false);
  const [selectedHackathon, setSelectedHackathon] = useState(null);

  const handleHackathonRegister = async () => {
    try {
      // Specifically target the "Tech Innovation Hackathon 2024"
      const { data: hackathons, error } = await supabase
        .from('hackathons')
        .select('*')
        .eq('title', 'Tech Innovation Hackathon 2024')
        .eq('published', true)
        .limit(1);

      if (error) throw error;

      if (hackathons && hackathons.length > 0) {
        // Use the Tech Innovation Hackathon 2024
        setSelectedHackathon(hackathons[0]);
        setHackathonDialogOpen(true);
      } else {
        // Fallback to mock hackathon if the specific one is not found
        const mockHackathon = {
          id: "00000000-0000-0000-0000-000000000001", // Proper UUID format
          title: "Tech Innovation Hackathon 2024",
          subtitle: "Build the Future of Technology",
          description: "Join us for an exciting 48-hour hackathon where you can showcase your skills, learn new technologies, and build innovative solutions.",
          start_date: "2024-02-15",
          end_date: "2024-02-17",
          location: "Bangalore, India",
          prize_pool: "₹50,000",
          expected_participants: 200,
          registration_count: 0
        };
        setSelectedHackathon(mockHackathon);
        setHackathonDialogOpen(true);
      }
    } catch (error) {
      console.error('Error fetching hackathon for registration:', error);
      toast({
        title: "Error",
        description: "Failed to load hackathon details. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleHackathonSuccess = () => {
    setHackathonDialogOpen(false);
    setSelectedHackathon(null);
    toast({
      title: "Success",
      description: "Successfully registered for hackathon!"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-20 pb-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent mb-6">
            Inc Combinator Hackathons
          </h1>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto mb-8">
            Join India's most exciting hackathons where innovation meets opportunity. Code, compete, and create solutions that matter.
          </p>
          <div className="flex justify-center space-x-4">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-orange-400 hover:shadow-orange-glow"
              onClick={handleHackathonRegister}
            >
              Register for Next Hackathon
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate("/past-events")}>
              View Past Events
            </Button>
          </div>
        </section>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">5,000+</div>
              <p className="text-xs text-muted-foreground">Across all events</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Prize Money</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">₹50L+</div>
              <p className="text-xs text-muted-foreground">Total distributed</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projects Built</CardTitle>
              <Code className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">1,200+</div>
              <p className="text-xs text-muted-foreground">Innovative solutions</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">25%</div>
              <p className="text-xs text-muted-foreground">Become startups</p>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Hackathons */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Upcoming Hackathons</h2>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
              className="ml-4"
            >
              Refresh
            </Button>
          </div>
          <DynamicHackathonCards />
        </section>

        {/* Competition Tracks */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Competition Tracks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tracks.map((track, index) => (
              <Card key={index} className="hover:shadow-md transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{track.icon}</div>
                    <CardTitle className="text-lg">{track.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{track.description}</p>
                  <div>
                    <p className="text-sm font-medium mb-2">Popular Technologies:</p>
                    <div className="flex flex-wrap gap-1">
                      {track.technologies.map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Prizes */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Prizes & Rewards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {prizes.map((prize, index) => (
              <Card key={index} className={`hover:shadow-lg transition-all duration-300 ${index === 0 ? 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900' : ''}`}>
                <CardHeader className="text-center">
                  <div className="text-4xl mb-2">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                  </div>
                  <CardTitle className="text-xl">{prize.position}</CardTitle>
                  <CardDescription className="text-2xl font-bold text-primary">
                    {prize.amount}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {prize.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <Zap className="h-4 w-4 text-primary" />
                        <span className="text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Past Winners */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Past Winners</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pastWinners.map((winner, index) => (
              <Card key={index} className="hover:shadow-md transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{winner.winner}</CardTitle>
                    <Badge variant="outline">{winner.year}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{winner.project}</p>
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-4 w-4 text-primary" />
                    <span className="font-medium text-primary">{winner.prize}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center py-16 bg-gradient-to-r from-primary/10 to-orange-400/10 rounded-3xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Code Your Way to Success?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of developers, designers, and innovators in creating solutions that can change the world. 
            Register now and be part of India's premier hackathon experience.
          </p>
          <div className="flex justify-center space-x-4">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-orange-400 hover:shadow-orange-glow"
              onClick={handleHackathonRegister}
            >
              Register Now
            </Button>
            <Link to="/program-details">
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Hackathon Registration Dialog */}
      {selectedHackathon && (
        <HackathonRegistrationDialog
          open={hackathonDialogOpen}
          onOpenChange={setHackathonDialogOpen}
          hackathon={selectedHackathon}
          onSuccess={handleHackathonSuccess}
        />
      )}

      <Footer />
    </div>
  );
};

export default Hackathon;
