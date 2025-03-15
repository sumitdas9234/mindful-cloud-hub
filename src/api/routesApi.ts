
import axios from 'axios';
import { RouteApiResponse, RouteData } from '@/api/types/networking';

// Mock data for development
const mockRoutes: RouteApiResponse[] = [
  {
    _id: { $oid: "6555b0e77065b789e7388ea2" },
    vip: {
      fqdn: "api.pwx-ocp-208-231.pwx.purestorage.com",
      ip: "10.13.208.231"
    },
    apps: {
      fqdn: "*.apps.pwx-ocp-208-231.pwx.purestorage.com",
      ip: "10.13.208.232"
    },
    subnet: "slc5-n8-pwx-qa",
    status: "available",
    expiry: null,
    testbed: null,
    name: "pwx-ocp-208-231"
  },
  {
    _id: { $oid: "66bf964ace6df6cbf8f846e9" },
    subnet: "slc5-n8-pwx-scale",
    status: "orphaned",
    expiry: null,
    testbed: null,
    ip: "10.13.240.115",
    name: "ip-10-13-240-115",
    type: "anthos"
  },
  {
    _id: { $oid: "6555b0e77065b789e7388ea3" },
    vip: {
      fqdn: "api.pwx-ocp-208-232.pwx.purestorage.com",
      ip: "10.13.208.235"
    },
    apps: {
      fqdn: "*.apps.pwx-ocp-208-232.pwx.purestorage.com",
      ip: "10.13.208.236"
    },
    subnet: "slc5-n8-pwx-qa",
    status: "attached",
    expiry: "2023-12-31T23:59:59Z",
    testbed: "ocp-test-cluster-1",
    name: "pwx-ocp-208-232"
  },
  {
    _id: { $oid: "66bf964ace6df6cbf8f846e8" },
    subnet: "slc5-n8-pwx-scale",
    status: "reserved",
    expiry: "2023-11-15T12:00:00Z",
    testbed: "anthos-test-cluster",
    ip: "10.13.240.116",
    name: "ip-10-13-240-116",
    type: "anthos"
  },
  {
    _id: { $oid: "6555b0e77065b789e7388ea4" },
    vip: {
      fqdn: "api.pwx-ocp-208-233.pwx.purestorage.com",
      ip: "10.13.208.240"
    },
    apps: {
      fqdn: "*.apps.pwx-ocp-208-233.pwx.purestorage.com",
      ip: "10.13.208.241"
    },
    subnet: "slc5-n8-pwx-dev",
    status: "available",
    expiry: null,
    testbed: null,
    name: "pwx-ocp-208-233"
  },
  {
    _id: { $oid: "66bf964ace6df6cbf8f846e7" },
    subnet: "slc5-n8-pwx-dev",
    status: "attached",
    expiry: "2024-01-20T09:30:00Z",
    testbed: "dev-cluster-2",
    ip: "10.13.240.120",
    name: "ip-10-13-240-120",
    type: "anthos"
  }
];

// Transform routes from API response format to app format
const transformRouteData = (data: RouteApiResponse[]): RouteData[] => {
  return data.map(route => ({
    id: route._id.$oid,
    name: route.name,
    subnetId: route.subnet,
    subnetName: route.subnet, // In a real app, you'd look up the human-readable name
    type: route.type === 'anthos' ? 'static' : 'openshift',
    status: route.status,
    testbed: route.testbed,
    expiry: route.expiry,
    createdAt: new Date().toISOString(), // Mock date
    updatedAt: new Date().toISOString(), // Mock date
    // Conditional properties based on type
    ...(route.type === 'anthos' ? { ip: route.ip } : {}),
    ...(route.type !== 'anthos' && route.vip ? { vip: route.vip } : {}),
    ...(route.type !== 'anthos' && route.apps ? { apps: route.apps } : {})
  }));
};

// Fetch all routes
export const fetchRoutes = async (): Promise<RouteData[]> => {
  try {
    // In a real application, you would make an API call here
    // const response = await axios.get<RouteApiResponse[]>('/api/routes');
    // return transformRouteData(response.data);
    
    // For now, return mock data
    return transformRouteData(mockRoutes);
  } catch (error) {
    console.error('Error fetching routes:', error);
    throw error;
  }
};

// Fetch routes for a specific subnet
export const fetchRoutesBySubnet = async (subnetId: string): Promise<RouteData[]> => {
  try {
    // In a real application, you would make an API call with the subnet ID
    // const response = await axios.get<RouteApiResponse[]>(`/api/subnets/${subnetId}/routes`);
    // return transformRouteData(response.data);
    
    // For now, filter mock data
    const filteredRoutes = mockRoutes.filter(route => route.subnet === subnetId);
    return transformRouteData(filteredRoutes);
  } catch (error) {
    console.error(`Error fetching routes for subnet ${subnetId}:`, error);
    throw error;
  }
};

// Fetch a single route by ID
export const fetchRouteById = async (routeId: string): Promise<RouteData | null> => {
  try {
    // In a real application, you would make an API call with the route ID
    // const response = await axios.get<RouteApiResponse>(`/api/routes/${routeId}`);
    // return transformRouteData([response.data])[0];
    
    // For now, find in mock data
    const route = mockRoutes.find(r => r._id.$oid === routeId);
    return route ? transformRouteData([route])[0] : null;
  } catch (error) {
    console.error(`Error fetching route ${routeId}:`, error);
    throw error;
  }
};
