import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ApplicationDialog from "@/components/ApplicationDialog";
import { useNavigate } from "react-router-dom";

const AboutUs = () => {
  const navigate = useNavigate();

  const teamMembers = [
    {
      name: "Priya Sharma",
      role: "CEO & Founder",
      bio: "Priya is a serial entrepreneur with a passion for building innovative solutions. She has over 15 years of experience in the tech industry.",
      image: "/placeholder.svg"
    },
    {
      name: "Rajesh Kumar",
      role: "CTO & Co-founder",
      bio: "Rajesh is a seasoned technology leader with expertise in AI, machine learning, and cloud computing. He leads the technical vision and execution.",
      image: "/placeholder.svg"
    },
    {
      name: "Anita Singh",
      role: "Head of Incubation",
      bio: "Anita is an experienced incubator manager with a track record of helping startups succeed. She oversees the incubation program and provides mentorship.",
      image: "/placeholder.svg"
    },
    {
      name: "Vikram Patel",
      role: "Head of Partnerships",
      bio: "Vikram is responsible for building strategic partnerships with investors, mentors, and industry experts. He has a strong network in the startup ecosystem.",
      image: "/placeholder.svg"
    }
  ];

  const advisoryBoard = [
    {
      name: "Dr. Arvind Gupta",
      title: "Professor, IIT Bombay",
      expertise: "Technology & Innovation",
      image: "/placeholder.svg"
    },
    {
      name: "Meera Reddy",
      title: "Partner, Sequoia Capital",
      expertise: "Venture Capital & Investments",
      image: "/placeholder.svg"
    },
    {
      name: "Sunil Kumar",
      title: "CEO, Tech Mahindra",
      expertise: "Business Strategy & Leadership",
      image: "/placeholder.svg"
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
                About Us
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                Building the Future of{" "}
                <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
                  Innovation Together
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                Inc Combinator is a leading startup incubator dedicated to fostering innovation and 
                empowering entrepreneurs to build successful businesses.
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-center pt-6">
              <ApplicationDialog>
                <Button variant="hero" size="lg" className="text-lg px-8 py-6">
                  Apply as Founder
                </Button>
              </ApplicationDialog>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-6"
                onClick={() => navigate('/contact')}
              >
                Become a Mentor
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <Card className="bg-card-gradient border-border p-8 hover:shadow-orange-glow transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-3xl font-bold">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-lg">
                  To empower entrepreneurs with the resources, mentorship, and network they need to 
                  build impactful and scalable businesses.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card-gradient border-border p-8 hover:shadow-orange-glow transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-3xl font-bold">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-lg">
                  To be the leading startup incubator in India, driving innovation and creating a 
                  thriving ecosystem for entrepreneurs to succeed.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-muted/5">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">Meet Our Team</h2>
            <p className="text-xl text-muted-foreground">
              A dedicated team of experts passionate about helping startups succeed
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="bg-card-gradient border-border p-6 hover:shadow-orange-glow transition-all duration-300">
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden mx-auto">
                    <img src={member.image} alt={member.name} className="object-cover w-full h-full" />
                  </div>
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-muted-foreground">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Advisory Board */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">Advisory Board</h2>
            <p className="text-xl text-muted-foreground">
              Guidance from industry leaders and experts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {advisoryBoard.map((advisor, index) => (
              <Card key={index} className="bg-card-gradient border-border p-6 hover:shadow-orange-glow transition-all duration-300">
                <div className="text-center space-y-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden mx-auto">
                    <img src={advisor.image} alt={advisor.name} className="object-cover w-full h-full" />
                  </div>
                  <h3 className="text-xl font-bold">{advisor.name}</h3>
                  <p className="text-muted-foreground">{advisor.title}</p>
                  <p className="text-sm text-muted-foreground">{advisor.expertise}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/5">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">Our Core Values</h2>
            <p className="text-xl text-muted-foreground">
              Guiding principles that drive our actions and decisions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-card-gradient border-border p-6 hover:shadow-orange-glow transition-all duration-300">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">Innovation</h3>
                <p className="text-muted-foreground">
                  We foster a culture of creativity and continuous improvement, always seeking new and 
                  better ways to solve problems.
                </p>
              </div>
            </Card>

            <Card className="bg-card-gradient border-border p-6 hover:shadow-orange-glow transition-all duration-300">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">Collaboration</h3>
                <p className="text-muted-foreground">
                  We believe in the power of teamwork and collaboration, working together to achieve 
                  common goals and create a supportive community.
                </p>
              </div>
            </Card>

            <Card className="bg-card-gradient border-border p-6 hover:shadow-orange-glow transition-all duration-300">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">Impact</h3>
                <p className="text-muted-foreground">
                  We are committed to making a positive impact on society, supporting startups that 
                  address real-world challenges and create meaningful change.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;
