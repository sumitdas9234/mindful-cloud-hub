
import { ClusterApiResponse, ClusterData } from './types/clusters';

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

// Fetch all clusters
export const fetchClusters = async (): Promise<ClusterData[]> => {
  // Simulating API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log('Fetching clusters from mock API');
  return transformClusterData(MOCK_CLUSTERS);
};

// Fetch a single cluster by ID
export const fetchClusterById = async (clusterId: string): Promise<ClusterData | null> => {
  // Simulating API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const cluster = MOCK_CLUSTERS.find(c => c._id === clusterId);
  return cluster ? transformClusterData([cluster])[0] : null;
};

// Update a cluster (mock implementation)
export const updateCluster = async (clusterId: string, updates: Partial<ClusterData>): Promise<ClusterData> => {
  // Simulating API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  console.log(`Updating cluster ${clusterId} with:`, updates);
  
  // In a real implementation, this would update the server
  // For now, we just return a mock response
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
};
