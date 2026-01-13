import { useState } from 'react';
import { useInventory } from '@/context/InventoryContext';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  CreditCard,
  Banknote,
  Smartphone,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { getAvailableQuantity, canSell, getDaysUntilExpiry } from '@/data/mockData';
import { CartItem, Crate } from '@/types/pos';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import BillDialog from '@/components/pos/BillDialog';

const POS = () => {
  const { crates } = useInventory();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<'cash' | 'card' | 'upi'>('cash');
  const { toast } = useToast();

  // Bill dialog state
  const [billDialogOpen, setBillDialogOpen] = useState(false);
  const [currentBill, setCurrentBill] = useState<{
    billCode: string;
    items: CartItem[];
    total: number;
    paymentMethod: 'cash' | 'card' | 'upi';
    timestamp: Date;
  } | null>(null);

  const addToCart = (crate: Crate) => {
    const sellCheck = canSell(crate);
    if (!sellCheck.canSell) {
      toast({
        title: 'Cannot Add Item',
        description: sellCheck.reason,
        variant: 'destructive',
      });
      return;
    }

    const existing = cart.find(item => item.crateId === crate.id);
    const available = getAvailableQuantity(crate);
    const currentInCart = existing?.quantity || 0;

    if (currentInCart >= available) {
      toast({
        title: 'Stock Limit Reached',
        description: `Only ${available} ${crate.unit} available for ${crate.productName}`,
        variant: 'destructive',
      });
      return;
    }

    if (existing) {
      setCart(cart.map(item =>
        item.crateId === crate.id
          ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.pricePerUnit }
          : item
      ));
    } else {
      setCart([...cart, {
        crateId: crate.id,
        productName: crate.productName,
        quantity: 1,
        pricePerUnit: crate.pricePerUnit,
        unit: crate.unit,
        total: crate.pricePerUnit,
      }]);
    }
  };

  const updateQuantity = (crateId: string, delta: number) => {
    const item = cart.find(i => i.crateId === crateId);
    if (!item) return;

    const crate = crates.find(c => c.id === crateId);
    if (!crate) return;

    const available = getAvailableQuantity(crate);
    const newQty = item.quantity + delta;

    if (newQty <= 0) {
      setCart(cart.filter(i => i.crateId !== crateId));
      return;
    }

    if (newQty > available) {
      toast({
        title: 'Stock Limit',
        description: `Maximum ${available} ${crate.unit} available`,
        variant: 'destructive',
      });
      return;
    }

    setCart(cart.map(i =>
      i.crateId === crateId
        ? { ...i, quantity: newQty, total: newQty * i.pricePerUnit }
        : i
    ));
  };

  const removeFromCart = (crateId: string) => {
    setCart(cart.filter(item => item.crateId !== crateId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const processCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: 'Empty Cart',
        description: 'Add items to cart before checkout',
        variant: 'destructive',
      });
      return;
    }

    const billCode = `KSK-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;

    // Set bill data and open dialog
    setCurrentBill({
      billCode,
      items: [...cart],
      total: cartTotal,
      paymentMethod: selectedPayment,
      timestamp: new Date(),
    });
    setBillDialogOpen(true);

    toast({
      title: 'Transaction Successful',
      description: `Bill ${billCode} generated for ₹${cartTotal.toLocaleString()}`,
    });

    clearCart();
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.total, 0);

  const filteredCrates = crates.filter(crate =>
    crate.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    crate.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (crate: Crate) => {
    const days = getDaysUntilExpiry(crate.expiryDate);
    if (days < 0) return 'border-danger/50 bg-danger/5 opacity-60';
    if (days <= 2) return 'border-warning/50 bg-warning/5';
    return 'border-border hover:border-primary/50 hover:shadow-md';
  };

  return (
    <AppLayout title="POS Checkout" subtitle="Process sales transactions">
      <div className="grid gap-6 lg:grid-cols-3 animate-fade-in">
        {/* Product Grid */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products or scan crate ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Products Grid */}
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filteredCrates.map((crate) => {
              const available = getAvailableQuantity(crate);
              const sellCheck = canSell(crate);
              const days = getDaysUntilExpiry(crate.expiryDate);

              return (
                <Card
                  key={crate.id}
                  className={cn(
                    'p-4 cursor-pointer transition-all duration-200',
                    getStatusColor(crate),
                    !sellCheck.canSell && 'cursor-not-allowed'
                  )}
                  onClick={() => sellCheck.canSell && addToCart(crate)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-foreground">{crate.productName}</h4>
                      <p className="text-xs text-muted-foreground">{crate.id}</p>
                    </div>
                    {days < 0 ? (
                      <Badge variant="expired">Expired</Badge>
                    ) : days <= 2 ? (
                      <Badge variant="expiring">{days}d left</Badge>
                    ) : available <= 2 ? (
                      <Badge variant="low-stock">Low</Badge>
                    ) : (
                      <Badge variant="active">Active</Badge>
                    )}
                  </div>
                  <div className="mt-3 flex items-end justify-between">
                    <div>
                      <p className="text-lg font-bold text-foreground">₹{crate.pricePerUnit}</p>
                      <p className="text-xs text-muted-foreground">per {crate.unit}</p>
                    </div>
                    <div className="text-right">
                      <p className={cn(
                        'text-sm font-medium',
                        available <= 2 ? 'text-warning' : 'text-muted-foreground'
                      )}>
                        {available} {crate.unit}
                      </p>
                      <p className="text-xs text-muted-foreground">available</p>
                    </div>
                  </div>
                  {!sellCheck.canSell && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-danger">
                      <XCircle className="h-3 w-3" />
                      {sellCheck.reason}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>

        {/* Cart */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20 overflow-hidden">
            <div className="bg-gradient-fresh p-4">
              <div className="flex items-center gap-2 text-primary-foreground">
                <ShoppingCart className="h-5 w-5" />
                <h3 className="font-semibold">Current Cart</h3>
                {cart.length > 0 && (
                  <Badge variant="secondary" className="ml-auto">
                    {cart.length} items
                  </Badge>
                )}
              </div>
            </div>

            {cart.length === 0 ? (
              <div className="p-8 text-center">
                <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground/30" />
                <p className="mt-2 text-sm text-muted-foreground">Cart is empty</p>
                <p className="text-xs text-muted-foreground/70">Click products to add</p>
              </div>
            ) : (
              <div className="divide-y divide-border max-h-[350px] overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.crateId} className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-foreground">{item.productName}</p>
                        <p className="text-xs text-muted-foreground">
                          ₹{item.pricePerUnit} × {item.quantity} {item.unit}
                        </p>
                      </div>
                      <p className="font-semibold text-foreground">₹{item.total}</p>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.crateId, -1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => updateQuantity(item.crateId, 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 ml-auto text-danger hover:text-danger hover:bg-danger/10"
                        onClick={() => removeFromCart(item.crateId)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {cart.length > 0 && (
              <>
                <Separator />
                <div className="p-4 space-y-4">
                  {/* Total */}
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total</span>
                    <span className="text-2xl font-bold text-foreground">
                      ₹{cartTotal.toLocaleString()}
                    </span>
                  </div>

                  {/* Payment Methods */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'cash' as const, icon: Banknote, label: 'Cash' },
                      { id: 'card' as const, icon: CreditCard, label: 'Card' },
                      { id: 'upi' as const, icon: Smartphone, label: 'UPI' },
                    ].map((method) => (
                      <Button
                        key={method.id}
                        variant={selectedPayment === method.id ? 'default' : 'outline'}
                        className={cn(
                          'flex-col h-auto py-3',
                          selectedPayment === method.id && 'bg-primary'
                        )}
                        onClick={() => setSelectedPayment(method.id)}
                      >
                        <method.icon className="h-4 w-4 mb-1" />
                        <span className="text-xs">{method.label}</span>
                      </Button>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" onClick={clearCart}>
                      Clear Cart
                    </Button>
                    <Button onClick={processCheckout} className="bg-gradient-fresh">
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Checkout
                    </Button>
                  </div>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>

      {/* Bill Dialog */}
      {currentBill && (
        <BillDialog
          open={billDialogOpen}
          onOpenChange={setBillDialogOpen}
          billCode={currentBill.billCode}
          items={currentBill.items}
          total={currentBill.total}
          paymentMethod={currentBill.paymentMethod}
          timestamp={currentBill.timestamp}
        />
      )}
    </AppLayout>
  );
};

export default POS;
