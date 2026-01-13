import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, Moon, Sun, Monitor, Shield, CreditCard, HelpCircle, FileText } from 'lucide-react';
import { useTheme } from "@/components/theme-provider"

const Settings = () => {
    const { theme, setTheme } = useTheme()

    return (
        <AppLayout title="Settings" subtitle="Manage your account and kiosk preferences">
            <div className="max-w-4xl mx-auto animate-fade-in">
                <Tabs defaultValue="account" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                        <TabsTrigger value="account">Account</TabsTrigger>
                        <TabsTrigger value="preferences">Preferences</TabsTrigger>
                        <TabsTrigger value="system">System</TabsTrigger>
                    </TabsList>

                    {/* Account Settings */}
                    <TabsContent value="account">
                        <Card>
                            <CardHeader>
                                <CardTitle>Account Information</CardTitle>
                                <CardDescription>
                                    Update your profile details and personal information.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center gap-6">
                                    <Avatar className="h-20 w-20">
                                        <AvatarImage src="/placeholder-avatar.jpg" />
                                        <AvatarFallback className="text-lg bg-primary/10 text-primary">SK</AvatarFallback>
                                    </Avatar>
                                    <Button variant="outline">Change Avatar</Button>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input id="name" defaultValue="Store Keeper" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" defaultValue="store.admin@freshkiosk.com" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="role">Role</Label>
                                        <Input id="role" defaultValue="Manager" disabled />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input id="phone" defaultValue="+91 98765 43210" />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2">
                                    <Button variant="outline">Discard</Button>
                                    <Button>Save Changes</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Preferences */}
                    <TabsContent value="preferences">
                        <Card>
                            <CardHeader>
                                <CardTitle>Appearance & Notifications</CardTitle>
                                <CardDescription>
                                    Customize how the application looks and behaves.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Theme */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Theme</h3>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Monitor className="h-4 w-4" />
                                            <Label htmlFor="theme-mode" className="font-normal">Interface Theme</Label>
                                        </div>
                                        <div className="flex items-center bg-secondary rounded-full p-1 border">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setTheme("light")}
                                                className={`h-7 w-7 rounded-full shadow-sm transition-all ${theme === 'light' ? 'bg-background text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                            >
                                                <Sun className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setTheme("dark")}
                                                className={`h-7 w-7 rounded-full shadow-sm transition-all ${theme === 'dark' ? 'bg-background text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                            >
                                                <Moon className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Notifications</h3>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Bell className="h-4 w-4" />
                                            <div className="space-y-0.5">
                                                <Label className="text-base">Stock Alerts</Label>
                                                <p className="text-xs text-muted-foreground">Get notified when inventory is low</p>
                                            </div>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Shield className="h-4 w-4" />
                                            <div className="space-y-0.5">
                                                <Label className="text-base">Security Alerts</Label>
                                                <p className="text-xs text-muted-foreground">Login attempts and system changes</p>
                                            </div>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* System */}
                    <TabsContent value="system">
                        <div className="grid gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>System Information</CardTitle>
                                    <CardDescription>
                                        Device and application details.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="grid gap-4">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="font-medium">Kiosk ID</div>
                                        <div className="text-muted-foreground font-mono">KSK-MUM-042</div>

                                        <div className="font-medium">App Version</div>
                                        <div className="text-muted-foreground">v2.4.0 (Build 20240110)</div>

                                        <div className="font-medium">Last Sync</div>
                                        <div className="text-muted-foreground">Just now</div>

                                        <div className="font-medium">Status</div>
                                        <div className="text-success flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                                            Online
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Help & Support</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <Button variant="outline" className="w-full justify-start gap-2">
                                        <HelpCircle className="h-4 w-4" />
                                        Contact Support
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start gap-2">
                                        <FileText className="h-4 w-4" />
                                        Documentation
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
};

export default Settings;
