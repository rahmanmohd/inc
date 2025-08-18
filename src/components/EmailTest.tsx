import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import emailService from "@/services/emailService";

const EmailTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const testEmail = async () => {
    setIsLoading(true);
    try {
      console.log('Testing email service...');
      
      const response = await emailService.sendIncubationApplicationEmail(
        'test@example.com',
        'Test User',
        {
          founderName: 'Test User',
          startupName: 'Test Startup',
          email: 'test@example.com',
          stage: 'Idea Stage',
          industry: 'Technology'
        }
      );

      console.log('Email test response:', response);

      if (response.success) {
        toast({
          title: "Email Test Successful! ✅",
          description: "Test email sent successfully. Check the console for details.",
        });
      } else {
        toast({
          title: "Email Test Failed! ❌",
          description: `Error: ${response.error}`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Email test error:', error);
      toast({
        title: "Email Test Error! ❌",
        description: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Email Service Test</CardTitle>
        <CardDescription>
          Test the email functionality to verify it's working properly
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={testEmail} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Testing..." : "Test Email Service"}
        </Button>
        <p className="text-sm text-muted-foreground mt-2">
          This will send a test incubation application email to test@example.com
        </p>
      </CardContent>
    </Card>
  );
};

export default EmailTest;
