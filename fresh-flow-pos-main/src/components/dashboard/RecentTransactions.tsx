import { Receipt, CreditCard, Banknote, Smartphone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bill } from '@/types/pos';
import { format } from 'date-fns';

interface RecentTransactionsProps {
  bills: Bill[];
}

const RecentTransactions = ({ bills }: RecentTransactionsProps) => {
  const getPaymentIcon = (method: Bill['paymentMethod']) => {
    switch (method) {
      case 'card':
        return <CreditCard className="h-4 w-4" />;
      case 'cash':
        return <Banknote className="h-4 w-4" />;
      case 'upi':
        return <Smartphone className="h-4 w-4" />;
    }
  };

  const getPaymentLabel = (method: Bill['paymentMethod']) => {
    switch (method) {
      case 'card':
        return 'Card';
      case 'cash':
        return 'Cash';
      case 'upi':
        return 'UPI';
    }
  };

  return (
    <div className="rounded-xl border bg-card shadow-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-2">
          <Receipt className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Recent Transactions</h3>
        </div>
        <Badge variant="secondary">Today</Badge>
      </div>
      <div className="divide-y divide-border">
        {bills.map((bill) => (
          <div
            key={bill.id}
            className="flex items-center justify-between px-5 py-3 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {getPaymentIcon(bill.paymentMethod)}
              </div>
              <div>
                <p className="font-medium text-foreground">{bill.billCode}</p>
                <p className="text-xs text-muted-foreground">
                  {bill.items.length} items • {format(bill.timestamp, 'h:mm a')}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-foreground">₹{bill.total.toLocaleString()}</p>
              <Badge variant="muted" className="text-[10px]">
                {getPaymentLabel(bill.paymentMethod)}
              </Badge>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-border px-5 py-3">
        <Button variant="ghost" className="w-full text-primary hover:text-primary">
          View All Transactions
        </Button>
      </div>
    </div>
  );
};

export default RecentTransactions;
