import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import apiService from "@/services/apiService";

const HackathonTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const testRegistration = async () => {
    setIsLoading(true);
    try {
      console.log('Testing hackathon registration...');
      
      const response = await apiService.registerForHackathon({
        user_id: "test-user-id",
        full_name: "Test User",
        email: "test@example.com",
        phone: "1234567890",
        age: "25",
        city: "Test City",
        college: "Test University",
        graduation: "2024",
        programming_languages: "JavaScript, Python",
        experience: "2 years",
        frameworks: "React, Node.js",
        specialization: "Full Stack",
        github_profile: "https://github.com/testuser",
        portfolio: "https://testuser.dev",
        agreements: true,
        hackathon_id: "1"
      });

      console.log('Registration test response:', response);

      if (response.success) {
        toast({
          title: "Registration Test Successful! ✅",
          description: "Test registration completed successfully. Check the console for details.",
        });
      } else {
        toast({
          title: "Registration Test Failed! ❌",
          description: `Error: ${response.error?.message || response.message}`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Registration test error:', error);
      toast({
        title: "Registration Test Error! ❌",
        description: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Hackathon API Test</CardTitle>
          <CardDescription>
            Test the hackathon registration functionality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={testRegistration} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Testing..." : "Test Registration"}
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            This will test the hackathon registration API
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default HackathonTest;
