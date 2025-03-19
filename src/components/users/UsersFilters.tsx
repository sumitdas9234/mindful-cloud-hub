
import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { UserFilters } from '@/api/types/users';

interface UsersFiltersProps {
  filters: UserFilters;
  setFilters: (filters: UserFilters) => void;
  onResetFilters: () => void;
  roleOptions: string[];
  orgOptions: string[];
  businessUnitOptions: string[];
}

export const UsersFilters: React.FC<UsersFiltersProps> = ({
  filters,
  setFilters,
  onResetFilters,
  roleOptions,
  orgOptions,
}) => {
  // Local state for search input to debounce
  const [searchInput, setSearchInput] = useState(filters.search || '');

  // Update local search state when filters change externally
  useEffect(() => {
    setSearchInput(filters.search || '');
  }, [filters.search]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        setFilters({ ...filters, search: searchInput });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput, filters, setFilters]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleRoleChange = (value: string) => {
    setFilters({ ...filters, role: value === "all" ? undefined : value });
  };

  const handleOrgChange = (value: string) => {
    setFilters({ ...filters, org: value === "all" ? undefined : value });
  };

  const hasActiveFilters = filters.search || filters.role || filters.org || filters.isActive !== undefined;

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search users..."
          className="pl-8"
          value={searchInput}
          onChange={handleSearchChange}
        />
      </div>
      
      <Select
        value={filters.role || 'all'}
        onValueChange={handleRoleChange}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Role: All" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Roles</SelectItem>
          {roleOptions.map(role => (
            <SelectItem key={role} value={role}>{role}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select
        value={filters.org || 'all'}
        onValueChange={handleOrgChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Organization: All" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Organizations</SelectItem>
          {orgOptions.map(org => (
            <SelectItem key={org} value={org}>{org}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {hasActiveFilters && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onResetFilters}
          className="ml-auto flex items-center gap-1"
        >
          <X className="h-3.5 w-3.5" />
          Reset
        </Button>
      )}
    </div>
  );
};
