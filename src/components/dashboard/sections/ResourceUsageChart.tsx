
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { UsageChart } from '@/components/dashboard/UsageChart';
import { fetchResourceUsageData } from '@/api/dashboardApi';

interface ResourceUsageChartProps {
  vCenterId?: string;
  clusterId?: string;
  tagIds?: string[];
}

export const ResourceUsageChart: React.FC<ResourceUsageChartProps> = ({ vCenterId, clusterId, tagIds }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['resourceUsage', vCenterId, clusterId, tagIds],
    queryFn: () => fetchResourceUsageData({ vCenterId, clusterId, tagIds }),
    refetchInterval: 60000, // Refetch every minute
  });

  return (
    <div className="h-full">
      {isLoading ? (
        <div className="h-80 rounded-lg bg-muted/50 animate-pulse" />
      ) : (
        <UsageChart
          title="Resource Usage (24h)"
          data={data || []}
          dataKeys={[
            { key: 'cpu', name: 'CPU', color: 'hsl(var(--primary))' },
            { key: 'memory', name: 'Memory', color: 'hsl(217, 91%, 60%)' },
            { key: 'network', name: 'Network (Mb/s)', color: 'hsl(142, 71%, 45%)' },
          ]}
        />
      )}
    </div>
  );
};
