
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LogIn, UserPlus, LogOut, User, Loader2 } from "lucide-react";
import type { UserType } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AuthButtonProps {
  isAuthenticated?: boolean;
  userType?: UserType | string;
  onLogout?: () => void;
  isLoggingOut?: boolean;
}

const AuthButton = ({ isAuthenticated = false, userType, onLogout, isLoggingOut = false }: AuthButtonProps) => {
  if (isAuthenticated) {
    const getDashboardLinks = (userType: UserType | string) => {
      // For admin users, show only Admin Dashboard
      if (userType === "admin") {
        return [{ name: "Admin Dashboard", href: "/admin-dashboard" }];
      }

      // For other users, show User Dashboard and role-specific dashboards
      const links = [
        { name: "User Dashboard", href: "/user-dashboard" }
      ];

      switch (userType) {
        case "startup":
          links.push({ name: "Startup Dashboard", href: "/startup-dashboard" });
          break;
        case "investor":
          links.push({ name: "Investor Dashboard", href: "/investor-dashboard" });
          break;
        case "entrepreneur":
          links.push({ name: "Co-founder Dashboard", href: "/cofounder-dashboard" });
          break;
        case "mentor":
          links.push({ name: "Mentor Dashboard", href: "/mentor-dashboard" });
          break;
      }

      return links;
    };

    const dashboardLinks = getDashboardLinks(userType || "user");

    return (
      <div className="flex items-center space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>{userType === "admin" ? "Admin" : "Profile"}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {dashboardLinks.map((link) => (
              <DropdownMenuItem key={link.href} asChild>
                <Link to={link.href}>{link.name}</Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={onLogout} 
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4 mr-2" />
              )}
              {isLoggingOut ? "Logging out..." : "Logout"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="sm" asChild>
        <Link to="/login" className="flex items-center space-x-1">
          <LogIn className="h-4 w-4" />
          <span>Login</span>
        </Link>
      </Button>
      <Button variant="hero" size="sm" asChild>
        <Link to="/register" className="flex items-center space-x-1">
          <UserPlus className="h-4 w-4" />
          <span>Register</span>
        </Link>
      </Button>
    </div>
  );
};

export default AuthButton;
