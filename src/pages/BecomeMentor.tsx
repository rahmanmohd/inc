
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Users, Target, Award, Calendar, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useAuthUI } from "@/context/AuthUIContext";
import apiService from "@/services/apiService";
import emailService from "@/services/emailService";

const BecomeMentor = () => {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const { openLogin } = useAuthUI();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    currentPosition: "",
    company: "",
    yearsOfExperience: "",
    areaOfExpertise: "",
    linkedinProfile: "",
    whyMentor: "",
    industryExperience: "",
    timeCommitment: ""
  });

  const mentorBenefits = [
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: "Impact Next Generation",
      description: "Guide and shape the future of entrepreneurship by mentoring promising startups"
    },
    {
      icon: <Target className="h-6 w-6 text-primary" />,
      title: "Strategic Network",
      description: "Connect with like-minded professionals and expand your business network"
    },
    {
      icon: <Award className="h-6 w-6 text-primary" />,
      title: "Recognition",
      description: "Get recognized as a thought leader in your industry and domain expertise"
    },
    {
      icon: <Calendar className="h-6 w-6 text-primary" />,
      title: "Flexible Schedule",
      description: "Mentor on your own schedule with flexible time commitment options"
    }
  ];

  const expertiseAreas = [
    "Technology & Engineering",
    "Product Management",
    "Marketing & Sales",
    "Finance & Fundraising",
    "Operations & Strategy",
    "Human Resources",
    "Legal & Compliance",
    "Design & User Experience",
    "Business Development",
    "Industry Specific Knowledge"
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      openLogin();
      return;
    }

    // Check authentication first
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit your application",
        variant: "destructive"
      });
      openLogin();
      return;
    }
    
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'currentPosition', 'company', 'yearsOfExperience', 'areaOfExpertise', 'linkedinProfile', 'whyMentor'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: `Please fill in all required fields: ${missingFields.join(', ')}`,
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Ensure user profile exists
      const profileResponse = await apiService.ensureUserProfile(user.id, formData.email);
      if (!profileResponse.success) {
        throw new Error('Failed to create user profile. Please try again.');
      }

      // Prepare application data for Supabase
      const applicationData = {
        user_id: user.id,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        position: formData.currentPosition,
        current_position: formData.currentPosition,
        company: formData.company,
        years_experience: formData.yearsOfExperience,
        years_of_experience: formData.yearsOfExperience,
        area_of_expertise: formData.areaOfExpertise,
        linkedin: formData.linkedinProfile,
        linkedin_profile: formData.linkedinProfile,
        motivation: formData.whyMentor,
        why_mentor: formData.whyMentor,
        industry_experience: formData.industryExperience || null,
        time_commitment: formData.timeCommitment || null,
        status: 'pending'
      };

      // Submit application using API service
      const response = await apiService.submitMentorApplication(applicationData);

      if (response.success) {
        // Send confirmation email
        const emailResponse = await emailService.sendMentorApplicationEmail(
          formData.email,
          `${formData.firstName} ${formData.lastName}`,
          formData
        );

        if (emailResponse.success) {
          toast({
            title: "Application Submitted Successfully! 🚀",
            description: "Thank you for your interest in becoming a mentor. Your application has been submitted and confirmation email sent. You can submit additional applications anytime. We'll review and get back to you within 5 business days.",
          });
        } else {
          toast({
            title: "Application Submitted Successfully! 🚀",
            description: "Thank you for your interest in becoming a mentor. Your application has been submitted. You can submit additional applications anytime. We'll review and get back to you within 5 business days.",
          });
        }
        
        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          currentPosition: "",
          company: "",
          yearsOfExperience: "",
          areaOfExpertise: "",
          linkedinProfile: "",
          whyMentor: "",
          industryExperience: "",
          timeCommitment: ""
        });
      } else {
        toast({
          title: "Submission Failed",
          description: response.message || "Failed to submit application. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Mentor application error:', error);
      toast({
        title: "Submission Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-20 pb-12">
        <Breadcrumbs />
        
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent mb-6">
            Become a Mentor
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Share your expertise and help shape the next generation of entrepreneurs. 
            Join our mentor network and make a lasting impact on innovative startups.
          </p>
          <div className="flex justify-center space-x-4">
            <Badge variant="secondary" className="bg-primary/10 text-primary text-lg px-4 py-2">
              🎯 Make an Impact
            </Badge>
            <Badge variant="secondary" className="bg-primary/10 text-primary text-lg px-4 py-2">
              🚀 Shape the Future
            </Badge>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Benefits Section */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-6">Why Become a Mentor?</h2>
              <div className="space-y-6">
                {mentorBenefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                      <p className="text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <Card className="bg-card-gradient border-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>Mentor Requirements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Minimum 5+ years of professional experience</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Proven track record in your domain</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Strong communication and leadership skills</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Commitment to helping entrepreneurs succeed</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>Availability for regular mentoring sessions</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Testimonials */}
            <Card className="bg-card-gradient border-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <span>What Our Mentors Say</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-background rounded-lg">
                    <p className="text-sm italic mb-2">
                      "Mentoring startups has been incredibly rewarding. Seeing young entrepreneurs 
                      turn their ideas into successful businesses gives me immense satisfaction."
                    </p>
                    <p className="text-xs text-muted-foreground">- Rajesh Kumar, Former CTO at TechCorp</p>
                  </div>
                  <div className="p-4 bg-background rounded-lg">
                    <p className="text-sm italic mb-2">
                      "The mentor network here is exceptional. I've not only helped startups but 
                      also learned so much from fellow mentors and entrepreneurs."
                    </p>
                    <p className="text-xs text-muted-foreground">- Dr. Priya Sharma, Healthcare Industry Expert</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Application Form */}
          <div>
            <Card className="bg-card-gradient border-border">
              <CardHeader>
                <CardTitle>Mentor Application</CardTitle>
                <CardDescription>Join our mentor network and start making an impact</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">First Name*</label>
                      <Input 
                        placeholder="Enter your first name" 
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        required 
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Last Name*</label>
                      <Input 
                        placeholder="Enter your last name" 
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        required 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Email*</label>
                    <Input 
                      type="email" 
                      placeholder="your.email@company.com" 
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required 
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Phone*</label>
                    <Input 
                      type="tel" 
                      placeholder="+91 9876543210" 
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      required 
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Current Position*</label>
                    <Input 
                      placeholder="e.g., VP Engineering at TechCorp" 
                      value={formData.currentPosition}
                      onChange={(e) => handleInputChange("currentPosition", e.target.value)}
                      required 
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Company*</label>
                    <Input 
                      placeholder="Your current company" 
                      value={formData.company}
                      onChange={(e) => handleInputChange("company", e.target.value)}
                      required 
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Years of Experience*</label>
                    <Select value={formData.yearsOfExperience} onValueChange={(value) => handleInputChange("yearsOfExperience", value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5-10">5-10 years</SelectItem>
                        <SelectItem value="10-15">10-15 years</SelectItem>
                        <SelectItem value="15-20">15-20 years</SelectItem>
                        <SelectItem value="20+">20+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Area of Expertise*</label>
                    <Select value={formData.areaOfExpertise} onValueChange={(value) => handleInputChange("areaOfExpertise", value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your primary expertise" />
                      </SelectTrigger>
                      <SelectContent>
                        {expertiseAreas.map((area) => (
                          <SelectItem key={area} value={area.toLowerCase().replace(/\s+/g, '-')}>
                            {area}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">LinkedIn Profile*</label>
                    <Input 
                      placeholder="https://linkedin.com/in/yourprofile" 
                      value={formData.linkedinProfile}
                      onChange={(e) => handleInputChange("linkedinProfile", e.target.value)}
                      required 
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Why do you want to become a mentor?*</label>
                    <Textarea 
                      placeholder="Tell us about your motivation to mentor startups..." 
                      className="min-h-[100px]"
                      value={formData.whyMentor}
                      onChange={(e) => handleInputChange("whyMentor", e.target.value)}
                      required 
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Industry Experience</label>
                    <Textarea 
                      placeholder="Describe your industry experience and notable achievements..." 
                      className="min-h-[100px]"
                      value={formData.industryExperience}
                      onChange={(e) => handleInputChange("industryExperience", e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Time Commitment</label>
                    <Select value={formData.timeCommitment} onValueChange={(value) => handleInputChange("timeCommitment", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="How much time can you commit monthly?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2-4">2-4 hours per month</SelectItem>
                        <SelectItem value="4-8">4-8 hours per month</SelectItem>
                        <SelectItem value="8-12">8-12 hours per month</SelectItem>
                        <SelectItem value="12+">12+ hours per month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-primary to-orange-400 hover:shadow-orange-glow"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Next Steps */}
        <section className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-primary/10 to-orange-400/10 border-border">
            <CardHeader>
              <CardTitle>What Happens Next?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-bold">
                    1
                  </div>
                  <h3 className="font-semibold">Application Review</h3>
                  <p className="text-sm text-muted-foreground">We review your application within 5 business days</p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-bold">
                    2
                  </div>
                  <h3 className="font-semibold">Interview Process</h3>
                  <p className="text-sm text-muted-foreground">A brief interview to understand your expertise and goals</p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto font-bold">
                    3
                  </div>
                  <h3 className="font-semibold">Onboarding</h3>
                  <p className="text-sm text-muted-foreground">Welcome to the mentor network and startup matching</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BecomeMentor;
