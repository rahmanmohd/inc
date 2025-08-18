import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import startupDashboardService from "@/services/startupDashboardService";
import InvestmentApplicationDialog from "@/components/InvestmentApplicationDialog";

interface InvestmentTableProps {
  userId?: string;
}

const InvestmentTable = ({ userId }: InvestmentTableProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [investmentApplications, setInvestmentApplications] = useState([
    { id: 1, investor: "Sequoia Capital", amount: "₹2.5Cr", status: "In Progress", date: "Dec 20, 2024" }
  ]);

  // Fetch investment applications
  const fetchInvestmentApplications = async () => {
    if (!userId) return;
    
    try {
      setIsLoading(true);
      const response = await startupDashboardService.getUserApplications(userId);
      
      if (response.success && response.data.investment) {
        const formattedApps = response.data.investment.map((app: any) => ({
          id: app.id,
          investor: app.investor_name || app.company_name || "Unknown Investor",
          amount: app.funding_amount || "₹0",
          status: app.status || "Pending",
          date: new Date(app.created_at).toLocaleDateString()
        }));
        setInvestmentApplications(formattedApps);
      }
    } catch (error) {
      console.error('Error fetching investment applications:', error);
      toast({
        title: "Error",
        description: "Failed to load investment applications",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestmentApplications();
  }, [userId]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Investment Applications</h2>
        <InvestmentApplicationDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Application
          </Button>
        </InvestmentApplicationDialog>
      </div>
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Loading applications...</span>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Investor</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {investmentApplications.length > 0 ? (
                  investmentApplications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell className="font-medium">{app.investor}</TableCell>
                      <TableCell>{app.amount}</TableCell>
                      <TableCell>
                        <Badge variant={app.status === "In Progress" ? "default" : "secondary"}>
                          {app.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{app.date}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">View Details</Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No investment applications yet. Create your first application to get started!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InvestmentTable;