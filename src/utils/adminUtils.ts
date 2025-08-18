/**
 * Admin Utilities
 * Centralized admin authentication and validation functions
 */

import { AuthUser } from "@/services/authService";

export interface AdminValidationResult {
  isValid: boolean;
  message?: string;
  user?: AuthUser;
}

/**
 * Validate if a user has admin privileges
 */
export const validateAdminAccess = (user: AuthUser | null): AdminValidationResult => {
  if (!user) {
    return {
      isValid: false,
      message: "User not authenticated"
    };
  }

  if (user.role !== "admin") {
    return {
      isValid: false,
      message: `User role '${user.role}' does not have admin privileges`,
      user
    };
  }

  return {
    isValid: true,
    user
  };
};

/**
 * Check if user is admin
 */
export const isAdmin = (user: AuthUser | null): boolean => {
  return user?.role === "admin";
};

/**
 * Get admin user info for logging
 */
export const getAdminInfo = (user: AuthUser | null): string => {
  if (!user) return "No user";
  if (user.role !== "admin") return `Non-admin user: ${user.email}`;
  
  return `Admin: ${user.firstName} ${user.lastName} (${user.email})`;
};

/**
 * Validate admin credentials format
 */
export const validateAdminCredentials = (email: string, password: string): AdminValidationResult => {
  if (!email || !password) {
    return {
      isValid: false,
      message: "Email and password are required"
    };
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      message: "Invalid email format"
    };
  }

  // Basic password validation
  if (password.length < 6) {
    return {
      isValid: false,
      message: "Password must be at least 6 characters long"
    };
  }

  return {
    isValid: true
  };
};

/**
 * Log admin authentication events
 */
export const logAdminAuthEvent = (event: string, user?: AuthUser, details?: any): void => {
  const timestamp = new Date().toISOString();
  const adminInfo = user ? getAdminInfo(user) : "Unknown";
  
  console.log(`[ADMIN AUTH] ${timestamp} - ${event}`, {
    adminInfo,
    details
  });
};

/**
 * Get admin dashboard redirect path
 */
export const getAdminRedirectPath = (user: AuthUser | null): string => {
  if (!user) return "/login";
  if (user.role === "admin") return "/admin-dashboard";
  return "/user-dashboard";
};

/**
 * Check if current path requires admin access
 */
export const isAdminRoute = (pathname: string): boolean => {
  const adminRoutes = [
    "/admin-dashboard",
    "/admin/users",
    "/admin/applications",
    "/admin/settings"
  ];
  
  return adminRoutes.some(route => pathname.startsWith(route));
};

/**
 * Get admin-specific error messages
 */
export const getAdminErrorMessage = (error: string): string => {
  const errorMessages: Record<string, string> = {
    "Invalid credentials": "Admin credentials are invalid. Please check your email and password.",
    "User not found": "Admin account not found. Please contact system administrator.",
    "Access denied": "You don't have admin privileges. Please contact system administrator.",
    "Account disabled": "Admin account is disabled. Please contact system administrator.",
    "Session expired": "Admin session has expired. Please log in again.",
    "Network error": "Network error occurred. Please check your connection and try again."
  };

  return errorMessages[error] || error;
};
