/**
 * Logout Utilities
 * Centralized logout functionality for consistent behavior across the application
 */

export interface LogoutResult {
  success: boolean;
  message?: string;
}

/**
 * Clear all local storage and session data
 */
export const clearLocalData = (): void => {
  try {
    // Clear localStorage
    localStorage.removeItem('inc_auth');
    localStorage.removeItem('supabase.auth.token');
    localStorage.removeItem('supabase.auth.expires_at');
    localStorage.removeItem('supabase.auth.refresh_token');
    
    // Clear sessionStorage
    sessionStorage.clear();
    
    // Clear any other cached data
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('auth') || key.includes('user') || key.includes('session'))) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    console.log('Local data cleared successfully');
  } catch (error) {
    console.error('Error clearing local data:', error);
  }
};

/**
 * Check if user is on a protected page that requires redirect
 */
export const isOnProtectedPage = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const protectedPaths = [
    '/admin-dashboard',
    '/user-dashboard',
    '/startup-dashboard',
    '/investor-dashboard',
    '/mentor-dashboard',
    '/cofounder-dashboard'
  ];
  
  return protectedPaths.some(path => window.location.pathname.includes(path));
};

/**
 * Force redirect to home page
 */
export const redirectToHome = (): void => {
  if (typeof window === 'undefined') return;
  
  // Use replace to prevent back navigation
  window.location.replace('/');
};

/**
 * Complete logout process
 */
export const performLogout = async (
  authServiceSignOut: () => Promise<{ success: boolean; message?: string }>
): Promise<LogoutResult> => {
  try {
    console.log('Starting complete logout process...');
    
    // Clear local data first
    clearLocalData();
    
    // Sign out from authentication service
    const signOutResult = await authServiceSignOut();
    
    if (!signOutResult.success) {
      console.error('Authentication service logout failed:', signOutResult.message);
      return {
        success: false,
        message: signOutResult.message || 'Failed to sign out from authentication service'
      };
    }
    
    // Check if we need to force redirect
    if (isOnProtectedPage()) {
      console.log('On protected page, forcing redirect...');
      redirectToHome();
      return { success: true };
    }
    
    console.log('Logout completed successfully');
    return { success: true };
  } catch (error) {
    console.error('Logout process failed:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Logout process failed'
    };
  }
};

/**
 * Handle logout errors gracefully
 */
export const handleLogoutError = (error: unknown, fallbackRedirect: () => void): void => {
  console.error('Logout error occurred:', error);
  
  // Clear local data even if there's an error
  clearLocalData();
  
  // Always redirect to home
  fallbackRedirect();
};
