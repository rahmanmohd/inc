
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Users, Award, Clock, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const BecomeMentor = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    position: "",
    experience: "",
    expertise: "",
    linkedIn: "",
    mentorshipAreas: "",
    availability: "",
    motivation: "",
    previousMentoring: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Application Submitted Successfully!",
      description: "Thank you for your interest in becoming a mentor. We'll review your application and get back to you within 3-5 business days.",
    });
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      position: "",
      experience: "",
      expertise: "",
      linkedIn: "",
      mentorshipAreas: "",
      availability: "",
      motivation: "",
      previousMentoring: ""
    });
  };

  const mentorBenefits = [
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: "Shape the Future",
      description: "Guide the next generation of entrepreneurs and make a lasting impact on innovative startups."
    },
    {
      icon: <Award className="h-6 w-6 text-primary" />,
      title: "Industry Recognition",
      description: "Gain recognition as a thought leader and expand your professional network within the startup ecosystem."
    },
    {
      icon: <Clock className="h-6 w-6 text-primary" />,
      title: "Flexible Commitment",
      description: "Choose your availability and mentor startups that align with your expertise and interests."
    },
    {
      icon: <Heart className="h-6 w-6 text-primary" />,
      title: "Give Back",
      description: "Share your knowledge and experience to help entrepreneurs overcome challenges and achieve success."
    }
  ];

  const mentorshipAreas = [
    "Technology & Engineering", "Product Management", "Business Strategy", "Marketing & Growth",
    "Sales & Business Development", "Finance & Fundraising", "Operations & Scaling", "Legal & Compliance",
    "HR & Team Building", "Design & User Experience", "Data Science & Analytics", "International Expansion"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Breadcrumbs />
      
      <main className="container mx-auto px-4 pb-12">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent mb-4">
            Become a Mentor
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join our network of experienced professionals and help shape the future of entrepreneurship in India.
          </p>
        </section>

        {/* Benefits Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Why Mentor with Inc Combinator?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mentorBenefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-center mb-2">{benefit.icon}</div>
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Application Form */}
        <section className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Mentor Application Form</CardTitle>
              <CardDescription>
                Tell us about yourself and how you'd like to contribute to our startup ecosystem.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name *</label>
                      <Input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email Address *</label>
                      <Input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone Number *</label>
                      <Input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">LinkedIn Profile</label>
                      <Input
                        value={formData.linkedIn}
                        onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
                        placeholder="https://linkedin.com/in/yourname"
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Background */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Professional Background</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Current Company *</label>
                      <Input
                        required
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Company name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Current Position *</label>
                      <Input
                        required
                        value={formData.position}
                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        placeholder="Your job title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Years of Experience *</label>
                      <Select onValueChange={(value) => setFormData({ ...formData, experience: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select experience" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3-5">3-5 years</SelectItem>
                          <SelectItem value="6-10">6-10 years</SelectItem>
                          <SelectItem value="11-15">11-15 years</SelectItem>
                          <SelectItem value="16-20">16-20 years</SelectItem>
                          <SelectItem value="20+">20+ years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Primary Expertise *</label>
                      <Select onValueChange={(value) => setFormData({ ...formData, expertise: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your expertise" />
                        </SelectTrigger>
                        <SelectContent>
                          {mentorshipAreas.map((area) => (
                            <SelectItem key={area} value={area.toLowerCase().replace(/\s+/g, '-')}>
                              {area}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Mentorship Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Mentorship Details</h3>
                  <div>
                    <label className="block text-sm font-medium mb-2">Areas you'd like to mentor in</label>
                    <Textarea
                      value={formData.mentorshipAreas}
                      onChange={(e) => setFormData({ ...formData, mentorshipAreas: e.target.value })}
                      placeholder="Describe the specific areas where you can provide mentorship..."
                      className="min-h-[100px]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Availability *</label>
                    <Select onValueChange={(value) => setFormData({ ...formData, availability: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your availability" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2-4-hours-week">2-4 hours per week</SelectItem>
                        <SelectItem value="4-6-hours-week">4-6 hours per week</SelectItem>
                        <SelectItem value="6-8-hours-week">6-8 hours per week</SelectItem>
                        <SelectItem value="flexible">Flexible schedule</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Why do you want to become a mentor? *</label>
                    <Textarea
                      required
                      value={formData.motivation}
                      onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                      placeholder="Share your motivation for mentoring startups and entrepreneurs..."
                      className="min-h-[120px]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Previous mentoring experience</label>
                    <Textarea
                      value={formData.previousMentoring}
                      onChange={(e) => setFormData({ ...formData, previousMentoring: e.target.value })}
                      placeholder="Describe any previous mentoring or advisory experience you have..."
                      className="min-h-[100px]"
                    />
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-primary to-orange-400 hover:shadow-orange-glow">
                  Submit Application
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>

        {/* Process Section */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Our Selection Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Application", description: "Submit your mentor application form" },
              { step: "2", title: "Review", description: "Our team reviews your background and expertise" },
              { step: "3", title: "Interview", description: "Brief conversation about your mentoring goals" },
              { step: "4", title: "Onboarding", description: "Welcome to the Inc Combinator mentor network" }
            ].map((item, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-2">
                    {item.step}
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default BecomeMentor;
