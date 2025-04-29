
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProducts, createProduct, updateProduct, deleteProduct } from '@/services/productService';
import { Product } from '@/types';

export function useProducts() {
  const queryClient = useQueryClient();
  
  const productsQuery = useQuery({
    queryKey: ['products'],
    queryFn: getProducts
  });

  const createProductMutation = useMutation({
    mutationFn: (newProduct: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => createProduct(newProduct),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, product }: { id: string, product: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>> }) => 
      updateProduct(id, product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });

  return {
    products: productsQuery.data || [],
    isLoading: productsQuery.isLoading,
    error: productsQuery.error,
    createProduct: createProductMutation.mutate,
    updateProduct: updateProductMutation.mutate,
    deleteProduct: deleteProductMutation.mutate,
  };
}
