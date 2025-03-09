
import React from 'react';
import { PlaceholderPage } from '@/components/layout/PlaceholderPage';
import { Users as UsersIcon, UserPlus, UserCheck, Shield, Lock, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  lastActive: string;
  avatarUrl?: string;
}

const users: UserData[] = [
  {
    id: 'user-001',
    name: 'John Smith',
    email: 'john.smith@example.com',
    role: 'Administrator',
    status: 'active',
    lastActive: '2023-11-28T10:45:23Z',
    avatarUrl: 'https://i.pravatar.cc/150?u=john'
  },
  {
    id: 'user-002',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    role: 'Infrastructure Manager',
    status: 'active',
    lastActive: '2023-11-27T16:30:10Z',
    avatarUrl: 'https://i.pravatar.cc/150?u=sarah'
  },
  {
    id: 'user-003',
    name: 'Michael Wong',
    email: 'michael.w@example.com',
    role: 'Network Engineer',
    status: 'active',
    lastActive: '2023-11-28T09:15:45Z',
    avatarUrl: 'https://i.pravatar.cc/150?u=michael'
  },
  {
    id: 'user-004',
    name: 'Emily Davis',
    email: 'emily.d@example.com',
    role: 'Storage Administrator',
    status: 'active',
    lastActive: '2023-11-28T08:20:33Z',
    avatarUrl: 'https://i.pravatar.cc/150?u=emily'
  },
  {
    id: 'user-005',
    name: 'Robert Chen',
    email: 'robert.c@example.com',
    role: 'Security Engineer',
    status: 'inactive',
    lastActive: '2023-11-10T14:22:18Z',
    avatarUrl: 'https://i.pravatar.cc/150?u=robert'
  },
  {
    id: 'user-006',
    name: 'Jennifer Lee',
    email: 'jennifer.l@example.com',
    role: 'DevOps Engineer',
    status: 'pending',
    lastActive: '2023-11-26T11:05:09Z',
    avatarUrl: 'https://i.pravatar.cc/150?u=jennifer'
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'active':
      return <Badge className="bg-green-500">Active</Badge>;
    case 'inactive':
      return <Badge variant="outline" className="text-gray-500">Inactive</Badge>;
    case 'pending':
      return <Badge className="bg-amber-500">Pending</Badge>;
    default:
      return null;
  }
};

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const UsersTab = () => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <div className="relative w-80">
        <Input
          type="search"
          placeholder="Search users..."
          className="w-full rounded-md"
        />
      </div>
      <Button className="gap-1">
        <UserPlus className="h-4 w-4" />
        Add User
      </Button>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {users.map((user) => (
        <Card key={user.id} className="h-full">
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-10 w-10">
                  {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
                  <AvatarFallback>{user.name.charAt(0)}{user.name.split(' ')[1]?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base">{user.name}</CardTitle>
                  <CardDescription className="text-xs">{user.email}</CardDescription>
                </div>
              </div>
              {getStatusBadge(user.status)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Role:</span>
                <span className="font-medium">{user.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last active:</span>
                <span>{formatDate(user.lastActive)}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex gap-2 pt-0">
            <Button size="sm" variant="outline" className="flex-1">Profile</Button>
            <Button size="sm" variant="outline" className="flex-1">Permissions</Button>
            {user.status === 'active' ? (
              <Button size="sm" variant="outline" className="flex-1">Disable</Button>
            ) : (
              <Button size="sm" variant="outline" className="flex-1">Enable</Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  </div>
);

const RolesTab = () => (
  <Card>
    <CardHeader>
      <CardTitle>User Roles</CardTitle>
      <CardDescription>Manage role-based access control</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h3 className="font-medium flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Administrator
              </h3>
              <p className="text-sm text-muted-foreground">Full system access</p>
            </div>
            <Badge className="bg-primary">3 Users</Badge>
          </div>
          <p className="text-sm mb-3">Can manage all aspects of the system including user management, security settings, and infrastructure configuration.</p>
          <Button size="sm" variant="outline">Edit Permissions</Button>
        </div>
        
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h3 className="font-medium flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Infrastructure Manager
              </h3>
              <p className="text-sm text-muted-foreground">Manage infrastructure</p>
            </div>
            <Badge className="bg-primary">2 Users</Badge>
          </div>
          <p className="text-sm mb-3">Can manage all infrastructure components but cannot modify system settings or user access.</p>
          <Button size="sm" variant="outline">Edit Permissions</Button>
        </div>
        
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h3 className="font-medium flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-primary" />
                Operator
              </h3>
              <p className="text-sm text-muted-foreground">Day-to-day operations</p>
            </div>
            <Badge className="bg-primary">4 Users</Badge>
          </div>
          <p className="text-sm mb-3">Can monitor and make limited changes to infrastructure components. Cannot add or remove resources.</p>
          <Button size="sm" variant="outline">Edit Permissions</Button>
        </div>
        
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h3 className="font-medium flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-primary" />
                Read-Only
              </h3>
              <p className="text-sm text-muted-foreground">Monitoring only</p>
            </div>
            <Badge className="bg-primary">7 Users</Badge>
          </div>
          <p className="text-sm mb-3">Can view all system components and monitoring data but cannot make any changes.</p>
          <Button size="sm" variant="outline">Edit Permissions</Button>
        </div>
      </div>
    </CardContent>
    <CardFooter>
      <Button variant="outline" className="w-full">Create New Role</Button>
    </CardFooter>
  </Card>
);

const tabs = [
  { id: 'users', label: 'Users', content: <UsersTab /> },
  { id: 'roles', label: 'Roles', content: <RolesTab /> },
  { id: 'groups', label: 'Groups', content: (
    <Card>
      <CardHeader>
        <CardTitle>User Groups</CardTitle>
        <CardDescription>Manage user groups and team permissions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-60 flex items-center justify-center">
          <p className="text-muted-foreground">User groups will be displayed here</p>
        </div>
      </CardContent>
    </Card>
  )},
  { id: 'activity', label: 'Activity', content: (
    <Card>
      <CardHeader>
        <CardTitle>User Activity</CardTitle>
        <CardDescription>Monitor user login and system activity</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-60 flex items-center justify-center">
          <p className="text-muted-foreground">User activity logs will be displayed here</p>
        </div>
      </CardContent>
    </Card>
  )},
];

const UsersPage = () => {
  return (
    <PlaceholderPage
      title="User Management"
      description="Manage users, roles, and permissions"
      icon={<UsersIcon className="h-6 w-6" />}
      tabs={tabs}
      actionLabel="Add User"
    />
  );
};

export default UsersPage;
