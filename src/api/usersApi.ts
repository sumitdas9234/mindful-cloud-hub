
import axios from 'axios';
import { User, UserListResponse, UserStats, UserFilters } from './types/users';
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
    // Fetch users from the API with pagination and filtering params
    const response = await apiClient.get(USERS_ENDPOINT, {
      params: {
        page,
        limit,
        ...filters
      }
    });
    
    console.log(`Fetched users from API: page ${page}, limit ${limit}, filters:`, filters);
    
    // Process the response
    return {
      data: response.data.data || response.data,
      total: response.data.total || response.data.length
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const fetchUserStats = async (): Promise<UserStats> => {
  try {
    const response = await apiClient.get(`${USERS_ENDPOINT}/stats`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user stats:", error);
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
