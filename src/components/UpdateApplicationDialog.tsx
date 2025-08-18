import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useAuthUI } from "@/context/AuthUIContext";
import startupDashboardService from "@/services/startupDashboardService";
import { Loader2, FileText } from "lucide-react";

interface UpdateApplicationDialogProps {
  children: React.ReactNode;
}

interface Application {
  id: string;
  type: string;
  title: string;
  status: string;
  created_at: string;
  [key: string]: any;
}

const UpdateApplicationDialog = ({ children }: UpdateApplicationDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);
  
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const { openLogin } = useAuthUI();

  const handleOpenChange = (next: boolean) => {
    if (next && !isAuthenticated) {
      openLogin();
      return;
    }
    setOpen(next);
    if (next) {
      fetchApplications();
    }
  };

  const fetchApplications = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      const response = await startupDashboardService.getUserApplicationsForUpdate(user.id);
      
      if (response.success) {
        const allApplications: Application[] = [];
        
        // Combine all application types
        Object.entries(response.data).forEach(([type, apps]: [string, any]) => {
          if (Array.isArray(apps)) {
            apps.forEach((app: any) => {
              allApplications.push({
                ...app,
                type,
                title: getApplicationTitle(type, app)
              });
            });
          }
        });
        
        setApplications(allApplications);
      } else {
        toast({
          title: "Error",
          description: "Failed to load applications",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Error",
        description: "Failed to load applications",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getApplicationTitle = (type: string, app: any) => {
    switch (type) {
      case 'incubation':
        return `Incubation Application - ${app.startup_name || 'Startup'}`;
      case 'investment':
        return `Investment Application - ${app.investor_name || 'Investor'}`;
      case 'program':
        return `Program Application - ${app.program_name || 'Program'}`;
      case 'mentor':
        return `Mentor Application - ${app.expertise_area || 'Mentorship'}`;
      default:
        return `${type} Application`;
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
      case 'under_review':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleUpdateApplication = (application: Application) => {
    toast({
      title: "Update Feature",
      description: `Update functionality for ${application.title} will be implemented soon.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Application</DialogTitle>
          <DialogDescription>
            Select an application to update and modify its details.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Loading applications...</span>
            </div>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No applications found</h3>
            <p className="text-muted-foreground">
              You haven't submitted any applications yet. Submit an application first to update it.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-4">
              {applications.map((application) => (
                <Card 
                  key={application.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleUpdateApplication(application)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-4 w-4" />
                        <div>
                          <CardTitle className="text-lg">{application.title}</CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-sm text-muted-foreground">
                              Submitted: {new Date(application.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge className={getStatusColor(application.status)}>
                        {application.status}
                      </Badge>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UpdateApplicationDialog;
