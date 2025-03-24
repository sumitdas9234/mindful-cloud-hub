import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsSummary } from "@/components/dashboard/sections/StatsSummary";
import { ResourceUsageChart } from "@/components/dashboard/sections/ResourceUsageChart";
import { SystemLoad } from "@/components/dashboard/sections/SystemLoad";
import { SelectionControls } from "@/components/dashboard/SelectionControls";
import {
  StatCardSkeleton,
  ChartSkeleton,
  ResourceCardSkeleton,
} from "@/components/ui/skeleton";
import {
  fetchStatsData,
  fetchResourceUsageData,
  fetchSystemLoad,
  fetchVCentersAndClusters,
} from "@/api/dashboardApi";
import { Separator } from "@/components/ui/separator";
import { EmptyState } from "@/components/compute/EmptyState";
import { ServerOff } from "lucide-react";
import { ErrorBoundary } from "@/components/ui/error-boundary";

const Index = () => {
  const [selectedVCenter, setSelectedVCenter] = useState<string>("");
  const [selectedCluster, setSelectedCluster] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSelectionChanging, setIsSelectionChanging] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  const vCentersAndClustersQuery = useQuery({
    queryKey: ["vCentersAndClusters"],
    queryFn: fetchVCentersAndClusters,
  });

  const dataQueryEnabled = 
    (!isInitializing && (!!selectedCluster || !!selectedVCenter));

  const statsQuery = useQuery({
    queryKey: [
      "dashboardStats",
      selectedVCenter,
      selectedCluster,
      selectedTags,
    ],
    queryFn: () =>
      fetchStatsData({
        vCenterId: selectedVCenter,
        clusterId: selectedCluster,
        tagIds: selectedTags,
      }),
    enabled: dataQueryEnabled,
  });

  const resourceUsageQuery = useQuery({
    queryKey: ["resourceUsage", selectedVCenter, selectedCluster, selectedTags],
    queryFn: () =>
      fetchResourceUsageData({
        vCenterId: selectedVCenter,
        clusterId: selectedCluster,
        tagIds: selectedTags,
      }),
    enabled: dataQueryEnabled,
  });

  const systemLoadQuery = useQuery({
    queryKey: ["systemLoad", selectedVCenter, selectedCluster, selectedTags],
    queryFn: () =>
      fetchSystemLoad({
        vCenterId: selectedVCenter,
        clusterId: selectedCluster,
        tagIds: selectedTags,
      }),
    enabled: dataQueryEnabled,
  });

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

  useEffect(() => {
    if (
      vCentersAndClustersQuery.data &&
      Object.keys(vCentersAndClustersQuery.data).length > 0 &&
      !selectedVCenter
    ) {
      const firstVCenter = Object.keys(vCentersAndClustersQuery.data)[0];
      setSelectedVCenter(firstVCenter);
      console.log("Setting default vCenter:", firstVCenter);
    }
  }, [vCentersAndClustersQuery.data, selectedVCenter]);

  useEffect(() => {
    if (selectedVCenter && !isInitializing) {
      setIsInitializing(false);
    }
  }, [selectedVCenter, isInitializing]);

  useEffect(() => {
    if (isSelectionChanging && !isFetching) {
      setIsSelectionChanging(false);
    }
  }, [isFetching, isSelectionChanging]);

  const handleVCenterChange = (vCenterId: string) => {
    if (vCenterId !== selectedVCenter) {
      setIsSelectionChanging(true);
      setSelectedVCenter(vCenterId);
      setSelectedCluster(""); // Reset cluster when vCenter changes
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

  useEffect(() => {
    if (selectedVCenter && vCentersAndClustersQuery.isSuccess) {
      setIsInitializing(false);
    }
  }, [selectedVCenter, vCentersAndClustersQuery.isSuccess]);

  const showSkeletons = isLoading || (isSelectionChanging && isFetching);

  const noData = vCentersAndClustersQuery.isSuccess && 
    Object.keys(vCentersAndClustersQuery.data || {}).length === 0;

  if (noData) {
    return (
      <div className="flex flex-col h-full min-h-[calc(100vh-10rem)]">
        <DashboardHeader />
        <div className="flex-1 flex items-center justify-center">
          <EmptyState
            icon={<ServerOff className="h-12 w-12 text-muted-foreground mb-4" />}
            title="No vCenters or Clusters Found"
            description="There are no vCenters or clusters configured in the system."
          />
        </div>
      </div>
    );
  }

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
          disabled={isLoading}
          vCentersAndClusters={vCentersAndClustersQuery.data}
        />

        <Separator className="my-6" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartSkeleton />
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Current System Load</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array(4)
                .fill(0)
                .map((_, i) => (
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

      <ErrorBoundary fallback={
        <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-15rem)]">
          <EmptyState 
            title="Something went wrong" 
            description="There was an error loading the dashboard data." 
          />
        </div>
      }>
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

        {dataQueryEnabled ? (
          <>
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
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-15rem)]">
            <EmptyState
              icon={<ServerOff className="h-8 w-8 text-muted-foreground mb-2" />}
              title="No Data Available"
              description="Please select a vCenter and Cluster to view dashboard data."
            />
          </div>
        )}
      </ErrorBoundary>
    </div>
  );
};

export default Index;
