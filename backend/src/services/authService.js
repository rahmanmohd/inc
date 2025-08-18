const { supabase, supabasePublic } = require('../config/supabase');

class AuthService {
  constructor() {
    this.supabase = supabasePublic; // Use public client for frontend
  }

  // Sign up a new user
  async signUp(userData) {
    try {
      const { email, password, firstName, lastName, role, phone, company } = userData;

      const { data, error } = await this.supabase.auth.signUp({
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
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw new Error(error.message);
      }

      // Get user profile
      const { data: profile, error: profileError } = await this.supabase
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
      const { error } = await this.supabase.auth.signOut();
      
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
      const { data: { user }, error } = await this.supabase.auth.getUser();
      
      if (error || !user) {
        return null;
      }

      // Get user profile
      const { data: profile } = await this.supabase
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
      const { data: { session }, error } = await this.supabase.auth.getSession();
      
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
      const { data, error } = await this.supabase.auth.refreshSession({
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
      const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
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
      const { error } = await this.supabase.auth.updateUser({
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
      const { data: { user } } = await this.supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await this.supabase
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
    return this.supabase.auth.onAuthStateChange(callback);
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
}

module.exports = new AuthService();
