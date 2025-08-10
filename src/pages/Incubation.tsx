import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle, Clock, FileText, GraduationCap, Lightbulb, Rocket, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Link } from "react-router-dom";

const Incubation = () => {
  const { toast } = useToast();
  const [applicationOpen, setApplicationOpen] = useState(false);
  const [consultationOpen, setConsultationOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    startupName: "",
    stage: "",
    sector: "",
    description: "",
    teamSize: "",
    problem: "",
    solution: "",
    whyUs: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Application Submitted Successfully!",
      description: "Thank you for your interest in our Incubation Program. We'll review your application and get back to you within 3-5 business days.",
    });
    setApplicationOpen(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      startupName: "",
      stage: "",
      sector: "",
      description: "",
      teamSize: "",
      problem: "",
      solution: "",
      whyUs: "",
    });
  };

  const programHighlights = [
    {
      icon: <Lightbulb className="h-6 w-6 text-primary" />,
      title: "Mentorship",
      description: "Access to industry experts and seasoned entrepreneurs who provide guidance and support."
    },
    {
      icon: <GraduationCap className="h-6 w-6 text-primary" />,
      title: "Workshops",
      description: "Interactive sessions and training programs to enhance your skills and knowledge."
    },
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: "Networking",
      description: "Opportunities to connect with investors, partners, and fellow startups."
    },
    {
      icon: <Rocket className="h-6 w-6 text-primary" />,
      title: "Resources",
      description: "Access to funding, office space, and other resources to help you grow your business."
    }
  ];

  const applicationRequirements = [
    "Innovative idea with a clear problem-solution fit",
    "Scalable business model with high growth potential",
    "Dedicated and passionate founding team",
    "Commitment to building a sustainable business",
    "Alignment with Inc Combinator's values and mission"
  ];

  const IncubationApplicationForm = ({ children }: { children: React.ReactNode }) => (
    <Dialog open={applicationOpen} onOpenChange={setApplicationOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Incubation Program Application</DialogTitle>
          <DialogDescription>
            Apply to our 6-month incubation program and transform your idea into a thriving business.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Your Name
            </Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Phone Number
            </Label>
            <Input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="startupName" className="text-right">
              Startup Name
            </Label>
            <Input
              type="text"
              id="startupName"
              name="startupName"
              value={formData.startupName}
              onChange={handleInputChange}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="stage" className="text-right">
              Current Stage
            </Label>
            <Input
              type="text"
              id="stage"
              name="stage"
              value={formData.stage}
              onChange={handleInputChange}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="sector" className="text-right">
              Industry Sector
            </Label>
            <Input
              type="text"
              id="sector"
              name="sector"
              value={formData.sector}
              onChange={handleInputChange}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="teamSize" className="text-right">
              Team Size
            </Label>
            <Input
              type="number"
              id="teamSize"
              name="teamSize"
              value={formData.teamSize}
              onChange={handleInputChange}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right mt-2">
              Startup Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="problem" className="text-right mt-2">
              Problem You're Solving
            </Label>
            <Textarea
              id="problem"
              name="problem"
              value={formData.problem}
              onChange={handleInputChange}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="solution" className="text-right mt-2">
              Your Solution
            </Label>
            <Textarea
              id="solution"
              name="solution"
              value={formData.solution}
              onChange={handleInputChange}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="whyUs" className="text-right mt-2">
              Why Inc Combinator?
            </Label>
            <Textarea
              id="whyUs"
              name="whyUs"
              value={formData.whyUs}
              onChange={handleInputChange}
              className="col-span-3"
              required
            />
          </div>
          <Button type="submit">Submit Application</Button>
        </form>
      </DialogContent>
    </Dialog>
  );

  const ConsultationDialog = ({ children }: { children: React.ReactNode }) => (
    <Dialog open={consultationOpen} onOpenChange={setConsultationOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule a Consultation</DialogTitle>
          <DialogDescription>
            Book a free consultation with our team to discuss your startup idea and learn how Inc Combinator can help.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p>
            To schedule a consultation, please contact us at{" "}
            <a href="mailto:consultations@inccombinator.com" className="text-primary">
              consultations@inccombinator.com
            </a>{" "}
            or call us at <a href="tel:+919876543210" className="text-primary">+91 98765 43210</a>.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Breadcrumbs />
      
      <main className="container mx-auto px-4 pb-12">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent mb-4">
            Incubation Program
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Transform your innovative idea into a thriving business with our comprehensive 6-month incubation program.
          </p>
          <div className="flex justify-center space-x-4">
            <IncubationApplicationForm>
              <Button size="lg" className="bg-gradient-to-r from-primary to-orange-400 hover:shadow-orange-glow">
                Apply Now
              </Button>
            </IncubationApplicationForm>
            <Link to="/program-details">
              <Button variant="outline" size="lg">
                Program Details
              </Button>
            </Link>
            <ConsultationDialog>
              <Button variant="outline" size="lg">
                Schedule Consultation
              </Button>
            </ConsultationDialog>
          </div>
        </section>

        {/* Program Highlights */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Program Highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {programHighlights.map((highlight, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-center mb-2">{highlight.icon}</div>
                  <CardTitle className="text-lg">{highlight.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{highlight.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Application Requirements */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Application Requirements</h2>
          <div className="max-w-3xl mx-auto">
            <ul className="list-disc list-inside text-lg text-muted-foreground space-y-3">
              {applicationRequirements.map((requirement, index) => (
                <li key={index}>{requirement}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* Success Stories */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Success Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                id: 1,
                startup: "HealthTech Solutions",
                description: "AI-powered diagnostic platform serving 50,000+ patients across rural India",
                logo: "🏥",
                link: "/success-stories"
              },
              {
                id: 2,
                startup: "EduLearn Platform",
                description: "Personalized learning platform using AI to improve K-12 education outcomes",
                logo: "📚",
                link: "/success-stories"
              },
              {
                id: 3,
                startup: "GreenTech Innovations",
                description: "Renewable energy solutions for residential and commercial properties",
                logo: "🌱",
                link: "/success-stories"
              }
            ].map((story) => (
              <Card key={story.id} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">{story.logo}</div>
                    <div>
                      <CardTitle className="text-xl">{story.startup}</CardTitle>
                      <CardDescription className="text-muted-foreground">{story.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Link to={story.link}>
                    <Button variant="secondary" className="w-full">
                      Learn More
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Program Timeline</h2>
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute top-4 left-1/2 h-[calc(100% - 2rem)] w-[2px] bg-muted"></div>
            <div className="space-y-8">
              {[
                {
                  date: "Month 1",
                  title: "Orientation & Kickoff",
                  description: "Welcome to the program! Get to know your mentors, fellow startups, and the Inc Combinator team.",
                  icon: <Calendar className="h-5 w-5 text-primary" />
                },
                {
                  date: "Month 2-3",
                  title: "Workshops & Training",
                  description: "Attend workshops and training sessions on topics such as business strategy, marketing, and fundraising.",
                  icon: <FileText className="h-5 w-5 text-primary" />
                },
                {
                  date: "Month 4-5",
                  title: "Mentorship & Guidance",
                  description: "Receive personalized mentorship and guidance from industry experts and seasoned entrepreneurs.",
                  icon: <Lightbulb className="h-5 w-5 text-primary" />
                },
                {
                  date: "Month 6",
                  title: "Demo Day & Graduation",
                  description: "Showcase your startup to investors, partners, and the Inc Combinator community.",
                  icon: <CheckCircle className="h-5 w-5 text-primary" />
                }
              ].map((item, index) => (
                <div key={index} className="flex items-start">
                  <div className="mr-4 shrink-0">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      {item.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{item.date}</h3>
                    <h4 className="text-lg font-medium">{item.title}</h4>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-16 bg-gradient-to-r from-primary/10 to-orange-400/10 rounded-3xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Idea?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join Inc Combinator's Incubation Program and turn your innovative idea into a thriving business.
          </p>
          <div className="flex justify-center space-x-4">
            <IncubationApplicationForm>
              <Button size="lg" className="bg-gradient-to-r from-primary to-orange-400 hover:shadow-orange-glow">
                Apply Now
              </Button>
            </IncubationApplicationForm>
            <Link to="/program-details">
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Incubation;
