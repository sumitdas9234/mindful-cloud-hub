
import { ServerData, ResourceUsageData, StatsData, SystemLoadData } from './types';

// Mock time-series data generator
export const fetchResourceUsageData = async (): Promise<ResourceUsageData[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const now = new Date();
  const data: ResourceUsageData[] = [];
  
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now);
    time.setHours(now.getHours() - i);
    
    data.push({
      name: `${time.getHours()}:00`,
      cpu: Math.floor(Math.random() * 30) + 30,
      memory: Math.floor(Math.random() * 25) + 40,
      network: Math.floor(Math.random() * 80) + 100,
    });
  }
  
  return data;
};

// Mock server data
export const fetchServers = async (): Promise<ServerData[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [
    { id: 1, name: 'prod-app-server-01', cpu: 62, memory: 58, disk: 43, status: 'online' },
    { id: 2, name: 'prod-app-server-02', cpu: 45, memory: 72, disk: 32, status: 'online' },
    { id: 3, name: 'prod-db-server-01', cpu: 78, memory: 65, disk: 68, status: 'online' },
    { id: 4, name: 'staging-app-server-01', cpu: 22, memory: 34, disk: 19, status: 'online' },
  ];
};

// Stats cards data
export const fetchStatsData = async (): Promise<StatsData[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return [
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
};

// System load data
export const fetchSystemLoad = async (): Promise<SystemLoadData> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
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
      used: "580 Mbps",
      total: "1 Gbps"
    }
  };
};
