import { useState } from 'react';
import { useInventory } from '@/context/InventoryContext';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Search,
  Package,
  ScanLine,
  Filter,
  Download,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  Plus,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { getAvailableQuantity, getDaysUntilExpiry } from '@/data/mockData';
import { Crate } from '@/types/pos';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';

const formSchema = z.object({
  productName: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  productCategory: z.string().min(2, {
    message: "Category is required.",
  }),
  quantity: z.coerce.number().min(1, {
    message: "Quantity must be at least 1.",
  }),
  unit: z.enum(['kg', 'units', 'bundles'], {
    required_error: "Unit is required.",
  }),
  pricePerUnit: z.coerce.number().min(0.01, {
    message: "Price must be greater than 0.",
  }),
  expiryDate: z.date({
    required_error: "Expiry date is required.",
  }),
});

const Inventory = () => {
  const { crates, addCrate } = useInventory();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const categories = [...new Set(crates.map(c => c.productCategory))];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
      productCategory: "Vegetables",
      quantity: 1,
      unit: "kg",
      pricePerUnit: 0,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const newCrate: Crate = {
      id: `CRT-${(crates.length + 1).toString().padStart(3, '0')}`,
      productName: values.productName,
      productCategory: values.productCategory,
      quantity: values.quantity,
      quantitySold: 0,
      unit: values.unit,
      batchId: `BAT-${format(new Date(), 'yyyy-MMdd')}-${(crates.length + 1).toString().padStart(3, '0')}`,
      expiryDate: values.expiryDate,
      receivedDate: new Date(),
      pricePerUnit: values.pricePerUnit,
      status: 'active',
    };

    addCrate(newCrate);
    setIsAddDialogOpen(false);
    form.reset();
    toast.success(`${values.productName} added to inventory`);
  };

  const filteredCrates = crates.filter(crate => {
    const matchesSearch =
      crate.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crate.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crate.batchId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || crate.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || crate.productCategory === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusBadge = (crate: Crate) => {
    const days = getDaysUntilExpiry(crate.expiryDate);
    if (days < 0) return <Badge variant="expired"><XCircle className="mr-1 h-3 w-3" />Expired</Badge>;
    if (days <= 2) return <Badge variant="expiring"><AlertTriangle className="mr-1 h-3 w-3" />Expiring Soon</Badge>;
    if (crate.status === 'low_stock') return <Badge variant="low-stock"><Clock className="mr-1 h-3 w-3" />Low Stock</Badge>;
    if (crate.status === 'sold_out') return <Badge variant="muted">Sold Out</Badge>;
    return <Badge variant="active"><CheckCircle2 className="mr-1 h-3 w-3" />Active</Badge>;
  };

  const stats = {
    total: crates.length,
    active: crates.filter(c => c.status === 'active').length,
    expiring: crates.filter(c => getDaysUntilExpiry(c.expiryDate) <= 3 && getDaysUntilExpiry(c.expiryDate) > 0).length,
    expired: crates.filter(c => getDaysUntilExpiry(c.expiryDate) < 0).length,
  };

  return (
    <AppLayout title="Inventory Management" subtitle="Track and manage crate inventory">
      <div className="space-y-6 animate-fade-in">
        {/* Stats Bar */}
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { label: 'Total Crates', value: stats.total, icon: Package, color: 'text-primary' },
            { label: 'Active', value: stats.active, icon: CheckCircle2, color: 'text-success' },
            { label: 'Expiring Soon', value: stats.expiring, icon: AlertTriangle, color: 'text-warning' },
            { label: 'Expired', value: stats.expired, icon: XCircle, color: 'text-danger' },
          ].map((stat, index) => (
            <div key={index} className="flex items-center gap-4 rounded-xl border bg-card p-4 shadow-card">
              <div className={cn('rounded-lg bg-muted p-2.5', stat.color)}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by product, crate ID, or batch..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expiring_soon">Expiring Soon</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="low_stock">Low Stock</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                  <DialogDescription>
                    Enter the details of the new product to add to inventory.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="productName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Red Apples" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="productCategory"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Fruits" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="unit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Unit</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select unit" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="kg">kg</SelectItem>
                                <SelectItem value="units">units</SelectItem>
                                <SelectItem value="bundles">bundles</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantity</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="pricePerUnit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price / Unit (₹)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="expiryDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Expiry Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date < new Date()
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit">Add Product</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
            <Button variant="outline">
              <ScanLine className="mr-2 h-4 w-4" />
              Scan Crate
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border bg-card shadow-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Crate ID</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Batch ID</TableHead>
                <TableHead>Stock Level</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCrates.map((crate) => {
                const available = getAvailableQuantity(crate);
                const percent = (available / crate.quantity) * 100;
                const days = getDaysUntilExpiry(crate.expiryDate);

                return (
                  <TableRow
                    key={crate.id}
                    className={cn(
                      'transition-colors',
                      days < 0 && 'bg-danger/5',
                      days <= 2 && days >= 0 && 'bg-warning/5'
                    )}
                  >
                    <TableCell className="font-mono text-sm">{crate.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{crate.productName}</p>
                        <p className="text-xs text-muted-foreground">{crate.productCategory}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{crate.batchId}</TableCell>
                    <TableCell>
                      <div className="w-32">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span>{available} / {crate.quantity} {crate.unit}</span>
                          <span className={cn(
                            percent <= 20 ? 'text-danger' :
                              percent <= 40 ? 'text-warning' :
                                'text-success'
                          )}>{Math.round(percent)}%</span>
                        </div>
                        <Progress value={percent} className="h-1.5" />
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">₹{crate.pricePerUnit}/{crate.unit}</TableCell>
                    <TableCell>
                      <div>
                        <p className={cn(
                          'font-medium',
                          days < 0 ? 'text-danger' :
                            days <= 2 ? 'text-warning' :
                              'text-foreground'
                        )}>
                          {format(crate.expiryDate, 'dd MMM yyyy')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {days < 0 ? `${Math.abs(days)} days ago` :
                            days === 0 ? 'Today' :
                              days === 1 ? 'Tomorrow' :
                                `${days} days left`}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(crate)}</TableCell>
                  </TableRow>
                );
              })}
              {filteredCrates.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AppLayout>
  );
};

export default Inventory;
