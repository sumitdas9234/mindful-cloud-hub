
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Separator } from '@/components/ui/separator';
import { PageHeader } from '@/components/compute/PageHeader';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Network, GitBranch, Globe, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SubnetData, RouteData } from '@/api/types/networking';

// Mock data
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
];

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
];

const NetworkingPage: React.FC = () => {
  const { toast } = useToast();

  const { data: subnets = [] } = useQuery({
    queryKey: ['subnets-summary'],
    queryFn: () => Promise.resolve(mockSubnets.slice(0, 2)),
  });

  const { data: routes = [] } = useQuery({
    queryKey: ['routes-summary'],
    queryFn: () => Promise.resolve(mockRoutes.slice(0, 2)),
  });

  const handleRefresh = () => {
    toast({
      title: "Refreshing network data",
      description: "The network information has been refreshed.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-500 hover:bg-green-500/20';
      case 'inactive': return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20';
      case 'pending': return 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20';
      default: return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'static': return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20';
      case 'openshift': return 'bg-red-500/10 text-red-500 hover:bg-red-500/20';
      default: return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20';
    }
  };

  return (
    <div className="container mx-auto space-y-6">
      <PageHeader 
        title="Network Management"
        description="An overview of your network resources, subnets, and routes."
        onRefresh={handleRefresh}
      />

      <Separator className="my-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Globe className="h-5 w-5 text-primary mr-2" />
                <CardTitle>Subnets</CardTitle>
              </div>
              <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                {mockSubnets.length} total
              </Badge>
            </div>
            <CardDescription>
              Manage and organize your network address space
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subnets.map(subnet => (
                <div key={subnet.id} className="flex items-center justify-between border-b pb-3">
                  <div>
                    <div className="font-medium">{subnet.name}</div>
                    <div className="text-sm text-muted-foreground">{subnet.cidr}</div>
                  </div>
                  <Badge
                    variant="outline"
                    className={getStatusColor(subnet.status)}
                  >
                    {subnet.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Link to="/networking/subnets" className="w-full">
              <Button variant="outline" className="w-full">
                View All Subnets <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <GitBranch className="h-5 w-5 text-primary mr-2" />
                <CardTitle>Routes</CardTitle>
              </div>
              <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                {mockRoutes.length} total
              </Badge>
            </div>
            <CardDescription>
              Manage traffic paths between networks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {routes.map(route => (
                <div key={route.id} className="flex items-center justify-between border-b pb-3">
                  <div>
                    <div className="font-medium">{route.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {route.destination} → {route.nextHop}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant="outline"
                      className={getTypeColor(route.type)}
                    >
                      {route.type}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={getStatusColor(route.status)}
                    >
                      {route.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Link to="/networking/routes" className="w-full">
              <Button variant="outline" className="w-full">
                View All Routes <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default NetworkingPage;
