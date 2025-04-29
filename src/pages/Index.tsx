
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Package, Users, AlertCircle, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const Index = () => {
  // Mock data for dashboard
  const salesData = {
    today: 1250.00,
    week: 8750.50,
    month: 32450.75,
    year: 285000.00
  };
  
  const lowStockItems = [
    { id: '1', name: 'Premium T-Shirt', inStock: 5, minLevel: 10 },
    { id: '2', name: 'Leather Wallet', inStock: 3, minLevel: 15 },
    { id: '3', name: 'Wireless Headphones', inStock: 2, minLevel: 8 }
  ];
  
  const recentInvoices = [
    { id: 'INV-001', customer: 'Acme Corp', total: 1250.00, status: 'paid', date: '2025-04-28' },
    { id: 'INV-002', customer: 'Tech Solutions', total: 3450.75, status: 'pending', date: '2025-04-27' },
    { id: 'INV-003', customer: 'Global Retail', total: 850.25, status: 'overdue', date: '2025-04-25' },
    { id: 'INV-004', customer: 'City Store', total: 1675.50, status: 'paid', date: '2025-04-24' }
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg mr-4">
                  <DollarSign className="h-6 w-6 text-pos-blue" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Daily Sales</p>
                  <h3 className="text-2xl font-bold">${salesData.today.toFixed(2)}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg mr-4">
                  <TrendingUp className="h-6 w-6 text-pos-success" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Monthly Sales</p>
                  <h3 className="text-2xl font-bold">${salesData.month.toFixed(2)}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-amber-100 rounded-lg mr-4">
                  <Package className="h-6 w-6 text-pos-warning" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Low Stock Items</p>
                  <h3 className="text-2xl font-bold">{lowStockItems.length}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg mr-4">
                  <Users className="h-6 w-6 text-pos-blue" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Customers</p>
                  <h3 className="text-2xl font-bold">124</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Low Stock Warning */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-pos-warning" />
              Low Stock Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockItems.map(item => (
                <div key={item.id} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-muted-foreground">{item.inStock}/{item.minLevel}</span>
                  </div>
                  <Progress
                    value={(item.inStock / item.minLevel) * 100}
                    className={
                      item.inStock < item.minLevel * 0.5
                        ? "h-2 bg-secondary [&>div]:bg-red-500"
                        : "h-2 bg-secondary [&>div]:bg-amber-500"
                    }
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Recent Invoices */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Recent Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentInvoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 px-3 text-sm font-medium">{invoice.id}</td>
                      <td className="py-2 px-3 text-sm">{invoice.customer}</td>
                      <td className="py-2 px-3 text-sm text-gray-500">{invoice.date}</td>
                      <td className="py-2 px-3 text-sm">${invoice.total.toFixed(2)}</td>
                      <td className="py-2 px-3">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                          ${invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                          invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'}`}
                        >
                          {invoice.status}
                        </span>
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

export default Index;
