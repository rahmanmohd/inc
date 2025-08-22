import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Eye, ExternalLink, MapPin, Users, Calendar, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import adminApiService from "@/services/adminApiService";

interface ViewStartupDialogProps {
  children: React.ReactNode;
  startupId: string;
}

interface StartupData {
  id: string;
  name: string;
  description?: string;
  industry?: string;
  stage?: string;
  website?: string;
  location?: string;
  team_size?: number;
  founded_year?: number;
  logo_url?: string;
  published: boolean;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name?: string;
    email?: string;
  };
}

const ViewStartupDialog = ({ children, startupId }: ViewStartupDialogProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [startup, setStartup] = useState<StartupData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open && startupId) {
      fetchStartupDetails();
    }
  }, [open, startupId]);

  const fetchStartupDetails = async () => {
    setIsLoading(true);
    try {
      const response = await adminApiService.getStartup(startupId);
      if (response.success) {
        setStartup(response.data);
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to fetch startup details",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error fetching startup details:', error);
      toast({
        title: "Error",
        description: "Failed to fetch startup details",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'series a':
        return <Badge className="bg-green-500 text-white hover:bg-green-600">Series A</Badge>;
      case 'seed':
        return <Badge className="bg-blue-500 text-white hover:bg-blue-600">Seed</Badge>;
      case 'pre-seed':
        return <Badge className="bg-purple-500 text-white hover:bg-purple-600">Pre-Seed</Badge>;
      case 'series b':
        return <Badge className="bg-orange-500 text-white hover:bg-orange-600">Series B</Badge>;
      case 'series c':
        return <Badge className="bg-red-500 text-white hover:bg-red-600">Series C</Badge>;
      case 'unicorn':
        return <Badge className="bg-yellow-500 text-white hover:bg-yellow-600">Unicorn</Badge>;
      default:
        return <Badge variant="outline">{status || 'Unknown'}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!startup && isLoading) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Startup Details</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading startup details...</span>
            </div>
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
          <DialogTitle>Startup Details</DialogTitle>
        </DialogHeader>
        {startup && (
          <div className="space-y-6">
            {/* Header Section */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  {startup.logo_url && (
                    <img 
                      src={startup.logo_url} 
                      alt={`${startup.name} logo`}
                      className="w-16 h-16 rounded-lg object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h2 className="text-2xl font-bold">{startup.name}</h2>
                      {getStatusBadge(startup.stage || '')}
                      <Badge variant={startup.published ? "default" : "secondary"}>
                        {startup.published ? "Published" : "Draft"}
                      </Badge>
                    </div>
                    {startup.description && (
                      <p className="text-muted-foreground mb-3">{startup.description}</p>
                    )}
                    <div className="flex flex-wrap gap-4 text-sm">
                      {startup.industry && (
                        <div className="flex items-center space-x-1">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span>{startup.industry}</span>
                        </div>
                      )}
                      {startup.location && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{startup.location}</span>
                        </div>
                      )}
                      {startup.team_size && (
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{startup.team_size} employees</span>
                        </div>
                      )}
                      {startup.founded_year && (
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Founded {startup.founded_year}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Industry</label>
                    <p className="text-sm">{startup.industry || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Stage</label>
                    <p className="text-sm">{startup.stage || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Location</label>
                    <p className="text-sm">{startup.location || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Team Size</label>
                    <p className="text-sm">{startup.team_size ? `${startup.team_size} employees` : 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Founded Year</label>
                    <p className="text-sm">{startup.founded_year || 'Not specified'}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Contact & Links */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact & Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {startup.website && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Website</label>
                      <div className="flex items-center space-x-2">
                        <a 
                          href={startup.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline flex items-center space-x-1"
                        >
                          <span>Visit Website</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  )}
                  {startup.profiles?.email && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Contact Email</label>
                      <p className="text-sm">{startup.profiles.email}</p>
                    </div>
                  )}
                  {startup.profiles?.full_name && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Owner</label>
                      <p className="text-sm">{startup.profiles.full_name}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Description */}
            {startup.description && (
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap">{startup.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Metadata */}
            <Card>
              <CardHeader>
                <CardTitle>Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Created</label>
                    <p className="text-sm">{formatDate(startup.created_at)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                    <p className="text-sm">{formatDate(startup.updated_at)}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <p className="text-sm">{startup.published ? 'Published and visible to public' : 'Draft - not visible to public'}</p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewStartupDialog;
