
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import ProductForm from '@/components/products/ProductForm';
import { Skeleton } from '@/components/ui/skeleton';
import { useProducts } from '@/hooks/useProducts';

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, isLoading } = useProducts();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (!id) {
      navigate('/products');
      return;
    }

    if (!isLoading && products) {
      const foundProduct = products.find(p => p.id === id);
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        navigate('/products');
      }
    }
  }, [id, products, isLoading, navigate]);

  return (
    <MainLayout>
      {isLoading || !product ? (
        <div className="container py-8">
          <Skeleton className="h-12 w-48 mb-6" />
          <div className="space-y-4">
            <Skeleton className="h-[600px] w-full" />
          </div>
        </div>
      ) : (
        <ProductForm initialData={product} />
      )}
    </MainLayout>
  );
};

export default ProductDetails;
