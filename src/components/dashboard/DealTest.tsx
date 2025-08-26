import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { dealService } from '@/services/dealService';

const DealTest = () => {
  const [deals, setDeals] = useState<{id: string; deal_name: string; startup_name: string; status: string; created_at: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testFetchDeals = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Testing fetch deals...');
      
      // Test the new deal service
      const opportunities = await dealService.getNewDealOpportunities('test-user-id');
      console.log('Deal opportunities result:', opportunities);

      if (opportunities.length > 0) {
        setDeals(opportunities.map(opp => ({
          id: opp.id,
          deal_name: opp.company_name,
          startup_name: opp.company_name,
          status: opp.source,
          created_at: opp.created_at
        })));
      } else {
        setError('No deals found. Please create some deals in the admin dashboard first.');
      }

    } catch (err) {
      console.error('Error in test:', err);
      setError(`Test error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Deal Database Test</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={testFetchDeals} disabled={loading}>
          {loading ? 'Testing...' : 'Test Fetch Deals'}
        </Button>
        
        {error && (
          <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {deals.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Found {deals.length} deals:</h3>
            <div className="space-y-2">
              {deals.map((deal, index) => (
                <div key={index} className="p-2 border rounded">
                  <div><strong>Name:</strong> {deal.deal_name}</div>
                  <div><strong>Startup:</strong> {deal.startup_name}</div>
                  <div><strong>Status:</strong> {deal.status}</div>
                  <div><strong>Created:</strong> {deal.created_at}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {deals.length === 0 && !loading && !error && (
          <div className="mt-4 text-gray-500">
            No deals found. Click the button to test.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DealTest;
