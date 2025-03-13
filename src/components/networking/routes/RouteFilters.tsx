
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter, Network, Router, GitBranch } from 'lucide-react';
import { SubnetData, RouteFilter } from '@/api/types/networking';

type RouteStatusFilter = 'all' | 'attached' | 'reserved' | 'orphaned' | 'available';

interface RouteFiltersProps {
  subnetId: string | null;
  subnetFilter: string;
  setSubnetFilter: (value: string) => void;
  routeStatusFilter: RouteStatusFilter;
  setRouteStatusFilter: (value: RouteStatusFilter) => void;
  activeTab: RouteFilter['type'];
  setActiveTab: (value: RouteFilter['type']) => void;
  subnets: SubnetData[];
}

export const RouteFilters: React.FC<RouteFiltersProps> = ({
  subnetId,
  subnetFilter,
  setSubnetFilter,
  routeStatusFilter,
  setRouteStatusFilter,
  activeTab,
  setActiveTab,
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
      
      <Tabs defaultValue={activeTab} className="w-auto" onValueChange={(value) => setActiveTab(value as RouteFilter['type'])}>
        <TabsList>
          <TabsTrigger value="all">
            <Router className="mr-1.5 h-4 w-4" />
            All
          </TabsTrigger>
          <TabsTrigger value="static">
            <Router className="mr-1.5 h-4 w-4" />
            Static
          </TabsTrigger>
          <TabsTrigger value="openshift">
            <GitBranch className="mr-1.5 h-4 w-4" />
            OpenShift
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
