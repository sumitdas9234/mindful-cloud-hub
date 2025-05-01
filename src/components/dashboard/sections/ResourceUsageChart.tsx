
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { UsageChart } from '@/components/dashboard/UsageChart';
import { 
  fetchCPUTimeSeriesData, 
  fetchMemoryTimeSeriesData, 
  fetchStorageTimeSeriesData 
} from '@/api/dashboardApi';

interface ResourceUsageChartProps {
  vCenterId?: string;
  clusterId?: string;
  tagIds?: string[];
}

export const ResourceUsageChart: React.FC<ResourceUsageChartProps> = ({ vCenterId, clusterId, tagIds }) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [isAnyDataAvailable, setIsAnyDataAvailable] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);
  
  // Separate queries for each time series
  const cpuTimeSeriesQuery = useQuery({
    queryKey: ['cpuTimeSeries', clusterId],
    queryFn: () => fetchCPUTimeSeriesData(clusterId || ''),
    refetchInterval: 60000,
    enabled: !!clusterId,
  });
  
  const memoryTimeSeriesQuery = useQuery({
    queryKey: ['memoryTimeSeries', clusterId],
    queryFn: () => fetchMemoryTimeSeriesData(clusterId || ''),
    refetchInterval: 60000,
    enabled: !!clusterId,
  });
  
  const storageTimeSeriesQuery = useQuery({
    queryKey: ['storageTimeSeries', clusterId],
    queryFn: () => fetchStorageTimeSeriesData(clusterId || ''),
    refetchInterval: 60000,
    enabled: !!clusterId,
  });

  // Process data as it comes in
  useEffect(() => {
    const timeMap = new Map<number, { name: string, cpu?: number, memory?: number, storage?: number }>();
    let hasData = false;
    
    // Process CPU data when available
    if (cpuTimeSeriesQuery.data) {
      cpuTimeSeriesQuery.data.forEach(([timestamp, value]) => {
        const date = new Date(timestamp * 1000);
        const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        if (timeMap.has(timestamp)) {
          const entry = timeMap.get(timestamp)!;
          entry.cpu = value;
        } else {
          timeMap.set(timestamp, { name: formattedTime, cpu: value });
        }
      });
      
      if (cpuTimeSeriesQuery.data.length > 0) hasData = true;
    }
    
    // Process memory data when available
    if (memoryTimeSeriesQuery.data) {
      memoryTimeSeriesQuery.data.forEach(([timestamp, value]) => {
        const date = new Date(timestamp * 1000);
        const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        if (timeMap.has(timestamp)) {
          const entry = timeMap.get(timestamp)!;
          entry.memory = value;
        } else {
          timeMap.set(timestamp, { name: formattedTime, memory: value });
        }
      });
      
      if (memoryTimeSeriesQuery.data.length > 0) hasData = true;
    }
    
    // Process storage data when available
    if (storageTimeSeriesQuery.data) {
      storageTimeSeriesQuery.data.forEach(([timestamp, value]) => {
        const date = new Date(timestamp * 1000);
        const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
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
    
    setChartData(result);
    setIsAnyDataAvailable(hasData);
    
    // Check if all queries are complete
    if (!cpuTimeSeriesQuery.isLoading && !memoryTimeSeriesQuery.isLoading && !storageTimeSeriesQuery.isLoading) {
      setLoadingComplete(true);
    }
    
  }, [cpuTimeSeriesQuery.data, cpuTimeSeriesQuery.isLoading, 
      memoryTimeSeriesQuery.data, memoryTimeSeriesQuery.isLoading, 
      storageTimeSeriesQuery.data, storageTimeSeriesQuery.isLoading]);

  // Debug the data we're receiving
  React.useEffect(() => {
    if (chartData.length > 0) {
      console.log("Resource usage data sample:", chartData.slice(0, 3));
    }
  }, [chartData]);

  // Show loading state while all queries are in progress and no data is yet available
  const isLoading = (!isAnyDataAvailable && 
    (cpuTimeSeriesQuery.isLoading || memoryTimeSeriesQuery.isLoading || storageTimeSeriesQuery.isLoading));
    
  // Show empty state when all queries are complete but no data is available
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
            { key: 'cpu', name: 'CPU', color: '#3b82f6' }, // Bright blue
            { key: 'memory', name: 'Memory', color: '#8b5cf6' }, // Purple
            { key: 'storage', name: 'Storage', color: '#10b981' }, // Green
          ]}
        />
      )}
    </div>
  );
};
