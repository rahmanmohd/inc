import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { apiService } from "@/services/apiService";
import { emailService } from "@/services/emailService";
import { Loader2, Eye, CheckCircle, XCircle, MessageSquare } from "lucide-react";

interface Application {
  id: string;
  type: string;
  applicant_name?: string;
  founder_name?: string;
  email: string;
  startup_name?: string;
  program_name?: string;
  status: string;
  submitted_at?: string;
  created_at?: string;
  problem_statement?: string;
  solution_description?: string;
  target_market?: string;
  business_model?: string;
  technical_requirements?: string;
  timeline?: string;
  team_size?: string;
  funding_stage?: string;
  expected_outcome?: string;
  phone?: string;
  admin_notes?: string;
}

interface AdminApplicationReviewProps {
  application: Application;
  onStatusUpdate: (applicationId: string, status: string) => void;
}

const AdminApplicationReview = ({ application, onStatusUpdate }: AdminApplicationReviewProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [adminNotes, setAdminNotes] = useState(application.admin_notes || "");
  const { user } = useAuth();
  const { toast } = useToast();

  const getApplicationTypeName = (type: string) => {
    switch (type) {
      case 'incubation':
        return 'Incubation Program';
      case 'mvp_lab':
        return 'MVP Lab';
      case 'inc_lab':
        return 'INC Lab';
      case 'investment':
        return 'Investment';
      case 'mentor':
        return 'Mentor Program';
      case 'consultation':
        return 'Consultation';
      case 'hackathon':
        return 'Hackathon';
      case 'grant':
        return 'Grant Application';
      case 'partnership':
        return 'Partnership';
      case 'contact':
        return 'Contact Form';
      default:
        return type;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500 hover:bg-red-600">Rejected</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>;
      case 'under_review':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Under Review</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const updateApplicationStatus = async (status: string) => {
    try {
      setIsUpdating(true);
      
      const response = await apiService.updateApplicationStatus(application.id, status, adminNotes);
      
      if (response.success) {
        // Send email notification to user
        try {
          await emailService.sendStatusUpdateEmail({
            name: application.applicant_name || application.founder_name || "User",
            email: application.email,
            applicationType: application.type,
            status: status,
            startupName: application.startup_name,
            adminNotes: adminNotes
          });
          
          toast({
            title: "Status Updated Successfully!",
            description: `Application ${status} and email notification sent to user.`,
          });
        } catch (emailError) {
          console.error('Email sending failed:', emailError);
          toast({
            title: "Status Updated Successfully!",
            description: `Application ${status} but email notification failed.`,
          });
        }

        onStatusUpdate(application.id, status);
        setIsOpen(false);
      } else {
        toast({
          title: "Update Failed",
          description: response.message || "Failed to update application status",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error updating application status:', error);
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Application Review</DialogTitle>
          <DialogDescription>
            Review application details and update status
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Applicant Details</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Name:</strong> {application.applicant_name || application.founder_name || "N/A"}</div>
                    <div><strong>Email:</strong> {application.email}</div>
                    <div><strong>Phone:</strong> {application.phone || "N/A"}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Application Details</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Type:</strong> {getApplicationTypeName(application.type)}</div>
                    <div><strong>Status:</strong> {getStatusBadge(application.status)}</div>
                    <div><strong>Startup:</strong> {application.startup_name || "N/A"}</div>
                    <div><strong>Program:</strong> {application.program_name || "N/A"}</div>
                    <div><strong>Submitted:</strong> {new Date(application.submitted_at || application.created_at || "").toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Problem & Solution */}
          {(application.problem_statement || application.solution_description) && (
            <Card>
              <CardHeader>
                <CardTitle>Problem & Solution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {application.problem_statement && (
                  <div>
                    <h4 className="font-semibold mb-2">Problem Statement</h4>
                    <p className="text-sm text-muted-foreground">{application.problem_statement}</p>
                  </div>
                )}
                {application.solution_description && (
                  <div>
                    <h4 className="font-semibold mb-2">Solution Description</h4>
                    <p className="text-sm text-muted-foreground">{application.solution_description}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Market & Business */}
          {(application.target_market || application.business_model) && (
            <Card>
              <CardHeader>
                <CardTitle>Market & Business</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {application.target_market && (
                    <div>
                      <h4 className="font-semibold mb-2">Target Market</h4>
                      <p className="text-sm text-muted-foreground">{application.target_market}</p>
                    </div>
                  )}
                  {application.business_model && (
                    <div>
                      <h4 className="font-semibold mb-2">Business Model</h4>
                      <p className="text-sm text-muted-foreground">{application.business_model}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Technical Requirements */}
          {application.technical_requirements && (
            <Card>
              <CardHeader>
                <CardTitle>Technical Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{application.technical_requirements}</p>
              </CardContent>
            </Card>
          )}

          {/* Project Details */}
          {(application.timeline || application.team_size || application.funding_stage) && (
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {application.timeline && (
                    <div>
                      <h4 className="font-semibold mb-2">Timeline</h4>
                      <p className="text-sm text-muted-foreground">{application.timeline}</p>
                    </div>
                  )}
                  {application.team_size && (
                    <div>
                      <h4 className="font-semibold mb-2">Team Size</h4>
                      <p className="text-sm text-muted-foreground">{application.team_size}</p>
                    </div>
                  )}
                  {application.funding_stage && (
                    <div>
                      <h4 className="font-semibold mb-2">Funding Stage</h4>
                      <p className="text-sm text-muted-foreground">{application.funding_stage}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Expected Outcome */}
          {application.expected_outcome && (
            <Card>
              <CardHeader>
                <CardTitle>Expected Outcome</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{application.expected_outcome}</p>
              </CardContent>
            </Card>
          )}

          {/* Admin Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Admin Notes</CardTitle>
              <CardDescription>Add your review notes and feedback</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Add your review notes..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => updateApplicationStatus("rejected")}
              disabled={isUpdating}
            >
              {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
              Reject
            </Button>
            <Button
              onClick={() => updateApplicationStatus("approved")}
              disabled={isUpdating}
            >
              {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
              Approve
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminApplicationReview;
