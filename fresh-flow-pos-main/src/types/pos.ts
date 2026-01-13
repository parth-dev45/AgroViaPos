export interface Crate {
  id: string;
  productName: string;
  productCategory: string;
  quantity: number;
  quantitySold: number;
  unit: 'kg' | 'units' | 'bundles';
  batchId: string;
  expiryDate: Date;
  receivedDate: Date;
  pricePerUnit: number;
  status: 'active' | 'low_stock' | 'expiring_soon' | 'expired' | 'sold_out';
}

export interface CartItem {
  crateId: string;
  productName: string;
  quantity: number;
  pricePerUnit: number;
  unit: string;
  total: number;
}

export interface Bill {
  id: string;
  billCode: string;
  items: CartItem[];
  total: number;
  timestamp: Date;
  paymentMethod: 'cash' | 'card' | 'upi';
  crateIds: string[];
  batchIds: string[];
}

export interface ExpiryAlert {
  crateId: string;
  productName: string;
  expiryDate: Date;
  daysUntilExpiry: number;
  quantity: number;
  status: 'warning' | 'urgent' | 'expired';
}

export interface DailySummary {
  totalSales: number;
  totalTransactions: number;
  itemsSold: number;
  expiredItems: number;
  unsoldItems: number;
  complianceScore: number;
}

export interface ComplianceMetric {
  label: string;
  value: number;
  target: number;
  status: 'good' | 'warning' | 'critical';
}
