
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Plus, 
  FileText, 
  Calendar,
  MoreHorizontal 
} from 'lucide-react';
import { useQuotations } from '@/hooks/useQuotations';
import { Skeleton } from '@/components/ui/skeleton';

const Quotations = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { quotations, isLoading, error, convertToInvoice } = useQuotations();
  
  // Filter quotations based on search query
  const filteredQuotations = quotations?.filter(quotation => 
    quotation.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    quotation.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to get status badge class
  const getStatusClass = (status: string) => {
    switch(status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'converted': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search quotations..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button className="bg-pos-blue hover:bg-pos-lightBlue">
            <Plus className="mr-2 h-4 w-4" /> New Quotation
          </Button>
        </div>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Quotations</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="w-full h-12" />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-6 text-red-500">
                <p>Error loading quotations. Please try again.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quote #</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredQuotations && filteredQuotations.length > 0 ? (
                      filteredQuotations.map((quotation) => (
                        <tr key={quotation.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{quotation.id.slice(0, 8)}</td>
                          <td className="py-3 px-4">{quotation.customerName}</td>
                          <td className="py-3 px-4 text-gray-500">
                            {quotation.createdAt.toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-gray-500">
                            {quotation.expiryDate.toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 font-medium">${quotation.total.toFixed(2)}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusClass(quotation.status)}`}>
                              {quotation.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" className="text-xs h-8">
                                <FileText className="mr-1 h-3 w-3" /> View
                              </Button>
                              
                              {quotation.status !== 'converted' && (
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="text-xs h-8 bg-pos-blue text-white hover:bg-pos-lightBlue"
                                  onClick={() => convertToInvoice(quotation)}
                                >
                                  Convert to Invoice
                                </Button>
                              )}
                              
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="py-4 text-center text-gray-500">
                          No quotations found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Quotations;
