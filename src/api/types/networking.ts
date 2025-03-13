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
}

export interface SubnetApiResponse {
  _id: {
    $oid: string;
  };
  cidr: string;
  range: {
    starts: string;
    ends: string;
  };
  gateway: string;
  vc: string;
  name: string;
  domain: string;
  cluster: string;
  datastore: string;
  datacenter: string;
  isActive: boolean;
  netmask: string;
}

export interface RouteData {
  id: string;
  name: string;
  subnetId: string;
  subnetName: string;
  destination: string;
  nextHop: string;
  type: 'static' | 'openshift';
  status: 'active' | 'inactive' | 'pending';
  routeStatus?: 'attached' | 'reserved' | 'orphaned' | 'available';
  priority: number;
  createdAt: string;
  updatedAt: string;
  description?: string;
}

export type RouteFilter = {
  subnetId?: string;
  type?: 'static' | 'openshift' | 'all';
  status?: 'active' | 'inactive' | 'pending' | 'all';
  routeStatus?: 'attached' | 'reserved' | 'orphaned' | 'available' | 'all';
};
