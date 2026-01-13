import AppLayout from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Download, Calendar, TrendingUp, DollarSign, Package } from 'lucide-react';

const Reports = () => {
    return (
        <AppLayout title="Reports & Analytics" subtitle="Financial summaries and inventory logs">
            <div className="grid gap-6 animate-fade-in">

                {/* Header Actions */}
                <div className="flex justify-between items-center bg-card p-4 rounded-xl border shadow-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">Last 30 Days</span>
                    </div>
                    <Button variant="outline" className="gap-2">
                        <Download className="h-4 w-4" />
                        Export CSV
                    </Button>
                </div>

                {/* Summary Cards */}
                <div className="grid md:grid-cols-3 gap-6">
                    <Card className="p-6 space-y-2">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <DollarSign className="h-4 w-4" />
                            <span className="text-sm font-medium">Total Revenue</span>
                        </div>
                        <p className="text-3xl font-bold">₹1,24,500</p>
                        <div className="flex items-center gap-1 text-xs text-success bg-success/10 w-fit px-2 py-1 rounded-full">
                            <TrendingUp className="h-3 w-3" />
                            +12.5% vs last month
                        </div>
                    </Card>

                    <Card className="p-6 space-y-2">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Package className="h-4 w-4" />
                            <span className="text-sm font-medium">Inventory Turnover</span>
                        </div>
                        <p className="text-3xl font-bold">4.2x</p>
                        <p className="text-xs text-muted-foreground">Efficient stock management</p>
                    </Card>

                    <Card className="p-6 space-y-2">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <BarChart3 className="h-4 w-4" />
                            <span className="text-sm font-medium">Avg Transaction</span>
                        </div>
                        <p className="text-3xl font-bold">₹450</p>
                        <div className="flex items-center gap-1 text-xs text-warning bg-warning/10 w-fit px-2 py-1 rounded-full">
                            <TrendingUp className="h-3 w-3" />
                            -2% vs last month
                        </div>
                    </Card>
                </div>

                {/* Report Tables (Placeholder for charts) */}
                <div className="grid lg:grid-cols-2 gap-6">
                    <Card className="p-6">
                        <h3 className="font-semibold mb-4 text-lg">Daily Sales Performance</h3>
                        <div className="h-[250px] flex items-end justify-between gap-2 px-4 pb-4 border-b border-border">
                            {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                                <div key={i} className="w-full bg-primary/20 hover:bg-primary/40 transition-colors rounded-t-sm relative group" style={{ height: `${h}%` }}>
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-xs p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                                        ₹{h * 100}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-muted-foreground px-1">
                            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h3 className="font-semibold mb-4 text-lg">Top Selling Categories</h3>
                        <div className="space-y-4">
                            {[
                                { name: 'Fresh Fruits', value: 75, color: 'bg-chart-1' },
                                { name: 'Vegetables', value: 60, color: 'bg-chart-2' },
                                { name: 'Dairy', value: 45, color: 'bg-chart-3' },
                                { name: 'Beverages', value: 30, color: 'bg-chart-4' },
                            ].map((cat, i) => (
                                <div key={i} className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium">{cat.name}</span>
                                        <span className="text-muted-foreground">{cat.value}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                        <div className={`h-full ${cat.color}`} style={{ width: `${cat.value}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
};

export default Reports;
