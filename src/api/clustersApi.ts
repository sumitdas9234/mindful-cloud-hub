
import axios from 'axios';
import { ClusterApiResponse, ClusterData } from './types/clusters';
import env from '@/config/env';

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

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// API endpoints
const CLUSTERS_ENDPOINT = '/clusters';

// Fetch all clusters
export const fetchClusters = async (): Promise<ClusterData[]> => {
  try {
    console.log('Fetching clusters from API');
    const response = await apiClient.get(CLUSTERS_ENDPOINT);
    return transformClusterData(response.data);
  } catch (error) {
    console.error('Error fetching clusters from API:', error);
    throw error;
  }
};

// Fetch a single cluster by ID
export const fetchClusterById = async (clusterId: string): Promise<ClusterData | null> => {
  try {
    const response = await apiClient.get(`${CLUSTERS_ENDPOINT}/${clusterId}`);
    const clusters = transformClusterData(Array.isArray(response.data) ? response.data : [response.data]);
    return clusters.find(c => c.id === clusterId) || null;
  } catch (error) {
    console.error(`Error fetching cluster ${clusterId}:`, error);
    throw error;
  }
};

// Update a cluster
export const updateCluster = async (clusterId: string, updates: Partial<ClusterData>): Promise<ClusterData> => {
  try {
    console.log(`Updating cluster ${clusterId} with:`, updates);
    
    const response = await apiClient.patch(`${CLUSTERS_ENDPOINT}/${clusterId}`, updates);
    const updatedCluster = transformClusterData(Array.isArray(response.data) ? [response.data] : [response.data])[0];
    
    return updatedCluster;
  } catch (error) {
    console.error(`Error updating cluster ${clusterId}:`, error);
    throw error;
  }
};
