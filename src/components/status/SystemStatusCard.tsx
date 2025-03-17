
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusIndicator } from '@/components/compute/StatusIndicator';
import { UptimeGraph } from './UptimeGraph';

export interface SystemStatus {
  id: string;
  name: string;
  status: 'healthy' | 'warning' | 'error' | 'maintenance';
  uptime: string;
  lastIncident: string;
  uptimeData: {
    status: 'up' | 'degraded' | 'down';
    date: string;
  }[];
  description?: string;
}

interface SystemStatusCardProps {
  system: SystemStatus;
  onClick: (system: SystemStatus) => void;
  className?: string;
}

export const SystemStatusCard: React.FC<SystemStatusCardProps> = ({ 
  system, 
  onClick,
  className
}) => {
  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${className}`} 
      onClick={() => onClick(system)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base">{system.name}</CardTitle>
          <StatusIndicator status={system.status as any} showLabel={false} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <UptimeGraph data={system.uptimeData} mini={true} className="pt-1" />
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Uptime:</span>
              <span>{system.uptime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last incident:</span>
              <span>{system.lastIncident}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const SystemStatusCardSkeleton = () => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-[1px] items-end pt-1">
            {Array(45).fill(0).map((_, i) => (
              <div
                key={i}
                className="w-1 h-4 rounded-sm bg-gray-200 dark:bg-gray-700 animate-pulse"
              />
            ))}
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="flex justify-between">
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
