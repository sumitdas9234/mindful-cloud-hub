
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StatsSummary } from '@/components/dashboard/sections/StatsSummary';
import { ResourceUsageChart } from '@/components/dashboard/sections/ResourceUsageChart';
import { SystemLoad } from '@/components/dashboard/sections/SystemLoad';
import { ManagedServices } from '@/components/dashboard/sections/ManagedServices';
import { SelectionControls } from '@/components/dashboard/SelectionControls';
import { StatCardSkeleton, ChartSkeleton, ResourceCardSkeleton } from '@/components/ui/skeleton';
import { fetchStatsData, fetchResourceUsageData, fetchSystemLoad, fetchVCentersAndClusters } from '@/api/dashboardApi';
import { Separator } from '@/components/ui/separator';

const Index = () => {
  const [selectedVCenter, setSelectedVCenter] = useState<string>('');
  const [selectedCluster, setSelectedCluster] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSelectionChanging, setIsSelectionChanging] = useState(false);
  
  // Fetch vCenters and clusters to populate dropdowns
  const vCentersAndClustersQuery = useQuery({
    queryKey: ['vCentersAndClusters'],
    queryFn: fetchVCentersAndClusters
  });
  
  // Fetch all data in parallel
  const statsQuery = useQuery({
    queryKey: ['dashboardStats', selectedVCenter, selectedCluster, selectedTags],
    queryFn: () => fetchStatsData({ vCenterId: selectedVCenter, clusterId: selectedCluster, tagIds: selectedTags }),
    enabled: !!selectedCluster || !!selectedVCenter
  });
  
  const resourceUsageQuery = useQuery({
    queryKey: ['resourceUsage', selectedVCenter, selectedCluster, selectedTags],
    queryFn: () => fetchResourceUsageData({ vCenterId: selectedVCenter, clusterId: selectedCluster, tagIds: selectedTags }),
    enabled: !!selectedCluster || !!selectedVCenter
  });
  
  const systemLoadQuery = useQuery({
    queryKey: ['systemLoad', selectedVCenter, selectedCluster, selectedTags],
    queryFn: () => fetchSystemLoad({ vCenterId: selectedVCenter, clusterId: selectedCluster, tagIds: selectedTags }),
    enabled: !!selectedCluster || !!selectedVCenter
  });
  
  // Check if all data is loaded
  const isLoading = 
    vCentersAndClustersQuery.isLoading || 
    statsQuery.isLoading || 
    resourceUsageQuery.isLoading || 
    systemLoadQuery.isLoading;
    
  const isFetching = 
    vCentersAndClustersQuery.isFetching || 
    statsQuery.isFetching || 
    resourceUsageQuery.isFetching || 
    systemLoadQuery.isFetching;

  // Set default vCenter and cluster if available and none selected
  useEffect(() => {
    if (vCentersAndClustersQuery.data && Object.keys(vCentersAndClustersQuery.data).length > 0 && !selectedVCenter) {
      const firstVCenter = Object.keys(vCentersAndClustersQuery.data)[0];
      setSelectedVCenter(firstVCenter);
    }
  }, [vCentersAndClustersQuery.data, selectedVCenter]);

  useEffect(() => {
    // When selection changes, show loading state
    if (isSelectionChanging && !isFetching) {
      setIsSelectionChanging(false);
    }
  }, [isFetching, isSelectionChanging]);

  const handleVCenterChange = (vCenterId: string) => {
    if (vCenterId !== selectedVCenter) {
      setIsSelectionChanging(true);
      setSelectedVCenter(vCenterId);
      setSelectedCluster(''); // Reset cluster when vCenter changes
    }
  };

  const handleClusterChange = (clusterId: string) => {
    if (clusterId !== selectedCluster) {
      setIsSelectionChanging(true);
      setSelectedCluster(clusterId);
    }
  };

  const handleTagsChange = (tagIds: string[]) => {
    setIsSelectionChanging(true);
    setSelectedTags(tagIds);
  };

  // Show loading skeletons during initial load or when selections change
  const showSkeletons = isLoading || (isSelectionChanging && isFetching);

  // Render skeleton loading state
  if (showSkeletons) {
    return (
      <div className="space-y-6">
        <DashboardHeader />
        
        <SelectionControls 
          onVCenterChange={handleVCenterChange} 
          onClusterChange={handleClusterChange}
          onTagsChange={handleTagsChange}
          selectedVCenter={selectedVCenter}
          selectedCluster={selectedCluster}
          selectedTags={selectedTags}
          disabled={isLoading} // Only disable during initial load
          vCentersAndClusters={vCentersAndClustersQuery.data}
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
        selectedVCenter={selectedVCenter}
        selectedCluster={selectedCluster}
        selectedTags={selectedTags}
        vCentersAndClusters={vCentersAndClustersQuery.data}
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
      
      {selectedCluster && (
        <ManagedServices
          vCenterId={selectedVCenter}
          clusterId={selectedCluster}
          tagIds={selectedTags}
        />
      )}
    </div>
  );
};

export default Index;
