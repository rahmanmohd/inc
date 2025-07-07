import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Eye, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface InvestorManagementProps {
  investors: Array<{
    id: number;
    name: string;
    checkSize: string;
    portfolio: number;
    stage: string;
    status: string;
  }>;
}

const InvestorManagement = ({ investors }: InvestorManagementProps) => {
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Investor Management</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Investor
        </Button>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Investor Name</TableHead>
                <TableHead>Check Size</TableHead>
                <TableHead>Portfolio</TableHead>
                <TableHead>Investment Stage</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {investors.map((investor) => (
                <TableRow key={investor.id}>
                  <TableCell className="font-medium">{investor.name}</TableCell>
                  <TableCell>{investor.checkSize}</TableCell>
                  <TableCell>{investor.portfolio} startups</TableCell>
                  <TableCell>{investor.stage}</TableCell>
                  <TableCell>
                    <Badge variant={investor.status === "Active" ? "default" : "secondary"}>
                      {investor.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => {
                        toast({
                          title: "Investor Updated",
                          description: "Investor information has been updated.",
                        });
                      }}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvestorManagement;