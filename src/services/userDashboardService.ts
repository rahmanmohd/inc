import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase-latest';

// Types
type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

export interface UserProfile extends Tables<'profiles'> {
  location?: string;
  website?: string;
  linkedin_profile?: string;
  github_profile?: string;
  skills?: string[];
  interests?: string[];
  profile_completion?: number;
  join_date?: string;
}

export interface UserEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  type: string;
  location?: string;
  venue?: string;
  city?: string;
  online_url?: string;
  starts_at?: string;
  ends_at?: string;
  status: string;
  registration_required: boolean;
  max_participants?: number;
  current_participants: number;
  tags?: string[];
  cover_image_url?: string;
  published: boolean;
  created_at: string;
  is_registered?: boolean;
  registration_status?: string;
}

export interface CofounderOpportunity {
  id: string;
  company_name?: string;
  title: string;
  role: string;
  equity?: string;
  equity_range?: string;
  stage?: string;
  description?: string;
  requirements?: string;
  location?: string;
  remote_friendly: boolean;
  status: string;
  posted_date: string;
  posted_by?: string;
  has_applied?: boolean;
  application_status?: string;
  experience?: string;
  commitment?: string;
  salary?: string;
  skills?: string[];
}

export interface LearningResource {
  id: string;
  title: string;
  description?: string;
  type: string;
  duration?: string;
  difficulty: string;
  category?: string;
  url?: string;
  thumbnail_url?: string;
  tags?: string[];
  published: boolean;
  created_at: string;
  progress?: number;
  completed?: boolean;
  started_at?: string;
  completed_at?: string;
}

export interface UserActivity {
  id: string;
  activity_type: string;
  title: string;
  description?: string;
  related_id?: string;
  related_type?: string;
  created_at: string;
}

export interface UserAchievement {
  id: string;
  achievement_type: string;
  title: string;
  description?: string;
  icon?: string;
  earned_date: string;
}

export interface ApplicationStats {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
  submitted: number;
}

export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  category?: string;
  tags?: string[];
  likes_count: number;
  comments_count: number;
  status: string;
  created_at: string;
  user_id: string;
  author_name?: string;
}

class UserDashboardService {
  // ==================== USER PROFILE ====================
  
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data as UserProfile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating user profile:', error);
      return false;
    }
  }

  async calculateProfileCompletion(userId: string): Promise<number> {
    try {
      const profile = await this.getUserProfile(userId);
      if (!profile) return 0;

      const fields = [
        'first_name', 'last_name', 'email', 'phone', 'bio', 
        'company', 'location', 'website', 'linkedin_profile'
      ];
      
      const filledFields = fields.filter(field => {
        const value = profile[field as keyof UserProfile];
        return value && value.toString().trim() !== '';
      }).length;

      const completion = Math.round((filledFields / fields.length) * 100);
      
      // Update the profile completion in the database
      await this.updateUserProfile(userId, { profile_completion: completion });
      
      return completion;
    } catch (error) {
      console.error('Error calculating profile completion:', error);
      return 0;
    }
  }

  // ==================== APPLICATION STATS ====================
  
  async getUserApplicationStats(userId: string): Promise<ApplicationStats> {
    try {
      // Get hackathon registrations
      const { data: hackathonRegs } = await supabase
        .from('hackathon_registrations')
        .select('status')
        .eq('user_id', userId);

      // Get incubation applications (old table)
      const { data: incubationApps1 } = await supabase
        .from('incubation_applications')
        .select('status')
        .eq('user_id', userId);

      // Get incubation applications (new table)
      const { data: incubationApps2 } = await supabase
        .from('incubation_applications_new')
        .select('status')
        .eq('user_id', userId);

      const allApplications = [
        ...(hackathonRegs || []),
        ...(incubationApps1 || []),
        ...(incubationApps2 || [])
      ];

      const stats: ApplicationStats = {
        total: allApplications.length,
        approved: allApplications.filter(app => 
          app.status === 'approved' || app.status === 'accepted'
        ).length,
        pending: allApplications.filter(app => 
          app.status === 'pending' || app.status === 'under_review'
        ).length,
        rejected: allApplications.filter(app => 
          app.status === 'rejected' || app.status === 'declined'
        ).length,
        submitted: allApplications.filter(app => 
          app.status === 'submitted'
        ).length
      };

      return stats;
    } catch (error) {
      console.error('Error fetching application stats:', error);
      return { total: 0, approved: 0, pending: 0, rejected: 0, submitted: 0 };
    }
  }

  // ==================== EVENTS ====================
  
  async getUpcomingEvents(userId: string, limit: number = 10): Promise<UserEvent[]> {
    try {
      const { data: events, error } = await supabase
        .from('events')
        .select(`
          *,
          event_registrations!left(user_id, status)
        `)
        .eq('published', true)
        .gte('starts_at', new Date().toISOString())
        .order('starts_at', { ascending: true })
        .limit(limit);

      if (error) throw error;

      return (events || []).map(event => {
        // Map existing schema to our interface
        const userRegistration = event.event_registrations?.find((reg: any) => reg.user_id === userId);
        const location = event.venue ? `${event.venue}${event.city ? `, ${event.city}` : ''}` : event.online_url ? 'Online' : '';
        
        return {
          ...event,
          date: event.starts_at ? new Date(event.starts_at).toISOString().split('T')[0] : '',
          time: event.starts_at ? new Date(event.starts_at).toTimeString().split(' ')[0] : undefined,
          location,
          status: event.starts_at ? (new Date(event.starts_at) > new Date() ? 'upcoming' : 'ongoing') : 'upcoming',
          registration_required: true,
          current_participants: event.current_participants || 0,
          tags: event.tags || [],
          is_registered: !!userRegistration,
          registration_status: userRegistration?.status || null
        };
      });
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      return [];
    }
  }

  async registerForEvent(userId: string, eventId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('event_registrations')
        .insert({
          user_id: userId,
          event_id: eventId,
          status: 'registered'
        });

      if (error) throw error;

      // Update event participant count (use direct SQL instead of RPC for now)
      const { error: updateError } = await supabase
        .from('events')
        .update({ 
          current_participants: supabase.raw('COALESCE(current_participants, 0) + 1')
        })
        .eq('id', eventId);

      // Log user activity
      await this.logUserActivity(userId, 'event_registered', 'Event Registration', 
        `Registered for an event`, eventId, 'event');

      return true;
    } catch (error) {
      console.error('Error registering for event:', error);
      return false;
    }
  }

  async cancelEventRegistration(userId: string, eventId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('event_registrations')
        .update({ status: 'cancelled' })
        .eq('user_id', userId)
        .eq('event_id', eventId);

      if (error) throw error;

      // Log user activity
      await this.logUserActivity(userId, 'event_cancelled', 'Event Cancellation', 
        `Cancelled event registration`, eventId, 'event');

      return true;
    } catch (error) {
      console.error('Error cancelling event registration:', error);
      return false;
    }
  }

  // ==================== CO-FOUNDER OPPORTUNITIES ====================
  
  async getCofounderOpportunities(userId: string, limit: number = 10): Promise<CofounderOpportunity[]> {
    try {
      const { data: opportunities, error } = await supabase
        .from('cofounder_posts')
        .select(`
          *,
          cofounder_applications!left(applicant_id, status)
        `)
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (opportunities || []).map(opp => {
        const userApplication = opp.cofounder_applications?.find((app: any) => app.applicant_id === userId);
        
        return {
          ...opp,
          company_name: opp.title, // Map title to company_name
          equity_range: opp.equity,
          posted_date: opp.created_at,
          status: opp.status || 'active',
          remote_friendly: opp.remote_friendly || false,
          has_applied: !!userApplication,
          application_status: userApplication?.status || null
        };
      });
    } catch (error) {
      console.error('Error fetching cofounder opportunities:', error);
      return [];
    }
  }

  async applyForCofounderRole(userId: string, opportunityId: string, coverLetter: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('cofounder_applications')
        .insert({
          opportunity_id: opportunityId,
          applicant_id: userId,
          cover_letter: coverLetter,
          status: 'pending'
        });

      if (error) throw error;

      // Log user activity
      await this.logUserActivity(userId, 'cofounder_applied', 'Co-founder Application', 
        `Applied for a co-founder role`, opportunityId, 'cofounder_opportunity');

      return true;
    } catch (error) {
      console.error('Error applying for cofounder role:', error);
      return false;
    }
  }

  // ==================== LEARNING RESOURCES ====================
  
  async getLearningResources(userId: string, limit: number = 10): Promise<LearningResource[]> {
    try {
      const { data: resources, error } = await supabase
        .from('learning_resources')
        .select(`
          *,
          user_learning_progress!left(progress, completed, started_at, completed_at)
        `)
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (resources || []).map(resource => ({
        ...resource,
        progress: resource.user_learning_progress?.[0]?.progress || 0,
        completed: resource.user_learning_progress?.[0]?.completed || false,
        started_at: resource.user_learning_progress?.[0]?.started_at || null,
        completed_at: resource.user_learning_progress?.[0]?.completed_at || null
      }));
    } catch (error) {
      console.error('Error fetching learning resources:', error);
      return [];
    }
  }

  async updateLearningProgress(userId: string, resourceId: string, progress: number): Promise<boolean> {
    try {
      const completed = progress >= 100;
      
      const { error } = await supabase
        .from('user_learning_progress')
        .upsert({
          user_id: userId,
          resource_id: resourceId,
          progress,
          completed,
          last_accessed: new Date().toISOString(),
          completed_at: completed ? new Date().toISOString() : null
        });

      if (error) throw error;

      // Log activity if completed
      if (completed) {
        await this.logUserActivity(userId, 'course_completed', 'Course Completed', 
          `Completed a learning resource`, resourceId, 'learning_resource');
        
        // Award achievement for course completion
        await this.awardAchievement(userId, 'course_completed', 'Course Completed', 
          'Completed your first learning resource!', '🎓');
      }

      return true;
    } catch (error) {
      console.error('Error updating learning progress:', error);
      return false;
    }
  }

  // ==================== USER ACTIVITY ====================
  
  async getUserActivity(userId: string, limit: number = 10): Promise<UserActivity[]> {
    try {
      const { data, error } = await supabase
        .from('user_activity')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user activity:', error);
      return [];
    }
  }

  async logUserActivity(
    userId: string, 
    activityType: string, 
    title: string, 
    description: string,
    relatedId?: string,
    relatedType?: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_activity')
        .insert({
          user_id: userId,
          activity_type: activityType,
          title,
          description,
          related_id: relatedId,
          related_type: relatedType
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error logging user activity:', error);
      return false;
    }
  }

  // ==================== USER ACHIEVEMENTS ====================
  
  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', userId)
        .order('earned_date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user achievements:', error);
      return [];
    }
  }

  async awardAchievement(
    userId: string,
    achievementType: string,
    title: string,
    description: string,
    icon: string
  ): Promise<boolean> {
    try {
      // Check if user already has this achievement
      const { data: existing } = await supabase
        .from('user_achievements')
        .select('id')
        .eq('user_id', userId)
        .eq('achievement_type', achievementType)
        .single();

      if (existing) return true; // Already has this achievement

      const { error } = await supabase
        .from('user_achievements')
        .insert({
          user_id: userId,
          achievement_type: achievementType,
          title,
          description,
          icon
        });

      if (error) throw error;

      // Log the achievement activity
      await this.logUserActivity(userId, 'achievement_earned', 'Achievement Earned', 
        `Earned: ${title}`);

      return true;
    } catch (error) {
      console.error('Error awarding achievement:', error);
      return false;
    }
  }

  // ==================== COMMUNITY ====================
  
  async getCommunityPosts(limit: number = 10): Promise<CommunityPost[]> {
    try {
      // First try to query community_posts table
      let { data, error } = await supabase
        .from('community_posts')
        .select(`
          *,
          profiles!community_posts_user_id_fkey(first_name, last_name)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(limit);

      // If community_posts table doesn't exist or has error, fallback to blog_posts
      if (error || !data) {
        console.log('Falling back to blog_posts table for community posts');
        const { data: blogData, error: blogError } = await supabase
          .from('blog_posts')
          .select(`
            *,
            profiles!blog_posts_author_id_fkey(first_name, last_name)
          `)
          .eq('published', true)
          .order('created_at', { ascending: false })
          .limit(limit);

        if (blogError) {
          console.error('Error fetching blog posts:', blogError);
          return [];
        }

        return (blogData || []).map(post => ({
          id: post.id,
          user_id: post.author_id,
          title: post.title,
          content: post.summary || (post.content ? post.content.substring(0, 200) + '...' : ''),
          category: post.tags?.[0] || 'general',
          tags: post.tags || [],
          likes_count: 0,
          comments_count: 0,
          status: 'active',
          created_at: post.created_at,
          author_name: `${post.profiles?.first_name || ''} ${post.profiles?.last_name || ''}`.trim() || 'Anonymous'
        }));
      }

      return (data || []).map(post => ({
        ...post,
        author_name: `${post.profiles?.first_name || ''} ${post.profiles?.last_name || ''}`.trim() || 'Anonymous'
      }));
    } catch (error) {
      console.error('Error fetching community posts:', error);
      return [];
    }
  }

  async createCommunityPost(userId: string, title: string, content: string, category?: string, tags?: string[]): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('community_posts')
        .insert({
          user_id: userId,
          title,
          content,
          category,
          tags,
          status: 'active'
        });

      if (error) throw error;

      // Log user activity
      await this.logUserActivity(userId, 'post_created', 'Community Post', 
        `Created a new community post: ${title}`);

      return true;
    } catch (error) {
      console.error('Error creating community post:', error);
      return false;
    }
  }

  // ==================== REAL-TIME SUBSCRIPTIONS ====================
  
  subscribeToUserActivity(userId: string, callback: (activity: UserActivity) => void) {
    return supabase
      .channel(`user_activity_${userId}`)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'user_activity',
          filter: `user_id=eq.${userId}`
        }, 
        (payload) => {
          callback(payload.new as UserActivity);
        }
      )
      .subscribe();
  }

  subscribeToEvents(callback: (event: UserEvent) => void) {
    return supabase
      .channel('events')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'events' 
        }, 
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            callback(payload.new as UserEvent);
          }
        }
      )
      .subscribe();
  }

  subscribeToCofounderOpportunities(callback: (opportunity: CofounderOpportunity) => void) {
    return supabase
      .channel('cofounder_opportunities')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'cofounder_opportunities' 
        }, 
        (payload) => {
          callback(payload.new as CofounderOpportunity);
        }
      )
      .subscribe();
  }

  // ==================== HELPER FUNCTIONS ====================
  
  async searchContent(query: string, type?: string): Promise<any[]> {
    try {
      const results = [];

      // Search events
      if (!type || type === 'events') {
        const { data: events } = await supabase
          .from('events')
          .select('id, title, description, type, date')
          .or(`title.ilike.%${query}%, description.ilike.%${query}%`)
          .eq('published', true)
          .limit(5);
        
        if (events) {
          results.push(...events.map(item => ({ ...item, search_type: 'event' })));
        }
      }

      // Search learning resources
      if (!type || type === 'learning') {
        const { data: resources } = await supabase
          .from('learning_resources')
          .select('id, title, description, type, category')
          .or(`title.ilike.%${query}%, description.ilike.%${query}%`)
          .eq('published', true)
          .limit(5);
        
        if (resources) {
          results.push(...resources.map(item => ({ ...item, search_type: 'learning_resource' })));
        }
      }

      // Search co-founder opportunities
      if (!type || type === 'cofounder') {
        const { data: opportunities } = await supabase
          .from('cofounder_opportunities')
          .select('id, company_name, role, description, stage')
          .or(`company_name.ilike.%${query}%, role.ilike.%${query}%, description.ilike.%${query}%`)
          .eq('status', 'active')
          .limit(5);
        
        if (opportunities) {
          results.push(...opportunities.map(item => ({ ...item, search_type: 'cofounder_opportunity' })));
        }
      }

      return results;
    } catch (error) {
      console.error('Error searching content:', error);
      return [];
    }
  }
}

export const userDashboardService = new UserDashboardService();
