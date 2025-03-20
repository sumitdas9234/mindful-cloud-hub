import axios from 'axios';
import { ServerData, ResourceUsageData, StatsData, SystemLoadData, VCenterClusterData, CountResponse, VCenterData, ClusterData, InfraTagData } from './types';
import env from '@/config/env';

// Base API URL from environment config
const BASE_API_URL = env.API_BASE_URL;

// Resource usage API URLs
const RESOURCE_URLS = {
  cpu: 'https://run.mocky.io/v3/017f8e99-9d68-4fe2-8872-df0f393a5825',
  memory: 'https://run.mocky.io/v3/b01b3418-b832-4cad-9051-464b1de82f4a',
  storage: 'https://run.mocky.io/v3/260d19e4-bbac-4528-8722-7941e2d04d4d'
};

// Types for the new resource API response
interface ResourceUsageResponse {
  usage: number;
  values: [number, string][];
}

// Fetch vCenters and clusters from API
export const fetchVCentersAndClusters = async (): Promise<VCenterClusterData> => {
  try {
    const response = await axios.get(`${BASE_API_URL}/overview`);
    return response.data;
  } catch (error) {
    console.error("Error fetching vCenters and clusters:", error);
    return {};
  }
};

// Fetch count data from API with cluster-specific endpoint
export const fetchCountData = async (metric: string, clusterName?: string): Promise<number> => {
  try {
    if (!clusterName) {
      console.error(`No cluster name provided for ${metric} count`);
      return 0;
    }
    
    // Build the endpoint based on the metric
    const endpoint = `${BASE_API_URL}/cluster/${clusterName}/${metric}`;
    
    console.log(`Fetching ${metric} from endpoint: ${endpoint}`);
    
    try {
      const response = await axios.get<CountResponse>(endpoint);
      return response.data.count;
    } catch (apiError) {
      console.error(`Error fetching ${metric} from API:`, apiError);
      return 0;
    }
  } catch (error) {
    console.error(`Error fetching ${metric} count:`, error);
    return 0;
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
export const fetchClusters = async (vCenterId: string, tagIds?: string[]): Promise<{ id: string; name: string; vCenterId: string; tags?: string[] }[]> => {
  try {
    const vcenterData = await fetchVCentersAndClusters();
    const clusters = vcenterData[vCenterId] || [];
    
    return clusters.map(cluster => ({
      id: cluster,
      name: cluster,
      vCenterId,
      tags: []
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

// Fetch resource usage data for CPU, Memory, and Storage
export const fetchResourceUsageData = async (params: { vCenterId?: string, clusterId?: string, tagIds?: string[] }): Promise<ResourceUsageData[]> => {
  try {
    if (!params.clusterId) {
      return [];
    }
    
    try {
      // Fetch data from all resource endpoints
      const [cpuResponse, memoryResponse, storageResponse] = await Promise.all([
        axios.get<ResourceUsageResponse>(RESOURCE_URLS.cpu),
        axios.get<ResourceUsageResponse>(RESOURCE_URLS.memory),
        axios.get<ResourceUsageResponse>(RESOURCE_URLS.storage)
      ]);
      
      // Create a merged dataset with timestamps as keys
      const timeMap = new Map<number, { name: string, cpu?: number, memory?: number, storage?: number }>();
      
      // Process CPU data
      cpuResponse.data.values.forEach(([timestamp, value]) => {
        const date = new Date(timestamp * 1000);
        const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        timeMap.set(timestamp, { 
          name: formattedTime,
          cpu: parseFloat(value)
        });
      });
      
      // Process memory data
      memoryResponse.data.values.forEach(([timestamp, value]) => {
        if (timeMap.has(timestamp)) {
          const entry = timeMap.get(timestamp)!;
          entry.memory = parseFloat(value);
        } else {
          const date = new Date(timestamp * 1000);
          const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          timeMap.set(timestamp, { 
            name: formattedTime,
            memory: parseFloat(value)
          });
        }
      });
      
      // Process storage data
      storageResponse.data.values.forEach(([timestamp, value]) => {
        if (timeMap.has(timestamp)) {
          const entry = timeMap.get(timestamp)!;
          entry.storage = parseFloat(value);
        } else {
          const date = new Date(timestamp * 1000);
          const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          timeMap.set(timestamp, { 
            name: formattedTime,
            storage: parseFloat(value)
          });
        }
      });
      
      // Convert map to sorted array
      const result = Array.from(timeMap.entries())
        .sort(([a], [b]) => a - b)
        .map(([_, data]) => data as ResourceUsageData);
      
      return result;
    } catch (apiError) {
      console.error("Error fetching resource usage data from API:", apiError);
      return [];
    }
  } catch (error) {
    console.error("Error fetching resource usage data:", error);
    return [];
  }
};

// Updated function to fetch stats data using the cluster-specific API endpoints
export const fetchStatsData = async (params: { vCenterId?: string, clusterId?: string, tagIds?: string[] }): Promise<StatsData[]> => {
  try {
    // Get the actual cluster name if cluster ID is provided
    let clusterName = params.clusterId;
    if (!clusterName) {
      return [];
    }

    // Fetch all count data in parallel for better performance
    const [hostsCount, routesCount, testbedsCount, vmsCount] = await Promise.all([
      fetchCountData('hosts', clusterName),
      fetchCountData('routes', clusterName),
      fetchCountData('testbeds', clusterName),
      fetchCountData('vms', clusterName)
    ]);
    
    return [
      {
        title: "Total ESXI Hosts",
        value: hostsCount.toString(),
        description: "Active infrastructure",
        trend: "up",
        trendValue: "+2 from last month"
      },
      {
        title: "Total Routes",
        value: routesCount.toString(),
        description: "Network routes",
        trend: "neutral",
        trendValue: "No change"
      },
      {
        title: "Total Testbeds",
        value: testbedsCount.toString(),
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

// Updated function to fetch system load with real-time resource usage data
export const fetchSystemLoad = async (params: { vCenterId?: string, clusterId?: string, tagIds?: string[] }): Promise<SystemLoadData> => {
  try {
    const clusterName = params.clusterId;
    if (!clusterName) {
      throw new Error("No cluster selected");
    }
    
    try {
      // Fetch current usage data from all resource endpoints
      const [cpuResponse, memoryResponse, storageResponse] = await Promise.all([
        axios.get<ResourceUsageResponse>(RESOURCE_URLS.cpu),
        axios.get<ResourceUsageResponse>(RESOURCE_URLS.memory),
        axios.get<ResourceUsageResponse>(RESOURCE_URLS.storage)
      ]);
      
      // Get session count from existing endpoint
      const sessionCount = await fetchCountData('sessions', clusterName);
      
      // Extract current usage values
      const cpuUsage = cpuResponse.data.usage;
      const memoryUsage = memoryResponse.data.usage;
      const storageUsage = storageResponse.data.usage;
      
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
          used: sessionCount.toString(),
          total: "1600 active"
        }
      };
    } catch (apiError) {
      console.error("Error fetching system data:", apiError);
      throw apiError;
    }
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
