import { useInventory } from '@/context/InventoryContext';
import AppLayout from '@/components/layout/AppLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import ExpiryAlertCard from '@/components/dashboard/ExpiryAlertCard';
import InventoryOverview from '@/components/dashboard/InventoryOverview';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import ComplianceScore from '@/components/dashboard/ComplianceScore';
import {
  IndianRupee,
  ShoppingBag,
  Package,
  AlertTriangle,
} from 'lucide-react';
import {
  mockRecentBills,
  mockExpiryAlerts,
  mockDailySummary,
  mockComplianceMetrics,
} from '@/data/mockData';

const Dashboard = () => {
  const { crates } = useInventory();

  return (
    <AppLayout title="Dashboard" subtitle="Kiosk Operations Overview">
      <div className="space-y-6 animate-fade-in">
        {/* Stats Row */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Today's Sales"
            value={`₹${mockDailySummary.totalSales.toLocaleString()}`}
            icon={<IndianRupee className="h-5 w-5" />}
            trend={{ value: 12.5, isPositive: true }}
            subtitle="32 transactions completed"
          />
          <StatsCard
            title="Items Sold"
            value={mockDailySummary.itemsSold}
            icon={<ShoppingBag className="h-5 w-5" />}
            trend={{ value: 8.2, isPositive: true }}
            subtitle="Across 8 product categories"
          />
          <StatsCard
            title="Active Inventory"
            value={`${crates.filter(c => c.status !== 'expired').length} crates`}
            icon={<Package className="h-5 w-5" />}
            subtitle={`${mockDailySummary.unsoldItems} units remaining`}
            variant="success"
          />
          <StatsCard
            title="Expiry Alerts"
            value={mockExpiryAlerts.length}
            icon={<AlertTriangle className="h-5 w-5" />}
            subtitle="1 expired, 2 expiring soon"
            variant="warning"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Expiry Alerts */}
          <div className="lg:col-span-2 space-y-6">
            <ExpiryAlertCard alerts={mockExpiryAlerts} />
            <RecentTransactions bills={mockRecentBills} />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <ComplianceScore
              score={mockDailySummary.complianceScore}
              metrics={mockComplianceMetrics}
            />
            <InventoryOverview crates={crates} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
