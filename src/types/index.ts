
// Product Types
export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  cost: number;
  attributes: Record<string, string>; // e.g., { "size": "XL", "color": "Red" }
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  barcode: string;
  image?: string;
  retailPrice: number;
  wholesalePrice: number;
  cost: number;
  taxRate: number;
  inStock: number;
  minStockLevel: number;
  variants: ProductVariant[];
  createdAt: Date;
  updatedAt: Date;
}

// Inventory Types
export interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  location: string;
  quantity: number;
  lastUpdated: Date;
}

export interface StockMovement {
  id: string;
  productId: string;
  type: "in" | "out" | "transfer" | "adjustment";
  quantity: number;
  fromLocation?: string;
  toLocation?: string;
  reference: string;
  date: Date;
  notes?: string;
}

// Customer Types
export interface Customer {
  id: string;
  type: "retail" | "wholesale" | "vip";
  name: string;
  company?: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  creditLimit?: number;
  currentBalance: number;
  createdAt: Date;
}

// Quotation & Invoice Types
export interface QuotationItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  tax: number;
  total: number;
}

export interface Quotation {
  id: string;
  customerId: string;
  customerName: string;
  items: QuotationItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  notes?: string;
  expiryDate: Date;
  status: "draft" | "sent" | "accepted" | "expired" | "converted";
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceItem extends QuotationItem {
  // Inherits all properties from QuotationItem
}

export interface Invoice {
  id: string;
  customerId: string;
  customerName: string;
  quotationId?: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  notes?: string;
  paymentTerms: string;
  dueDate: Date;
  status: "draft" | "sent" | "partial" | "paid" | "overdue" | "void";
  createdAt: Date;
  updatedAt: Date;
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "cashier" | "inventory";
  permissions: string[];
  lastLogin?: Date;
}

// Dashboard Types
export interface SalesSummary {
  today: number;
  week: number;
  month: number;
  year: number;
}

export interface TopProduct {
  id: string;
  name: string;
  quantity: number;
  revenue: number;
}

export interface DashboardData {
  salesSummary: SalesSummary;
  lowStockItems: InventoryItem[];
  topProducts: TopProduct[];
  recentInvoices: Invoice[];
  pendingQuotations: Quotation[];
}
