import { Package, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Crate } from '@/types/pos';
import { getAvailableQuantity, getDaysUntilExpiry } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface InventoryOverviewProps {
  crates: Crate[];
}

const InventoryOverview = ({ crates }: InventoryOverviewProps) => {
  const getStatusBadge = (crate: Crate) => {
    const days = getDaysUntilExpiry(crate.expiryDate);
    if (days < 0) return <Badge variant="expired">Expired</Badge>;
    if (days <= 2) return <Badge variant="expiring">Expiring Soon</Badge>;
    if (crate.status === 'low_stock') return <Badge variant="low-stock">Low Stock</Badge>;
    return <Badge variant="active">Active</Badge>;
  };



  // Sort by urgency: expired first, then expiring soon, then low stock
  const sortedCrates = [...crates].sort((a, b) => {
    const daysA = getDaysUntilExpiry(a.expiryDate);
    const daysB = getDaysUntilExpiry(b.expiryDate);
    return daysA - daysB;
  }).slice(0, 5);

  return (
    <div className="rounded-xl border bg-card shadow-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Inventory Status</h3>
        </div>
        <Badge variant="secondary">{crates.length} crates</Badge>
      </div>
      <div className="divide-y divide-border">
        {sortedCrates.map((crate) => {
          const available = getAvailableQuantity(crate);
          const percent = (available / crate.quantity) * 100;
          const days = getDaysUntilExpiry(crate.expiryDate);

          return (
            <div
              key={crate.id}
              className={cn(
                'px-5 py-3 transition-colors',
                days < 0 && 'bg-danger/5 opacity-60'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-medium text-foreground">{crate.productName}</p>
                  <p className="text-xs text-muted-foreground">
                    {crate.id} • {available} / {crate.quantity} {crate.unit}
                  </p>
                </div>
                {getStatusBadge(crate)}
              </div>
              <div className="flex items-center gap-3">
                <Progress
                  value={percent}
                  className="h-1.5 flex-1"
                  indicatorClassName={
                    percent <= 10 ? 'bg-danger' :
                      percent <= 30 ? 'bg-warning' :
                        'bg-success'
                  }
                />
                <span className={cn(
                  'text-xs font-medium min-w-[40px] text-right',
                  percent <= 10 ? 'text-danger' :
                    percent <= 30 ? 'text-warning' :
                      'text-success'
                )}>
                  {Math.round(percent)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="border-t border-border px-5 py-3">
        <Link to="/inventory">
          <Button variant="ghost" className="w-full text-primary hover:text-primary group">
            View Full Inventory
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default InventoryOverview;
