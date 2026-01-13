import { AlertTriangle, Clock, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExpiryAlert } from '@/types/pos';
import { cn } from '@/lib/utils';

interface ExpiryAlertCardProps {
  alerts: ExpiryAlert[];
}

const ExpiryAlertCard = ({ alerts }: ExpiryAlertCardProps) => {
  const getStatusIcon = (status: ExpiryAlert['status']) => {
    switch (status) {
      case 'expired':
        return <XCircle className="h-4 w-4" />;
      case 'urgent':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: ExpiryAlert['status'], days: number) => {
    switch (status) {
      case 'expired':
        return <Badge variant="expired">Expired</Badge>;
      case 'urgent':
        return <Badge variant="expiring">Expires in {days} day{days > 1 ? 's' : ''}</Badge>;
      default:
        return <Badge variant="warning">Expires in {days} days</Badge>;
    }
  };

  return (
    <div className="rounded-xl border bg-card shadow-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-warning" />
          <h3 className="font-semibold text-foreground">Expiry Alerts</h3>
        </div>
        <Badge variant="danger">{alerts.length} items</Badge>
      </div>
      <div className="divide-y divide-border">
        {alerts.map((alert) => (
          <div
            key={alert.crateId}
            className={cn(
              'flex items-center justify-between px-5 py-3 transition-colors',
              alert.status === 'expired' && 'bg-danger/5',
              alert.status === 'urgent' && 'bg-warning/5'
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                'flex h-8 w-8 items-center justify-center rounded-lg',
                alert.status === 'expired' ? 'bg-danger/10 text-danger' :
                alert.status === 'urgent' ? 'bg-warning/10 text-warning' :
                'bg-muted text-muted-foreground'
              )}>
                {getStatusIcon(alert.status)}
              </div>
              <div>
                <p className="font-medium text-foreground">{alert.productName}</p>
                <p className="text-xs text-muted-foreground">
                  Crate: {alert.crateId} • {alert.quantity} units remaining
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {getStatusBadge(alert.status, alert.daysUntilExpiry)}
              {alert.status === 'expired' && (
                <Button variant="destructive" size="sm">
                  Mark for Removal
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-border px-5 py-3">
        <Button variant="ghost" className="w-full text-primary hover:text-primary">
          View All Alerts
        </Button>
      </div>
    </div>
  );
};

export default ExpiryAlertCard;
