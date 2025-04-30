
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit, Trash } from 'lucide-react';
import { useCustomers } from '@/hooks/useCustomers';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';

const Customers = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { customers, isLoading, error, deleteCustomer } = useCustomers();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);
  
  // Filter customers based on search query
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (customer.company && customer.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery)
  );
  
  const handleDeleteClick = (id: string) => {
    setCustomerToDelete(id);
    setDeleteConfirmOpen(true);
  };
  
  const confirmDelete = () => {
    if (customerToDelete) {
      deleteCustomer(customerToDelete);
      setDeleteConfirmOpen(false);
      setCustomerToDelete(null);
    }
  };
  
  const getCustomerTypeBadge = (type: string) => {
    switch (type) {
      case 'retail':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Retail</Badge>;
      case 'wholesale':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Wholesale</Badge>;
      case 'vip':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">VIP</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
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
          
          <Button 
            className="bg-pos-blue hover:bg-pos-lightBlue"
            onClick={() => navigate('/customers/new')}
          >
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
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
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
                          {getCustomerTypeBadge(customer.type)}
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            {customer.email && <p className="text-sm">{customer.email}</p>}
                            {customer.phone && <p className="text-sm text-gray-500">{customer.phone}</p>}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {customer.address.city && customer.address.state ? (
                            <span>{customer.address.city}, {customer.address.state}</span>
                          ) : (
                            customer.address.city || customer.address.state || 'N/A'
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className={`font-medium ${customer.currentBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                              ${customer.currentBalance.toFixed(2)}
                            </p>
                            {customer.creditLimit && (
                              <p className="text-xs text-gray-500">
                                Limit: ${customer.creditLimit.toFixed(2)}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => navigate(`/customers/${customer.id}`)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDeleteClick(customer.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredCustomers.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-gray-500">
                          No customers found matching your search.
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
      
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Customer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this customer? This action cannot be undone 
              and all associated data including invoices and quotations will be orphaned.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default Customers;
