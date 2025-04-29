
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit, Trash } from 'lucide-react';
import { Product } from '@/types';

const Products = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock product data
  const products: Product[] = [
    {
      id: '1',
      name: 'Premium T-Shirt',
      description: 'High quality cotton t-shirt',
      category: 'Clothing',
      barcode: '123456789',
      image: undefined,
      retailPrice: 29.99,
      wholesalePrice: 19.99,
      cost: 12.50,
      taxRate: 10,
      inStock: 50,
      minStockLevel: 10,
      variants: [
        {
          id: '1-1',
          name: 'Premium T-Shirt - Small Black',
          sku: 'TS-BLK-S',
          price: 29.99,
          cost: 12.50,
          attributes: { "size": "S", "color": "Black" }
        },
        {
          id: '1-2',
          name: 'Premium T-Shirt - Medium Black',
          sku: 'TS-BLK-M',
          price: 29.99,
          cost: 12.50,
          attributes: { "size": "M", "color": "Black" }
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      name: 'Leather Wallet',
      description: 'Genuine leather wallet with multiple card slots',
      category: 'Accessories',
      barcode: '987654321',
      image: undefined,
      retailPrice: 49.99,
      wholesalePrice: 35.00,
      cost: 22.00,
      taxRate: 10,
      inStock: 30,
      minStockLevel: 15,
      variants: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '3',
      name: 'Wireless Headphones',
      description: 'Bluetooth wireless headphones with noise cancellation',
      category: 'Electronics',
      barcode: '456789123',
      image: undefined,
      retailPrice: 129.99,
      wholesalePrice: 95.00,
      cost: 65.00,
      taxRate: 10,
      inStock: 15,
      minStockLevel: 8,
      variants: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
  
  // Filter products based on search query
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.barcode.includes(searchQuery)
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button className="bg-pos-blue hover:bg-pos-lightBlue">
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </div>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU/Barcode</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Retail Price</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wholesale</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 flex-shrink-0 bg-gray-200 rounded-md mr-3"></div>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-xs text-gray-500 truncate max-w-[200px]">{product.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">{product.category}</td>
                      <td className="py-3 px-4">{product.barcode}</td>
                      <td className="py-3 px-4">${product.retailPrice.toFixed(2)}</td>
                      <td className="py-3 px-4">${product.wholesalePrice.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                          ${product.inStock > product.minStockLevel ? 'bg-green-100 text-green-800' :
                          product.inStock > 0 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'}`}
                        >
                          {product.inStock}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Products;
