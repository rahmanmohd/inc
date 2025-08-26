import { supabase } from '@/lib/supabase';

// Types for Investor Dashboard
export interface InvestorProfile {
  id: string;
  user_id: string;
  name: string;
  organization: string;
  bio: string;
  investment_thesis: string;
  stages: string[];
  sectors: string[];
  ticket_min: string;
  ticket_max: string;
  website: string;
  logo_url: string;
  linkedin: string;
  twitter: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface PortfolioCompany {
  id: string;
  investor_id: string;
  startup_id: string;
  startup_name: string;
  sector: string;
  investment_amount: number;
  current_valuation: number;
  investment_date: string;
  stage: string;
  status: 'active' | 'exited' | 'under_review' | 'dormant';
  growth_percentage: number;
  ownership_percentage: number;
  created_at: string;
  updated_at: string;
  startup?: {
    name: string;
    description: string;
    industry: string;
    location: string;
    website: string;
    logo_url: string;
    team_size: number;
    founded_year: number;
    metrics: any;
  };
}

export interface DealPipeline {
  id: string;
  investor_id: string;
  company_name: string;
  sector: string;
  requested_amount: number;
  stage: 'initial_review' | 'due_diligence' | 'term_sheet' | 'negotiation' | 'closed';
  progress: number;
  founded_year: number;
  team_size: number;
  revenue: string;
  description: string;
  pitch_deck_url: string;
  financials_url: string;
  status: 'active' | 'on_hold' | 'rejected' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  author_id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  cover_image_url: string;
  tags: string[];
  published: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
  author?: {
    first_name: string;
    last_name: string;
    organization: string;
  };
}

export interface InvestmentMetrics {
  total_invested: number;
  current_portfolio_value: number;
  average_roi: number;
  success_rate: number;
  total_portfolio_count: number;
  active_investments_count: number;
  successful_exits_count: number;
}

export interface NewDealOpportunity {
  id: string;
  company_name: string;
  sector: string;
  stage: string;
  requested_amount: number;
  description: string;
  match_score: number;
  created_at: string;
  source?: 'admin_deal' | 'application';
}

class InvestorDashboardService {
  // Get investor profile
  async getInvestorProfile(userId: string): Promise<InvestorProfile | null> {
    try {
      const { data, error } = await supabase
        .from('investor_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching investor profile:', error);
      return null;
    }
  }

  // Create or update investor profile
  async upsertInvestorProfile(profile: Partial<InvestorProfile>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('investor_profiles')
        .upsert(profile, { onConflict: 'user_id' });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error upserting investor profile:', error);
      return false;
    }
  }

  // Get portfolio companies
  async getPortfolioCompanies(investorId: string): Promise<PortfolioCompany[]> {
    try {
      const { data, error } = await supabase
        .from('portfolio_companies')
        .select(`
          *,
          startup:startups(*)
        `)
        .eq('investor_id', investorId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching portfolio companies:', error);
      return [];
    }
  }

  // Add company to portfolio
  async addPortfolioCompany(company: Partial<PortfolioCompany>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('portfolio_companies')
        .insert(company);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error adding portfolio company:', error);
      return false;
    }
  }

  // Update portfolio company
  async updatePortfolioCompany(id: string, updates: Partial<PortfolioCompany>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('portfolio_companies')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating portfolio company:', error);
      return false;
    }
  }

  // Remove company from portfolio
  async removePortfolioCompany(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('portfolio_companies')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error removing portfolio company:', error);
      return false;
    }
  }

  // Get deal pipeline
  async getDealPipeline(investorId: string): Promise<DealPipeline[]> {
    try {
      const { data, error } = await supabase
        .from('deal_pipeline')
        .select('*')
        .eq('investor_id', investorId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching deal pipeline:', error);
      return [];
    }
  }

  // Add new deal to pipeline
  async addDealToPipeline(deal: Partial<DealPipeline>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('deal_pipeline')
        .insert(deal);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error adding deal to pipeline:', error);
      return false;
    }
  }

  // Update deal in pipeline
  async updateDealInPipeline(id: string, updates: Partial<DealPipeline>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('deal_pipeline')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating deal in pipeline:', error);
      return false;
    }
  }

  // Remove deal from pipeline
  async removeDealFromPipeline(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('deal_pipeline')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error removing deal from pipeline:', error);
      return false;
    }
  }

  // Get blog posts
  async getBlogPosts(authorId: string): Promise<BlogPost[]> {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          author:profiles(first_name, last_name, company)
        `)
        .eq('author_id', authorId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      return [];
    }
  }

  // Create new blog post
  async createBlogPost(post: Partial<BlogPost>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .insert(post);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error creating blog post:', error);
      return false;
    }
  }

  // Update blog post
  async updateBlogPost(id: string, updates: Partial<BlogPost>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating blog post:', error);
      return false;
    }
  }

  // Delete blog post
  async deleteBlogPost(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting blog post:', error);
      return false;
    }
  }

  // Get investment metrics
  async getInvestmentMetrics(investorId: string): Promise<InvestmentMetrics> {
    try {
      // Get portfolio companies for calculations
      const portfolioCompanies = await this.getPortfolioCompanies(investorId);
      
      const totalInvested = portfolioCompanies.reduce((sum, company) => sum + (company.investment_amount || 0), 0);
      const currentPortfolioValue = portfolioCompanies.reduce((sum, company) => sum + (company.current_valuation || 0), 0);
      const activeInvestments = portfolioCompanies.filter(company => company.status === 'active').length;
      const successfulExits = portfolioCompanies.filter(company => company.status === 'exited').length;
      
      // Calculate average ROI
      const totalROI = portfolioCompanies.reduce((sum, company) => {
        if (company.investment_amount && company.current_valuation) {
          return sum + ((company.current_valuation - company.investment_amount) / company.investment_amount * 100);
        }
        return sum;
      }, 0);
      
      const averageROI = portfolioCompanies.length > 0 ? totalROI / portfolioCompanies.length : 0;
      const successRate = portfolioCompanies.length > 0 ? (successfulExits / portfolioCompanies.length) * 100 : 0;

      return {
        total_invested: totalInvested,
        current_portfolio_value: currentPortfolioValue,
        average_roi: averageROI,
        success_rate: successRate,
        total_portfolio_count: portfolioCompanies.length,
        active_investments_count: activeInvestments,
        successful_exits_count: successfulExits
      };
    } catch (error) {
      console.error('Error calculating investment metrics:', error);
      return {
        total_invested: 0,
        current_portfolio_value: 0,
        average_roi: 0,
        success_rate: 0,
        total_portfolio_count: 0,
        active_investments_count: 0,
        successful_exits_count: 0
      };
    }
  }

  // Get new deal opportunities (from admin-created deals and investment applications)
  async getNewDealOpportunities(investorId: string): Promise<NewDealOpportunity[]> {
    try {
      console.log('Fetching new deal opportunities for investor:', investorId);
      
      // First, get admin-created deals that are active
      const { data: adminDeals, error: dealsError } = await supabase
        .from('deals')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(10);

      console.log('Admin deals query result:', { adminDeals, dealsError });

      if (dealsError) {
        console.error('Error fetching admin deals:', dealsError);
      }

      // Then, get investment applications
      const { data: applications, error: appsError } = await supabase
        .from('investment_applications')
        .select('*')
        .eq('target_investor', investorId)
        .eq('status', 'submitted')
        .order('created_at', { ascending: false })
        .limit(10);

      if (appsError) {
        console.error('Error fetching applications:', appsError);
      }

      const opportunities: NewDealOpportunity[] = [];

      // Add admin-created deals
      if (adminDeals) {
        console.log('Processing admin deals:', adminDeals.length);
        adminDeals.forEach(deal => {
          console.log('Processing deal:', deal);
          opportunities.push({
            id: `deal-${deal.id}`,
            company_name: deal.startup_name,
            sector: deal.sector,
            stage: deal.deal_stage,
            requested_amount: deal.deal_value,
            description: deal.description || 'No description available',
            match_score: Math.floor(Math.random() * 30) + 70, // Mock match score
            created_at: deal.created_at,
            source: 'admin_deal'
          });
        });
      } else {
        console.log('No admin deals found');
      }

      // Add investment applications
      if (applications) {
        applications.forEach(app => {
          opportunities.push({
            id: `app-${app.id}`,
            company_name: app.startup_name || 'Unknown Company',
            sector: app.sector || 'Unknown',
            stage: app.funding_stage || 'Unknown',
            requested_amount: parseFloat(app.funding_amount?.replace(/[^\d.]/g, '') || '0'),
            description: app.business_description || 'No description available',
            match_score: Math.floor(Math.random() * 30) + 70,
            created_at: app.created_at,
            source: 'application'
          });
        });
      }

      // Sort by creation date (newest first) and return
      console.log('Final opportunities:', opportunities);
      return opportunities.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } catch (error) {
      console.error('Error fetching new deal opportunities:', error);
      return [];
    }
  }

  // Get available startups for portfolio
  async getAvailableStartups(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('startups')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching available startups:', error);
      return [];
    }
  }

  // Log investor activity
  async logActivity(userId: string, action: string, targetTable: string, targetId: string, payload?: any): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('activity_logs')
        .insert({
          actor_user_id: userId,
          action,
          target_table: targetTable,
          target_id: targetId,
          payload
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error logging activity:', error);
      return false;
    }
  }

  // Real-time subscriptions
  setupRealTimeSubscriptions(
    investorId: string,
    callbacks: {
      onPortfolioChange?: () => void;
      onDealPipelineChange?: () => void;
      onInvestmentApplicationChange?: () => void;
      onBlogPostChange?: () => void;
    }
  ) {
    const channels: any[] = [];

    // Portfolio companies real-time
    if (callbacks.onPortfolioChange) {
      const portfolioChannel = supabase
        .channel('portfolio_companies_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'portfolio_companies',
            filter: `investor_id=eq.${investorId}`
          },
          () => callbacks.onPortfolioChange?.()
        )
        .subscribe();
      channels.push(portfolioChannel);
    }

    // Deal pipeline real-time
    if (callbacks.onDealPipelineChange) {
      const dealChannel = supabase
        .channel('deal_pipeline_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'deal_pipeline',
            filter: `investor_id=eq.${investorId}`
          },
          () => callbacks.onDealPipelineChange?.()
        )
        .subscribe();
      channels.push(dealChannel);
    }

    // Investment applications real-time (for new opportunities)
    if (callbacks.onInvestmentApplicationChange) {
      const applicationChannel = supabase
        .channel('investment_applications_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'investment_applications',
            filter: `target_investor=eq.${investorId}`
          },
          () => callbacks.onInvestmentApplicationChange?.()
        )
        .subscribe();
      channels.push(applicationChannel);
    }

    // Blog posts real-time
    if (callbacks.onBlogPostChange) {
      const blogChannel = supabase
        .channel('blog_posts_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'blog_posts',
            filter: `author_id=eq.${investorId}`
          },
          () => callbacks.onBlogPostChange?.()
        )
        .subscribe();
      channels.push(blogChannel);
    }

    // Return cleanup function
    return () => {
      channels.forEach(channel => {
        supabase.removeChannel(channel);
      });
    };
  }
}

export const investorDashboardService = new InvestorDashboardService();
