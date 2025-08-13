import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useAuthUI } from "@/context/AuthUIContext";

interface RequireAuthProps {
  children: React.ReactElement;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const { isAuthenticated, isHydrated } = useAuth();
  const { openLogin } = useAuthUI();

  React.useEffect(() => {
    if (!isHydrated) return;
    if (!isAuthenticated) {
      openLogin();
    }
  }, [isAuthenticated, isHydrated, openLogin]);

  if (!isHydrated) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  return children;
};

export default RequireAuth;


