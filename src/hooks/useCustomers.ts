
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from '@/services/customerService';
import { Customer } from '@/types';

export function useCustomers() {
  const queryClient = useQueryClient();
  
  const customersQuery = useQuery({
    queryKey: ['customers'],
    queryFn: getCustomers
  });

  const createCustomerMutation = useMutation({
    mutationFn: (newCustomer: Omit<Customer, 'id' | 'createdAt'>) => createCustomer(newCustomer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    }
  });

  const updateCustomerMutation = useMutation({
    mutationFn: ({ id, customer }: { id: string, customer: Partial<Omit<Customer, 'id' | 'createdAt'>> }) => 
      updateCustomer(id, customer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    }
  });

  const deleteCustomerMutation = useMutation({
    mutationFn: (id: string) => deleteCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    }
  });

  return {
    customers: customersQuery.data || [],
    isLoading: customersQuery.isLoading,
    error: customersQuery.error,
    createCustomer: createCustomerMutation.mutate,
    updateCustomer: updateCustomerMutation.mutate,
    deleteCustomer: deleteCustomerMutation.mutate,
  };
}
