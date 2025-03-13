
import React from 'react';
import { DataTable, Column } from '@/components/compute/DataTable';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { HardDrive } from 'lucide-react';
import { FlashArray } from '@/api/types/storage';

interface FlashArraysTableProps {
  flashArrays: FlashArray[];
  onRowClick: (flashArray: FlashArray) => void;
}

export const FlashArraysTable: React.FC<FlashArraysTableProps> = ({ flashArrays, onRowClick }) => {
  const columns: Column<FlashArray>[] = [
    {
      key: 'name',
      header: 'Name',
      cell: (flashArray) => (
        <div className="flex items-center gap-2">
          <HardDrive className="h-4 w-4 text-purple-500" />
          <span className="font-medium">{flashArray.name}</span>
        </div>
      ),
    },
    {
      key: 'model',
      header: 'Model',
      cell: (flashArray) => <span>{flashArray.model}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      cell: (flashArray) => {
        const getStatusStyles = () => {
          switch (flashArray.status) {
            case 'online': return 'bg-green-500/10 text-green-500';
            case 'degraded': return 'bg-yellow-500/10 text-yellow-500';
            case 'offline': return 'bg-red-500/10 text-red-500';
            case 'maintenance': return 'bg-blue-500/10 text-blue-500';
            default: return 'bg-gray-500/10 text-gray-500';
          }
        };

        return (
          <Badge variant="outline" className={getStatusStyles()}>
            {flashArray.status}
          </Badge>
        );
      },
    },
    {
      key: 'capacity',
      header: 'Capacity',
      cell: (flashArray) => {
        const getCapacityColor = () => {
          if (flashArray.usagePercentage > 90) return 'text-red-500';
          if (flashArray.usagePercentage > 70) return 'text-yellow-500';
          return 'text-blue-500';
        };

        return (
          <div className="w-full max-w-[180px] space-y-1">
            <div className="flex justify-between text-xs">
              <span className={getCapacityColor()}>
                {Math.round(flashArray.usagePercentage)}%
              </span>
              <span className="text-muted-foreground">
                {flashArray.usedCapacity} TB / {flashArray.totalCapacity} TB
              </span>
            </div>
            <Progress 
              value={flashArray.usagePercentage} 
              className="h-1.5"
              style={{
                color: flashArray.usagePercentage > 90 ? 'hsl(var(--destructive))' : 
                       flashArray.usagePercentage > 70 ? 'hsl(var(--warning))' : 
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
      cell: (flashArray) => (
        <div className="space-y-1 max-w-[180px]">
          <div className="flex justify-between text-xs">
            <span>IOPS:</span>
            <span className="text-muted-foreground">{(flashArray.iops / 1000).toFixed(0)}K</span>
          </div>
          <div className="flex justify-between text-xs">
            <span>Data Reduction:</span>
            <span className="text-muted-foreground">{flashArray.dataReduction}:1</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={flashArrays}
      columns={columns}
      keyExtractor={(item) => item.id}
      onRowClick={onRowClick}
    />
  );
};
