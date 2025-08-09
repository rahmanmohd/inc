
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Users, MessageSquare, CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

const consultationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  company: z.string().min(2, "Company name is required"),
  stage: z.string().min(1, "Please select your startup stage"),
  consultationType: z.string().min(1, "Please select consultation type"),
  preferredDate: z.string().min(1, "Please select a preferred date"),
  preferredTime: z.string().min(1, "Please select a preferred time"),
  description: z.string().min(10, "Please provide more details about your consultation needs"),
});

const ConsultationBooking = () => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof consultationSchema>>({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      stage: "",
      consultationType: "",
      preferredDate: "",
      preferredTime: "",
      description: "",
    },
  });

  const onSubmit = (values: z.infer<typeof consultationSchema>) => {
    console.log("Consultation booking:", values);
    toast({
      title: "Consultation Booked!",
      description: "We'll contact you within 24 hours to confirm your consultation.",
    });
    form.reset();
  };

  const consultationTypes = [
    { value: "startup-evaluation", label: "Startup Evaluation" },
    { value: "business-model", label: "Business Model Review" },
    { value: "funding-strategy", label: "Funding Strategy" },
    { value: "product-development", label: "Product Development" },
    { value: "market-validation", label: "Market Validation" },
    { value: "scaling-strategy", label: "Scaling Strategy" },
    { value: "general", label: "General Consultation" },
  ];

  const startupStages = [
    { value: "idea", label: "Idea Stage" },
    { value: "mvp", label: "MVP Development" },
    { value: "early-traction", label: "Early Traction" },
    { value: "growth", label: "Growth Stage" },
    { value: "scaling", label: "Scaling" },
  ];

  const benefits = [
    { icon: Users, title: "Expert Guidance", description: "Get advice from experienced entrepreneurs and investors" },
    { icon: MessageSquare, title: "Personalized Consultation", description: "1-on-1 sessions tailored to your specific needs" },
    { icon: CheckCircle, title: "Actionable Insights", description: "Receive concrete steps to move your startup forward" },
    { icon: Calendar, title: "Flexible Scheduling", description: "Choose a time that works best for you" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-20 pb-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Schedule Your{" "}
            <span className="bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
              Consultation
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get personalized guidance from our experts to accelerate your startup journey. 
            Book a free consultation to discuss your challenges and opportunities.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <Card key={index} className="bg-card-gradient border-border text-center">
              <CardContent className="pt-6">
                <benefit.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Booking Form */}
          <Card className="bg-card-gradient border-border">
            <CardHeader>
              <CardTitle className="text-2xl">Book Your Consultation</CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you within 24 hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+91 9876543210" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your Startup" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="stage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Startup Stage</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select stage" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {startupStages.map((stage) => (
                                <SelectItem key={stage.value} value={stage.value}>
                                  {stage.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="consultationType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Consultation Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {consultationTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="preferredDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="preferredTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Time</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select time" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="09:00">9:00 AM</SelectItem>
                              <SelectItem value="10:00">10:00 AM</SelectItem>
                              <SelectItem value="11:00">11:00 AM</SelectItem>
                              <SelectItem value="14:00">2:00 PM</SelectItem>
                              <SelectItem value="15:00">3:00 PM</SelectItem>
                              <SelectItem value="16:00">4:00 PM</SelectItem>
                              <SelectItem value="17:00">5:00 PM</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tell us about your needs</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your startup, challenges, and what you hope to achieve from this consultation..."
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full bg-gradient-to-r from-primary to-orange-400">
                    Schedule Consultation
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Consultation Info */}
          <div className="space-y-6">
            <Card className="bg-card-gradient border-border">
              <CardHeader>
                <CardTitle>What to Expect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-medium">60-Minute Session</h4>
                    <p className="text-sm text-muted-foreground">
                      Comprehensive discussion about your startup and goals
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-medium">Expert Mentors</h4>
                    <p className="text-sm text-muted-foreground">
                      Meet with experienced entrepreneurs and industry experts
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-medium">Action Plan</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive a detailed action plan with next steps
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card-gradient border-border">
              <CardHeader>
                <CardTitle>Available Time Slots</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Monday - Friday</span>
                    <Badge variant="secondary">9:00 AM - 6:00 PM</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Saturday</span>
                    <Badge variant="secondary">10:00 AM - 4:00 PM</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Sunday</span>
                    <Badge variant="outline">Closed</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ConsultationBooking;
