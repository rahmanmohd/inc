import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

interface AuthUIContextValue {
  isLoginOpen: boolean;
  openLogin: () => void;
  closeLogin: () => void;
}

const AuthUIContext = createContext<AuthUIContextValue | undefined>(undefined);

export const AuthUIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const openLogin = useCallback(() => setIsLoginOpen(true), []);
  const closeLogin = useCallback(() => setIsLoginOpen(false), []);

  const value = useMemo<AuthUIContextValue>(() => ({ isLoginOpen, openLogin, closeLogin }), [isLoginOpen, openLogin, closeLogin]);

  return <AuthUIContext.Provider value={value}>{children}</AuthUIContext.Provider>;
};

export const useAuthUI = (): AuthUIContextValue => {
  const ctx = useContext(AuthUIContext);
  if (!ctx) throw new Error("useAuthUI must be used within an AuthUIProvider");
  return ctx;
};


