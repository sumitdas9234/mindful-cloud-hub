
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import { PageHeader } from '@/components/compute/PageHeader';
import { UsersTable } from '@/components/users/UsersTable';
import { UsersFilters } from '@/components/users/UsersFilters';
import { UsersStats } from '@/components/users/UsersStats';
import { UserDetailSheet } from '@/components/users/UserDetailSheet';
import { CreateUserDialog } from '@/components/users/CreateUserDialog';
import { fetchUsers, createUser, updateUser, deleteUser } from '@/api/usersApi';
import { User, UserFilters, UserStats } from '@/api/types/users';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';

const UsersPage: React.FC = () => {
  // State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Fixed page size
  const [filters, setFilters] = useState<UserFilters>({});
  const [debouncedFilters, setDebouncedFilters] = useState<UserFilters>(filters);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userDetailOpen, setUserDetailOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Improved filters handling with useCallback
  const updateFilters = useCallback((newFilters: UserFilters) => {
    setFilters(newFilters);
    // Reset to page 1 when filters change
    setCurrentPage(1);
  }, []);

  // Debounce filter changes to reduce API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 200);
    
    return () => clearTimeout(timer);
  }, [filters]);

  // Query for user data
  const { 
    data: usersData, 
    isLoading: isLoadingUsers,
    refetch: refetchUsers,
    error: usersError
  } = useQuery({
    queryKey: ['users', currentPage, itemsPerPage, debouncedFilters],
    queryFn: () => fetchUsers(currentPage, itemsPerPage, debouncedFilters),
    staleTime: 60000, // Cache data for 1 minute
  });
  
  // Error handling for API failures
  useEffect(() => {
    if (usersError) {
      console.error('Error fetching users:', usersError);
      toast({
        title: "Failed to load users",
        description: "There was an error loading the user data. Please try again later.",
        variant: "destructive",
      });
    }
  }, [usersError]);

  // Calculate user stats from fetched user data
  const statsData = useMemo<UserStats>(() => {
    // Default empty stats
    const defaultStats: UserStats = {
      totalUsers: 0,
      activeUsers: 0,
      inactiveUsers: 0,
      byRole: {},
      byOrg: {},
      byBusinessUnit: {}
    };
    
    // If no data is loaded yet, return default stats
    if (!usersData?.data || usersData.data.length === 0) {
      return defaultStats;
    }
    
    // Initialize counters
    let activeUsers = 0;
    const byRole: Record<string, number> = {};
    const byOrg: Record<string, number> = {};
    const byBusinessUnit: Record<string, number> = {};
    
    // Process each user to build statistics
    usersData.data.forEach(user => {
      // Count active vs inactive users
      if (user.isActive) {
        activeUsers++;
      }
      
      // Count by role
      if (user.roles && user.roles.length > 0) {
        user.roles.forEach(role => {
          byRole[role] = (byRole[role] || 0) + 1;
        });
      }
      
      // Count by organization
      if (user.org) {
        byOrg[user.org] = (byOrg[user.org] || 0) + 1;
      }
      
      // Count by business unit
      if (user.businessUnit) {
        byBusinessUnit[user.businessUnit] = (byBusinessUnit[user.businessUnit] || 0) + 1;
      }
    });
    
    return {
      totalUsers: usersData.total || usersData.data.length,
      activeUsers,
      inactiveUsers: (usersData.total || usersData.data.length) - activeUsers,
      byRole,
      byOrg,
      byBusinessUnit
    };
  }, [usersData]);

  // Calculate total pages
  const totalPages = useMemo(() => {
    if (!usersData?.total) return 0;
    return Math.ceil(usersData.total / itemsPerPage);
  }, [usersData?.total, itemsPerPage]);

  // Compute filter options with useMemo for performance
  const availableRoles = useMemo(() => {
    return Object.keys(statsData.byRole);
  }, [statsData.byRole]);
  
  const availableOrgs = useMemo(() => {
    return Object.keys(statsData.byOrg);
  }, [statsData.byOrg]);
  
  const availableBusinessUnits = useMemo(() => {
    return Object.keys(statsData.byBusinessUnit);
  }, [statsData.byBusinessUnit]);
  
  const availableManagers = useMemo(() => {
    if (!usersData) return [];
    return usersData.data
      .filter(user => user.isManager)
      .map(user => user.cn);
  }, [usersData]);

  // Handlers
  const handleRefresh = useCallback(() => {
    refetchUsers();
  }, [refetchUsers]);
  
  const handleViewUser = useCallback((user: User) => {
    setSelectedUser(user);
    setUserDetailOpen(true);
  }, []);
  
  const handleEditUser = useCallback((user: User) => {
    toast({
      title: "Edit User",
      description: `You would now edit ${user.cn}`,
    });
  }, []);
  
  const handleDeleteUser = useCallback((user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  }, []);
  
  const confirmDeleteUser = useCallback(async () => {
    if (!userToDelete) return;
    
    try {
      await deleteUser(userToDelete._id);
      toast({
        title: "User Deleted",
        description: `${userToDelete.cn} has been deleted successfully.`,
      });
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      setUserDetailOpen(false);
      refetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    }
  }, [userToDelete, refetchUsers]);
  
  const handleToggleUserStatus = useCallback(async (user: User, newStatus: boolean) => {
    try {
      await updateUser(user._id, { isActive: newStatus });
      toast({
        title: newStatus ? "User Activated" : "User Deactivated",
        description: `${user.cn} has been ${newStatus ? "activated" : "deactivated"} successfully.`,
      });
      refetchUsers();
      
      // Update the selected user if it's the one being toggled
      if (selectedUser && selectedUser._id === user._id) {
        setSelectedUser({
          ...selectedUser,
          isActive: newStatus
        });
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      toast({
        title: "Error",
        description: "Failed to update user status. Please try again.",
        variant: "destructive",
      });
    }
  }, [selectedUser, refetchUsers]);
  
  const handleCreateUser = useCallback(async (userData: Omit<User, 'lastLoggedIn' | 'lastRatingSubmittedOn'>) => {
    setIsSubmitting(true);
    try {
      // Add the missing required fields before sending to API
      const userWithDates = {
        ...userData,
        lastLoggedIn: new Date().toISOString(),
        lastRatingSubmittedOn: new Date().toISOString()
      };
      
      await createUser(userWithDates);
      toast({
        title: "User Created",
        description: `${userData.cn} has been created successfully.`,
      });
      setCreateDialogOpen(false);
      refetchUsers();
    } catch (error) {
      console.error("Error creating user:", error);
      toast({
        title: "Error",
        description: "Failed to create user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [refetchUsers]);
  
  const handleResetFilters = useCallback(() => {
    setFilters({});
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description="Manage user accounts, permissions, and organization details"
        onRefresh={handleRefresh}
        onAdd={() => setCreateDialogOpen(true)}
        addButtonText="Add User"
      />
      
      <UsersStats 
        stats={statsData} 
        isLoading={isLoadingUsers} 
      />
      
      <Separator />
      
      <UsersFilters
        filters={filters}
        setFilters={updateFilters}
        onResetFilters={handleResetFilters}
        roleOptions={availableRoles}
        orgOptions={availableOrgs}
        businessUnitOptions={availableBusinessUnits}
      />
      
      <UsersTable
        users={usersData?.data || []}
        isLoading={isLoadingUsers}
        onEditUser={handleEditUser}
        onViewUser={handleViewUser}
        onDeleteUser={handleDeleteUser}
        onToggleUserStatus={handleToggleUserStatus}
        searchQuery={filters.search}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={usersData?.total || 0}
        onPageChange={handlePageChange}
      />
      
      <UserDetailSheet
        user={selectedUser}
        open={userDetailOpen}
        onOpenChange={setUserDetailOpen}
        onEdit={handleEditUser}
        onToggleStatus={handleToggleUserStatus}
      />
      
      <CreateUserDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateUser}
        availableRoles={availableRoles}
        availableOrgs={availableOrgs}
        availableBusinessUnits={availableBusinessUnits}
        availableManagers={availableManagers}
        isSubmitting={isSubmitting}
      />
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {userToDelete?.cn}'s account and remove all their data from the system.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteUser}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UsersPage;
