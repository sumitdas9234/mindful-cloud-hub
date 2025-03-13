
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StatsSummary } from '@/components/dashboard/sections/StatsSummary';
import { ResourceUsageChart } from '@/components/dashboard/sections/ResourceUsageChart';
import { SystemLoad } from '@/components/dashboard/sections/SystemLoad';
import { SelectionControls } from '@/components/dashboard/SelectionControls';
import { StatCardSkeleton, ChartSkeleton, ResourceCardSkeleton } from '@/components/ui/skeleton';
import { fetchStatsData, fetchResourceUsageData, fetchSystemLoad } from '@/api/dashboardApi';
import { Separator } from '@/components/ui/separator';
import { ManagedServices } from '@/components/dashboard/sections/ManagedServices';

const Index = () => {
  const [selectedVCenter, setSelectedVCenter] = useState<string>('');
  const [selectedCluster, setSelectedCluster] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [isSelectionChanging, setIsSelectionChanging] = useState(false);
  
  // Fetch all data in parallel
  const statsQuery = useQuery({
    queryKey: ['dashboardStats', selectedVCenter, selectedCluster, selectedTags],
    queryFn: () => fetchStatsData({ vCenterId: selectedVCenter, clusterId: selectedCluster, tagIds: selectedTags })
  });
  
  const resourceUsageQuery = useQuery({
    queryKey: ['resourceUsage', selectedVCenter, selectedCluster, selectedTags],
    queryFn: () => fetchResourceUsageData({ vCenterId: selectedVCenter, clusterId: selectedCluster, tagIds: selectedTags }),
  });
  
  const systemLoadQuery = useQuery({
    queryKey: ['systemLoad', selectedVCenter, selectedCluster, selectedTags],
    queryFn: () => fetchSystemLoad({ vCenterId: selectedVCenter, clusterId: selectedCluster, tagIds: selectedTags }),
  });
  
  // Check if all data is loaded
  const isLoading = statsQuery.isLoading || resourceUsageQuery.isLoading || systemLoadQuery.isLoading;
  const isFetching = statsQuery.isFetching || resourceUsageQuery.isFetching || systemLoadQuery.isFetching;

  useEffect(() => {
    if (!isLoading) {
      // Add a small delay to ensure smooth transition
      const timer = setTimeout(() => {
        setIsReady(true);
        setIsSelectionChanging(false);
      }, 100);
      return () => clearTimeout(timer);
    }
    return () => {};
  }, [isLoading]);

  const handleVCenterChange = (vCenterId: string) => {
    setIsSelectionChanging(true);
    setSelectedVCenter(vCenterId);
  };

  const handleClusterChange = (clusterId: string) => {
    setIsSelectionChanging(true);
    setSelectedCluster(clusterId);
  };

  const handleTagsChange = (tagIds: string[]) => {
    setIsSelectionChanging(true);
    setSelectedTags(tagIds);
  };

  // Show loading skeletons during initial load or when selections change
  const showSkeletons = !isReady || isSelectionChanging || isFetching;

  // Render skeleton loading state
  if (showSkeletons) {
    return (
      <div className="space-y-6">
        <DashboardHeader />
        
        <SelectionControls 
          onVCenterChange={handleVCenterChange} 
          onClusterChange={handleClusterChange}
          onTagsChange={handleTagsChange}
          disabled={!isReady} // Disable controls during initial load
        />
        
        <Separator className="my-6" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array(4).fill(0).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartSkeleton />
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Current System Load</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array(4).fill(0).map((_, i) => (
                <ResourceCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <DashboardHeader />
      
      <SelectionControls 
        onVCenterChange={handleVCenterChange} 
        onClusterChange={handleClusterChange}
        onTagsChange={handleTagsChange}
      />
      
      <Separator className="my-6" />
      
      <StatsSummary 
        vCenterId={selectedVCenter} 
        clusterId={selectedCluster}
        tagIds={selectedTags}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ResourceUsageChart 
          vCenterId={selectedVCenter} 
          clusterId={selectedCluster}
          tagIds={selectedTags}
        />
        <SystemLoad 
          vCenterId={selectedVCenter} 
          clusterId={selectedCluster}
          tagIds={selectedTags}
        />
      </div>
      
      <ManagedServices
        vCenterId={selectedVCenter}
        clusterId={selectedCluster}
        tagIds={selectedTags}
      />
    </div>
  );
};

export default Index;
