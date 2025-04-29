
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Filter, Search, Plus, ArrowUp, ArrowDown } from 'lucide-react';
import { useInventory } from '@/hooks/useInventory';
import { Skeleton } from '@/components/ui/skeleton';

const Inventory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { 
    inventory, 
    isLoadingInventory, 
    inventoryError,
    stockMovements,
    isLoadingMovements
  } = useInventory();
  
  // Filter inventory items based on search query
  const filteredItems = inventory.filter(item => 
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
            {isLoadingInventory ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="w-full h-12" />
                ))}
              </div>
            ) : inventoryError ? (
              <div className="text-center py-6 text-red-500">
                <p>Error loading inventory. Please try again.</p>
              </div>
            ) : (
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
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Recent Stock Movements</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingMovements ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="w-full h-12" />
                ))}
              </div>
            ) : (
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
                    {stockMovements && stockMovements.length > 0 ? (
                      stockMovements.slice(0, 10).map(movement => (
                        <tr key={movement.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-gray-500">
                            {movement.date.toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 font-medium">{movement.productId}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium 
                              ${movement.type === 'in' ? 'bg-green-100 text-green-800' :
                              movement.type === 'out' ? 'bg-red-100 text-red-800' :
                              movement.type === 'transfer' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'}`}
                            >
                              {movement.type === 'in' ? 'Stock In' :
                               movement.type === 'out' ? 'Stock Out' :
                               movement.type === 'transfer' ? 'Transfer' :
                               'Adjustment'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {movement.type === 'in' ? '+' : movement.type === 'out' ? '-' : ''}
                            {movement.quantity}
                          </td>
                          <td className="py-3 px-4">{movement.reference}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-4 text-center text-gray-500">
                          No stock movements found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Inventory;
