
import { Datastore, FlashBlade, FlashArray } from "../types/storage";

export const mockDatastores: Datastore[] = [
  {
    id: "ds-001",
    name: "Production-DS",
    type: "VMFS",
    status: "healthy",
    totalCapacity: 2048, // 2TB
    usedCapacity: 1024, // 1TB
    freeCapacity: 1024, // 1TB
    usagePercentage: 50,
    host: "esx-host-01",
    cluster: "Cluster-A",
    provisionType: "thin",
    createdAt: "2023-01-15T12:00:00Z",
    lastUpdated: "2023-07-20T15:45:22Z"
  },
  {
    id: "ds-002",
    name: "Development-DS",
    type: "NFS",
    status: "healthy",
    totalCapacity: 1024, // 1TB
    usedCapacity: 307, // 307GB
    freeCapacity: 717, // 717GB
    usagePercentage: 30,
    host: "esx-host-02",
    cluster: "Cluster-B",
    provisionType: "thin",
    createdAt: "2023-02-10T09:30:00Z",
    lastUpdated: "2023-07-19T10:15:36Z"
  },
  {
    id: "ds-003",
    name: "Archive-DS",
    type: "VMFS",
    status: "warning",
    totalCapacity: 4096, // 4TB
    usedCapacity: 3686, // 3.6TB
    freeCapacity: 410, // 410GB
    usagePercentage: 90,
    host: "esx-host-03",
    cluster: "Cluster-C",
    provisionType: "thick",
    createdAt: "2022-11-05T14:20:00Z",
    lastUpdated: "2023-07-21T08:12:45Z"
  },
  {
    id: "ds-004",
    name: "High-Performance-DS",
    type: "vSAN",
    status: "healthy",
    totalCapacity: 8192, // 8TB
    usedCapacity: 2048, // 2TB
    freeCapacity: 6144, // 6TB
    usagePercentage: 25,
    host: "esx-host-04",
    cluster: "Cluster-A",
    provisionType: "thin",
    createdAt: "2023-03-22T11:45:00Z",
    lastUpdated: "2023-07-20T22:30:15Z"
  }
];

export const mockFlashBlades: FlashBlade[] = [
  {
    id: "fb-001",
    name: "FlashBlade-Prod-1",
    model: "FlashBlade //S500",
    status: "online",
    totalCapacity: 150, // 150TB
    usedCapacity: 75, // 75TB
    freeCapacity: 75, // 75TB
    usagePercentage: 50,
    iops: 1200000,
    throughput: "17 GB/s",
    latency: "0.4ms",
    firmware: "3.3.1",
    location: "Datacenter-East, Rack E4",
    ipAddress: "10.10.20.50",
    lastUpdated: "2023-07-21T14:30:00Z"
  },
  {
    id: "fb-002",
    name: "FlashBlade-Analytics",
    model: "FlashBlade //S200",
    status: "online",
    totalCapacity: 80, // 80TB
    usedCapacity: 60, // 60TB
    freeCapacity: 20, // 20TB
    usagePercentage: 75,
    iops: 800000,
    throughput: "15 GB/s",
    latency: "0.5ms",
    firmware: "3.2.8",
    location: "Datacenter-West, Rack W2",
    ipAddress: "10.10.30.60",
    lastUpdated: "2023-07-20T09:15:42Z"
  },
  {
    id: "fb-003",
    name: "FlashBlade-Backup",
    model: "FlashBlade //S700",
    status: "degraded",
    totalCapacity: 200, // 200TB
    usedCapacity: 180, // 180TB
    freeCapacity: 20, // 20TB
    usagePercentage: 90,
    iops: 1500000,
    throughput: "20 GB/s",
    latency: "0.6ms",
    firmware: "3.3.2",
    location: "Datacenter-East, Rack E7",
    ipAddress: "10.10.20.55",
    lastUpdated: "2023-07-21T18:45:10Z"
  }
];

export const mockFlashArrays: FlashArray[] = [
  {
    id: "fa-001",
    name: "FlashArray-DB",
    model: "FlashArray X70R3",
    status: "online",
    totalCapacity: 50, // 50TB
    usedCapacity: 20, // 20TB
    freeCapacity: 30, // 30TB
    usagePercentage: 40,
    iops: 350000,
    latency: "0.2ms",
    dataReduction: 5.2,
    firmware: "6.1.4",
    location: "Datacenter-East, Rack E2",
    ipAddress: "10.10.10.30",
    lastUpdated: "2023-07-21T16:20:00Z"
  },
  {
    id: "fa-002",
    name: "FlashArray-VDI",
    model: "FlashArray X50R2",
    status: "online",
    totalCapacity: 30, // 30TB
    usedCapacity: 15, // 15TB
    freeCapacity: 15, // 15TB
    usagePercentage: 50,
    iops: 250000,
    latency: "0.3ms",
    dataReduction: 4.7,
    firmware: "6.0.12",
    location: "Datacenter-West, Rack W5",
    ipAddress: "10.10.15.40",
    lastUpdated: "2023-07-19T11:30:45Z"
  },
  {
    id: "fa-003",
    name: "FlashArray-CritApps",
    model: "FlashArray X90R3",
    status: "maintenance",
    totalCapacity: 80, // 80TB
    usedCapacity: 10, // 10TB
    freeCapacity: 70, // 70TB
    usagePercentage: 12.5,
    iops: 450000,
    latency: "0.15ms",
    dataReduction: 6.1,
    firmware: "6.2.0",
    location: "Datacenter-East, Rack E3",
    ipAddress: "10.10.10.35",
    lastUpdated: "2023-07-20T13:40:22Z"
  }
];
