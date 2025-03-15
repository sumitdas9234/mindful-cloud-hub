
import axios from 'axios';
import { RouteApiResponse, RouteData } from '@/api/types/networking';

// Base API URL for routes
const ROUTES_API_URL = 'https://run.mocky.io/v3/7db7bcea-3526-4174-b04f-03ca79cd69ef';

// Create axios instance with default config
const routesApiClient = axios.create({
  baseURL: ROUTES_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Transform routes from API response format to app format
const transformRouteData = (data: RouteApiResponse[]): RouteData[] => {
  return data.map(route => ({
    id: route._id.$oid,
    name: route.name,
    subnetId: route.subnet,
    subnetName: route.subnet, // In a real app, you'd look up the human-readable name
    // Determine type based on presence of fields
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
    const response = await routesApiClient.get<RouteApiResponse[]>('');
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
    const response = await routesApiClient.get<RouteApiResponse[]>('');
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
    const response = await routesApiClient.get<RouteApiResponse[]>('');
    const route = response.data.find(r => r._id.$oid === routeId);
    return route ? transformRouteData([route])[0] : null;
  } catch (error) {
    console.error(`Error fetching route ${routeId}:`, error);
    throw error;
  }
};
