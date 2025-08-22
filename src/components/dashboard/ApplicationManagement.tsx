import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye, CheckCircle, XCircle, Search, Filter, FileText, Clock, AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import adminApiService, { type ApplicationWithDetails } from "@/services/adminApiService";

interface ApplicationManagementProps {
  applications?: Array<{
    id: number;
    startup: string;
    founder: string;
    stage: string;
    status: string;
    date: string;
  }>;
}

const ApplicationManagement = ({ applications: propApplications }: ApplicationManagementProps) => {
  const [realApplications, setRealApplications] = useState<ApplicationWithDetails[]>([]);
  const [applicationStats, setApplicationStats] = useState({
    totalApplications: 0,
    pending: 0,
    approved: 0,
    underReview: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState<ApplicationWithDetails | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [newStatus, setNewStatus] = useState("");
  
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchRealApplications();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchRealApplications = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching real applications and stats...');
      
      const [applicationsResponse, statsResponse] = await Promise.all([
        adminApiService.getApplications(),
        adminApiService.getApplicationStats()
      ]);

      if (applicationsResponse.success) {
        setRealApplications(applicationsResponse.data!);
        console.log(`Loaded ${applicationsResponse.data!.length} applications`);
      } else {
        throw new Error(applicationsResponse.error || 'Failed to fetch applications');
      }

      if (statsResponse.success) {
        setApplicationStats(statsResponse.data!);
        console.log('Loaded application stats:', statsResponse.data);
      } else {
        console.error('Failed to load application stats:', statsResponse.error);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Error",
        description: "Failed to load applications. Using fallback data.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Use real applications if available, otherwise fall back to props
  const applications = realApplications.length > 0 ? realApplications : (propApplications || []).map(app => ({
    id: app.id.toString(),
    startup: app.startup,
    founder: app.founder,
    stage: app.stage,
    status: app.status,
    date: app.date,
    type: 'legacy',
    email: '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }));

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.startup?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.founder?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status?.toLowerCase() === statusFilter.toLowerCase();
    const matchesType = typeFilter === "all" || app.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return <Badge className="bg-green-500 text-white hover:bg-green-600">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500 text-white hover:bg-red-600">Rejected</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">Pending</Badge>;
      case 'under review':
        return <Badge className="bg-orange-500 text-white hover:bg-orange-600">Under Review</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'under review':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleViewDetails = (application: ApplicationWithDetails) => {
    setSelectedApplication(application);
    setShowDetailsDialog(true);
  };

  const handleUpdateStatus = (application: ApplicationWithDetails) => {
    setSelectedApplication(application);
    setNewStatus(application.status);
    setAdminNotes(application.admin_notes || "");
    setShowUpdateDialog(true);
  };

  const handleStatusUpdate = async () => {
    if (!selectedApplication || !newStatus || !user) return;

    try {
      setIsUpdating(true);
      console.log('Updating application status:', {
        id: selectedApplication.id,
        status: newStatus,
        notes: adminNotes
      });

      const response = await adminApiService.updateApplicationStatus(
        selectedApplication.id,
        selectedApplication.type,
        newStatus,
        adminNotes
      );

      if (response.success) {
        // Update local state
        setRealApplications(prev => prev.map(app => 
          app.id === selectedApplication.id 
            ? { 
                ...app, 
                status: newStatus,
                admin_notes: adminNotes,
                reviewed_by: user.id,
                reviewed_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
            : app
        ));

        toast({
          title: "Status Updated",
          description: `Application status updated to ${newStatus}. Email notification sent.`,
        });

        setShowUpdateDialog(false);
        setSelectedApplication(null);
        setAdminNotes("");
        setNewStatus("");
      } else {
        throw new Error(response.error || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating application status:', error);
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update application status",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusCount = (status: string) => {
    return applications.filter(app => app.status.toLowerCase() === status.toLowerCase()).length;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading real-time applications...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Application Management</h2>
          <p className="text-muted-foreground">Review and manage startup applications ({applications.length} total)</p>
        </div>
        <Button
          onClick={fetchRealApplications}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh Data</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Total Applications</p>
                <p className="text-2xl font-bold">{applicationStats.totalApplications.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{applicationStats.pending.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Approved</p>
                <p className="text-2xl font-bold text-green-600">{applicationStats.approved.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Under Review</p>
                <p className="text-2xl font-bold text-blue-600">{applicationStats.underReview.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Applications List */}
      <Card>
        <CardHeader>
          <CardTitle>Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Under Review">Under Review</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="incubation">Incubation</SelectItem>
                <SelectItem value="investment">Investment</SelectItem>
                <SelectItem value="program">Program</SelectItem>
                <SelectItem value="mentor">Mentor</SelectItem>
                <SelectItem value="grant">Grant</SelectItem>
                <SelectItem value="partnership">Partnership</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {filteredApplications.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No applications found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              filteredApplications.map((application) => (
                <Card key={application.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {getStatusIcon(application.status)}
                          <h3 className="font-semibold text-lg">{application.startup}</h3>
                          {getStatusBadge(application.status)}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">Founder:</span> {application.founder}
                          </div>
                          <div>
                            <span className="font-medium">Stage:</span> {application.stage}
                          </div>
                          <div>
                            <span className="font-medium">Submitted:</span> {application.date}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(application)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        {application.status !== 'Approved' && application.status !== 'Rejected' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateStatus(application)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Review
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Application Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              Review the complete application information
            </DialogDescription>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Basic Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Startup:</span> {selectedApplication.startup}</div>
                    <div><span className="font-medium">Founder:</span> {selectedApplication.founder}</div>
                    <div><span className="font-medium">Stage:</span> {selectedApplication.stage}</div>
                    <div><span className="font-medium">Status:</span> {getStatusBadge(selectedApplication.status)}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Application Details</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Submitted:</span> {selectedApplication.date}</div>
                    <div><span className="font-medium">Type:</span> Incubation Program</div>
                    <div><span className="font-medium">Priority:</span> High</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
              Close
            </Button>
            {selectedApplication?.status !== 'Approved' && selectedApplication?.status !== 'Rejected' && (
              <Button onClick={() => {
                setShowDetailsDialog(false);
                handleUpdateStatus(selectedApplication);
              }}>
                Review Application
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Application Status</DialogTitle>
            <DialogDescription>
              Review and update the application status
            </DialogDescription>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Application</h4>
                <div className="text-sm">
                  <div><span className="font-medium">Startup:</span> {selectedApplication.startup}</div>
                  <div><span className="font-medium">Founder:</span> {selectedApplication.founder}</div>
                  <div><span className="font-medium">Current Status:</span> {getStatusBadge(selectedApplication.status)}</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">New Status</h4>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select new status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                    <SelectItem value="Under Review">Under Review</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Admin Notes</h4>
                <Textarea
                  placeholder="Add notes about this application..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUpdateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleStatusUpdate} disabled={!newStatus}>
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApplicationManagement;