
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LogIn, UserPlus, LogOut } from "lucide-react";

interface AuthButtonProps {
  isAuthenticated?: boolean;
  userType?: string;
  onLogout?: () => void;
}

const AuthButton = ({ isAuthenticated = false, userType, onLogout }: AuthButtonProps) => {
  if (isAuthenticated) {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm text-muted-foreground">
          Welcome, {userType}!
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={onLogout}
          className="flex items-center space-x-1"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
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
