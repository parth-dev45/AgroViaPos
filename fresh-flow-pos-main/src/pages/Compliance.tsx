import AppLayout from '@/components/layout/AppLayout';
import ComplianceScore from '@/components/dashboard/ComplianceScore';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, FileText, AlertTriangle, CheckCircle2 } from 'lucide-react';

const Compliance = () => {
    // Mock data for compliance
    const complianceMetrics = [
        { label: 'Food Safety Standards', value: 98, target: 100, status: 'good' as const },
        { label: 'Hygiene Protocols', value: 95, target: 100, status: 'good' as const },
        { label: 'Storage Temperature', value: 82, target: 90, status: 'warning' as const },
        { label: 'Waste Management', value: 90, target: 95, status: 'good' as const },
    ];

    const upcomingAudits = [
        { id: 1, name: 'Quarterly Safety Audit', date: '2023-06-15', status: 'Scheduled' },
        { id: 2, name: 'Inventory Reconciliation', date: '2023-06-20', status: 'Pending' },
    ];

    const recentAlerts = [
        { id: 1, message: 'Freezer 2 temperature variance detected', time: '2 hours ago', type: 'warning' },
        { id: 2, message: 'Daily hygiene checklist completed', time: '5 hours ago', type: 'success' },
    ];

    return (
        <AppLayout title="Compliance" subtitle="Monitor safety standards and regulatory requirements">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-fade-in">

                {/* Main Score Card */}
                <div className="lg:col-span-2">
                    <ComplianceScore score={92} metrics={complianceMetrics} />
                </div>

                {/* Quick Actions / Summary */}
                <div className="space-y-6">
                    <Card className="p-5 bg-gradient-card">
                        <h3 className="font-semibold flex items-center gap-2 mb-4">
                            <Shield className="h-5 w-5 text-primary" />
                            Audit Status
                        </h3>
                        <div className="space-y-4">
                            {upcomingAudits.map((audit) => (
                                <div key={audit.id} className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
                                    <div>
                                        <p className="font-medium text-sm">{audit.name}</p>
                                        <p className="text-xs text-muted-foreground">Due: {audit.date}</p>
                                    </div>
                                    <Badge variant="outline">{audit.status}</Badge>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card className="p-5">
                        <h3 className="font-semibold flex items-center gap-2 mb-4">
                            <AlertTriangle className="h-5 w-5 text-warning" />
                            Recent Activity
                        </h3>
                        <div className="space-y-3">
                            {recentAlerts.map((alert) => (
                                <div key={alert.id} className="flex gap-3 items-start">
                                    {alert.type === 'warning' ? (
                                        <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                                    ) : (
                                        <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                                    )}
                                    <div>
                                        <p className="text-sm">{alert.message}</p>
                                        <p className="text-xs text-muted-foreground">{alert.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Documents Section */}
                <div className="lg:col-span-3">
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <FileText className="h-5 w-5 text-primary" />
                                Required Documents
                            </h3>
                            <Badge>All Up to Date</Badge>
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {['FSSAI License', 'Health & Safety Cert', 'Staff Medical Records', 'Pest Control Log'].map((doc, i) => (
                                <div key={i} className="p-4 border rounded-xl flex items-center gap-3 hover:bg-accent/50 transition-colors cursor-pointer">
                                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <CheckCircle2 className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">{doc}</p>
                                        <p className="text-xs text-success">Verified</p>
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

export default Compliance;
