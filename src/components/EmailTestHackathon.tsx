import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { toast } from './ui/use-toast';

const EmailTestHackathon = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [testEmail, setTestEmail] = useState('tauqeermohd123580@gmail.com');

  const testHackathonStatusEmail = async () => {
    setIsLoading(true);
    try {
      console.log('Testing hackathon status email...');
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-hackathon-email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'hackathon_status_update',
          email: testEmail,
          data: {
            full_name: 'Test User',
            email: testEmail,
            hackathon_title: 'AI Innovation Challenge 2025',
            status: 'approved',
            admin_notes: 'This is a test email to verify the hackathon status update system is working correctly.',
            programming_languages: 'Python, JavaScript, React',
            experience: 'Intermediate',
            specialization: 'Full Stack Development',
            city: 'Test City',
            frameworks: 'React, Node.js, Express',
            age: '25',
            college: 'Test University'
          }
        })
      });

      console.log('Response status:', response.status);
      const responseData = await response.text();
      console.log('Response data:', responseData);

      if (response.ok) {
        toast({
          title: "✅ Test Email Sent!",
          description: `Hackathon status update email sent to ${testEmail}. Check your inbox!`,
        });
      } else {
        throw new Error(`HTTP ${response.status}: ${responseData}`);
      }
    } catch (error) {
      console.error('Email test failed:', error);
      toast({
        title: "❌ Email Test Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testDirectEmailFunction = async () => {
    setIsLoading(true);
    try {
      console.log('Testing direct email function...');
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/test-hackathon-email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      });

      console.log('Test function response status:', response.status);
      const responseData = await response.text();
      console.log('Test function response data:', responseData);

      if (response.ok) {
        toast({
          title: "✅ Direct Test Completed!",
          description: "Check the response in console and your email inbox.",
        });
      } else {
        throw new Error(`HTTP ${response.status}: ${responseData}`);
      }
    } catch (error) {
      console.error('Direct test failed:', error);
      toast({
        title: "❌ Direct Test Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>🐛 Hackathon Email Debug Center</CardTitle>
        <CardDescription>
          Test the hackathon status update email system to debug any issues
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="testEmail" className="text-sm font-medium">
            Test Email Address:
          </label>
          <Input
            id="testEmail"
            type="email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="Enter email to receive test"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={testHackathonStatusEmail}
            disabled={isLoading || !testEmail}
            className="w-full"
          >
            {isLoading ? "Sending..." : "🚀 Test Status Update Email"}
          </Button>

          <Button
            onClick={testDirectEmailFunction}
            disabled={isLoading}
            variant="outline"
            className="w-full"
          >
            {isLoading ? "Testing..." : "🔧 Test Direct Function"}
          </Button>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <h4 className="font-semibold text-sm">📋 Debug Instructions:</h4>
          <ol className="text-sm space-y-1 list-decimal list-inside">
            <li>Click "Test Status Update Email" to test the exact same function used by admin dashboard</li>
            <li>Click "Test Direct Function" to test the debugging function</li>
            <li>Check browser console for detailed logs</li>
            <li>Check your email inbox (including spam folder)</li>
            <li>If emails don't arrive, check Supabase function logs</li>
          </ol>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-sm text-blue-800">💡 What This Tests:</h4>
          <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside mt-2">
            <li>SendGrid API configuration</li>
            <li>Email template rendering</li>
            <li>Hackathon status update email flow</li>
            <li>Environment variables setup</li>
            <li>Function authentication</li>
          </ul>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <h4 className="font-semibold text-sm text-yellow-800">⚠️ Common Issues:</h4>
          <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside mt-2">
            <li>SENDGRID_API_KEY not set in Supabase environment</li>
            <li>FROM_EMAIL not configured</li>
            <li>Email in spam/junk folder</li>
            <li>SendGrid API key invalid or expired</li>
            <li>Rate limiting or account issues</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailTestHackathon;
