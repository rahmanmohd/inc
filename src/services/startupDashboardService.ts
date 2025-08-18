import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ysxtcljsclkoatngtihl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzeHRjbGpzY2xrb2F0bmd0aWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4NDE5NjYsImV4cCI6MjA3MDQxNzk2Nn0.TLkkrBzwj6g6vQ-Hh52qBvRjYvAnHRTExf2CR2WqtIY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: any;
}

class StartupDashboardService {
  // Get user applications for dashboard
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

  // ==================== COFOUNDER POST API ====================

  // Submit cofounder post
  async submitCofounderPost(postData: any): Promise<ApiResponse<any>> {
    try {
      const { data, error } = await supabase
        .from('cofounder_posts')
        .insert([{
          user_id: postData.user_id,
          title: postData.title,
          role_type: postData.role,
          description: postData.description,
          experience_required: postData.experience,
          equity_offering: postData.equity,
          required_skills: postData.skills,
          location: postData.location,
          commitment: postData.commitment,
          salary: postData.salary,
          status: 'active',
          applications_count: 0
        }])
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('Error submitting cofounder post:', error);
      return {
        success: false,
        message: 'Failed to submit cofounder post',
        error
      };
    }
  }

  // ==================== INVESTMENT APPLICATION API ====================

  // Submit investment application
  async submitInvestmentApplication(applicationData: any): Promise<ApiResponse<any>> {
    try {
      const { data, error } = await supabase
        .from('investment_applications')
        .insert([{
          applicant_id: applicationData.applicant_id,
          user_id: applicationData.user_id,
          investor_name: applicationData.investor,
          target_investor: applicationData.investor,
          funding_amount: applicationData.amount,
          funding_stage: applicationData.stage,
          current_valuation: applicationData.valuation,
          use_of_funds: applicationData.use_of_funds,
          business_model: applicationData.business_model,
          monthly_revenue: applicationData.revenue,
          user_traction: applicationData.traction,
          team_size: applicationData.team_size,
          pitch_deck_url: applicationData.pitch_deck_url,
          financial_statements_url: applicationData.financials_url,
          status: 'pending'
        }])
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('Error submitting investment application:', error);
      return {
        success: false,
        message: 'Failed to submit investment application',
        error
      };
    }
  }

  // ==================== DEALS API ====================

  // Get all active deals
  async getActiveDeals(): Promise<ApiResponse<any[]>> {
    try {
      // Mock deals data - in real implementation, this would come from a deals table
      const mockDeals = [
        { 
          id: 1, 
          title: "AWS Credits", 
          value: "₹50,000", 
          status: "Active", 
          expires: "Jan 15, 2025",
          description: "Get AWS credits for your startup infrastructure",
          category: "Cloud Services",
          requirements: "Early-stage startup",
          application_count: 45
        },
        { 
          id: 2, 
          title: "Google Cloud Credits", 
          value: "₹30,000", 
          status: "Active", 
          expires: "Feb 10, 2025",
          description: "Google Cloud Platform credits for development",
          category: "Cloud Services",
          requirements: "Tech startup",
          application_count: 32
        },
        { 
          id: 3, 
          title: "Notion Pro", 
          value: "₹12,000", 
          status: "Active", 
          expires: "Dec 31, 2024",
          description: "Free Notion Pro subscription for team collaboration",
          category: "Productivity",
          requirements: "Team size 5+",
          application_count: 28
        },
        { 
          id: 4, 
          title: "Stripe Payment Processing", 
          value: "₹25,000", 
          status: "Active", 
          expires: "Mar 20, 2025",
          description: "Reduced transaction fees for payment processing",
          category: "Fintech",
          requirements: "E-commerce startup",
          application_count: 15
        },
        { 
          id: 5, 
          title: "HubSpot CRM", 
          value: "₹18,000", 
          status: "Active", 
          expires: "Apr 15, 2025",
          description: "Free HubSpot CRM for customer management",
          category: "Marketing",
          requirements: "B2B startup",
          application_count: 22
        }
      ];

      return {
        success: true,
        data: mockDeals
      };
    } catch (error) {
      console.error('Error fetching active deals:', error);
      return {
        success: false,
        message: 'Failed to fetch active deals',
        error
      };
    }
  }

  // Apply for a deal
  async applyForDeal(dealId: number, userId: string, applicationData: any): Promise<ApiResponse<any>> {
    try {
      // Mock deal application - in real implementation, this would insert into a deal_applications table
      const mockApplication = {
        id: Math.random().toString(36).substr(2, 9),
        deal_id: dealId,
        user_id: userId,
        status: 'pending',
        applied_at: new Date().toISOString(),
        ...applicationData
      };

      return {
        success: true,
        data: mockApplication
      };
    } catch (error) {
      console.error('Error applying for deal:', error);
      return {
        success: false,
        message: 'Failed to apply for deal',
        error
      };
    }
  }

  // ==================== APPLICATION UPDATE API ====================

  // Get user's applications for updating
  async getUserApplicationsForUpdate(userId: string): Promise<ApiResponse<any>> {
    try {
      const [
        incubationResponse,
        investmentResponse,
        programResponse,
        mentorResponse
      ] = await Promise.all([
        supabase.from('incubation_applications').select('*').eq('applicant_id', userId).order('created_at', { ascending: false }),
        supabase.from('investment_applications').select('*').eq('applicant_id', userId).order('created_at', { ascending: false }),
        supabase.from('program_applications').select('*').eq('applicant_id', userId).order('created_at', { ascending: false }),
        supabase.from('mentor_applications').select('*').eq('user_id', userId).order('created_at', { ascending: false })
      ]);

      return {
        success: true,
        data: {
          incubation: incubationResponse.data || [],
          investment: investmentResponse.data || [],
          program: programResponse.data || [],
          mentor: mentorResponse.data || []
        }
      };
    } catch (error) {
      console.error('Error fetching user applications for update:', error);
      return {
        success: false,
        message: 'Failed to fetch applications for update',
        error
      };
    }
  }

  // Update application
  async updateApplication(applicationId: string, applicationType: string, updateData: any): Promise<ApiResponse<any>> {
    try {
      let tableName = '';
      let idField = 'id';

      switch (applicationType) {
        case 'incubation':
          tableName = 'incubation_applications';
          break;
        case 'investment':
          tableName = 'investment_applications';
          break;
        case 'program':
          tableName = 'program_applications';
          break;
        case 'mentor':
          tableName = 'mentor_applications';
          break;
        default:
          throw new Error('Invalid application type');
      }

      const { data, error } = await supabase
        .from(tableName)
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq(idField, applicationId)
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        data: data
      };
    } catch (error) {
      console.error('Error updating application:', error);
      return {
        success: false,
        message: 'Failed to update application',
        error
      };
    }
  }
}

export default new StartupDashboardService();
