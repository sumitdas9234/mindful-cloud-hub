
import React from 'react';
import { Search } from 'lucide-react';
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
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, search: e.target.value });
  };

  const handleRoleChange = (value: string) => {
    setFilters({ ...filters, role: value === "all" ? undefined : value });
  };

  const handleOrgChange = (value: string) => {
    setFilters({ ...filters, org: value === "all" ? undefined : value });
  };

  return (
    <div className="space-y-4 bg-muted/20 p-4 rounded-lg border">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users..."
            className="pl-8"
            value={filters.search || ''}
            onChange={handleSearchChange}
          />
        </div>
        
        <Select
          value={filters.role || 'all'}
          onValueChange={handleRoleChange}
        >
          <SelectTrigger>
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
          <SelectTrigger>
            <SelectValue placeholder="Organization: All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Organizations</SelectItem>
            {orgOptions.map(org => (
              <SelectItem key={org} value={org}>{org}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onResetFilters}
        >
          Reset Filters
        </Button>
      </div>
    </div>
  );
};
