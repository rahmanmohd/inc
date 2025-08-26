import { supabase } from '@/lib/supabase';
import type { Tables } from '@/lib/supabase';

export type Deal = Tables<'deals'>;

export interface NewDealOpportunity {
  id: string;
  company_name: string;
  sector: string;
  stage: string;
  requested_amount: number;
  description: string;
  match_score: number;
  created_at: string;
  source: 'admin_deal' | 'application';
}

class DealService {
  // Get all active deals from the deals table
  async getActiveDeals(): Promise<Deal[]> {
    try {
      console.log('Fetching active deals...');
      
      // First, let's see what deals exist and their statuses
      const { data: allDeals, error: allDealsError } = await supabase
        .from('deals')
        .select('*')
        .order('created_at', { ascending: false });

      if (allDealsError) {
        console.error('Error fetching all deals:', allDealsError);
        return [];
      }

      console.log('All deals found:', allDeals);
      
      // Now filter for active deals
      const activeDeals = allDeals?.filter(deal => deal.status === 'active') || [];
      console.log('Active deals:', activeDeals);
      
      return activeDeals;
    } catch (error) {
      console.error('Error in getActiveDeals:', error);
      return [];
    }
  }

  // Get new deal opportunities for investors
  async getNewDealOpportunities(investorId: string): Promise<NewDealOpportunity[]> {
    try {
      console.log('Fetching new deal opportunities for investor:', investorId);
      
      const opportunities: NewDealOpportunity[] = [];

      // Get admin-created deals
      const deals = await this.getActiveDeals();
      console.log('Found deals:', deals.length);

      deals.forEach(deal => {
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

      // Get investment applications (if they exist)
      try {
        const { data: applications, error: appsError } = await supabase
          .from('investment_applications')
          .select('*')
          .eq('target_investor', investorId)
          .eq('status', 'submitted')
          .order('created_at', { ascending: false })
          .limit(10);

        if (appsError) {
          console.error('Error fetching applications:', appsError);
        } else if (applications) {
          applications.forEach(app => {
            opportunities.push({
              id: `app-${app.id}`,
              company_name: app.business_model || 'Unknown Company',
              sector: app.stage || 'Unknown',
              stage: app.funding_stage || 'Unknown',
              requested_amount: parseFloat(app.funding_amount?.replace(/[^\d.]/g, '') || '0'),
              description: app.traction || 'No description available',
              match_score: Math.floor(Math.random() * 30) + 70,
              created_at: app.created_at,
              source: 'application'
            });
          });
        }
      } catch (error) {
        console.error('Error fetching applications:', error);
      }

      // Sort by creation date (newest first)
      const sortedOpportunities = opportunities.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      console.log('Final opportunities:', sortedOpportunities);
      return sortedOpportunities;
    } catch (error) {
      console.error('Error in getNewDealOpportunities:', error);
      return [];
    }
  }
}

export const dealService = new DealService();
