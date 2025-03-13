
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Network } from 'lucide-react';
import { SubnetData, RouteFilter } from '@/api/types/networking';

type RouteStatusFilter = 'all' | 'attached' | 'reserved' | 'orphaned' | 'available';

interface RouteFiltersProps {
  subnetId: string | null;
  subnetFilter: string;
  setSubnetFilter: (value: string) => void;
  routeStatusFilter: RouteStatusFilter;
  setRouteStatusFilter: (value: RouteStatusFilter) => void;
  subnets: SubnetData[];
}

export const RouteFilters: React.FC<RouteFiltersProps> = ({
  subnetId,
  subnetFilter,
  setSubnetFilter,
  routeStatusFilter,
  setRouteStatusFilter,
  subnets
}) => {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      {!subnetId && (
        <Select 
          value={subnetFilter} 
          onValueChange={(value) => setSubnetFilter(value)}
        >
          <SelectTrigger className="w-[180px]">
            <Network className="mr-1.5 h-4 w-4" />
            <SelectValue placeholder="All Subnets" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subnets</SelectItem>
            {subnets.map(subnet => (
              <SelectItem key={subnet.id} value={subnet.id}>
                {subnet.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      
      <Select 
        value={routeStatusFilter} 
        onValueChange={(value) => setRouteStatusFilter(value as RouteStatusFilter)}
      >
        <SelectTrigger className="w-[150px]">
          <Filter className="mr-1.5 h-4 w-4" />
          <SelectValue placeholder="All Statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="attached">Attached</SelectItem>
          <SelectItem value="reserved">Reserved</SelectItem>
          <SelectItem value="orphaned">Orphaned</SelectItem>
          <SelectItem value="available">Available</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
