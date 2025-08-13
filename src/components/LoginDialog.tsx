import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useAuthUI } from "@/context/AuthUIContext";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { UserType } from "@/context/AuthContext";

const LoginDialog = () => {
  const { isLoginOpen, closeLogin } = useAuthUI();
  const { isAuthenticated, login, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleClose = () => {
    closeLogin();
    // Redirect to homepage when dialog is closed
    navigate("/");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (email && password && userType) {
      toast({ title: "Login Successful", description: "Redirecting..." });
      
      // Login the user
      login({ email, userType: userType as UserType });
      
      // Close the dialog
      closeLogin();
      
      // Get the redirect URL if it exists
      const redirect = searchParams.get("redirect");
      
      // Navigate based on user type and redirect
      setTimeout(() => {
        if (userType === "admin") {
          navigate("/admin-dashboard");
        } else if (redirect && redirect !== "/" && !redirect.startsWith("/login")) {
          navigate(redirect);
        } else {
          navigate("/user-dashboard");
        }
      }, 200);
    } else {
      toast({ title: "Login Failed", description: "Please fill in all fields", variant: "destructive" });
    }
  };

  return (
    <Dialog open={isLoginOpen} onOpenChange={(open) => (open ? null : handleClose())}>
      <DialogContent hideClose className="sm:max-w-md p-0 border-0 bg-transparent">
        <DialogTitle className="sr-only">Sign In</DialogTitle>
        <Card className="w-full shadow-2xl border-0 bg-card">
          <CardHeader className="space-y-1 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
              <Button variant="ghost" size="sm" onClick={handleClose}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userType">User Type</Label>
                <Select value={userType} onValueChange={setUserType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select user type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="startup">Startup</SelectItem>
                    <SelectItem value="investor">Investor</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="entrepreneur">Entrepreneur</SelectItem>
                    <SelectItem value="mentor">Mentor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Enter your email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Enter your password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="remember" className="rounded" />
                  <Label htmlFor="remember" className="text-sm">Remember me</Label>
                </div>
                <Button variant="link" className="text-sm text-primary hover:underline p-0 h-auto">
                  Forgot password?
                </Button>
              </div>

              <Button type="submit" className="w-full" variant="hero">
                Sign In
              </Button>
            </form>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Button 
                  variant="link" 
                  className="text-primary hover:underline p-0 h-auto text-sm"
                  onClick={() => {
                    closeLogin();
                    navigate("/register");
                  }}
                >
                  Sign up
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;


