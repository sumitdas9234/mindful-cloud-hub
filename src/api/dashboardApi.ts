
import { ServerData, ResourceUsageData, StatsData, SystemLoadData, VCenterData, ClusterData, InfraTagData } from './types';

// Mock data for vCenters
const mockVCenters: VCenterData[] = [
  { id: 'vc1', name: 'vCenter East' },
  { id: 'vc2', name: 'vCenter West' },
  { id: 'vc3', name: 'vCenter Central' }
];

// Mock data for infra tags
const mockInfraTags: InfraTagData[] = [
  { id: 'tag1', name: 'Production' },
  { id: 'tag2', name: 'Development' },
  { id: 'tag3', name: 'Testing' },
  { id: 'tag4', name: 'Staging' },
  { id: 'tag5', name: 'Backup' }
];

// Mock data for clusters with tags
const mockClusters: ClusterData[] = [
  { id: 'cl1', name: 'Production Cluster', vCenterId: 'vc1', tags: ['tag1'] },
  { id: 'cl2', name: 'Development Cluster', vCenterId: 'vc1', tags: ['tag2'] },
  { id: 'cl3', name: 'Testing Cluster', vCenterId: 'vc2', tags: ['tag3'] },
  { id: 'cl4', name: 'Staging Cluster', vCenterId: 'vc2', tags: ['tag4'] },
  { id: 'cl5', name: 'Main Cluster', vCenterId: 'vc3', tags: ['tag1', 'tag5'] },
  { id: 'cl6', name: 'Backup Cluster', vCenterId: 'vc3', tags: ['tag5'] }
];

// Fetch vCenters
export const fetchVCenters = async (): Promise<VCenterData[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockVCenters;
};

// Fetch clusters for a specific vCenter and/or tags
export const fetchClusters = async (vCenterId: string, tagIds?: string[]): Promise<ClusterData[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let filteredClusters = mockClusters.filter(cluster => cluster.vCenterId === vCenterId);
  
  // Further filter by tags if provided
  if (tagIds && tagIds.length > 0) {
    filteredClusters = filteredClusters.filter(cluster => 
      cluster.tags?.some(tag => tagIds.includes(tag))
    );
  }
  
  return filteredClusters;
};

// Fetch all infra tags
export const fetchInfraTags = async (): Promise<InfraTagData[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockInfraTags;
};

// Fetch clusters for specific tags across all vCenters
export const fetchClustersByTags = async (tagIds: string[]): Promise<ClusterData[]> => {
  if (!tagIds || tagIds.length === 0) {
    return [];
  }
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return mockClusters.filter(cluster => 
    cluster.tags?.some(tag => tagIds.includes(tag))
  );
};

// Updated function signature to accept an object parameter
export const fetchResourceUsageData = async (params: { vCenterId?: string, clusterId?: string, tagIds?: string[] }): Promise<ResourceUsageData[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const now = new Date();
  const data: ResourceUsageData[] = [];
  
  // Create a seeded random factor based on vCenter and cluster
  const seedFactor = params.vCenterId === 'vc1' ? 1.2 : params.vCenterId === 'vc2' ? 0.8 : 1;
  const clusterFactor = params.clusterId ? parseFloat(params.clusterId.replace('cl', '')) / 3 : 1;
  
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now);
    time.setHours(now.getHours() - i);
    
    // Use the seed factors to generate data that varies by selection
    data.push({
      name: `${time.getHours()}:00`,
      cpu: Math.floor(Math.random() * 30 * seedFactor * clusterFactor) + 30,
      memory: Math.floor(Math.random() * 25 * seedFactor * clusterFactor) + 40,
      network: Math.floor(Math.random() * 80 * seedFactor * clusterFactor) + 100,
    });
  }
  
  return data;
};

// Updated function signature to accept an object parameter
export const fetchServers = async (params: { vCenterId?: string, clusterId?: string, tagIds?: string[] }): Promise<ServerData[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Generate different server data based on vCenter and cluster
  let servers: ServerData[] = [
    { id: 1, name: 'prod-app-server-01', cpu: 62, memory: 58, disk: 43, status: 'online' },
    { id: 2, name: 'prod-app-server-02', cpu: 45, memory: 72, disk: 32, status: 'online' },
    { id: 3, name: 'prod-db-server-01', cpu: 78, memory: 65, disk: 68, status: 'online' },
    { id: 4, name: 'staging-app-server-01', cpu: 22, memory: 34, disk: 19, status: 'online' },
  ];
  
  if (params.vCenterId === 'vc1') {
    servers = [
      { id: 101, name: 'east-app-server-01', cpu: 58, memory: 62, disk: 39, status: 'online' },
      { id: 102, name: 'east-app-server-02', cpu: 41, memory: 68, disk: 35, status: 'online' },
      { id: 103, name: 'east-db-server-01', cpu: 82, memory: 71, disk: 73, status: 'online' },
    ];
    if (params.clusterId === 'cl1') {
      servers = servers.map(s => ({...s, name: s.name.replace('east', 'prod-east')}));
    } else if (params.clusterId === 'cl2') {
      servers = servers.map(s => ({...s, name: s.name.replace('east', 'dev-east')}));
    }
  } else if (params.vCenterId === 'vc2') {
    servers = [
      { id: 201, name: 'west-app-server-01', cpu: 35, memory: 45, disk: 28, status: 'online' },
      { id: 202, name: 'west-app-server-02', cpu: 29, memory: 51, disk: 25, status: 'online' },
      { id: 203, name: 'west-db-server-01', cpu: 65, memory: 58, disk: 52, status: 'online' },
      { id: 204, name: 'west-cache-server-01', cpu: 42, memory: 38, disk: 15, status: 'maintenance' },
    ];
    if (params.clusterId === 'cl3') {
      servers = servers.map(s => ({...s, name: s.name.replace('west', 'test-west')}));
    } else if (params.clusterId === 'cl4') {
      servers = servers.map(s => ({...s, name: s.name.replace('west', 'staging-west')}));
    }
  } else if (params.vCenterId === 'vc3') {
    servers = [
      { id: 301, name: 'central-app-server-01', cpu: 48, memory: 53, disk: 32, status: 'online' },
      { id: 302, name: 'central-app-server-02', cpu: 36, memory: 47, disk: 29, status: 'offline' },
      { id: 303, name: 'central-db-server-01', cpu: 72, memory: 68, disk: 65, status: 'online' },
    ];
    if (params.clusterId === 'cl5') {
      servers = servers.map(s => ({...s, name: s.name.replace('central', 'main')}));
    } else if (params.clusterId === 'cl6') {
      servers = servers.map(s => ({...s, name: s.name.replace('central', 'backup')}));
    }
  }
  
  return servers;
};

// Updated function signature to accept an object parameter
export const fetchStatsData = async (params: { vCenterId?: string, clusterId?: string, tagIds?: string[] }): Promise<StatsData[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Default stats
  let stats: StatsData[] = [
    {
      title: "Total Servers",
      value: "12",
      description: "Active infrastructure",
      trend: "up",
      trendValue: "+2 from last month"
    },
    {
      title: "Databases",
      value: "8",
      description: "Production & staging",
      trend: "neutral",
      trendValue: "No change"
    },
    {
      title: "Storage",
      value: "4.2 TB",
      description: "Used across all systems",
      trend: "up",
      trendValue: "+0.8 TB from last month"
    },
    {
      title: "Users",
      value: "42",
      description: "Active team members",
      trend: "up",
      trendValue: "+5 from last month"
    }
  ];
  
  // Modify stats based on vCenter
  if (params.vCenterId === 'vc1') {
    stats[0].value = "14";
    stats[1].value = "10";
    stats[2].value = "5.2 TB";
    stats[3].value = "48";
  } else if (params.vCenterId === 'vc2') {
    stats[0].value = "9";
    stats[1].value = "6";
    stats[2].value = "3.8 TB";
    stats[3].value = "35";
  } else if (params.vCenterId === 'vc3') {
    stats[0].value = "11";
    stats[1].value = "7";
    stats[2].value = "4.0 TB";
    stats[3].value = "40";
  }
  
  // Further adjust based on cluster
  if (params.clusterId) {
    const clusterNum = parseInt(params.clusterId.replace('cl', ''));
    stats[0].value = (parseInt(stats[0].value) - (clusterNum % 3)).toString();
    stats[1].value = (parseInt(stats[1].value) - (clusterNum % 2)).toString();
    const storageAdjust = (clusterNum % 5) * 0.2;
    stats[2].value = (parseFloat(stats[2].value.replace(' TB', '')) - storageAdjust).toFixed(1) + ' TB';
  }
  
  return stats;
};

// Updated function signature to accept an object parameter
export const fetchSystemLoad = async (params: { vCenterId?: string, clusterId?: string, tagIds?: string[] }): Promise<SystemLoadData> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Base system load data
  let systemLoad: SystemLoadData = {
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
      used: "580 Mbps",
      total: "1 Gbps"
    }
  };
  
  // Modify based on vCenter
  if (params.vCenterId === 'vc1') {
    systemLoad.cpu = 78;
    systemLoad.memory.value = 70;
    systemLoad.memory.used = "35 GB";
    systemLoad.storage.value = 48;
    systemLoad.storage.used = "4.8 TB";
    systemLoad.network.value = 65;
    systemLoad.network.used = "650 Mbps";
  } else if (params.vCenterId === 'vc2') {
    systemLoad.cpu = 62;
    systemLoad.memory.value = 55;
    systemLoad.memory.used = "27.5 GB";
    systemLoad.storage.value = 38;
    systemLoad.storage.used = "3.8 TB";
    systemLoad.network.value = 48;
    systemLoad.network.used = "480 Mbps";
  } else if (params.vCenterId === 'vc3') {
    systemLoad.cpu = 68;
    systemLoad.memory.value = 60;
    systemLoad.memory.used = "30 GB";
    systemLoad.storage.value = 40;
    systemLoad.storage.used = "4.0 TB";
    systemLoad.network.value = 55;
    systemLoad.network.used = "550 Mbps";
  }
  
  // Further adjust based on cluster
  if (params.clusterId) {
    const clusterNum = parseInt(params.clusterId.replace('cl', ''));
    systemLoad.cpu = Math.min(95, systemLoad.cpu + (clusterNum * 2));
    systemLoad.memory.value = Math.min(95, systemLoad.memory.value + (clusterNum % 4));
    systemLoad.storage.value = Math.min(90, systemLoad.storage.value + (clusterNum % 3));
    systemLoad.network.value = Math.min(90, systemLoad.network.value + (clusterNum % 5));
    
    // Update the used values proportionally
    const memTotal = parseFloat(systemLoad.memory.total.replace(' GB', ''));
    const memUsed = (memTotal * systemLoad.memory.value / 100).toFixed(1);
    systemLoad.memory.used = `${memUsed} GB`;
    
    const storageTotal = parseFloat(systemLoad.storage.total.replace(' TB', ''));
    const storageUsed = (storageTotal * systemLoad.storage.value / 100).toFixed(1);
    systemLoad.storage.used = `${storageUsed} TB`;
    
    const networkTotal = parseFloat(systemLoad.network.total.replace(' Gbps', '')) * 1000;
    const networkUsed = Math.round(networkTotal * systemLoad.network.value / 100);
    systemLoad.network.used = `${networkUsed} Mbps`;
  }
  
  return systemLoad;
};
