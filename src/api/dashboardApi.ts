import axios from 'axios';
import { ServerData, ResourceUsageData, StatsData, SystemLoadData, VCenterClusterData, CountResponse } from './types';

// Fetch vCenters and clusters from API
export const fetchVCentersAndClusters = async (): Promise<VCenterClusterData> => {
  try {
    const response = await axios.get('https://run.mocky.io/v3/9713f896-51bc-4dec-b1cb-4cbe4274a472');
    return response.data;
  } catch (error) {
    console.error("Error fetching vCenters and clusters:", error);
    return {};
  }
};

// Fetch count data from API
export const fetchCountData = async (metric: string): Promise<number> => {
  try {
    const response = await axios.get<CountResponse>('https://run.mocky.io/v3/01ca9fcf-80b5-4855-adc1-5d8f156233a4');
    return response.data.count;
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
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return [
    { id: 'tag1', name: 'Production' },
    { id: 'tag2', name: 'Development' },
    { id: 'tag3', name: 'Testing' },
    { id: 'tag4', name: 'Staging' },
    { id: 'tag5', name: 'Backup' }
  ];
};

// Updated function to fetch resource usage data
export const fetchResourceUsageData = async (params: { vCenterId?: string, clusterId?: string, tagIds?: string[] }): Promise<ResourceUsageData[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const now = new Date();
  const data: ResourceUsageData[] = [];
  
  // Create a seeded random factor based on vCenter and cluster
  const seedFactor = params.vCenterId ? 1.2 : 1;
  const clusterFactor = params.clusterId ? 1.5 : 1;
  
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now);
    time.setHours(now.getHours() - i);
    
    // Use the seed factors to generate data that varies by selection
    data.push({
      name: `${time.getHours()}:00`,
      cpu: Math.floor(Math.random() * 30 * seedFactor * clusterFactor) + 30,
      memory: Math.floor(Math.random() * 25 * seedFactor * clusterFactor) + 40,
      storage: Math.floor(Math.random() * 35 * seedFactor * clusterFactor) + 25,
    });
  }
  
  return data;
};

// Updated function to fetch stats data using the count API
export const fetchStatsData = async (params: { vCenterId?: string, clusterId?: string, tagIds?: string[] }): Promise<StatsData[]> => {
  try {
    const count = await fetchCountData('stats');
    
    return [
      {
        title: "Total ESXI Hosts",
        value: count.toString(),
        description: "Active infrastructure",
        trend: "up",
        trendValue: "+2 from last month"
      },
      {
        title: "Total Routes",
        value: count.toString(),
        description: "Network routes",
        trend: "neutral",
        trendValue: "No change"
      },
      {
        title: "Total Testbeds",
        value: count.toString(),
        description: "Dev and test environments",
        trend: "up",
        trendValue: "+3 from last month"
      },
      {
        title: "Total VMs",
        value: count.toString(),
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

// Updated function to fetch system load
export const fetchSystemLoad = async (params: { vCenterId?: string, clusterId?: string, tagIds?: string[] }): Promise<SystemLoadData> => {
  try {
    const count = await fetchCountData('sessions');
    
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
        used: count.toString(),
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
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return mockClusters.filter(cluster => 
    cluster.tags?.some(tag => tagIds.includes(tag))
  );
};

// Fetch servers
export const fetchServers = async (params: { 
  vCenterId?: string, 
  clusterId?: string, 
  tagIds?: string[],
  category?: string 
}): Promise<ServerData[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Base server data by category
  const serversByCategory: Record<string, ServerData[]> = {
    rke: [
      { id: 101, name: 'rke-control-001', cpu: 65, memory: 72, disk: 45, status: 'online', category: 'rke' },
      { id: 102, name: 'rke-control-002', cpu: 58, memory: 65, disk: 38, status: 'online', category: 'rke' },
      { id: 103, name: 'rke-control-003', cpu: 72, memory: 80, disk: 62, status: 'online', category: 'rke' },
    ],
    dogfood: [
      { id: 201, name: 'dog-cluster-001', cpu: 78, memory: 82, disk: 55, status: 'online', category: 'dogfood' },
      { id: 202, name: 'dog-cluster-002', cpu: 45, memory: 60, disk: 42, status: 'maintenance', category: 'dogfood' },
      { id: 203, name: 'dog-cluster-003', cpu: 38, memory: 55, disk: 30, status: 'online', category: 'dogfood' },
    ],
    etcd: [
      { id: 301, name: 'etcd-cluster-001', cpu: 42, memory: 48, disk: 35, status: 'online', category: 'etcd' },
      { id: 302, name: 'etcd-cluster-002', cpu: 50, memory: 62, disk: 45, status: 'online', category: 'etcd' },
      { id: 303, name: 'etcd-cluster-003', cpu: 28, memory: 40, disk: 22, status: 'offline', category: 'etcd' },
    ],
    nfs: [
      { id: 401, name: 'nfs-host-001', cpu: 30, memory: 35, disk: 75, status: 'online', category: 'nfs' },
      { id: 402, name: 'nfs-host-002', cpu: 28, memory: 32, disk: 82, status: 'online', category: 'nfs' },
    ],
    jenkins: [
      { id: 501, name: 'jenkins-agent-001', cpu: 85, memory: 72, disk: 50, status: 'online', category: 'jenkins' },
      { id: 502, name: 'jenkins-agent-002', cpu: 78, memory: 68, disk: 45, status: 'online', category: 'jenkins' },
      { id: 503, name: 'jenkins-agent-003', cpu: 45, memory: 52, disk: 30, status: 'maintenance', category: 'jenkins' },
    ]
  };

  let servers = serversByCategory[params.category || 'rke'] || [];
  
  // Modify server names based on vCenter
  if (params.vCenterId === 'vc1') {
    servers = servers.map(s => ({...s, name: `east-${s.name}`}));
  } else if (params.vCenterId === 'vc2') {
    servers = servers.map(s => ({...s, name: `west-${s.name}`}));
  } else if (params.vCenterId === 'vc3') {
    servers = servers.map(s => ({...s, name: `central-${s.name}`}));
  }
  
  // Modify based on cluster
  if (params.clusterId) {
    const clusterPrefix = params.clusterId === 'cl1' ? 'prod-' : 
                          params.clusterId === 'cl2' ? 'dev-' :
                          params.clusterId === 'cl3' ? 'test-' :
                          params.clusterId === 'cl4' ? 'staging-' :
                          params.clusterId === 'cl5' ? 'main-' : 'backup-';
    
    servers = servers.map(s => ({...s, name: `${clusterPrefix}${s.name}`}));
  }
  
  return servers;
};
