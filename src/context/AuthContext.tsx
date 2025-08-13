import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type UserType = "admin" | "startup" | "investor" | "entrepreneur" | "mentor" | "user";

export interface AuthUser {
  id?: string;
  email?: string;
  name?: string;
  userType: UserType;
}

interface AuthContextValue {
  isAuthenticated: boolean;
  isHydrated: boolean;
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const LOCAL_STORAGE_KEY = "inc_auth";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) {
        const parsed: AuthUser = JSON.parse(raw);
        if (parsed && parsed.userType) {
          setUser(parsed);
        }
      }
    } catch {
      // ignore parse errors
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }, [user]);

  const login = useCallback((u: AuthUser) => {
    setUser(u);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    isAuthenticated: Boolean(user),
    isHydrated,
    user,
    login,
    logout,
  }), [user, isHydrated, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};


