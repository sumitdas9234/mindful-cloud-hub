import { useState, useEffect, useCallback, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import { useDebounce } from "@/hooks";

const Index = () => {
  const queryClient = useQueryClient();
  const [selectedVCenter, setSelectedVCenter] = useState<string>("");
  const [selectedCluster, setSelectedCluster] = useState<string>("");
  const [isSelectionChanging, setIsSelectionChanging] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Debounce selection changes to reduce unnecessary API calls
  const debouncedVCenter = useDebounce(selectedVCenter, 300);
  const debouncedCluster = useDebounce(selectedCluster, 300);

  // Fetch vCenters and clusters data
  const vCentersAndClustersQuery = useQuery({
    queryKey: ["vCentersAndClusters"],
    queryFn: fetchVCentersAndClusters,
    // This data changes infrequently, so we can cache it longer
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Only enable data queries when we have a selection and initialization is complete
  const dataQueryEnabled = useMemo(
    () => !isInitializing && (!!debouncedCluster || !!debouncedVCenter),
    [isInitializing, debouncedCluster, debouncedVCenter]
  );

  // Fetch stats data (ESXI hosts, routes, testbeds, VMs)
  const statsQuery = useQuery({
    queryKey: ["dashboardStats", debouncedVCenter, debouncedCluster],
    queryFn: () =>
      fetchStatsData({
        vCenterId: debouncedVCenter,
        clusterId: debouncedCluster,
      }),
    enabled: dataQueryEnabled,
  });

  // Fetch resource usage data for charts
  const resourceUsageQuery = useQuery({
    queryKey: ["resourceUsage", debouncedVCenter, debouncedCluster],
    queryFn: () =>
      fetchResourceUsageData({
        vCenterId: debouncedVCenter,
        clusterId: debouncedCluster,
      }),
    enabled: dataQueryEnabled,
  });

  // Fetch system load data
  const systemLoadQuery = useQuery({
    queryKey: ["systemLoad", debouncedVCenter, debouncedCluster],
    queryFn: () =>
      fetchSystemLoad({
        vCenterId: debouncedVCenter,
        clusterId: debouncedCluster,
      }),
    enabled: dataQueryEnabled,
  });

  // Prefetch data when selection changes
  useEffect(() => {
    if (dataQueryEnabled) {
      // Prefetch stats data
      queryClient.prefetchQuery({
        queryKey: ["dashboardStats", debouncedVCenter, debouncedCluster],
        queryFn: () =>
          fetchStatsData({
            vCenterId: debouncedVCenter,
            clusterId: debouncedCluster,
          }),
      });
    }
  }, [queryClient, dataQueryEnabled, debouncedVCenter, debouncedCluster]);

  // Track loading and fetching states
  const isLoading = useMemo(
    () =>
      vCentersAndClustersQuery.isLoading ||
      statsQuery.isLoading ||
      resourceUsageQuery.isLoading ||
      systemLoadQuery.isLoading,
    [
      vCentersAndClustersQuery.isLoading,
      statsQuery.isLoading,
      resourceUsageQuery.isLoading,
      systemLoadQuery.isLoading,
    ]
  );

  const isFetching = useMemo(
    () =>
      vCentersAndClustersQuery.isFetching ||
      statsQuery.isFetching ||
      resourceUsageQuery.isFetching ||
      systemLoadQuery.isFetching,
    [
      vCentersAndClustersQuery.isFetching,
      statsQuery.isFetching,
      resourceUsageQuery.isFetching,
      systemLoadQuery.isFetching,
    ]
  );

  // Set default vCenter when data is loaded
  useEffect(() => {
    if (
      vCentersAndClustersQuery.data &&
      Object.keys(vCentersAndClustersQuery.data).length > 0 &&
      !selectedVCenter
    ) {
      const firstVCenter = Object.keys(vCentersAndClustersQuery.data)[0];
      setSelectedVCenter(firstVCenter);
    }
  }, [vCentersAndClustersQuery.data, selectedVCenter]);

  // Mark initialization as complete when vCenter is selected
  useEffect(() => {
    if (selectedVCenter && isInitializing) {
      setIsInitializing(false);
    }
  }, [selectedVCenter, isInitializing]);

  // Reset selection changing state when fetching completes
  useEffect(() => {
    if (isSelectionChanging && !isFetching) {
      setIsSelectionChanging(false);
    }
  }, [isFetching, isSelectionChanging]);

  // Memoize handlers to prevent unnecessary re-renders
  const handleVCenterChange = useCallback(
    (vCenterId: string) => {
      if (vCenterId !== selectedVCenter) {
        setIsSelectionChanging(true);
        setSelectedVCenter(vCenterId);
        setSelectedCluster(""); // Reset cluster when vCenter changes
      }
    },
    [selectedVCenter]
  );

  const handleClusterChange = useCallback(
    (clusterId: string) => {
      if (clusterId !== selectedCluster) {
        setIsSelectionChanging(true);
        setSelectedCluster(clusterId);
      }
    },
    [selectedCluster]
  );

  const showSkeletons = isLoading || (isSelectionChanging && isFetching);

  const noData =
    vCentersAndClustersQuery.isSuccess &&
    Object.keys(vCentersAndClustersQuery.data || {}).length === 0;

  if (noData) {
    return (
      <div className="flex flex-col h-full min-h-[calc(100vh-10rem)]">
        <DashboardHeader />
        <div className="flex-1 flex items-center justify-center">
          <EmptyState
            icon={
              <ServerOff className="h-12 w-12 text-muted-foreground mb-4" />
            }
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
          selectedVCenter={selectedVCenter}
          selectedCluster={selectedCluster}
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

      <ErrorBoundary
        fallback={
          <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-15rem)]">
            <EmptyState
              title="Something went wrong"
              description="There was an error loading the dashboard data."
            />
          </div>
        }
      >
        <SelectionControls
          onVCenterChange={handleVCenterChange}
          onClusterChange={handleClusterChange}
          selectedVCenter={selectedVCenter}
          selectedCluster={selectedCluster}
          vCentersAndClusters={vCentersAndClustersQuery.data}
        />

        <Separator className="my-6" />

        {dataQueryEnabled ? (
          <>
            <StatsSummary
              vCenterId={selectedVCenter}
              clusterId={selectedCluster}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ResourceUsageChart
                vCenterId={selectedVCenter}
                clusterId={selectedCluster}
              />
              <SystemLoad
                vCenterId={selectedVCenter}
                clusterId={selectedCluster}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-15rem)]">
            <EmptyState
              icon={
                <ServerOff className="h-8 w-8 text-muted-foreground mb-2" />
              }
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
