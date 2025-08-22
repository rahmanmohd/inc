import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface AppState {
  // Form submission states
  forms: {
    partnership: { lastSubmitted: Date | null; isSubmitting: boolean };
    incubation: { lastSubmitted: Date | null; isSubmitting: boolean };
    investment: { lastSubmitted: Date | null; isSubmitting: boolean };
    mentor: { lastSubmitted: Date | null; isSubmitting: boolean };
    program: { lastSubmitted: Date | null; isSubmitting: boolean };
    grant: { lastSubmitted: Date | null; isSubmitting: boolean };
    hackathon: { lastSubmitted: Date | null; isSubmitting: boolean };
    consultation: { lastSubmitted: Date | null; isSubmitting: boolean };
  };
  
  // Dashboard refresh states
  dashboards: {
    user: { lastRefreshed: Date | null; isLoading: boolean };
    startup: { lastRefreshed: Date | null; isLoading: boolean };
    investor: { lastRefreshed: Date | null; isLoading: boolean };
    admin: { lastRefreshed: Date | null; isLoading: boolean };
  };
  
  // Global refresh trigger
  refreshTrigger: number;
}

interface AppStateContextValue {
  state: AppState;
  
  // Form management
  setFormSubmitting: (formType: keyof AppState['forms'], isSubmitting: boolean) => void;
  setFormSubmitted: (formType: keyof AppState['forms']) => void;
  resetForm: (formType: keyof AppState['forms']) => void;
  
  // Dashboard management
  setDashboardLoading: (dashboardType: keyof AppState['dashboards'], isLoading: boolean) => void;
  setDashboardRefreshed: (dashboardType: keyof AppState['dashboards']) => void;
  refreshDashboard: (dashboardType: keyof AppState['dashboards']) => void;
  
  // Global refresh
  triggerGlobalRefresh: () => void;
  
  // Utility functions
  isFormRecentlySubmitted: (formType: keyof AppState['forms'], minutes?: number) => boolean;
  shouldRefreshDashboard: (dashboardType: keyof AppState['dashboards'], minutes?: number) => boolean;
}

const AppStateContext = createContext<AppStateContextValue | undefined>(undefined);

const initialAppState: AppState = {
  forms: {
    partnership: { lastSubmitted: null, isSubmitting: false },
    incubation: { lastSubmitted: null, isSubmitting: false },
    investment: { lastSubmitted: null, isSubmitting: false },
    mentor: { lastSubmitted: null, isSubmitting: false },
    program: { lastSubmitted: null, isSubmitting: false },
    grant: { lastSubmitted: null, isSubmitting: false },
    hackathon: { lastSubmitted: null, isSubmitting: false },
    consultation: { lastSubmitted: null, isSubmitting: false },
  },
  dashboards: {
    user: { lastRefreshed: null, isLoading: false },
    startup: { lastRefreshed: null, isLoading: false },
    investor: { lastRefreshed: null, isLoading: false },
    admin: { lastRefreshed: null, isLoading: false },
  },
  refreshTrigger: 0,
};

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(initialAppState);
  const { user } = useAuth();

  // Reset form states when user changes
  useEffect(() => {
    if (user) {
      // Reset all form states when user logs in
      setState(prev => ({
        ...prev,
        forms: {
          partnership: { lastSubmitted: null, isSubmitting: false },
          incubation: { lastSubmitted: null, isSubmitting: false },
          investment: { lastSubmitted: null, isSubmitting: false },
          mentor: { lastSubmitted: null, isSubmitting: false },
          program: { lastSubmitted: null, isSubmitting: false },
          grant: { lastSubmitted: null, isSubmitting: false },
          hackathon: { lastSubmitted: null, isSubmitting: false },
          consultation: { lastSubmitted: null, isSubmitting: false },
        },
        dashboards: {
          user: { lastRefreshed: null, isLoading: false },
          startup: { lastRefreshed: null, isLoading: false },
          investor: { lastRefreshed: null, isLoading: false },
          admin: { lastRefreshed: null, isLoading: false },
        },
      }));
    }
  }, [user?.id]);

  // Form management functions
  const setFormSubmitting = useCallback((formType: keyof AppState['forms'], isSubmitting: boolean) => {
    setState(prev => ({
      ...prev,
      forms: {
        ...prev.forms,
        [formType]: {
          ...prev.forms[formType],
          isSubmitting,
        },
      },
    }));
  }, []);

  const setFormSubmitted = useCallback((formType: keyof AppState['forms']) => {
    setState(prev => ({
      ...prev,
      forms: {
        ...prev.forms,
        [formType]: {
          lastSubmitted: new Date(),
          isSubmitting: false,
        },
      },
    }));
  }, []);

  const resetForm = useCallback((formType: keyof AppState['forms']) => {
    setState(prev => ({
      ...prev,
      forms: {
        ...prev.forms,
        [formType]: {
          lastSubmitted: null,
          isSubmitting: false,
        },
      },
    }));
  }, []);

  // Dashboard management functions
  const setDashboardLoading = useCallback((dashboardType: keyof AppState['dashboards'], isLoading: boolean) => {
    console.log(`Setting dashboard ${dashboardType} loading: ${isLoading}`);
    setState(prev => ({
      ...prev,
      dashboards: {
        ...prev.dashboards,
        [dashboardType]: {
          ...prev.dashboards[dashboardType],
          isLoading,
        },
      },
    }));
  }, []);

  const setDashboardRefreshed = useCallback((dashboardType: keyof AppState['dashboards']) => {
    console.log(`Setting dashboard ${dashboardType} as refreshed`);
    setState(prev => ({
      ...prev,
      dashboards: {
        ...prev.dashboards,
        [dashboardType]: {
          lastRefreshed: new Date(),
          isLoading: false,
        },
      },
    }));
  }, []);

  const refreshDashboard = useCallback((dashboardType: keyof AppState['dashboards']) => {
    setDashboardLoading(dashboardType, true);
    // Trigger a small delay to simulate refresh
    setTimeout(() => {
      setDashboardRefreshed(dashboardType);
    }, 100);
  }, [setDashboardLoading, setDashboardRefreshed]);

  // Global refresh
  const triggerGlobalRefresh = useCallback(() => {
    setState(prev => ({
      ...prev,
      refreshTrigger: prev.refreshTrigger + 1,
    }));
  }, []);

  // Utility functions
  const isFormRecentlySubmitted = useCallback((formType: keyof AppState['forms'], minutes = 5) => {
    const form = state.forms[formType];
    if (!form.lastSubmitted) return false;
    
    const timeDiff = Date.now() - form.lastSubmitted.getTime();
    const minutesDiff = timeDiff / (1000 * 60);
    return minutesDiff < minutes;
  }, [state.forms]);

  const shouldRefreshDashboard = useCallback((dashboardType: keyof AppState['dashboards'], minutes = 5) => {
    const dashboard = state.dashboards[dashboardType];
    if (!dashboard.lastRefreshed) return true;
    
    const timeDiff = Date.now() - dashboard.lastRefreshed.getTime();
    const minutesDiff = timeDiff / (1000 * 60);
    return minutesDiff >= minutes;
  }, [state.dashboards]);

  const value: AppStateContextValue = {
    state,
    setFormSubmitting,
    setFormSubmitted,
    resetForm,
    setDashboardLoading,
    setDashboardRefreshed,
    refreshDashboard,
    triggerGlobalRefresh,
    isFormRecentlySubmitted,
    shouldRefreshDashboard,
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};
