
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff, ArrowLeft, Loader2, Shield, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import type { UserType } from "@/context/AuthContext";
import { validateAdminCredentials, logAdminAuthEvent, getAdminErrorMessage } from "@/utils/adminUtils";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginMode, setLoginMode] = useState<"user" | "admin">("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, signIn, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('Login: User already authenticated', { user });
      if (user.role === "admin") {
        navigate("/admin-dashboard", { replace: true });
      } else {
        navigate("/user-dashboard", { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate credentials format
    const credentialValidation = validateAdminCredentials(email, password);
    if (!credentialValidation.isValid) {
      toast({
        title: "Invalid Input",
        description: credentialValidation.message,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('Login: Starting authentication...', { email, loginMode });
      
      // Log admin login attempt
      if (loginMode === "admin") {
        logAdminAuthEvent("Admin login attempt", undefined, { email });
      }
      
      const response = await signIn(email, password);
      
      if (response.success && response.user) {
        console.log('Login: Authentication successful', { user: response.user });
        
        // Validate admin access for admin login mode
        if (loginMode === "admin" && response.user.role !== "admin") {
          logAdminAuthEvent("Admin access denied", response.user, { attemptedEmail: email });
          toast({
            title: "Admin Access Denied",
            description: "This account does not have admin privileges. Please use regular user login.",
            variant: "destructive",
          });
          return;
        }
        
        // Log successful admin login
        if (loginMode === "admin" && response.user.role === "admin") {
          logAdminAuthEvent("Admin login successful", response.user);
        }
        
        toast({
          title: "Login Successful",
          description: loginMode === "admin" ? "Welcome, Admin!" : "Welcome back!",
        });
        
        // Navigate based on user role and login mode
        setTimeout(() => {
          if (response.user.role === "admin") {
            navigate("/admin-dashboard", { replace: true });
          } else {
            navigate("/user-dashboard", { replace: true });
          }
        }, 500);
      } else {
        console.error('Login: Authentication failed', response);
        
        // Use admin-specific error messages for admin login
        const errorMessage = loginMode === "admin" 
          ? getAdminErrorMessage(response.message || "Invalid credentials")
          : response.message || "Invalid credentials";
        
        toast({
          title: "Login Failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Login: Unexpected error', error);
      toast({
        title: "Login Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Login Mode Toggle */}
          <div className="mb-6">
            <div className="flex bg-muted rounded-lg p-1">
              <button
                type="button"
                onClick={() => setLoginMode("user")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${
                  loginMode === "user"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                disabled={isLoading}
              >
                <User className="h-4 w-4" />
                <span>User Login</span>
              </button>
              <button
                type="button"
                onClick={() => setLoginMode("admin")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${
                  loginMode === "admin"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                disabled={isLoading}
              >
                <Shield className="h-4 w-4" />
                <span>Admin Login</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder={loginMode === "admin" ? "Enter admin email" : "Enter your email"}
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
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            
            <Button type="submit" className="w-full" variant="hero" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                loginMode === "admin" ? "Admin Sign In" : "Sign In"
              )}
            </Button>
          </form>
          
          {loginMode === "user" && (
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/register" className="text-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          )}
          {loginMode === "admin" && (
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Admin access only. Contact system administrator for credentials.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
