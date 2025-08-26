import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { 
  Plus, 
  Search, 
  Eye, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  Building,
  Users,
  Target,
  Edit,
  Trash2,
  Loader2,
  ExternalLink
} from 'lucide-react'
import { toast } from 'sonner'
import AddStartupModal from './AddStartupModal'
import { PortfolioCompany } from '@/services/investorDashboardService'

interface PortfolioManagementProps {
  portfolioCompanies: PortfolioCompany[];
  loading: boolean;
  onRefresh: () => void;
  onUpdateCompany: (id: string, updates: Partial<PortfolioCompany>) => Promise<boolean>;
  onRemoveCompany: (id: string) => Promise<boolean>;
}

export default function PortfolioManagement({ 
  portfolioCompanies, 
  loading, 
  onRefresh, 
  onUpdateCompany, 
  onRemoveCompany 
}: PortfolioManagementProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sectorFilter, setSectorFilter] = useState<string>('all')
  const [isAddStartupModalOpen, setIsAddStartupModalOpen] = useState(false)
  const [editingCompany, setEditingCompany] = useState<PortfolioCompany | null>(null)
  const [viewingCompany, setViewingCompany] = useState<PortfolioCompany | null>(null)
  const [deletingCompany, setDeletingCompany] = useState<PortfolioCompany | null>(null)
  const [editForm, setEditForm] = useState<Partial<PortfolioCompany>>({})
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Format helper functions
  const formatCurrency = (amount: number) => {
    return `₹${(amount / 10000000).toFixed(1)} Cr`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      month: 'short',
      year: 'numeric'
    });
  };

  const calculateGrowth = (investment: number, current: number) => {
    const growth = ((current - investment) / investment) * 100;
    return `${growth >= 0 ? '+' : ''}${growth.toFixed(1)}%`;
  };

  const calculateROI = (investment: number, current: number) => {
    const roi = ((current - investment) / investment) * 100;
    return `${roi.toFixed(1)}%`;
  };

  const filteredCompanies = portfolioCompanies.filter(company => {
    const matchesSearch = company.startup_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.sector.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || company.status === statusFilter
    const matchesSector = sectorFilter === 'all' || company.sector === sectorFilter
    
    return matchesSearch && matchesStatus && matchesSector
  })

  // Event handlers
  const handleEditClick = (company: PortfolioCompany) => {
    setEditingCompany(company);
    setEditForm({
      startup_name: company.startup_name,
      sector: company.sector,
      investment_amount: company.investment_amount,
      current_valuation: company.current_valuation,
      investment_date: company.investment_date,
      stage: company.stage,
      status: company.status,
      ownership_percentage: company.ownership_percentage
    });
  };

  const handleUpdateCompany = async () => {
    if (!editingCompany || !editForm) return;

    setUpdating(true);
    try {
      await onUpdateCompany(editingCompany.id, editForm);
      toast.success('Portfolio company updated successfully!');
      setEditingCompany(null);
      setEditForm({});
    } catch (error) {
      console.error('Error updating company:', error);
      toast.error('Failed to update portfolio company');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteCompany = async () => {
    if (!deletingCompany) return;

    setDeleting(true);
    try {
      await onRemoveCompany(deletingCompany.id);
      toast.success('Portfolio company removed successfully!');
      setDeletingCompany(null);
    } catch (error) {
      console.error('Error deleting company:', error);
      toast.error('Failed to remove portfolio company');
    } finally {
      setDeleting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-orange-600">Active</Badge>
      case 'exited':
        return <Badge variant="outline" className="border-gray-600 text-gray-300">Exited</Badge>
      case 'under_review':
        return <Badge className="bg-yellow-600">Under Review</Badge>
      case 'dormant':
        return <Badge className="bg-gray-600">Dormant</Badge>
      default:
        return <Badge variant="outline" className="border-gray-600 text-gray-300">{status}</Badge>
    }
  }

  const getGrowthBadge = (investment: number, current: number) => {
    const growth = ((current - investment) / investment) * 100;
    const isPositive = growth >= 0;
    const growthText = `${isPositive ? '+' : ''}${growth.toFixed(1)}%`;
    
    return (
      <Badge variant={isPositive ? "default" : "destructive"} className={isPositive ? "bg-green-600" : "bg-red-600"}>
        {growthText}
      </Badge>
    )
  }

  const totalInvested = portfolioCompanies.reduce((sum, company) => sum + (company.investment_amount || 0), 0)
  const totalCurrentValue = portfolioCompanies.reduce((sum, company) => sum + (company.current_valuation || 0), 0)
  const overallROI = totalInvested > 0 ? ((totalCurrentValue - totalInvested) / totalInvested * 100).toFixed(1) : '0'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Portfolio Management</h2>
          <p className="text-gray-400">
            Track and manage your investment portfolio companies
          </p>
        </div>
        <Button 
          className="bg-orange-600 hover:bg-orange-700"
          onClick={() => setIsAddStartupModalOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Startup to Portfolio
        </Button>
      </div>

      {/* Portfolio Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Portfolio Companies</CardTitle>
            <Building className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{portfolioCompanies.length}</div>
            <p className="text-xs text-gray-400">Total companies</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Invested</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{formatCurrency(totalInvested)}</div>
            <p className="text-xs text-gray-400">Across all companies</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Portfolio Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{formatCurrency(totalCurrentValue)}</div>
            <p className="text-xs text-gray-400">Current valuation</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Avg ROI</CardTitle>
            <Calendar className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-500">+{overallROI}%</div>
            <p className="text-xs text-gray-400">Total return</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48 bg-gray-800 border-gray-700 text-white">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="exited">Exited</SelectItem>
            <SelectItem value="under_review">Under Review</SelectItem>
            <SelectItem value="dormant">Dormant</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sectorFilter} onValueChange={setSectorFilter}>
          <SelectTrigger className="w-48 bg-gray-800 border-gray-700 text-white">
            <SelectValue placeholder="Filter by sector" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="all">All Sectors</SelectItem>
            <SelectItem value="FinTech">FinTech</SelectItem>
            <SelectItem value="HealthTech">HealthTech</SelectItem>
            <SelectItem value="EdTech">EdTech</SelectItem>
            <SelectItem value="CleanTech">CleanTech</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Portfolio Companies Table */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Portfolio Companies</CardTitle>
          <p className="text-sm text-gray-400">
            {filteredCompanies.length} companies found
          </p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">Startup</TableHead>
                <TableHead className="text-gray-300">Sector</TableHead>
                <TableHead className="text-gray-300">Investment</TableHead>
                <TableHead className="text-gray-300">Current Value</TableHead>
                <TableHead className="text-gray-300">Ownership</TableHead>
                <TableHead className="text-gray-300">Growth</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                    <p className="text-gray-400">Loading portfolio companies...</p>
                  </TableCell>
                </TableRow>
              ) : filteredCompanies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <Building className="h-12 w-12 mx-auto mb-4 text-gray-600" />
                    <p className="text-gray-400 mb-2">No portfolio companies found</p>
                    <Button 
                      onClick={() => setIsAddStartupModalOpen(true)}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Startup
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCompanies.map((company) => (
                  <TableRow key={company.id} className="border-gray-700">
                    <TableCell className="font-medium text-white">{company.startup_name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                        {company.sector}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-white">{formatCurrency(company.investment_amount)}</TableCell>
                    <TableCell className="text-white">{formatCurrency(company.current_valuation)}</TableCell>
                    <TableCell className="text-white">{company.ownership_percentage}%</TableCell>
                    <TableCell>{getGrowthBadge(company.investment_amount, company.current_valuation)}</TableCell>
                    <TableCell>{getStatusBadge(company.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-gray-600 text-gray-300 hover:bg-gray-800"
                          onClick={() => setViewingCompany(company)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-gray-600 text-gray-300 hover:bg-gray-800"
                          onClick={() => handleEditClick(company)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-gray-600 text-red-400 hover:bg-red-900/20"
                          onClick={() => setDeletingCompany(company)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Startup Modal */}
      <AddStartupModal 
        isOpen={isAddStartupModalOpen}
        onClose={() => setIsAddStartupModalOpen(false)}
        onSuccess={onRefresh}
      />

      {/* View Company Modal */}
      <Dialog open={!!viewingCompany} onOpenChange={() => setViewingCompany(null)}>
        <DialogContent className="max-w-2xl bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{viewingCompany?.startup_name}</DialogTitle>
          </DialogHeader>
          {viewingCompany && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Sector</Label>
                  <p className="text-white">{viewingCompany.sector}</p>
                </div>
                <div>
                  <Label className="text-gray-300">Stage</Label>
                  <p className="text-white">{viewingCompany.stage}</p>
                </div>
                <div>
                  <Label className="text-gray-300">Investment Amount</Label>
                  <p className="text-white">{formatCurrency(viewingCompany.investment_amount)}</p>
                </div>
                <div>
                  <Label className="text-gray-300">Current Valuation</Label>
                  <p className="text-white">{formatCurrency(viewingCompany.current_valuation)}</p>
                </div>
                <div>
                  <Label className="text-gray-300">Ownership</Label>
                  <p className="text-white">{viewingCompany.ownership_percentage}%</p>
                </div>
                <div>
                  <Label className="text-gray-300">Investment Date</Label>
                  <p className="text-white">{formatDate(viewingCompany.investment_date)}</p>
                </div>
                <div>
                  <Label className="text-gray-300">Status</Label>
                  <div className="mt-1">{getStatusBadge(viewingCompany.status)}</div>
                </div>
                <div>
                  <Label className="text-gray-300">Growth</Label>
                  <div className="mt-1">{getGrowthBadge(viewingCompany.investment_amount, viewingCompany.current_valuation)}</div>
                </div>
              </div>
              {viewingCompany.startup?.website && (
                <div>
                  <Label className="text-gray-300">Website</Label>
                  <a 
                    href={viewingCompany.startup.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-orange-400 hover:text-orange-300"
                  >
                    {viewingCompany.startup.website}
                    <ExternalLink className="h-4 w-4 ml-1" />
                  </a>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Company Modal */}
      <Dialog open={!!editingCompany} onOpenChange={() => setEditingCompany(null)}>
        <DialogContent className="max-w-2xl bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Edit Portfolio Company</DialogTitle>
          </DialogHeader>
          {editingCompany && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name" className="text-gray-300">Startup Name</Label>
                  <Input
                    id="edit-name"
                    value={editForm.startup_name || ''}
                    onChange={(e) => setEditForm({...editForm, startup_name: e.target.value})}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-sector" className="text-gray-300">Sector</Label>
                  <Input
                    id="edit-sector"
                    value={editForm.sector || ''}
                    onChange={(e) => setEditForm({...editForm, sector: e.target.value})}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-investment" className="text-gray-300">Investment (₹ Cr)</Label>
                  <Input
                    id="edit-investment"
                    type="number"
                    step="0.1"
                    value={editForm.investment_amount ? (editForm.investment_amount / 10000000).toString() : ''}
                    onChange={(e) => setEditForm({...editForm, investment_amount: parseFloat(e.target.value) * 10000000 || 0})}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-valuation" className="text-gray-300">Current Valuation (₹ Cr)</Label>
                  <Input
                    id="edit-valuation"
                    type="number"
                    step="0.1"
                    value={editForm.current_valuation ? (editForm.current_valuation / 10000000).toString() : ''}
                    onChange={(e) => setEditForm({...editForm, current_valuation: parseFloat(e.target.value) * 10000000 || 0})}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-ownership" className="text-gray-300">Ownership %</Label>
                  <Input
                    id="edit-ownership"
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={editForm.ownership_percentage || ''}
                    onChange={(e) => setEditForm({...editForm, ownership_percentage: parseFloat(e.target.value) || 0})}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status" className="text-gray-300">Status</Label>
                  <Select value={editForm.status} onValueChange={(value) => setEditForm({...editForm, status: value as any})}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="exited">Exited</SelectItem>
                      <SelectItem value="under_review">Under Review</SelectItem>
                      <SelectItem value="dormant">Dormant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setEditingCompany(null)}
                  className="border-gray-600 text-gray-300"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateCompany}
                  disabled={updating}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  {updating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Updating...
                    </>
                  ) : (
                    'Update Company'
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingCompany} onOpenChange={() => setDeletingCompany(null)}>
        <AlertDialogContent className="bg-gray-900 border-gray-800 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to remove <span className="font-medium text-white">{deletingCompany?.startup_name}</span> from your portfolio? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-600 text-gray-300 hover:bg-gray-800">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCompany}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Deleting...
                </>
              ) : (
                'Delete Company'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}