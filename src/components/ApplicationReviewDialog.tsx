import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, User, Building, Phone, Globe, FileText } from "lucide-react";
import adminApiService from "@/services/adminApiService";

interface ApplicationReviewDialogProps {
  children: React.ReactNode;
  applicationId: string;
  applicationType: string;
  onStatusUpdate?: () => void;
}

interface ApplicationDetails {
  id: string;
  startup_name?: string;
  team_name?: string;
  founder_name?: string;
  full_name?: string;
  email: string;
  phone?: string;
  description?: string;
  project_idea?: string;
  stage?: string;
  funding_stage?: string;
  current_stage?: string;
  track?: string;
  status: string;
  admin_notes?: string;
  created_at: string;
  profiles?: {
    full_name: string;
    email: string;
    phone?: string;
  };
}

const ApplicationReviewDialog = ({ 
  children, 
  applicationId, 
  applicationType, 
  onStatusUpdate 
}: ApplicationReviewDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [application, setApplication] = useState<ApplicationDetails | null>(null);
  const [status, setStatus] = useState<string>('');
  const [adminNotes, setAdminNotes] = useState<string>('');
  const [sendEmail, setSendEmail] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    if (open && applicationId) {
      fetchApplicationDetails();
    }
  }, [open, applicationId]);

  const fetchApplicationDetails = async () => {
    try {
      setIsLoading(true);
      const response = await adminApiService.getApplicationDetails(applicationId, applicationType);
      
      if (response.success && response.data) {
        setApplication(response.data);
        setStatus(response.data.status || 'pending');
        setAdminNotes(response.data.admin_notes || '');
      } else {
        toast({
          title: "Error",
          description: "Failed to load application details",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error fetching application details:', error);
      toast({
        title: "Error",
        description: "Failed to load application details",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!status) {
      toast({
        title: "Status Required",
        description: "Please select a status",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsUpdating(true);
      const response = await adminApiService.updateApplicationStatus(
        applicationId,
        applicationType,
        status,
        adminNotes,
        sendEmail
      );

      if (response.success) {
        toast({
          title: "Success",
          description: "Application status updated successfully",
        });
        
        // Update local state
        if (application) {
          setApplication({
            ...application,
            status,
            admin_notes: adminNotes
          });
        }
        
        // Trigger parent refresh
        onStatusUpdate?.();
        
        // Close dialog after a short delay
        setTimeout(() => setOpen(false), 1500);
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to update application status",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error updating application status:', error);
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return <Badge className="bg-green-500 text-white hover:bg-green-600">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500 text-white hover:bg-red-600">Rejected</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">Pending</Badge>;
      case 'under_review':
        return <Badge className="bg-blue-500 text-white hover:bg-blue-600">Under Review</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getApplicationTypeLabel = (type: string) => {
    switch (type) {
      case 'incubation':
        return 'Incubation Application';
      case 'investment':
        return 'Investment Application';
      case 'program':
        return 'Program Application';
      case 'hackathon':
        return 'Hackathon Registration';
      default:
        return 'Application';
    }
  };

  if (!application && isLoading) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading application details...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Review {getApplicationTypeLabel(applicationType)}</DialogTitle>
          <DialogDescription>
            Review and update the application status. You can add admin notes and send email notifications.
          </DialogDescription>
        </DialogHeader>

        {application && (
          <div className="space-y-6">
            {/* Application Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Application Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Startup/Team Name</Label>
                    <p className="text-lg font-semibold">
                      {application.startup_name || application.team_name || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Founder/Leader</Label>
                    <p className="text-lg font-semibold">
                      {application.founder_name || application.full_name || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      {application.email}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {application.phone || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Stage/Track</Label>
                    <p className="text-lg font-semibold">
                      {application.stage || application.funding_stage || application.current_stage || application.track || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Current Status</Label>
                    <div className="mt-1">
                      {getStatusBadge(application.status)}
                    </div>
                  </div>
                </div>

                {(application.description || application.project_idea) && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Description/Project Idea</Label>
                    <p className="mt-1 text-sm bg-muted p-3 rounded-md">
                      {application.description || application.project_idea}
                    </p>
                  </div>
                )}

                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Submitted On</Label>
                  <p className="text-sm">
                    {new Date(application.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Status Update Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Update Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="status">New Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="under_review">Under Review</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="adminNotes">Admin Notes</Label>
                  <Textarea
                    id="adminNotes"
                    placeholder="Add any notes or comments about this application..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sendEmail"
                    checked={sendEmail}
                    onCheckedChange={(checked) => setSendEmail(checked as boolean)}
                  />
                  <Label htmlFor="sendEmail">Send email notification to applicant</Label>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)} 
                disabled={isUpdating}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleStatusUpdate} 
                disabled={isUpdating || !status}
                className="flex-1"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Status"
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationReviewDialog;
