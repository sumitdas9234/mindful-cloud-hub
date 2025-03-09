
import React, { useState, useEffect } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StatsSummary } from '@/components/dashboard/sections/StatsSummary';
import { ResourceUsageChart } from '@/components/dashboard/sections/ResourceUsageChart';
import { SystemLoad } from '@/components/dashboard/sections/SystemLoad';
import { ServerList } from '@/components/dashboard/sections/ServerList';
import { SelectionControls } from '@/components/dashboard/SelectionControls';

const Index = () => {
  const [animateIn, setAnimateIn] = useState(false);
  const [selectedVCenter, setSelectedVCenter] = useState<string>('');
  const [selectedCluster, setSelectedCluster] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  useEffect(() => {
    setAnimateIn(true);
  }, []);

  const handleVCenterChange = (vCenterId: string) => {
    setSelectedVCenter(vCenterId);
  };

  const handleClusterChange = (clusterId: string) => {
    setSelectedCluster(clusterId);
  };

  const handleTagsChange = (tagIds: string[]) => {
    setSelectedTags(tagIds);
  };

  return (
    <div className={`space-y-6 transition-opacity duration-500 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
      <DashboardHeader />
      
      <SelectionControls 
        onVCenterChange={handleVCenterChange} 
        onClusterChange={handleClusterChange}
        onTagsChange={handleTagsChange}
      />
      
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
      
      <ServerList 
        vCenterId={selectedVCenter} 
        clusterId={selectedCluster}
        tagIds={selectedTags}
      />
    </div>
  );
};

export default Index;
