import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Trash2 } from 'lucide-react';
import adminApiService, { type DealData } from '@/services/adminApiService';

interface DeleteDealDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deal: DealData;
  onDealDeleted: () => void;
}

const DeleteDealDialog = ({ open, onOpenChange, deal, onDealDeleted }: DeleteDealDialogProps) => {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const formatCurrency = (value: number) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(1)}Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    } else {
      return `₹${value.toLocaleString()}`;
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      console.log('Deleting deal:', deal.id);

      const response = await adminApiService.deleteDeal(deal.id);

      if (response.success) {
        console.log('Deal deleted successfully');
        onDealDeleted();
        toast({
          title: "Success",
          description: "Deal deleted successfully",
        });
      } else {
        throw new Error(response.error || 'Failed to delete deal');
      }
    } catch (error) {
      console.error('Error deleting deal:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete deal",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-destructive" />
            Delete Deal
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Are you sure you want to delete this deal? This action cannot be undone.
            </p>
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <div className="space-y-2">
                <p className="font-medium">{deal.deal_name}</p>
                <p className="text-sm text-muted-foreground">
                  {deal.startup_name} • {deal.investor_name}
                </p>
                <p className="text-sm text-muted-foreground">
                  Value: {formatCurrency(deal.deal_value)} • Stage: {deal.deal_stage}
                </p>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete Deal
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteDealDialog;
