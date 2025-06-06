import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { fetchClustersForVCenter } from "@/api/dashboardApi";
import { VCenterClusterData } from "@/api/types";
import { EmptyState } from "@/components/compute/EmptyState";
import { ServerOff } from "lucide-react";

interface SelectionControlsProps {
  onVCenterChange: (vCenterId: string) => void;
  onClusterChange: (clusterId: string) => void;
  selectedVCenter?: string;
  selectedCluster?: string;
  disabled?: boolean;
  vCentersAndClusters?: VCenterClusterData;
}

export const SelectionControls: React.FC<SelectionControlsProps> = ({
  onVCenterChange,
  onClusterChange,
  selectedVCenter: propSelectedVCenter = "",
  selectedCluster: propSelectedCluster = "",
  disabled = false,
  vCentersAndClusters = {},
}) => {
  const [selectedVCenter, setSelectedVCenter] =
    useState<string>(propSelectedVCenter);
  const [selectedCluster, setSelectedCluster] =
    useState<string>(propSelectedCluster);

  // Update local state when props change
  useEffect(() => {
    setSelectedVCenter(propSelectedVCenter);
  }, [propSelectedVCenter]);

  useEffect(() => {
    setSelectedCluster(propSelectedCluster);
  }, [propSelectedCluster]);

  // Fetch clusters based on the selected vCenter by name
  const { data: clusters = [], isLoading: isLoadingClusters } = useQuery({
    queryKey: ["clusters", selectedVCenter],
    queryFn: () =>
      selectedVCenter
        ? fetchClustersForVCenter(selectedVCenter)
        : Promise.resolve([]),
    enabled: !!selectedVCenter,
  });

  // Create vCenters list from the data
  const vCenters = Object.keys(vCentersAndClusters).map((vc) => ({
    id: vc,
    name: vc,
  }));

  // Set default vCenter when available
  useEffect(() => {
    if (vCenters.length > 0 && !selectedVCenter) {
      console.log("Setting default vCenter:", vCenters[0].id);
      setSelectedVCenter(vCenters[0].id);
      onVCenterChange(vCenters[0].id);
    }
  }, [vCenters, selectedVCenter, onVCenterChange]);

  // Set default cluster when available
  useEffect(() => {
    // Only if we have clusters and no cluster is selected yet
    if (clusters && clusters.length > 0 && !selectedCluster) {
      console.log("Setting default cluster:", clusters[0].id);
      setSelectedCluster(clusters[0].id);
      onClusterChange(clusters[0].id);
    } else if (selectedVCenter && clusters && clusters.length === 0) {
      // If no clusters available for this vCenter, clear selection
      console.log("No clusters available for vCenter, clearing selection");
      setSelectedCluster("");
      onClusterChange("");
    }
  }, [clusters, selectedCluster, selectedVCenter, onClusterChange]);

  const handleVCenterChange = (value: string) => {
    console.log("vCenter changed to:", value);
    setSelectedVCenter(value);
    setSelectedCluster(""); // Reset cluster when vCenter changes
    onVCenterChange(value);
  };

  const handleClusterChange = (value: string) => {
    console.log("Cluster changed to:", value);
    setSelectedCluster(value);
    onClusterChange(value);
  };

  const isDisabled = disabled || Object.keys(vCentersAndClusters).length === 0;

  // Show loading state for clusters
  const showClusterLoading = isLoadingClusters && selectedVCenter;

  return (
    <div className="flex flex-wrap justify-between mb-6 gap-4">
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-1/2">
        <div className="w-full sm:w-1/2">
          <label className="text-sm font-medium mb-1 block text-muted-foreground">
            vCenter
          </label>
          <Select
            value={selectedVCenter}
            onValueChange={handleVCenterChange}
            disabled={isDisabled}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select vCenter" />
            </SelectTrigger>
            <SelectContent>
              {vCenters.length > 0 ? (
                vCenters.map((vCenter) => (
                  <SelectItem key={vCenter.id} value={vCenter.id}>
                    {vCenter.name}
                  </SelectItem>
                ))
              ) : (
                <div className="p-2 text-center text-muted-foreground">
                  No vCenters available
                </div>
              )}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-1/2">
          <label className="text-sm font-medium mb-1 block text-muted-foreground">
            Cluster
          </label>
          <Select
            value={selectedCluster}
            onValueChange={handleClusterChange}
            disabled={isDisabled || !selectedVCenter || isLoadingClusters}
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={
                  showClusterLoading ? "Loading..." : "Select Cluster"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {clusters.length > 0 ? (
                clusters.map((cluster) => (
                  <SelectItem key={cluster.id} value={cluster.id}>
                    {cluster.name}
                  </SelectItem>
                ))
              ) : (
                <div className="p-2 text-center text-muted-foreground">
                  {isLoadingClusters
                    ? "Loading clusters..."
                    : "No clusters available"}
                </div>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
