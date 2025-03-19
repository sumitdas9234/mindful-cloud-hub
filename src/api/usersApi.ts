
import axios from 'axios';
import { User, UserListResponse, UserStats, UserFilters } from './types/users';

const API_URL = 'https://run.mocky.io/v3/6b5efe7c-d587-4847-a50c-b652618752a4';

// API functions
export const fetchUsers = async (
  page: number = 1,
  limit: number = 10,
  filters: UserFilters = {}
): Promise<UserListResponse> => {
  try {
    // Fetch all users from the API
    const response = await axios.get(API_URL);
    let users = response.data as User[];
    
    // Ensure all users have the required fields
    users = users.map(user => ({
      ...user,
      roles: user.roles || ['user'],
      lastLoggedIn: user.lastLoggedIn || new Date().toISOString(),
      lastRatingSubmittedOn: user.lastRatingSubmittedOn || null,
      sequenceValue: user.sequenceValue || 0
    }));
    
    // Apply filters
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      users = users.filter(user => 
        user.cn.toLowerCase().includes(searchLower) ||
        user._id.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
    }
    
    if (filters.role) {
      users = users.filter(user => 
        (user.roles || []).includes(filters.role as string)
      );
    }
    
    if (filters.org) {
      users = users.filter(user => 
        user.org === filters.org
      );
    }
    
    if (filters.isActive !== undefined) {
      users = users.filter(user => 
        user.isActive === filters.isActive
      );
    }
    
    // Paginate results
    const startIndex = (page - 1) * limit;
    const paginatedUsers = users.slice(startIndex, startIndex + limit);
    
    return {
      data: paginatedUsers,
      total: users.length
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const fetchUserStats = async (): Promise<UserStats> => {
  try {
    const response = await axios.get(API_URL);
    const users = response.data as User[];
    
    // Default values in case the array is empty
    if (!users || users.length === 0) {
      return {
        totalUsers: 0,
        activeUsers: 0,
        inactiveUsers: 0,
        byRole: {},
        byOrg: {},
        byBusinessUnit: {}
      };
    }
    
    const activeUsers = users.filter(user => user.isActive).length;
    const inactiveUsers = users.length - activeUsers;
    
    const byRole: Record<string, number> = {};
    const byOrg: Record<string, number> = {};
    const byBusinessUnit: Record<string, number> = {};
    
    users.forEach(user => {
      // Count by role
      const roles = user.roles || ['user'];
      roles.forEach(role => {
        byRole[role] = (byRole[role] || 0) + 1;
      });
      
      // Count by org
      if (user.org) {
        byOrg[user.org] = (byOrg[user.org] || 0) + 1;
      }
      
      // Count by business unit
      if (user.businessUnit) {
        byBusinessUnit[user.businessUnit] = (byBusinessUnit[user.businessUnit] || 0) + 1;
      }
    });
    
    return {
      totalUsers: users.length,
      activeUsers,
      inactiveUsers,
      byRole,
      byOrg,
      byBusinessUnit
    };
  } catch (error) {
    console.error("Error fetching user stats:", error);
    throw error;
  }
};

export const fetchUserById = async (id: string): Promise<User> => {
  try {
    const response = await axios.get(API_URL);
    const users = response.data as User[];
    const user = users.find(user => user._id === id);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
};

export const createUser = async (userData: Omit<User, '_id'>): Promise<User> => {
  // In a real API, we would post to the endpoint
  // For now, we'll just return a mock response since the API is read-only
  console.log('Creating user:', userData);
  return {
    _id: `user-${Date.now()}`,
    ...userData,
  };
};

export const updateUser = async (id: string, userData: Partial<User>): Promise<User> => {
  // In a real API, we would put to the endpoint
  // For now, we'll fetch the user and return a mock updated version
  try {
    const user = await fetchUserById(id);
    console.log('Updating user:', id, userData);
    
    // Return a merged version
    return {
      ...user,
      ...userData
    };
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const deleteUser = async (id: string): Promise<void> => {
  // In a real API, we would delete from the endpoint
  // For now, we'll just log the action
  console.log('Deleting user:', id);
};
