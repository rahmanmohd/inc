
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import ApplicationDialog from "./ApplicationDialog";
import AuthButton from "./AuthButton";
import { useAuth } from "@/context/AuthContext";
import { useAuthUI } from "@/context/AuthUIContext";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { openLogin } = useAuthUI();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: "Hackathon", href: "/hackathon" },
    { name: "Incubation", href: "/incubation" },
    { name: "MVP Lab", href: "/mvp-lab" },
    { name: "INC Lab", href: "/inclab" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleNavClick = (href: string) => {
    console.log("Navigation clicked:", href);
    console.log("isAuthenticated:", isAuthenticated);
    console.log("Current user:", user);
    
    if (!isAuthenticated) {
      console.log("User not authenticated, opening login");
      openLogin();
      return;
    }
    
    console.log("User authenticated, navigating to:", href);
    navigate(href);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">IC</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
              Inc Combinator
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                className="text-muted-foreground hover:text-primary transition-colors duration-200 relative group bg-transparent border-none cursor-pointer"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
            <ApplicationDialog>
              <Button variant="hero" size="lg">
                Apply Now
              </Button>
            </ApplicationDialog>
            <AuthButton
              isAuthenticated={isAuthenticated}
              userType={user?.userType || "user"}
              onLogout={handleLogout}
            />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu className="w-6 h-6 text-foreground" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    handleNavClick(item.href);
                    setIsOpen(false);
                  }}
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 px-2 py-1 bg-transparent border-none cursor-pointer text-left w-full"
                >
                  {item.name}
                </button>
              ))}
              <ApplicationDialog>
                <Button variant="hero" size="lg">
                  Apply Now
                </Button>
              </ApplicationDialog>
              <AuthButton
                isAuthenticated={isAuthenticated}
                userType={user?.userType || "user"}
                onLogout={handleLogout}
              />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
