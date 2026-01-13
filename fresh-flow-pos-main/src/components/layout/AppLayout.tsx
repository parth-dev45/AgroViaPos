import { ReactNode, useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

const AppLayout = ({ children, title, subtitle }: AppLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className={cn(
        "transition-all duration-300",
        sidebarCollapsed ? "pl-16" : "pl-64"
      )}>
        <Header title={title} subtitle={subtitle} />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
