import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://ysxtcljsclkoatngtihl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzeHRjbGpzY2xrb2F0bmd0aWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4NDE5NjYsImV4cCI6MjA3MDQxNzk2Nn0.TLkkrBzwj6g6vQ-Hh52qBvRjYvAnHRTExf2CR2WqtIY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface UserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string;
  phone?: string;
  company?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  phone?: string;
  bio?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  message?: string;
  session?: any;
}

class AuthService {
  // Sign up a new user
  async signUp(userData: UserData): Promise<AuthResponse> {
    try {
      const { email, password, firstName, lastName, role, phone, company } = userData;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            role: role || 'entrepreneur',
            phone: phone,
            company: company
          }
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      return {
        success: true,
        user: data.user ? {
          id: data.user.id,
          email: data.user.email || '',
          role: role || 'entrepreneur',
          firstName,
          lastName,
          company,
          phone
        } : undefined,
        message: 'User registered successfully. Please check your email to confirm your account.'
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to register user'
      };
    }
  }

  // Sign in user
  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      console.log('AuthService: Starting sign in...', { email });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('AuthService: Supabase auth error:', error);
        throw new Error(error.message);
      }

      if (!data.user) {
        console.error('AuthService: No user data received');
        throw new Error('No user data received');
      }

      console.log('AuthService: User authenticated, fetching profile...', { userId: data.user.id });

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        console.error('AuthService: Profile fetch error:', profileError);
        // Don't throw error, use default values
      }

      const userData = {
        id: data.user.id,
        email: data.user.email || '',
        role: profile?.role || 'user',
        firstName: profile?.first_name,
        lastName: profile?.last_name,
        company: profile?.company,
        phone: profile?.phone,
        bio: profile?.bio
      };

      console.log('AuthService: Sign in successful', { 
        userId: userData.id, 
        email: userData.email, 
        role: userData.role 
      });

      // Log admin authentication specifically
      if (userData.role === 'admin') {
        console.log('AuthService: Admin user authenticated', { 
          id: userData.id, 
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName
        });
      }

      return {
        success: true,
        user: userData,
        session: data.session
      };
    } catch (error) {
      console.error('AuthService: Sign in failed:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to sign in'
      };
    }
  }

  // Sign out user
  async signOut(): Promise<AuthResponse> {
    try {
      console.log('AuthService: Starting sign out...');
      
      // Clear any local storage or session data
      localStorage.removeItem('inc_auth');
      sessionStorage.clear();
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Supabase sign out error:', error);
        throw new Error(error.message);
      }

      console.log('AuthService: Sign out successful');
      return { success: true };
    } catch (error) {
      console.error('AuthService: Sign out failed:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to sign out'
      };
    }
  }

  // Get current user
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        return null;
      }

      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      return {
        id: user.id,
        email: user.email || '',
        role: profile?.role || 'user',
        firstName: profile?.first_name,
        lastName: profile?.last_name,
        phone: profile?.phone,
        company: profile?.company,
        bio: profile?.bio
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  // Get current session
  async getCurrentSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        return null;
      }

      return session;
    } catch (error) {
      console.error('Get current session error:', error);
      return null;
    }
  }

  // Refresh session
  async refreshSession(refreshToken: string) {
    try {
      const { data, error } = await supabase.auth.refreshSession({
        refresh_token: refreshToken
      });

      if (error) {
        throw new Error(error.message);
      }

      return data.session;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to refresh session');
    }
  }

  // Reset password
  async resetPassword(email: string): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        throw new Error(error.message);
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to send reset email'
      };
    }
  }

  // Update password
  async updatePassword(newPassword: string): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        throw new Error(error.message);
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update password'
      };
    }
  }

  // Update user profile
  async updateProfile(profileData: Partial<AuthUser>): Promise<AuthResponse> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return {
        success: true,
        user: data ? {
          id: data.id,
          email: data.email,
          role: data.role,
          firstName: data.first_name,
          lastName: data.last_name,
          phone: data.phone,
          company: data.company,
          bio: data.bio
        } : undefined
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update profile'
      };
    }
  }

  // Listen to auth state changes
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return !!user;
  }

  // Check if user has specific role
  async hasRole(role: string): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user?.role === role;
  }

  // Check if user is admin
  async isAdmin(): Promise<boolean> {
    return await this.hasRole('admin');
  }

  // Get access token for API calls
  async getAccessToken(): Promise<string | null> {
    const session = await this.getCurrentSession();
    return session?.access_token || null;
  }

  // Make authenticated API calls
  async apiCall(endpoint: string, options: RequestInit = {}): Promise<any> {
    const token = await this.getAccessToken();
    
    const response = await fetch(`http://localhost:3001/api${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API call failed');
    }

    return response.json();
  }
}

export default new AuthService();
