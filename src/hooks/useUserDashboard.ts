import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { userDashboardService, type UserProfile, type UserEvent, type CofounderOpportunity, type LearningResource, type UserActivity, type UserAchievement, type ApplicationStats, type CommunityPost } from '@/services/userDashboardService';
import { useToast } from '@/hooks/use-toast';

interface UserDashboardState {
  profile: UserProfile | null;
  applicationStats: ApplicationStats;
  upcomingEvents: UserEvent[];
  cofounderOpportunities: CofounderOpportunity[];
  learningResources: LearningResource[];
  recentActivity: UserActivity[];
  achievements: UserAchievement[];
  communityPosts: CommunityPost[];
  loading: boolean;
  error: string | null;
}

const initialState: UserDashboardState = {
  profile: null,
  applicationStats: { total: 0, approved: 0, pending: 0, rejected: 0, submitted: 0 },
  upcomingEvents: [],
  cofounderOpportunities: [],
  learningResources: [],
  recentActivity: [],
  achievements: [],
  communityPosts: [],
  loading: true,
  error: null
};

export const useUserDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [state, setState] = useState<UserDashboardState>(initialState);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);

  // ==================== DATA LOADING ====================

  const loadUserProfile = useCallback(async () => {
    if (!user?.id) return;

    try {
      const profile = await userDashboardService.getUserProfile(user.id);
      if (profile) {
        // Calculate and update profile completion
        const completion = await userDashboardService.calculateProfileCompletion(user.id);
        profile.profile_completion = completion;
        
        setState(prev => ({ ...prev, profile }));
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      setState(prev => ({ ...prev, error: 'Failed to load user profile' }));
    }
  }, [user?.id]);

  const loadApplicationStats = useCallback(async () => {
    if (!user?.id) return;

    try {
      const applicationStats = await userDashboardService.getUserApplicationStats(user.id);
      setState(prev => ({ ...prev, applicationStats }));
    } catch (error) {
      console.error('Error loading application stats:', error);
      setState(prev => ({ ...prev, error: 'Failed to load application stats' }));
    }
  }, [user?.id]);

  const loadUpcomingEvents = useCallback(async () => {
    if (!user?.id) return;

    try {
      const upcomingEvents = await userDashboardService.getUpcomingEvents(user.id);
      setState(prev => ({ ...prev, upcomingEvents }));
    } catch (error) {
      console.error('Error loading upcoming events:', error);
    }
  }, [user?.id]);

  const loadCofounderOpportunities = useCallback(async () => {
    if (!user?.id) return;

    try {
      const cofounderOpportunities = await userDashboardService.getCofounderOpportunities(user.id);
      setState(prev => ({ ...prev, cofounderOpportunities }));
    } catch (error) {
      console.error('Error loading cofounder opportunities:', error);
    }
  }, [user?.id]);

  const loadLearningResources = useCallback(async () => {
    if (!user?.id) return;

    try {
      const learningResources = await userDashboardService.getLearningResources(user.id);
      setState(prev => ({ ...prev, learningResources }));
    } catch (error) {
      console.error('Error loading learning resources:', error);
    }
  }, [user?.id]);

  const loadRecentActivity = useCallback(async () => {
    if (!user?.id) return;

    try {
      const recentActivity = await userDashboardService.getUserActivity(user.id);
      setState(prev => ({ ...prev, recentActivity }));
    } catch (error) {
      console.error('Error loading recent activity:', error);
    }
  }, [user?.id]);

  const loadAchievements = useCallback(async () => {
    if (!user?.id) return;

    try {
      const achievements = await userDashboardService.getUserAchievements(user.id);
      setState(prev => ({ ...prev, achievements }));
    } catch (error) {
      console.error('Error loading achievements:', error);
    }
  }, [user?.id]);

  const loadCommunityPosts = useCallback(async () => {
    try {
      const communityPosts = await userDashboardService.getCommunityPosts();
      setState(prev => ({ ...prev, communityPosts }));
    } catch (error) {
      console.error('Error loading community posts:', error);
    }
  }, []);

  const loadAllData = useCallback(async () => {
    if (!user?.id) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      await Promise.all([
        loadUserProfile(),
        loadApplicationStats(),
        loadUpcomingEvents(),
        loadCofounderOpportunities(),
        loadLearningResources(),
        loadRecentActivity(),
        loadAchievements(),
        loadCommunityPosts()
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setState(prev => ({ ...prev, error: 'Failed to load dashboard data' }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [user?.id, loadUserProfile, loadApplicationStats, loadUpcomingEvents, loadCofounderOpportunities, loadLearningResources, loadRecentActivity, loadAchievements, loadCommunityPosts]);

  // ==================== USER ACTIONS ====================

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!user?.id) return false;

    try {
      const success = await userDashboardService.updateUserProfile(user.id, updates);
      if (success) {
        await loadUserProfile();
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully."
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive"
      });
      return false;
    }
  }, [user?.id, loadUserProfile, toast]);

  const registerForEvent = useCallback(async (eventId: string) => {
    if (!user?.id) return false;

    try {
      const success = await userDashboardService.registerForEvent(user.id, eventId);
      if (success) {
        await loadUpcomingEvents();
        await loadRecentActivity();
        toast({
          title: "Registration Successful",
          description: "You have been registered for the event."
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error registering for event:', error);
      toast({
        title: "Registration Failed",
        description: "Failed to register for the event.",
        variant: "destructive"
      });
      return false;
    }
  }, [user?.id, loadUpcomingEvents, loadRecentActivity, toast]);

  const cancelEventRegistration = useCallback(async (eventId: string) => {
    if (!user?.id) return false;

    try {
      const success = await userDashboardService.cancelEventRegistration(user.id, eventId);
      if (success) {
        await loadUpcomingEvents();
        await loadRecentActivity();
        toast({
          title: "Registration Cancelled",
          description: "Your event registration has been cancelled."
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error cancelling event registration:', error);
      toast({
        title: "Cancellation Failed",
        description: "Failed to cancel event registration.",
        variant: "destructive"
      });
      return false;
    }
  }, [user?.id, loadUpcomingEvents, loadRecentActivity, toast]);

  const applyForCofounderRole = useCallback(async (opportunityId: string, coverLetter: string) => {
    if (!user?.id) return false;

    try {
      const success = await userDashboardService.applyForCofounderRole(user.id, opportunityId, coverLetter);
      if (success) {
        await loadCofounderOpportunities();
        await loadRecentActivity();
        toast({
          title: "Application Submitted",
          description: "Your co-founder application has been submitted."
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error applying for cofounder role:', error);
      toast({
        title: "Application Failed",
        description: "Failed to submit co-founder application.",
        variant: "destructive"
      });
      return false;
    }
  }, [user?.id, loadCofounderOpportunities, loadRecentActivity, toast]);

  const updateLearningProgress = useCallback(async (resourceId: string, progress: number) => {
    if (!user?.id) return false;

    try {
      const success = await userDashboardService.updateLearningProgress(user.id, resourceId, progress);
      if (success) {
        await loadLearningResources();
        if (progress >= 100) {
          await loadRecentActivity();
          await loadAchievements();
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating learning progress:', error);
      return false;
    }
  }, [user?.id, loadLearningResources, loadRecentActivity, loadAchievements]);

  const createCommunityPost = useCallback(async (title: string, content: string, category?: string, tags?: string[]) => {
    if (!user?.id) return false;

    try {
      const success = await userDashboardService.createCommunityPost(user.id, title, content, category, tags);
      if (success) {
        await loadCommunityPosts();
        await loadRecentActivity();
        toast({
          title: "Post Created",
          description: "Your community post has been created."
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error creating community post:', error);
      toast({
        title: "Post Creation Failed",
        description: "Failed to create community post.",
        variant: "destructive"
      });
      return false;
    }
  }, [user?.id, loadCommunityPosts, loadRecentActivity, toast]);

  // ==================== REAL-TIME SUBSCRIPTIONS ====================

  const setupRealtimeSubscriptions = useCallback(() => {
    if (!user?.id) return;

    const subs = [];

    // Subscribe to user activity updates
    const activitySub = userDashboardService.subscribeToUserActivity(user.id, (newActivity) => {
      setState(prev => ({
        ...prev,
        recentActivity: [newActivity, ...prev.recentActivity.slice(0, 9)]
      }));
    });
    subs.push(activitySub);

    // Subscribe to new events
    const eventsSub = userDashboardService.subscribeToEvents((event) => {
      setState(prev => ({
        ...prev,
        upcomingEvents: [event, ...prev.upcomingEvents]
      }));
    });
    subs.push(eventsSub);

    // Subscribe to new co-founder opportunities
    const cofounderSub = userDashboardService.subscribeToCofounderOpportunities((opportunity) => {
      setState(prev => ({
        ...prev,
        cofounderOpportunities: [opportunity, ...prev.cofounderOpportunities]
      }));
    });
    subs.push(cofounderSub);

    setSubscriptions(subs);
  }, [user?.id]);

  const cleanupSubscriptions = useCallback(() => {
    subscriptions.forEach(sub => {
      if (sub && typeof sub.unsubscribe === 'function') {
        sub.unsubscribe();
      }
    });
    setSubscriptions([]);
  }, [subscriptions]);

  // ==================== SEARCH ====================

  const searchContent = useCallback(async (query: string, type?: string) => {
    try {
      return await userDashboardService.searchContent(query, type);
    } catch (error) {
      console.error('Error searching content:', error);
      return [];
    }
  }, []);

  // ==================== EFFECTS ====================

  useEffect(() => {
    if (user?.id) {
      loadAllData();
      setupRealtimeSubscriptions();
    }

    return cleanupSubscriptions;
  }, [user?.id]); // Remove function dependencies to prevent infinite loops

  // Refresh data every 5 minutes
  useEffect(() => {
    if (!user?.id) return;

    const interval = setInterval(() => {
      loadApplicationStats();
      loadUpcomingEvents();
      loadCofounderOpportunities();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [user?.id]); // Remove function dependencies to prevent infinite loops

  return {
    // State
    ...state,
    
    // Actions
    updateProfile,
    registerForEvent,
    cancelEventRegistration,
    applyForCofounderRole,
    updateLearningProgress,
    createCommunityPost,
    searchContent,
    
    // Data refresh
    refreshData: loadAllData,
    refreshProfile: loadUserProfile,
    refreshApplicationStats: loadApplicationStats,
    refreshEvents: loadUpcomingEvents,
    refreshCofounderOpportunities: loadCofounderOpportunities,
    refreshLearningResources: loadLearningResources,
    refreshActivity: loadRecentActivity,
    refreshAchievements: loadAchievements,
    refreshCommunityPosts: loadCommunityPosts
  };
};
