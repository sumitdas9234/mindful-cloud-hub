import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Monitor, Cpu, HardDrive, Users } from "lucide-react";
import { ResourceCard } from "@/components/dashboard/ResourceCard";
import {
  fetchCPUUsage,
  fetchMemoryUsage,
  fetchStorageUsage,
  fetchRoutes,
  fetchSystemLoad,
} from "@/api/dashboardApi";

interface SystemLoadProps {
  vCenterId?: string;
  clusterId?: string;
  tagIds?: string[];
}

export const SystemLoad: React.FC<SystemLoadProps> = ({
  vCenterId,
  clusterId,
  tagIds,
}) => {
  // Only enable queries when we have a clusterId
  const queryEnabled = !!clusterId;

  // Try to fetch all system load data in a single query first
  const systemLoadQuery = useQuery({
    queryKey: ["systemLoad", clusterId],
    queryFn: () =>
      fetchSystemLoad({
        vCenterId: vCenterId,
        clusterId: clusterId || "",
        tagIds: tagIds,
      }),
    refetchInterval: 30000,
    enabled: queryEnabled,
    refetchOnWindowFocus: false,
  });

  // Fallback to individual queries if the combined query fails or returns empty data
  const cpuQuery = useQuery({
    queryKey: ["cpuUsage", clusterId],
    queryFn: () => fetchCPUUsage(clusterId || ""),
    refetchInterval: 30000,
    enabled:
      queryEnabled &&
      (!systemLoadQuery.data || systemLoadQuery.data.cpu === undefined),
    refetchOnWindowFocus: false,
  });

  const memoryQuery = useQuery({
    queryKey: ["memoryUsage", clusterId],
    queryFn: () => fetchMemoryUsage(clusterId || ""),
    refetchInterval: 30000,
    enabled:
      queryEnabled &&
      (!systemLoadQuery.data || systemLoadQuery.data.memory === undefined),
    refetchOnWindowFocus: false,
  });

  const storageQuery = useQuery({
    queryKey: ["storageUsage", clusterId],
    queryFn: () => fetchStorageUsage(clusterId || ""),
    refetchInterval: 30000,
    enabled:
      queryEnabled &&
      (!systemLoadQuery.data || systemLoadQuery.data.storage === undefined),
    refetchOnWindowFocus: false,
  });

  const routesQuery = useQuery({
    queryKey: ["routes", clusterId],
    queryFn: () => fetchRoutes(clusterId || ""),
    refetchInterval: 30000,
    enabled:
      queryEnabled &&
      (!systemLoadQuery.data || systemLoadQuery.data.network === undefined),
    refetchOnWindowFocus: false,
  });

  // Get CPU value from either the combined query or individual query
  const cpuValue = useMemo(() => {
    if (systemLoadQuery.data?.cpu !== undefined) {
      return systemLoadQuery.data.cpu;
    }
    return cpuQuery.data || 0;
  }, [systemLoadQuery.data, cpuQuery.data]);

  // Memory data formatting
  const memoryData = useMemo(() => {
    if (systemLoadQuery.data?.memory) {
      return {
        value: systemLoadQuery.data.memory.value,
        used: systemLoadQuery.data.memory.used,
        total: systemLoadQuery.data.memory.total,
      };
    }

    const value = memoryQuery.data || 0;
    const used = value ? `${Math.round(value * 0.5)} GB` : "0 GB";
    const total = "50 GB";

    return { value, used, total };
  }, [systemLoadQuery.data, memoryQuery.data]);

  // Storage data formatting
  const storageData = useMemo(() => {
    if (systemLoadQuery.data?.storage) {
      return {
        value: systemLoadQuery.data.storage.value,
        used: systemLoadQuery.data.storage.used,
        total: systemLoadQuery.data.storage.total,
      };
    }

    const value = storageQuery.data || 0;
    const used = value ? `${(value * 0.1).toFixed(1)} TB` : "0 TB";
    const total = "10 TB";

    return { value, used, total };
  }, [systemLoadQuery.data, storageQuery.data]);

  // Network data formatting
  const networkData = useMemo(() => {
    // Maximum number of sessions
    const maxSessions = 1600;

    if (systemLoadQuery.data?.network) {
      // If we have data from the system load query, use it
      const sessionsCount = parseInt(systemLoadQuery.data.network.used) || 0;

      return {
        // Calculate percentage for the progress bar (0-100)
        value: Math.min(Math.round((sessionsCount / maxSessions) * 100), 100),
        // The actual number of sessions to display
        used: systemLoadQuery.data.network.used,
        // The maximum number of sessions
        total: maxSessions.toString(),
      };
    }

    // Use the actual number of routes/sessions from the routes query
    const sessionsCount = routesQuery.data?.length || 0;

    return {
      // Calculate percentage for the progress bar (0-100)
      value: Math.min(Math.round((sessionsCount / maxSessions) * 100), 100),
      // The actual number of sessions to display
      used: sessionsCount.toString(),
      // The maximum number of sessions
      total: maxSessions.toString(),
    };
  }, [systemLoadQuery.data, routesQuery.data]);

  // Determine loading states
  const isCpuLoading = systemLoadQuery.isLoading && cpuQuery.isLoading;
  const isMemoryLoading = systemLoadQuery.isLoading && memoryQuery.isLoading;
  const isStorageLoading = systemLoadQuery.isLoading && storageQuery.isLoading;
  const isRoutesLoading = systemLoadQuery.isLoading && routesQuery.isLoading;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Current System Load</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="transition-all duration-300 ease-in-out">
          {isCpuLoading ? (
            <div className="h-32 rounded-lg bg-muted/50 animate-pulse" />
          ) : (
            <ResourceCard
              title="CPU"
              value={cpuValue}
              color="bg-blue-500"
              icon={Monitor}
            />
          )}
        </div>

        <div className="transition-all duration-300 ease-in-out">
          {isMemoryLoading ? (
            <div className="h-32 rounded-lg bg-muted/50 animate-pulse" />
          ) : (
            <ResourceCard
              title="Memory"
              value={memoryData.value}
              color="bg-indigo-500"
              icon={Cpu}
            />
          )}
        </div>

        <div className="transition-all duration-300 ease-in-out">
          {isStorageLoading ? (
            <div className="h-32 rounded-lg bg-muted/50 animate-pulse" />
          ) : (
            <ResourceCard
              title="Storage"
              value={storageData.value}
              color="bg-purple-500"
              icon={HardDrive}
            />
          )}
        </div>

        <div className="transition-all duration-300 ease-in-out">
          {isRoutesLoading ? (
            <div className="h-32 rounded-lg bg-muted/50 animate-pulse" />
          ) : (
            <ResourceCard
              title="Sessions"
              value={networkData.value}
              usageLabel={networkData.used}
              total={networkData.total}
              color="bg-green-500"
              icon={Users}
            />
          )}
        </div>
      </div>
    </div>
  );
};
