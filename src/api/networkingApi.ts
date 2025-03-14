
import axios from 'axios';
import { SubnetApiResponse, TransformedSubnetData } from '@/api/types/networking';

// Base API URL
const API_URL = 'http://10.13.113.35:3030/subnets';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Transform API response to match our application's data structure
const transformSubnetData = (data: SubnetApiResponse[]): TransformedSubnetData[] => {
  return data.map(subnet => ({
    id: subnet._id.$oid,
    rawId: subnet._id.$oid,
    name: subnet.name,
    cidr: subnet.cidr,
    description: `${subnet.domain} - ${subnet.datacenter}`,
    status: subnet.isActive ? 'active' : 'inactive',
    vlanId: 0, // Not provided in API response
    gatewayIp: subnet.gateway,
    routesCount: 0, // Not provided in API response
    createdAt: new Date().toISOString(), // Not provided in API response
    location: subnet.datacenter,
    environment: subnet.cluster,
    // Additional fields from API
    vcenter: subnet.vc,
    cluster: subnet.cluster,
    datastore: subnet.datastore,
    datacenter: subnet.datacenter,
    domain: subnet.domain,
    netmask: subnet.netmask,
    ipRange: {
      starts: subnet.range.starts,
      ends: subnet.range.ends
    },
    // Add metadata for route distribution
    metadata: {
      total: 100,
      attached: 42,
      available: 28,
      reserved: 18,
      orphaned: 12,
      openshift: 65,
      static: 35
    }
  }));
};

// Fetch subnets with error handling
export const fetchSubnets = async (): Promise<TransformedSubnetData[]> => {
  try {
    const response = await apiClient.get<SubnetApiResponse[]>('');
    return transformSubnetData(response.data);
  } catch (error) {
    console.error('Error fetching subnets:', error);
    throw error;
  }
};

// Get subnet by ID 
export const fetchSubnetById = async (id: string): Promise<TransformedSubnetData | null> => {
  try {
    const response = await apiClient.get<SubnetApiResponse[]>('');
    const subnets = transformSubnetData(response.data);
    return subnets.find(subnet => subnet.id === id) || null;
  } catch (error) {
    console.error(`Error fetching subnet with ID ${id}:`, error);
    throw error;
  }
};
