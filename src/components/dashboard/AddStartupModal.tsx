import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { investorDashboardService } from '@/services/investorDashboardService';
import { useAuth } from '@/context/AuthContext';

interface AddStartupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface AvailableStartup {
  id: string;
  name: string;
  industry: string;
  founded_year: number;
  website: string;
  description: string;
  team_size: number;
  stage: string;
  seeking?: string;
}

export default function AddStartupModal({ isOpen, onClose, onSuccess }: AddStartupModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [availableStartups, setAvailableStartups] = useState<AvailableStartup[]>([]);
  const [manualEntry, setManualEntry] = useState({
    startupName: '',
    sector: '',
    investmentAmount: '',
    ownership: '',
    investmentDate: ''
  });

  useEffect(() => {
    if (isOpen) {
      loadAvailableStartups();
    }
  }, [isOpen]);

  const loadAvailableStartups = async () => {
    try {
      const startups = await investorDashboardService.getAvailableStartups();
      setAvailableStartups(startups);
    } catch (error) {
      console.error('Error loading startups:', error);
      toast.error('Failed to load available startups');
    }
  };

  const handleAddToPortfolio = async (startup: AvailableStartup) => {
    if (!user?.id) {
      toast.error('Please log in to add startups to portfolio');
      return;
    }

    setLoading(true);
    try {
      const portfolioCompany = {
        investor_id: user.id,
        startup_id: startup.id,
        startup_name: startup.name,
        sector: startup.industry,
        investment_amount: 0, // To be updated later
        current_valuation: 0,
        investment_date: new Date().toISOString(),
        stage: startup.stage || 'Unknown',
        status: 'under_review' as const,
        growth_percentage: 0,
        ownership_percentage: 0
      };

      const success = await investorDashboardService.addPortfolioCompany(portfolioCompany);
      
      if (success) {
        toast.success(`${startup.name} added to portfolio successfully!`);
        onSuccess?.();
        onClose();
      } else {
        toast.error('Failed to add startup to portfolio');
      }
    } catch (error) {
      console.error('Error adding startup to portfolio:', error);
      toast.error('Failed to add startup to portfolio');
    } finally {
      setLoading(false);
    }
  };

  const handleManualEntry = async () => {
    if (!user?.id) {
      toast.error('Please log in to add startups to portfolio');
      return;
    }

    if (!manualEntry.startupName || !manualEntry.sector || !manualEntry.investmentAmount) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const investmentAmount = parseFloat(manualEntry.investmentAmount.replace(/[^\d.]/g, '')) || 0;
      const ownershipPercentage = parseFloat(manualEntry.ownership) || 0;
      
      const portfolioCompany = {
        investor_id: user.id,
        startup_id: `manual-${Date.now()}`,
        startup_name: manualEntry.startupName,
        sector: manualEntry.sector,
        investment_amount: investmentAmount * 10000000, // Convert Cr to actual number
        current_valuation: investmentAmount * 10000000, // Initial valuation same as investment
        investment_date: manualEntry.investmentDate || new Date().toISOString(),
        stage: 'Unknown',
        status: 'active' as const,
        growth_percentage: 0,
        ownership_percentage: ownershipPercentage
      };

      const success = await investorDashboardService.addPortfolioCompany(portfolioCompany);
      
      if (success) {
        toast.success(`${manualEntry.startupName} added to portfolio successfully!`);
        setManualEntry({
          startupName: '',
          sector: '',
          investmentAmount: '',
          ownership: '',
          investmentDate: ''
        });
        onSuccess?.();
        onClose();
      } else {
        toast.error('Failed to add startup to portfolio');
      }
    } catch (error) {
      console.error('Error adding manual entry:', error);
      toast.error('Failed to add startup to portfolio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-gray-900 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add Startup to Portfolio</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Available Startups Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-300">Available Startups</h3>
            <div className="space-y-3">
              {availableStartups.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <p>No available startups found</p>
                </div>
              ) : (
                availableStartups.map((startup) => (
                  <Card key={startup.id} className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <h4 className="font-medium text-white">{startup.name}</h4>
                          <div className="flex gap-2">
                            <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                              {startup.industry}
                            </Badge>
                            <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                              {startup.stage || 'Unknown Stage'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-400">{startup.description}</p>
                          <p className="text-xs text-gray-500">Founded: {startup.founded_year} • Team Size: {startup.team_size}</p>
                        </div>
                        <Button
                          onClick={() => handleAddToPortfolio(startup)}
                          disabled={loading}
                          className="bg-orange-600 hover:bg-orange-700"
                        >
                          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Add to Portfolio'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Manual Entry Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-300">Manual Entry</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="startup-name" className="text-gray-300">Startup Name *</Label>
                <Input
                  id="startup-name"
                  placeholder="Enter startup name"
                  value={manualEntry.startupName}
                  onChange={(e) => setManualEntry({...manualEntry, startupName: e.target.value})}
                  className="bg-gray-800 border-gray-700 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sector" className="text-gray-300">Sector *</Label>
                <Input
                  id="sector"
                  placeholder="e.g., FinTech, HealthTech, EdTech"
                  value={manualEntry.sector}
                  onChange={(e) => setManualEntry({...manualEntry, sector: e.target.value})}
                  className="bg-gray-800 border-gray-700 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="investment-amount" className="text-gray-300">Investment Amount (₹ Cr) *</Label>
                <Input
                  id="investment-amount"
                  placeholder="e.g., 2.5"
                  value={manualEntry.investmentAmount}
                  onChange={(e) => setManualEntry({...manualEntry, investmentAmount: e.target.value})}
                  className="bg-gray-800 border-gray-700 text-white"
                  type="number"
                  step="0.1"
                  min="0"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ownership" className="text-gray-300">Ownership %</Label>
                <Input
                  id="ownership"
                  placeholder="e.g., 15"
                  value={manualEntry.ownership}
                  onChange={(e) => setManualEntry({...manualEntry, ownership: e.target.value})}
                  className="bg-gray-800 border-gray-700 text-white"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="investment-date" className="text-gray-300">Investment Date</Label>
                <div className="relative">
                  <Input
                    id="investment-date"
                    type="date"
                    value={manualEntry.investmentDate}
                    onChange={(e) => setManualEntry({...manualEntry, investmentDate: e.target.value})}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <Button
                onClick={handleManualEntry}
                disabled={loading || !manualEntry.startupName || !manualEntry.sector || !manualEntry.investmentAmount}
                className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Adding...
                  </>
                ) : (
                  'Add Manual Entry'
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
