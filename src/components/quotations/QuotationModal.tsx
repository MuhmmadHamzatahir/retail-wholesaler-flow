
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import QuotationForm from './QuotationForm';
import { Customer, Product, Quotation } from '@/types';

interface QuotationModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  customers: Customer[];
  products: Product[];
  quotation?: Quotation;
  title: string;
}

export default function QuotationModal({
  open,
  onClose,
  onSubmit,
  customers,
  products,
  quotation,
  title
}: QuotationModalProps) {
  // Convert products to the format expected by QuotationForm
  const formattedProducts = products.map(product => ({
    id: product.id,
    name: product.name,
    price: product.retailPrice,
  }));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>{title}</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <div className="mt-4">
          <QuotationForm
            customers={customers}
            products={formattedProducts}
            onSubmit={(data) => {
              onSubmit(data);
              onClose();
            }}
            quotation={quotation}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
