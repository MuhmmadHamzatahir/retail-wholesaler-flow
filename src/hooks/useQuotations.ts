
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getQuotations, 
  createQuotation, 
  updateQuotation, 
  deleteQuotation, 
  convertQuotationToInvoice 
} from '@/services/quotationService';
import { Quotation } from '@/types';

export function useQuotations() {
  const queryClient = useQueryClient();
  
  const quotationsQuery = useQuery({
    queryKey: ['quotations'],
    queryFn: getQuotations
  });

  const createQuotationMutation = useMutation({
    mutationFn: (newQuotation: Omit<Quotation, 'id' | 'createdAt' | 'updatedAt'>) => createQuotation(newQuotation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
    }
  });

  const updateQuotationMutation = useMutation({
    mutationFn: ({ id, quotation }: { id: string, quotation: Partial<Omit<Quotation, 'id' | 'createdAt' | 'updatedAt'>> }) => 
      updateQuotation(id, quotation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
    }
  });

  const deleteQuotationMutation = useMutation({
    mutationFn: (id: string) => deleteQuotation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
    }
  });

  const convertToInvoiceMutation = useMutation({
    mutationFn: (quotation: Quotation) => convertQuotationToInvoice(quotation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    }
  });

  return {
    quotations: quotationsQuery.data || [],
    isLoading: quotationsQuery.isLoading,
    error: quotationsQuery.error,
    createQuotation: createQuotationMutation.mutate,
    updateQuotation: updateQuotationMutation.mutate,
    deleteQuotation: deleteQuotationMutation.mutate,
    convertToInvoice: convertToInvoiceMutation.mutate,
  };
}
