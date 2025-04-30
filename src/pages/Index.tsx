import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, DollarSign, Users, Package, FileText } from 'lucide-react';
import { useInvoices } from '@/hooks/useInvoices';
import { useCustomers } from '@/hooks/useCustomers';
import { useProducts } from '@/hooks/useProducts';
import { useQuotations } from '@/hooks/useQuotations';

const Index = () => {
  const { invoices, isLoading: isLoadingInvoices } = useInvoices();
  const { customers, isLoading: isLoadingCustomers } = useCustomers();
  const { products, isLoading: isLoadingProducts } = useProducts();
  const { quotations, isLoading: isLoadingQuotations } = useQuotations();
  
  const [salesStats, setSalesStats] = useState({
    today: 0,
    week: 0,
    month: 0
  });
  
  useEffect(() => {
    if (invoices && invoices.length > 0) {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
      const monthStart = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      
      const todaySales = invoices
        .filter(invoice => new Date(invoice.createdAt) >= todayStart && 
                          (invoice.status === "sent" || invoice.status === "partial" || invoice.status === "paid"))
        .reduce((sum, invoice) => sum + invoice.total, 0);
        
      const weekSales = invoices
        .filter(invoice => new Date(invoice.createdAt) >= weekStart && 
                          (invoice.status === "sent" || invoice.status === "partial" || invoice.status === "paid"))
        .reduce((sum, invoice) => sum + invoice.total, 0);
        
      const monthSales = invoices
        .filter(invoice => new Date(invoice.createdAt) >= monthStart && 
                          (invoice.status === "sent" || invoice.status === "partial" || invoice.status === "paid"))
        .reduce((sum, invoice) => sum + invoice.total, 0);
      
      setSalesStats({
        today: todaySales,
        week: weekSales,
        month: monthSales
      });
    }
  }, [invoices]);
  
  // Get low stock products
  const lowStockProducts = products?.filter(product => product.inStock <= product.minStockLevel) || [];
  
  // Get pending quotations
  const pendingQuotations = quotations?.filter(quotation => 
    quotation.status === "sent" || quotation.status === "draft") || [];
  
  // Get overdue invoices
  const overdueInvoices = invoices?.filter(invoice => 
    invoice.status === "overdue" || 
    (invoice.status === "sent" && new Date(invoice.dueDate) < new Date())) || [];

  return (
    <MainLayout>
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Today's Sales
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${salesStats.today.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from yesterday
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Weekly Sales
              </CardTitle>
              <ArrowUp className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${salesStats.week.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                +15% from last week
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Monthly Sales
              </CardTitle>
              <ArrowUp className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${salesStats.month.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Customers
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{customers?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                +7 new this month
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Low Stock Products */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Low Stock Products</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingProducts ? (
                <p>Loading...</p>
              ) : lowStockProducts.length > 0 ? (
                <div className="space-y-4">
                  {lowStockProducts.slice(0, 5).map(product => (
                    <div key={product.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {product.inStock} in stock
                        </p>
                      </div>
                      <div className={`px-2 py-1 rounded-md text-xs font-medium ${
                        product.inStock === 0 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {product.inStock === 0 ? 'Out of Stock' : 'Low Stock'}
                      </div>
                    </div>
                  ))}
                  
                  {lowStockProducts.length > 5 && (
                    <Button variant="link" className="w-full">
                      View all {lowStockProducts.length} items
                    </Button>
                  )}
                </div>
              ) : (
                <p className="text-center py-4 text-muted-foreground">
                  No low stock products
                </p>
              )}
            </CardContent>
          </Card>
          
          {/* Pending Quotations */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Pending Quotations</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingQuotations ? (
                <p>Loading...</p>
              ) : pendingQuotations.length > 0 ? (
                <div className="space-y-4">
                  {pendingQuotations.slice(0, 5).map(quotation => (
                    <div key={quotation.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{quotation.customerName}</p>
                        <p className="text-sm text-muted-foreground">
                          ${quotation.total.toFixed(2)} • {quotation.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                      <div className={`px-2 py-1 rounded-md text-xs font-medium ${
                        quotation.status === 'draft' 
                          ? 'bg-gray-100 text-gray-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {quotation.status.charAt(0).toUpperCase() + quotation.status.slice(1)}
                      </div>
                    </div>
                  ))}
                  
                  {pendingQuotations.length > 5 && (
                    <Button variant="link" className="w-full">
                      View all {pendingQuotations.length} quotations
                    </Button>
                  )}
                </div>
              ) : (
                <p className="text-center py-4 text-muted-foreground">
                  No pending quotations
                </p>
              )}
            </CardContent>
          </Card>
          
          {/* Overdue Invoices */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Overdue Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingInvoices ? (
                <p>Loading...</p>
              ) : overdueInvoices.length > 0 ? (
                <div className="space-y-4">
                  {overdueInvoices.slice(0, 5).map(invoice => (
                    <div key={invoice.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{invoice.customerName}</p>
                        <p className="text-sm text-muted-foreground">
                          ${invoice.total.toFixed(2)} • Due: {invoice.dueDate.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="px-2 py-1 rounded-md text-xs font-medium bg-red-100 text-red-800">
                        {invoice.status === "overdue" ? "Overdue" : "Past Due"}
                      </div>
                    </div>
                  ))}
                  
                  {overdueInvoices.length > 5 && (
                    <Button variant="link" className="w-full">
                      View all {overdueInvoices.length} invoices
                    </Button>
                  )}
                </div>
              ) : (
                <p className="text-center py-4 text-muted-foreground">
                  No overdue invoices
                </p>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Button className="bg-pos-blue hover:bg-pos-lightBlue">
              <Package className="mr-2 h-4 w-4" /> New Product
            </Button>
            <Button className="bg-pos-blue hover:bg-pos-lightBlue">
              <Users className="mr-2 h-4 w-4" /> New Customer
            </Button>
            <Button className="bg-pos-blue hover:bg-pos-lightBlue">
              <FileText className="mr-2 h-4 w-4" /> New Invoice
            </Button>
            <Button className="bg-pos-blue hover:bg-pos-lightBlue">
              <FileText className="mr-2 h-4 w-4" /> New Quotation
            </Button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Index;
