import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

const AuthTest = () => {
  const { toast } = useToast();
  const { user, isAuthenticated, signIn, signUp, logout } = useAuth();
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("password123");
  const [firstName, setFirstName] = useState("Test");
  const [lastName, setLastName] = useState("User");

  const handleSignUp = async () => {
    try {
      const response = await signUp({
        email,
        password,
        firstName,
        lastName,
        role: "entrepreneur"
      });
      
      toast({
        title: response.success ? "Success" : "Error",
        description: response.message,
        variant: response.success ? "default" : "destructive"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Sign up failed",
        variant: "destructive"
      });
    }
  };

  const handleSignIn = async () => {
    try {
      const response = await signIn(email, password);
      
      toast({
        title: response.success ? "Success" : "Error",
        description: response.message,
        variant: response.success ? "default" : "destructive"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Sign in failed",
        variant: "destructive"
      });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Success",
        description: "Logged out successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Logout failed",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader>
          <CardTitle>Authentication Test</CardTitle>
          <CardDescription>
            Test Supabase authentication integration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Current Status</Label>
            <div className="p-3 bg-muted rounded-md">
              <p><strong>Authenticated:</strong> {isAuthenticated ? "Yes" : "No"}</p>
              {user && (
                <div className="mt-2">
                  <p><strong>User ID:</strong> {user.id}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Role:</strong> {user.role}</p>
                  <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSignUp} className="flex-1">
              Sign Up
            </Button>
            <Button onClick={handleSignIn} className="flex-1">
              Sign In
            </Button>
          </div>

          {isAuthenticated && (
            <Button onClick={handleLogout} variant="destructive" className="w-full">
              Logout
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthTest;
