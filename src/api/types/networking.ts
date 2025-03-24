
export interface SubnetData {
  id: string;
  name: string;
  cidr: string;
  description: string;
  status: 'active' | 'inactive' | 'pending';
  vlanId: number;
  gatewayIp: string;
  routesCount: number;
  createdAt: string;
  location: string;
  environment: string;
  tags?: string[];
}

export interface TransformedSubnetData extends SubnetData {
  vcenter: string;
  cluster: string;
  datastore: string;
  datacenter: string;
  domain: string;
  netmask: string;
  ipRange: {
    starts: string;
    ends: string;
  };
  metadata?: {
    total: number;
    openshift: number;
    static: number;
    attached: number;
    available: number;
    reserved: number;
    orphaned: number;
  };
}

export interface SubnetApiResponse {
  id: string;
  name: string;
  cidr: string;
  gateway: string;
  range: {
    starts: string;
    ends: string;
  };
  domain: string;
  cluster: string;
  isActive: boolean;
  datastore: string;
  vc: string;
  datacenter: string;
  netmask: string;
  metadata?: {
    total: number;
    openshift: number;
    static: number;
    attached: number;
    available: number;
    reserved: number;
    orphaned: number;
  };
}

export interface RouteData {
  id: string;
  name: string;
  subnetId: string;
  subnetName: string;
  type: 'openshift' | 'static';
  status: 'available' | 'attached' | 'reserved' | 'orphaned';
  testbed?: string | null;
  expiry?: string | null;
  createdAt: string;
  updatedAt: string;
  description?: string;
  // For openshift routes
  vip?: {
    fqdn: string;
    ip: string;
  };
  apps?: {
    fqdn: string;
    ip: string;
  };
  // For static routes
  ip?: string;
}

export type RouteFilter = {
  subnetId?: string;
  type?: 'static' | 'openshift' | 'all';
  status?: 'available' | 'attached' | 'reserved' | 'orphaned' | 'all';
};

export interface RouteApiResponse {
  id: string;
  name: string;
  subnet: string;
  status: 'available' | 'attached' | 'reserved' | 'orphaned';
  expiry: string | null;
  testbed: string | null;
  // For static routes
  ip?: string;
  type?: string;
  // For openshift routes
  vip?: {
    fqdn: string;
    ip: string;
  };
  apps?: {
    fqdn: string;
    ip: string;
  };
}
