
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getInventory, getStockMovements, createStockMovement } from '@/services/inventoryService';
import { StockMovement } from '@/types';

export function useInventory() {
  const queryClient = useQueryClient();
  
  const inventoryQuery = useQuery({
    queryKey: ['inventory'],
    queryFn: getInventory
  });

  const stockMovementsQuery = useQuery({
    queryKey: ['stockMovements'],
    queryFn: getStockMovements
  });

  const createStockMovementMutation = useMutation({
    mutationFn: (movement: Omit<StockMovement, 'id' | 'date'>) => createStockMovement(movement),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['stockMovements'] });
      queryClient.invalidateQueries({ queryKey: ['products'] }); // Since product inventory is affected
    }
  });

  return {
    inventory: inventoryQuery.data || [],
    isLoadingInventory: inventoryQuery.isLoading,
    inventoryError: inventoryQuery.error,
    
    stockMovements: stockMovementsQuery.data || [],
    isLoadingMovements: stockMovementsQuery.isLoading,
    movementsError: stockMovementsQuery.error,
    
    createStockMovement: createStockMovementMutation.mutate,
  };
}
