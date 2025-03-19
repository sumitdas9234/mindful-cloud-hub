
import React from 'react';
import { format, parseISO } from 'date-fns';
import { DataTable, Column } from '@/components/compute/DataTable';
import { User } from '@/api/types/users';
import { UserRoleBadge } from './UserRoleBadge';
import { UserStatusBadge } from './UserStatusBadge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Check, FileEdit, MoreVertical, Trash2, XCircle } from 'lucide-react';

interface UsersTableProps {
  users: User[];
  isLoading: boolean;
  onEditUser: (user: User) => void;
  onViewUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
  onToggleUserStatus: (user: User, newStatus: boolean) => void;
  searchQuery?: string;
}

export const UsersTable: React.FC<UsersTableProps> = ({
  users,
  isLoading,
  onEditUser,
  onViewUser,
  onDeleteUser,
  onToggleUserStatus,
  searchQuery
}) => {
  const formatDate = (dateString: string | Date) => {
    if (!dateString) return 'Never';
    try {
      const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
      return format(date, 'MMM d, yyyy HH:mm');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  const columns: Column<User>[] = [
    {
      key: 'name',
      header: 'User',
      cell: (user) => (
        <div className="flex items-center space-x-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials(user.cn)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{user.cn}</div>
            <div className="text-xs text-muted-foreground">{user.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'roles',
      header: 'Roles',
      cell: (user) => (
        <div className="flex flex-wrap gap-1">
          {user.roles.map((role) => (
            <UserRoleBadge key={role} role={role} size="sm" />
          ))}
        </div>
      ),
    },
    {
      key: 'organization',
      header: 'Organization',
      cell: (user) => (
        <div>
          <div>{user.org}</div>
          <div className="text-xs text-muted-foreground">
            {user.businessUnit}
          </div>
        </div>
      ),
    },
    {
      key: 'manager',
      header: 'Manager',
      cell: (user) => (
        <div>{user.manager || 'None'}</div>
      ),
    },
    {
      key: 'lastActive',
      header: 'Last Active',
      cell: (user) => (
        <div className="text-sm">{formatDate(user.lastLoggedIn)}</div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (user) => (
        <UserStatusBadge isActive={user.isActive} />
      ),
      className: "w-[100px]"
    },
    {
      key: 'actions',
      header: '',
      cell: (user) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onViewUser(user)}>
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEditUser(user)}>
              <FileEdit className="h-4 w-4 mr-2" />
              Edit User
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {user.isActive ? (
              <DropdownMenuItem 
                onClick={() => onToggleUserStatus(user, false)}
                className="text-amber-600"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Deactivate
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem 
                onClick={() => onToggleUserStatus(user, true)}
                className="text-green-600"
              >
                <Check className="h-4 w-4 mr-2" />
                Activate
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onDeleteUser(user)}
              className="text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      className: "w-[50px]"
    },
  ];

  return (
    <DataTable
      data={users}
      columns={columns}
      keyExtractor={(user) => user._id}
      isLoading={isLoading}
      emptyTitle="No Users Found"
      emptyDescription="Try adjusting your search or filters."
      searchQuery={searchQuery}
      onRowClick={onViewUser}
    />
  );
};
