
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getInvoices, createInvoice, updateInvoice, deleteInvoice } from '@/services/invoiceService';
import { Invoice } from '@/types';

export function useInvoices() {
  const queryClient = useQueryClient();
  
  const invoicesQuery = useQuery({
    queryKey: ['invoices'],
    queryFn: getInvoices
  });

  const createInvoiceMutation = useMutation({
    mutationFn: (newInvoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => createInvoice(newInvoice),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    }
  });

  const updateInvoiceMutation = useMutation({
    mutationFn: ({ id, invoice }: { id: string, invoice: Partial<Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>> }) => 
      updateInvoice(id, invoice),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    }
  });

  const deleteInvoiceMutation = useMutation({
    mutationFn: (id: string) => deleteInvoice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    }
  });

  return {
    invoices: invoicesQuery.data || [],
    isLoading: invoicesQuery.isLoading,
    error: invoicesQuery.error,
    createInvoice: createInvoiceMutation.mutate,
    updateInvoice: updateInvoiceMutation.mutate,
    deleteInvoice: deleteInvoiceMutation.mutate,
  };
}
