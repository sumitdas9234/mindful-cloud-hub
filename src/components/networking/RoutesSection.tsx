
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

// Extend RouteData to include statuses
const mockRoutes: (RouteData & { routeStatus?: 'available' | 'reserved' | 'orphaned' | 'attached' })[] = [
  {
    id: "route-1",
    name: "Default Gateway",
    subnetId: "subnet-1",
    subnetName: "Production Network",
    destination: "0.0.0.0/0",
    nextHop: "10.0.0.1",
    type: "static",
    status: "active",
    routeStatus: "attached",
    priority: 100,
    createdAt: "2023-01-15T10:30:00Z",
    updatedAt: "2023-01-15T10:30:00Z",
    description: "Default route to internet gateway"
  },
  {
    id: "route-2",
    name: "Database Cluster",
    subnetId: "subnet-1",
    subnetName: "Production Network",
    destination: "10.1.0.0/24",
    nextHop: "10.0.0.254",
    type: "static",
    status: "active",
    routeStatus: "reserved",
    priority: 200,
    createdAt: "2023-01-20T11:45:00Z",
    updatedAt: "2023-02-05T09:30:00Z",
    description: "Route to database subnet"
  },
  {
    id: "route-3",
    name: "Pod Network",
    subnetId: "subnet-1",
    subnetName: "Production Network",
    destination: "172.17.0.0/16",
    nextHop: "10.0.0.100",
    type: "openshift",
    status: "active",
    routeStatus: "attached",
    priority: 300,
    createdAt: "2023-02-10T14:20:00Z",
    updatedAt: "2023-02-10T14:20:00Z",
    description: "Route to Kubernetes pod network"
  },
  {
    id: "route-4",
    name: "Service Network",
    subnetId: "subnet-1",
    subnetName: "Production Network",
    destination: "10.96.0.0/12",
    nextHop: "10.0.0.101",
    type: "openshift",
    status: "active",
    routeStatus: "attached",
    priority: 400,
    createdAt: "2023-02-15T08:10:00Z",
    updatedAt: "2023-02-15T08:10:00Z",
    description: "Route to Kubernetes service network"
  },
  {
    id: "route-5",
    name: "Storage Network",
    subnetId: "subnet-2",
    subnetName: "Development Network",
    destination: "10.200.0.0/24",
    nextHop: "172.16.0.254",
    type: "static",
    status: "active",
    routeStatus: "available",
    priority: 500,
    createdAt: "2023-03-01T13:25:00Z",
    updatedAt: "2023-03-01T13:25:00Z",
    description: "Route to storage network"
  },
  {
    id: "route-6",
    name: "External Services",
    subnetId: "subnet-2",
    subnetName: "Development Network",
    destination: "172.20.0.0/16",
    nextHop: "172.16.0.1",
    type: "static",
    status: "inactive",
    routeStatus: "orphaned",
    priority: 600,
    createdAt: "2023-03-15T16:40:00Z",
    updatedAt: "2023-03-15T16:40:00Z",
    description: "Route to external services"
  },
  {
    id: "route-7",
    name: "Monitoring Network",
    subnetId: "subnet-3",
    subnetName: "Management Network",
    destination: "192.168.10.0/24",
    nextHop: "192.168.0.254",
    type: "static",
    status: "active",
    routeStatus: "attached",
    priority: 700,
    createdAt: "2023-04-05T09:55:00Z",
    updatedAt: "2023-04-05T09:55:00Z",
    description: "Route to monitoring infrastructure"
  },
  {
    id: "route-8",
    name: "Backup Network",
    subnetId: "subnet-3",
    subnetName: "Management Network",
    destination: "192.168.20.0/24",
    nextHop: "192.168.0.253",
    type: "static",
    status: "pending",
    routeStatus: "reserved",
    priority: 800,
    createdAt: "2023-04-20T11:30:00Z",
    updatedAt: "2023-04-20T11:30:00Z",
    description: "Route to backup infrastructure"
  }
];

// Mock data for subnets (for filtering)
const mockSubnets: SubnetData[] = [
  {
    id: "subnet-1",
    name: "Production Network",
    cidr: "10.0.0.0/16",
    description: "Main production network subnet",
    status: "active",
    vlanId: 100,
    gatewayIp: "10.0.0.1",
    routesCount: 12,
    createdAt: "2023-01-15T10:00:00Z",
    location: "US-East",
    environment: "Production"
  },
  {
    id: "subnet-2",
    name: "Development Network",
    cidr: "172.16.0.0/20",
    description: "Development and testing environment",
    status: "active",
    vlanId: 200,
    gatewayIp: "172.16.0.1",
    routesCount: 8,
    createdAt: "2023-02-20T14:30:00Z",
    location: "US-West",
    environment: "Development"
  },
  {
    id: "subnet-3",
    name: "Management Network",
    cidr: "192.168.0.0/24",
    description: "Management and control plane traffic",
    status: "active",
    vlanId: 300,
    gatewayIp: "192.168.0.1",
    routesCount: 5,
    createdAt: "2023-03-05T09:15:00Z",
    location: "EU-Central",
    environment: "Infrastructure"
  }
];

type RouteStatusFilter = 'all' | 'attached' | 'reserved' | 'orphaned' | 'available';

interface RoutesSectionProps {
  subnetId: string | null;
  subnet: SubnetData | null;
  onBack?: () => void;
}

export const RoutesSection: React.FC<RoutesSectionProps> = ({ 
  subnetId,
  subnet
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<RouteFilter['type']>('all');
  const [routeStatusFilter, setRouteStatusFilter] = useState<RouteStatusFilter>('all');
  const [subnetFilter, setSubnetFilter] = useState<string>('all');
  const [selectedRoute, setSelectedRoute] = useState<RouteData | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const { toast } = useToast();

  const { data: routes = [], isLoading, refetch } = useQuery({
    queryKey: ['routes', subnetId],
    queryFn: () => Promise.resolve(
      subnetId 
        ? mockRoutes.filter(route => route.subnetId === subnetId)
        : mockRoutes
    ),
  });

  const { data: subnets = [] } = useQuery({
    queryKey: ['subnets'],
    queryFn: () => Promise.resolve(mockSubnets),
  });

  const filteredRoutes = routes.filter(route => {
    const matchesSearch = 
      route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.nextHop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.subnetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (route.description && route.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = activeTab === 'all' || route.type === activeTab;
    const matchesStatus = routeStatusFilter === 'all' || route.routeStatus === routeStatusFilter;
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
          routeStatusFilter={routeStatusFilter}
          setRouteStatusFilter={setRouteStatusFilter}
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
