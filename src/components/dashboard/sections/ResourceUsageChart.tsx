
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
    enabled: !!(clusterId || vCenterId),
  });

  // Debug the data we're receiving
  React.useEffect(() => {
    if (data && data.length > 0) {
      console.log("Resource usage data sample:", data.slice(0, 3));
    }
  }, [data]);

  return (
    <div className="h-full">
      {isLoading ? (
        <div className="h-80 rounded-lg bg-muted/50 animate-pulse" />
      ) : (
        <UsageChart
          title="Resource Usage (24h)"
          data={data || []}
          dataKeys={[
            { key: 'cpu', name: 'CPU', color: '#3b82f6' }, // Bright blue
            { key: 'memory', name: 'Memory', color: '#8b5cf6' }, // Purple
            { key: 'storage', name: 'Storage', color: '#10b981' }, // Green
          ]}
        />
      )}
    </div>
  );
};
