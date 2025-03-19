
import axios from 'axios';
import { User, UserListResponse, UserStats, UserFilters } from './types/users';

// Mock data for development
const mockUsers: User[] = [
  {
    _id: "asmith",
    cn: "Alice Smith",
    email: "asmith@example.com",
    manager: "Ivy Johnson",
    org: "Development",
    slackUsername: "@asmith",
    isManager: false,
    roles: ["viewer"],
    isActive: true,
    businessUnit: "APBU",
    sequenceValue: 290,
    lastLoggedIn: "2025-03-13T13:11:22.613Z",
    lastRatingSubmittedOn: "2025-02-22T13:11:22.613Z"
  },
  {
    _id: "bjones",
    cn: "Bob Jones",
    email: "bjones@example.com",
    manager: "Ivy Johnson",
    org: "Development",
    slackUsername: "@bjones",
    isManager: false,
    roles: ["viewer", "operator"],
    isActive: true,
    businessUnit: "APBU",
    sequenceValue: 291,
    lastLoggedIn: "2025-03-12T10:45:18.423Z",
    lastRatingSubmittedOn: "2025-02-21T09:30:12.100Z"
  },
  {
    _id: "clee",
    cn: "Charlie Lee",
    email: "clee@example.com",
    manager: "Ivy Johnson",
    org: "QA",
    slackUsername: "@clee",
    isManager: false,
    roles: ["viewer", "tester"],
    isActive: true,
    businessUnit: "EMBU",
    sequenceValue: 292,
    lastLoggedIn: "2025-03-11T15:22:45.712Z",
    lastRatingSubmittedOn: "2025-02-20T14:20:33.400Z"
  },
  {
    _id: "dkim",
    cn: "David Kim",
    email: "dkim@example.com",
    manager: "Ivy Johnson",
    org: "Operations",
    slackUsername: "@dkim",
    isManager: false,
    roles: ["operator"],
    isActive: false,
    businessUnit: "EMBU",
    sequenceValue: 293,
    lastLoggedIn: "2025-03-10T08:14:22.315Z",
    lastRatingSubmittedOn: "2025-02-19T16:45:10.200Z"
  },
  {
    _id: "ejohnson",
    cn: "Ivy Johnson",
    email: "ejohnson@example.com",
    manager: "Frank Miller",
    org: "Development",
    slackUsername: "@ejohnson",
    isManager: true,
    roles: ["admin", "manager"],
    isActive: true,
    businessUnit: "APBU",
    sequenceValue: 294,
    lastLoggedIn: "2025-03-13T09:30:15.112Z",
    lastRatingSubmittedOn: "2025-02-22T11:20:05.700Z"
  },
  {
    _id: "fmiller",
    cn: "Frank Miller",
    email: "fmiller@example.com",
    manager: "",
    org: "Executive",
    slackUsername: "@fmiller",
    isManager: true,
    roles: ["admin", "executive"],
    isActive: true,
    businessUnit: "CORP",
    sequenceValue: 295,
    lastLoggedIn: "2025-03-13T07:45:10.222Z",
    lastRatingSubmittedOn: "2025-02-21T13:15:22.500Z"
  },
  {
    _id: "gwilliams",
    cn: "Grace Williams",
    email: "gwilliams@example.com",
    manager: "Frank Miller",
    org: "HR",
    slackUsername: "@gwilliams",
    isManager: true,
    roles: ["admin", "hr"],
    isActive: true,
    businessUnit: "CORP",
    sequenceValue: 296,
    lastLoggedIn: "2025-03-12T14:22:33.444Z",
    lastRatingSubmittedOn: "2025-02-20T10:10:15.600Z"
  },
  {
    _id: "hbrown",
    cn: "Henry Brown",
    email: "hbrown@example.com",
    manager: "Grace Williams",
    org: "HR",
    slackUsername: "@hbrown",
    isManager: false,
    roles: ["hr"],
    isActive: false,
    businessUnit: "CORP",
    sequenceValue: 297,
    lastLoggedIn: "2025-03-01T11:30:25.555Z",
    lastRatingSubmittedOn: "2025-02-15T09:45:30.700Z"
  }
];

// Calculate mock stats
const getMockStats = (): UserStats => {
  const activeUsers = mockUsers.filter(user => user.isActive).length;
  const inactiveUsers = mockUsers.length - activeUsers;
  
  const byRole: Record<string, number> = {};
  const byOrg: Record<string, number> = {};
  const byBusinessUnit: Record<string, number> = {};
  
  mockUsers.forEach(user => {
    // Count by role
    user.roles.forEach(role => {
      byRole[role] = (byRole[role] || 0) + 1;
    });
    
    // Count by org
    byOrg[user.org] = (byOrg[user.org] || 0) + 1;
    
    // Count by business unit
    byBusinessUnit[user.businessUnit] = (byBusinessUnit[user.businessUnit] || 0) + 1;
  });
  
  return {
    totalUsers: mockUsers.length,
    activeUsers,
    inactiveUsers,
    byRole,
    byOrg,
    byBusinessUnit
  };
};

// API functions
export const fetchUsers = async (
  page: number = 1,
  limit: number = 10,
  filters: UserFilters = {}
): Promise<UserListResponse> => {
  // For a real API, you would use something like:
  // const response = await axios.get('/api/users', { params: { page, limit, ...filters } });
  // return response.data;
  
  // For development with mock data:
  let filteredUsers = [...mockUsers];
  
  // Apply filters
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filteredUsers = filteredUsers.filter(user => 
      user.cn.toLowerCase().includes(searchLower) ||
      user._id.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
    );
  }
  
  if (filters.role) {
    filteredUsers = filteredUsers.filter(user => 
      user.roles.includes(filters.role as string)
    );
  }
  
  if (filters.org) {
    filteredUsers = filteredUsers.filter(user => 
      user.org === filters.org
    );
  }
  
  if (filters.businessUnit) {
    filteredUsers = filteredUsers.filter(user => 
      user.businessUnit === filters.businessUnit
    );
  }
  
  if (filters.isActive !== undefined) {
    filteredUsers = filteredUsers.filter(user => 
      user.isActive === filters.isActive
    );
  }
  
  // Paginate results
  const startIndex = (page - 1) * limit;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + limit);
  
  return {
    data: paginatedUsers,
    total: filteredUsers.length
  };
};

export const fetchUserStats = async (): Promise<UserStats> => {
  // For a real API:
  // const response = await axios.get('/api/users/stats');
  // return response.data;
  
  // For development:
  return getMockStats();
};

export const fetchUserById = async (id: string): Promise<User> => {
  // For a real API:
  // const response = await axios.get(`/api/users/${id}`);
  // return response.data;
  
  // For development:
  const user = mockUsers.find(user => user._id === id);
  
  if (!user) {
    throw new Error('User not found');
  }
  
  return user;
};

export const createUser = async (userData: Omit<User, '_id'>): Promise<User> => {
  // For a real API:
  // const response = await axios.post('/api/users', userData);
  // return response.data;
  
  // For development (mock implementation):
  console.log('Creating user:', userData);
  return {
    _id: `user-${Date.now()}`,
    ...userData,
  };
};

export const updateUser = async (id: string, userData: Partial<User>): Promise<User> => {
  // For a real API:
  // const response = await axios.put(`/api/users/${id}`, userData);
  // return response.data;
  
  // For development (mock implementation):
  console.log('Updating user:', id, userData);
  
  const userIndex = mockUsers.findIndex(user => user._id === id);
  if (userIndex === -1) {
    throw new Error('User not found');
  }
  
  const updatedUser = {
    ...mockUsers[userIndex],
    ...userData
  };
  
  return updatedUser;
};

export const deleteUser = async (id: string): Promise<void> => {
  // For a real API:
  // await axios.delete(`/api/users/${id}`);
  
  // For development (mock implementation):
  console.log('Deleting user:', id);
};
