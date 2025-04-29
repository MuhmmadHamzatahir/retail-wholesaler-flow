
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Package, Users, AlertCircle, TrendingUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/services/productService';
import { getCustomers } from '@/services/customerService';
import { getInvoices } from '@/services/invoiceService';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const { data: products, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts
  });
  
  const { data: customers, isLoading: isLoadingCustomers } = useQuery({
    queryKey: ['customers'],
    queryFn: getCustomers
  });
  
  const { data: invoices, isLoading: isLoadingInvoices } = useQuery({
    queryKey: ['invoices'],
    queryFn: getInvoices
  });

  // Calculate sales data from invoices
  const salesData = React.useMemo(() => {
    if (!invoices) return { today: 0, week: 0, month: 0, year: 0 };
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setMonth(today.getMonth() - 1);
    const yearAgo = new Date(today);
    yearAgo.setFullYear(today.getFullYear() - 1);
    
    return {
      today: invoices.filter(inv => new Date(inv.createdAt) >= today).reduce((sum, inv) => sum + inv.total, 0),
      week: invoices.filter(inv => new Date(inv.createdAt) >= weekAgo).reduce((sum, inv) => sum + inv.total, 0),
      month: invoices.filter(inv => new Date(inv.createdAt) >= monthAgo).reduce((sum, inv) => sum + inv.total, 0),
      year: invoices.filter(inv => new Date(inv.createdAt) >= yearAgo).reduce((sum, inv) => sum + inv.total, 0),
    };
  }, [invoices]);
  
  // Get low stock items
  const lowStockItems = React.useMemo(() => {
    if (!products) return [];
    return products
      .filter(product => product.inStock < product.minStockLevel)
      .map(product => ({ 
        id: product.id, 
        name: product.name, 
        inStock: product.inStock, 
        minLevel: product.minStockLevel 
      }))
      .slice(0, 5);
  }, [products]);
  
  // Get recent invoices
  const recentInvoices = React.useMemo(() => {
    if (!invoices) return [];
    return [...invoices]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 4)
      .map(invoice => ({
        id: invoice.id,
        customer: invoice.customerName,
        total: invoice.total,
        status: invoice.status,
        date: invoice.createdAt.toLocaleDateString()
      }));
  }, [invoices]);

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
                  {isLoadingInvoices ? (
                    <Skeleton className="h-8 w-24" />
                  ) : (
                    <h3 className="text-2xl font-bold">${salesData.today.toFixed(2)}</h3>
                  )}
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
                  {isLoadingInvoices ? (
                    <Skeleton className="h-8 w-24" />
                  ) : (
                    <h3 className="text-2xl font-bold">${salesData.month.toFixed(2)}</h3>
                  )}
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
                  {isLoadingProducts ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <h3 className="text-2xl font-bold">{lowStockItems.length}</h3>
                  )}
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
                  {isLoadingCustomers ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <h3 className="text-2xl font-bold">{customers?.length || 0}</h3>
                  )}
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
            {isLoadingProducts ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-2 w-full" />
                  </div>
                ))}
              </div>
            ) : lowStockItems.length > 0 ? (
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
            ) : (
              <p className="text-center py-6 text-muted-foreground">No low stock items found.</p>
            )}
          </CardContent>
        </Card>
        
        {/* Recent Invoices */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Recent Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingInvoices ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="w-full h-10" />
                ))}
              </div>
            ) : recentInvoices.length > 0 ? (
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
                        <td className="py-2 px-3 text-sm font-medium">{invoice.id.slice(0, 8)}</td>
                        <td className="py-2 px-3 text-sm">{invoice.customer}</td>
                        <td className="py-2 px-3 text-sm text-gray-500">{invoice.date}</td>
                        <td className="py-2 px-3 text-sm">${invoice.total.toFixed(2)}</td>
                        <td className="py-2 px-3">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                            ${invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                            invoice.status === 'pending' || invoice.status === 'sent' ? 'bg-yellow-100 text-yellow-800' :
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
            ) : (
              <p className="text-center py-6 text-muted-foreground">No invoices found.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Index;
