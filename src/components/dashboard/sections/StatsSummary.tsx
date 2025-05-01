
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Server, Route, LayoutGrid, Monitor } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { 
  fetchESXIHosts, 
  fetchRoutes, 
  fetchTestbeds, 
  fetchVMsCount 
} from '@/api/dashboardApi';

interface StatsSummaryProps {
  vCenterId?: string;
  clusterId?: string;
  tagIds?: string[];
}

export const StatsSummary: React.FC<StatsSummaryProps> = ({ vCenterId, clusterId, tagIds }) => {
  // Log the current selection for debugging
  React.useEffect(() => {
    if (clusterId) {
      console.log(`Loading stats for cluster: ${clusterId}`);
    }
    if (vCenterId) {
      console.log(`Loading stats for vCenter: ${vCenterId}`);
    }
  }, [clusterId, vCenterId]);

  // Separate queries for each data source
  const esxiQuery = useQuery({
    queryKey: ['esxiHosts', clusterId],
    queryFn: () => fetchESXIHosts(clusterId || ''),
    enabled: !!clusterId,
  });

  const routesQuery = useQuery({
    queryKey: ['routes', clusterId],
    queryFn: () => fetchRoutes(clusterId || ''),
    enabled: !!clusterId,
  });

  const testbedsQuery = useQuery({
    queryKey: ['testbeds', clusterId],
    queryFn: () => fetchTestbeds(clusterId || ''),
    enabled: !!clusterId,
  });

  const vmsQuery = useQuery({
    queryKey: ['vmsCount', clusterId],
    queryFn: () => fetchVMsCount(clusterId || ''),
    enabled: !!clusterId,
  });

  const stats = [
    {
      title: "Total ESXI Hosts",
      value: esxiQuery.data?.length || 0,
      description: "Active infrastructure",
      trend: "up",
      trendValue: "+2 from last month",
      isLoading: esxiQuery.isLoading,
      icon: Server
    },
    {
      title: "Total Routes",
      value: routesQuery.data?.length || 0,
      description: "Network routes",
      trend: "neutral",
      trendValue: "No change",
      isLoading: routesQuery.isLoading,
      icon: Route
    },
    {
      title: "Total Testbeds",
      value: testbedsQuery.data?.length || 0,
      description: "Dev and test environments",
      trend: "up",
      trendValue: "+3 from last month",
      isLoading: testbedsQuery.isLoading,
      icon: LayoutGrid
    },
    {
      title: "Total VMs",
      value: vmsQuery.data || 0,
      description: "Virtual machines",
      trend: "up",
      trendValue: "+5 from last month",
      isLoading: vmsQuery.isLoading,
      icon: Monitor
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="transition-all duration-300 ease-in-out">
          {stat.isLoading ? (
            <div className="h-32 rounded-lg bg-muted/50 animate-pulse" />
          ) : (
            <StatsCard 
              title={stat.title} 
              value={stat.value.toString()}
              description={stat.description}
              icon={stat.icon}
              trend={stat.trend}
              trendValue={stat.trendValue}
            />
          )}
        </div>
      ))}
    </div>
  );
};
