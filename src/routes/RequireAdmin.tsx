import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useAuthUI } from "@/context/AuthUIContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Shield, AlertTriangle } from "lucide-react";

interface RequireAdminProps {
  children: React.ReactElement;
}

const RequireAdmin: React.FC<RequireAdminProps> = ({ children }) => {
  const { isAuthenticated, isHydrated, user } = useAuth();
  const { openLogin } = useAuthUI();
  const { toast } = useToast();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isHydrated) return;
    
    console.log('RequireAdmin: Checking authentication...', { 
      isAuthenticated, 
      userRole: user?.role,
      userId: user?.id 
    });
    
    if (!isAuthenticated) {
      console.log('RequireAdmin: User not authenticated, opening login');
      toast({
        title: "Authentication Required",
        description: "Please log in to access admin features",
        variant: "destructive",
      });
      openLogin();
      return;
    }

    // Check if user is admin
    if (user?.role !== "admin") {
      console.log('RequireAdmin: User is not admin, redirecting', { 
        userRole: user?.role, 
        userId: user?.id 
      });
      
      toast({
        title: "Access Denied",
        description: "You don't have permission to access admin features",
        variant: "destructive",
      });
      
      // Redirect non-admin users to user dashboard
      navigate("/user-dashboard", { replace: true });
    } else {
      console.log('RequireAdmin: Admin access granted', { 
        userId: user.id, 
        email: user.email 
      });
    }
  }, [isAuthenticated, isHydrated, user, openLogin, navigate, toast]);

  // Show loading state while checking authentication
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show authentication required message
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Shield className="h-12 w-12 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Authentication Required</h2>
          <p className="text-muted-foreground">Please log in to continue</p>
        </div>
      </div>
    );
  }

  // Show access denied message for non-admin users
  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <AlertTriangle className="h-12 w-12 text-destructive" />
          <h2 className="text-xl font-semibold">Access Denied</h2>
          <p className="text-muted-foreground">You don't have permission to access this page</p>
          <p className="text-sm text-muted-foreground">Redirecting to user dashboard...</p>
        </div>
      </div>
    );
  }

  // Render admin content
  return children;
};

export default RequireAdmin;
