export interface ServerData {
  id: number;
  name: string;
  cpu: number;
  memory: number;
  disk: number;
  status: 'online' | 'offline' | 'maintenance';
  category?: 'rke' | 'dogfood' | 'etcd' | 'nfs' | 'jenkins';
}

export interface ResourceUsageData {
  name: string;
  cpu: number;
  memory: number;
  storage: number;
}

export interface StatsData {
  title: string;
  value: string;
  description: string;
  trend: 'up' | 'down' | 'neutral';
  trendValue: string;
}

export interface SystemLoadData {
  cpu: number;
  memory: {
    value: number;
    used: string;
    total: string;
  };
  storage: {
    value: number;
    used: string;
    total: string;
  };
  network: {
    value: number;
    used: string;
    total: string;
  };
}

export interface VCenterClusterData {
  [vcenter: string]: string[];
}

export interface CountResponse {
  count: number;
}

export interface VCenterData {
  id: string;
  name: string;
}

export interface ClusterData {
  id: string;
  name: string;
  vCenterId: string;
  tags?: string[];
}

export interface InfraTagData {
  id: string;
  name: string;
}
