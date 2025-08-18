import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import startupDashboardService from "@/services/startupDashboardService";
import { Loader2 } from "lucide-react";

interface Deal {
  id: number;
  title: string;
  value: string;
  status: string;
  expires: string;
  description: string;
  category: string;
  requirements: string;
  application_count: number;
}

const Deals = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchDeals = async () => {
    try {
      setIsLoading(true);
      const response = await startupDashboardService.getActiveDeals();
      
      if (response.success) {
        setDeals(response.data);
      } else {
        toast({
          title: "Error",
          description: "Failed to load deals",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching deals:', error);
      toast({
        title: "Error",
        description: "Failed to load deals",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const handleApplyForDeal = (deal: Deal) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to apply for deals",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Application Submitted",
      description: `Your application for ${deal.title} has been submitted successfully!`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-20 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent mb-2">
            Active Deals
          </h1>
          <p className="text-muted-foreground">Discover exclusive deals and offers for startups</p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading deals...</span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {deals.map((deal) => (
              <Card key={deal.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{deal.title}</CardTitle>
                    <Badge className="bg-green-100 text-green-800">
                      {deal.status}
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold text-primary">
                    {deal.value}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{deal.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <Badge className="bg-blue-100 text-blue-800">
                      {deal.category}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {deal.application_count} applied
                    </span>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    Expires: {deal.expires}
                  </div>

                  <div className="text-sm">
                    <strong>Requirements:</strong> {deal.requirements}
                  </div>

                  <Button 
                    className="w-full" 
                    onClick={() => handleApplyForDeal(deal)}
                  >
                    Apply for Deal
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Deals;
