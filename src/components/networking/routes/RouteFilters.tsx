
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubnetData } from '@/api/types/networking';

interface RouteFiltersProps {
  subnetId: string | null;
  subnetFilter: string;
  setSubnetFilter: (value: string) => void;
  statusFilter: 'all' | 'available' | 'attached' | 'reserved' | 'orphaned';
  setStatusFilter: (value: 'all' | 'available' | 'attached' | 'reserved' | 'orphaned') => void;
  subnets: SubnetData[];
}

export const RouteFilters: React.FC<RouteFiltersProps> = ({
  subnetId,
  subnetFilter,
  setSubnetFilter,
  statusFilter,
  setStatusFilter,
  subnets
}) => {
  const handleStatusChange = (value: string) => {
    setStatusFilter(value as 'all' | 'available' | 'attached' | 'reserved' | 'orphaned');
  };

  const handleSubnetChange = (value: string) => {
    setSubnetFilter(value);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <Select value={statusFilter} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="available">Available</SelectItem>
          <SelectItem value="attached">Attached</SelectItem>
          <SelectItem value="reserved">Reserved</SelectItem>
          <SelectItem value="orphaned">Orphaned</SelectItem>
        </SelectContent>
      </Select>

      {!subnetId && (
        <Select value={subnetFilter} onValueChange={handleSubnetChange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Subnet" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subnets</SelectItem>
            {subnets.map((subnet) => (
              <SelectItem key={subnet.id} value={subnet.id}>
                {subnet.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};
