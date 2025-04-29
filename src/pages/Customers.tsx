
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Edit, FileText, Mail } from 'lucide-react';
import { useCustomers } from '@/hooks/useCustomers';
import { Skeleton } from '@/components/ui/skeleton';

const Customers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { customers, isLoading, error } = useCustomers();
  
  // Filter customers based on search query
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (customer.company && customer.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery)
  );

  // Function to get customer type badge class
  const getCustomerTypeClass = (type: string) => {
    switch(type) {
      case 'retail': return 'bg-blue-100 text-blue-800';
      case 'wholesale': return 'bg-purple-100 text-purple-800';
      case 'vip': return 'bg-amber-100 text-amber-800';
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
              placeholder="Search customers..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button className="bg-pos-blue hover:bg-pos-lightBlue">
            <Plus className="mr-2 h-4 w-4" /> Add Customer
          </Button>
        </div>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Customers</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="w-full h-16" />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-6 text-red-500">
                <p>Error loading customers. Please try again.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Balance</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map((customer) => (
                      <tr key={customer.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{customer.name}</p>
                            {customer.company && (
                              <p className="text-xs text-gray-500">{customer.company}</p>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getCustomerTypeClass(customer.type)}`}>
                            {customer.type}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="text-sm">{customer.email}</p>
                            <p className="text-xs text-gray-500">{customer.phone}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {customer.address.city}, {customer.address.state}
                        </td>
                        <td className="py-3 px-4 font-medium">
                          ${customer.currentBalance.toFixed(2)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" className="text-xs h-8">
                              <Edit className="mr-1 h-3 w-3" /> Edit
                            </Button>
                            <Button variant="outline" size="sm" className="text-xs h-8">
                              <FileText className="mr-1 h-3 w-3" /> Orders
                            </Button>
                            <Button variant="outline" size="sm" className="text-xs h-8">
                              <Mail className="mr-1 h-3 w-3" /> Email
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
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

export default Customers;
