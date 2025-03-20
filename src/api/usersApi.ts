
import axios from 'axios';
import { User, UserListResponse, UserFilters } from './types/users';
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
const USERS_ENDPOINT = '/users';

// API functions
export const fetchUsers = async (
  page: number = 1,
  limit: number = 10,
  filters: UserFilters = {}
): Promise<UserListResponse> => {
  try {
    // Fetch all users from the API (no pagination params since API doesn't support it)
    const response = await apiClient.get(USERS_ENDPOINT);
    
    console.log(`Fetched users from API: page ${page}, limit ${limit}, filters:`, filters);
    
    // Get the raw user data
    let allUsers: User[] = response.data.data || response.data;
    
    // Apply filtering in the client
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      allUsers = allUsers.filter(user => 
        (user.cn?.toLowerCase().includes(searchLower)) || 
        (user.email?.toLowerCase().includes(searchLower))
      );
    }
    
    if (filters.role) {
      allUsers = allUsers.filter(user => 
        user.roles?.includes(filters.role as string)
      );
    }
    
    if (filters.org) {
      allUsers = allUsers.filter(user => 
        user.org === filters.org
      );
    }
    
    if (filters.isActive !== undefined) {
      allUsers = allUsers.filter(user => 
        user.isActive === filters.isActive
      );
    }
    
    // Calculate total before pagination
    const total = allUsers.length;
    
    // Apply pagination in the client
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = allUsers.slice(startIndex, endIndex);
    
    // Return paginated results and total count
    return {
      data: paginatedUsers,
      total: total
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const fetchUserById = async (id: string): Promise<User> => {
  try {
    const response = await apiClient.get(`${USERS_ENDPOINT}/${id}`);
    
    if (!response.data) {
      throw new Error('User not found');
    }
    
    return response.data;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
};

export const createUser = async (userData: Omit<User, '_id'>): Promise<User> => {
  try {
    const response = await apiClient.post(USERS_ENDPOINT, userData);
    console.log('Creating user:', userData);
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const updateUser = async (id: string, userData: Partial<User>): Promise<User> => {
  try {
    const response = await apiClient.patch(`${USERS_ENDPOINT}/${id}`, userData);
    console.log('Updating user:', id, userData);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const deleteUser = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`${USERS_ENDPOINT}/${id}`);
    console.log('Deleting user:', id);
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};
