import React, { useState, useEffect } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useQuery } from '@tanstack/react-query';
import { fetchVCenters, fetchClusters, fetchInfraTags } from '@/api/dashboardApi';

interface SelectionControlsProps {
  onVCenterChange: (vCenterId: string) => void;
  onClusterChange: (clusterId: string) => void;
  onTagsChange: (tagIds: string[]) => void;
}

export const SelectionControls: React.FC<SelectionControlsProps> = ({
  onVCenterChange,
  onClusterChange,
  onTagsChange
}) => {
  const [selectedVCenter, setSelectedVCenter] = useState<string>('');
  const [selectedCluster, setSelectedCluster] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const { data: vCenters, isLoading: isLoadingVCenters } = useQuery({
    queryKey: ['vCenters'],
    queryFn: fetchVCenters
  });

  const { data: clusters, isLoading: isLoadingClusters } = useQuery({
    queryKey: ['clusters', selectedVCenter, selectedTags],
    queryFn: () => fetchClusters(selectedVCenter, selectedTags),
    enabled: !!selectedVCenter,
  });

  const { data: infraTags, isLoading: isLoadingTags } = useQuery({
    queryKey: ['infraTags'],
    queryFn: fetchInfraTags
  });

  useEffect(() => {
    if (vCenters && vCenters.length > 0 && !selectedVCenter) {
      setSelectedVCenter(vCenters[0].id);
      onVCenterChange(vCenters[0].id);
    }
  }, [vCenters, selectedVCenter, onVCenterChange]);

  useEffect(() => {
    if (clusters && clusters.length > 0 && !selectedCluster) {
      setSelectedCluster(clusters[0].id);
      onClusterChange(clusters[0].id);
    } else if (selectedVCenter && (!clusters || clusters.length === 0)) {
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

  return (
    <div className="flex flex-wrap justify-between mb-6 gap-4">
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-1/2">
        <div className="w-full sm:w-1/2">
          <label className="text-sm font-medium mb-1 block text-muted-foreground">vCenter</label>
          <Select 
            value={selectedVCenter} 
            onValueChange={handleVCenterChange}
            disabled={isLoadingVCenters}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select vCenter" />
            </SelectTrigger>
            <SelectContent>
              {vCenters?.map((vCenter) => (
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
            disabled={isLoadingClusters || !selectedVCenter}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Cluster" />
            </SelectTrigger>
            <SelectContent>
              {clusters?.map((cluster) => (
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
          disabled={isLoadingTags}
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
