// Frontend Authentication Service for Inc Combinator
// Copy this file to your React app's src/services/ directory

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://ysxtcljsclkoatngtihl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzeHRjbGpzY2xrb2F0bmd0aWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4NDE5NjYsImV4cCI6MjA3MDQxNzk2Nn0.TLkkrBzwj6g6vQ-Hh52qBvRjYvAnHRTExf2CR2WqtIY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

class AuthService {
  // Sign up a new user
  async signUp(userData) {
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
        user: data.user,
        message: 'User registered successfully. Please check your email to confirm your account.'
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to register user');
    }
  }

  // Sign in user
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw new Error(error.message);
      }

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
      }

      return {
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email,
          role: profile?.role || 'user',
          firstName: profile?.first_name,
          lastName: profile?.last_name,
          company: profile?.company
        },
        session: data.session
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to sign in');
    }
  }

  // Sign out user
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw new Error(error.message);
      }

      return { success: true };
    } catch (error) {
      throw new Error(error.message || 'Failed to sign out');
    }
  }

  // Get current user
  async getCurrentUser() {
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
        email: user.email,
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
  async refreshSession(refreshToken) {
    try {
      const { data, error } = await supabase.auth.refreshSession({
        refresh_token: refreshToken
      });

      if (error) {
        throw new Error(error.message);
      }

      return data.session;
    } catch (error) {
      throw new Error(error.message || 'Failed to refresh session');
    }
  }

  // Reset password
  async resetPassword(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        throw new Error(error.message);
      }

      return { success: true };
    } catch (error) {
      throw new Error(error.message || 'Failed to send reset email');
    }
  }

  // Update password
  async updatePassword(newPassword) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        throw new Error(error.message);
      }

      return { success: true };
    } catch (error) {
      throw new Error(error.message || 'Failed to update password');
    }
  }

  // Update user profile
  async updateProfile(profileData) {
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
        profile: data
      };
    } catch (error) {
      throw new Error(error.message || 'Failed to update profile');
    }
  }

  // Listen to auth state changes
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  }

  // Check if user is authenticated
  async isAuthenticated() {
    const user = await this.getCurrentUser();
    return !!user;
  }

  // Check if user has specific role
  async hasRole(role) {
    const user = await this.getCurrentUser();
    return user?.role === role;
  }

  // Check if user is admin
  async isAdmin() {
    return await this.hasRole('admin');
  }

  // Get access token for API calls
  async getAccessToken() {
    const session = await this.getCurrentSession();
    return session?.access_token;
  }

  // Make authenticated API calls
  async apiCall(endpoint, options = {}) {
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
