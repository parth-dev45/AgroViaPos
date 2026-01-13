import { useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Printer, Download, X } from 'lucide-react';
import Barcode from 'react-barcode';
import { CartItem } from '@/types/pos';

interface BillDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  billCode: string;
  items: CartItem[];
  total: number;
  paymentMethod: 'cash' | 'card' | 'upi';
  timestamp: Date;
}

const BillDialog = ({
  open,
  onOpenChange,
  billCode,
  items,
  total,
  paymentMethod,
  timestamp,
}: BillDialogProps) => {
  const billRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = billRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Bill - ${billCode}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Courier New', monospace; 
              padding: 20px; 
              max-width: 300px; 
              margin: 0 auto;
            }
            .header { text-align: center; margin-bottom: 16px; }
            .logo { font-size: 24px; font-weight: bold; color: #2D5A27; }
            .subtitle { font-size: 12px; color: #666; }
            .divider { border-top: 1px dashed #ccc; margin: 12px 0; }
            .info { font-size: 12px; margin-bottom: 8px; }
            .items { margin: 16px 0; }
            .item { display: flex; justify-content: space-between; font-size: 12px; margin: 4px 0; }
            .item-name { flex: 1; }
            .item-qty { width: 50px; text-align: center; }
            .item-total { width: 60px; text-align: right; }
            .total-section { margin-top: 16px; }
            .total-row { display: flex; justify-content: space-between; font-size: 14px; margin: 4px 0; }
            .grand-total { font-weight: bold; font-size: 18px; margin-top: 8px; }
            .footer { text-align: center; margin-top: 24px; font-size: 10px; color: #666; }
            @media print {
              body { padding: 10px; }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() { window.close(); }
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const formattedDate = timestamp.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const formattedTime = timestamp.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Transaction Complete</span>
          </DialogTitle>
        </DialogHeader>

        {/* Bill Content */}
        <div
          ref={billRef}
          className="bg-background rounded-lg border border-border p-4 font-mono text-sm"
        >
          {/* Header */}
          <div className="header text-center mb-4">
            <div className="logo text-2xl font-bold text-primary">🌿 AgroVia</div>
            <div className="subtitle text-xs text-muted-foreground">Premium Fresh Produce</div>
            <div className="text-xs text-muted-foreground mt-1">Andheri West, Mumbai</div>
          </div>

          <div className="divider border-t border-dashed border-border my-3" />

          {/* Bill Info */}
          <div className="info text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Bill No:</span>
              <span className="font-semibold">{billCode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date:</span>
              <span>{formattedDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Time:</span>
              <span>{formattedTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment:</span>
              <span className="uppercase">{paymentMethod}</span>
            </div>
          </div>

          <div className="divider border-t border-dashed border-border my-3" />

          {/* Items Header */}
          <div className="items">
            <div className="flex text-xs text-muted-foreground font-semibold mb-2">
              <span className="flex-1">Item</span>
              <span className="w-12 text-center">Qty</span>
              <span className="w-16 text-right">Amount</span>
            </div>

            {/* Items */}
            {items.map((item) => (
              <div key={item.crateId} className="item flex text-xs py-1">
                <span className="item-name flex-1 truncate">{item.productName}</span>
                <span className="item-qty w-12 text-center">{item.quantity}</span>
                <span className="item-total w-16 text-right">₹{item.total}</span>
              </div>
            ))}
          </div>

          <div className="divider border-t border-dashed border-border my-3" />

          {/* Totals */}
          <div className="total-section">
            <div className="total-row flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
            <div className="total-row flex justify-between text-sm">
              <span className="text-muted-foreground">Tax (0%)</span>
              <span>₹0</span>
            </div>
            <div className="grand-total flex justify-between text-lg font-bold mt-2 pt-2 border-t border-border">
              <span>TOTAL</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
          </div>

          <div className="divider border-t border-dashed border-border my-3" />

          {/* Footer */}
          <div className="footer text-center text-xs text-muted-foreground">
            <p>Thank you for shopping!</p>
            <p className="mt-1">Kiosk ID: KSK-MUM-042</p>
            <p className="mt-2 text-[10px]">This is a computer generated bill</p>
          </div>

          {/* Barcode */}
          <div className="flex justify-center mt-4 pt-4 border-t border-dashed border-border">
            <Barcode
              value={billCode}
              width={1.5}
              height={40}
              fontSize={10}
              displayValue={true}
              background="transparent"
              margin={0}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
            <X className="mr-2 h-4 w-4" />
            Close
          </Button>
          <Button className="flex-1 bg-gradient-fresh" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print Bill
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BillDialog;
