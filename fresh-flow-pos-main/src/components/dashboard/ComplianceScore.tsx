import { Shield, CheckCircle2, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { ComplianceMetric } from '@/types/pos';
import { cn } from '@/lib/utils';

interface ComplianceScoreProps {
  score: number;
  metrics: ComplianceMetric[];
}

const ComplianceScore = ({ score, metrics }: ComplianceScoreProps) => {


  return (
    <div className="rounded-xl border bg-card shadow-card overflow-hidden">
      {/* Header with score */}
      <div className="bg-gradient-fresh p-5">
        <div className="flex items-center gap-2 text-primary-foreground/80">
          <Shield className="h-5 w-5" />
          <span className="text-sm font-medium">Compliance Score</span>
        </div>
        <div className="mt-3 flex items-end gap-2">
          <span className={cn('text-5xl font-bold text-primary-foreground')}>
            {score}
          </span>
          <span className="mb-1 text-lg text-primary-foreground/80">/ 100</span>
        </div>
        <p className="mt-2 text-sm text-primary-foreground/70">
          {score >= 95 ? 'Excellent compliance maintained' :
            score >= 80 ? 'Good standing, minor improvements needed' :
              'Action required to improve compliance'}
        </p>
      </div>

      {/* Metrics */}
      <div className="divide-y divide-border">
        {metrics.map((metric, index) => (
          <div key={index} className="px-5 py-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {metric.status === 'good' ? (
                  <CheckCircle2 className="h-4 w-4 text-success" />
                ) : (
                  <AlertCircle className={cn(
                    'h-4 w-4',
                    metric.status === 'warning' ? 'text-warning' : 'text-danger'
                  )} />
                )}
                <span className="text-sm font-medium text-foreground">{metric.label}</span>
              </div>
              <span className={cn(
                'text-sm font-semibold',
                metric.status === 'good' ? 'text-success' :
                  metric.status === 'warning' ? 'text-warning' :
                    'text-danger'
              )}>
                {metric.value}%
              </span>
            </div>
            <Progress
              value={metric.value}
              className="h-1.5"
              indicatorClassName={
                metric.status === 'good' ? 'bg-success' :
                  metric.status === 'warning' ? 'bg-warning' :
                    'bg-danger'
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComplianceScore;
