import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import adminApiService from '@/services/adminApiService';

interface AddDealDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDealAdded: () => void;
}

const AddDealDialog = ({ open, onOpenChange, onDealAdded }: AddDealDialogProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    deal_name: '',
    startup_name: '',
    investor_name: '',
    deal_value: '',
    deal_stage: '',
    sector: '',
    description: '',
    status: 'active'
  });

  const dealStages = [
    'Pre-Seed',
    'Seed',
    'Series A',
    'Series B',
    'Series C',
    'Series D+',
    'Bridge',
    'Growth',
    'Late Stage'
  ];

  const sectors = [
    'FinTech',
    'HealthTech',
    'EdTech',
    'E-commerce',
    'SaaS',
    'AI/ML',
    'CleanTech',
    'Food & Beverage',
    'Real Estate',
    'Logistics',
    'Cybersecurity',
    'Entertainment',
    'Agriculture',
    'Manufacturing',
    'Other'
  ];

  const statuses = [
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.deal_name.trim() || !formData.startup_name.trim() || 
        !formData.investor_name.trim() || !formData.deal_value.trim() ||
        !formData.deal_stage || !formData.sector) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const dealValue = parseFloat(formData.deal_value);
    if (isNaN(dealValue) || dealValue <= 0) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid deal value",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      console.log('Adding deal:', formData);

      const response = await adminApiService.addDeal({
        deal_name: formData.deal_name.trim(),
        startup_name: formData.startup_name.trim(),
        investor_name: formData.investor_name.trim(),
        deal_value: dealValue,
        deal_stage: formData.deal_stage,
        sector: formData.sector,
        description: formData.description.trim() || undefined,
        status: formData.status
      });

      if (response.success) {
        console.log('Deal added successfully:', response.data);
        
        // Reset form
        setFormData({
          deal_name: '',
          startup_name: '',
          investor_name: '',
          deal_value: '',
          deal_stage: '',
          sector: '',
          description: '',
          status: 'active'
        });
        
        onDealAdded();
        toast({
          title: "Success",
          description: "Deal added successfully",
        });
      } else {
        throw new Error(response.error || 'Failed to add deal');
      }
    } catch (error) {
      console.error('Error adding deal:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add deal",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      deal_name: '',
      startup_name: '',
      investor_name: '',
      deal_value: '',
      deal_stage: '',
      sector: '',
      description: '',
      status: 'active'
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Deal</DialogTitle>
          <DialogDescription>
            Add a new deal to the system. Fill in all the required information.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="deal_name">Deal Name *</Label>
              <Input
                id="deal_name"
                value={formData.deal_name}
                onChange={(e) => handleInputChange('deal_name', e.target.value)}
                placeholder="e.g., Series A Funding"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deal_value">Deal Value (₹) *</Label>
              <Input
                id="deal_value"
                type="number"
                value={formData.deal_value}
                onChange={(e) => handleInputChange('deal_value', e.target.value)}
                placeholder="e.g., 5000000"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startup_name">Startup Name *</Label>
              <Input
                id="startup_name"
                value={formData.startup_name}
                onChange={(e) => handleInputChange('startup_name', e.target.value)}
                placeholder="e.g., TechStart Inc"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="investor_name">Investor Name *</Label>
              <Input
                id="investor_name"
                value={formData.investor_name}
                onChange={(e) => handleInputChange('investor_name', e.target.value)}
                placeholder="e.g., Sequoia Capital"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="deal_stage">Deal Stage *</Label>
              <Select value={formData.deal_stage} onValueChange={(value) => handleInputChange('deal_stage', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  {dealStages.map((stage) => (
                    <SelectItem key={stage} value={stage}>
                      {stage}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sector">Sector *</Label>
              <Select value={formData.sector} onValueChange={(value) => handleInputChange('sector', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sector" />
                </SelectTrigger>
                <SelectContent>
                  {sectors.map((sector) => (
                    <SelectItem key={sector} value={sector}>
                      {sector}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Brief description of the deal..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Deal
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDealDialog;
