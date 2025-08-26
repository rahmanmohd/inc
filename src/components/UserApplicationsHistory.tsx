import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import apiService from "@/services/apiService";
import { supabase } from "@/lib/supabase";
import { Calendar, FileText, Users, Target, MessageSquare, Code, Zap, Bell } from "lucide-react";

interface UserApplicationsHistoryProps {
  className?: string;
}

const UserApplicationsHistory = ({ className }: UserApplicationsHistoryProps) => {
  const [applications, setApplications] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isRealTimeConnected, setIsRealTimeConnected] = useState(false);
  const [newApplicationsCount, setNewApplicationsCount] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user?.id) {
      loadUserApplications();
      setupRealTimeSubscriptions();
    }

    return () => {
      cleanupSubscriptions();
    };
  }, [user?.id]);

  const loadUserApplications = async () => {
    try {
      setLoading(true);
      const response = await apiService.getUserApplications(user!.id);
      if (response.success) {
        setApplications(response.data);
      } else {
        toast({
          title: "Error",
          description: "Failed to load your applications",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error loading applications:', error);
      toast({
        title: "Error",
        description: "Failed to load your applications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Real-time subscription setup
  const setupRealTimeSubscriptions = useCallback(() => {
    if (!user?.id) return;

    const subscriptions: any[] = [];

    // Application tables configuration
    const applicationTables = [
      { table: 'incubation_applications', key: 'incubation', userField: 'applicant_id' },
      { table: 'investment_applications', key: 'investment', userField: 'applicant_id' },
      { table: 'program_applications', key: 'program', userField: 'applicant_id' },
      { table: 'mentor_applications', key: 'mentor', userField: 'user_id' },
      { table: 'consultations', key: 'consultations', userField: 'user_id' },
      { table: 'hackathon_registrations', key: 'hackathon', userField: 'user_id' }
    ];

    // Subscribe to each application table
    applicationTables.forEach(({ table, key, userField }) => {
      const subscription = supabase
        .channel(`user_applications_${table}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: table,
            filter: `${userField}=eq.${user.id}`
          },
          (payload) => {
            console.log(`Real-time update on ${table}:`, payload);
            handleRealTimeUpdate(payload, key);
          }
        )
        .subscribe((status) => {
          console.log(`Subscription status for ${table}:`, status);
          if (status === 'SUBSCRIBED') {
            setIsRealTimeConnected(true);
          }
        });

      subscriptions.push(subscription);
    });

    // Store subscriptions for cleanup
    (window as any).applicationSubscriptions = subscriptions;

    // Show connection status
    toast({
      title: "🔴 Live Updates Active",
      description: "Your applications will update in real-time",
      duration: 3000,
    });
  }, [user?.id, toast]);

  // Handle real-time updates
  const handleRealTimeUpdate = useCallback((payload: any, applicationKey: string) => {
    const { eventType, new: newRecord, old: oldRecord } = payload;

    setApplications((prev: any) => {
      if (!prev) return prev;

      const updated = { ...prev };

      switch (eventType) {
        case 'INSERT':
          // New application submitted
          updated[applicationKey] = [newRecord, ...updated[applicationKey]];
          setNewApplicationsCount(count => count + 1);
          
          toast({
            title: "📝 New Application Submitted",
            description: `Your ${applicationKey} application has been submitted successfully`,
            duration: 5000,
          });
          break;

        case 'UPDATE':
          // Application status changed
          updated[applicationKey] = updated[applicationKey].map((app: any) =>
            app.id === newRecord.id ? newRecord : app
          );

          // Check if status changed
          if (oldRecord.status !== newRecord.status) {
            const statusEmoji = {
              'approved': '✅',
              'rejected': '❌',
              'pending': '⏳',
              'under_review': '👀',
              'submitted': '📋'
            };

            toast({
              title: `${statusEmoji[newRecord.status as keyof typeof statusEmoji] || '📄'} Status Updated`,
              description: `Your ${applicationKey} application is now ${newRecord.status}`,
              duration: 5000,
              variant: newRecord.status === 'approved' ? 'default' : 
                       newRecord.status === 'rejected' ? 'destructive' : 'default'
            });
          }
          break;

        case 'DELETE':
          // Application deleted (rare)
          updated[applicationKey] = updated[applicationKey].filter((app: any) => app.id !== oldRecord.id);
          break;
      }

      return updated;
    });
  }, [toast]);

  // Cleanup subscriptions
  const cleanupSubscriptions = useCallback(() => {
    const subscriptions = (window as any).applicationSubscriptions;
    if (subscriptions) {
      subscriptions.forEach((sub: any) => {
        sub.unsubscribe();
      });
      (window as any).applicationSubscriptions = null;
    }
    setIsRealTimeConnected(false);
  }, []);

  // Clear new applications count
  const clearNewApplicationsCount = () => {
    setNewApplicationsCount(0);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>My Applications</CardTitle>
          <CardDescription>Loading your application history...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!applications) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>My Applications</CardTitle>
          <CardDescription>No applications found</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const totalApplications = 
    applications.incubation.length + 
    applications.investment.length + 
    applications.program.length + 
    applications.mentor.length + 
    applications.consultations.length + 
    applications.hackathon.length;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              My Applications
              {isRealTimeConnected && (
                <div className="flex items-center gap-1 text-sm">
                  <Zap className="h-4 w-4 text-green-500" />
                  <span className="text-green-500 font-normal">Live</span>
                </div>
              )}
              {newApplicationsCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="animate-pulse"
                  onClick={clearNewApplicationsCount}
                >
                  <Bell className="h-3 w-3 mr-1" />
                  {newApplicationsCount} new
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              You have submitted {totalApplications} application{totalApplications !== 1 ? 's' : ''} in total
              {isRealTimeConnected && (
                <span className="ml-2 text-green-600">• Updates in real-time</span>
              )}
            </CardDescription>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={loadUserApplications}
              disabled={loading}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              ) : (
                "Refresh"
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="all">All ({totalApplications})</TabsTrigger>
            <TabsTrigger value="incubation">Incubation ({applications.incubation.length})</TabsTrigger>
            <TabsTrigger value="investment">Investment ({applications.investment.length})</TabsTrigger>
            <TabsTrigger value="program">Program ({applications.program.length})</TabsTrigger>
            <TabsTrigger value="mentor">Mentor ({applications.mentor.length})</TabsTrigger>
            <TabsTrigger value="consultations">Consultations ({applications.consultations.length})</TabsTrigger>
            <TabsTrigger value="hackathon">Hackathon ({applications.hackathon.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {totalApplications === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No applications submitted yet</p>
                <p className="text-sm">Start by applying to one of our programs!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.incubation.map((app: any) => (
                  <ApplicationCard key={app.id} app={app} type="incubation" />
                ))}
                {applications.investment.map((app: any) => (
                  <ApplicationCard key={app.id} app={app} type="investment" />
                ))}
                {applications.program.map((app: any) => (
                  <ApplicationCard key={app.id} app={app} type="program" />
                ))}
                {applications.mentor.map((app: any) => (
                  <ApplicationCard key={app.id} app={app} type="mentor" />
                ))}
                {applications.consultations.map((app: any) => (
                  <ApplicationCard key={app.id} app={app} type="consultation" />
                ))}
                {applications.hackathon.map((app: any) => (
                  <ApplicationCard key={app.id} app={app} type="hackathon" />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="incubation" className="space-y-4">
            {applications.incubation.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No incubation applications</p>
              </div>
            ) : (
              applications.incubation.map((app: any) => (
                <ApplicationCard key={app.id} app={app} type="incubation" />
              ))
            )}
          </TabsContent>

          <TabsContent value="investment" className="space-y-4">
            {applications.investment.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No investment applications</p>
              </div>
            ) : (
              applications.investment.map((app: any) => (
                <ApplicationCard key={app.id} app={app} type="investment" />
              ))
            )}
          </TabsContent>

          <TabsContent value="program" className="space-y-4">
            {applications.program.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No program applications</p>
              </div>
            ) : (
              applications.program.map((app: any) => (
                <ApplicationCard key={app.id} app={app} type="program" />
              ))
            )}
          </TabsContent>

          <TabsContent value="mentor" className="space-y-4">
            {applications.mentor.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No mentor applications</p>
              </div>
            ) : (
              applications.mentor.map((app: any) => (
                <ApplicationCard key={app.id} app={app} type="mentor" />
              ))
            )}
          </TabsContent>

          <TabsContent value="consultations" className="space-y-4">
            {applications.consultations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No consultation requests</p>
              </div>
            ) : (
              applications.consultations.map((app: any) => (
                <ApplicationCard key={app.id} app={app} type="consultation" />
              ))
            )}
          </TabsContent>

          <TabsContent value="hackathon" className="space-y-4">
            {applications.hackathon.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hackathon registrations</p>
              </div>
            ) : (
              applications.hackathon.map((app: any) => (
                <ApplicationCard key={app.id} app={app} type="hackathon" />
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

// Application Card Component
const ApplicationCard = ({ app, type }: { app: any; type: string }) => {
  // Check if application was created in the last 5 minutes (consider it "new")
  const isNew = new Date(app.created_at).getTime() > Date.now() - 5 * 60 * 1000;
  
  // Check if status was updated in the last 5 minutes
  const isRecentlyUpdated = app.updated_at && 
    new Date(app.updated_at).getTime() > Date.now() - 5 * 60 * 1000 &&
    new Date(app.updated_at).getTime() > new Date(app.created_at).getTime() + 1000;
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'incubation':
        return <Target className="h-4 w-4" />;
      case 'investment':
        return <Target className="h-4 w-4" />;
      case 'program':
        return <FileText className="h-4 w-4" />;
      case 'mentor':
        return <Users className="h-4 w-4" />;
      case 'consultation':
        return <MessageSquare className="h-4 w-4" />;
      case 'hackathon':
        return <Code className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'incubation':
        return 'Incubation';
      case 'investment':
        return 'Investment';
      case 'program':
        return app.program || 'Program';
      case 'mentor':
        return 'Mentor';
      case 'consultation':
        return 'Consultation';
      case 'hackathon':
        return 'Hackathon';
      default:
        return 'Application';
    }
  };

  return (
    <Card className={`border-l-4 ${
      isNew ? 'border-l-green-500 bg-green-50 animate-pulse' : 
      isRecentlyUpdated ? 'border-l-orange-500 bg-orange-50' : 
      'border-l-primary'
    }`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {getTypeIcon(type)}
              <h4 className="font-semibold">{getTypeLabel(type)}</h4>
              <Badge className={getStatusColor(app.status)}>
                {app.status || 'Submitted'}
              </Badge>
              {isNew && (
                <Badge variant="secondary" className="text-green-700 bg-green-100">
                  <Zap className="h-3 w-3 mr-1" />
                  NEW
                </Badge>
              )}
              {isRecentlyUpdated && !isNew && (
                <Badge variant="secondary" className="text-orange-700 bg-orange-100">
                  <Bell className="h-3 w-3 mr-1" />
                  UPDATED
                </Badge>
              )}
            </div>
            
            <div className="text-sm text-muted-foreground space-y-1">
              {app.startup_name && (
                <p><strong>Startup:</strong> {app.startup_name}</p>
              )}
              {app.founder_name && (
                <p><strong>Founder:</strong> {app.founder_name}</p>
              )}
              {app.full_name && (
                <p><strong>Name:</strong> {app.full_name}</p>
              )}
              {app.email && (
                <p><strong>Email:</strong> {app.email}</p>
              )}
              {app.problem && (
                <p><strong>Problem:</strong> {app.problem.substring(0, 100)}...</p>
              )}
              {app.description && (
                <p><strong>Description:</strong> {app.description.substring(0, 100)}...</p>
              )}
            </div>
          </div>
          
          <div className="text-right text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(app.created_at)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserApplicationsHistory;
