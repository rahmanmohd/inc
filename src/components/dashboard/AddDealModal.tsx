import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { investorDashboardService } from '@/services/investorDashboardService';

interface AddDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddDealModal({ isOpen, onClose, onSuccess }: AddDealModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [dealData, setDealData] = useState({
    companyName: '',
    sector: '',
    stage: '',
    requestedAmount: '',
    foundedYear: '',
    teamSize: '',
    revenue: '',
    description: '',
    contactPerson: '',
    email: '',
    phone: ''
  });

  const handleSubmit = async () => {
    if (!user?.id) {
      toast.error('Please log in to add deals');
      return;
    }

    // Validate required fields
    if (!dealData.companyName || !dealData.sector || !dealData.stage || !dealData.requestedAmount) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      // Parse requested amount (remove currency symbols and convert to number)
      const requestedAmount = parseFloat(dealData.requestedAmount.replace(/[^\d.]/g, '')) || 0;
      
      const dealToAdd = {
        investor_id: user.id,
        company_name: dealData.companyName,
        sector: dealData.sector,
        requested_amount: requestedAmount * 10000000, // Convert Cr to actual number
        stage: 'initial_review' as const,
        progress: 0,
        founded_year: parseInt(dealData.foundedYear) || new Date().getFullYear(),
        team_size: parseInt(dealData.teamSize) || 1,
        revenue: dealData.revenue || 'Not specified',
        description: dealData.description || '',
        pitch_deck_url: '',
        financials_url: '',
        status: 'active' as const
      };

      const success = await investorDashboardService.addDealToPipeline(dealToAdd);
      
      if (success) {
        toast.success(`${dealData.companyName} added to deal pipeline successfully!`);
        
        // Reset form
        setDealData({
          companyName: '',
          sector: '',
          stage: '',
          requestedAmount: '',
          foundedYear: '',
          teamSize: '',
          revenue: '',
          description: '',
          contactPerson: '',
          email: '',
          phone: ''
        });
        
        onSuccess?.();
        onClose();
      } else {
        toast.error('Failed to add deal to pipeline');
      }
    } catch (error) {
      console.error('Error adding deal:', error);
      toast.error('Failed to add deal to pipeline');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-gray-900 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Add New Deal</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Company Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-300">Company Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company-name" className="text-gray-300">Company Name *</Label>
                <Input
                  id="company-name"
                  placeholder="Enter company name"
                  value={dealData.companyName}
                  onChange={(e) => setDealData({...dealData, companyName: e.target.value})}
                  className="bg-gray-800 border-gray-700 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sector" className="text-gray-300">Sector *</Label>
                <Select value={dealData.sector} onValueChange={(value) => setDealData({...dealData, sector: value})}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select sector" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="fintech">FinTech</SelectItem>
                    <SelectItem value="healthtech">HealthTech</SelectItem>
                    <SelectItem value="edtech">EdTech</SelectItem>
                    <SelectItem value="ai-ml">AI/ML</SelectItem>
                    <SelectItem value="cleantech">CleanTech</SelectItem>
                    <SelectItem value="logistics">Logistics</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stage" className="text-gray-300">Investment Stage *</Label>
                <Select value={dealData.stage} onValueChange={(value) => setDealData({...dealData, stage: value})}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="pre-seed">Pre-Seed</SelectItem>
                    <SelectItem value="seed">Seed</SelectItem>
                    <SelectItem value="series-a">Series A</SelectItem>
                    <SelectItem value="series-b">Series B</SelectItem>
                    <SelectItem value="series-c">Series C</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="requested-amount" className="text-gray-300">Requested Amount (₹ Cr) *</Label>
                <Input
                  id="requested-amount"
                  placeholder="e.g., 5"
                  value={dealData.requestedAmount}
                  onChange={(e) => setDealData({...dealData, requestedAmount: e.target.value})}
                  className="bg-gray-800 border-gray-700 text-white"
                  type="number"
                  step="0.1"
                  min="0"
                  required
                />
              </div>
            </div>
          </div>

          {/* Company Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-300">Company Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="founded-year" className="text-gray-300">Founded Year</Label>
                <Input
                  id="founded-year"
                  placeholder="e.g., 2022"
                  value={dealData.foundedYear}
                  onChange={(e) => setDealData({...dealData, foundedYear: e.target.value})}
                  className="bg-gray-800 border-gray-700 text-white"
                  type="number"
                  min="2000"
                  max={new Date().getFullYear()}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="team-size" className="text-gray-300">Team Size</Label>
                <Input
                  id="team-size"
                  placeholder="e.g., 15"
                  value={dealData.teamSize}
                  onChange={(e) => setDealData({...dealData, teamSize: e.target.value})}
                  className="bg-gray-800 border-gray-700 text-white"
                  type="number"
                  min="1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="revenue" className="text-gray-300">Revenue/ARR</Label>
                <Input
                  id="revenue"
                  placeholder="e.g., ₹50L ARR"
                  value={dealData.revenue}
                  onChange={(e) => setDealData({...dealData, revenue: e.target.value})}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-300">Company Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the company and its business model..."
              value={dealData.description}
              onChange={(e) => setDealData({...dealData, description: e.target.value})}
              className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
            />
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-300">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact-person" className="text-gray-300">Contact Person</Label>
                <Input
                  id="contact-person"
                  placeholder="Enter contact person name"
                  value={dealData.contactPerson}
                  onChange={(e) => setDealData({...dealData, contactPerson: e.target.value})}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contact@company.com"
                  value={dealData.email}
                  onChange={(e) => setDealData({...dealData, email: e.target.value})}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-300">Phone</Label>
                <Input
                  id="phone"
                  placeholder="+91 98765 43210"
                  value={dealData.phone}
                  onChange={(e) => setDealData({...dealData, phone: e.target.value})}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading || !dealData.companyName || !dealData.sector || !dealData.stage || !dealData.requestedAmount}
              className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Adding Deal...
                </>
              ) : (
                'Add Deal'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
