
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { ReactNode, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useAuthUI } from "@/context/AuthUIContext";
import apiService from "@/services/apiService";
import emailService from "@/services/emailService";

const consultationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  company: z.string().min(2, "Company name is required"),
  consultationType: z.string().min(1, "Please select consultation type"),
  message: z.string().min(10, "Please provide more details"),
});

interface ConsultationDialogProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

const ConsultationDialog = ({ children, title = "Schedule Consultation", description = "Book a consultation with our experts" }: ConsultationDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const { openLogin } = useAuthUI();
  
  const form = useForm<z.infer<typeof consultationSchema>>({
    resolver: zodResolver(consultationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      consultationType: "",
      message: "",
    },
  });

  const consultationTypes = [
    { value: "startup-evaluation", label: "Startup Evaluation" },
    { value: "business-model", label: "Business Model Review" },
    { value: "funding-strategy", label: "Funding Strategy" },
    { value: "product-development", label: "Product Development" },
    { value: "market-validation", label: "Market Validation" },
    { value: "general", label: "General Consultation" },
  ];

  const handleOpenChange = (next: boolean) => {
    if (next && !isAuthenticated) {
      openLogin();
      return;
    }
    setIsOpen(next);
  };

  const onSubmit = async (values: z.infer<typeof consultationSchema>) => {
    // Check authentication first
    if (!isAuthenticated || !user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please log in to schedule a consultation",
        variant: "destructive"
      });
      openLogin();
      return;
    }

    setIsLoading(true);

    try {
      // Ensure user profile exists
      const profileResponse = await apiService.ensureUserProfile(user.id, values.email);
      if (!profileResponse.success) {
        throw new Error('Failed to create user profile. Please try again.');
      }

      // Prepare consultation data for Supabase
      const consultationData = {
        user_id: user.id,
        name: values.name,
        email: values.email,
        phone: values.phone,
        company: values.company,
        consultation_type: values.consultationType,
        description: values.message, // Map to description field
        message: values.message,
        status: 'pending'
      };

      // Submit consultation using API service
      const response = await apiService.submitConsultation(consultationData);

      if (response.success) {
        // Send confirmation email
        const emailResponse = await emailService.sendConsultationRequestEmail(
          values.email,
          values.name,
          values
        );

        if (emailResponse.success) {
          toast({
            title: "Consultation Scheduled Successfully! 🚀",
            description: "Your consultation request has been submitted and confirmation email sent. You can schedule additional consultations anytime. We'll contact you within 24 hours to confirm your consultation.",
          });
        } else {
          toast({
            title: "Consultation Scheduled Successfully! 🚀",
            description: "Your consultation request has been submitted. You can schedule additional consultations anytime. We'll contact you within 24 hours to confirm your consultation.",
          });
        }
        form.reset();
        setIsOpen(false);
      } else {
        toast({
          title: "Submission Failed",
          description: response.message || "Failed to schedule consultation. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Consultation submission error:', error);
      toast({
        title: "Submission Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
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
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Company" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="consultationType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Consultation Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select consultation type" />
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

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tell us about your startup and what you'd like to discuss..."
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Scheduling..." : "Schedule Consultation"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ConsultationDialog;
