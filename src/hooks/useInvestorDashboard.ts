import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { investorDashboardService, 
  InvestorProfile, 
  PortfolioCompany, 
  DealPipeline, 
  BlogPost, 
  InvestmentMetrics } from '@/services/investorDashboardService';
import { dealService, NewDealOpportunity } from '@/services/dealService';

export const useInvestorDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Data
  const [investorProfile, setInvestorProfile] = useState<InvestorProfile | null>(null);
  const [portfolioCompanies, setPortfolioCompanies] = useState<PortfolioCompany[]>([]);
  const [dealPipeline, setDealPipeline] = useState<DealPipeline[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [investmentMetrics, setInvestmentMetrics] = useState<InvestmentMetrics | null>(null);
  const [newDealOpportunities, setNewDealOpportunities] = useState<NewDealOpportunity[]>([]);
  const [availableStartups, setAvailableStartups] = useState<any[]>([]);

  // Load all data
  const loadAllData = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Load data in parallel
      const [
        profile,
        portfolio,
        pipeline,
        blogs,
        metrics,
        opportunities,
        startups
      ] = await Promise.all([
        investorDashboardService.getInvestorProfile(user.id),
        investorDashboardService.getPortfolioCompanies(user.id),
        investorDashboardService.getDealPipeline(user.id),
        investorDashboardService.getBlogPosts(user.id),
        investorDashboardService.getInvestmentMetrics(user.id),
        dealService.getNewDealOpportunities(user.id),
        investorDashboardService.getAvailableStartups()
      ]);

      setInvestorProfile(profile);
      setPortfolioCompanies(portfolio);
      setDealPipeline(pipeline);
      setBlogPosts(blogs);
      setInvestmentMetrics(metrics);
      setNewDealOpportunities(opportunities);
      setAvailableStartups(startups);
      
    } catch (err) {
      console.error('Error loading investor dashboard data:', err);
      setError('Failed to load dashboard data');
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user?.id, toast]);

  // Refresh data
  const refreshData = useCallback(() => {
    loadAllData();
  }, [loadAllData]);

  // Load data on mount and setup real-time subscriptions
  useEffect(() => {
    loadAllData();
    
    if (!user?.id) return;
    
    // Setup real-time subscriptions
    const cleanup = investorDashboardService.setupRealTimeSubscriptions(user.id, {
      onPortfolioChange: () => {
        console.log('Portfolio data changed, refreshing...');
        loadAllData();
      },
      onDealPipelineChange: () => {
        console.log('Deal pipeline data changed, refreshing...');
        loadAllData();
      },
      onInvestmentApplicationChange: () => {
        console.log('New investment opportunities available, refreshing...');
        loadAllData();
        toast({
          title: "New Investment Opportunity",
          description: "A new investment opportunity matching your criteria is available!",
          variant: "default"
        });
      },
      onBlogPostChange: () => {
        console.log('Blog posts changed, refreshing...');
        loadAllData();
      }
    });
    
    // Cleanup subscriptions on unmount
    return cleanup;
  }, [user?.id, toast]);

  // Portfolio Management
  const addPortfolioCompany = useCallback(async (company: Partial<PortfolioCompany>) => {
    if (!user?.id) return false;
    
    try {
      const success = await investorDashboardService.addPortfolioCompany({
        ...company,
        investor_id: user.id
      });
      
      if (success) {
        toast({
          title: "Success",
          description: "Company added to portfolio successfully",
        });
        
        // Refresh data
        await loadAllData();
        
        // Log activity
        await investorDashboardService.logActivity(
          user.id,
          'portfolio_company_added',
          'portfolio_companies',
          company.startup_id || '',
          company
        );
        
        return true;
      } else {
        throw new Error('Failed to add company to portfolio');
      }
    } catch (err) {
      console.error('Error adding portfolio company:', err);
      toast({
        title: "Error",
        description: "Failed to add company to portfolio",
        variant: "destructive"
      });
      return false;
    }
  }, [user?.id, toast, loadAllData]);

  const updatePortfolioCompany = useCallback(async (id: string, updates: Partial<PortfolioCompany>) => {
    try {
      const success = await investorDashboardService.updatePortfolioCompany(id, updates);
      
      if (success) {
        toast({
          title: "Success",
          description: "Portfolio company updated successfully",
        });
        
        // Refresh data
        await loadAllData();
        
        // Log activity
        if (user?.id) {
          await investorDashboardService.logActivity(
            user.id,
            'portfolio_company_updated',
            'portfolio_companies',
            id,
            updates
          );
        }
        
        return true;
      } else {
        throw new Error('Failed to update portfolio company');
      }
    } catch (err) {
      console.error('Error updating portfolio company:', err);
      toast({
        title: "Error",
        description: "Failed to update portfolio company",
        variant: "destructive"
      });
      return false;
    }
  }, [user?.id, toast, loadAllData]);

  const removePortfolioCompany = useCallback(async (id: string) => {
    try {
      const success = await investorDashboardService.removePortfolioCompany(id);
      
      if (success) {
        toast({
          title: "Success",
          description: "Company removed from portfolio successfully",
        });
        
        // Refresh data
        await loadAllData();
        
        // Log activity
        if (user?.id) {
          await investorDashboardService.logActivity(
            user.id,
            'portfolio_company_removed',
            'portfolio_companies',
            id
          );
        }
        
        return true;
      } else {
        throw new Error('Failed to remove portfolio company');
      }
    } catch (err) {
      console.error('Error removing portfolio company:', err);
      toast({
        title: "Error",
        description: "Failed to remove company from portfolio",
        variant: "destructive"
      });
      return false;
    }
  }, [user?.id, toast, loadAllData]);

  // Deal Pipeline Management
  const addDealToPipeline = useCallback(async (deal: Partial<DealPipeline>) => {
    if (!user?.id) return false;
    
    try {
      const success = await investorDashboardService.addDealToPipeline({
        ...deal,
        investor_id: user.id
      });
      
      if (success) {
        toast({
          title: "Success",
          description: "Deal added to pipeline successfully",
        });
        
        // Refresh data
        await loadAllData();
        
        // Log activity
        await investorDashboardService.logActivity(
          user.id,
          'deal_added_to_pipeline',
          'deal_pipeline',
          deal.id || '',
          deal
        );
        
        return true;
      } else {
        throw new Error('Failed to add deal to pipeline');
      }
    } catch (err) {
      console.error('Error adding deal to pipeline:', err);
      toast({
        title: "Error",
        description: "Failed to add deal to pipeline",
        variant: "destructive"
      });
      return false;
    }
  }, [user?.id, toast, loadAllData]);

  const updateDealInPipeline = useCallback(async (id: string, updates: Partial<DealPipeline>) => {
    try {
      const success = await investorDashboardService.updateDealInPipeline(id, updates);
      
      if (success) {
        toast({
          title: "Success",
          description: "Deal updated successfully",
        });
        
        // Refresh data
        await loadAllData();
        
        // Log activity
        if (user?.id) {
          await investorDashboardService.logActivity(
            user.id,
            'deal_pipeline_updated',
            'deal_pipeline',
            id,
            updates
          );
        }
        
        return true;
      } else {
        throw new Error('Failed to update deal');
      }
    } catch (err) {
      console.error('Error updating deal:', err);
      toast({
        title: "Error",
        description: "Failed to update deal",
        variant: "destructive"
      });
      return false;
    }
  }, [user?.id, toast, loadAllData]);

  const removeDealFromPipeline = useCallback(async (id: string) => {
    try {
      const success = await investorDashboardService.removeDealFromPipeline(id);
      
      if (success) {
        toast({
          title: "Success",
          description: "Deal removed from pipeline successfully",
        });
        
        // Refresh data
        await loadAllData();
        
        // Log activity
        if (user?.id) {
          await investorDashboardService.logActivity(
            user.id,
            'deal_removed_from_pipeline',
            'deal_pipeline',
            id
          );
        }
        
        return true;
      } else {
        throw new Error('Failed to remove deal from pipeline');
      }
    } catch (err) {
      console.error('Error removing deal from pipeline:', err);
      toast({
        title: "Error",
        description: "Failed to remove deal from pipeline",
        variant: "destructive"
      });
      return false;
    }
  }, [user?.id, toast, loadAllData]);

  // Blog Management
  const createBlogPost = useCallback(async (post: Partial<BlogPost>) => {
    if (!user?.id) return false;
    
    try {
      const success = await investorDashboardService.createBlogPost({
        ...post,
        author_id: user.id
      });
      
      if (success) {
        toast({
          title: "Success",
          description: "Blog post created successfully",
        });
        
        // Refresh data
        await loadAllData();
        
        // Log activity
        await investorDashboardService.logActivity(
          user.id,
          'blog_post_created',
          'blog_posts',
          post.id || '',
          post
        );
        
        return true;
      } else {
        throw new Error('Failed to create blog post');
      }
    } catch (err) {
      console.error('Error creating blog post:', err);
      toast({
        title: "Error",
        description: "Failed to create blog post",
        variant: "destructive"
      });
      return false;
    }
  }, [user?.id, toast, loadAllData]);

  const updateBlogPost = useCallback(async (id: string, updates: Partial<BlogPost>) => {
    try {
      const success = await investorDashboardService.updateBlogPost(id, updates);
      
      if (success) {
        toast({
          title: "Success",
          description: "Blog post updated successfully",
        });
        
        // Refresh data
        await loadAllData();
        
        // Log activity
        if (user?.id) {
          await investorDashboardService.logActivity(
            user.id,
            'blog_post_updated',
            'blog_posts',
            id,
            updates
          );
        }
        
        return true;
      } else {
        throw new Error('Failed to update blog post');
      }
    } catch (err) {
      console.error('Error updating blog post:', err);
      toast({
        title: "Error",
        description: "Failed to update blog post",
        variant: "destructive"
      });
      return false;
    }
  }, [user?.id, toast, loadAllData]);

  const deleteBlogPost = useCallback(async (id: string) => {
    try {
      const success = await investorDashboardService.deleteBlogPost(id);
      
      if (success) {
        toast({
          title: "Success",
          description: "Blog post deleted successfully",
        });
        
        // Refresh data
        await loadAllData();
        
        // Log activity
        if (user?.id) {
          await investorDashboardService.logActivity(
            user.id,
            'blog_post_deleted',
            'blog_posts',
            id
          );
        }
        
        return true;
      } else {
        throw new Error('Failed to delete blog post');
      }
    } catch (err) {
      console.error('Error deleting blog post:', err);
      toast({
        title: "Error",
        description: "Failed to delete blog post",
        variant: "destructive"
      });
      return false;
    }
  }, [user?.id, toast, loadAllData]);

  // Profile Management
  const updateInvestorProfile = useCallback(async (updates: Partial<InvestorProfile>) => {
    if (!user?.id) return false;
    
    try {
      const success = await investorDashboardService.upsertInvestorProfile({
        ...updates,
        user_id: user.id
      });
      
      if (success) {
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
        
        // Refresh data
        await loadAllData();
        
        // Log activity
        await investorDashboardService.logActivity(
          user.id,
          'investor_profile_updated',
          'investor_profiles',
          user.id,
          updates
        );
        
        return true;
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating investor profile:', err);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
      return false;
    }
  }, [user?.id, toast, loadAllData]);

  return {
    // State
    loading,
    error,
    
    // Data
    investorProfile,
    portfolioCompanies,
    dealPipeline,
    blogPosts,
    investmentMetrics,
    newDealOpportunities,
    availableStartups,
    
    // Actions
    refreshData,
    addPortfolioCompany,
    updatePortfolioCompany,
    removePortfolioCompany,
    addDealToPipeline,
    updateDealInPipeline,
    removeDealFromPipeline,
    createBlogPost,
    updateBlogPost,
    deleteBlogPost,
    updateInvestorProfile
  };
};
