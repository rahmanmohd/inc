import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import adminApiService from "@/services/adminApiService";

interface DeleteStartupDialogProps {
  children: React.ReactNode;
  startupId: string;
  startupName: string;
  onStartupDeleted: () => void;
}

const DeleteStartupDialog = ({ children, startupId, startupName, onStartupDeleted }: DeleteStartupDialogProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await adminApiService.deleteStartup(startupId);
      if (response.success) {
        toast({
          title: "Success",
          description: "Startup deleted successfully!",
        });
        setOpen(false);
        onStartupDeleted();
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to delete startup",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error deleting startup:', error);
      toast({
        title: "Error",
        description: "Failed to delete startup. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <span>Delete Startup</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Are you sure you want to delete this startup?
            </p>
            <p className="font-medium text-foreground">
              "{startupName}"
            </p>
            <p className="text-xs text-red-500 mt-2">
              This action cannot be undone. All startup data will be permanently deleted.
            </p>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)} 
              disabled={isDeleting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete} 
              disabled={isDeleting}
              className="flex-1"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteStartupDialog;
