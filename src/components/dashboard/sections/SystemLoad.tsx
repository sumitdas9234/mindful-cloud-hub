
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Monitor, Cpu, HardDrive, Users } from 'lucide-react';
import { ResourceCard } from '@/components/dashboard/ResourceCard';
import { fetchCPUUsage, fetchMemoryUsage, fetchStorageUsage, fetchRoutes } from '@/api/dashboardApi';

interface SystemLoadProps {
  vCenterId?: string;
  clusterId?: string;
  tagIds?: string[];
}

export const SystemLoad: React.FC<SystemLoadProps> = ({ vCenterId, clusterId, tagIds }) => {
  // Separate queries for each resource
  const cpuQuery = useQuery({
    queryKey: ['cpuUsage', clusterId],
    queryFn: () => fetchCPUUsage(clusterId || ''),
    refetchInterval: 30000,
    enabled: !!clusterId,
  });

  const memoryQuery = useQuery({
    queryKey: ['memoryUsage', clusterId],
    queryFn: () => fetchMemoryUsage(clusterId || ''),
    refetchInterval: 30000,
    enabled: !!clusterId,
  });

  const storageQuery = useQuery({
    queryKey: ['storageUsage', clusterId],
    queryFn: () => fetchStorageUsage(clusterId || ''),
    refetchInterval: 30000,
    enabled: !!clusterId,
  });

  const routesQuery = useQuery({
    queryKey: ['routes', clusterId],
    queryFn: () => fetchRoutes(clusterId || ''),
    refetchInterval: 30000,
    enabled: !!clusterId,
  });

  // Debug data
  React.useEffect(() => {
    if (cpuQuery.data) {
      console.log("CPU Usage Data:", cpuQuery.data);
    }
    if (memoryQuery.data) {
      console.log("Memory Usage Data:", memoryQuery.data);
    }
    if (storageQuery.data) {
      console.log("Storage Usage Data:", storageQuery.data);
    }
  }, [cpuQuery.data, memoryQuery.data, storageQuery.data]);

  // Memory data formatting
  const memoryUsed = memoryQuery.data ? `${Math.round(memoryQuery.data * 0.5)} GB` : '0 GB';
  const memoryTotal = '50 GB';

  // Storage data formatting
  const storageUsed = storageQuery.data ? `${(storageQuery.data * 0.1).toFixed(1)} TB` : '0 TB';
  const storageTotal = '10 TB';

  // Network data (using routes for now)
  const networkUsed = routesQuery.data?.length?.toString() || '0';
  const networkTotal = '1600 active';
  const networkValue = 58; // Static for now

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Current System Load</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="transition-all duration-300 ease-in-out">
          {cpuQuery.isLoading ? (
            <div className="h-32 rounded-lg bg-muted/50 animate-pulse" />
          ) : (
            <ResourceCard
              title="CPU"
              value={cpuQuery.data || 0}
              color="bg-blue-500"
              icon={Monitor}
            />
          )}
        </div>

        <div className="transition-all duration-300 ease-in-out">
          {memoryQuery.isLoading ? (
            <div className="h-32 rounded-lg bg-muted/50 animate-pulse" />
          ) : (
            <ResourceCard
              title="Memory"
              value={memoryQuery.data || 0}
              subtitle={`${memoryUsed} / ${memoryTotal}`}
              color="bg-indigo-500"
              icon={Cpu}
            />
          )}
        </div>

        <div className="transition-all duration-300 ease-in-out">
          {storageQuery.isLoading ? (
            <div className="h-32 rounded-lg bg-muted/50 animate-pulse" />
          ) : (
            <ResourceCard
              title="Storage"
              value={storageQuery.data || 0}
              subtitle={`${storageUsed} / ${storageTotal}`}
              color="bg-purple-500"
              icon={HardDrive}
            />
          )}
        </div>

        <div className="transition-all duration-300 ease-in-out">
          {routesQuery.isLoading ? (
            <div className="h-32 rounded-lg bg-muted/50 animate-pulse" />
          ) : (
            <ResourceCard
              title="Sessions"
              value={networkValue}
              subtitle={`${networkUsed} / ${networkTotal}`}
              usageLabel={networkUsed}
              color="bg-green-500"
              icon={Users}
            />
          )}
        </div>
      </div>
    </div>
  );
};
