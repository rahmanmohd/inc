import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Loader2,
  TrendingUp,
  DollarSign,
  Calendar,
  Building
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAppState } from '@/context/AppStateContext';
import adminApiService, { type DealData } from '@/services/adminApiService';
import AddDealDialog from './AddDealDialog';
import ViewDealDialog from './ViewDealDialog';
import EditDealDialog from './EditDealDialog';
import DeleteDealDialog from './DeleteDealDialog';

interface DealStats {
  totalDeals: number;
  activeDeals: number;
  totalValue: string;
  claimsThisMonth: number;
}

const DealManagement = () => {
  const { toast } = useToast();
  const { state, triggerGlobalRefresh } = useAppState();
  
  const [dealStats, setDealStats] = useState<DealStats>({
    totalDeals: 0,
    activeDeals: 0,
    totalValue: '0.00',
    claimsThisMonth: 0
  });
  
  const [deals, setDeals] = useState<DealData[]>([]);
  const [filteredDeals, setFilteredDeals] = useState<DealData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<DealData | null>(null);

  useEffect(() => {
    fetchDealData();
  }, [state.refreshTrigger]);

  useEffect(() => {
    filterDeals();
  }, [deals, searchTerm, statusFilter]);

  const fetchDealData = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching deal data...');

      const [statsResponse, directoryResponse] = await Promise.all([
        adminApiService.getDealStats(),
        adminApiService.getDealDirectory({ limit: 1000 })
      ]);

      if (statsResponse.success) {
        setDealStats(statsResponse.data);
        console.log('Deal stats loaded:', statsResponse.data);
      } else {
        console.error('Failed to load deal stats:', statsResponse.error);
        toast({
          title: "Error",
          description: "Failed to load deal statistics",
          variant: "destructive"
        });
      }

      if (directoryResponse.success) {
        setDeals(directoryResponse.data);
        console.log(`Loaded ${directoryResponse.data.length} deals`);
      } else {
        console.error('Failed to load deals:', directoryResponse.error);
        toast({
          title: "Error", 
          description: "Failed to load deals directory",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error fetching deal data:', error);
      toast({
        title: "Error",
        description: "Failed to load deal data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterDeals = () => {
    let filtered = deals;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(deal =>
        deal.deal_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.startup_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.investor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        deal.sector.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(deal => deal.status === statusFilter);
    }

    setFilteredDeals(filtered);
  };

  const handleManualRefresh = () => {
    fetchDealData();
  };

  const handleViewDeal = (deal: DealData) => {
    setSelectedDeal(deal);
    setIsViewDialogOpen(true);
  };

  const handleEditDeal = (deal: DealData) => {
    setSelectedDeal(deal);
    setIsEditDialogOpen(true);
  };

  const handleDeleteDeal = (deal: DealData) => {
    setSelectedDeal(deal);
    setIsDeleteDialogOpen(true);
  };

  const handleDealAdded = () => {
    setIsAddDialogOpen(false);
    triggerGlobalRefresh();
    toast({
      title: "Success",
      description: "Deal added successfully",
    });
  };

  const handleDealUpdated = () => {
    setIsEditDialogOpen(false);
    setSelectedDeal(null);
    triggerGlobalRefresh();
    toast({
      title: "Success", 
      description: "Deal updated successfully",
    });
  };

  const handleDealDeleted = () => {
    setIsDeleteDialogOpen(false);
    setSelectedDeal(null);
    triggerGlobalRefresh();
    toast({
      title: "Success",
      description: "Deal deleted successfully",
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'default';
      case 'completed':
        return 'secondary';
      case 'pending':
        return 'outline';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const formatCurrency = (value: number) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(1)}Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    } else {
      return `₹${value.toLocaleString()}`;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading deal data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Deal Management</h2>
          <p className="text-muted-foreground">
            Manage deals and partnerships ({deals.length} total)
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleManualRefresh}>
            Refresh
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create New Deal
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deals</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {dealStats.totalDeals}
            </div>
            <p className="text-xs text-muted-foreground">All time deals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {dealStats.activeDeals}
            </div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              ₹{dealStats.totalValue}
            </div>
            <p className="text-xs text-muted-foreground">Combined deal value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Claims This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {dealStats.claimsThisMonth}
            </div>
            <p className="text-xs text-muted-foreground">Monthly activity</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search deals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Deals Directory */}
      <Card>
        <CardHeader>
          <CardTitle>Deal Directory</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredDeals.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No deals found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDeals.map((deal) => (
                <div
                  key={deal.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium">{deal.deal_name}</h3>
                      <Badge variant={getStatusBadgeVariant(deal.status)}>
                        {deal.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">{deal.startup_name}</span> • {deal.investor_name} • {deal.sector}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatCurrency(deal.deal_value)} • {deal.deal_stage}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDeal(deal)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditDeal(deal)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteDeal(deal)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <AddDealDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onDealAdded={handleDealAdded}
      />

      {selectedDeal && (
        <>
          <ViewDealDialog
            open={isViewDialogOpen}
            onOpenChange={setIsViewDialogOpen}
            deal={selectedDeal}
          />

          <EditDealDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            deal={selectedDeal}
            onDealUpdated={handleDealUpdated}
          />

          <DeleteDealDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            deal={selectedDeal}
            onDealDeleted={handleDealDeleted}
          />
        </>
      )}
    </div>
  );
};

export default DealManagement;
