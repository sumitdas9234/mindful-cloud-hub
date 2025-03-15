import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { RouteData, RouteFilter, SubnetData } from '@/api/types/networking';
import { DataTable } from '@/components/compute/DataTable';
import { SearchBar } from '@/components/compute/SearchBar';
import { useToast } from '@/hooks/use-toast';
import { RouteDetailSheet } from './RouteDetailSheet';
import { RouteHeader } from './routes/RouteHeader';
import { RouteFilters } from './routes/RouteFilters';
import { RouteActions } from './routes/RouteActions';
import { getRouteColumns } from './routes/RouteColumns';
import { fetchRoutes, fetchRoutesBySubnet } from '@/api/routesApi';
import { fetchSubnets } from '@/api/networkingApi';

interface RoutesSectionProps {
  subnetId: string | null;
  subnet: SubnetData | null;
  onBack?: () => void;
}

export const RoutesSection: React.FC<RoutesSectionProps> = ({ 
  subnetId,
  subnet,
  onBack
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<RouteFilter['type']>('all');
  const [statusFilter, setStatusFilter] = useState<RouteFilter['status']>('all');
  const [subnetFilter, setSubnetFilter] = useState<string>(subnetId || 'all');
  const [selectedRoute, setSelectedRoute] = useState<RouteData | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const { toast } = useToast();

  // Fetch routes - either all routes or filtered by subnet
  const { data: routes = [], isLoading, refetch } = useQuery({
    queryKey: ['routes', subnetId],
    queryFn: () => subnetId ? fetchRoutesBySubnet(subnetId) : fetchRoutes(),
    staleTime: 0,
    refetchOnMount: 'always',
    gcTime: 0,
  });

  // Fetch all subnets for filtering
  const { data: subnets = [] } = useQuery({
    queryKey: ['subnets-for-routes'],
    queryFn: fetchSubnets,
    staleTime: 0,
  });

  const filteredRoutes = routes.filter(route => {
    const matchesSearch = 
      route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.subnetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (route.testbed && route.testbed.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (route.type === 'openshift' && route.vip && 
        (route.vip.ip.includes(searchQuery) || route.vip.fqdn.toLowerCase().includes(searchQuery.toLowerCase()))) ||
      (route.type === 'openshift' && route.apps && 
        (route.apps.ip.includes(searchQuery) || route.apps.fqdn.toLowerCase().includes(searchQuery.toLowerCase()))) ||
      (route.type === 'static' && route.ip && route.ip.includes(searchQuery));
    
    const matchesType = activeTab === 'all' || route.type === activeTab;
    const matchesStatus = statusFilter === 'all' || route.status === statusFilter;
    const matchesSubnet = subnetFilter === 'all' || route.subnetId === subnetFilter;
    
    return matchesSearch && matchesType && matchesStatus && matchesSubnet;
  });

  const handleRefresh = () => {
    refetch();
    toast({
      title: "Refreshing routes",
      description: "The routes list has been refreshed.",
    });
  };

  const handleRouteAction = (action: string, route: RouteData) => {
    toast({
      title: `${action} Route`,
      description: `Action "${action}" triggered for route "${route.name}".`,
    });
  };

  const handleRowClick = (route: RouteData) => {
    setSelectedRoute(route);
    setIsDetailOpen(true);
  };

  const columns = getRouteColumns();

  const actionColumn = (route: RouteData) => (
    <RouteActions route={route} handleRouteAction={handleRouteAction} />
  );

  return (
    <div className="space-y-4">
      <RouteHeader 
        subnet={subnet} 
        handleRefresh={handleRefresh} 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onBack={onBack}
      />
      
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mt-6">
        <SearchBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder="Search routes..."
        />
        
        <RouteFilters
          subnetId={subnetId}
          subnetFilter={subnetFilter}
          setSubnetFilter={setSubnetFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          subnets={subnets}
        />
      </div>

      <DataTable
        data={filteredRoutes}
        columns={columns}
        keyExtractor={(route) => route.id}
        isLoading={isLoading}
        emptyTitle="No Routes Found"
        emptyDescription={searchQuery ? "No routes match your search criteria." : "No routes have been added yet."}
        searchQuery={searchQuery}
        onRowClick={handleRowClick}
        actionColumn={actionColumn}
      />

      <RouteDetailSheet
        route={selectedRoute}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />
    </div>
  );
};
