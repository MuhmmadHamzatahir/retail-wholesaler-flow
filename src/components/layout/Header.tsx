
import React from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { User, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

const getPageTitle = (pathname: string): string => {
  switch (pathname) {
    case '/': return 'Dashboard';
    case '/products': return 'Products';
    case '/inventory': return 'Inventory';
    case '/quotations': return 'Quotations';
    case '/invoices': return 'Invoices';
    case '/customers': return 'Customers';
    case '/settings': return 'Settings';
    default: return 'POS System';
  }
};

const Header = () => {
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);
  
  return (
    <header className="bg-white h-16 border-b border-gray-200 px-6 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-800">{pageTitle}</h1>
      
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon">
          <Bell size={20} className="text-gray-600" />
        </Button>
        
        <div className="flex items-center space-x-2">
          <div className="bg-pos-blue text-white p-2 rounded-full">
            <User size={20} />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
