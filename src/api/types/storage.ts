
export interface Datastore {
  id: string;
  name: string;
  type: 'VMFS' | 'NFS' | 'vSAN';
  status: 'healthy' | 'warning' | 'critical' | 'maintenance';
  totalCapacity: number; // in GB
  usedCapacity: number; // in GB
  freeCapacity: number; // in GB
  usagePercentage: number;
  host: string;
  cluster: string;
  provisionType: 'thin' | 'thick';
  createdAt: string;
  lastUpdated: string;
}

export interface FlashBlade {
  id: string;
  name: string;
  model: string;
  status: 'online' | 'offline' | 'degraded' | 'maintenance';
  totalCapacity: number; // in TB
  usedCapacity: number; // in TB
  freeCapacity: number; // in TB
  usagePercentage: number;
  iops: number;
  throughput: string; // e.g., "20 GB/s"
  latency: string; // e.g., "0.5ms"
  firmware: string;
  location: string;
  ipAddress: string;
  lastUpdated: string;
}

export interface FlashArray {
  id: string;
  name: string;
  model: string;
  status: 'online' | 'offline' | 'degraded' | 'maintenance';
  totalCapacity: number; // in TB
  usedCapacity: number; // in TB
  freeCapacity: number; // in TB
  usagePercentage: number;
  iops: number;
  latency: string; // e.g., "0.2ms"
  dataReduction: number; // e.g., 5.2 (5.2:1 data reduction ratio)
  firmware: string;
  location: string;
  ipAddress: string;
  lastUpdated: string;
}
