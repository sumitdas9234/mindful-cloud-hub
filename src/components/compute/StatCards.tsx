
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center">
          <div className="text-2xl font-bold">{value}</div>
          {icon && <div className="ml-2">{icon}</div>}
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
};

interface VCenterStatsProps {
  total: number;
  healthy: number;
  totalHosts: number;
  totalVMs: number;
}

export const VCenterStatCards: React.FC<VCenterStatsProps> = ({ 
  total, 
  healthy, 
  totalHosts, 
  totalVMs 
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <StatCard title="Total vCenters" value={total} />
      <StatCard 
        title="Healthy" 
        value={healthy} 
        icon={<CheckCircle2 className="h-5 w-5 text-green-500" />} 
      />
      <StatCard title="Total Hosts" value={totalHosts} />
      <StatCard title="Virtual Machines" value={totalVMs} />
    </div>
  );
};
