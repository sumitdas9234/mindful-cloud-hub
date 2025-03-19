
export interface User {
  _id: string;
  cn: string;
  email: string;
  manager: string;
  org: string;
  slackUsername: string;
  isManager: boolean;
  roles: string[];
  isActive: boolean;
  businessUnit: string;
  sequenceValue: number;
  lastLoggedIn: string | Date;
  lastRatingSubmittedOn: string | Date;
  bannerInfo?: Record<string, string | Date>;
}

export interface UserListResponse {
  data: User[];
  total: number;
}

export interface UserFilters {
  search?: string;
  role?: string;
  org?: string;
  businessUnit?: string;
  isActive?: boolean;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  byRole: Record<string, number>;
  byOrg: Record<string, number>;
  byBusinessUnit: Record<string, number>;
}
