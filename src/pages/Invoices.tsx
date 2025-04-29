
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Plus, 
  FileText, 
  Download,
  MoreHorizontal 
} from 'lucide-react';
import { useInvoices } from '@/hooks/useInvoices';
import { Skeleton } from '@/components/ui/skeleton';

const Invoices = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { invoices, isLoading, error } = useInvoices();
  
  // Filter invoices based on search query
  const filteredInvoices = invoices?.filter(invoice => 
    invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to get status badge class
  const getStatusClass = (status: string) => {
    switch(status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'partial': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'void': return 'bg-gray-100 text-gray-800';
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
              placeholder="Search invoices..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button className="bg-pos-blue hover:bg-pos-lightBlue">
            <Plus className="mr-2 h-4 w-4" /> New Invoice
          </Button>
        </div>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Invoices</CardTitle>
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
                <p>Error loading invoices. Please try again.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice #</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Date</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInvoices && filteredInvoices.length > 0 ? (
                      filteredInvoices.map((invoice) => (
                        <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{invoice.id.slice(0, 8)}</td>
                          <td className="py-3 px-4">{invoice.customerName}</td>
                          <td className="py-3 px-4 text-gray-500">
                            {invoice.createdAt.toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-gray-500">
                            {invoice.dueDate.toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 font-medium">${invoice.total.toFixed(2)}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusClass(invoice.status)}`}>
                              {invoice.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" className="text-xs h-8">
                                <FileText className="mr-1 h-3 w-3" /> View
                              </Button>
                              
                              <Button variant="outline" size="sm" className="text-xs h-8">
                                <Download className="mr-1 h-3 w-3" /> Download
                              </Button>
                              
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
                          No invoices found
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

export default Invoices;
