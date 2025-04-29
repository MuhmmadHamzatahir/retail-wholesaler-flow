
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { 
  BarChart, 
  Package, 
  Box, 
  FileText, 
  FileCheck,
  Users, 
  Settings, 
  Menu, 
  X 
} from 'lucide-react';

const menuItems = [
  { title: "Dashboard", icon: BarChart, path: "/" },
  { title: "Products", icon: Package, path: "/products" },
  { title: "Inventory", icon: Box, path: "/inventory" },
  { title: "Quotations", icon: FileText, path: "/quotations" },
  { title: "Invoices", icon: FileCheck, path: "/invoices" },
  { title: "Customers", icon: Users, path: "/customers" },
  { title: "Settings", icon: Settings, path: "/settings" },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <div className={cn(
      "h-screen bg-pos-blue text-white transition-all duration-300 flex flex-col", 
      collapsed ? "w-20" : "w-64"
    )}>
      <div className="p-4 flex items-center justify-between border-b border-white/10">
        {!collapsed && <h1 className="text-xl font-bold">POS System</h1>}
        <button 
          onClick={() => setCollapsed(!collapsed)} 
          className={cn("p-2 rounded-md hover:bg-white/10", collapsed ? "mx-auto" : "")}
        >
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>
      
      <nav className="flex-1 py-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.title}>
                <Link 
                  to={item.path} 
                  className={cn(
                    "flex items-center px-4 py-3 hover:bg-white/10 transition-colors",
                    isActive ? "bg-white/20 font-medium" : "",
                    collapsed ? "justify-center" : ""
                  )}
                >
                  <item.icon size={20} className={collapsed ? "" : "mr-3"} />
                  {!collapsed && <span>{item.title}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 text-xs text-center text-white/60">
        {!collapsed && <span>POS System v1.0</span>}
      </div>
    </div>
  );
};

export default Sidebar;
