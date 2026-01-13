import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  AlertTriangle,
  ClipboardCheck,
  BarChart3,
  Settings,
  Leaf,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'POS Checkout', href: '/pos', icon: ShoppingCart },
  { name: 'Inventory', href: '/inventory', icon: Package },
  { name: 'Expiry Alerts', href: '/alerts', icon: AlertTriangle },
  { name: 'Compliance', href: '/compliance', icon: ClipboardCheck },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar = ({ collapsed, onToggle }: SidebarProps) => {
  const location = useLocation();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className={cn(
          "flex h-16 items-center border-b border-sidebar-border",
          collapsed ? "justify-center px-2" : "gap-3 px-6"
        )}>
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary shrink-0">
            <Leaf className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col animate-fade-in">
              <span className="font-extrabold text-2xl leading-none tracking-tight bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent drop-shadow-sm">
                AgroVia
              </span>
              <span className="text-[10px] text-zinc-400 font-medium tracking-[0.2em] uppercase mt-0.5">
                Smart POS
              </span>
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="absolute -right-3 top-20 h-6 w-6 rounded-full border border-sidebar-border bg-sidebar shadow-sm hover:bg-sidebar-accent"
        >
          {collapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </Button>

        {/* Navigation */}
        <nav className={cn("flex-1 space-y-1 py-4", collapsed ? "px-2" : "px-3")}>
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                title={collapsed ? item.name : undefined}
                className={cn(
                  'flex items-center rounded-lg text-sm font-medium transition-all duration-200',
                  collapsed ? 'justify-center px-2 py-2.5' : 'gap-3 px-3 py-2.5',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-primary'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                )}
              >
                <item.icon className={cn('h-5 w-5 shrink-0', isActive && 'text-sidebar-primary')} />
                {!collapsed && item.name}
                {!collapsed && item.name === 'Expiry Alerts' && (
                  <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-danger-foreground">
                    3
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Settings */}
        <div className={cn("border-t border-sidebar-border", collapsed ? "p-2" : "p-3")}>
          <Link
            to="/settings"
            title={collapsed ? "Settings" : undefined}
            className={cn(
              "flex items-center rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-all duration-200",
              collapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2.5"
            )}
          >
            <Settings className="h-5 w-5 shrink-0" />
            {!collapsed && "Settings"}
          </Link>
        </div>

        {/* Kiosk Info */}
        {!collapsed && (
          <div className="border-t border-sidebar-border p-4">
            <div className="rounded-lg bg-sidebar-accent p-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                <span className="text-xs font-medium text-sidebar-foreground">Online</span>
              </div>
              <p className="mt-1 text-xs text-sidebar-foreground/60">Kiosk ID: KSK-MUM-042</p>
              <p className="text-xs text-sidebar-foreground/60">Franchise: Andheri West</p>
            </div>
          </div>
        )}

        {collapsed && (
          <div className="border-t border-sidebar-border p-2 flex justify-center">
            <div className="h-2 w-2 rounded-full bg-success animate-pulse" title="Online" />
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
