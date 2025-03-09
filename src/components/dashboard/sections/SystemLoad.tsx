
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Cpu, Database, HardDrive, Network } from 'lucide-react';
import { ResourceCard } from '@/components/dashboard/ResourceCard';
import { fetchSystemLoad } from '@/api/dashboardApi';

export const SystemLoad = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['systemLoad'],
    queryFn: fetchSystemLoad,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Current System Load</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-32 rounded-lg bg-muted/50 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Current System Load</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResourceCard 
          title="CPU Usage" 
          value={data?.cpu || 0} 
          icon={Cpu}
          color="hsl(var(--primary))"
          usageLabel={`${data?.cpu || 0}%`}
          showProgressRing={true}
        />
        <ResourceCard 
          title="Memory Usage" 
          value={data?.memory.value || 0} 
          icon={Database}
          color="hsl(217, 91%, 60%)"
          usageLabel={data?.memory.used || ""}
          total={data?.memory.total || ""}
        />
        <ResourceCard 
          title="Storage" 
          value={data?.storage.value || 0} 
          icon={HardDrive}
          color="hsl(330, 87%, 66%)"
          usageLabel={data?.storage.used || ""}
          total={data?.storage.total || ""}
        />
        <ResourceCard 
          title="Network" 
          value={data?.network.value || 0} 
          icon={Network}
          color="hsl(142, 71%, 45%)"
          usageLabel={data?.network.used || ""}
          total={data?.network.total || ""}
        />
      </div>
    </div>
  );
};
