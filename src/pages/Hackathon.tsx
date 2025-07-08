import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Calendar, Users, ArrowDown } from "lucide-react";
import ApplicationDialog from "@/components/ApplicationDialog";

const Hackathon = () => {
  const upcomingHackathons = [
    {
      title: "AgriTech Innovation Challenge",
      date: "March 15-17, 2024",
      theme: "Solving Rural Agriculture Problems",
      prizes: "₹10L Total Prize Pool",
      participants: "500+ Expected",
      status: "Registration Open"
    },
    {
      title: "FinTech Disruption Hackathon", 
      date: "April 20-22, 2024",
      theme: "Financial Inclusion for Bharat",
      prizes: "₹15L Total Prize Pool",
      participants: "750+ Expected",
      status: "Coming Soon"
    },
    {
      title: "HealthTech for All",
      date: "May 10-12, 2024",
      theme: "Accessible Healthcare Solutions", 
      prizes: "₹12L Total Prize Pool",
      participants: "600+ Expected",
      status: "Save the Date"
    }
  ];

  const tracks = [
    {
      name: "AgriTech Track",
      description: "Revolutionary solutions for Indian agriculture",
      prize: "₹3L + Incubation Opportunity"
    },
    {
      name: "FinTech Track",
      description: "Financial inclusion and digital payments",
      prize: "₹3L + Banking Partnership"
    },
    {
      name: "HealthTech Track",
      description: "Accessible healthcare for rural India",
      prize: "₹3L + Hospital Network Access"
    },
    {
      name: "EdTech Track",
      description: "Education technology in vernacular languages",
      prize: "₹2L + School Partnerships"
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
                🚀 Build. Compete. Transform.
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                Hackathons That{" "}
                <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent animate-glow-pulse">
                  Create Unicorns
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                Join India's most intense 48-hour innovation battles. Where crazy ideas 
                become scalable startups and winners get fast-tracked to Inc Combinator.
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-center items-center pt-4">
              <ApplicationDialog
                type="hackathon"
                title="Register for Next Hackathon"
                description="Join India's most competitive hackathon and turn your idea into a winning startup"
              >
                <Button variant="hero" size="lg" className="text-lg px-8 py-6">
                  Register for Next Hackathon
                </Button>
              </ApplicationDialog>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                View Past Winners
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 max-w-4xl mx-auto">
              <Card className="p-6 bg-card-gradient border-border">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-primary">25+</div>
                  <div className="text-muted-foreground">Hackathons Conducted</div>
                </div>
              </Card>
              <Card className="p-6 bg-card-gradient border-border">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-primary">5000+</div>
                  <div className="text-muted-foreground">Participants</div>
                </div>
              </Card>
              <Card className="p-6 bg-card-gradient border-border">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-primary">50+</div>
                  <div className="text-muted-foreground">Winning Teams Funded</div>
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
            <h2 className="text-4xl md:text-5xl font-bold">
              Upcoming{" "}
              <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
                Hackathons
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              48 hours to build the future. Multiple tracks. Massive prizes. Direct path to funding.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {upcomingHackathons.map((hackathon, index) => (
              <Card key={index} className="p-8 bg-card-gradient border-border hover:shadow-orange-glow transition-all duration-300">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      {hackathon.status}
                    </Badge>
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{hackathon.date}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold">{hackathon.title}</h3>
                    <p className="text-muted-foreground">{hackathon.theme}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Prize Pool:</span>
                      <span className="font-semibold text-primary">{hackathon.prizes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Expected:</span>
                      <span className="font-semibold">{hackathon.participants}</span>
                    </div>
                  </div>

                  <ApplicationDialog
                    type="hackathon"
                    title={`Register for ${hackathon.title}`}
                    description={`Join the ${hackathon.title} and compete for ${hackathon.prizes}`}
                  >
                    <Button 
                      variant={hackathon.status === "Registration Open" ? "hero" : "outline"} 
                      className="w-full"
                    >
                      {hackathon.status === "Registration Open" ? "Register Now" : "Get Notified"}
                    </Button>
                  </ApplicationDialog>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Competition Tracks */}
      <section className="py-20 bg-muted/5">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">Competition Tracks</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Multiple specialized tracks focusing on India's biggest challenges
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {tracks.map((track, index) => (
              <Card key={index} className="p-8 bg-card-gradient border-border hover:shadow-orange-glow transition-all duration-300">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-primary">{track.name}</h3>
                  <p className="text-muted-foreground">{track.description}</p>
                  <div className="pt-4 border-t border-border">
                    <div className="text-lg font-semibold">{track.prize}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">Frequently Asked Questions</h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="bg-card-gradient border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left">Who can participate in Inc Combinator hackathons?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Anyone with a passion for solving India's problems can participate. We welcome students, working professionals, entrepreneurs, and international participants. Teams of 2-4 members are ideal.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="bg-card-gradient border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left">What happens to winning teams?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Winners get fast-tracked to Inc Combinator's incubation program, receive immediate funding consideration, access to our mentor network, and potential partnerships with industry leaders.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-card-gradient border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left">What support is provided during the hackathon?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  We provide mentorship from industry experts, technical support, cloud credits, APIs access, workspace, meals, and 24/7 assistance during the 48-hour period.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="bg-card-gradient border border-border rounded-lg px-6">
                <AccordionTrigger className="text-left">How are projects evaluated?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Projects are judged on innovation, market potential, technical execution, scalability, and social impact. Our panel includes successful entrepreneurs, VCs, and industry experts.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="text-center pt-16">
            <ApplicationDialog
              type="hackathon"
              title="Register for Next Hackathon"
              description="Join the next hackathon and build the future in 48 hours"
            >
              <Button variant="hero" size="lg" className="text-lg px-8 py-6">
                Register for Next Hackathon
              </Button>
            </ApplicationDialog>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hackathon;
