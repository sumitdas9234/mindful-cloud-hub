
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
    // Fetch all users from the API
    const response = await axios.get(env.USERS_API_URL);
    let users = response.data as User[];
    
    // Ensure all users have the required fields
    users = users.map(user => ({
      ...user,
      roles: user.roles || ['user'],
      lastLoggedIn: user.lastLoggedIn || new Date().toISOString(),
      lastRatingSubmittedOn: user.lastRatingSubmittedOn || null,
      sequenceValue: user.sequenceValue || 0
    }));
    
    // Apply filters - optimize search by creating a single toLowerCase operation
    if (filters.search) {
      const searchLower = filters.search.toLowerCase().trim();
      
      const directMatches: User[] = [];
      const partialMatches: User[] = [];
      
      users.forEach(user => {
        const userId = user._id?.toLowerCase() || '';
        const userEmail = user.email?.toLowerCase() || '';
        const userCn = user.cn?.toLowerCase() || '';
        const userSlackUsername = user.slackUsername?.toLowerCase() || '';
        const userManager = user.manager?.toLowerCase() || '';
        const userBusinessUnit = user.businessUnit?.toLowerCase() || '';
        
        // Check for exact matches first
        if (
          userId === searchLower ||
          userEmail === searchLower ||
          userCn === searchLower
        ) {
          directMatches.push(user);
          return;
        }
        
        // Then check for partial matches
        if (
          userCn.includes(searchLower) ||
          userId.includes(searchLower) ||
          userEmail.includes(searchLower) ||
          userSlackUsername.includes(searchLower) ||
          userManager.includes(searchLower) ||
          userBusinessUnit.includes(searchLower)
        ) {
          partialMatches.push(user);
        }
      });
      
      // Combine direct and partial matches with direct matches first
      users = [...directMatches, ...partialMatches];
      
      console.log(`Search found ${directMatches.length} direct matches and ${partialMatches.length} partial matches`);
    }
    
    // Apply other filters
    if (filters.role) {
      users = users.filter(user => {
        const userRoles = user.roles || [];
        return userRoles.includes(filters.role as string);
      });
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
    
    // Get the total count before pagination
    const totalFilteredUsers = users.length;
    
    // Paginate results
    const startIndex = (page - 1) * limit;
    const paginatedUsers = users.slice(startIndex, startIndex + limit);
    
    console.log(`Fetched ${users.length} total users, filtered to ${totalFilteredUsers}, showing page ${page} with ${paginatedUsers.length} users`);
    
    return {
      data: paginatedUsers,
      total: totalFilteredUsers
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const fetchUserStats = async (): Promise<UserStats> => {
  try {
    const response = await axios.get(env.USERS_API_URL);
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
    const response = await axios.get(env.USERS_API_URL);
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
