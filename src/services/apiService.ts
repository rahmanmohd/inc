import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// Initialize Supabase client with typed database
const supabaseUrl = 'https://ysxtcljsclkoatngtihl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzeHRjbGpzY2xrb2F0bmd0aWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4NDE5NjYsImV4cCI6MjA3MDQxNzk2Nn0.TLkkrBzwj6g6vQ-Hh52qBvRjYvAnHRTExf2CR2WqtIY';

const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Type aliases for better readability
type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

type Startup = Database['public']['Tables']['startups']['Row'];
type StartupInsert = Database['public']['Tables']['startups']['Insert'];
type StartupUpdate = Database['public']['Tables']['startups']['Update'];

type BlogPost = Database['public']['Tables']['blog_posts']['Row'];
type BlogPostInsert = Database['public']['Tables']['blog_posts']['Insert'];
type BlogPostUpdate = Database['public']['Tables']['blog_posts']['Update'];

type NewsPost = Database['public']['Tables']['news_posts']['Row'];
type NewsPostInsert = Database['public']['Tables']['news_posts']['Insert'];
type NewsPostUpdate = Database['public']['Tables']['news_posts']['Update'];

type Event = Database['public']['Tables']['events']['Row'];
type EventInsert = Database['public']['Tables']['events']['Insert'];
type EventUpdate = Database['public']['Tables']['events']['Update'];

type Resource = Database['public']['Tables']['resources']['Row'];
type ResourceInsert = Database['public']['Tables']['resources']['Insert'];
type ResourceUpdate = Database['public']['Tables']['resources']['Update'];

type HackathonRegistration = Database['public']['Tables']['hackathon_registrations']['Row'];
type HackathonRegistrationInsert = Database['public']['Tables']['hackathon_registrations']['Insert'];
type HackathonRegistrationUpdate = Database['public']['Tables']['hackathon_registrations']['Update'];

type HackathonTeam = Database['public']['Tables']['hackathon_teams']['Row'];
type HackathonTeamInsert = Database['public']['Tables']['hackathon_teams']['Insert'];
type HackathonTeamUpdate = Database['public']['Tables']['hackathon_teams']['Update'];

type IncubationApplication = Database['public']['Tables']['incubation_applications']['Row'];
type IncubationApplicationInsert = Database['public']['Tables']['incubation_applications']['Insert'];
type IncubationApplicationUpdate = Database['public']['Tables']['incubation_applications']['Update'];

type InvestmentApplication = Database['public']['Tables']['investment_applications']['Row'];
type InvestmentApplicationInsert = Database['public']['Tables']['investment_applications']['Insert'];
type InvestmentApplicationUpdate = Database['public']['Tables']['investment_applications']['Update'];

type MentorApplication = Database['public']['Tables']['mentor_applications']['Row'];
type MentorApplicationInsert = Database['public']['Tables']['mentor_applications']['Insert'];
type MentorApplicationUpdate = Database['public']['Tables']['mentor_applications']['Update'];

type MentorProfile = Database['public']['Tables']['mentor_profiles']['Row'];
type MentorProfileInsert = Database['public']['Tables']['mentor_profiles']['Insert'];
type MentorProfileUpdate = Database['public']['Tables']['mentor_profiles']['Update'];

type InvestorProfile = Database['public']['Tables']['investor_profiles']['Row'];
type InvestorProfileInsert = Database['public']['Tables']['investor_profiles']['Insert'];
type InvestorProfileUpdate = Database['public']['Tables']['investor_profiles']['Update'];

type Consultation = Database['public']['Tables']['consultations']['Row'];
type ConsultationInsert = Database['public']['Tables']['consultations']['Insert'];
type ConsultationUpdate = Database['public']['Tables']['consultations']['Update'];

type DealOffer = Database['public']['Tables']['deals_offers']['Row'];
type DealOfferInsert = Database['public']['Tables']['deals_offers']['Insert'];
type DealOfferUpdate = Database['public']['Tables']['deals_offers']['Update'];

type CofounderPost = Database['public']['Tables']['cofounder_posts']['Row'];
type CofounderPostInsert = Database['public']['Tables']['cofounder_posts']['Insert'];
type CofounderPostUpdate = Database['public']['Tables']['cofounder_posts']['Update'];

type Cohort = Database['public']['Tables']['cohorts']['Row'];
type CohortInsert = Database['public']['Tables']['cohorts']['Insert'];
type CohortUpdate = Database['public']['Tables']['cohorts']['Update'];

type ProgramApplication = Database['public']['Tables']['program_applications']['Row'];
type ProgramApplicationInsert = Database['public']['Tables']['program_applications']['Insert'];
type ProgramApplicationUpdate = Database['public']['Tables']['program_applications']['Update'];

type GrantApplication = Database['public']['Tables']['grant_applications']['Row'];
type GrantApplicationInsert = Database['public']['Tables']['grant_applications']['Insert'];
type GrantApplicationUpdate = Database['public']['Tables']['grant_applications']['Update'];

type PartnershipRequest = Database['public']['Tables']['partnership_requests']['Row'];
type PartnershipRequestInsert = Database['public']['Tables']['partnership_requests']['Insert'];
type PartnershipRequestUpdate = Database['public']['Tables']['partnership_requests']['Update'];

type ContactMessage = Database['public']['Tables']['contact_messages']['Row'];
type ContactMessageInsert = Database['public']['Tables']['contact_messages']['Insert'];

// Generic API Response type
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: any;
}

// Generic API Service class
class ApiService {
  // ==================== PROFILES API ====================
  
  async getProfile(userId: string): Promise<ApiResponse<Profile>> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error fetching profile:', error);
      return { success: false, error };
    }
  }

  async updateProfile(userId: string, updates: ProfileUpdate): Promise<ApiResponse<Profile>> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { success: false, error };
    }
  }

  async getProfilesByRole(role: Profile['role']): Promise<ApiResponse<Profile[]>> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', role)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error fetching profiles by role:', error);
      return { success: false, error };
    }
  }

  // ==================== STARTUPS API ====================
  
  async getStartups(published?: boolean): Promise<ApiResponse<Startup[]>> {
    try {
      let query = supabase
        .from('startups')
        .select('*')
        .order('created_at', { ascending: false });

      if (published !== undefined) {
        query = query.eq('published', published);
      }

      const { data, error } = await query;

      if (error) throw error;

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error fetching startups:', error);
      return { success: false, error };
    }
  }

  async getStartupById(id: string): Promise<ApiResponse<Startup>> {
    try {
      const { data, error } = await supabase
        .from('startups')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error fetching startup:', error);
      return { success: false, error };
    }
  }

  async createStartup(startup: StartupInsert): Promise<ApiResponse<Startup>> {
    try {
      const { data, error } = await supabase
        .from('startups')
        .insert([startup])
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error creating startup:', error);
      return { success: false, error };
    }
  }

  async updateStartup(id: string, updates: StartupUpdate): Promise<ApiResponse<Startup>> {
    try {
      const { data, error } = await supabase
        .from('startups')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error updating startup:', error);
      return { success: false, error };
    }
  }

  async deleteStartup(id: string): Promise<ApiResponse<void>> {
    try {
      const { error } = await supabase
        .from('startups')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error deleting startup:', error);
      return { success: false, error };
    }
  }

  // ==================== BLOG POSTS API ====================
  
  async getBlogPosts(published?: boolean): Promise<ApiResponse<BlogPost[]>> {
    try {
      let query = supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (published !== undefined) {
        query = query.eq('published', published);
      }

      const { data, error } = await query;

      if (error) throw error;

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      return { success: false, error };
    }
  }

  async getBlogPostById(id: string): Promise<ApiResponse<BlogPost>> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error fetching blog post:', error);
      return { success: false, error };
    }
  }

  async getBlogPostBySlug(slug: string): Promise<ApiResponse<BlogPost>> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error fetching blog post by slug:', error);
      return { success: false, error };
    }
  }

  async createBlogPost(post: BlogPostInsert): Promise<ApiResponse<BlogPost>> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert([post])
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error creating blog post:', error);
      return { success: false, error };
    }
  }

  async updateBlogPost(id: string, updates: BlogPostUpdate): Promise<ApiResponse<BlogPost>> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error updating blog post:', error);
      return { success: false, error };
    }
  }

  // ==================== NEWS POSTS API ====================
  
  async getNewsPosts(published?: boolean): Promise<ApiResponse<NewsPost[]>> {
    try {
      let query = supabase
        .from('news_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (published !== undefined) {
        query = query.eq('published', published);
      }

      const { data, error } = await query;

      if (error) throw error;

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error fetching news posts:', error);
      return { success: false, error };
    }
  }

  async getNewsPostById(id: string): Promise<ApiResponse<NewsPost>> {
    try {
      const { data, error } = await supabase
        .from('news_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error fetching news post:', error);
      return { success: false, error };
    }
  }

  async getNewsPostBySlug(slug: string): Promise<ApiResponse<NewsPost>> {
    try {
      const { data, error } = await supabase
        .from('news_posts')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error fetching news post by slug:', error);
      return { success: false, error };
    }
  }

  // ==================== EVENTS API ====================
  
  async getEvents(published?: boolean): Promise<ApiResponse<Event[]>> {
    try {
      let query = supabase
        .from('events')
        .select('*')
        .order('starts_at', { ascending: true });

      if (published !== undefined) {
        query = query.eq('published', published);
      }

      const { data, error } = await query;

      if (error) throw error;

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error fetching events:', error);
      return { success: false, error };
    }
  }

  async getEventById(id: string): Promise<ApiResponse<Event>> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error fetching event:', error);
      return { success: false, error };
    }
  }

  async getEventsByType(type: Event['type']): Promise<ApiResponse<Event[]>> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('type', type)
        .eq('published', true)
        .order('starts_at', { ascending: true });

      if (error) throw error;

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error fetching events by type:', error);
      return { success: false, error };
    }
  }

  // ==================== RESOURCES API ====================
  
  async getResources(published?: boolean): Promise<ApiResponse<Resource[]>> {
    try {
      let query = supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false });

      if (published !== undefined) {
        query = query.eq('published', published);
      }

      const { data, error } = await query;

      if (error) throw error;

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error fetching resources:', error);
      return { success: false, error };
    }
  }

  async getResourcesByType(type: Resource['type']): Promise<ApiResponse<Resource[]>> {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('type', type)
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error fetching resources by type:', error);
      return { success: false, error };
    }
  }

  // ==================== HACKATHON API ====================
  
  async registerForHackathon(registration: HackathonRegistrationInsert): Promise<ApiResponse<HackathonRegistration>> {
    try {
      // Insert registration (allow multiple registrations per user)
      const { data, error } = await supabase
        .from('hackathon_registrations')
        .insert([registration])
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error registering for hackathon:', error);
      return { success: false, error };
    }
  }

  async getHackathonRegistrations(): Promise<ApiResponse<HackathonRegistration[]>> {
    try {
      const { data, error } = await supabase
        .from('hackathon_registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error fetching hackathon registrations:', error);
      return { success: false, error };
    }
  }

  async createHackathonTeam(team: HackathonTeamInsert): Promise<ApiResponse<HackathonTeam>> {
    try {
      const { data, error } = await supabase
        .from('hackathon_teams')
        .insert([team])
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error creating hackathon team:', error);
      return { success: false, error };
    }
  }

  async getHackathonTeams(): Promise<ApiResponse<HackathonTeam[]>> {
    try {
      const { data, error } = await supabase
        .from('hackathon_teams')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error fetching hackathon teams:', error);
      return { success: false, error };
    }
  }

  // ==================== APPLICATIONS API ====================
  
  async submitIncubationApplication(application: IncubationApplicationInsert): Promise<ApiResponse<IncubationApplication>> {
    try {
      const { data, error } = await supabase
        .from('incubation_applications')
        .insert([application])
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error submitting incubation application:', error);
      return { success: false, error };
    }
  }

  async getIncubationApplications(): Promise<ApiResponse<IncubationApplication[]>> {
    try {
      const { data, error } = await supabase
        .from('incubation_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error fetching incubation applications:', error);
      return { success: false, error };
    }
  }

  async submitInvestmentApplication(application: InvestmentApplicationInsert): Promise<ApiResponse<InvestmentApplication>> {
    try {
      const { data, error } = await supabase
        .from('investment_applications')
        .insert([application])
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error submitting investment application:', error);
      return { success: false, error };
    }
  }

  async getInvestmentApplications(): Promise<ApiResponse<InvestmentApplication[]>> {
    try {
      const { data, error } = await supabase
        .from('investment_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error fetching investment applications:', error);
      return { success: false, error };
    }
  }

  async submitMentorApplication(application: MentorApplicationInsert): Promise<ApiResponse<MentorApplication>> {
    try {
      const { data, error } = await supabase
        .from('mentor_applications')
        .insert([application])
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error submitting mentor application:', error);
      return { success: false, error };
    }
  }

  async getMentorApplications(): Promise<ApiResponse<MentorApplication[]>> {
    try {
      const { data, error } = await supabase
        .from('mentor_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error fetching mentor applications:', error);
      return { success: false, error };
    }
  }

  async submitProgramApplication(application: ProgramApplicationInsert): Promise<ApiResponse<ProgramApplication>> {
    try {
      const { data, error } = await supabase
        .from('program_applications')
        .insert([application])
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error submitting program application:', error);
      return { success: false, error };
    }
  }

  async getProgramApplications(): Promise<ApiResponse<ProgramApplication[]>> {
    try {
      const { data, error } = await supabase
        .from('program_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error fetching program applications:', error);
      return { success: false, error };
    }
  }

  async submitGrantApplication(application: GrantApplicationInsert): Promise<ApiResponse<GrantApplication>> {
    try {
      const { data, error } = await supabase
        .from('grant_applications')
        .insert([application])
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error submitting grant application:', error);
      return { success: false, error };
    }
  }

  async getGrantApplications(): Promise<ApiResponse<GrantApplication[]>> {
    try {
      const { data, error } = await supabase
        .from('grant_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error fetching grant applications:', error);
      return { success: false, error };
    }
  }

  // ==================== PROFILES API ====================
  
  async getMentorProfiles(published?: boolean): Promise<ApiResponse<MentorProfile[]>> {
    try {
      let query = supabase
        .from('mentor_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (published !== undefined) {
        query = query.eq('published', published);
      }

      const { data, error } = await query;

      if (error) throw error;

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error fetching mentor profiles:', error);
      return { success: false, error };
    }
  }

  async getInvestorProfiles(published?: boolean): Promise<ApiResponse<InvestorProfile[]>> {
    try {
      let query = supabase
        .from('investor_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (published !== undefined) {
        query = query.eq('published', published);
      }

      const { data, error } = await query;

      if (error) throw error;

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error fetching investor profiles:', error);
      return { success: false, error };
    }
  }

  // ==================== CONSULTATIONS API ====================
  
  async submitConsultation(consultation: ConsultationInsert): Promise<ApiResponse<Consultation>> {
    try {
      const { data, error } = await supabase
        .from('consultations')
        .insert([consultation])
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error submitting consultation:', error);
      return { success: false, error };
    }
  }

  async getConsultations(): Promise<ApiResponse<Consultation[]>> {
    try {
      const { data, error } = await supabase
        .from('consultations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error fetching consultations:', error);
      return { success: false, error };
    }
  }

  // ==================== DEALS & OFFERS API ====================
  
  async getDealsOffers(published?: boolean): Promise<ApiResponse<DealOffer[]>> {
    try {
      let query = supabase
        .from('deals_offers')
        .select('*')
        .order('created_at', { ascending: false });

      if (published !== undefined) {
        query = query.eq('published', published);
      }

      const { data, error } = await query;

      if (error) throw error;

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error fetching deals and offers:', error);
      return { success: false, error };
    }
  }

  async createDealOffer(deal: DealOfferInsert): Promise<ApiResponse<DealOffer>> {
    try {
      const { data, error } = await supabase
        .from('deals_offers')
        .insert([deal])
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error creating deal offer:', error);
      return { success: false, error };
    }
  }

  // ==================== COFOUNDER POSTS API ====================
  
  async getCofounderPosts(published?: boolean): Promise<ApiResponse<CofounderPost[]>> {
    try {
      let query = supabase
        .from('cofounder_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (published !== undefined) {
        query = query.eq('published', published);
      }

      const { data, error } = await query;

      if (error) throw error;

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error fetching cofounder posts:', error);
      return { success: false, error };
    }
  }

  async createCofounderPost(post: CofounderPostInsert): Promise<ApiResponse<CofounderPost>> {
    try {
      const { data, error } = await supabase
        .from('cofounder_posts')
        .insert([post])
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error creating cofounder post:', error);
      return { success: false, error };
    }
  }

  // ==================== COHORTS API ====================
  
  async getCohorts(published?: boolean): Promise<ApiResponse<Cohort[]>> {
    try {
      let query = supabase
        .from('cohorts')
        .select('*')
        .order('created_at', { ascending: false });

      if (published !== undefined) {
        query = query.eq('published', published);
      }

      const { data, error } = await query;

      if (error) throw error;

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error fetching cohorts:', error);
      return { success: false, error };
    }
  }

  async getCurrentCohort(): Promise<ApiResponse<Cohort>> {
    try {
      const { data, error } = await supabase
        .from('cohorts')
        .select('*')
        .eq('is_current', true)
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error fetching current cohort:', error);
      return { success: false, error };
    }
  }

  // ==================== PARTNERSHIP REQUESTS API ====================
  
  async submitPartnershipRequest(request: PartnershipRequestInsert): Promise<ApiResponse<PartnershipRequest>> {
    try {
      const { data, error } = await supabase
        .from('partnership_requests')
        .insert([request])
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error submitting partnership request:', error);
      return { success: false, error };
    }
  }

  async getPartnershipRequests(): Promise<ApiResponse<PartnershipRequest[]>> {
    try {
      const { data, error } = await supabase
        .from('partnership_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error fetching partnership requests:', error);
      return { success: false, error };
    }
  }

  // ==================== CONTACT MESSAGES API ====================
  
  async submitContactMessage(message: ContactMessageInsert): Promise<ApiResponse<ContactMessage>> {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .insert([message])
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error submitting contact message:', error);
      return { success: false, error };
    }
  }

  async getContactMessages(): Promise<ApiResponse<ContactMessage[]>> {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      return { success: false, error };
    }
  }

  // ==================== UTILITY METHODS ====================
  
  // Ensure user profile exists
  async ensureUserProfile(userId: string, email: string): Promise<ApiResponse<Profile>> {
    try {
      // Check if profile exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existingProfile) {
        return { success: true, data: existingProfile };
      }

      // Create profile if it doesn't exist
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert([{
          id: userId,
          email: email,
          role: 'entrepreneur'
        }])
        .select()
        .single();

      if (createError) throw createError;

      return { success: true, data: newProfile };
    } catch (error) {
      console.error('Error ensuring user profile:', error);
      return { success: false, error };
    }
  }

  async searchContent(query: string, table: string): Promise<ApiResponse<any[]>> {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%,content.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { success: true, data: data || [] };
    } catch (error) {
      console.error('Error searching content:', error);
      return { success: false, error };
    }
  }

  async getStats(): Promise<ApiResponse<any>> {
    try {
      const [
        { count: profilesCount },
        { count: startupsCount },
        { count: blogPostsCount },
        { count: newsPostsCount },
        { count: eventsCount },
        { count: resourcesCount },
        { count: mentorApplicationsCount },
        { count: investmentApplicationsCount },
        { count: incubationApplicationsCount }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('startups').select('*', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
        supabase.from('news_posts').select('*', { count: 'exact', head: true }),
        supabase.from('events').select('*', { count: 'exact', head: true }),
        supabase.from('resources').select('*', { count: 'exact', head: true }),
        supabase.from('mentor_applications').select('*', { count: 'exact', head: true }),
        supabase.from('investment_applications').select('*', { count: 'exact', head: true }),
        supabase.from('incubation_applications').select('*', { count: 'exact', head: true })
      ]);

      return {
        success: true,
        data: {
          profiles: profilesCount || 0,
          startups: startupsCount || 0,
          blogPosts: blogPostsCount || 0,
          newsPosts: newsPostsCount || 0,
          events: eventsCount || 0,
          resources: resourcesCount || 0,
          mentorApplications: mentorApplicationsCount || 0,
          investmentApplications: investmentApplicationsCount || 0,
          incubationApplications: incubationApplicationsCount || 0
        }
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      return { success: false, error };
    }
  }

  async updateApplicationStatus(table: string, id: string, status: string, reviewerId?: string, decisionNote?: string): Promise<ApiResponse<any>> {
    try {
      const updates: any = { status };
      if (reviewerId) updates.reviewer_id = reviewerId;
      if (decisionNote) updates.decision_note = decisionNote;
      updates.reviewed_at = new Date().toISOString();

      const { data, error } = await supabase
        .from(table)
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error updating application status:', error);
      return { success: false, error };
    }
  }

  // ==================== USER APPLICATIONS API ====================
  
  // Get all applications for a specific user
  async getUserApplications(userId: string): Promise<ApiResponse<any>> {
    try {
      const [
        incubationResponse,
        investmentResponse,
        programResponse,
        mentorResponse,
        consultationResponse,
        hackathonResponse
      ] = await Promise.all([
        supabase.from('incubation_applications').select('*').eq('applicant_id', userId).order('created_at', { ascending: false }),
        supabase.from('investment_applications').select('*').eq('applicant_id', userId).order('created_at', { ascending: false }),
        supabase.from('program_applications').select('*').eq('applicant_id', userId).order('created_at', { ascending: false }),
        supabase.from('mentor_applications').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
        supabase.from('consultations').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
        supabase.from('hackathon_registrations').select('*').eq('user_id', userId).order('created_at', { ascending: false })
      ]);

      return {
        success: true,
        data: {
          incubation: incubationResponse.data || [],
          investment: investmentResponse.data || [],
          program: programResponse.data || [],
          mentor: mentorResponse.data || [],
          consultations: consultationResponse.data || [],
          hackathon: hackathonResponse.data || []
        }
      };
    } catch (error) {
      console.error('Error fetching user applications:', error);
      return { success: false, error };
    }
  }

  // Get application count for a user
  async getUserApplicationCount(userId: string): Promise<ApiResponse<any>> {
    try {
      const [
        { count: incubationCount },
        { count: investmentCount },
        { count: programCount },
        { count: mentorCount },
        { count: consultationCount },
        { count: hackathonCount }
      ] = await Promise.all([
        supabase.from('incubation_applications').select('*', { count: 'exact', head: true }).eq('applicant_id', userId),
        supabase.from('investment_applications').select('*', { count: 'exact', head: true }).eq('applicant_id', userId),
        supabase.from('program_applications').select('*', { count: 'exact', head: true }).eq('applicant_id', userId),
        supabase.from('mentor_applications').select('*', { count: 'exact', head: true }).eq('user_id', userId),
        supabase.from('consultations').select('*', { count: 'exact', head: true }).eq('user_id', userId),
        supabase.from('hackathon_registrations').select('*', { count: 'exact', head: true }).eq('user_id', userId)
      ]);

      return {
        success: true,
        data: {
          incubation: incubationCount || 0,
          investment: investmentCount || 0,
          program: programCount || 0,
          mentor: mentorCount || 0,
          consultations: consultationCount || 0,
          hackathon: hackathonCount || 0,
          total: (incubationCount || 0) + (investmentCount || 0) + (programCount || 0) + (mentorCount || 0) + (consultationCount || 0) + (hackathonCount || 0)
        }
      };
    } catch (error) {
      console.error('Error fetching user application count:', error);
      return { success: false, error };
    }
  }

  // ==================== ADMIN API ====================

  // Admin: Get all applications
  async getAllApplications(): Promise<ApiResponse<any[]>> {
    try {
      // Fetch from all application tables
      const [
        incubationApps,
        investmentApps,
        mentorApps,
        programApps,
        grantApps,
        partnershipApps,
        contactMessages,
        consultations,
        hackathonRegistrations
      ] = await Promise.all([
        supabase.from('incubation_applications').select('*').order('created_at', { ascending: false }),
        supabase.from('investment_applications').select('*').order('created_at', { ascending: false }),
        supabase.from('mentor_applications').select('*').order('created_at', { ascending: false }),
        supabase.from('program_applications').select('*').order('created_at', { ascending: false }),
        supabase.from('grant_applications').select('*').order('created_at', { ascending: false }),
        supabase.from('partnership_requests').select('*').order('created_at', { ascending: false }),
        supabase.from('contact_messages').select('*').order('created_at', { ascending: false }),
        supabase.from('consultations').select('*').order('created_at', { ascending: false }),
        supabase.from('hackathon_registrations').select('*').order('created_at', { ascending: false })
      ]);

      // Combine and format all applications
      const allApplications = [
        ...(incubationApps.data || []).map(app => ({ ...app, type: 'incubation' })),
        ...(investmentApps.data || []).map(app => ({ ...app, type: 'investment' })),
        ...(mentorApps.data || []).map(app => ({ ...app, type: 'mentor' })),
        ...(programApps.data || []).map(app => ({ ...app, type: 'program' })),
        ...(grantApps.data || []).map(app => ({ ...app, type: 'grant' })),
        ...(partnershipApps.data || []).map(app => ({ ...app, type: 'partnership' })),
        ...(contactMessages.data || []).map(app => ({ ...app, type: 'contact' })),
        ...(consultations.data || []).map(app => ({ ...app, type: 'consultation' })),
        ...(hackathonRegistrations.data || []).map(app => ({ ...app, type: 'hackathon' }))
      ];

      return {
        success: true,
        data: allApplications
      };
    } catch (error) {
      console.error('Error getting all applications:', error);
      return {
        success: false,
        message: 'Failed to get applications',
        error
      };
    }
  }

  // Admin: Get dashboard stats
  async getAdminDashboardStats(): Promise<ApiResponse<any>> {
    try {
      // Get counts from all tables
      const [
        incubationCount,
        investmentCount,
        mentorCount,
        programCount,
        grantCount,
        partnershipCount,
        contactCount,
        consultationCount,
        hackathonCount,
        userCount
      ] = await Promise.all([
        supabase.from('incubation_applications').select('id', { count: 'exact' }),
        supabase.from('investment_applications').select('id', { count: 'exact' }),
        supabase.from('mentor_applications').select('id', { count: 'exact' }),
        supabase.from('program_applications').select('id', { count: 'exact' }),
        supabase.from('grant_applications').select('id', { count: 'exact' }),
        supabase.from('partnership_requests').select('id', { count: 'exact' }),
        supabase.from('contact_messages').select('id', { count: 'exact' }),
        supabase.from('consultations').select('id', { count: 'exact' }),
        supabase.from('hackathon_registrations').select('id', { count: 'exact' }),
        supabase.from('profiles').select('id', { count: 'exact' })
      ]);

      const totalApplications = 
        (incubationCount.count || 0) +
        (investmentCount.count || 0) +
        (mentorCount.count || 0) +
        (programCount.count || 0) +
        (grantCount.count || 0) +
        (partnershipCount.count || 0) +
        (contactCount.count || 0) +
        (consultationCount.count || 0) +
        (hackathonCount.count || 0);

      // Get pending applications (status = 'pending')
      const [
        pendingIncubation,
        pendingInvestment,
        pendingMentor,
        pendingProgram,
        pendingGrant,
        pendingPartnership
      ] = await Promise.all([
        supabase.from('incubation_applications').select('id', { count: 'exact' }).eq('status', 'pending'),
        supabase.from('investment_applications').select('id', { count: 'exact' }).eq('status', 'pending'),
        supabase.from('mentor_applications').select('id', { count: 'exact' }).eq('status', 'pending'),
        supabase.from('program_applications').select('id', { count: 'exact' }).eq('status', 'pending'),
        supabase.from('grant_applications').select('id', { count: 'exact' }).eq('status', 'pending'),
        supabase.from('partnership_requests').select('id', { count: 'exact' }).eq('status', 'pending')
      ]);

      const pendingApplications = 
        (pendingIncubation.count || 0) +
        (pendingInvestment.count || 0) +
        (pendingMentor.count || 0) +
        (pendingProgram.count || 0) +
        (pendingGrant.count || 0) +
        (pendingPartnership.count || 0);

      // Get approved applications
      const [
        approvedIncubation,
        approvedInvestment,
        approvedMentor,
        approvedProgram,
        approvedGrant,
        approvedPartnership
      ] = await Promise.all([
        supabase.from('incubation_applications').select('id', { count: 'exact' }).eq('status', 'approved'),
        supabase.from('investment_applications').select('id', { count: 'exact' }).eq('status', 'approved'),
        supabase.from('mentor_applications').select('id', { count: 'exact' }).eq('status', 'approved'),
        supabase.from('program_applications').select('id', { count: 'exact' }).eq('status', 'approved'),
        supabase.from('grant_applications').select('id', { count: 'exact' }).eq('status', 'approved'),
        supabase.from('partnership_requests').select('id', { count: 'exact' }).eq('status', 'approved')
      ]);

      const approvedApplications = 
        (approvedIncubation.count || 0) +
        (approvedInvestment.count || 0) +
        (approvedMentor.count || 0) +
        (approvedProgram.count || 0) +
        (approvedGrant.count || 0) +
        (approvedPartnership.count || 0);

      // Get rejected applications
      const [
        rejectedIncubation,
        rejectedInvestment,
        rejectedMentor,
        rejectedProgram,
        rejectedGrant,
        rejectedPartnership
      ] = await Promise.all([
        supabase.from('incubation_applications').select('id', { count: 'exact' }).eq('status', 'rejected'),
        supabase.from('investment_applications').select('id', { count: 'exact' }).eq('status', 'rejected'),
        supabase.from('mentor_applications').select('id', { count: 'exact' }).eq('status', 'rejected'),
        supabase.from('program_applications').select('id', { count: 'exact' }).eq('status', 'rejected'),
        supabase.from('grant_applications').select('id', { count: 'exact' }).eq('status', 'rejected'),
        supabase.from('partnership_requests').select('id', { count: 'exact' }).eq('status', 'rejected')
      ]);

      const rejectedApplications = 
        (rejectedIncubation.count || 0) +
        (rejectedInvestment.count || 0) +
        (rejectedMentor.count || 0) +
        (rejectedProgram.count || 0) +
        (rejectedGrant.count || 0) +
        (rejectedPartnership.count || 0);

      return {
        success: true,
        data: {
          totalApplications,
          pendingApplications,
          approvedApplications,
          rejectedApplications,
          totalUsers: userCount.count || 0,
          recentSubmissions: 0 // TODO: Calculate recent submissions
        }
      };
    } catch (error) {
      console.error('Error getting admin dashboard stats:', error);
      return {
        success: false,
        message: 'Failed to get dashboard stats',
        error
      };
    }
  }

  // Admin: Update application status
  async updateApplicationStatus(applicationId: string, status: string, notes?: string): Promise<ApiResponse<any>> {
    try {
      // Determine which table the application belongs to based on the ID format or type
      // For now, we'll try to update all tables that might contain the application
      const tables = [
        'incubation_applications',
        'investment_applications', 
        'mentor_applications',
        'program_applications',
        'grant_applications',
        'partnership_requests'
      ];

      let updated = false;
      for (const table of tables) {
        const { data, error } = await supabase
          .from(table)
          .update({ 
            status: status,
            admin_notes: notes,
            updated_at: new Date().toISOString()
          })
          .eq('id', applicationId)
          .select();

        if (data && data.length > 0) {
          updated = true;
          break;
        }
      }

      if (!updated) {
        return {
          success: false,
          message: 'Application not found'
        };
      }

      return {
        success: true,
        data: { status, notes }
      };
    } catch (error) {
      console.error('Error updating application status:', error);
      return {
        success: false,
        message: 'Failed to update application status',
        error
      };
    }
  }

  // ==================== STARTUP DASHBOARD API ====================

  // Get cofounder posts
  async getCofounderPosts(): Promise<ApiResponse<any[]>> {
    try {
      const { data, error } = await supabase
        .from('cofounder_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return {
        success: true,
        data: data || []
      };
    } catch (error) {
      console.error('Error fetching cofounder posts:', error);
      return {
        success: false,
        message: 'Failed to fetch cofounder posts',
        error
      };
    }
  }

  // Get user activity
  async getUserActivity(userId: string): Promise<ApiResponse<any[]>> {
    try {
      // This would typically come from an activity_log table
      // For now, we'll create mock activity based on user applications
      const { data: applications, error } = await supabase
        .from('incubation_applications')
        .select('*')
        .eq('applicant_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;

      // Create activity entries from applications
      const activities = (applications || []).map((app, index) => ({
        id: `activity_${app.id}`,
        type: 'application',
        message: `Application ${app.status === 'pending' ? 'submitted' : app.status}`,
        created_at: app.created_at
      }));

      return {
        success: true,
        data: activities
      };
    } catch (error) {
      console.error('Error fetching user activity:', error);
      return {
        success: false,
        message: 'Failed to fetch user activity',
        error
      };
    }
  }

  // Get user deals (mock data for now)
  async getUserDeals(userId: string): Promise<ApiResponse<any[]>> {
    try {
      // Mock deals data - in real implementation, this would come from a deals table
      const mockDeals = [
        { id: 1, title: "AWS Credits", value: "₹50,000", status: "Active", expires: "Jan 15, 2025" },
        { id: 2, title: "Google Cloud Credits", value: "₹30,000", status: "Active", expires: "Feb 10, 2025" },
        { id: 3, title: "Notion Pro", value: "₹12,000", status: "Claimed", expires: "Dec 31, 2024" }
      ];

      return {
        success: true,
        data: mockDeals
      };
    } catch (error) {
      console.error('Error fetching user deals:', error);
      return {
        success: false,
        message: 'Failed to fetch user deals',
        error
      };
    }
  }

  // Get user dashboard stats
  async getUserDashboardStats(userId: string): Promise<ApiResponse<any>> {
    try {
      const [
        applicationsResponse,
        cofounderResponse,
        dealsResponse
      ] = await Promise.all([
        this.getUserApplications(userId),
        this.getCofounderPosts(),
        this.getUserDeals(userId)
      ]);

      const apps = applicationsResponse.success ? applicationsResponse.data : {};
      const cofounderPosts = cofounderResponse.success ? cofounderResponse.data : [];
      const deals = dealsResponse.success ? dealsResponse.data : [];

      const userPosts = cofounderPosts.filter((post: any) => post.user_id === userId);
      const activeDeals = deals.filter((deal: any) => deal.status === "Active");

      const stats = {
        activeDeals: activeDeals.length,
        dealsValue: "₹2.5L+", // Calculate from actual deals
        investmentApps: apps.investment?.length || 0,
        totalApplied: "₹7.5Cr", // Calculate from actual applications
        cofounderPosts: userPosts.length,
        applicationsReceived: userPosts.reduce((sum: number, post: any) => sum + (post.applications_count || 0), 0)
      };

      return {
        success: true,
        data: stats
      };
    } catch (error) {
      console.error('Error fetching user dashboard stats:', error);
      return {
        success: false,
        message: 'Failed to fetch dashboard stats',
        error
      };
    }
  }
}

export default new ApiService();
