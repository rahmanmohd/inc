import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import emailService from "@/services/emailService";
import { Loader2 } from "lucide-react";

export default function EmailTest() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleTestEmail = async () => {
    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter an email address to test.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log("Testing email service...");
      
      const response = await emailService.sendPartnershipRequestEmail(
        email,
        "Test User",
        {
          companyName: "Test Company",
          industry: "Technology",
          contactName: "Test User",
          email: email,
          phone: "+1234567890",
          partnershipType: "Strategic Partnership",
          companyDetails: "This is a test company for email testing.",
          partnershipGoals: "To test the email functionality.",
          timeline: "Q1 2024"
        }
      );

      console.log("Email test response:", response);

      if (response.success) {
        toast({
          title: "Email Test Sent! 📧",
          description: `Test email sent to ${email}. Check your inbox and spam folder.`,
        });
      } else {
        toast({
          title: "Email Test Failed",
          description: `Error: ${response.error || 'Unknown error'}`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Email test error:", error);
      toast({
        title: "Email Test Failed",
        description: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Email Service Test</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="testEmail">Test Email Address</Label>
          <Input
            id="testEmail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email to test"
          />
        </div>
        <Button 
          onClick={handleTestEmail} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending Test Email...
            </>
          ) : (
            "Send Test Email"
          )}
        </Button>
      </div>
      <p className="text-sm text-gray-600 mt-4">
        This will send a test partnership request email to verify the email service is working.
      </p>
    </div>
  );
}
