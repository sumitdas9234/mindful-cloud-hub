
import axios from 'axios';
import { RouteApiResponse, RouteData } from '@/api/types/networking';
import env from '@/config/env';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// API endpoints
const ROUTES_ENDPOINT = '/routes';

// Transform routes from API response format to app format
const transformRouteData = (data: RouteApiResponse[]): RouteData[] => {
  return data.map(route => ({
    id: route.id,
    name: route.name,
    subnetId: route.subnet,
    subnetName: route.subnet, // In a real app, you'd look up the human-readable name
    // Determine type based on presence of fields
    type: route.type === 'static' || route.ip ? 'static' : 'openshift',
    status: route.status,
    testbed: route.testbed,
    expiry: route.expiry,
    createdAt: new Date().toISOString(), // Mock date
    updatedAt: new Date().toISOString(), // Mock date
    // Conditional properties based on type
    ...(route.ip ? { ip: route.ip } : {}),
    ...(route.vip ? { vip: route.vip } : {}),
    ...(route.apps ? { apps: route.apps } : {})
  }));
};

// Fetch all routes
export const fetchRoutes = async (): Promise<RouteData[]> => {
  try {
    const response = await apiClient.get<RouteApiResponse[]>(ROUTES_ENDPOINT);
    console.log('API Response - Routes:', response.data);
    return transformRouteData(response.data);
  } catch (error) {
    console.error('Error fetching routes:', error);
    throw error;
  }
};

// Fetch routes for a specific subnet
export const fetchRoutesBySubnet = async (subnetId: string): Promise<RouteData[]> => {
  try {
    const response = await apiClient.get<RouteApiResponse[]>(`${ROUTES_ENDPOINT}?subnet=${subnetId}`);
    console.log(`API Response - Routes for subnet ${subnetId}:`, response.data);
    const filteredRoutes = response.data.filter(route => route.subnet === subnetId);
    return transformRouteData(filteredRoutes);
  } catch (error) {
    console.error(`Error fetching routes for subnet ${subnetId}:`, error);
    throw error;
  }
};

// Fetch a single route by ID
export const fetchRouteById = async (routeId: string): Promise<RouteData | null> => {
  try {
    const response = await apiClient.get<RouteApiResponse>(`${ROUTES_ENDPOINT}/${routeId}`);
    const route = response.data;
    return route ? transformRouteData([route])[0] : null;
  } catch (error) {
    console.error(`Error fetching route ${routeId}:`, error);
    throw error;
  }
};
