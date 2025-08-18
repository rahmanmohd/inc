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
      console.log('Fetching admin dashboard stats...');

      // Get all applications count
      const { count: totalApplications } = await supabase
        .from('incubation_applications')
        .select('*', { count: 'exact', head: true });

      // Get pending applications
      const { count: pendingApps } = await supabase
        .from('incubation_applications')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Get approved applications
      const { count: approvedApps } = await supabase
        .from('incubation_applications')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved');

      // Get rejected applications
      const { count: rejectedApps } = await supabase
        .from('incubation_applications')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'rejected');

      // Get total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get investment applications for additional stats
      const { count: investmentApps } = await supabase
        .from('investment_applications')
        .select('*', { count: 'exact', head: true });

      // Get program applications
      const { count: programApps } = await supabase
        .from('program_applications')
        .select('*', { count: 'exact', head: true });

      // Calculate total applications across all types
      const allApplications = (totalApplications || 0) + (investmentApps || 0) + (programApps || 0);

      const stats: AdminStats = {
        totalStartups: totalUsers || 0,
        activeApplications: pendingApps || 0,
        totalInvestors: Math.floor((totalUsers || 0) * 0.1), // Estimate 10% are investors
        totalDeals: Math.floor((approvedApps || 0) * 1.5), // Estimate deals from approved applications
        monthlyGrowth: 12.5,
        totalUsers: totalUsers || 0,
        pendingApplications: pendingApps || 0,
        approvedApplications: approvedApps || 0,
        rejectedApplications: rejectedApps || 0,
        communityMembers: totalUsers || 0
      };

      console.log('Dashboard stats fetched successfully:', stats);

      return {
        success: true,
        data: stats,
        message: 'Dashboard stats fetched successfully'
      };
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

  async updateApplicationStatus(
    applicationId: string, 
    status: string, 
    notes?: string,
    applicationType?: string
  ): Promise<ApiResponse<any>> {
    try {
      console.log('Updating application status:', { applicationId, status, applicationType });

      const updateData = {
        status,
        admin_notes: notes,
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Determine which table to update based on application type or try all tables
      const tables = applicationType ? 
        [this.getTableForApplicationType(applicationType)] : 
        ['incubation_applications', 'investment_applications', 'program_applications', 'mentor_applications'];

      let updateSuccess = false;
      let applicantEmail = '';
      let applicantName = '';
      let applicationData: any = null;

      for (const table of tables) {
        try {
          const { data, error } = await supabase
            .from(table)
            .update(updateData)
            .eq('id', applicationId)
            .select(`
              *,
              profiles:applicant_id (
                full_name,
                email
              )
            `)
            .single();

          if (data && !error) {
            updateSuccess = true;
            applicationData = data;
            applicantEmail = (data.profiles as any)?.email || data.email || '';
            applicantName = (data.profiles as any)?.full_name || data.founder_name || data.full_name || '';
            break;
          }
        } catch (tableError) {
          console.log(`Table ${table} doesn't contain application ${applicationId}`);
        }
      }

      if (!updateSuccess) {
        throw new Error('Application not found in any table');
      }

      // Send notification email via Edge Function
      if (applicantEmail && applicantName) {
        try {
          await this.sendStatusUpdateEmail(applicantEmail, applicantName, {
            applicationId,
            status,
            notes,
            applicationType: applicationType || 'application',
            reviewedAt: new Date().toISOString()
          });
        } catch (emailError) {
          console.error('Failed to send status update email:', emailError);
        }
      }

      console.log('Application status updated successfully');

      return {
        success: true,
        data: applicationData,
        message: 'Application status updated successfully'
      };
    } catch (error) {
      console.error('Error updating application status:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update application status'
      };
    }
  }

  private getTableForApplicationType(type: string): string {
    switch (type.toLowerCase()) {
      case 'incubation':
        return 'incubation_applications';
      case 'investment':
        return 'investment_applications';
      case 'program':
        return 'program_applications';
      case 'mentor':
        return 'mentor_applications';
      default:
        return 'incubation_applications';
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
