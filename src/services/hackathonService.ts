import { supabase } from '../lib/supabase';

export interface HackathonRegistration {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  age: string;
  city: string;
  college?: string;
  graduation?: string;
  programmingLanguages: string;
  experience: string;
  frameworks?: string;
  specialization?: string;
  githubProfile?: string;
  portfolio?: string;
  agreements: boolean;
  hackathonId?: string;
  hackathonTitle?: string;
  status: 'pending' | 'approved' | 'rejected' | 'waitlisted';
  createdAt?: string;
  updatedAt?: string;
}

export interface HackathonEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  theme: string;
  prizePool: string;
  participants: string;
  status: 'Registration Open' | 'Coming Soon' | 'Registration Closed' | 'Completed';
  description: string;
  registrationDeadline: string;
  maxParticipants: number;
  currentParticipants: number;
  tracks: string[];
  prizes: any[];
  rules: string[];
  requirements: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface HackathonSubmission {
  id?: string;
  hackathonId: string;
  teamName: string;
  projectTitle: string;
  projectDescription: string;
  teamMembers: string[];
  technologies: string[];
  githubRepo?: string;
  demoLink?: string;
  presentationLink?: string;
  track: string;
  status: 'submitted' | 'under_review' | 'shortlisted' | 'finalist' | 'winner' | 'rejected';
  score?: number;
  feedback?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface HackathonFeedback {
  id?: string;
  hackathonId: string;
  registrationId: string;
  rating: number;
  feedback: string;
  suggestions: string;
  wouldRecommend: boolean;
  createdAt?: string;
}

export interface ApiResponse {
  success: boolean;
  data?: any;
  message?: string;
  error?: any;
}

class HackathonService {
  // ==================== HACKATHON EVENTS ====================
  
  async getHackathons(): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase
        .from('hackathons')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error fetching hackathons:', error);
      return {
        success: false,
        error
      };
    }
  }

  async getHackathonById(id: string): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase
        .from('hackathons')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error fetching hackathon:', error);
      return {
        success: false,
        error
      };
    }
  }

  async createHackathon(hackathon: Omit<HackathonEvent, 'id'>): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase
        .from('hackathons')
        .insert([hackathon])
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error creating hackathon:', error);
      return {
        success: false,
        error
      };
    }
  }

  async updateHackathon(id: string, updates: Partial<HackathonEvent>): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase
        .from('hackathons')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error updating hackathon:', error);
      return {
        success: false,
        error
      };
    }
  }

  async deleteHackathon(id: string): Promise<ApiResponse> {
    try {
      const { error } = await supabase
        .from('hackathons')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return {
        success: true
      };
    } catch (error) {
      console.error('Error deleting hackathon:', error);
      return {
        success: false,
        error
      };
    }
  }

  // ==================== REGISTRATIONS ====================

  async registerForHackathon(registration: Omit<HackathonRegistration, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse> {
    try {
      // Check if user is already registered
      const { data: existingRegistration } = await supabase
        .from('hackathon_registrations')
        .select('id')
        .eq('email', registration.email)
        .eq('hackathonId', registration.hackathonId)
        .single();

      if (existingRegistration) {
        return {
          success: false,
          message: 'You are already registered for this hackathon'
        };
      }

      // Check if hackathon is full
      const { data: hackathon } = await supabase
        .from('hackathons')
        .select('maxParticipants, currentParticipants')
        .eq('id', registration.hackathonId)
        .single();

      if (hackathon && hackathon.currentParticipants >= hackathon.maxParticipants) {
        return {
          success: false,
          message: 'This hackathon is full. Please try another event.'
        };
      }

      // Insert registration
      const { data, error } = await supabase
        .from('hackathon_registrations')
        .insert([{
          ...registration,
          status: 'pending'
        }])
        .select()
        .single();

      if (error) throw error;

      // Update participant count
      await supabase
        .from('hackathons')
        .update({ currentParticipants: hackathon.currentParticipants + 1 })
        .eq('id', registration.hackathonId);

      // Send confirmation email via Edge Function
      await this.sendRegistrationEmail(registration.email, registration.fullName, registration.hackathonTitle || 'Hackathon');

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error registering for hackathon:', error);
      return {
        success: false,
        error
      };
    }
  }

  async getRegistrations(hackathonId?: string): Promise<ApiResponse> {
    try {
      let query = supabase
        .from('hackathon_registrations')
        .select('*')
        .order('createdAt', { ascending: false });

      if (hackathonId) {
        query = query.eq('hackathonId', hackathonId);
      }

      const { data, error } = await query;

      if (error) throw error;

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error fetching registrations:', error);
      return {
        success: false,
        error
      };
    }
  }

  async updateRegistrationStatus(id: string, status: HackathonRegistration['status']): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase
        .from('hackathon_registrations')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Send status update email
      if (data) {
        await this.sendStatusUpdateEmail(data.email, data.fullName, status, data.hackathonTitle || 'Hackathon');
      }

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error updating registration status:', error);
      return {
        success: false,
        error
      };
    }
  }

  async getUserRegistrations(userEmail: string): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase
        .from('hackathon_registrations')
        .select(`
          *,
          hackathons (
            title,
            date,
            location,
            theme
          )
        `)
        .eq('email', userEmail)
        .order('createdAt', { ascending: false });

      if (error) throw error;

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error fetching user registrations:', error);
      return {
        success: false,
        error
      };
    }
  }

  // ==================== PROJECT SUBMISSIONS ====================

  async submitProject(submission: Omit<HackathonSubmission, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase
        .from('hackathon_submissions')
        .insert([submission])
        .select()
        .single();

      if (error) throw error;

      // Send submission confirmation email
      await this.sendSubmissionEmail(submission.teamMembers[0], submission.teamName, submission.projectTitle);

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error submitting project:', error);
      return {
        success: false,
        error
      };
    }
  }

  async getSubmissions(hackathonId?: string): Promise<ApiResponse> {
    try {
      let query = supabase
        .from('hackathon_submissions')
        .select('*')
        .order('createdAt', { ascending: false });

      if (hackathonId) {
        query = query.eq('hackathonId', hackathonId);
      }

      const { data, error } = await query;

      if (error) throw error;

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error fetching submissions:', error);
      return {
        success: false,
        error
      };
    }
  }

  async updateSubmissionStatus(id: string, status: HackathonSubmission['status'], score?: number, feedback?: string): Promise<ApiResponse> {
    try {
      const updates: any = { status };
      if (score !== undefined) updates.score = score;
      if (feedback) updates.feedback = feedback;

      const { data, error } = await supabase
        .from('hackathon_submissions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Send status update email
      if (data) {
        await this.sendSubmissionStatusEmail(data.teamMembers[0], data.teamName, status, data.projectTitle);
      }

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error updating submission status:', error);
      return {
        success: false,
        error
      };
    }
  }

  // ==================== FEEDBACK ====================

  async submitFeedback(feedback: Omit<HackathonFeedback, 'id' | 'createdAt'>): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase
        .from('hackathon_feedback')
        .insert([feedback])
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error submitting feedback:', error);
      return {
        success: false,
        error
      };
    }
  }

  async getFeedback(hackathonId: string): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase
        .from('hackathon_feedback')
        .select('*')
        .eq('hackathonId', hackathonId)
        .order('createdAt', { ascending: false });

      if (error) throw error;

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error fetching feedback:', error);
      return {
        success: false,
        error
      };
    }
  }

  // ==================== EMAIL NOTIFICATIONS ====================

  private async sendRegistrationEmail(email: string, name: string, hackathonTitle: string): Promise<void> {
    try {
      const { error } = await supabase.functions.invoke('send-hackathon-email', {
        body: {
          type: 'registration',
          email,
          name,
          hackathonTitle
        }
      });

      if (error) {
        console.error('Error sending registration email:', error);
      }
    } catch (error) {
      console.error('Error invoking email function:', error);
    }
  }

  private async sendStatusUpdateEmail(email: string, name: string, status: string, hackathonTitle: string): Promise<void> {
    try {
      const { error } = await supabase.functions.invoke('send-hackathon-email', {
        body: {
          type: 'status_update',
          email,
          name,
          status,
          hackathonTitle
        }
      });

      if (error) {
        console.error('Error sending status update email:', error);
      }
    } catch (error) {
      console.error('Error invoking email function:', error);
    }
  }

  private async sendSubmissionEmail(email: string, teamName: string, projectTitle: string): Promise<void> {
    try {
      const { error } = await supabase.functions.invoke('send-hackathon-email', {
        body: {
          type: 'submission',
          email,
          teamName,
          projectTitle
        }
      });

      if (error) {
        console.error('Error sending submission email:', error);
      }
    } catch (error) {
      console.error('Error invoking email function:', error);
    }
  }

  private async sendSubmissionStatusEmail(email: string, teamName: string, status: string, projectTitle: string): Promise<void> {
    try {
      const { error } = await supabase.functions.invoke('send-hackathon-email', {
        body: {
          type: 'submission_status',
          email,
          teamName,
          status,
          projectTitle
        }
      });

      if (error) {
        console.error('Error sending submission status email:', error);
      }
    } catch (error) {
      console.error('Error invoking email function:', error);
    }
  }

  // ==================== UTILITY METHODS ====================

  async checkRegistrationStatus(email: string, hackathonId: string): Promise<ApiResponse> {
    try {
      const { data, error } = await supabase
        .from('hackathon_registrations')
        .select('status')
        .eq('email', email)
        .eq('hackathonId', hackathonId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      return {
        success: true,
        data: data ? data.status : null
      };
    } catch (error) {
      console.error('Error checking registration status:', error);
      return {
        success: false,
        error
      };
    }
  }

  async getHackathonStats(hackathonId: string): Promise<ApiResponse> {
    try {
      const { data: registrations } = await supabase
        .from('hackathon_registrations')
        .select('status')
        .eq('hackathonId', hackathonId);

      const { data: submissions } = await supabase
        .from('hackathon_submissions')
        .select('status')
        .eq('hackathonId', hackathonId);

      const stats = {
        totalRegistrations: registrations?.length || 0,
        approvedRegistrations: registrations?.filter(r => r.status === 'approved').length || 0,
        pendingRegistrations: registrations?.filter(r => r.status === 'pending').length || 0,
        totalSubmissions: submissions?.length || 0,
        shortlistedSubmissions: submissions?.filter(s => s.status === 'shortlisted').length || 0,
        finalistSubmissions: submissions?.filter(s => s.status === 'finalist').length || 0
      };

      return {
        success: true,
        data: stats
      };
    } catch (error) {
      console.error('Error fetching hackathon stats:', error);
      return {
        success: false,
        error
      };
    }
  }
}

export default new HackathonService();
