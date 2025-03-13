
import React from 'react';
import { DataTable, Column } from '@/components/compute/DataTable';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Database } from 'lucide-react';
import { Datastore } from '@/api/types/storage';

interface DatastoresTableProps {
  datastores: Datastore[];
  onRowClick: (datastore: Datastore) => void;
}

export const DatastoresTable: React.FC<DatastoresTableProps> = ({ datastores, onRowClick }) => {
  const columns: Column<Datastore>[] = [
    {
      key: 'name',
      header: 'Name',
      cell: (datastore) => (
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-blue-500" />
          <span className="font-medium">{datastore.name}</span>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      cell: (datastore) => <span>{datastore.type}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      cell: (datastore) => {
        const getStatusStyles = () => {
          switch (datastore.status) {
            case 'healthy': return 'bg-green-500/10 text-green-500';
            case 'warning': return 'bg-yellow-500/10 text-yellow-500';
            case 'critical': return 'bg-red-500/10 text-red-500';
            case 'maintenance': return 'bg-blue-500/10 text-blue-500';
            default: return 'bg-gray-500/10 text-gray-500';
          }
        };

        return (
          <Badge variant="outline" className={`${getStatusStyles()} capitalize`}>
            {datastore.status}
          </Badge>
        );
      },
    },
    {
      key: 'capacity',
      header: 'Capacity',
      cell: (datastore) => {
        const getCapacityColor = () => {
          if (datastore.usagePercentage > 90) return 'text-red-500';
          if (datastore.usagePercentage > 70) return 'text-yellow-500';
          return 'text-blue-500';
        };

        return (
          <div className="w-full max-w-[180px] space-y-1">
            <div className="flex justify-between text-xs">
              <span className={getCapacityColor()}>
                {Math.round(datastore.usagePercentage)}%
              </span>
              <span className="text-muted-foreground">
                {(datastore.usedCapacity / 1024).toFixed(1)} TB / {(datastore.totalCapacity / 1024).toFixed(1)} TB
              </span>
            </div>
            <Progress 
              value={datastore.usagePercentage} 
              className="h-1.5"
              style={{
                color: datastore.usagePercentage > 90 ? 'hsl(var(--destructive))' : 
                       datastore.usagePercentage > 70 ? 'hsl(var(--warning))' : 
                       'hsl(var(--primary))'
              }}
            />
          </div>
        );
      },
    },
    {
      key: 'cluster',
      header: 'Cluster',
      cell: (datastore) => <span>{datastore.cluster}</span>,
    }
  ];

  return (
    <DataTable
      data={datastores}
      columns={columns}
      keyExtractor={(item) => item.id}
      onRowClick={onRowClick}
    />
  );
};
