
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import CustomerForm from '@/components/customers/CustomerForm';
import { Skeleton } from '@/components/ui/skeleton';
import { useCustomers } from '@/hooks/useCustomers';

const CustomerDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { customers, isLoading } = useCustomers();
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    if (!id) {
      navigate('/customers');
      return;
    }

    if (!isLoading && customers) {
      const foundCustomer = customers.find(c => c.id === id);
      if (foundCustomer) {
        setCustomer(foundCustomer);
      } else {
        navigate('/customers');
      }
    }
  }, [id, customers, isLoading, navigate]);

  return (
    <MainLayout>
      {isLoading || !customer ? (
        <div className="container py-8">
          <Skeleton className="h-12 w-48 mb-6" />
          <div className="space-y-4">
            <Skeleton className="h-[500px] w-full" />
          </div>
        </div>
      ) : (
        <CustomerForm initialData={customer} />
      )}
    </MainLayout>
  );
};

export default CustomerDetails;
