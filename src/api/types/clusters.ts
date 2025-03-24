
export interface ClusterData {
  id: string;
  org: string;
  vc: string;
  username: string;
  tags: string[];
  isActive: boolean;
  datacenter: string;
  defaultnetwork: string;
  resourcepool: string;
  datastore: string;
  sharedWith: string[];
  airgapnetwork?: string;
  businessUnit?: string;
  autoPurgeEnabled?: boolean;
  cpuThreshold?: number;
  memThreshold?: number;
  storageThreshold?: number;
  hasDatastoreCluster?: boolean;
  
  // For UI-only
  status?: 'active' | 'inactive';
  name?: string;
}

export interface ClusterApiResponse {
  id: string;
  org: string;
  vc: string;
  username: string;
  password: string; // Note: We shouldn't expose this in the UI
  tags: string[];
  isActive: boolean;
  datacenter: string;
  defaultnetwork: string;
  resourcepool: string;
  datastore: string;
  sharedWith: string[];
  airgapnetwork?: string;
  businessUnit?: string;
  autoPurgeEnabled?: boolean;
  cpuThreshold?: number;
  memThreshold?: number;
  storageThreshold?: number;
  hasDatastoreCluster?: boolean;
}
