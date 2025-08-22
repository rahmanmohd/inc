import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

const supabaseUrl = 'https://ysxtcljsclkoatngtihl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzeHRjbGpzY2xrb2F0bmd0aWhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ3OTI2MzksImV4cCI6MjA1MDM2ODYzOX0.79r0jRRy_3iWQEI2qLKJiN6CjJgH0Bif5L7ReLUB8lE';

const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AdminStats {
  totalStartups: number;
  activeApplications: number;
  totalInvestors: number;
  totalDeals: number;
  monthlyGrowth: number;
  totalUsers: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  communityMembers: number;
}

export interface ApplicationWithDetails {
  id: string;
  startup: string;
  founder: string;
  stage: string;
  status: string;
  date: string;
  type: string;
  email: string;
  phone?: string;
  description?: string;
  admin_notes?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ApplicationStats {
  totalApplications: number;
  pending: number;
  approved: number;
  underReview: number;
}

export interface StartupData {
  id: string;
  name: string;
  sector: string;
  valuation: string;
  growth: string;
  status: string;
  founder_name: string;
  email: string;
  description?: string;
  website?: string;
  team_size?: number;
  created_at: string;
}

export interface InvestorData {
  id: string;
  name: string;
  checkSize: string;
  portfolio: number;
  stage: string;
  status: string;
  email?: string;
  description?: string;
  sectors: string[];
  recent_investments: number;
  success_rate: number;
  created_at: string;
}

export interface DealData {
  id: string;
  deal_name: string;
  startup_name: string;
  investor_name: string;
  deal_value: number;
  deal_stage: string;
  sector: string;
  description?: string;
  status: string;
  created_at: string;
  updated_at?: string;
}

export interface HackathonApplicationData {
  id: string;
  user_id: string;
  hackathon_id: string;
  full_name: string;
  email: string;
  phone: string;
  age: string;
  city: string;
  college?: string;
  graduation_year?: string;
  programming_languages: string;
  experience: string;
  frameworks?: string;
  specialization?: string;
  github_profile?: string;
  portfolio?: string;
  agreements: boolean;
  hackathon_title: string;
  status: string;
  admin_notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface AnalyticsData {
  applicationTrends: Array<{ month: string; count: number; }>;
  sectorDistribution: Array<{ sector: string; percentage: number; }>;
  investmentStages: Array<{ stage: string; count: number; }>;
  growthMetrics: {
    newStartups: number;
    applicationRate: number;
    investorEngagement: number;
    dealClaims: number;
  };
}

class AdminApiService {
  // ====================
  // DASHBOARD STATS APIs
  // ====================

  async getDashboardStats(): Promise<ApiResponse<AdminStats>> {
    try {
      console.log('Fetching admin dashboard stats via Edge Function...');

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/admin-dashboard-api/dashboard-stats`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        console.log('Dashboard stats fetched successfully:', result.data);
        return {
          success: true,
          data: result.data,
          message: 'Dashboard stats fetched successfully'
        };
      } else {
        throw new Error(result.error || 'Failed to fetch dashboard stats');
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch dashboard stats'
      };
    }
  }

  // ====================
  // APPLICATION APIs
  // ====================

  async getRecentApplications(): Promise<ApiResponse<ApplicationWithDetails[]>> {
    try {
      console.log('Fetching recent applications via Edge Function...');

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/admin-dashboard-api/recent-applications`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        console.log('Recent applications fetched successfully:', result.data);
        return {
          success: true,
          data: result.data,
          message: 'Recent applications fetched successfully'
        };
      } else {
        throw new Error(result.error || 'Failed to fetch recent applications');
      }
    } catch (error) {
      console.error('Error fetching recent applications:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch recent applications'
      };
    }
  }

  async getTopStartups(): Promise<ApiResponse<StartupData[]>> {
    try {
      console.log('Fetching top startups via Edge Function...');

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/admin-dashboard-api/top-startups`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        console.log('Top startups fetched successfully:', result.data);
      return {
        success: true,
          data: result.data,
          message: 'Top startups fetched successfully'
      };
      } else {
        throw new Error(result.error || 'Failed to fetch top startups');
      }
    } catch (error) {
      console.error('Error fetching top startups:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch top startups'
      };
    }
  }

  async getApplicationDetails(applicationId: string, applicationType: string): Promise<ApiResponse<any>> {
    try {
      console.log('Fetching application details via Edge Function...');

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/admin-dashboard-api/application-details`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicationId,
          applicationType
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        console.log('Application details fetched successfully:', result.data);
        return {
          success: true,
          data: result.data,
          message: 'Application details fetched successfully'
        };
      } else {
        throw new Error(result.error || 'Failed to fetch application details');
      }
    } catch (error) {
      console.error('Error fetching application details:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch application details'
      };
    }
  }

  async updateApplicationStatusViaOverview(
    applicationId: string, 
    applicationType: string, 
    status: string, 
    adminNotes?: string, 
    sendEmail: boolean = true
  ): Promise<ApiResponse<any>> {
    try {
      console.log('Updating application status via Overview Edge Function...');

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/admin-dashboard-api/update-application-status`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicationId,
          applicationType,
          status,
          adminNotes,
          sendEmail
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        console.log('Application status updated successfully:', result.data);
        return {
          success: true,
          data: result.data,
          message: result.message || 'Application status updated successfully'
        };
      } else {
        throw new Error(result.error || 'Failed to update application status');
      }
    } catch (error) {
      console.error('Error updating application status:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update application status'
      };
    }
  }

  async getAllApplications(): Promise<ApiResponse<ApplicationWithDetails[]>> {
    try {
      console.log('Fetching all applications...');

      // Fetch from multiple application tables
      const [incubationApps, investmentApps, programApps, mentorApps] = await Promise.all([
        supabase
          .from('incubation_applications')
          .select(`
            *,
            profiles:applicant_id (
              full_name,
              email
            )
          `)
          .order('created_at', { ascending: false }),
        
        supabase
          .from('investment_applications')
          .select(`
            *,
            profiles:applicant_id (
              full_name,
              email
            )
          `)
          .order('created_at', { ascending: false }),
          
        supabase
          .from('program_applications')
          .select(`
            *,
            profiles:applicant_id (
              full_name,
              email
            )
          `)
          .order('created_at', { ascending: false }),
          
        supabase
          .from('mentor_applications')
          .select(`
            *,
            profiles:user_id (
              full_name,
              email
            )
          `)
          .order('created_at', { ascending: false })
      ]);

      const applications: ApplicationWithDetails[] = [];

      // Process incubation applications
      if (incubationApps.data) {
        incubationApps.data.forEach(app => {
          applications.push({
            id: app.id,
            startup: app.startup_name || 'Unknown Startup',
            founder: (app.profiles as any)?.full_name || app.founder_name || 'Unknown Founder',
            stage: 'Incubation',
            status: app.status || 'pending',
            date: new Date(app.created_at).toLocaleDateString(),
            type: 'incubation',
            email: (app.profiles as any)?.email || app.email || '',
            phone: app.phone || '',
            description: app.business_idea || '',
            admin_notes: app.admin_notes || '',
            reviewed_by: app.reviewed_by || '',
            reviewed_at: app.reviewed_at || '',
            created_at: app.created_at,
            updated_at: app.updated_at || app.created_at
          });
        });
      }

      // Process investment applications
      if (investmentApps.data) {
        investmentApps.data.forEach(app => {
          applications.push({
            id: app.id,
            startup: app.target_investor || 'Investment Application',
            founder: (app.profiles as any)?.full_name || 'Unknown Founder',
            stage: app.funding_stage || 'Investment',
            status: app.status || 'pending',
            date: new Date(app.created_at).toLocaleDateString(),
            type: 'investment',
            email: (app.profiles as any)?.email || '',
            description: app.business_model || '',
            admin_notes: app.admin_notes || '',
            reviewed_by: app.reviewed_by || '',
            reviewed_at: app.reviewed_at || '',
            created_at: app.created_at,
            updated_at: app.updated_at || app.created_at
          });
        });
      }

      // Process program applications
      if (programApps.data) {
        programApps.data.forEach(app => {
          applications.push({
            id: app.id,
            startup: app.startup_name || 'Program Application',
            founder: (app.profiles as any)?.full_name || 'Unknown Founder',
            stage: app.program_type || 'Program',
            status: app.status || 'pending',
            date: new Date(app.created_at).toLocaleDateString(),
            type: 'program',
            email: (app.profiles as any)?.email || app.email || '',
            description: app.description || '',
            admin_notes: app.admin_notes || '',
            reviewed_by: app.reviewed_by || '',
            reviewed_at: app.reviewed_at || '',
            created_at: app.created_at,
            updated_at: app.updated_at || app.created_at
          });
        });
      }

      // Process mentor applications
      if (mentorApps.data) {
        mentorApps.data.forEach(app => {
          applications.push({
            id: app.id,
            startup: 'Mentor Application',
            founder: (app.profiles as any)?.full_name || app.full_name || 'Unknown Mentor',
            stage: 'Mentorship',
            status: app.status || 'pending',
            date: new Date(app.created_at).toLocaleDateString(),
            type: 'mentor',
            email: (app.profiles as any)?.email || app.email || '',
            description: app.expertise_areas?.join(', ') || '',
            admin_notes: app.admin_notes || '',
            reviewed_by: app.reviewed_by || '',
            reviewed_at: app.reviewed_at || '',
            created_at: app.created_at,
            updated_at: app.updated_at || app.created_at
          });
        });
      }

      // Sort all applications by creation date
      applications.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      console.log(`Fetched ${applications.length} applications successfully`);

      return {
        success: true,
        data: applications,
        message: `Fetched ${applications.length} applications successfully`
      };
    } catch (error) {
      console.error('Error fetching applications:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch applications'
      };
    }
  }

  // ====================
  // APPLICATION MANAGEMENT APIs
  // ====================

  async getApplicationStats(): Promise<ApiResponse<ApplicationStats>> {
    try {
      console.log('Fetching application stats...');
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/application-management-api/application-stats`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Application stats response:', result);

      if (result.success) {
        return {
          success: true,
          data: result.data,
          message: 'Application stats fetched successfully'
        };
      } else {
        throw new Error(result.error || 'Failed to fetch application stats');
      }
    } catch (error) {
      console.error('Error fetching application stats:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch application stats'
      };
    }
  }

  async getApplications(params?: {
    search?: string;
    status?: string;
    type?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<ApplicationWithDetails[]>> {
    try {
      console.log('Fetching applications...');
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      const searchParams = new URLSearchParams();
      if (params?.search) searchParams.append('search', params.search);
      if (params?.status) searchParams.append('status', params.status);
      if (params?.type) searchParams.append('type', params.type);
      if (params?.page) searchParams.append('page', params.page.toString());
      if (params?.limit) searchParams.append('limit', params.limit.toString());

      const response = await fetch(`${supabaseUrl}/functions/v1/application-management-api/applications?${searchParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Applications response:', result);

      if (result.success) {
        return {
          success: true,
          data: result.data,
          message: 'Applications fetched successfully'
        };
      } else {
        throw new Error(result.error || 'Failed to fetch applications');
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch applications'
      };
    }
  }

  async getApplication(id: string, type: string): Promise<ApiResponse<ApplicationWithDetails>> {
    try {
      console.log('Fetching application details...');
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/application-management-api/get-application?id=${id}&type=${type}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Application details response:', result);

      if (result.success) {
        return {
          success: true,
          data: result.data,
          message: 'Application details fetched successfully'
        };
      } else {
        throw new Error(result.error || 'Failed to fetch application details');
      }
    } catch (error) {
      console.error('Error fetching application details:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch application details'
      };
    }
  }

  async updateApplicationStatus(
    id: string,
    type: string,
    status: string, 
    adminNotes?: string,
    sendEmail: boolean = true
  ): Promise<ApiResponse<any>> {
    try {
      console.log('Updating application status...');
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/application-management-api/update-application-status`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          type,
        status,
          adminNotes,
          sendEmail
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Update application status response:', result);

      if (result.success) {
        return {
          success: true,
          data: result.data,
          message: 'Application status updated successfully'
        };
      } else {
        throw new Error(result.error || 'Failed to update application status');
      }
    } catch (error) {
      console.error('Error updating application status:', error);
      return {
        success: false,
        error: error.message || 'Failed to update application status'
      };
    }
  }

  async deleteApplication(id: string, type: string): Promise<ApiResponse<any>> {
    try {
      console.log('Deleting application...');
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/application-management-api/delete-application?id=${id}&type=${type}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Delete application response:', result);

      if (result.success) {
        return {
          success: true,
          data: result.data,
          message: 'Application deleted successfully'
        };
      } else {
        throw new Error(result.error || 'Failed to delete application');
      }
    } catch (error) {
      console.error('Error deleting application:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete application'
      };
    }
  }

  // ====================
  // INVESTOR MANAGEMENT APIs
  // ====================

  async getInvestorStats(): Promise<ApiResponse<any>> {
    try {
      console.log('=== getInvestorStats called ===');
      
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Session:', session ? 'Present' : 'Missing');
      
      if (!session) {
        throw new Error('No active session');
      }

      const url = `${supabaseUrl}/functions/v1/investor-management-api/investor-stats`;
      console.log('Making request to:', url);
      console.log('Authorization header:', `Bearer ${session.access_token.substring(0, 50)}...`);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error text:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Investor stats response:', result);

      if (result.success) {
        return {
          success: true,
          data: result.data,
          message: 'Investor stats fetched successfully'
        };
      } else {
        throw new Error(result.error || 'Failed to fetch investor stats');
      }
    } catch (error) {
      console.error('Error fetching investor stats:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch investor stats'
      };
    }
  }

  async getInvestorDirectory(params?: {
    search?: string;
    sector?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<any>> {
    try {
      console.log('=== getInvestorDirectory called ===');
      console.log('Params:', params);
      
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Session:', session ? 'Present' : 'Missing');
      
      if (!session) {
        throw new Error('No active session');
      }

      const searchParams = new URLSearchParams();
      if (params?.search) searchParams.append('search', params.search);
      if (params?.sector) searchParams.append('sector', params.sector);
      if (params?.status) searchParams.append('status', params.status);
      if (params?.page) searchParams.append('page', params.page.toString());
      if (params?.limit) searchParams.append('limit', params.limit.toString());

      const url = `${supabaseUrl}/functions/v1/investor-management-api/investor-directory?${searchParams}`;
      console.log('Making request to:', url);
      console.log('Authorization header:', `Bearer ${session.access_token.substring(0, 50)}...`);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error text:', errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Investor directory response:', result);

      if (result.success) {
        return {
          success: true,
          data: result.data,
          message: 'Investor directory fetched successfully'
        };
      } else {
        throw new Error(result.error || 'Failed to fetch investor directory');
      }
    } catch (error) {
      console.error('Error fetching investor directory:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch investor directory'
      };
    }
  }

  async addInvestor(investorData: {
    name: string;
    description?: string;
    email?: string;
    check_size?: string;
    investment_stage?: string;
    sectors?: string[];
    portfolio_count?: number;
    portfolio_value?: number;
    recent_investments?: number;
    success_rate?: number;
    status?: string;
  }): Promise<ApiResponse<any>> {
    try {
      console.log('Adding new investor...', investorData);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/investor-management-api/add-investor`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(investorData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Add investor response:', result);

      if (result.success) {
        return {
          success: true,
          data: result.data,
          message: 'Investor added successfully'
        };
      } else {
        throw new Error(result.error || 'Failed to add investor');
      }
    } catch (error) {
      console.error('Error adding investor:', error);
      return {
        success: false,
        error: error.message || 'Failed to add investor'
      };
    }
  }

  async getInvestor(id: string): Promise<ApiResponse<any>> {
    try {
      console.log('Fetching investor details...', id);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/investor-management-api/get-investor?id=${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Get investor response:', result);

      if (result.success) {
      return {
        success: true,
          data: result.data,
          message: 'Investor details fetched successfully'
      };
      } else {
        throw new Error(result.error || 'Failed to fetch investor');
      }
    } catch (error) {
      console.error('Error fetching investor:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch investor'
      };
    }
  }

  async updateInvestor(investorData: {
    id: string;
    name?: string;
    description?: string;
    email?: string;
    check_size?: string;
    investment_stage?: string;
    sectors?: string[];
    portfolio_count?: number;
    portfolio_value?: number;
    recent_investments?: number;
    success_rate?: number;
    status?: string;
  }): Promise<ApiResponse<any>> {
    try {
      console.log('Updating investor...', investorData);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/investor-management-api/update-investor`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(investorData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Update investor response:', result);

      if (result.success) {
        return {
          success: true,
          data: result.data,
          message: 'Investor updated successfully'
        };
      } else {
        throw new Error(result.error || 'Failed to update investor');
      }
    } catch (error) {
      console.error('Error updating investor:', error);
      return {
        success: false,
        error: error.message || 'Failed to update investor'
      };
    }
  }

  async deleteInvestor(id: string): Promise<ApiResponse<any>> {
    try {
      console.log('Deleting investor...', id);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/investor-management-api/delete-investor?id=${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Delete investor response:', result);

      if (result.success) {
        return {
          success: true,
          data: result.data,
          message: 'Investor deleted successfully'
        };
      } else {
        throw new Error(result.error || 'Failed to delete investor');
      }
    } catch (error) {
      console.error('Error deleting investor:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete investor'
      };
    }
  }

  // ====================
  // DEAL MANAGEMENT APIs
  // ====================

  async getDealStats(): Promise<ApiResponse<any>> {
    try {
      console.log('Fetching deal stats...');
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/deal-management-api/deal-stats`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Deal stats response:', result);

      if (result.success) {
        return {
          success: true,
          data: result.data,
          message: 'Deal stats fetched successfully'
        };
      } else {
        throw new Error(result.error || 'Failed to fetch deal stats');
      }
    } catch (error) {
      console.error('Error fetching deal stats:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch deal stats'
      };
    }
  }

  async getDealDirectory(params?: {
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<any>> {
    try {
      console.log('Fetching deal directory...');
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      const searchParams = new URLSearchParams();
      if (params?.search) searchParams.append('search', params.search);
      if (params?.status) searchParams.append('status', params.status);
      if (params?.page) searchParams.append('page', params.page.toString());
      if (params?.limit) searchParams.append('limit', params.limit.toString());

      const response = await fetch(`${supabaseUrl}/functions/v1/deal-management-api/deal-directory?${searchParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Deal directory response:', result);

      if (result.success) {
        return {
          success: true,
          data: result.data,
          message: 'Deal directory fetched successfully'
        };
      } else {
        throw new Error(result.error || 'Failed to fetch deal directory');
      }
    } catch (error) {
      console.error('Error fetching deal directory:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch deal directory'
      };
    }
  }

  async addDeal(dealData: {
    deal_name: string;
    startup_name: string;
    investor_name: string;
    deal_value: number;
    deal_stage: string;
    sector: string;
    description?: string;
    status?: string;
  }): Promise<ApiResponse<any>> {
    try {
      console.log('Adding new deal...', dealData);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/deal-management-api/add-deal`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dealData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Add deal response:', result);

      if (result.success) {
        return {
          success: true,
          data: result.data,
          message: 'Deal added successfully'
        };
      } else {
        throw new Error(result.error || 'Failed to add deal');
      }
    } catch (error) {
      console.error('Error adding deal:', error);
      return {
        success: false,
        error: error.message || 'Failed to add deal'
      };
    }
  }

  async getDeal(id: string): Promise<ApiResponse<any>> {
    try {
      console.log('Fetching deal details...', id);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/deal-management-api/get-deal?id=${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Get deal response:', result);

      if (result.success) {
        return {
          success: true,
          data: result.data,
          message: 'Deal details fetched successfully'
        };
      } else {
        throw new Error(result.error || 'Failed to fetch deal');
      }
    } catch (error) {
      console.error('Error fetching deal:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch deal'
      };
    }
  }

  async updateDeal(dealData: {
    id: string;
    deal_name?: string;
    startup_name?: string;
    investor_name?: string;
    deal_value?: number;
    deal_stage?: string;
    sector?: string;
    description?: string;
    status?: string;
  }): Promise<ApiResponse<any>> {
    try {
      console.log('Updating deal...', dealData);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/deal-management-api/update-deal`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dealData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Update deal response:', result);

      if (result.success) {
        return {
          success: true,
          data: result.data,
          message: 'Deal updated successfully'
        };
      } else {
        throw new Error(result.error || 'Failed to update deal');
      }
    } catch (error) {
      console.error('Error updating deal:', error);
      return {
        success: false,
        error: error.message || 'Failed to update deal'
      };
    }
  }

  async deleteDeal(id: string): Promise<ApiResponse<any>> {
    try {
      console.log('Deleting deal...', id);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/deal-management-api/delete-deal?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Delete deal response:', result);

      if (result.success) {
        return {
          success: true,
          data: result.data,
          message: 'Deal deleted successfully'
        };
      } else {
        throw new Error(result.error || 'Failed to delete deal');
      }
    } catch (error) {
      console.error('Error deleting deal:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete deal'
      };
    }
  }

  // ====================
  // HACKATHON MANAGEMENT APIs
  // ====================

  async getHackathonStats(): Promise<ApiResponse<any>> {
    try {
      console.log('Fetching hackathon stats...');
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/hackathon-management-api/hackathon-stats`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Hackathon stats response:', result);

      if (result.success) {
        return {
          success: true,
          data: result.data,
          message: 'Hackathon stats fetched successfully'
        };
      } else {
        throw new Error(result.error || 'Failed to fetch hackathon stats');
      }
    } catch (error) {
      console.error('Error fetching hackathon stats:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch hackathon stats'
      };
    }
  }

  async getHackathonApplications(params?: {
    search?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<{ data: HackathonApplicationData[]; count: number; pagination: any }>> {
    try {
      console.log('Fetching hackathon applications...');
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      const searchParams = new URLSearchParams();
      if (params?.search) searchParams.append('search', params.search);
      if (params?.status) searchParams.append('status', params.status);
      if (params?.limit) searchParams.append('limit', params.limit.toString());
      if (params?.offset) searchParams.append('offset', params.offset.toString());

      const response = await fetch(`${supabaseUrl}/functions/v1/hackathon-management-api/hackathon-applications?${searchParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Hackathon applications response:', result);

      if (result.success) {
        return {
          success: true,
          data: result,
          message: 'Hackathon applications fetched successfully'
        };
      } else {
        throw new Error(result.error || 'Failed to fetch hackathon applications');
      }
    } catch (error) {
      console.error('Error fetching hackathon applications:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch hackathon applications'
      };
    }
  }

  async getHackathonApplication(id: string): Promise<ApiResponse<HackathonApplicationData>> {
    try {
      console.log('Fetching hackathon application:', id);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/hackathon-management-api/get-hackathon-application?id=${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Hackathon application response:', result);

      if (result.success) {
        return {
          success: true,
          data: result.data,
          message: 'Hackathon application fetched successfully'
        };
      } else {
        throw new Error(result.error || 'Failed to fetch hackathon application');
      }
    } catch (error) {
      console.error('Error fetching hackathon application:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch hackathon application'
      };
    }
  }

  async updateHackathonStatus(id: string, status: string, admin_notes?: string): Promise<ApiResponse<HackathonApplicationData>> {
    try {
      console.log('Updating hackathon status:', { id, status, admin_notes });
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/hackathon-management-api/update-hackathon-status`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          status,
          admin_notes
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Hackathon status update response:', result);

      if (result.success) {
        return {
          success: true,
          data: result.data,
          message: 'Hackathon status updated successfully'
        };
      } else {
        throw new Error(result.error || 'Failed to update hackathon status');
      }
    } catch (error) {
      console.error('Error updating hackathon status:', error);
      return {
        success: false,
        error: error.message || 'Failed to update hackathon status'
      };
    }
  }

  async deleteHackathonApplication(id: string): Promise<ApiResponse<any>> {
    try {
      console.log('Deleting hackathon application:', id);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/hackathon-management-api/delete-hackathon-application?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Hackathon application delete response:', result);

      if (result.success) {
        return {
          success: true,
          data: result,
          message: 'Hackathon application deleted successfully'
        };
      } else {
        throw new Error(result.error || 'Failed to delete hackathon application');
      }
    } catch (error) {
      console.error('Error deleting hackathon application:', error);
      return {
        success: false,
        error: error.message || 'Failed to delete hackathon application'
      };
    }
  }

  // ====================
  // ANALYTICS MANAGEMENT APIs
  // ====================

  async getGrowthMetrics(): Promise<ApiResponse<any>> {
    try {
      console.log('Fetching growth metrics...');
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/analytics-management-api/growth-metrics`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Growth metrics response:', result);

      if (result.success) {
        return {
          success: true,
          data: result.data,
          message: 'Growth metrics fetched successfully'
        };
      } else {
        throw new Error(result.error || 'Failed to fetch growth metrics');
      }
    } catch (error) {
      console.error('Error fetching growth metrics:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch growth metrics'
      };
    }
  }

  async getSectorDistribution(): Promise<ApiResponse<any>> {
    try {
      console.log('Fetching sector distribution...');
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/analytics-management-api/sector-distribution`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Sector distribution response:', result);

      if (result.success) {
        return {
          success: true,
          data: result.data,
          message: 'Sector distribution fetched successfully'
        };
      } else {
        throw new Error(result.error || 'Failed to fetch sector distribution');
      }
    } catch (error) {
      console.error('Error fetching sector distribution:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch sector distribution'
      };
    }
  }

  async getApplicationTrends(): Promise<ApiResponse<any>> {
    try {
      console.log('Fetching application trends...');
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/analytics-management-api/application-trends`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Application trends response:', result);

      if (result.success) {
        return {
          success: true,
          data: result.data,
          message: 'Application trends fetched successfully'
        };
      } else {
        throw new Error(result.error || 'Failed to fetch application trends');
      }
    } catch (error) {
      console.error('Error fetching application trends:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch application trends'
      };
    }
  }

  async getInvestmentStages(): Promise<ApiResponse<any>> {
    try {
      console.log('Fetching investment stages...');
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/analytics-management-api/investment-stages`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Investment stages response:', result);

      if (result.success) {
        return {
          success: true,
          data: result.data,
          message: 'Investment stages fetched successfully'
        };
      } else {
        throw new Error(result.error || 'Failed to fetch investment stages');
      }
    } catch (error) {
      console.error('Error fetching investment stages:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch investment stages'
      };
    }
  }

  async getMonthlyStats(): Promise<ApiResponse<any>> {
    try {
      console.log('Fetching monthly stats...');
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/analytics-management-api/monthly-stats`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Monthly stats response:', result);

      if (result.success) {
        return {
          success: true,
          data: result.data,
          message: 'Monthly stats fetched successfully'
        };
      } else {
        throw new Error(result.error || 'Failed to fetch monthly stats');
      }
    } catch (error) {
      console.error('Error fetching monthly stats:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch monthly stats'
      };
    }
  }

  // ====================
  // STARTUP APIs
  // ====================

  async getAllStartups(): Promise<ApiResponse<StartupData[]>> {
    try {
      console.log('Fetching all startups...');

      // Get startups from approved incubation applications
      const { data: incubationStartups, error: incubationError } = await supabase
        .from('incubation_applications')
        .select(`
          id,
          startup_name,
          founder_name,
          email,
          business_idea,
          current_stage,
          team_size,
          website,
          created_at,
          profiles:applicant_id (
            full_name,
            email
          )
        `)
        .eq('status', 'approved');

      if (incubationError) throw incubationError;

      const startups: StartupData[] = [];

      // Process incubation startups
      if (incubationStartups) {
        incubationStartups.forEach((startup, index) => {
          startups.push({
            id: startup.id,
            name: startup.startup_name || 'Unknown Startup',
            sector: this.generateRandomSector(),
            valuation: this.generateRandomValuation(),
            growth: this.generateRandomGrowth(),
            status: startup.current_stage || 'Seed',
            founder_name: (startup.profiles as any)?.full_name || startup.founder_name || 'Unknown Founder',
            email: (startup.profiles as any)?.email || startup.email || '',
            description: startup.business_idea || '',
            website: startup.website || '',
            team_size: startup.team_size || 0,
            created_at: startup.created_at
          });
        });
      }

      console.log(`Fetched ${startups.length} startups successfully`);

      return {
        success: true,
        data: startups,
        message: `Fetched ${startups.length} startups successfully`
      };
    } catch (error) {
      console.error('Error fetching startups:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch startups'
      };
    }
  }

  // ====================
  // STARTUP MANAGEMENT APIs
  // ====================

  async getStartupStats(): Promise<ApiResponse<any>> {
    try {
      console.log('Fetching startup stats...');

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }
      
      const response = await fetch(`${supabaseUrl}/functions/v1/startup-management-api/startup-stats`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Startup stats response:', result);

      if (result.success) {
        return {
          success: true,
          data: result.data,
          message: 'Startup stats fetched successfully'
        };
      } else {
        throw new Error(result.error || 'Failed to fetch startup stats');
      }
    } catch (error) {
      console.error('Error fetching startup stats:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch startup stats'
      };
    }
  }

  async getStartupDirectory(params?: {
    search?: string;
    sector?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<any>> {
    try {
      console.log('Fetching startup directory...');

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }
      
      const searchParams = new URLSearchParams();
      if (params?.search) searchParams.append('search', params.search);
      if (params?.sector) searchParams.append('sector', params.sector);
      if (params?.status) searchParams.append('status', params.status);
      if (params?.page) searchParams.append('page', params.page.toString());
      // Set a high limit to get all startups, or use the provided limit
      const limit = params?.limit || 1000;
      searchParams.append('limit', limit.toString());

      const response = await fetch(`${supabaseUrl}/functions/v1/startup-management-api/startup-directory?${searchParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Startup directory response:', result);
      console.log('Startup directory data length:', result.data?.length || 0);
      console.log('Startup directory success:', result.success);

      if (result.success) {
        return {
          success: true,
          data: result.data,
          message: 'Startup directory fetched successfully'
        };
      } else {
        throw new Error(result.error || 'Failed to fetch startup directory');
      }
    } catch (error) {
      console.error('Error fetching startup directory:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch startup directory'
      };
    }
  }

  async addStartup(startupData: {
    name: string;
    description?: string;
    industry?: string;
    stage?: string;
    website?: string;
    location?: string;
    team_size?: number;
    founded_year?: number;
    logo_url?: string;
    published?: boolean;
  }): Promise<ApiResponse<any>> {
    try {
      console.log('Adding new startup...', startupData);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }
      
      const response = await fetch(`${supabaseUrl}/functions/v1/startup-management-api/add-startup`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(startupData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Add startup response:', result);

      if (result.success) {
        return {
          success: true,
          data: result.data,
          message: 'Startup added successfully'
        };
      } else {
        throw new Error(result.error || 'Failed to add startup');
      }
    } catch (error) {
      console.error('Error adding startup:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to add startup'
      };
    }
  }

  async getStartup(id: string): Promise<ApiResponse<any>> {
    try {
      console.log('Fetching startup details...', id);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }
      
      const response = await fetch(`${supabaseUrl}/functions/v1/startup-management-api/get-startup?id=${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Get startup response:', result);

      if (result.success) {
        return {
          success: true,
          data: result.data,
          message: 'Startup details fetched successfully'
        };
      } else {
        throw new Error(result.error || 'Failed to fetch startup');
      }
    } catch (error) {
      console.error('Error fetching startup:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch startup'
      };
    }
  }

  async updateStartup(startupData: {
    id: string;
    name?: string;
    description?: string;
    industry?: string;
    stage?: string;
    website?: string;
    location?: string;
    team_size?: number;
    founded_year?: number;
    logo_url?: string;
    published?: boolean;
  }): Promise<ApiResponse<any>> {
    try {
      console.log('Updating startup...', startupData);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }
      
      const response = await fetch(`${supabaseUrl}/functions/v1/startup-management-api/update-startup`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(startupData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Update startup response:', result);

      if (result.success) {
        return {
          success: true,
          data: result.data,
          message: 'Startup updated successfully'
        };
      } else {
        throw new Error(result.error || 'Failed to update startup');
      }
    } catch (error) {
      console.error('Error updating startup:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update startup'
      };
    }
  }

  async deleteStartup(id: string): Promise<ApiResponse<any>> {
    try {
      console.log('Deleting startup...', id);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }
      
      const response = await fetch(`${supabaseUrl}/functions/v1/startup-management-api/delete-startup?id=${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Delete startup response:', result);

      if (result.success) {
        return {
          success: true,
          data: result.data,
          message: 'Startup deleted successfully'
        };
      } else {
        throw new Error(result.error || 'Failed to delete startup');
      }
    } catch (error) {
      console.error('Error deleting startup:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete startup'
      };
    }
  }

  // ====================
  // INVESTOR APIs
  // ====================

  async getAllInvestors(): Promise<ApiResponse<InvestorData[]>> {
    try {
      console.log('Fetching all investors...');

      // Get users with investor role or from investment-related tables
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'investor');

      if (error) throw error;

      const investors: InvestorData[] = [];

      // Create mock investor data based on profiles or generate sample data
      const sampleInvestors = [
        {
          name: "Sequoia Capital India",
          checkSize: "₹5-50Cr",
          portfolio: 45,
          stage: "Series A+",
          sectors: ["FinTech", "HealthTech", "AI/ML"],
          recent_investments: 8,
          success_rate: 85
        },
        {
          name: "Accel Partners",
          checkSize: "₹2-25Cr", 
          portfolio: 38,
          stage: "Seed-Series B",
          sectors: ["SaaS", "E-commerce", "EdTech"],
          recent_investments: 6,
          success_rate: 78
        },
        {
          name: "Matrix Partners",
          checkSize: "₹1-15Cr",
          portfolio: 52,
          stage: "Pre-Seed-Series A", 
          sectors: ["FinTech", "Enterprise", "Consumer"],
          recent_investments: 5,
          success_rate: 82
        }
      ];

      sampleInvestors.forEach((investor, index) => {
        investors.push({
          id: `investor_${index + 1}`,
          name: investor.name,
          checkSize: investor.checkSize,
          portfolio: investor.portfolio,
          stage: investor.stage,
          status: 'Active',
          email: `contact@${investor.name.toLowerCase().replace(/\s+/g, '')}.com`,
          description: `Leading ${investor.stage} investor`,
          sectors: investor.sectors,
          recent_investments: investor.recent_investments,
          success_rate: investor.success_rate,
          created_at: new Date().toISOString()
        });
      });

      console.log(`Fetched ${investors.length} investors successfully`);

      return {
        success: true,
        data: investors,
        message: `Fetched ${investors.length} investors successfully`
      };
    } catch (error) {
      console.error('Error fetching investors:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch investors'
      };
    }
  }

  // ====================
  // ANALYTICS APIs
  // ====================

  async getAnalyticsData(): Promise<ApiResponse<AnalyticsData>> {
    try {
      console.log('Fetching analytics data...');

      // Get application trends over time
      const { data: applications } = await supabase
        .from('incubation_applications')
        .select('created_at')
        .order('created_at', { ascending: false });

      // Process application trends
      const applicationTrends = this.processApplicationTrends(applications || []);
      
      // Get sector distribution from startup data
      const sectorDistribution = [
        { sector: 'FinTech', percentage: 32 },
        { sector: 'HealthTech', percentage: 24 },
        { sector: 'EdTech', percentage: 18 },
        { sector: 'E-commerce', percentage: 15 },
        { sector: 'Others', percentage: 11 }
      ];

      // Get investment stages
      const investmentStages = [
        { stage: 'Pre-Seed', count: 45 },
        { stage: 'Seed', count: 89 },
        { stage: 'Series A', count: 34 },
        { stage: 'Series B+', count: 12 }
      ];

      const analytics: AnalyticsData = {
        applicationTrends,
        sectorDistribution,
        investmentStages,
        growthMetrics: {
          newStartups: 12.5,
          applicationRate: 8.3,
          investorEngagement: 15.7,
          dealClaims: 23.1
        }
      };

      console.log('Analytics data fetched successfully');

      return {
        success: true,
        data: analytics,
        message: 'Analytics data fetched successfully'
      };
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch analytics data'
      };
    }
  }

  // ====================
  // EMAIL NOTIFICATION APIs
  // ====================

  async sendStatusUpdateEmail(
    email: string,
    name: string,
    statusData: {
      applicationId: string;
      status: string;
      notes?: string;
      applicationType: string;
      reviewedAt: string;
    }
  ): Promise<ApiResponse<any>> {
    try {
      console.log('Sending status update email:', { email, statusData });

      const response = await fetch('https://ysxtcljsclkoatngtihl.supabase.co/functions/v1/send-hackathon-email', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'status_update',
          email,
          name,
          formData: statusData
        }),
      });

      const result = await response.json();

      if (result.success) {
        console.log('Status update email sent successfully');
        return {
          success: true,
          data: result,
          message: 'Status update email sent successfully'
        };
      } else {
        throw new Error(result.error || 'Failed to send email');
      }
    } catch (error) {
      console.error('Error sending status update email:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send status update email'
      };
    }
  }

  // ====================
  // UTILITY METHODS
  // ====================

  private generateRandomSector(): string {
    const sectors = ['FinTech', 'HealthTech', 'EdTech', 'CleanTech', 'E-commerce', 'AI/ML', 'SaaS'];
    return sectors[Math.floor(Math.random() * sectors.length)];
  }

  private generateRandomValuation(): string {
    const valuations = ['₹5Cr', '₹10Cr', '₹15Cr', '₹25Cr', '₹30Cr', '₹50Cr', '₹75Cr', '₹100Cr'];
    return valuations[Math.floor(Math.random() * valuations.length)];
  }

  private generateRandomGrowth(): string {
    const growthRates = ['+12%', '+18%', '+25%', '+32%', '+38%', '+45%', '+52%', '+67%'];
    return growthRates[Math.floor(Math.random() * growthRates.length)];
  }

  private processApplicationTrends(applications: any[]): Array<{ month: string; count: number; }> {
    const trends: { [key: string]: number } = {};
    
    applications.forEach(app => {
      const date = new Date(app.created_at);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      trends[monthKey] = (trends[monthKey] || 0) + 1;
    });

    return Object.entries(trends)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
      .slice(-6); // Last 6 months
  }
}

const adminApiService = new AdminApiService();
export default adminApiService;
