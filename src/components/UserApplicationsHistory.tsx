import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import apiService from "@/services/apiService";
import { Calendar, FileText, Users, Target, MessageSquare, Code } from "lucide-react";

interface UserApplicationsHistoryProps {
  className?: string;
}

const UserApplicationsHistory = ({ className }: UserApplicationsHistoryProps) => {
  const [applications, setApplications] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user?.id) {
      loadUserApplications();
    }
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
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          My Applications
        </CardTitle>
        <CardDescription>
          You have submitted {totalApplications} application{totalApplications !== 1 ? 's' : ''} in total
        </CardDescription>
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
    <Card className="border-l-4 border-l-primary">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {getTypeIcon(type)}
              <h4 className="font-semibold">{getTypeLabel(type)}</h4>
              <Badge className={getStatusColor(app.status)}>
                {app.status || 'Submitted'}
              </Badge>
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
