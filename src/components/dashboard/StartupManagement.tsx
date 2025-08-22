import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Edit, Trash2, Search, Filter, Plus, ChevronUp, Building2, Loader2, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAppState } from "@/context/AppStateContext";
import adminApiService from "@/services/adminApiService";
import AddStartupDialog from "./AddStartupDialog";
import ViewStartupDialog from "./ViewStartupDialog";
import EditStartupDialog from "./EditStartupDialog";
import DeleteStartupDialog from "./DeleteStartupDialog";

interface StartupData {
  id: string;
  name: string;
  sector: string;
  valuation: string;
  growth: string;
  status: string;
  founder_name: string;
  email: string;
  description?: string;
  website?: string;
  team_size?: number;
  created_at: string;
}

interface StartupStats {
  totalStartups: number;
  active: number;
  funded: number;
  unicorns: number;
}

const StartupManagement = () => {
  const { toast } = useToast();
  const { state, triggerGlobalRefresh } = useAppState();
  const [startups, setStartups] = useState<StartupData[]>([]);
  const [stats, setStats] = useState<StartupStats>({
    totalStartups: 0,
    active: 0,
    funded: 0,
    unicorns: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sectorFilter, setSectorFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchData();
  }, [state.refreshTrigger]);

  // Debug logging
  useEffect(() => {
    console.log('StartupManagement: Current startups count:', startups.length);
    console.log('StartupManagement: Current stats:', stats);
  }, [startups, stats]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      console.log('StartupManagement: Fetching startup data...');
      
      const [statsResponse, directoryResponse] = await Promise.all([
        adminApiService.getStartupStats(),
        adminApiService.getStartupDirectory()
      ]);

      console.log('StartupManagement: Stats response:', statsResponse);
      console.log('StartupManagement: Directory response:', directoryResponse);

      if (statsResponse.success) {
        setStats(statsResponse.data);
        console.log('StartupManagement: Updated stats:', statsResponse.data);
      } else {
        console.error('StartupManagement: Stats response failed:', statsResponse.error);
      }

      if (directoryResponse.success) {
        setStartups(directoryResponse.data);
        console.log('StartupManagement: Updated startups:', directoryResponse.data);
      } else {
        console.error('StartupManagement: Directory response failed:', directoryResponse.error);
      }
    } catch (error) {
      console.error('Error fetching startup data:', error);
      toast({
        title: "Error",
        description: "Failed to load startup data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartupAdded = () => {
    console.log('StartupManagement: Startup added, refreshing data...');
    fetchData();
    triggerGlobalRefresh();
  };

  const handleStartupUpdated = () => {
    console.log('StartupManagement: Startup updated, refreshing data...');
    fetchData();
    triggerGlobalRefresh();
  };

  const handleStartupDeleted = () => {
    console.log('StartupManagement: Startup deleted, refreshing data...');
    fetchData();
    triggerGlobalRefresh();
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await fetchData();
    setIsRefreshing(false);
    toast({
      title: "Success",
      description: "Startup directory refreshed successfully",
    });
  };

  const filteredStartups = startups.filter(startup => {
    const matchesSearch = startup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         startup.sector.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = sectorFilter === "all" || startup.sector === sectorFilter;
    const matchesStatus = statusFilter === "all" || startup.status === statusFilter;
    
    return matchesSearch && matchesSector && matchesStatus;
  });

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
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Startup Management</h2>
            <p className="text-muted-foreground">Manage and oversee all registered startups</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading startup data...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Startup Management</h2>
          <p className="text-muted-foreground">Manage and oversee all registered startups</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleManualRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <AddStartupDialog onStartupAdded={handleStartupAdded} />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Total Startups</p>
                <p className="text-2xl font-bold">{stats.totalStartups.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ChevronUp className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Active</p>
                <p className="text-2xl font-bold text-green-600">{stats.active.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Funded</p>
                <p className="text-2xl font-bold text-blue-600">{stats.funded.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">Unicorns</p>
                <p className="text-2xl font-bold text-purple-600">{stats.unicorns.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Startup Directory</CardTitle>
            <div className="text-sm text-muted-foreground">
              {filteredStartups.length} of {startups.length} startups
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search startups..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={sectorFilter} onValueChange={setSectorFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by sector" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sectors</SelectItem>
                <SelectItem value="HealthTech">HealthTech</SelectItem>
                <SelectItem value="CleanTech">CleanTech</SelectItem>
                <SelectItem value="Education">Education</SelectItem>
                <SelectItem value="FinTech">FinTech</SelectItem>
                <SelectItem value="E-commerce">E-commerce</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pre-Seed">Pre-Seed</SelectItem>
                <SelectItem value="Seed">Seed</SelectItem>
                <SelectItem value="Series A">Series A</SelectItem>
                <SelectItem value="Series B">Series B</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Startup List */}
          <div className="space-y-4">
            {filteredStartups.length === 0 ? (
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No startups found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              filteredStartups.map((startup) => (
                <Card key={startup.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-lg">{startup.name}</h3>
                          {getStatusBadge(startup.status)}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">Sector:</span> {startup.sector}
                          </div>
                          <div>
                            <span className="font-medium">Valuation:</span> {startup.valuation}
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="font-medium">Growth:</span> 
                            <span className="text-green-600 flex items-center">
                              <ChevronUp className="h-4 w-4" />
                              {startup.growth}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ViewStartupDialog startupId={startup.id}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </ViewStartupDialog>
                        <EditStartupDialog startupId={startup.id} onStartupUpdated={handleStartupUpdated}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </EditStartupDialog>
                        <DeleteStartupDialog 
                          startupId={startup.id} 
                          startupName={startup.name}
                          onStartupDeleted={handleStartupDeleted}
                        >
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </DeleteStartupDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StartupManagement;