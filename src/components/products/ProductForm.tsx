
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Product, ProductVariant } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  category: z.string().optional(),
  barcode: z.string().optional(),
  retailPrice: z.coerce.number().min(0),
  wholesalePrice: z.coerce.number().min(0),
  cost: z.coerce.number().min(0),
  taxRate: z.coerce.number().min(0),
  minStockLevel: z.coerce.number().min(0).default(10),
  inStock: z.coerce.number().min(0).default(0),
});

type ProductFormProps = {
  initialData?: Product;
};

export default function ProductForm({ initialData }: ProductFormProps) {
  const navigate = useNavigate();
  const { createProduct, updateProduct } = useProducts();
  const [variants, setVariants] = useState<Partial<ProductVariant>[]>(
    initialData?.variants || []
  );
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      category: initialData?.category || "",
      barcode: initialData?.barcode || "",
      retailPrice: initialData?.retailPrice || 0,
      wholesalePrice: initialData?.wholesalePrice || 0,
      cost: initialData?.cost || 0,
      taxRate: initialData?.taxRate || 10,
      minStockLevel: initialData?.minStockLevel || 10,
      inStock: initialData?.inStock || 0,
    },
  });
  
  const addVariant = () => {
    setVariants([...variants, {
      name: '',
      sku: '',
      price: 0,
      cost: 0,
      attributes: {}
    }]);
  };
  
  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };
  
  const updateVariant = (index: number, field: string, value: any) => {
    const updatedVariants = [...variants];
    (updatedVariants[index] as any)[field] = value;
    setVariants(updatedVariants);
  };

  const updateVariantAttribute = (index: number, key: string, value: string) => {
    const updatedVariants = [...variants];
    const currentVariant = updatedVariants[index];
    
    if (!currentVariant.attributes) {
      currentVariant.attributes = {};
    }
    
    (currentVariant.attributes as Record<string, string>)[key] = value;
    setVariants(updatedVariants);
  };
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Ensure all variants have all required fields
      const validVariants = variants.filter(v => v.name && v.sku && v.price !== undefined && v.cost !== undefined) as ProductVariant[];
      
      const productData = {
        ...values,
        variants: validVariants,
        image: initialData?.image
      };
      
      if (initialData) {
        await updateProduct({ id: initialData.id, product: productData });
      } else {
        await createProduct(productData);
      }
      
      navigate('/products');
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>{initialData ? 'Edit Product' : 'Add New Product'}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="basic">Basic Information</TabsTrigger>
                  <TabsTrigger value="pricing">Pricing</TabsTrigger>
                  <TabsTrigger value="variants">Variants</TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic" className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Product name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Product description"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <FormControl>
                            <Input placeholder="Product category" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="barcode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Barcode/SKU</FormLabel>
                          <FormControl>
                            <Input placeholder="Product barcode" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="pricing" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="retailPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Retail Price</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="0.00"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="wholesalePrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Wholesale Price</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="0.00"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="cost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cost</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="0.00"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="taxRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tax Rate (%)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.1"
                              placeholder="10.0"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="inStock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Stock</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              placeholder="0"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="minStockLevel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimum Stock Level</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              placeholder="10"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="variants" className="space-y-4">
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      onClick={addVariant}
                      size="sm"
                      className="mb-2"
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add Variant
                    </Button>
                  </div>
                  
                  {variants.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      No variants added yet. Click "Add Variant" to create product variants.
                    </div>
                  ) : (
                    variants.map((variant, index) => (
                      <div key={index} className="border rounded-md p-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">Variant {index + 1}</h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeVariant(index)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`variant-${index}-name`}>Name</Label>
                            <Input
                              id={`variant-${index}-name`}
                              value={variant.name || ''}
                              onChange={(e) => updateVariant(index, 'name', e.target.value)}
                              placeholder="Variant name"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor={`variant-${index}-sku`}>SKU</Label>
                            <Input
                              id={`variant-${index}-sku`}
                              value={variant.sku || ''}
                              onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                              placeholder="SKU code"
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`variant-${index}-price`}>Price</Label>
                            <Input
                              id={`variant-${index}-price`}
                              type="number"
                              min="0"
                              step="0.01"
                              value={variant.price || 0}
                              onChange={(e) => updateVariant(index, 'price', parseFloat(e.target.value))}
                              placeholder="0.00"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor={`variant-${index}-cost`}>Cost</Label>
                            <Input
                              id={`variant-${index}-cost`}
                              type="number"
                              min="0"
                              step="0.01"
                              value={variant.cost || 0}
                              onChange={(e) => updateVariant(index, 'cost', parseFloat(e.target.value))}
                              placeholder="0.00"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="font-medium mb-2">Attributes</h5>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label htmlFor={`variant-${index}-attr-color`}>Color</Label>
                              <Input
                                id={`variant-${index}-attr-color`}
                                value={variant.attributes?.color || ''}
                                onChange={(e) => updateVariantAttribute(index, 'color', e.target.value)}
                                placeholder="Color"
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor={`variant-${index}-attr-size`}>Size</Label>
                              <Input
                                id={`variant-${index}-attr-size`}
                                value={variant.attributes?.size || ''}
                                onChange={(e) => updateVariantAttribute(index, 'size', e.target.value)}
                                placeholder="Size"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </TabsContent>
              </Tabs>
              
              <CardFooter className="flex justify-between pt-4 px-0">
                <Button type="button" variant="outline" onClick={() => navigate('/products')}>
                  Cancel
                </Button>
                <Button type="submit">
                  {initialData ? 'Update Product' : 'Create Product'}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
