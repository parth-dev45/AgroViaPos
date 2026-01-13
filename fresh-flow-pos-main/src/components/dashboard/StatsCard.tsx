import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

const StatsCard = ({ title, value, icon, trend, subtitle, variant = 'default' }: StatsCardProps) => {
  const variants = {
    default: 'bg-card',
    success: 'bg-success/5 border-success/20',
    warning: 'bg-warning/5 border-warning/20',
    danger: 'bg-danger/5 border-danger/20',
  };

  const iconVariants = {
    default: 'bg-primary/10 text-primary',
    success: 'bg-success/20 text-success',
    warning: 'bg-warning/20 text-warning',
    danger: 'bg-danger/20 text-danger',
  };

  return (
    <div className={cn(
      'rounded-xl border p-5 shadow-card transition-all duration-200 hover:shadow-md',
      variants[variant]
    )}>
      <div className="flex items-start justify-between">
        <div className={cn('rounded-lg p-2.5', iconVariants[variant])}>
          {icon}
        </div>
        {trend && (
          <div className={cn(
            'flex items-center gap-1 text-xs font-medium',
            trend.isPositive ? 'text-success' : 'text-danger'
          )}>
            {trend.isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {Math.abs(trend.value)}%
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-foreground number-tick">{value}</p>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        {subtitle && (
          <p className="mt-1 text-xs text-muted-foreground/70">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
