import axios from 'axios';
import { ResourceUsageData, StatsData, SystemLoadData, VCenterClusterData, CountResponse, VCenterData, ClusterData, InfraTagData } from './types';
import env from '@/config/env';
import { fetchClusters as fetchAllClustersFromApi } from './clustersApi';

// Base API URL from environment config
const BASE_API_URL = env.API_BASE_URL;

// Types for the resource API response
interface ResourceUsageResponse {
  usage: number;
  values: [number, string][];
}

// New interfaces for the system resource data responses
interface ResourceValue {
  value: number;
}

interface TimeSeriesPoints {
  points: [number, number][];
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

// New interface for ESXI host data
interface ESXIHost {
  name: string;
  vcenter: string;
  cluster: string;
}

// New interface for Route data
interface RouteData {
  id: string;
  name: string;
  subnet: string;
  status: string;
  expiry: string;
  testbed: string;
  vip?: {
    fqdn: string;
    ip: string;
  };
  apps?: {
    fqdn: string;
    ip: string;
  };
}

// New interface for Testbed data
interface TestbedData {
  testbed: string;
  isActive: boolean;
  owner: string;
  lease: number;
  environment: string | null;
  testbedName: string | null;
  metadata: any | null;
  isWhitelisted: boolean;
  comments: string | null;
  "CreatedOn(UTC)": string;
  "ExpiresOn(UTC)": string;
  vms: string[];
  tags: string[] | null;
  id: string;
}

// Fetch vCenters and clusters from API using clustersApi
export const fetchVCentersAndClusters = async (): Promise<VCenterClusterData> => {
  try {
    // Fetch all clusters using the existing clustersApi
    const clusters = await fetchAllClustersFromApi();
    
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
export const fetchClustersForVCenter = async (vCenterName: string, tagIds?: string[]): Promise<{ id: string; name: string }[]> => {
  try {
    console.log("Fetching clusters for vCenter:", vCenterName);
    
    // Fetch all clusters using the existing clustersApi
    const allClusters = await fetchAllClustersFromApi();
    
    // Filter clusters by vCenter name
    const filteredClusters = allClusters.filter(cluster => cluster.vc === vCenterName);
    
    console.log("Filtered clusters:", filteredClusters);
    
    return filteredClusters.map(cluster => {
      // Use cluster.id for both id and name
      return {
        id: cluster.id,
        name: cluster.id // Use the same ID as the name for display
      };
    });
  } catch (error) {
    console.error("Error fetching clusters for vCenter:", error);
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

// New function to fetch ESXI hosts for a specific cluster
export const fetchESXIHosts = async (clusterId: string): Promise<ESXIHost[]> => {
  try {
    if (!clusterId) {
      return [];
    }
    
    const response = await axios.get(`${BASE_API_URL}/clusters/${clusterId}/esxi`);
    return response.data;
  } catch (error) {
    console.error("Error fetching ESXI hosts:", error);
    return [];
  }
};

// New function to fetch routes for a specific cluster
export const fetchRoutes = async (clusterId: string): Promise<RouteData[]> => {
  try {
    if (!clusterId) {
      return [];
    }
    
    const response = await axios.get(`${BASE_API_URL}/routes/?cluster=${clusterId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching routes:", error);
    return [];
  }
};

// New function to fetch testbeds for a specific cluster
export const fetchTestbeds = async (clusterId: string): Promise<TestbedData[]> => {
  try {
    if (!clusterId) {
      return [];
    }
    
    const response = await axios.get(`${BASE_API_URL}/testbeds/?cluster=${clusterId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching testbeds:", error);
    return [];
  }
};

// Mock function to simulate VM count API
export const fetchVMsCount = async (clusterId: string): Promise<number> => {
  // Simulate API call with random VM count between 10-50
  return new Promise((resolve) => {
    setTimeout(() => {
      const randomCount = Math.floor(Math.random() * 41) + 10; // Random number between 10-50
      resolve(randomCount);
    }, 200); // Simulate a short delay
  });
};

// New function to fetch CPU usage for a specific cluster
export const fetchCPUUsage = async (clusterId: string): Promise<number> => {
  try {
    if (!clusterId) {
      return 0;
    }
    
    const response = await axios.get<ResourceValue>(`${BASE_API_URL}/clusters/${clusterId}/cpu`);
    return response.data.value;
  } catch (error) {
    console.error("Error fetching CPU usage:", error);
    return 0;
  }
};

// New function to fetch Memory usage for a specific cluster
export const fetchMemoryUsage = async (clusterId: string): Promise<number> => {
  try {
    if (!clusterId) {
      return 0;
    }
    
    const response = await axios.get<ResourceValue>(`${BASE_API_URL}/clusters/${clusterId}/memory`);
    return response.data.value;
  } catch (error) {
    console.error("Error fetching Memory usage:", error);
    return 0;
  }
};

// New function to fetch Storage usage for a specific cluster
export const fetchStorageUsage = async (clusterId: string): Promise<number> => {
  try {
    if (!clusterId) {
      return 0;
    }
    
    const response = await axios.get<ResourceValue>(`${BASE_API_URL}/clusters/${clusterId}/storage`);
    return response.data.value;
  } catch (error) {
    console.error("Error fetching Storage usage:", error);
    return 0;
  }
};

// New function to fetch CPU usage time series for a specific cluster
export const fetchCPUTimeSeriesData = async (clusterId: string): Promise<[number, number][]> => {
  try {
    if (!clusterId) {
      return [];
    }
    
    // Calculate start (24 hours ago) and end (now) timestamps
    const end = Math.floor(Date.now() / 1000);
    const start = end - (24 * 60 * 60); // 24 hours in seconds
    
    const response = await axios.get<TimeSeriesPoints>(
      `${BASE_API_URL}/clusters/${clusterId}/cpu?start=${start}&end=${end}`
    );
    return response.data.points || [];
  } catch (error) {
    console.error("Error fetching CPU time series data:", error);
    return [];
  }
};

// New function to fetch Memory usage time series for a specific cluster
export const fetchMemoryTimeSeriesData = async (clusterId: string): Promise<[number, number][]> => {
  try {
    if (!clusterId) {
      return [];
    }
    
    // Calculate start (24 hours ago) and end (now) timestamps
    const end = Math.floor(Date.now() / 1000);
    const start = end - (24 * 60 * 60); // 24 hours in seconds
    
    const response = await axios.get<TimeSeriesPoints>(
      `${BASE_API_URL}/clusters/${clusterId}/memory?start=${start}&end=${end}`
    );
    return response.data.points || [];
  } catch (error) {
    console.error("Error fetching Memory time series data:", error);
    return [];
  }
};

// New function to fetch Storage usage time series for a specific cluster
export const fetchStorageTimeSeriesData = async (clusterId: string): Promise<[number, number][]> => {
  try {
    if (!clusterId) {
      return [];
    }
    
    // Calculate start (24 hours ago) and end (now) timestamps
    const end = Math.floor(Date.now() / 1000);
    const start = end - (24 * 60 * 60); // 24 hours in seconds
    
    const response = await axios.get<TimeSeriesPoints>(
      `${BASE_API_URL}/clusters/${clusterId}/storage?start=${start}&end=${end}`
    );
    return response.data.points || [];
  } catch (error) {
    console.error("Error fetching Storage time series data:", error);
    return [];
  }
};

// Transform metrics data to stats data for the stats cards
export const fetchStatsData = async (params: { vCenterId?: string, clusterId?: string, tagIds?: string[] }): Promise<StatsData[]> => {
  try {
    // Parallel API calls to fetch all required data
    const [esxiHosts, routes, testbeds, vmsCount] = await Promise.all([
      params.clusterId ? fetchESXIHosts(params.clusterId) : Promise.resolve([]),
      params.clusterId ? fetchRoutes(params.clusterId) : Promise.resolve([]),
      params.clusterId ? fetchTestbeds(params.clusterId) : Promise.resolve([]),
      params.clusterId ? fetchVMsCount(params.clusterId) : Promise.resolve(0)
    ]);
    
    return [
      {
        title: "Total ESXI Hosts",
        value: esxiHosts.length.toString(),
        description: "Active infrastructure",
        trend: "up",
        trendValue: "+2 from last month"
      },
      {
        title: "Total Routes",
        value: routes.length.toString(),
        description: "Network routes",
        trend: "neutral",
        trendValue: "No change"
      },
      {
        title: "Total Testbeds",
        value: testbeds.length.toString(),
        description: "Dev and test environments",
        trend: "up",
        trendValue: "+3 from last month"
      },
      {
        title: "Total VMs",
        value: vmsCount.toString(),
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

// Updated function to fetch resource usage data from the new time series endpoints
export const fetchResourceUsageData = async (params: { vCenterId?: string, clusterId?: string, tagIds?: string[] }): Promise<ResourceUsageData[]> => {
  try {
    if (!params.clusterId) {
      return [];
    }
    
    // Fetch time series data for all resources in parallel
    const [cpuData, memoryData, storageData] = await Promise.all([
      fetchCPUTimeSeriesData(params.clusterId),
      fetchMemoryTimeSeriesData(params.clusterId),
      fetchStorageTimeSeriesData(params.clusterId)
    ]);
    
    // Create a merged dataset with timestamps as keys
    const timeMap = new Map<number, { name: string, cpu?: number, memory?: number, storage?: number }>();
    
    // Process CPU data
    cpuData.forEach(([timestamp, value]) => {
      const date = new Date(timestamp * 1000);
      const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      timeMap.set(timestamp, { 
        name: formattedTime,
        cpu: value
      });
    });
    
    // Process memory data
    memoryData.forEach(([timestamp, value]) => {
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
    storageData.forEach(([timestamp, value]) => {
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

// Updated function to fetch system load data from the new CPU, Memory, and Storage endpoints
export const fetchSystemLoad = async (params: { vCenterId?: string, clusterId?: string, tagIds?: string[] }): Promise<SystemLoadData> => {
  try {
    if (!params.clusterId) {
      return {
        cpu: 0,
        memory: { value: 0, used: "0 GB", total: "0 GB" },
        storage: { value: 0, used: "0 TB", total: "0 TB" },
        network: { value: 0, used: "0", total: "0 active" }
      };
    }
    
    // Fetch all resource usage data in parallel
    const [cpuUsage, memoryUsage, storageUsage, routes] = await Promise.all([
      fetchCPUUsage(params.clusterId),
      fetchMemoryUsage(params.clusterId),
      fetchStorageUsage(params.clusterId),
      fetchRoutes(params.clusterId)
    ]);
    
    return {
      cpu: cpuUsage,
      memory: {
        value: memoryUsage,
        used: `${Math.round(memoryUsage * 0.5)} GB`,
        total: "50 GB"
      },
      storage: {
        value: storageUsage,
        used: `${(storageUsage * 0.1).toFixed(1)} TB`,
        total: "10 TB"
      },
      network: {
        value: 58, // This is still a static value as we don't have a network usage API
        used: routes.length.toString(),
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
}): Promise<any[]> => {
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
