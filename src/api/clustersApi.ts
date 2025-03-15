
import axios from 'axios';
import { ClusterApiResponse, ClusterData } from './types/clusters';
import env from '@/config/env';

// Mock data for clusters
const MOCK_CLUSTERS: ClusterApiResponse[] = [
  {
    _id: "OCP-531-pci-nvme",
    org: "SystemTest",
    vc: "vcsa531-08a.pwx.purestorage.com",
    username: "user",
    password: "password", // In a real app, this would not be exposed
    tags: [
      "ocp-pwx",
      "ocp",
      "autopurge_vms"
    ],
    isActive: true,
    datacenter: "CNBU-531",
    defaultnetwork: "slc5-n8-pwx-dev",
    resourcepool: "OCP-531-pci-nvme-rp",
    datastore: "mh531-f17-ocp-531-pci-nvme-01",
    sharedWith: [
      "pwx-bat",
      "Development",
      "SystemTest"
    ],
    airgapnetwork: "slc5-n8-pwx-airgap",
    businessUnit: "CNBU",
    autoPurgeEnabled: true,
    cpuThreshold: 80,
    memThreshold: 80,
    storageThreshold: 85,
    hasDatastoreCluster: false
  },
  {
    _id: "OCP-530-vmdk",
    org: "Development",
    vc: "vcsa530-07a.pwx.purestorage.com",
    username: "user",
    password: "password",
    tags: [
      "ocp",
      "vmdk",
      "development"
    ],
    isActive: true,
    datacenter: "CNBU-530",
    defaultnetwork: "slc5-n7-pwx-dev",
    resourcepool: "OCP-530-vmdk-rp",
    datastore: "mh530-f16-ocp-530-vmdk-01",
    sharedWith: [
      "Development",
      "QA"
    ],
    businessUnit: "CNBU",
    autoPurgeEnabled: true,
    cpuThreshold: 75,
    memThreshold: 75,
    storageThreshold: 80,
    hasDatastoreCluster: true
  },
  {
    _id: "K8S-529-test",
    org: "QA",
    vc: "vcsa529-06a.pwx.purestorage.com",
    username: "user",
    password: "password",
    tags: [
      "k8s",
      "test"
    ],
    isActive: false,
    datacenter: "CNBU-529",
    defaultnetwork: "slc5-n6-pwx-qa",
    resourcepool: "K8S-529-test-rp",
    datastore: "mh529-f15-k8s-529-test-01",
    sharedWith: [
      "QA"
    ],
    businessUnit: "CNBU",
    autoPurgeEnabled: false,
    cpuThreshold: 70,
    memThreshold: 70,
    storageThreshold: 75,
    hasDatastoreCluster: false
  }
];

// Transform clusters from API response format to app format
const transformClusterData = (data: ClusterApiResponse[]): ClusterData[] => {
  return data.map(cluster => ({
    id: cluster._id,
    org: cluster.org,
    vc: cluster.vc,
    username: cluster.username,
    tags: cluster.tags,
    isActive: cluster.isActive,
    datacenter: cluster.datacenter,
    defaultnetwork: cluster.defaultnetwork,
    resourcepool: cluster.resourcepool,
    datastore: cluster.datastore,
    sharedWith: cluster.sharedWith,
    airgapnetwork: cluster.airgapnetwork,
    businessUnit: cluster.businessUnit,
    autoPurgeEnabled: cluster.autoPurgeEnabled,
    cpuThreshold: cluster.cpuThreshold,
    memThreshold: cluster.memThreshold,
    storageThreshold: cluster.storageThreshold,
    hasDatastoreCluster: cluster.hasDatastoreCluster,
    // Additional UI properties
    status: cluster.isActive ? 'active' : 'inactive',
    name: cluster._id, // Using _id as name for UI
  }));
};

// Fetch real clusters from API
const fetchRealClusters = async (): Promise<ClusterData[]> => {
  try {
    console.log('Fetching clusters from real API');
    const response = await axios.get(env.CLUSTERS_API_URL);
    return transformClusterData(response.data);
  } catch (error) {
    console.error('Error fetching clusters from API:', error);
    // Fallback to mock data in case of error
    console.log('Falling back to mock data');
    return transformClusterData(MOCK_CLUSTERS);
  }
};

// Fetch all clusters
export const fetchClusters = async (): Promise<ClusterData[]> => {
  // Use real API by default, only use mock if explicitly configured
  if (env.USE_MOCK_DATA) {
    // Simulating API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Fetching clusters from mock API');
    return transformClusterData(MOCK_CLUSTERS);
  }
  
  return fetchRealClusters();
};

// Fetch a single cluster by ID
export const fetchClusterById = async (clusterId: string): Promise<ClusterData | null> => {
  try {
    if (env.USE_MOCK_DATA) {
      // Simulating API call delay for mock data
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const cluster = MOCK_CLUSTERS.find(c => c._id === clusterId);
      return cluster ? transformClusterData([cluster])[0] : null;
    }
    
    // Fetch from real API
    const response = await axios.get(`${env.CLUSTERS_API_URL}?id=${clusterId}`);
    const clusters = transformClusterData(Array.isArray(response.data) ? response.data : [response.data]);
    return clusters.find(c => c.id === clusterId) || null;
  } catch (error) {
    console.error(`Error fetching cluster ${clusterId}:`, error);
    
    // Fallback to mock data in case of error
    const cluster = MOCK_CLUSTERS.find(c => c._id === clusterId);
    return cluster ? transformClusterData([cluster])[0] : null;
  }
};

// Update a cluster (mock implementation)
export const updateCluster = async (clusterId: string, updates: Partial<ClusterData>): Promise<ClusterData> => {
  try {
    if (env.USE_MOCK_DATA) {
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      console.log(`Updating cluster ${clusterId} with:`, updates);
      
      // In a real implementation, this would update the server
      const cluster = MOCK_CLUSTERS.find(c => c._id === clusterId);
      if (!cluster) {
        throw new Error(`Cluster with ID ${clusterId} not found`);
      }
      
      // Return the "updated" cluster
      return transformClusterData([{
        ...cluster,
        ...updates,
        // Make sure _id is not overwritten
        _id: clusterId
      }])[0];
    }
    
    // In a real implementation, we would do a PUT or PATCH request
    console.log(`Updating cluster ${clusterId} with:`, updates);
    
    // For now, we'll just simulate an update with a fake success response
    // In a real app, you would do:
    // const response = await axios.patch(`${env.CLUSTERS_API_URL}/${clusterId}`, updates);
    
    // Fetch the current state
    const currentCluster = await fetchClusterById(clusterId);
    if (!currentCluster) {
      throw new Error(`Cluster with ID ${clusterId} not found`);
    }
    
    // Return simulated updated cluster
    return {
      ...currentCluster,
      ...updates,
      id: clusterId // Make sure id is not overwritten
    };
  } catch (error) {
    console.error(`Error updating cluster ${clusterId}:`, error);
    throw error;
  }
};
