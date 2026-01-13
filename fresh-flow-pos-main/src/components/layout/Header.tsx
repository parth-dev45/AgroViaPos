import { Bell, Search, User, Settings, LogOut, FileText, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

const Header = ({ title, subtitle }: HeaderProps) => {
  const currentDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const notifications = [
    {
      id: 1,
      title: "Stock Alert",
      message: "Tomatoes (CRT-001) are running low.",
      time: "10 min ago",
      type: "warning"
    },
    {
      id: 2,
      title: "Expiry Warning",
      message: "Green Spinach expires tomorrow.",
      time: "1 hour ago",
      type: "destructive"
    },
    {
      id: 3,
      title: "System Update",
      message: "End of day reconciliation completed.",
      time: "2 hours ago",
      type: "success"
    }
  ];

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        {subtitle ? (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        ) : (
          <p className="text-sm text-muted-foreground">{currentDate}</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products, crates..."
            className="w-64 pl-9 bg-muted/50 border-0 focus-visible:ring-1"
          />
        </div>

        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-danger-foreground">
                3
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h4 className="font-semibold">Notifications</h4>
              <span className="text-xs text-muted-foreground">3 unread</span>
            </div>
            <ScrollArea className="h-[300px]">
              <div className="grid gap-1">
                {notifications.map((notification) => (
                  <div key={notification.id} className="flex items-start gap-3 border-b border-border/50 p-4 last:border-0 hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${notification.type === 'destructive' ? 'bg-destructive' :
                      notification.type === 'warning' ? 'bg-warning' : 'bg-success'
                      }`} />
                    <div className="grid gap-1">
                      <p className="text-sm font-medium leading-none">{notification.title}</p>
                      <p className="text-xs text-muted-foreground">{notification.message}</p>
                      <p className="text-[10px] text-muted-foreground/70">{notification.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="border-t p-2">
              <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground">
                Mark all as read
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 relative border overflow-hidden">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">SK</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Store Keeper</p>
                <p className="text-xs leading-none text-muted-foreground">
                  store.admin@freshkiosk.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/settings" className="cursor-pointer font-medium">
                <User className="mr-2 h-4 w-4" />
                <span>My Account</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/reports" className="cursor-pointer font-medium">
                <FileText className="mr-2 h-4 w-4" />
                <span>My Reports</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings" className="cursor-pointer font-medium">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive cursor-pointer"
              onClick={() => window.location.href = '/login'}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
