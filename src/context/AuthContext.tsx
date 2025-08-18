import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import authService, { AuthUser, UserData } from "@/services/authService";
import { performLogout, handleLogoutError } from "@/utils/logoutUtils";

export type UserType = "admin" | "startup" | "investor" | "entrepreneur" | "mentor" | "user";

export interface AuthUserLegacy {
  id?: string;
  email?: string;
  name?: string;
  userType: UserType;
}

interface AuthContextValue {
  isAuthenticated: boolean;
  isHydrated: boolean;
  user: AuthUser | null;
  login: (user: AuthUserLegacy) => void;
  logout: () => void;
  signIn: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  signUp: (userData: UserData) => Promise<{ success: boolean; message?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; message?: string }>;
  updateProfile: (profileData: Partial<AuthUser>) => Promise<{ success: boolean; message?: string }>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const LOCAL_STORAGE_KEY = "inc_auth";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Initialize auth state from Supabase
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check if user is already authenticated
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }

        // Listen for auth state changes
        const { data: { subscription } } = authService.onAuthStateChange(async (event, session) => {
          console.log('Auth state changed:', event, session);
          
          if (event === 'SIGNED_IN' && session?.user) {
            const userData = await authService.getCurrentUser();
            setUser(userData);
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
          }
        });

        return () => subscription.unsubscribe();
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsHydrated(true);
      }
    };

    initializeAuth();
  }, []);

  // Legacy login function for backward compatibility
  const login = useCallback((u: AuthUserLegacy) => {
    // Convert legacy user format to new format
    const newUser: AuthUser = {
      id: u.id || '',
      email: u.email || '',
      role: u.userType,
      firstName: u.name?.split(' ')[0] || '',
      lastName: u.name?.split(' ').slice(1).join(' ') || '',
    };
    setUser(newUser);
  }, []);

  const logout = useCallback(async () => {
    try {
      console.log('AuthContext: Starting logout process...');
      
      // Clear user state first
      setUser(null);
      
      // Use the centralized logout utility
      const result = await performLogout(() => authService.signOut());
      
      console.log('AuthContext: Logout result:', result);
      return result;
    } catch (error) {
      console.error('AuthContext: Logout error:', error);
      // Clear user state even if there's an error
      setUser(null);
      
      // Handle the error gracefully
      handleLogoutError(error, () => {
        if (typeof window !== 'undefined') {
          window.location.replace('/');
        }
      });
      
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Logout failed'
      };
    }
  }, []);

  // New authentication functions
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      console.log('AuthContext: Starting sign in...', { email });
      
      const response = await authService.signIn(email, password);
      
      if (response.success && response.user) {
        console.log('AuthContext: Sign in successful', { user: response.user });
        setUser(response.user);
        
        // Log admin authentication specifically
        if (response.user.role === 'admin') {
          console.log('AuthContext: Admin user authenticated', { 
            id: response.user.id, 
            email: response.user.email 
          });
        }
      } else {
        console.error('AuthContext: Sign in failed', response);
      }
      
      return response;
    } catch (error) {
      console.error('AuthContext: Sign in error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Sign in failed'
      };
    }
  }, []);

  const signUp = useCallback(async (userData: UserData) => {
    try {
      const response = await authService.signUp(userData);
      if (response.success && response.user) {
        setUser(response.user);
      }
      return response;
    } catch (error) {
      console.error('Sign up error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Sign up failed'
      };
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    try {
      return await authService.resetPassword(email);
    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Password reset failed'
      };
    }
  }, []);

  const updateProfile = useCallback(async (profileData: Partial<AuthUser>) => {
    try {
      const response = await authService.updateProfile(profileData);
      if (response.success && response.user) {
        setUser(response.user);
      }
      return response;
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Profile update failed'
      };
    }
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    isAuthenticated: Boolean(user),
    isHydrated,
    user,
    login,
    logout,
    signIn,
    signUp,
    resetPassword,
    updateProfile,
  }), [user, isHydrated, login, logout, signIn, signUp, resetPassword, updateProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};


