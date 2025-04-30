
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Calendar as CalendarIcon, Plus, Trash } from 'lucide-react';
import { Customer, Quotation, QuotationItem } from '@/types';
import { cn } from '@/lib/utils';

interface QuotationFormProps {
  customers: Customer[];
  products: { id: string; name: string; price: number }[];
  onSubmit: (data: any) => void;
  quotation?: Quotation;
}

const formSchema = z.object({
  customerId: z.string().nonempty({ message: "Customer is required" }),
  items: z.array(z.object({
    productId: z.string().nonempty({ message: "Product is required" }),
    productName: z.string(),
    quantity: z.coerce.number().positive({ message: "Quantity must be positive" }),
    unitPrice: z.coerce.number().positive({ message: "Unit price must be positive" }),
    discount: z.coerce.number().min(0, { message: "Discount cannot be negative" }),
    tax: z.coerce.number().min(0, { message: "Tax cannot be negative" }),
    total: z.coerce.number()
  })).nonempty({ message: "At least one item is required" }),
  notes: z.string().optional(),
  expiryDate: z.date({ required_error: "Expiry date is required" }),
  status: z.enum(["draft", "sent", "accepted", "expired", "converted"], {
    required_error: "Status is required"
  }),
  subtotal: z.number(),
  tax: z.number(),
  discount: z.number(),
  total: z.number()
});

export default function QuotationForm({ customers, products, onSubmit, quotation }: QuotationFormProps) {
  const defaultValues = quotation ? {
    ...quotation,
    customerId: quotation.customerId,
  } : {
    customerId: '',
    items: [{ 
      productId: '', 
      productName: '', 
      quantity: 1, 
      unitPrice: 0, 
      discount: 0, 
      tax: 0, 
      total: 0 
    }],
    notes: '',
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    status: 'draft' as const,
    subtotal: 0,
    tax: 0,
    discount: 0,
    total: 0
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { watch, setValue } = form;
  const items = watch('items');

  // Calculate totals whenever items change
  useEffect(() => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const totalTax = items.reduce((sum, item) => sum + item.tax, 0);
    const totalDiscount = items.reduce((sum, item) => sum + item.discount, 0);
    const total = subtotal + totalTax - totalDiscount;
    
    setValue('subtotal', subtotal);
    setValue('tax', totalTax);
    setValue('discount', totalDiscount);
    setValue('total', total);
  }, [items, setValue]);

  // Calculate item total when quantity, unit price, discount, or tax changes
  const calculateItemTotal = (index: number) => {
    const item = items[index];
    const subtotal = item.quantity * item.unitPrice;
    const total = subtotal + item.tax - item.discount;
    
    const updatedItems = [...items];
    updatedItems[index] = { ...item, total };
    // Fix: Use specific non-spread syntax to ensure type safety
    setValue('items', updatedItems as any);
  };

  // Update product details when product is selected
  const handleProductSelect = (productId: string, index: number) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      const updatedItems = [...items];
      updatedItems[index] = {
        ...updatedItems[index],
        productId,
        productName: product.name,
        unitPrice: product.price,
      };
      // Fix: Use specific non-spread syntax to ensure type safety
      setValue('items', updatedItems as any);
      calculateItemTotal(index);
    }
  };

  // Add a new item row
  const addItem = () => {
    const newItems = [
      ...items,
      { productId: '', productName: '', quantity: 1, unitPrice: 0, discount: 0, tax: 0, total: 0 }
    ];
    // Fix: Use specific non-spread syntax to ensure type safety
    setValue('items', newItems as any);
  };

  // Remove an item row
  const removeItem = (index: number) => {
    if (items.length > 1) {
      const updatedItems = items.filter((_, i) => i !== index);
      // Fix: Use specific non-spread syntax to ensure type safety
      setValue('items', updatedItems as any);
    }
  };

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data);
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Selection */}
        <FormField
          control={form.control}
          name="customerId"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Customer</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a customer" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name} {customer.company ? `(${customer.company})` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Quotation Items */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Items</h3>
          <div className="border rounded-md">
            <div className="grid grid-cols-12 gap-2 p-2 bg-gray-50 text-xs font-medium text-gray-500">
              <div className="col-span-4">Product</div>
              <div className="col-span-1">Qty</div>
              <div className="col-span-2">Price</div>
              <div className="col-span-1">Discount</div>
              <div className="col-span-1">Tax</div>
              <div className="col-span-2">Total</div>
              <div className="col-span-1"></div>
            </div>

            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 p-2 border-t">
                {/* Product Selection */}
                <div className="col-span-4">
                  <Select
                    value={item.productId}
                    onValueChange={(value) => handleProductSelect(value, index)}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Quantity */}
                <div className="col-span-1">
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => {
                      const updatedItems = [...items];
                      updatedItems[index] = { 
                        ...item, 
                        quantity: parseInt(e.target.value) || 1 
                      };
                      // Fix: Use specific non-spread syntax to ensure type safety
                      setValue('items', updatedItems as any);
                      calculateItemTotal(index);
                    }}
                    className="h-9"
                  />
                </div>

                {/* Unit Price */}
                <div className="col-span-2">
                  <Input
                    type="number"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) => {
                      const updatedItems = [...items];
                      updatedItems[index] = { 
                        ...item, 
                        unitPrice: parseFloat(e.target.value) || 0 
                      };
                      // Fix: Use specific non-spread syntax to ensure type safety
                      setValue('items', updatedItems as any);
                      calculateItemTotal(index);
                    }}
                    className="h-9"
                  />
                </div>

                {/* Discount */}
                <div className="col-span-1">
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={item.discount}
                    onChange={(e) => {
                      const updatedItems = [...items];
                      updatedItems[index] = { 
                        ...item, 
                        discount: parseFloat(e.target.value) || 0 
                      };
                      // Fix: Use specific non-spread syntax to ensure type safety
                      setValue('items', updatedItems as any);
                      calculateItemTotal(index);
                    }}
                    className="h-9"
                  />
                </div>

                {/* Tax */}
                <div className="col-span-1">
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={item.tax}
                    onChange={(e) => {
                      const updatedItems = [...items];
                      updatedItems[index] = { 
                        ...item, 
                        tax: parseFloat(e.target.value) || 0 
                      };
                      // Fix: Use specific non-spread syntax to ensure type safety
                      setValue('items', updatedItems as any);
                      calculateItemTotal(index);
                    }}
                    className="h-9"
                  />
                </div>

                {/* Total */}
                <div className="col-span-2">
                  <Input
                    type="number"
                    step="0.01"
                    value={item.total}
                    readOnly
                    className="h-9 bg-gray-50"
                  />
                </div>

                {/* Remove Item Button */}
                <div className="col-span-1 flex justify-center items-center">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0" 
                    onClick={() => removeItem(index)}
                    disabled={items.length <= 1}
                  >
                    <Trash className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}

            <div className="p-2 border-t">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full"
                onClick={addItem}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Item
              </Button>
            </div>
          </div>
        </div>

        {/* Summary Section */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter any notes or special instructions"
                      className="h-24 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Expiry Date */}
            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Expiry Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Select date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      {quotation?.status === "converted" && (
                        <SelectItem value="converted">Converted</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4 border rounded-md p-4">
            <h3 className="font-medium">Summary</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal:</span>
                <span>${form.watch('subtotal').toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tax:</span>
                <span>${form.watch('tax').toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Discount:</span>
                <span>${form.watch('discount').toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between font-medium text-lg pt-2 border-t">
                <span>Total:</span>
                <span>${form.watch('total').toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="submit" className="bg-pos-blue hover:bg-pos-lightBlue">
            {quotation ? 'Update Quotation' : 'Create Quotation'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
