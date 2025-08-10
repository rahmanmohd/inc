
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, Users, Star, TrendingUp, Clock, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const BecomeMentor = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    expertise: "",
    experience: "",
    company: "",
    linkedin: "",
    motivation: "",
    availability: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Application Submitted",
      description: "Thank you for your interest in becoming a mentor. We'll review your application and get back to you soon.",
    });
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      expertise: "",
      experience: "",
      company: "",
      linkedin: "",
      motivation: "",
      availability: ""
    });
  };

  const benefits = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "Impact Lives",
      description: "Guide the next generation of entrepreneurs and help them build successful startups"
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: "Build Your Network",
      description: "Connect with like-minded professionals and expand your industry network"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Stay Updated",
      description: "Keep up with the latest trends and innovations in the startup ecosystem"
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Recognition",
      description: "Get recognized as a thought leader and expert in your field"
    }
  ];

  const responsibilities = [
    "Provide guidance on business strategy and growth",
    "Share industry insights and best practices",
    "Help startups navigate challenges and obstacles",
    "Assist with fundraising and investor relations",
    "Offer technical expertise and product development guidance",
    "Support founders with networking and partnership opportunities"
  ];

  const requirements = [
    "5+ years of industry experience",
    "Leadership or entrepreneurial background",
    "Strong communication and mentoring skills",
    "Commitment to regular mentoring sessions",
    "Passion for helping early-stage startups",
    "Domain expertise in relevant areas"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-20 pb-12">
        {/* Header */}
        <section className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent mb-4">
            Become a Mentor
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Share your expertise and help shape the future of entrepreneurship. Join our community of experienced mentors guiding the next generation of startup founders.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">100+</div>
              <p className="text-sm text-muted-foreground">Active Mentors</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <p className="text-sm text-muted-foreground">Startups Mentored</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">₹50Cr+</div>
              <p className="text-sm text-muted-foreground">Funding Facilitated</p>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Benefits & Requirements */}
          <div className="space-y-8">
            {/* Benefits */}
            <Card className="bg-card-gradient border-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-primary" />
                  <span>Why Become a Mentor?</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <div className="text-primary mt-1">{benefit.icon}</div>
                      <div>
                        <h4 className="font-semibold mb-1">{benefit.title}</h4>
                        <p className="text-sm text-muted-foreground">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Responsibilities */}
            <Card className="bg-card-gradient border-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span>Mentor Responsibilities</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {responsibilities.map((responsibility, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                      <span className="text-sm">{responsibility}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card className="bg-card-gradient border-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-primary" />
                  <span>Requirements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {requirements.map((requirement, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                      <span className="text-sm">{requirement}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Application Form */}
          <Card className="bg-card-gradient border-border">
            <CardHeader>
              <CardTitle>Mentor Application</CardTitle>
              <CardDescription>
                Fill out this form to apply as a mentor and start making an impact.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Full Name</label>
                    <Input
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email</label>
                    <Input
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Phone</label>
                    <Input
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Current Company</label>
                    <Input
                      placeholder="Your current company"
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Area of Expertise</label>
                    <Select value={formData.expertise} onValueChange={(value) => setFormData({...formData, expertise: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your expertise" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology & Product</SelectItem>
                        <SelectItem value="business">Business Strategy</SelectItem>
                        <SelectItem value="marketing">Marketing & Growth</SelectItem>
                        <SelectItem value="finance">Finance & Fundraising</SelectItem>
                        <SelectItem value="operations">Operations & Scaling</SelectItem>
                        <SelectItem value="design">Design & UX</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Years of Experience</label>
                    <Select value={formData.experience} onValueChange={(value) => setFormData({...formData, experience: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5-10">5-10 years</SelectItem>
                        <SelectItem value="10-15">10-15 years</SelectItem>
                        <SelectItem value="15-20">15-20 years</SelectItem>
                        <SelectItem value="20+">20+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">LinkedIn Profile</label>
                  <Input
                    placeholder="https://linkedin.com/in/yourprofile"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Availability</label>
                  <Select value={formData.availability} onValueChange={(value) => setFormData({...formData, availability: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2-4 hours/week">2-4 hours per week</SelectItem>
                      <SelectItem value="4-6 hours/week">4-6 hours per week</SelectItem>
                      <SelectItem value="6-8 hours/week">6-8 hours per week</SelectItem>
                      <SelectItem value="flexible">Flexible schedule</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Why do you want to become a mentor?</label>
                  <Textarea
                    placeholder="Share your motivation and what you hope to contribute..."
                    value={formData.motivation}
                    onChange={(e) => setFormData({...formData, motivation: e.target.value})}
                    className="min-h-[100px]"
                    required
                  />
                </div>

                <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-primary to-orange-400 hover:shadow-orange-glow">
                  Submit Application
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BecomeMentor;
