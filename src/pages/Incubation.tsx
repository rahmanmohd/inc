import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Rocket, Lightbulb, Users, FileCode2, Handshake, Award } from "lucide-react";
import ApplicationDialog from "@/components/ApplicationDialog";
import ConsultationDialog from "@/components/ConsultationDialog";
import { useNavigate } from "react-router-dom";

const Incubation = () => {
  const navigate = useNavigate();

  const benefits = [
    { icon: Rocket, title: "Rapid Prototyping", description: "Build and test your MVP in weeks, not months." },
    { icon: Lightbulb, title: "Expert Mentorship", description: "Guidance from industry leaders and experienced entrepreneurs." },
    { icon: Users, title: "Extensive Network", description: "Connect with investors, partners, and potential customers." },
    { icon: FileCode2, title: "Technical Resources", description: "Access to cutting-edge tools, technologies, and infrastructure." },
    { icon: Handshake, title: "Strategic Partnerships", description: "Collaborate with leading corporations and organizations." },
    { icon: Award, title: "Funding Opportunities", description: "Access to seed funding, grants, and investor networks." }
  ];

  const timeline = [
    { week: "Week 1-4", activity: "Ideation & Validation", description: "Refine your idea, validate market demand, and define your target audience." },
    { week: "Week 5-8", activity: "MVP Development", description: "Build a functional prototype with expert technical support and resources." },
    { week: "Week 9-12", activity: "Customer Acquisition", description: "Develop a go-to-market strategy and acquire your first paying customers." },
    { week: "Week 13-16", activity: "Investor Pitching", description: "Prepare your pitch deck and present your startup to potential investors." }
  ];

  const faq = [
    { question: "What types of startups are eligible for the Incubation Program?", answer: "We welcome startups from all industries and sectors, with a focus on innovative and scalable solutions." },
    { question: "What is the duration of the Incubation Program?", answer: "The Incubation Program is a 16-week intensive program designed to accelerate your startup's growth." },
    { question: "What kind of support and resources are provided during the program?", answer: "You'll receive mentorship, technical resources, networking opportunities, and access to funding." },
    { question: "How do I apply for the Incubation Program?", answer: "Visit our website and fill out the application form. Our team will review your application and contact you for an interview." }
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
                🚀 Incubation Program
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                Transform Your{" "}
                <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
                  Startup Idea
                </span>{" "}
                into a Thriving Business
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                Our 16-week incubation program provides the mentorship, resources, and network you need to launch and scale your startup.
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 justify-center pt-6">
              <ApplicationDialog>
                <Button variant="hero" size="lg" className="text-lg px-8 py-6">
                  Apply Now
                </Button>
              </ApplicationDialog>
              <ConsultationDialog>
                <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                  Schedule Consultation
                </Button>
              </ConsultationDialog>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">Key Benefits</h2>
            <p className="text-xl text-muted-foreground">
              What you'll gain from our comprehensive incubation program
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="bg-card-gradient border-border hover:shadow-orange-glow transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <benefit.icon className="w-6 h-6 text-primary" />
                    <CardTitle className="text-lg font-bold">{benefit.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">
                    {benefit.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-muted/5">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">Program Timeline</h2>
            <p className="text-xl text-muted-foreground">
              A structured path to startup success
            </p>
          </div>

          <div className="space-y-8">
            {timeline.map((step, index) => (
              <Card key={index} className="bg-background border-border p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-1 font-bold text-primary text-lg">{step.week}</div>
                  <div className="md:col-span-3 space-y-2">
                    <h3 className="text-xl font-semibold">{step.activity}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">Success Stories</h2>
            <p className="text-xl text-muted-foreground">
              Meet the entrepreneurs who transformed their ideas into successful businesses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-card-gradient border-border hover:shadow-orange-glow transition-all duration-300">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold">HT</span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">HealthTech Innovations</CardTitle>
                    <CardDescription>AI-powered healthcare</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Revolutionizing healthcare accessibility in rural India through AI.</p>
                <div className="flex justify-between text-sm">
                  <span className="text-primary font-medium">₹15Cr Funding</span>
                  <span className="text-muted-foreground">2023</span>
                </div>
                <Button variant="outline" size="sm" className="w-full">Learn More</Button>
              </CardContent>
            </Card>

            <Card className="bg-card-gradient border-border hover:shadow-orange-glow transition-all duration-300">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold">EF</span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">EduLearn Platform</CardTitle>
                    <CardDescription>Personalized learning</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Personalized learning platform for K-12 students.</p>
                <div className="flex justify-between text-sm">
                  <span className="text-primary font-medium">₹8Cr Funding</span>
                  <span className="text-muted-foreground">2022</span>
                </div>
                <Button variant="outline" size="sm" className="w-full">Learn More</Button>
              </CardContent>
            </Card>

            <Card className="bg-card-gradient border-border hover:shadow-orange-glow transition-all duration-300">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold">GT</span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">GreenTech Solutions</CardTitle>
                    <CardDescription>Solar energy management</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">Solar energy management system for residential complexes.</p>
                <div className="flex justify-between text-sm">
                  <span className="text-primary font-medium">₹25Cr Funding</span>
                  <span className="text-muted-foreground">2023</span>
                </div>
                <Button variant="outline" size="sm" className="w-full">Learn More</Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/current-cohort')}
            >
              Program Details
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-muted/5">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about the Incubation Program
            </p>
          </div>

          <div className="space-y-6">
            {faq.map((item, index) => (
              <Card key={index} className="bg-background border-border p-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">{item.question}</h3>
                  <p className="text-muted-foreground">{item.answer}</p>
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
                Ready to Take Your{" "}
                <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
                  Startup to the Next Level?
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Join our Incubation Program and gain the tools, resources, and network you need to succeed.
              </p>
              <div className="flex flex-col md:flex-row gap-4 justify-center pt-6">
                <ApplicationDialog>
                  <Button variant="hero" size="lg" className="text-lg px-8 py-6">
                    Apply Now
                  </Button>
                </ApplicationDialog>
                <ConsultationDialog>
                  <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                    Schedule a Consultation
                  </Button>
                </ConsultationDialog>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Incubation;
