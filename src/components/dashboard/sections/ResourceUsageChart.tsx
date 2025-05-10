import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { UsageChart } from "@/components/dashboard/UsageChart";
import {
  fetchCPUTimeSeriesData,
  fetchMemoryTimeSeriesData,
  fetchStorageTimeSeriesData,
  fetchResourceUsageData,
} from "@/api/dashboardApi";

// Define chart data type for better type safety
interface ChartDataPoint {
  name: string;
  cpu?: number;
  memory?: number;
  storage?: number;
}

interface ResourceUsageChartProps {
  vCenterId?: string;
  clusterId?: string;
  tagIds?: string[];
}

export const ResourceUsageChart: React.FC<ResourceUsageChartProps> = ({
  vCenterId,
  clusterId,
  tagIds,
}) => {
  // Only enable queries when we have a clusterId
  const queryEnabled = !!clusterId;

  // Use a single query for all time series data to reduce API calls
  const resourceUsageQuery = useQuery({
    queryKey: ["resourceUsage", clusterId],
    queryFn: () =>
      fetchResourceUsageData({
        vCenterId: vCenterId,
        clusterId: clusterId || "",
        tagIds: tagIds,
      }),
    // Refresh every minute
    refetchInterval: 60000,
    enabled: queryEnabled,
    // Don't refetch on window focus to reduce unnecessary API calls
    refetchOnWindowFocus: false,
  });

  // Fallback to individual queries if the combined query fails or returns empty data
  const cpuTimeSeriesQuery = useQuery({
    queryKey: ["cpuTimeSeries", clusterId],
    queryFn: () => fetchCPUTimeSeriesData(clusterId || ""),
    refetchInterval: 60000,
    enabled:
      queryEnabled &&
      (!resourceUsageQuery.data || resourceUsageQuery.data.length === 0),
    refetchOnWindowFocus: false,
  });

  const memoryTimeSeriesQuery = useQuery({
    queryKey: ["memoryTimeSeries", clusterId],
    queryFn: () => fetchMemoryTimeSeriesData(clusterId || ""),
    refetchInterval: 60000,
    enabled:
      queryEnabled &&
      (!resourceUsageQuery.data || resourceUsageQuery.data.length === 0),
    refetchOnWindowFocus: false,
  });

  const storageTimeSeriesQuery = useQuery({
    queryKey: ["storageTimeSeries", clusterId],
    queryFn: () => fetchStorageTimeSeriesData(clusterId || ""),
    refetchInterval: 60000,
    enabled:
      queryEnabled &&
      (!resourceUsageQuery.data || resourceUsageQuery.data.length === 0),
    refetchOnWindowFocus: false,
  });

  // Process data with useMemo to avoid unnecessary recalculations
  const { chartData, isAnyDataAvailable } = useMemo(() => {
    // If we have data from the combined query, use it
    if (resourceUsageQuery.data && resourceUsageQuery.data.length > 0) {
      return {
        chartData: resourceUsageQuery.data,
        isAnyDataAvailable: true,
      };
    }

    // Otherwise, process individual query data
    const timeMap = new Map<number, ChartDataPoint>();
    let hasData = false;

    // Process CPU data
    if (cpuTimeSeriesQuery.data) {
      cpuTimeSeriesQuery.data.forEach(([timestamp, value]) => {
        const date = new Date(timestamp * 1000);
        const formattedTime = date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        if (timeMap.has(timestamp)) {
          const entry = timeMap.get(timestamp)!;
          entry.cpu = value;
        } else {
          timeMap.set(timestamp, { name: formattedTime, cpu: value });
        }
      });

      if (cpuTimeSeriesQuery.data.length > 0) hasData = true;
    }

    // Process memory data
    if (memoryTimeSeriesQuery.data) {
      memoryTimeSeriesQuery.data.forEach(([timestamp, value]) => {
        const date = new Date(timestamp * 1000);
        const formattedTime = date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        if (timeMap.has(timestamp)) {
          const entry = timeMap.get(timestamp)!;
          entry.memory = value;
        } else {
          timeMap.set(timestamp, { name: formattedTime, memory: value });
        }
      });

      if (memoryTimeSeriesQuery.data.length > 0) hasData = true;
    }

    // Process storage data
    if (storageTimeSeriesQuery.data) {
      storageTimeSeriesQuery.data.forEach(([timestamp, value]) => {
        const date = new Date(timestamp * 1000);
        const formattedTime = date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        if (timeMap.has(timestamp)) {
          const entry = timeMap.get(timestamp)!;
          entry.storage = value;
        } else {
          timeMap.set(timestamp, { name: formattedTime, storage: value });
        }
      });

      if (storageTimeSeriesQuery.data.length > 0) hasData = true;
    }

    // Convert map to sorted array
    const result = Array.from(timeMap.entries())
      .sort(([a], [b]) => a - b)
      .map(([_, data]) => data);

    return {
      chartData: result,
      isAnyDataAvailable: hasData,
    };
  }, [
    resourceUsageQuery.data,
    cpuTimeSeriesQuery.data,
    memoryTimeSeriesQuery.data,
    storageTimeSeriesQuery.data,
  ]);

  // Determine loading and empty states
  const isLoading = useMemo(
    () =>
      !isAnyDataAvailable &&
      (resourceUsageQuery.isLoading ||
        cpuTimeSeriesQuery.isLoading ||
        memoryTimeSeriesQuery.isLoading ||
        storageTimeSeriesQuery.isLoading),
    [
      isAnyDataAvailable,
      resourceUsageQuery.isLoading,
      cpuTimeSeriesQuery.isLoading,
      memoryTimeSeriesQuery.isLoading,
      storageTimeSeriesQuery.isLoading,
    ]
  );

  const loadingComplete = useMemo(
    () =>
      !resourceUsageQuery.isLoading &&
      !cpuTimeSeriesQuery.isLoading &&
      !memoryTimeSeriesQuery.isLoading &&
      !storageTimeSeriesQuery.isLoading,
    [
      resourceUsageQuery.isLoading,
      cpuTimeSeriesQuery.isLoading,
      memoryTimeSeriesQuery.isLoading,
      storageTimeSeriesQuery.isLoading,
    ]
  );

  const isEmpty = loadingComplete && !isAnyDataAvailable;

  return (
    <div className="h-full">
      {isLoading ? (
        <div className="h-80 rounded-lg bg-muted/50 animate-pulse" />
      ) : isEmpty ? (
        <div className="h-80 rounded-lg border border-dashed flex items-center justify-center">
          <p className="text-muted-foreground">No resource data available</p>
        </div>
      ) : (
        <UsageChart
          title="Resource Usage (24h)"
          data={chartData}
          dataKeys={[
            { key: "cpu", name: "CPU", color: "#3b82f6" }, // Bright blue
            { key: "memory", name: "Memory", color: "#8b5cf6" }, // Purple
            { key: "storage", name: "Storage", color: "#10b981" }, // Green
          ]}
        />
      )}
    </div>
  );
};
