import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import { PageHeader } from '@/components/compute/PageHeader';
import { UsersTable } from '@/components/users/UsersTable';
import { UsersFilters } from '@/components/users/UsersFilters';
import { UsersStats } from '@/components/users/UsersStats';
import { UserDetailSheet } from '@/components/users/UserDetailSheet';
import { CreateUserDialog } from '@/components/users/CreateUserDialog';
import { fetchUsers, fetchUserStats, createUser, updateUser, deleteUser } from '@/api/usersApi';
import { User, UserFilters } from '@/api/types/users';
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
  const [filters, setFilters] = useState<UserFilters>({});
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userDetailOpen, setUserDetailOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Queries
  const { 
    data: usersData, 
    isLoading: isLoadingUsers,
    refetch: refetchUsers
  } = useQuery({
    queryKey: ['users', currentPage, filters],
    queryFn: () => fetchUsers(currentPage, 10, filters),
  });
  
  const { 
    data: statsData, 
    isLoading: isLoadingStats,
    refetch: refetchStats
  } = useQuery({
    queryKey: ['user-stats'],
    queryFn: () => fetchUserStats(),
  });

  // Computed values for filter options
  const availableRoles = useMemo(() => {
    if (!statsData) return [];
    return Object.keys(statsData.byRole);
  }, [statsData]);
  
  const availableOrgs = useMemo(() => {
    if (!statsData) return [];
    return Object.keys(statsData.byOrg);
  }, [statsData]);
  
  const availableBusinessUnits = useMemo(() => {
    if (!statsData) return [];
    return Object.keys(statsData.byBusinessUnit);
  }, [statsData]);
  
  const availableManagers = useMemo(() => {
    if (!usersData) return [];
    return usersData.data
      .filter(user => user.isManager)
      .map(user => user.cn);
  }, [usersData]);

  // Handlers
  const handleRefresh = () => {
    refetchUsers();
    refetchStats();
  };
  
  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setUserDetailOpen(true);
  };
  
  const handleEditUser = (user: User) => {
    // In a real app, this would open an edit dialog
    toast({
      title: "Edit User",
      description: `You would now edit ${user.cn}`,
    });
  };
  
  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };
  
  const confirmDeleteUser = async () => {
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
      refetchStats();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleToggleUserStatus = async (user: User, newStatus: boolean) => {
    try {
      await updateUser(user._id, { isActive: newStatus });
      toast({
        title: newStatus ? "User Activated" : "User Deactivated",
        description: `${user.cn} has been ${newStatus ? "activated" : "deactivated"} successfully.`,
      });
      refetchUsers();
      refetchStats();
      
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
  };
  
  const handleCreateUser = async (userData: Omit<User, 'lastLoggedIn' | 'lastRatingSubmittedOn'>) => {
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
      refetchStats();
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
  };
  
  const handleResetFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  // Updated the render to fix the UserDetailSheet props
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
        stats={statsData || {
          totalUsers: 0,
          activeUsers: 0,
          inactiveUsers: 0,
          byRole: {},
          byOrg: {},
          byBusinessUnit: {}
        }} 
        isLoading={isLoadingStats} 
      />
      
      <Separator />
      
      <UsersFilters
        filters={filters}
        setFilters={setFilters}
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
