
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Monitor, Cpu, HardDrive, Wifi } from 'lucide-react';
import { ResourceCard } from '@/components/dashboard/ResourceCard';
import { fetchSystemLoad } from '@/api/dashboardApi';

interface SystemLoadProps {
  vCenterId?: string;
  clusterId?: string;
  tagIds?: string[];
}

export const SystemLoad: React.FC<SystemLoadProps> = ({ vCenterId, clusterId, tagIds }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['systemLoad', vCenterId, clusterId, tagIds],
    queryFn: () => fetchSystemLoad({ vCenterId, clusterId, tagIds }),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Current System Load</h2>
      
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-32 rounded-lg bg-muted/50 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ResourceCard
            title="CPU"
            value={data?.cpu || 0}
            color="bg-blue-500"
            icon={Monitor}
          />
          <ResourceCard
            title="Memory"
            value={data?.memory.value || 0}
            subtitle={data ? `${data.memory.used} / ${data.memory.total}` : ''}
            color="bg-indigo-500"
            icon={Cpu}
          />
          <ResourceCard
            title="Storage"
            value={data?.storage.value || 0}
            subtitle={data ? `${data.storage.used} / ${data.storage.total}` : ''}
            color="bg-purple-500"
            icon={HardDrive}
          />
          <ResourceCard
            title="Network"
            value={data?.network.value || 0}
            subtitle={data ? `${data.network.used} / ${data.network.total}` : ''}
            color="bg-green-500"
            icon={Wifi}
          />
        </div>
      )}
    </div>
  );
};
