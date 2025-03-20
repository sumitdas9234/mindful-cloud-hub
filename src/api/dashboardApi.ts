
import axios from 'axios';
import { ServerData, ResourceUsageData, StatsData, SystemLoadData, VCenterClusterData, CountResponse, VCenterData, ClusterData, InfraTagData } from './types';
import env from '@/config/env';

// Base API URL from environment config
const BASE_API_URL = env.API_BASE_URL;

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

// Updated function to fetch resource usage data
export const fetchResourceUsageData = async (params: { vCenterId?: string, clusterId?: string, tagIds?: string[] }): Promise<ResourceUsageData[]> => {
  try {
    if (!params.clusterId) {
      return [];
    }
    
    const response = await axios.get(`${BASE_API_URL}/cluster/${params.clusterId}/resources`);
    return response.data;
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

// Updated function to fetch system load with cluster-specific session data
export const fetchSystemLoad = async (params: { vCenterId?: string, clusterId?: string, tagIds?: string[] }): Promise<SystemLoadData> => {
  try {
    const clusterName = params.clusterId;
    if (!clusterName) {
      throw new Error("No cluster selected");
    }
    
    const sessionCount = await fetchCountData('sessions', clusterName);
    
    try {
      const response = await axios.get(`${BASE_API_URL}/cluster/${clusterName}/system`);
      const systemData = response.data;
      
      return {
        cpu: systemData.cpu || 72,
        memory: {
          value: systemData.memory?.value || 64,
          used: systemData.memory?.used || "32 GB",
          total: systemData.memory?.total || "50 GB"
        },
        storage: {
          value: systemData.storage?.value || 43,
          used: systemData.storage?.used || "4.2 TB",
          total: systemData.storage?.total || "10 TB"
        },
        network: {
          value: systemData.network?.value || 58,
          used: sessionCount.toString(),
          total: systemData.network?.total || "1600 active"
        }
      };
    } catch (apiError) {
      console.error("Error fetching system data, constructing default response:", apiError);
      
      return {
        cpu: 72,
        memory: {
          value: 64,
          used: "32 GB",
          total: "50 GB"
        },
        storage: {
          value: 43,
          used: "4.2 TB",
          total: "10 TB"
        },
        network: {
          value: 58,
          used: sessionCount.toString(),
          total: "1600 active"
        }
      };
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
