
import React, { useState, useEffect } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useQuery } from '@tanstack/react-query';
import { fetchInfraTags } from '@/api/dashboardApi';
import { VCenterClusterData } from '@/api/types';

interface SelectionControlsProps {
  onVCenterChange: (vCenterId: string) => void;
  onClusterChange: (clusterId: string) => void;
  onTagsChange: (tagIds: string[]) => void;
  selectedVCenter?: string;
  selectedCluster?: string;
  selectedTags?: string[];
  disabled?: boolean;
  vCentersAndClusters?: VCenterClusterData;
}

export const SelectionControls: React.FC<SelectionControlsProps> = ({
  onVCenterChange,
  onClusterChange,
  onTagsChange,
  selectedVCenter: propSelectedVCenter = '',
  selectedCluster: propSelectedCluster = '',
  selectedTags: propSelectedTags = [],
  disabled = false,
  vCentersAndClusters = {}
}) => {
  const [selectedVCenter, setSelectedVCenter] = useState<string>(propSelectedVCenter);
  const [selectedCluster, setSelectedCluster] = useState<string>(propSelectedCluster);
  const [selectedTags, setSelectedTags] = useState<string[]>(propSelectedTags);

  // Update local state when props change
  useEffect(() => {
    setSelectedVCenter(propSelectedVCenter);
  }, [propSelectedVCenter]);

  useEffect(() => {
    setSelectedCluster(propSelectedCluster);
  }, [propSelectedCluster]);

  useEffect(() => {
    setSelectedTags(propSelectedTags);
  }, [propSelectedTags]);

  const { data: infraTags, isLoading: isLoadingTags } = useQuery({
    queryKey: ['infraTags'],
    queryFn: fetchInfraTags
  });

  // Create vCenters list from the data
  const vCenters = Object.keys(vCentersAndClusters).map(vc => ({
    id: vc,
    name: vc
  }));

  // Get clusters for the selected vCenter
  const clusters = selectedVCenter && vCentersAndClusters[selectedVCenter] 
    ? vCentersAndClusters[selectedVCenter].map(clusterId => ({
        id: clusterId,
        name: clusterId
      }))
    : [];

  useEffect(() => {
    if (vCenters.length > 0 && !selectedVCenter) {
      setSelectedVCenter(vCenters[0].id);
      onVCenterChange(vCenters[0].id);
    }
  }, [vCenters, selectedVCenter, onVCenterChange]);

  useEffect(() => {
    if (clusters.length > 0 && !selectedCluster) {
      setSelectedCluster(clusters[0].id);
      onClusterChange(clusters[0].id);
    } else if (selectedVCenter && clusters.length === 0) {
      setSelectedCluster('');
      onClusterChange('');
    }
  }, [clusters, selectedCluster, selectedVCenter, onClusterChange]);

  const handleVCenterChange = (value: string) => {
    setSelectedVCenter(value);
    setSelectedCluster(''); // Reset cluster when vCenter changes
    onVCenterChange(value);
  };

  const handleClusterChange = (value: string) => {
    setSelectedCluster(value);
    onClusterChange(value);
  };

  const handleTagsChange = (value: string) => {
    let newTags: string[];
    
    if (selectedTags.includes(value)) {
      // If already selected, remove it
      newTags = selectedTags.filter(tag => tag !== value);
    } else {
      // Otherwise add it
      newTags = [...selectedTags, value];
    }
    
    setSelectedTags(newTags);
    onTagsChange(newTags);
  };

  const isDisabled = disabled || Object.keys(vCentersAndClusters).length === 0 || isLoadingTags;

  return (
    <div className="flex flex-wrap justify-between mb-6 gap-4">
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-1/2">
        <div className="w-full sm:w-1/2">
          <label className="text-sm font-medium mb-1 block text-muted-foreground">vCenter</label>
          <Select 
            value={selectedVCenter} 
            onValueChange={handleVCenterChange}
            disabled={isDisabled}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select vCenter" />
            </SelectTrigger>
            <SelectContent>
              {vCenters.map((vCenter) => (
                <SelectItem key={vCenter.id} value={vCenter.id}>
                  {vCenter.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-1/2">
          <label className="text-sm font-medium mb-1 block text-muted-foreground">Cluster</label>
          <Select 
            value={selectedCluster} 
            onValueChange={handleClusterChange}
            disabled={isDisabled || !selectedVCenter || clusters.length === 0}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Cluster" />
            </SelectTrigger>
            <SelectContent>
              {clusters.map((cluster) => (
                <SelectItem key={cluster.id} value={cluster.id}>
                  {cluster.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="w-full sm:w-auto">
        <label className="text-sm font-medium mb-1 block text-muted-foreground">Infra Tags</label>
        <Select 
          disabled={isDisabled}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by Tags" />
          </SelectTrigger>
          <SelectContent>
            {infraTags?.map((tag) => (
              <SelectItem 
                key={tag.id} 
                value={tag.id}
                onClick={() => handleTagsChange(tag.id)}
                className={selectedTags.includes(tag.id) ? "bg-secondary" : ""}
              >
                <span className="flex items-center gap-2">
                  {tag.name}
                  {selectedTags.includes(tag.id) && (
                    <span className="h-2 w-2 rounded-full bg-primary"></span>
                  )}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
