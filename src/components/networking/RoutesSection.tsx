import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { RouteData, RouteFilter, SubnetData } from '@/api/types/networking';
import { DataTable } from '@/components/compute/DataTable';
import { SearchBar } from '@/components/compute/SearchBar';
import { useToast } from '@/hooks/use-toast';
import { RouteDetailSheet } from './RouteDetailSheet';
import { RouteHeader } from './routes/RouteHeader';
import { RouteFilters } from './routes/RouteFilters';
import { getRouteColumns } from './routes/RouteColumns';
import { fetchRoutes } from '@/api/routesApi';
import { fetchSubnets } from '@/api/networkingApi';
import { RouteUpdateDialog } from './routes/RouteUpdateDialog';
import { RouteActions } from './routes/RouteActions';

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
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (subnetId) {
      setSubnetFilter(subnetId);
    }
  }, [subnetId]);

  const { 
    data: allRoutes = [], 
    isLoading, 
    refetch: refetchRoutes, 
    error: routesError 
  } = useQuery({
    queryKey: ['routes'],
    queryFn: fetchRoutes,
    staleTime: 0,
    refetchOnMount: 'always',
    gcTime: 0,
  });

  const { data: subnets = [], error: subnetsError } = useQuery({
    queryKey: ['subnets-for-routes'],
    queryFn: fetchSubnets,
    staleTime: 0,
  });

  if (routesError) console.error('Error fetching routes:', routesError);
  if (subnetsError) console.error('Error fetching subnets:', subnetsError);

  const getSubnetNameFromId = (id: string): string | null => {
    const subnet = subnets.find(s => s.id === id);
    return subnet ? subnet.name : null;
  };

  console.log('Filtering routes with subnetFilter ID:', subnetFilter);
  const subnetName = subnetFilter !== 'all' ? getSubnetNameFromId(subnetFilter) : 'all';
  console.log('Subnet name for filtering:', subnetName);
  console.log('Available subnets:', subnets.map(s => ({ id: s.id, name: s.name })));

  const filteredRoutes = allRoutes.filter(route => {
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
    
    const matchesSubnet = subnetFilter === 'all' || 
      (subnetName && route.subnetName === subnetName);
    
    if (subnetFilter !== 'all' && subnetName && route.subnetName === subnetName) {
      console.log('Route matches subnet filter:', route.name, route.subnetName);
    }
    
    return matchesSearch && matchesType && matchesStatus && matchesSubnet;
  });

  console.log('Filtered routes count:', filteredRoutes.length);

  const handleRefresh = () => {
    refetchRoutes();
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

  const handleRouteUpdate = (routeId: string, updates: Partial<RouteData>) => {
    console.log('Updating route:', routeId, updates);
    toast({
      title: "Route Updated",
      description: `Route ${routeId} has been updated with new values.`,
    });
    
    refetchRoutes();
    setIsUpdateDialogOpen(false);
  };

  const handleRowClick = (route: RouteData) => {
    setSelectedRoute(route);
    setIsDetailOpen(true);
  };

  const handleUpdateClick = () => {
    if (selectedRoute) {
      setIsUpdateDialogOpen(true);
    }
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
        onUpdateClick={handleUpdateClick}
      />

      {selectedRoute && (
        <RouteUpdateDialog
          route={selectedRoute}
          open={isUpdateDialogOpen}
          onOpenChange={setIsUpdateDialogOpen}
          onRouteUpdate={handleRouteUpdate}
        />
      )}
    </div>
  );
};
