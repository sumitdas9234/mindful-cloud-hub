
import React, { useState, useEffect, useCallback } from 'react';
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
  businessUnitOptions,
}) => {
  // Local state for search input to debounce
  const [searchInput, setSearchInput] = useState(filters.search || '');
  const [isSearching, setIsSearching] = useState(false);

  // Update local search state when filters change externally
  useEffect(() => {
    if (!isSearching) {
      setSearchInput(filters.search || '');
    }
  }, [filters.search, isSearching]);

  // Debounce search input with useCallback for better performance
  const debouncedSearch = useCallback((value: string) => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      setFilters({ ...filters, search: value.trim() });
      setIsSearching(false);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [filters, setFilters]);

  // Apply debounced search
  useEffect(() => {
    const cleanup = debouncedSearch(searchInput);
    return cleanup;
  }, [searchInput, debouncedSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleRoleChange = (value: string) => {
    setFilters({ ...filters, role: value === "all" ? undefined : value });
  };

  const handleOrgChange = (value: string) => {
    setFilters({ ...filters, org: value === "all" ? undefined : value });
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setFilters({ ...filters, search: '' });
  };

  const hasActiveFilters = filters.search || filters.role || filters.org || filters.isActive !== undefined;

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text" 
          placeholder="Search users by name, ID, email..."
          className="pl-8"
          value={searchInput}
          onChange={handleSearchChange}
        />
        {searchInput && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
            onClick={handleClearSearch}
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
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
