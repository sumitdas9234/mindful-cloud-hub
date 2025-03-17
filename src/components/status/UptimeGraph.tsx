
import React from 'react';
import { cn } from '@/lib/utils';

interface UptimeDataPoint {
  status: 'up' | 'degraded' | 'down';
  date: string;
}

interface UptimeGraphProps {
  data: UptimeDataPoint[];
  daysShown?: number;
  className?: string;
  mini?: boolean;
}

export const UptimeGraph: React.FC<UptimeGraphProps> = ({
  data,
  daysShown = 45,
  className,
  mini = false
}) => {
  // Limit data to the last X days
  const limitedData = data.slice(-daysShown);
  
  const getStatusColor = (status: 'up' | 'degraded' | 'down') => {
    switch (status) {
      case 'up': return 'bg-green-500';
      case 'degraded': return 'bg-amber-500';
      case 'down': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex gap-[1px] items-end">
        {limitedData.map((point, index) => (
          <div 
            key={index}
            className={cn(
              getStatusColor(point.status),
              mini ? "w-1 h-4 rounded-sm" : "w-2 h-8 rounded-md"
            )}
            title={`${point.date}: ${point.status}`}
          />
        ))}
      </div>
      
      {!mini && (
        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
          <span>{daysShown} days ago</span>
          <span>Today</span>
        </div>
      )}
    </div>
  );
};
