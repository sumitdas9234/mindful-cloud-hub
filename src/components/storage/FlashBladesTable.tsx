
import React from 'react';
import { DataTable, Column } from '@/components/compute/DataTable';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Zap } from 'lucide-react';
import { FlashBlade } from '@/api/types/storage';

interface FlashBladesTableProps {
  flashBlades: FlashBlade[];
  onRowClick: (flashBlade: FlashBlade) => void;
}

export const FlashBladesTable: React.FC<FlashBladesTableProps> = ({ flashBlades, onRowClick }) => {
  const columns: Column<FlashBlade>[] = [
    {
      key: 'name',
      header: 'Name',
      cell: (flashBlade) => (
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-blue-500" />
          <span className="font-medium">{flashBlade.name}</span>
        </div>
      ),
    },
    {
      key: 'model',
      header: 'Model',
      cell: (flashBlade) => <span>{flashBlade.model}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      cell: (flashBlade) => {
        const getStatusStyles = () => {
          switch (flashBlade.status) {
            case 'online': return 'bg-green-100 text-green-800';
            case 'degraded': return 'bg-yellow-100 text-yellow-800';
            case 'offline': return 'bg-red-100 text-red-800';
            case 'maintenance': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
          }
        };

        return (
          <Badge variant="outline" className={`${getStatusStyles()} capitalize`}>
            {flashBlade.status}
          </Badge>
        );
      },
    },
    {
      key: 'capacity',
      header: 'Capacity',
      cell: (flashBlade) => {
        const getCapacityColor = () => {
          if (flashBlade.usagePercentage > 90) return 'text-red-500';
          if (flashBlade.usagePercentage > 70) return 'text-yellow-500';
          return 'text-blue-500';
        };

        return (
          <div className="w-full space-y-1">
            <div className="flex justify-between text-xs">
              <span className={getCapacityColor()}>
                {Math.round(flashBlade.usagePercentage)}%
              </span>
              <span className="text-muted-foreground">
                {flashBlade.usedCapacity} TB / {flashBlade.totalCapacity} TB
              </span>
            </div>
            <Progress 
              value={flashBlade.usagePercentage} 
              className="h-1.5"
              style={{
                color: flashBlade.usagePercentage > 90 ? 'hsl(var(--destructive))' : 
                       flashBlade.usagePercentage > 70 ? 'hsl(var(--warning))' : 
                       'hsl(var(--primary))'
              }}
            />
          </div>
        );
      },
    },
    {
      key: 'performance',
      header: 'Performance',
      cell: (flashBlade) => (
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>IOPS:</span>
            <span className="text-muted-foreground">{(flashBlade.iops / 1000).toFixed(0)}K</span>
          </div>
          <div className="flex justify-between text-xs">
            <span>Throughput:</span>
            <span className="text-muted-foreground">{flashBlade.throughput}</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={flashBlades}
      columns={columns}
      keyExtractor={(item) => item.id}
      onRowClick={onRowClick}
    />
  );
};
