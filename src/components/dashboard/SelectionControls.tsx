
import React, { useState, useEffect } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useQuery } from '@tanstack/react-query';
import { fetchVCenters, fetchClusters } from '@/api/dashboardApi';

interface SelectionControlsProps {
  onVCenterChange: (vCenterId: string) => void;
  onClusterChange: (clusterId: string) => void;
}

export const SelectionControls: React.FC<SelectionControlsProps> = ({
  onVCenterChange,
  onClusterChange
}) => {
  const [selectedVCenter, setSelectedVCenter] = useState<string>('');
  const [selectedCluster, setSelectedCluster] = useState<string>('');

  const { data: vCenters, isLoading: isLoadingVCenters } = useQuery({
    queryKey: ['vCenters'],
    queryFn: fetchVCenters
  });

  const { data: clusters, isLoading: isLoadingClusters } = useQuery({
    queryKey: ['clusters', selectedVCenter],
    queryFn: () => fetchClusters(selectedVCenter),
    enabled: !!selectedVCenter,
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

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
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
  );
};
