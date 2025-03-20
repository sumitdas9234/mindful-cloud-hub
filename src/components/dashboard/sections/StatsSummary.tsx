
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Server, Route, LayoutGrid, Monitor } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { fetchStatsData, fetchClusters } from '@/api/dashboardApi';

interface StatsSummaryProps {
  vCenterId?: string;
  clusterId?: string;
  tagIds?: string[];
}

export const StatsSummary: React.FC<StatsSummaryProps> = ({ vCenterId, clusterId, tagIds }) => {
  // Get cluster name for debugging
  const { data: clusters } = useQuery({
    queryKey: ['clusters', vCenterId],
    queryFn: () => vCenterId ? fetchClusters(vCenterId) : Promise.resolve([]),
    enabled: !!vCenterId,
  });

  const clusterName = clusterId && clusters ? 
    clusters.find(c => c.id === clusterId)?.name : undefined;

  // Log the current selection for debugging
  React.useEffect(() => {
    if (clusterId && clusterName) {
      console.log(`Loading stats for cluster: ${clusterName} (${clusterId})`);
    }
  }, [clusterId, clusterName]);

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboardStats', vCenterId, clusterId, tagIds],
    queryFn: () => fetchStatsData({ vCenterId, clusterId, tagIds })
  });

  const iconMap = {
    "Total ESXI Hosts": Server,
    "Total Routes": Route,
    "Total Testbeds": LayoutGrid,
    "Total VMs": Monitor
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {isLoading ? (
        // Loading placeholders
        Array(4).fill(0).map((_, i) => (
          <div key={i} className="h-32 rounded-lg bg-muted/50 animate-pulse" />
        ))
      ) : (
        stats?.map((stat, index) => (
          <StatsCard 
            key={index}
            title={stat.title} 
            value={stat.value}
            description={stat.description}
            icon={iconMap[stat.title as keyof typeof iconMap] || Monitor}
            trend={stat.trend}
            trendValue={stat.trendValue}
          />
        ))
      )}
    </div>
  );
};
