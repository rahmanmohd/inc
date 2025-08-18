import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useAuthUI } from "@/context/AuthUIContext";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { UserType } from "@/context/AuthContext";

const LoginDialog = () => {
  const { isLoginOpen, closeLogin } = useAuthUI();
  const { isAuthenticated, signIn, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    closeLogin();
    // Redirect to homepage when dialog is closed
    navigate("/");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({ 
        title: "Login Failed", 
        description: "Please fill in all required fields", 
        variant: "destructive" 
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await signIn(email, password);
      
      if (response.success) {
        toast({ title: "Login Successful", description: "Redirecting..." });
        
        // Close the dialog
        closeLogin();
        
        // Get the redirect URL if it exists
        const redirect = searchParams.get("redirect");
        
        // Navigate based on user role and redirect
        setTimeout(() => {
          const currentUser = user || { role: 'user' };
          if (currentUser.role === "admin") {
            navigate("/admin-dashboard");
          } else if (redirect && redirect !== "/" && !redirect.startsWith("/login")) {
            navigate(redirect);
          } else {
            navigate("/user-dashboard");
          }
        }, 200);
      } else {
        toast({ 
          title: "Login Failed", 
          description: response.message || "Invalid credentials", 
          variant: "destructive" 
        });
      }
    } catch (error) {
      toast({ 
        title: "Login Failed", 
        description: "An unexpected error occurred", 
        variant: "destructive" 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isLoginOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle className="text-2xl font-bold">Sign In</DialogTitle>
        <div className="space-y-4">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
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
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="remember" className="rounded" disabled={isLoading} />
                <Label htmlFor="remember" className="text-sm">Remember me</Label>
              </div>
              <button
                type="button"
                className="text-sm text-primary hover:underline"
                onClick={() => {
                  closeLogin();
                  navigate("/forgot-password");
                }}
              >
                Forgot password?
              </button>
            </div>
            
            <Button type="submit" className="w-full" variant="hero" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <button
                type="button"
                className="text-primary hover:underline"
                onClick={() => {
                  closeLogin();
                  navigate("/register");
                }}
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;


