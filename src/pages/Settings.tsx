
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';

const Settings = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="taxes">Taxes</TabsTrigger>
            <TabsTrigger value="invoice">Invoice</TabsTrigger>
            <TabsTrigger value="users">Users & Permissions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
                <CardDescription>
                  Update your business details that appear on invoices and quotations.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input id="businessName" defaultValue="Your Business Name" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" defaultValue="(555) 123-4567" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue="info@yourbusiness.com" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" defaultValue="www.yourbusiness.com" />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" defaultValue="123 Business Street" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" defaultValue="Business City" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="state">State/Province</Label>
                    <Input id="state" defaultValue="CA" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="zip">Postal/ZIP Code</Label>
                    <Input id="zip" defaultValue="90001" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" defaultValue="United States" />
                  </div>
                </div>
                
                <Button className="mt-6 bg-pos-blue hover:bg-pos-lightBlue">Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="taxes">
            <Card>
              <CardHeader>
                <CardTitle>Tax Settings</CardTitle>
                <CardDescription>
                  Configure tax rates and settings for your business.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Enable Tax Calculation</h4>
                      <p className="text-sm text-muted-foreground">Turn on to calculate taxes on invoices and quotations</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Show Tax Details</h4>
                      <p className="text-sm text-muted-foreground">Display detailed tax breakdown on invoices</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Prices Include Tax</h4>
                      <p className="text-sm text-muted-foreground">Product prices are tax-inclusive by default</p>
                    </div>
                    <Switch />
                  </div>
                </div>
                
                <div className="border-t pt-6 mt-6">
                  <h4 className="font-medium mb-4">Tax Rates</h4>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-4">
                        <Label htmlFor="taxName">Name</Label>
                        <Input id="taxName" defaultValue="Sales Tax" />
                      </div>
                      <div className="col-span-3">
                        <Label htmlFor="taxRate">Rate (%)</Label>
                        <Input id="taxRate" defaultValue="10" />
                      </div>
                      <div className="col-span-4">
                        <Label htmlFor="taxRegion">Region</Label>
                        <Input id="taxRegion" defaultValue="Default" />
                      </div>
                      <div className="col-span-1 flex items-end">
                        <Button variant="ghost" size="sm" className="h-10">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full mt-2">
                      <Plus className="mr-2 h-4 w-4" /> Add Tax Rate
                    </Button>
                  </div>
                </div>
                
                <Button className="mt-6 bg-pos-blue hover:bg-pos-lightBlue">Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="invoice">
            <Card>
              <CardHeader>
                <CardTitle>Invoice Settings</CardTitle>
                <CardDescription>
                  Customize invoices and quotations for your business.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="invoicePrefix">Invoice Prefix</Label>
                    <Input id="invoicePrefix" defaultValue="INV-" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="quotePrefix">Quotation Prefix</Label>
                    <Input id="quotePrefix" defaultValue="QUO-" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="invoiceStartNumber">Invoice Start Number</Label>
                    <Input id="invoiceStartNumber" defaultValue="001" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="quoteStartNumber">Quotation Start Number</Label>
                    <Input id="quoteStartNumber" defaultValue="001" />
                  </div>
                </div>
                
                <div className="space-y-4 pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Show Business Logo</h4>
                      <p className="text-sm text-muted-foreground">Display your logo on invoices and quotes</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Show Payment Terms</h4>
                      <p className="text-sm text-muted-foreground">Include payment terms on documents</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Show Bank Details</h4>
                      <p className="text-sm text-muted-foreground">Include your bank account details on invoices</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                
                <div className="space-y-2 pt-6">
                  <Label htmlFor="invoiceNotes">Default Invoice Notes</Label>
                  <Textarea 
                    id="invoiceNotes" 
                    className="min-h-32" 
                    defaultValue="Thank you for your business. Please process payment within the specified terms." 
                  />
                </div>
                
                <Button className="mt-6 bg-pos-blue hover:bg-pos-lightBlue">Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Admin User</CardTitle>
                <CardDescription>
                  Manage your admin account settings.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="adminName">Name</Label>
                    <Input id="adminName" defaultValue="Admin User" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="adminEmail">Email</Label>
                    <Input id="adminEmail" type="email" defaultValue="admin@yourbusiness.com" />
                  </div>
                </div>
                
                <div className="space-y-2 pt-4">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                </div>
                
                <Button className="mt-6 bg-pos-blue hover:bg-pos-lightBlue">Update Profile</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

// Missing component import
import { Trash, Plus } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

export default Settings;
