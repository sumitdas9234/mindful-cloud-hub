
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  DropdownMenu, DropdownMenuContent, 
  DropdownMenuItem, DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MoreVertical, RotateCw, Router, 
  ChevronLeft, GitBranch 
} from 'lucide-react';
import { RouteData, RouteFilter, SubnetData } from '@/api/types/networking';
import { DataTable, Column } from '@/components/compute/DataTable';
import { SearchBar } from '@/components/compute/SearchBar';
import { useToast } from '@/hooks/use-toast';

// Mock data for routes
const mockRoutes: RouteData[] = [
  {
    id: "route-1",
    name: "Default Gateway",
    subnetId: "subnet-1",
    subnetName: "Production Network",
    destination: "0.0.0.0/0",
    nextHop: "10.0.0.1",
    type: "static",
    status: "active",
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
    priority: 800,
    createdAt: "2023-04-20T11:30:00Z",
    updatedAt: "2023-04-20T11:30:00Z",
    description: "Route to backup infrastructure"
  }
];

interface RoutesSectionProps {
  subnetId: string | null;
  subnet: SubnetData | null;
  onBack: () => void;
}

export const RoutesSection: React.FC<RoutesSectionProps> = ({ 
  subnetId,
  subnet,
  onBack
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<RouteFilter['type']>('all');
  const { toast } = useToast();

  const { data: routes = [], isLoading, refetch } = useQuery({
    queryKey: ['routes', subnetId],
    queryFn: () => Promise.resolve(
      subnetId 
        ? mockRoutes.filter(route => route.subnetId === subnetId)
        : mockRoutes
    ),
  });

  const filteredRoutes = routes.filter(route => {
    const matchesSearch = 
      route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.nextHop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (route.description && route.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = typeFilter === 'all' || route.type === typeFilter;
    
    return matchesSearch && matchesType;
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

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-500 hover:bg-green-500/20';
      case 'inactive': return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20';
      case 'pending': return 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20';
      default: return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20';
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'static': return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20';
      case 'openshift': return 'bg-red-500/10 text-red-500 hover:bg-red-500/20';
      default: return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20';
    }
  };

  const columns: Column<RouteData>[] = [
    {
      key: 'name',
      header: 'Name',
      cell: (route) => <span className="font-medium">{route.name}</span>
    },
    {
      key: 'destination',
      header: 'Destination',
      cell: (route) => route.destination
    },
    {
      key: 'nextHop',
      header: 'Next Hop',
      cell: (route) => route.nextHop
    },
    {
      key: 'type',
      header: 'Type',
      cell: (route) => (
        <Badge
          variant="outline"
          className={getTypeBadgeColor(route.type)}
        >
          {route.type}
        </Badge>
      )
    },
    {
      key: 'status',
      header: 'Status',
      cell: (route) => (
        <Badge
          variant="outline"
          className={getStatusBadgeColor(route.status)}
        >
          {route.status}
        </Badge>
      )
    },
    {
      key: 'priority',
      header: 'Priority',
      cell: (route) => route.priority
    }
  ];

  const actionColumn = (route: RouteData) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleRouteAction('View', route)}>
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleRouteAction('Edit', route)}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleRouteAction('Delete', route)}
          className="text-red-500"
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="mr-4"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Subnets
          </Button>
          <div>
            <h2 className="text-2xl font-bold">{subnet?.name || 'All Routes'}</h2>
            <p className="text-sm text-muted-foreground">
              {subnet 
                ? `CIDR: ${subnet.cidr} | Gateway: ${subnet.gatewayIp}`
                : 'Viewing all network routes'}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RotateCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <SearchBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder="Search routes..."
        />
        <div className="flex items-center space-x-2">
          <Button
            variant={typeFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTypeFilter('all')}
          >
            <Router className="mr-2 h-4 w-4" />
            All
          </Button>
          <Button
            variant={typeFilter === 'static' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTypeFilter('static')}
          >
            <Router className="mr-2 h-4 w-4" />
            Static
          </Button>
          <Button
            variant={typeFilter === 'openshift' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTypeFilter('openshift')}
          >
            <GitBranch className="mr-2 h-4 w-4" />
            OpenShift
          </Button>
        </div>
      </div>

      <DataTable
        data={filteredRoutes}
        columns={columns}
        keyExtractor={(route) => route.id}
        isLoading={isLoading}
        emptyTitle="No Routes Found"
        emptyDescription={searchQuery ? "No routes match your search criteria." : "No routes have been added yet."}
        searchQuery={searchQuery}
        actionColumn={actionColumn}
      />
    </div>
  );
};
