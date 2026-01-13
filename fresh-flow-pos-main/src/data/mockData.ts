import { Crate, Bill, ExpiryAlert, DailySummary, ComplianceMetric } from '@/types/pos';

const today = new Date();
const addDays = (days: number) => new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
const subDays = (days: number) => new Date(today.getTime() - days * 24 * 60 * 60 * 1000);

export const mockCrates: Crate[] = [
  {
    id: 'CRT-001',
    productName: 'Fresh Tomatoes',
    productCategory: 'Vegetables',
    quantity: 20,
    quantitySold: 8,
    unit: 'kg',
    batchId: 'BAT-2025-0107-001',
    expiryDate: addDays(5),
    receivedDate: subDays(2),
    pricePerUnit: 45,
    status: 'active',
  },
  {
    id: 'CRT-002',
    productName: 'Green Spinach',
    productCategory: 'Leafy Greens',
    quantity: 15,
    quantitySold: 12,
    unit: 'bundles',
    batchId: 'BAT-2025-0107-002',
    expiryDate: addDays(1),
    receivedDate: subDays(3),
    pricePerUnit: 25,
    status: 'expiring_soon',
  },
  {
    id: 'CRT-003',
    productName: 'Carrots',
    productCategory: 'Root Vegetables',
    quantity: 25,
    quantitySold: 5,
    unit: 'kg',
    batchId: 'BAT-2025-0107-003',
    expiryDate: addDays(7),
    receivedDate: subDays(1),
    pricePerUnit: 35,
    status: 'active',
  },
  {
    id: 'CRT-004',
    productName: 'Potatoes',
    productCategory: 'Root Vegetables',
    quantity: 50,
    quantitySold: 30,
    unit: 'kg',
    batchId: 'BAT-2025-0106-001',
    expiryDate: addDays(14),
    receivedDate: subDays(3),
    pricePerUnit: 28,
    status: 'active',
  },
  {
    id: 'CRT-005',
    productName: 'Fresh Coriander',
    productCategory: 'Herbs',
    quantity: 10,
    quantitySold: 10,
    unit: 'bundles',
    batchId: 'BAT-2025-0105-002',
    expiryDate: subDays(1),
    receivedDate: subDays(5),
    pricePerUnit: 15,
    status: 'expired',
  },
  {
    id: 'CRT-006',
    productName: 'Onions',
    productCategory: 'Vegetables',
    quantity: 40,
    quantitySold: 22,
    unit: 'kg',
    batchId: 'BAT-2025-0107-004',
    expiryDate: addDays(21),
    receivedDate: subDays(2),
    pricePerUnit: 32,
    status: 'active',
  },
  {
    id: 'CRT-007',
    productName: 'Broccoli',
    productCategory: 'Vegetables',
    quantity: 12,
    quantitySold: 11,
    unit: 'units',
    batchId: 'BAT-2025-0106-003',
    expiryDate: addDays(2),
    receivedDate: subDays(4),
    pricePerUnit: 55,
    status: 'low_stock',
  },
  {
    id: 'CRT-008',
    productName: 'Bell Peppers',
    productCategory: 'Vegetables',
    quantity: 18,
    quantitySold: 6,
    unit: 'kg',
    batchId: 'BAT-2025-0107-005',
    expiryDate: addDays(4),
    receivedDate: subDays(1),
    pricePerUnit: 120,
    status: 'active',
  },
];

export const mockRecentBills: Bill[] = [
  {
    id: 'BILL-001',
    billCode: 'KSK-2025-0107-0042',
    items: [
      { crateId: 'CRT-001', productName: 'Fresh Tomatoes', quantity: 2, pricePerUnit: 45, unit: 'kg', total: 90 },
      { crateId: 'CRT-004', productName: 'Potatoes', quantity: 3, pricePerUnit: 28, unit: 'kg', total: 84 },
    ],
    total: 174,
    timestamp: subDays(0),
    paymentMethod: 'upi',
    crateIds: ['CRT-001', 'CRT-004'],
    batchIds: ['BAT-2025-0107-001', 'BAT-2025-0106-001'],
  },
  {
    id: 'BILL-002',
    billCode: 'KSK-2025-0107-0041',
    items: [
      { crateId: 'CRT-006', productName: 'Onions', quantity: 2, pricePerUnit: 32, unit: 'kg', total: 64 },
    ],
    total: 64,
    timestamp: subDays(0),
    paymentMethod: 'cash',
    crateIds: ['CRT-006'],
    batchIds: ['BAT-2025-0107-004'],
  },
  {
    id: 'BILL-003',
    billCode: 'KSK-2025-0107-0040',
    items: [
      { crateId: 'CRT-002', productName: 'Green Spinach', quantity: 2, pricePerUnit: 25, unit: 'bundles', total: 50 },
      { crateId: 'CRT-003', productName: 'Carrots', quantity: 1, pricePerUnit: 35, unit: 'kg', total: 35 },
      { crateId: 'CRT-008', productName: 'Bell Peppers', quantity: 0.5, pricePerUnit: 120, unit: 'kg', total: 60 },
    ],
    total: 145,
    timestamp: subDays(0),
    paymentMethod: 'card',
    crateIds: ['CRT-002', 'CRT-003', 'CRT-008'],
    batchIds: ['BAT-2025-0107-002', 'BAT-2025-0107-003', 'BAT-2025-0107-005'],
  },
];

export const mockExpiryAlerts: ExpiryAlert[] = [
  {
    crateId: 'CRT-005',
    productName: 'Fresh Coriander',
    expiryDate: subDays(1),
    daysUntilExpiry: -1,
    quantity: 0,
    status: 'expired',
  },
  {
    crateId: 'CRT-002',
    productName: 'Green Spinach',
    expiryDate: addDays(1),
    daysUntilExpiry: 1,
    quantity: 3,
    status: 'urgent',
  },
  {
    crateId: 'CRT-007',
    productName: 'Broccoli',
    expiryDate: addDays(2),
    daysUntilExpiry: 2,
    quantity: 1,
    status: 'urgent',
  },
  {
    crateId: 'CRT-008',
    productName: 'Bell Peppers',
    expiryDate: addDays(4),
    daysUntilExpiry: 4,
    quantity: 12,
    status: 'warning',
  },
];

export const mockDailySummary: DailySummary = {
  totalSales: 4825,
  totalTransactions: 32,
  itemsSold: 78,
  expiredItems: 2,
  unsoldItems: 45,
  complianceScore: 96,
};

export const mockComplianceMetrics: ComplianceMetric[] = [
  { label: 'Expired Sales Blocked', value: 100, target: 100, status: 'good' },
  { label: 'Inventory Accuracy', value: 98, target: 95, status: 'good' },
  { label: 'On-time Receipt Scan', value: 94, target: 95, status: 'warning' },
  { label: 'End-of-Day Reconciliation', value: 100, target: 100, status: 'good' },
];

export const getAvailableQuantity = (crate: Crate): number => {
  return crate.quantity - crate.quantitySold;
};

export const getDaysUntilExpiry = (expiryDate: Date): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  return Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

export const canSell = (crate: Crate): { canSell: boolean; reason?: string } => {
  const available = getAvailableQuantity(crate);
  const daysUntilExpiry = getDaysUntilExpiry(crate.expiryDate);

  if (daysUntilExpiry < 0) {
    return { canSell: false, reason: 'Item has expired - selling blocked' };
  }
  if (available <= 0) {
    return { canSell: false, reason: 'No stock available' };
  }
  return { canSell: true };
};
