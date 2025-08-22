import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useAppState } from '@/context/AppStateContext';
import adminApiService from '@/services/adminApiService';
import { 
  Users, 
  TrendingUp, 
  Briefcase, 
  BarChart3, 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  RefreshCw,
  Building2,
  Mail,
  Target,
  Award,
  Activity
} from 'lucide-react';

interface InvestorData {
  id: string;
    name: string;
    checkSize: string;
    portfolio: number;
    stage: string;
    status: string;
  email?: string;
  description?: string;
  sectors: string[];
  recent_investments: number;
  success_rate: number;
  portfolio_value: number;
  created_at: string;
}

interface InvestorStats {
  totalInvestors: number;
  active: number;
  totalPortfolio: number;
  avgPortfolio: number;
}

const InvestorManagement: React.FC = () => {
  const [investorStats, setInvestorStats] = useState<InvestorStats>({
    totalInvestors: 0,
    active: 0,
    totalPortfolio: 0,
    avgPortfolio: 0
  });
  const [investors, setInvestors] = useState<InvestorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sectorFilter, setSectorFilter] = useState('all');
  const [selectedInvestor, setSelectedInvestor] = useState<InvestorData | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    email: '',
    check_size: '',
    investment_stage: '',
    sectors: [] as string[],
    portfolio_count: 0,
    portfolio_value: 0,
    recent_investments: 0,
    success_rate: 0,
    status: 'active'
  });
  const [sectorInput, setSectorInput] = useState('');

  const { toast } = useToast();
  const { state, triggerGlobalRefresh } = useAppState();

  // Fetch data
  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('=== Fetching Investor Data ===');
      
      console.log('Calling getInvestorStats...');
      const statsResponse = await adminApiService.getInvestorStats();
      console.log('Stats response:', statsResponse);
      
      console.log('Calling getInvestorDirectory...');
      const directoryResponse = await adminApiService.getInvestorDirectory();
      console.log('Directory response:', directoryResponse);

      if (statsResponse.success) {
        setInvestorStats(statsResponse.data);
        console.log('Loaded investor stats:', statsResponse.data);
      } else {
        console.error('Failed to load investor stats:', statsResponse.error);
      }

      if (directoryResponse.success) {
        setInvestors(directoryResponse.data);
        console.log(`Loaded ${directoryResponse.data.length} investors`);
      } else {
        console.error('Failed to load investor directory:', directoryResponse.error);
      }
    } catch (error) {
      console.error('Error fetching investor data:', error);
      toast({
        title: "Error",
        description: "Failed to load investor data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [state.refreshTrigger]);

  // Handle manual refresh
  const handleManualRefresh = () => {
    triggerGlobalRefresh();
  };

  // Filter investors
  const filteredInvestors = investors.filter(investor => {
    const matchesSearch = investor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         investor.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         investor.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || investor.status?.toLowerCase() === statusFilter.toLowerCase();
    const matchesSector = sectorFilter === "all" || investor.sectors?.includes(sectorFilter);
    
    return matchesSearch && matchesStatus && matchesSector;
  });

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await adminApiService.addInvestor(formData);
      
      if (response.success) {
        toast({
          title: "Success",
          description: "Investor added successfully!",
        });
        setIsAddDialogOpen(false);
        resetForm();
        triggerGlobalRefresh();
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('Error adding investor:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add investor. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle investor update
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedInvestor) return;
    
    try {
      const response = await adminApiService.updateInvestor({
        id: selectedInvestor.id,
        ...formData
      });
      
      if (response.success) {
        toast({
          title: "Success",
          description: "Investor updated successfully!",
        });
        setIsEditDialogOpen(false);
        resetForm();
        triggerGlobalRefresh();
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('Error updating investor:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update investor. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle investor deletion
  const handleDelete = async () => {
    if (!selectedInvestor) return;
    
    try {
      const response = await adminApiService.deleteInvestor(selectedInvestor.id);
      
      if (response.success) {
        toast({
          title: "Success",
          description: "Investor deleted successfully!",
        });
        setIsDeleteDialogOpen(false);
        triggerGlobalRefresh();
    } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('Error deleting investor:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete investor. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      email: '',
      check_size: '',
      investment_stage: '',
      sectors: [],
      portfolio_count: 0,
      portfolio_value: 0,
      recent_investments: 0,
      success_rate: 0,
      status: 'active'
    });
    setSectorInput('');
  };

  // Add sector
  const addSector = () => {
    if (sectorInput.trim() && !formData.sectors.includes(sectorInput.trim())) {
      setFormData(prev => ({
        ...prev,
        sectors: [...prev.sectors, sectorInput.trim()]
      }));
      setSectorInput('');
    }
  };

  // Remove sector
  const removeSector = (sector: string) => {
    setFormData(prev => ({
      ...prev,
      sectors: prev.sectors.filter(s => s !== sector)
    }));
  };

  // Get all unique sectors
  const allSectors = Array.from(new Set(investors.flatMap(investor => investor.sectors || [])));

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Investor Management</h2>
          <Button disabled>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Loading...</CardTitle>
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold bg-gray-200 h-8 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Investor Management</h2>
        <Button onClick={handleManualRefresh}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Investors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{investorStats.totalInvestors.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{investorStats.active.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Portfolio</CardTitle>
            <Briefcase className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">₹{investorStats.totalPortfolio.toLocaleString()}Cr</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Portfolio</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-purple-600">₹{investorStats.avgPortfolio.toLocaleString()}Cr</p>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search investors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
                />
              </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sectorFilter} onValueChange={setSectorFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by sector" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sectors</SelectItem>
              {allSectors.map(sector => (
                <SelectItem key={sector} value={sector}>{sector}</SelectItem>
              ))}
              </SelectContent>
            </Select>
          </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Investor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Investor</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="check_size">Check Size</Label>
                  <Input
                    id="check_size"
                    value={formData.check_size}
                    onChange={(e) => setFormData(prev => ({ ...prev, check_size: e.target.value }))}
                    placeholder="e.g., ₹1-10Cr"
                  />
              </div>
                <div className="space-y-2">
                  <Label htmlFor="investment_stage">Investment Stage</Label>
                  <Input
                    id="investment_stage"
                    value={formData.investment_stage}
                    onChange={(e) => setFormData(prev => ({ ...prev, investment_stage: e.target.value }))}
                    placeholder="e.g., Seed-Series A"
                  />
                        </div>
                <div className="space-y-2">
                  <Label htmlFor="portfolio_count">Portfolio Count</Label>
                  <Input
                    id="portfolio_count"
                    type="number"
                    value={formData.portfolio_count}
                    onChange={(e) => setFormData(prev => ({ ...prev, portfolio_count: parseInt(e.target.value) || 0 }))}
                  />
                          </div>
                <div className="space-y-2">
                  <Label htmlFor="portfolio_value">Portfolio Value (Cr)</Label>
                  <Input
                    id="portfolio_value"
                    type="number"
                    step="0.01"
                    value={formData.portfolio_value}
                    onChange={(e) => setFormData(prev => ({ ...prev, portfolio_value: parseFloat(e.target.value) || 0 }))}
                  />
                          </div>
                <div className="space-y-2">
                  <Label htmlFor="recent_investments">Recent Investments</Label>
                  <Input
                    id="recent_investments"
                    type="number"
                    value={formData.recent_investments}
                    onChange={(e) => setFormData(prev => ({ ...prev, recent_investments: parseInt(e.target.value) || 0 }))}
                  />
                          </div>
                <div className="space-y-2">
                  <Label htmlFor="success_rate">Success Rate (%)</Label>
                  <Input
                    id="success_rate"
                    type="number"
                    step="0.1"
                    value={formData.success_rate}
                    onChange={(e) => setFormData(prev => ({ ...prev, success_rate: parseFloat(e.target.value) || 0 }))}
                  />
                          </div>
                        </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Sectors</Label>
                <div className="flex gap-2">
                  <Input
                    value={sectorInput}
                    onChange={(e) => setSectorInput(e.target.value)}
                    placeholder="Add sector"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSector())}
                  />
                  <Button type="button" onClick={addSector} variant="outline">Add</Button>
                      </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.sectors.map(sector => (
                    <Badge key={sector} variant="secondary" className="cursor-pointer" onClick={() => removeSector(sector)}>
                      {sector} ×
                    </Badge>
                  ))}
                      </div>
                    </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Investor</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Investor Directory */}
      <Card>
        <CardHeader>
          <CardTitle>Investor Directory</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredInvestors.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No investors found
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredInvestors.map((investor) => (
                <Card key={investor.id} className="relative">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{investor.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{investor.email}</p>
                      </div>
                      <Badge variant={investor.status === 'active' ? 'default' : 'secondary'}>
                        {investor.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Target className="h-4 w-4" />
                      <span>{investor.checkSize}</span>
                          </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase className="h-4 w-4" />
                      <span>{investor.portfolio} companies</span>
                        </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Award className="h-4 w-4" />
                      <span>{investor.success_rate}% success rate</span>
                        </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="h-4 w-4" />
                      <span>{investor.stage}</span>
                        </div>
                    
                    {investor.sectors && investor.sectors.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {investor.sectors.slice(0, 3).map(sector => (
                          <Badge key={sector} variant="outline" className="text-xs">
                            {sector}
                          </Badge>
                        ))}
                        {investor.sectors.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{investor.sectors.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedInvestor(investor);
                          setIsViewDialogOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedInvestor(investor);
                          setFormData({
                            name: investor.name,
                            description: investor.description || '',
                            email: investor.email || '',
                            check_size: investor.checkSize,
                            investment_stage: investor.stage,
                            sectors: investor.sectors || [],
                            portfolio_count: investor.portfolio,
                            portfolio_value: investor.portfolio_value,
                            recent_investments: investor.recent_investments,
                            success_rate: investor.success_rate,
                            status: investor.status
                          });
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedInvestor(investor)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Investor</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{selectedInvestor?.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            )}
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Investor Details</DialogTitle>
          </DialogHeader>
          {selectedInvestor && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">Name</Label>
                  <p>{selectedInvestor.name}</p>
                </div>
                <div>
                  <Label className="font-semibold">Email</Label>
                  <p>{selectedInvestor.email || 'N/A'}</p>
                </div>
                <div>
                  <Label className="font-semibold">Check Size</Label>
                  <p>{selectedInvestor.checkSize}</p>
                </div>
                <div>
                  <Label className="font-semibold">Investment Stage</Label>
                  <p>{selectedInvestor.stage}</p>
                </div>
                <div>
                  <Label className="font-semibold">Portfolio Count</Label>
                  <p>{selectedInvestor.portfolio}</p>
              </div>
                <div>
                  <Label className="font-semibold">Portfolio Value</Label>
                  <p>₹{selectedInvestor.portfolio_value}Cr</p>
                </div>
                <div>
                  <Label className="font-semibold">Recent Investments</Label>
                  <p>{selectedInvestor.recent_investments}</p>
              </div>
                <div>
                  <Label className="font-semibold">Success Rate</Label>
                  <p>{selectedInvestor.success_rate}%</p>
                </div>
                <div>
                  <Label className="font-semibold">Status</Label>
                  <Badge variant={selectedInvestor.status === 'active' ? 'default' : 'secondary'}>
                    {selectedInvestor.status}
                  </Badge>
              </div>
            </div>
              
              {selectedInvestor.description && (
                <div>
                  <Label className="font-semibold">Description</Label>
                  <p className="text-sm text-muted-foreground">{selectedInvestor.description}</p>
                  </div>
              )}
              
              {selectedInvestor.sectors && selectedInvestor.sectors.length > 0 && (
                <div>
                  <Label className="font-semibold">Sectors</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedInvestor.sectors.map(sector => (
                      <Badge key={sector} variant="outline">
                        {sector}
                      </Badge>
                    ))}
                </div>
              </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Investor</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-check_size">Check Size</Label>
                <Input
                  id="edit-check_size"
                  value={formData.check_size}
                  onChange={(e) => setFormData(prev => ({ ...prev, check_size: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-investment_stage">Investment Stage</Label>
                <Input
                  id="edit-investment_stage"
                  value={formData.investment_stage}
                  onChange={(e) => setFormData(prev => ({ ...prev, investment_stage: e.target.value }))}
                />
                  </div>
              <div className="space-y-2">
                <Label htmlFor="edit-portfolio_count">Portfolio Count</Label>
                <Input
                  id="edit-portfolio_count"
                  type="number"
                  value={formData.portfolio_count}
                  onChange={(e) => setFormData(prev => ({ ...prev, portfolio_count: parseInt(e.target.value) || 0 }))}
                />
                </div>
              <div className="space-y-2">
                <Label htmlFor="edit-portfolio_value">Portfolio Value (Cr)</Label>
                <Input
                  id="edit-portfolio_value"
                  type="number"
                  step="0.01"
                  value={formData.portfolio_value}
                  onChange={(e) => setFormData(prev => ({ ...prev, portfolio_value: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-recent_investments">Recent Investments</Label>
                <Input
                  id="edit-recent_investments"
                  type="number"
                  value={formData.recent_investments}
                  onChange={(e) => setFormData(prev => ({ ...prev, recent_investments: parseInt(e.target.value) || 0 }))}
                />
                  </div>
              <div className="space-y-2">
                <Label htmlFor="edit-success_rate">Success Rate (%)</Label>
                <Input
                  id="edit-success_rate"
                  type="number"
                  step="0.1"
                  value={formData.success_rate}
                  onChange={(e) => setFormData(prev => ({ ...prev, success_rate: parseFloat(e.target.value) || 0 }))}
                />
                </div>
              </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
                  </div>

            <div className="space-y-2">
              <Label>Sectors</Label>
              <div className="flex gap-2">
                <Input
                  value={sectorInput}
                  onChange={(e) => setSectorInput(e.target.value)}
                  placeholder="Add sector"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSector())}
                />
                <Button type="button" onClick={addSector} variant="outline">Add</Button>
                </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.sectors.map(sector => (
                  <Badge key={sector} variant="secondary" className="cursor-pointer" onClick={() => removeSector(sector)}>
                    {sector} ×
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Investor</Button>
      </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvestorManagement;