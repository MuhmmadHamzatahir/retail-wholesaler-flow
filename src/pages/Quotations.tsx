
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
  MoreHorizontal,
  Filter, 
  Check,
  Trash,
  Send,
  Eye
} from 'lucide-react';
import { useQuotations } from '@/hooks/useQuotations';
import { useCustomers } from '@/hooks/useCustomers';
import { useProducts } from '@/hooks/useProducts';
import { Skeleton } from '@/components/ui/skeleton';
import QuotationModal from '@/components/quotations/QuotationModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Quotation } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import QuotationView from '@/components/quotations/QuotationView';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Quotations = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isNewQuotationModalOpen, setIsNewQuotationModalOpen] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | undefined>(undefined);
  const [viewQuotation, setViewQuotation] = useState<Quotation | undefined>(undefined);

  const { quotations, isLoading, error, createQuotation, updateQuotation, deleteQuotation, convertToInvoice } = useQuotations();
  const { customers, isLoading: customersLoading } = useCustomers();
  const { products, isLoading: productsLoading } = useProducts();
  
  // Filter quotations based on search query and status filter
  const filteredQuotations = quotations?.filter(quotation => {
    const matchesSearch = quotation.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quotation.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || quotation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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

  const handleCreateQuotation = (data: any) => {
    // Find the customer name to include
    const selectedCustomer = customers?.find(c => c.id === data.customerId);
    const customerName = selectedCustomer ? selectedCustomer.name : '';
    
    createQuotation({
      customerId: data.customerId,
      customerName: customerName,
      items: data.items,
      subtotal: data.subtotal,
      tax: data.tax,
      discount: data.discount,
      total: data.total,
      notes: data.notes,
      expiryDate: data.expiryDate,
      status: data.status
    });
  };

  const handleUpdateQuotation = (data: any) => {
    if (selectedQuotation) {
      // Keep the existing customerName when updating
      updateQuotation({
        id: selectedQuotation.id,
        quotation: {
          customerId: data.customerId,
          items: data.items,
          subtotal: data.subtotal,
          tax: data.tax,
          discount: data.discount,
          total: data.total,
          notes: data.notes,
          expiryDate: data.expiryDate,
          status: data.status,
          customerName: selectedQuotation.customerName // Keep existing customerName
        }
      });
    }
    setSelectedQuotation(undefined);
  };

  const handleChangeStatus = (quotation: Quotation, newStatus: 'draft' | 'sent' | 'accepted' | 'expired') => {
    updateQuotation({
      id: quotation.id,
      quotation: {
        status: newStatus
      }
    });
  };

  const openEditModal = (quotation: Quotation) => {
    setSelectedQuotation(quotation);
  };

  const handleDeleteQuotation = (id: string) => {
    deleteQuotation(id);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:space-x-4">
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
            
            <div className="w-full md:w-60">
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-full">
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4 text-gray-500" />
                    <span>
                      {statusFilter === 'all' 
                        ? 'All Statuses' 
                        : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                    </span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button 
            className="bg-pos-blue hover:bg-pos-lightBlue"
            onClick={() => setIsNewQuotationModalOpen(true)}
          >
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
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-xs h-8"
                                onClick={() => setViewQuotation(quotation)}
                              >
                                <Eye className="mr-1 h-3 w-3" /> View
                              </Button>
                              
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  
                                  {quotation.status !== 'converted' && (
                                    <DropdownMenuItem onClick={() => openEditModal(quotation)}>
                                      <FileText className="mr-2 h-4 w-4" /> Edit Quotation
                                    </DropdownMenuItem>
                                  )}
                                  
                                  {quotation.status !== 'converted' && quotation.status !== 'expired' && (
                                    <>
                                      <DropdownMenuItem onClick={() => convertToInvoice(quotation)}>
                                        <Check className="mr-2 h-4 w-4" /> Convert to Invoice
                                      </DropdownMenuItem>
                                      
                                      {quotation.status === 'draft' && (
                                        <DropdownMenuItem onClick={() => handleChangeStatus(quotation, 'sent')}>
                                          <Send className="mr-2 h-4 w-4" /> Mark as Sent
                                        </DropdownMenuItem>
                                      )}
                                      
                                      {quotation.status === 'sent' && (
                                        <DropdownMenuItem onClick={() => handleChangeStatus(quotation, 'accepted')}>
                                          <Check className="mr-2 h-4 w-4" /> Mark as Accepted
                                        </DropdownMenuItem>
                                      )}
                                      
                                      <DropdownMenuSeparator />
                                    </>
                                  )}
                                  
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                        <Trash className="mr-2 h-4 w-4 text-red-500" />
                                        <span className="text-red-500">Delete</span>
                                      </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          This will permanently delete this quotation. This action cannot be undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction 
                                          className="bg-red-500 hover:bg-red-600"
                                          onClick={() => handleDeleteQuotation(quotation.id)}
                                        >
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </DropdownMenuContent>
                              </DropdownMenu>
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

      {/* New Quotation Modal */}
      <QuotationModal
        open={isNewQuotationModalOpen}
        onClose={() => setIsNewQuotationModalOpen(false)}
        onSubmit={handleCreateQuotation}
        customers={customers || []}
        products={products || []}
        title="Create New Quotation"
      />

      {/* Edit Quotation Modal */}
      {selectedQuotation && (
        <QuotationModal
          open={!!selectedQuotation}
          onClose={() => setSelectedQuotation(undefined)}
          onSubmit={handleUpdateQuotation}
          customers={customers || []}
          products={products || []}
          quotation={selectedQuotation}
          title="Edit Quotation"
        />
      )}
      
      {/* View Quotation Dialog */}
      {viewQuotation && (
        <Dialog open={!!viewQuotation} onOpenChange={() => setViewQuotation(undefined)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Quotation Details</DialogTitle>
            </DialogHeader>
            <QuotationView quotation={viewQuotation} />
          </DialogContent>
        </Dialog>
      )}
    </MainLayout>
  );
};

export default Quotations;
