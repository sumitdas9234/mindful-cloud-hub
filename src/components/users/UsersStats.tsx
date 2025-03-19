
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users as UsersIcon, 
  Shield, 
  Building, 
  CheckCircle,
  BarChart
} from 'lucide-react';
import { UserStats } from '@/api/types/users';

interface UsersStatsProps {
  stats: UserStats;
  isLoading: boolean;
}

export const UsersStats: React.FC<UsersStatsProps> = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {Array(4).fill(0).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-5 w-24 bg-muted rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-12 bg-muted rounded"></div>
              <div className="h-4 w-32 bg-muted rounded mt-2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Calculate admin count safely
  const adminCount = stats?.byRole?.['admin'] || 0;
  const orgCount = stats?.byOrg ? Object.keys(stats.byOrg).length : 0;

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <UsersIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalUsers}</div>
          <p className="text-xs text-muted-foreground">
            Across all roles and departments
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeUsers}</div>
          <p className="text-xs text-muted-foreground">
            {stats.totalUsers > 0 
              ? `${Math.round((stats.activeUsers / stats.totalUsers) * 100)}% of total users`
              : 'No users available'}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Organizations</CardTitle>
          <Building className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{orgCount}</div>
          <p className="text-xs text-muted-foreground">
            {Object.keys(stats.byOrg || {}).slice(0, 3).join(', ')}
            {Object.keys(stats.byOrg || {}).length > 3 ? '...' : ''}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
          <Shield className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{adminCount}</div>
          <p className="text-xs text-muted-foreground">
            With elevated permissions
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
