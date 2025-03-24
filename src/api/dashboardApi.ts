
import axios from 'axios';
import { ResourceUsageData, StatsData, SystemLoadData, VCenterClusterData, CountResponse, VCenterData, ClusterData, InfraTagData, ServerData } from './types';
import env from '@/config/env';
import { fetchClusters as fetchAllClusters } from './clustersApi';

// Base API URL from environment config
const BASE_API_URL = env.API_BASE_URL;

// Types for the resource API response
interface ResourceUsageResponse {
  usage: number;
  values: [number, string][];
}

// New interfaces for the updated API responses
interface MetricsResponse {
  esxiCount: number;
  vmsCount: number;
  routesCount: number;
  testbedsCount: number;
  cpuUsage: number;
  memoryUsage: number;
  storageUsage: number;
}

interface TimeseriesResponse {
  cpuUsage: [number, number][];
  memoryUsage: [number, number][];
  storageUsage: [number, number][];
}

// Fetch vCenters and clusters from API using clustersApi
export const fetchVCentersAndClusters = async (): Promise<VCenterClusterData> => {
  try {
    // Fetch all clusters using the existing clustersApi
    const clusters = await fetchAllClusters();
    
    // Create a map of vCenters to clusters
    const vcMap: VCenterClusterData = {};
    
    clusters.forEach(cluster => {
      if (cluster.vc) {
        if (!vcMap[cluster.vc]) {
          vcMap[cluster.vc] = [];
        }
        vcMap[cluster.vc].push(cluster.id);
      }
    });
    
    return vcMap;
  } catch (error) {
    console.error("Error fetching vCenters and clusters:", error);
    return {};
  }
};

// Function to fetch metrics data from the new endpoint
export const fetchMetricsData = async (params: { vCenterId?: string, clusterId?: string }): Promise<MetricsResponse> => {
  try {
    let url = `${BASE_API_URL}/overview/metrics`;
    let queryParams = new URLSearchParams();
    
    if (params.clusterId) {
      queryParams.append('cluster', params.clusterId);
    }
    
    if (params.vCenterId) {
      queryParams.append('vcenter', params.vCenterId);
    }
    
    const response = await axios.get(`${url}?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching metrics data:", error);
    return {
      esxiCount: 0,
      vmsCount: 0,
      routesCount: 0,
      testbedsCount: 0,
      cpuUsage: 0,
      memoryUsage: 0,
      storageUsage: 0
    };
  }
};

// Function to fetch timeseries data from the new endpoint
export const fetchTimeseriesData = async (params: { vCenterId?: string, clusterId?: string }): Promise<TimeseriesResponse> => {
  try {
    let url = `${BASE_API_URL}/overview/timeseries`;
    let queryParams = new URLSearchParams();
    
    if (params.clusterId) {
      queryParams.append('cluster', params.clusterId);
    }
    
    if (params.vCenterId) {
      queryParams.append('vcenter', params.vCenterId);
    }
    
    const response = await axios.get(`${url}?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching timeseries data:", error);
    return {
      cpuUsage: [],
      memoryUsage: [],
      storageUsage: []
    };
  }
};

// Modified function to fetch vCenters
export const fetchVCenters = async (): Promise<{ id: string; name: string }[]> => {
  try {
    const vcenterData = await fetchVCentersAndClusters();
    return Object.keys(vcenterData).map(vcenter => ({
      id: vcenter,
      name: vcenter
    }));
  } catch (error) {
    console.error("Error fetching vCenters:", error);
    return [];
  }
};

// Modified function to fetch clusters for a specific vCenter
export const fetchClustersForVCenter = async (vCenterId: string, tagIds?: string[]): Promise<{ id: string; name: string; vCenterId: string; tags?: string[] }[]> => {
  try {
    // Fetch all clusters using the existing clustersApi
    const allClusters = await fetchAllClusters();
    
    // Filter clusters by vCenter
    const filteredClusters = allClusters.filter(cluster => cluster.vc === vCenterId);
    
    return filteredClusters.map(cluster => ({
      id: cluster.id,
      name: cluster.id, // Using ID as name
      vCenterId: cluster.vc,
      tags: cluster.tags
    }));
  } catch (error) {
    console.error("Error fetching clusters:", error);
    return [];
  }
};

// Fetch all infra tags
export const fetchInfraTags = async (): Promise<{ id: string; name: string }[]> => {
  try {
    const response = await axios.get(`${BASE_API_URL}/tags`);
    return response.data;
  } catch (error) {
    console.error("Error fetching infrastructure tags:", error);
    return [];
  }
};

// Transform metrics data to stats data for the stats cards
export const fetchStatsData = async (params: { vCenterId?: string, clusterId?: string, tagIds?: string[] }): Promise<StatsData[]> => {
  try {
    const metrics = await fetchMetricsData({
      vCenterId: params.vCenterId,
      clusterId: params.clusterId
    });
    
    return [
      {
        title: "Total ESXI Hosts",
        value: metrics.esxiCount.toString(),
        description: "Active infrastructure",
        trend: "up",
        trendValue: "+2 from last month"
      },
      {
        title: "Total Routes",
        value: metrics.routesCount.toString(),
        description: "Network routes",
        trend: "neutral",
        trendValue: "No change"
      },
      {
        title: "Total Testbeds",
        value: metrics.testbedsCount.toString(),
        description: "Dev and test environments",
        trend: "up",
        trendValue: "+3 from last month"
      },
      {
        title: "Total VMs",
        value: metrics.vmsCount.toString(),
        description: "Virtual machines",
        trend: "up",
        trendValue: "+5 from last month"
      }
    ];
  } catch (error) {
    console.error("Error fetching stats data:", error);
    return [];
  }
};

// Updated function to fetch resource usage data from the timeseries endpoint
export const fetchResourceUsageData = async (params: { vCenterId?: string, clusterId?: string, tagIds?: string[] }): Promise<ResourceUsageData[]> => {
  try {
    const timeseries = await fetchTimeseriesData({
      vCenterId: params.vCenterId,
      clusterId: params.clusterId
    });
    
    // Create a merged dataset with timestamps as keys
    const timeMap = new Map<number, { name: string, cpu?: number, memory?: number, storage?: number }>();
    
    // Process CPU data
    timeseries.cpuUsage.forEach(([timestamp, value]) => {
      const date = new Date(timestamp * 1000);
      const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      timeMap.set(timestamp, { 
        name: formattedTime,
        cpu: value
      });
    });
    
    // Process memory data
    timeseries.memoryUsage.forEach(([timestamp, value]) => {
      if (timeMap.has(timestamp)) {
        const entry = timeMap.get(timestamp)!;
        entry.memory = value;
      } else {
        const date = new Date(timestamp * 1000);
        const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        timeMap.set(timestamp, { 
          name: formattedTime,
          memory: value
        });
      }
    });
    
    // Process storage data
    timeseries.storageUsage.forEach(([timestamp, value]) => {
      if (timeMap.has(timestamp)) {
        const entry = timeMap.get(timestamp)!;
        entry.storage = value;
      } else {
        const date = new Date(timestamp * 1000);
        const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        timeMap.set(timestamp, { 
          name: formattedTime,
          storage: value
        });
      }
    });
    
    // Convert map to sorted array
    const result = Array.from(timeMap.entries())
      .sort(([a], [b]) => a - b)
      .map(([_, data]) => data as ResourceUsageData);
    
    return result;
  } catch (error) {
    console.error("Error fetching resource usage data:", error);
    return [];
  }
};

// Updated function to fetch system load data from the metrics endpoint
export const fetchSystemLoad = async (params: { vCenterId?: string, clusterId?: string, tagIds?: string[] }): Promise<SystemLoadData> => {
  try {
    const metrics = await fetchMetricsData({
      vCenterId: params.vCenterId,
      clusterId: params.clusterId
    });
    
    return {
      cpu: metrics.cpuUsage,
      memory: {
        value: metrics.memoryUsage,
        used: `${Math.round(metrics.memoryUsage * 0.5)} GB`,
        total: "50 GB"
      },
      storage: {
        value: metrics.storageUsage,
        used: `${(metrics.storageUsage * 0.1).toFixed(1)} TB`,
        total: "10 TB"
      },
      network: {
        value: 58, // This is still a static value as we don't have a network usage API
        used: metrics.routesCount.toString(),
        total: "1600 active"
      }
    };
  } catch (error) {
    console.error("Error fetching system load:", error);
    return {
      cpu: 0,
      memory: { value: 0, used: "0 GB", total: "0 GB" },
      storage: { value: 0, used: "0 TB", total: "0 TB" },
      network: { value: 0, used: "0", total: "0 active" }
    };
  }
};

// Fetch clusters for specific tags across all vCenters
export const fetchClustersByTags = async (tagIds: string[]): Promise<{ id: string; name: string; vCenterId: string; tags?: string[] }[]> => {
  if (!tagIds || tagIds.length === 0) {
    return [];
  }
  
  try {
    const response = await axios.get(`${BASE_API_URL}/clusters/tags`, {
      params: { tags: tagIds.join(',') }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching clusters by tags:", error);
    return [];
  }
};

// Fetch servers
export const fetchServers = async (params: { 
  vCenterId?: string, 
  clusterId?: string, 
  tagIds?: string[],
  category?: string 
}): Promise<ServerData[]> => {
  if (!params.clusterId) {
    return [];
  }
  
  try {
    const url = `${BASE_API_URL}/cluster/${params.clusterId}/servers`;
    const queryParams: Record<string, string> = {};
    
    if (params.category) {
      queryParams.category = params.category;
    }
    
    if (params.tagIds && params.tagIds.length > 0) {
      queryParams.tags = params.tagIds.join(',');
    }
    
    const response = await axios.get(url, { params: queryParams });
    return response.data;
  } catch (error) {
    console.error("Error fetching servers:", error);
    return [];
  }
};
