import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  AlertTriangle,
  XCircle,
  Clock,
  Trash2,
  RefreshCcw,
  Bell,
  BellOff,
  Calendar,
} from 'lucide-react';
import { mockExpiryAlerts, mockCrates, getDaysUntilExpiry } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const Alerts = () => {
  // Get all crates with expiry concerns
  const allExpiryCrates = mockCrates
    .map(crate => ({
      ...crate,
      daysUntilExpiry: getDaysUntilExpiry(crate.expiryDate),
      available: crate.quantity - crate.quantitySold,
    }))
    .filter(crate => crate.daysUntilExpiry <= 7)
    .sort((a, b) => a.daysUntilExpiry - b.daysUntilExpiry);

  const expiredCrates = allExpiryCrates.filter(c => c.daysUntilExpiry < 0);
  const urgentCrates = allExpiryCrates.filter(c => c.daysUntilExpiry >= 0 && c.daysUntilExpiry <= 2);
  const warningCrates = allExpiryCrates.filter(c => c.daysUntilExpiry > 2 && c.daysUntilExpiry <= 7);

  const AlertCard = ({ 
    crate, 
    type 
  }: { 
    crate: typeof allExpiryCrates[0]; 
    type: 'expired' | 'urgent' | 'warning' 
  }) => {
    const config = {
      expired: {
        bg: 'bg-danger/5 border-danger/30',
        icon: XCircle,
        iconColor: 'text-danger',
        title: 'EXPIRED - Sales Blocked',
      },
      urgent: {
        bg: 'bg-warning/5 border-warning/30',
        icon: AlertTriangle,
        iconColor: 'text-warning',
        title: `Expires ${crate.daysUntilExpiry === 0 ? 'Today' : crate.daysUntilExpiry === 1 ? 'Tomorrow' : `in ${crate.daysUntilExpiry} days`}`,
      },
      warning: {
        bg: 'bg-accent border-border',
        icon: Clock,
        iconColor: 'text-muted-foreground',
        title: `Expires in ${crate.daysUntilExpiry} days`,
      },
    };

    const { bg, icon: Icon, iconColor, title } = config[type];

    return (
      <Card className={cn('p-4 transition-all duration-200', bg)}>
        <div className="flex items-start gap-4">
          <div className={cn('rounded-lg p-2.5', type === 'expired' ? 'bg-danger/10' : type === 'urgent' ? 'bg-warning/10' : 'bg-muted')}>
            <Icon className={cn('h-5 w-5', iconColor)} />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-foreground">{crate.productName}</h4>
                <p className="text-sm text-muted-foreground">{title}</p>
              </div>
              {type === 'expired' ? (
                <Badge variant="expired" className="pulse-danger">Blocked</Badge>
              ) : type === 'urgent' ? (
                <Badge variant="expiring" className="pulse-warning">Urgent</Badge>
              ) : (
                <Badge variant="warning">Warning</Badge>
              )}
            </div>
            <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Crate ID</p>
                <p className="font-mono font-medium">{crate.id}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Remaining</p>
                <p className="font-medium">{crate.available} {crate.unit}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Expiry Date</p>
                <p className="font-medium">{format(crate.expiryDate, 'dd MMM yyyy')}</p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              {type === 'expired' ? (
                <>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="mr-2 h-3 w-3" />
                    Mark for Disposal
                  </Button>
                  <Button variant="outline" size="sm">
                    Request Pickup
                  </Button>
                </>
              ) : type === 'urgent' ? (
                <>
                  <Button variant="outline" size="sm" className="border-warning/50 text-warning hover:bg-warning/10">
                    Apply Discount
                  </Button>
                  <Button variant="ghost" size="sm">
                    <BellOff className="mr-2 h-3 w-3" />
                    Snooze Alert
                  </Button>
                </>
              ) : (
                <Button variant="ghost" size="sm">
                  <Bell className="mr-2 h-3 w-3" />
                  Set Reminder
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <AppLayout title="Expiry Alerts" subtitle="Manage product expiry and compliance">
      <div className="space-y-6 animate-fade-in">
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-5 bg-danger/5 border-danger/20">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-danger/10 p-2.5">
                <XCircle className="h-5 w-5 text-danger" />
              </div>
              <div>
                <p className="text-2xl font-bold text-danger">{expiredCrates.length}</p>
                <p className="text-sm text-muted-foreground">Expired Items</p>
              </div>
            </div>
            <p className="mt-2 text-xs text-danger/80">
              Sales blocked • Requires immediate action
            </p>
          </Card>
          <Card className="p-5 bg-warning/5 border-warning/20">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-warning/10 p-2.5">
                <AlertTriangle className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-warning">{urgentCrates.length}</p>
                <p className="text-sm text-muted-foreground">Expiring Soon</p>
              </div>
            </div>
            <p className="mt-2 text-xs text-warning/80">
              Within 48 hours • Consider discounting
            </p>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-muted p-2.5">
                <Clock className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{warningCrates.length}</p>
                <p className="text-sm text-muted-foreground">Upcoming Expiry</p>
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Within 7 days • Monitor closely
            </p>
          </Card>
        </div>

        {/* Expired Section */}
        {expiredCrates.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-danger" />
                <h2 className="text-lg font-semibold text-foreground">Expired Items</h2>
                <Badge variant="danger">{expiredCrates.length}</Badge>
              </div>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                Mark All for Disposal
              </Button>
            </div>
            <div className="space-y-3">
              {expiredCrates.map(crate => (
                <AlertCard key={crate.id} crate={crate} type="expired" />
              ))}
            </div>
          </div>
        )}

        {/* Urgent Section */}
        {urgentCrates.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <h2 className="text-lg font-semibold text-foreground">Expiring Within 48 Hours</h2>
              <Badge variant="warning">{urgentCrates.length}</Badge>
            </div>
            <div className="space-y-3">
              {urgentCrates.map(crate => (
                <AlertCard key={crate.id} crate={crate} type="urgent" />
              ))}
            </div>
          </div>
        )}

        {/* Warning Section */}
        {warningCrates.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold text-foreground">Upcoming Expiry (3-7 days)</h2>
              <Badge variant="muted">{warningCrates.length}</Badge>
            </div>
            <div className="space-y-3">
              {warningCrates.map(crate => (
                <AlertCard key={crate.id} crate={crate} type="warning" />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {allExpiryCrates.length === 0 && (
          <Card className="p-12 text-center">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground/30" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">No Expiry Alerts</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              All inventory is within safe expiry range
            </p>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default Alerts;
