
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Filter, Search, Plus, ArrowUp, ArrowDown } from 'lucide-react';
import { InventoryItem } from '@/types';

const Inventory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock inventory data
  const inventoryItems: InventoryItem[] = [
    {
      id: '1',
      productId: '1',
      productName: 'Premium T-Shirt',
      location: 'Main Warehouse',
      quantity: 50,
      lastUpdated: new Date('2025-04-25')
    },
    {
      id: '2',
      productId: '2',
      productName: 'Leather Wallet',
      location: 'Main Warehouse',
      quantity: 30,
      lastUpdated: new Date('2025-04-26')
    },
    {
      id: '3',
      productId: '3',
      productName: 'Wireless Headphones',
      location: 'Main Warehouse',
      quantity: 15,
      lastUpdated: new Date('2025-04-27')
    },
    {
      id: '4',
      productId: '1',
      productName: 'Premium T-Shirt',
      location: 'Retail Store',
      quantity: 20,
      lastUpdated: new Date('2025-04-28')
    }
  ];
  
  // Filter inventory items based on search query
  const filteredItems = inventoryItems.filter(item => 
    item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search inventory..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" /> Filter
            </Button>
            <Button variant="secondary" className="bg-pos-blue text-white hover:bg-pos-lightBlue">
              <ArrowDown className="mr-2 h-4 w-4" /> Stock In
            </Button>
            <Button variant="secondary" className="bg-pos-blue text-white hover:bg-pos-lightBlue">
              <ArrowUp className="mr-2 h-4 w-4" /> Stock Out
            </Button>
            <Button className="bg-pos-blue hover:bg-pos-lightBlue">
              <Plus className="mr-2 h-4 w-4" /> Adjustment
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Current Inventory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{item.productName}</td>
                      <td className="py-3 px-4">{item.location}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                          ${item.quantity > 20 ? 'bg-green-100 text-green-800' :
                          item.quantity > 5 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'}`}
                        >
                          {item.quantity}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-500">
                        {item.lastUpdated.toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Recent Stock Movements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-500">2025-04-28</td>
                    <td className="py-3 px-4 font-medium">Premium T-Shirt</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                        Stock In
                      </span>
                    </td>
                    <td className="py-3 px-4">+10</td>
                    <td className="py-3 px-4">PO-12345</td>
                  </tr>
                  <tr className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-500">2025-04-27</td>
                    <td className="py-3 px-4 font-medium">Leather Wallet</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-800">
                        Stock Out
                      </span>
                    </td>
                    <td className="py-3 px-4">-5</td>
                    <td className="py-3 px-4">INV-002</td>
                  </tr>
                  <tr className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-500">2025-04-26</td>
                    <td className="py-3 px-4 font-medium">Wireless Headphones</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
                        Transfer
                      </span>
                    </td>
                    <td className="py-3 px-4">5</td>
                    <td className="py-3 px-4">TRF-005</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Inventory;
