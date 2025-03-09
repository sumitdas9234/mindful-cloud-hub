
import React, { useState, useEffect } from 'react';
import { 
  Network, 
  RefreshCw, 
  Search,
  PlusCircle, 
  MoreHorizontal,
  Globe,
  ArrowRightLeft,
  Share2,
  Router,
  WifiOff,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';

interface NetworkData {
  id: string;
  name: string;
  type: 'VLAN' | 'VPN' | 'Public' | 'Private' | 'DMZ';
  cidr: string;
  gateway?: string;
  status: 'Active' | 'Inactive' | 'Maintenance';
  connected: number;
  security: 'High' | 'Medium' | 'Low';
  bandwidth: {
    allocated: string;
    utilized: number;
  };
  latency: number;
}

interface RouteData {
  id: string;
  source: string;
  destination: string;
  type: 'Static' | 'Dynamic' | 'BGP';
  status: 'Active' | 'Inactive';
  hops: number;
  metric: number;
}

const mockNetworks: NetworkData[] = [
  {
    id: 'net1',
    name: 'Production VLAN',
    type: 'VLAN',
    cidr: '10.0.1.0/24',
    gateway: '10.0.1.1',
    status: 'Active',
    connected: 48,
    security: 'High',
    bandwidth: {
      allocated: '10 Gbps',
      utilized: 68
    },
    latency: 1.2
  },
  {
    id: 'net2',
    name: 'Development Network',
    type: 'Private',
    cidr: '10.0.2.0/24',
    gateway: '10.0.2.1',
    status: 'Active',
    connected: 32,
    security: 'Medium',
    bandwidth: {
      allocated: '5 Gbps',
      utilized: 45
    },
    latency: 2.1
  },
  {
    id: 'net3',
    name: 'Public Web Services',
    type: 'Public',
    cidr: '203.0.113.0/24',
    gateway: '203.0.113.1',
    status: 'Active',
    connected: 12,
    security: 'High',
    bandwidth: {
      allocated: '2 Gbps',
      utilized: 72
    },
    latency: 18.5
  },
  {
    id: 'net4',
    name: 'Remote Office VPN',
    type: 'VPN',
    cidr: '10.1.0.0/16',
    status: 'Inactive',
    connected: 0,
    security: 'High',
    bandwidth: {
      allocated: '1 Gbps',
      utilized: 0
    },
    latency: 0
  },
  {
    id: 'net5',
    name: 'DMZ Services',
    type: 'DMZ',
    cidr: '172.16.0.0/24',
    gateway: '172.16.0.1',
    status: 'Maintenance',
    connected: 4,
    security: 'High',
    bandwidth: {
      allocated: '5 Gbps',
      utilized: 12
    },
    latency: 5.4
  }
];

const mockRoutes: RouteData[] = [
  {
    id: 'route1',
    source: '10.0.1.0/24',
    destination: '10.0.2.0/24',
    type: 'Static',
    status: 'Active',
    hops: 1,
    metric: 100
  },
  {
    id: 'route2',
    source: '10.0.1.0/24',
    destination: '203.0.113.0/24',
    type: 'Static',
    status: 'Active',
    hops: 1,
    metric: 100
  },
  {
    id: 'route3',
    source: '10.0.2.0/24',
    destination: '172.16.0.0/24',
    type: 'Dynamic',
    status: 'Active',
    hops: 2,
    metric: 120
  },
  {
    id: 'route4',
    source: '10.1.0.0/16',
    destination: '10.0.0.0/8',
    type: 'BGP',
    status: 'Inactive',
    hops: 3,
    metric: 200
  },
  {
    id: 'route5',
    source: '172.16.0.0/24',
    destination: '0.0.0.0/0',
    type: 'Static',
    status: 'Active',
    hops: 1,
    metric: 10
  }
];

const Networking = () => {
  const [networks, setNetworks] = useState<NetworkData[]>([]);
  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedTab, setSelectedTab] = useState<string>('networks');
  const [selectedNetworkTab, setSelectedNetworkTab] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchNetworkData();
  }, []);

  const fetchNetworkData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      setNetworks(mockNetworks);
      setRoutes(mockRoutes);
    } catch (error) {
      toast({
        title: "Error fetching network data",
        description: "Failed to load network information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchNetworkData();
    toast({
      title: "Refreshing network data",
      description: "The network data is being refreshed."
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredNetworks = networks.filter(network => 
    network.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    network.cidr.toLowerCase().includes(searchQuery.toLowerCase()) ||
    network.type.toLowerCase().includes(searchQuery.toLowerCase())
  ).filter(network => {
    if (selectedNetworkTab === 'all') return true;
    if (selectedNetworkTab === 'active') return network.status === 'Active';
    if (selectedNetworkTab === 'maintenance') return network.status === 'Maintenance';
    if (selectedNetworkTab === 'inactive') return network.status === 'Inactive';
    return true;
  });

  const filteredRoutes = routes.filter(route => 
    route.source.includes(searchQuery) ||
    route.destination.includes(searchQuery) ||
    route.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getNetworkStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'Maintenance':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'Inactive':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getNetworkTypeIcon = (type: string) => {
    switch (type) {
      case 'VLAN':
        return <Network className="h-4 w-4 text-blue-500" />;
      case 'VPN':
        return <ShieldCheck className="h-4 w-4 text-purple-500" />;
      case 'Public':
        return <Globe className="h-4 w-4 text-green-500" />;
      case 'Private':
        return <Share2 className="h-4 w-4 text-orange-500" />;
      case 'DMZ':
        return <Router className="h-4 w-4 text-red-500" />;
      default:
        return <Network className="h-4 w-4" />;
    }
  };

  const getSecurityBadge = (level: string) => {
    switch (level) {
      case 'High':
        return <Badge className="bg-green-500">High</Badge>;
      case 'Medium':
        return <Badge variant="outline" className="text-yellow-500 border-yellow-500">Medium</Badge>;
      case 'Low':
        return <Badge variant="destructive">Low</Badge>;
      default:
        return null;
    }
  };

  const handleAddNetwork = () => {
    toast({
      title: "Feature coming soon",
      description: "Adding new network functionality is under development."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Network Management</h1>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button size="sm" onClick={handleAddNetwork}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Network
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input 
          placeholder="Search networks or routes..." 
          className="max-w-sm"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      <Tabs defaultValue="networks" onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="networks">Networks</TabsTrigger>
          <TabsTrigger value="routes">Routes</TabsTrigger>
          <TabsTrigger value="topology">Network Topology</TabsTrigger>
        </TabsList>

        <TabsContent value="networks" className="space-y-4 mt-6">
          <Tabs defaultValue="all" onValueChange={setSelectedNetworkTab}>
            <TabsList>
              <TabsTrigger value="all">All Networks</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
              <TabsTrigger value="inactive">Inactive</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>CIDR</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Connected</TableHead>
                        <TableHead>Security</TableHead>
                        <TableHead>Bandwidth</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        Array(3).fill(0).map((_, i) => (
                          <TableRow key={`skeleton-${i}`} className="animate-pulse">
                            <TableCell>
                              <div className="h-4 w-3/4 bg-muted rounded" />
                            </TableCell>
                            <TableCell>
                              <div className="h-4 w-16 bg-muted rounded" />
                            </TableCell>
                            <TableCell>
                              <div className="h-4 w-24 bg-muted rounded" />
                            </TableCell>
                            <TableCell>
                              <div className="h-4 w-16 bg-muted rounded" />
                            </TableCell>
                            <TableCell>
                              <div className="h-4 w-8 bg-muted rounded" />
                            </TableCell>
                            <TableCell>
                              <div className="h-4 w-16 bg-muted rounded" />
                            </TableCell>
                            <TableCell>
                              <div className="h-4 w-full bg-muted rounded" />
                            </TableCell>
                            <TableCell>
                              <div className="h-8 w-8 bg-muted rounded" />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : filteredNetworks.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                            No networks found matching your criteria.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredNetworks.map(network => (
                          <TableRow key={network.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center">
                                {getNetworkTypeIcon(network.type)}
                                <span className="ml-2">{network.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>{network.type}</TableCell>
                            <TableCell>
                              <div>
                                <div>{network.cidr}</div>
                                {network.gateway && (
                                  <div className="text-xs text-muted-foreground">
                                    Gateway: {network.gateway}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                {getNetworkStatusIcon(network.status)}
                                <span className="ml-1">{network.status}</span>
                              </div>
                            </TableCell>
                            <TableCell>{network.connected} devices</TableCell>
                            <TableCell>{getSecurityBadge(network.security)}</TableCell>
                            <TableCell>
                              <div>
                                <div className="flex items-center justify-between text-xs mb-1">
                                  <span>{network.bandwidth.allocated}</span>
                                  <span>{network.bandwidth.utilized}%</span>
                                </div>
                                <Progress value={network.bandwidth.utilized} className="h-1.5" />
                              </div>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>View Details</DropdownMenuItem>
                                  <DropdownMenuItem>Edit Network</DropdownMenuItem>
                                  <DropdownMenuItem>Manage Devices</DropdownMenuItem>
                                  <DropdownMenuItem>Configure Firewall</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  {network.status === 'Active' ? (
                                    <DropdownMenuItem className="text-destructive">
                                      Deactivate Network
                                    </DropdownMenuItem>
                                  ) : (
                                    <DropdownMenuItem>
                                      Activate Network
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="active" className="mt-6">
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>CIDR</TableHead>
                        <TableHead>Connected</TableHead>
                        <TableHead>Bandwidth Utilization</TableHead>
                        <TableHead>Latency</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredNetworks.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                            No active networks found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredNetworks.map(network => (
                          <TableRow key={network.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center">
                                {getNetworkTypeIcon(network.type)}
                                <span className="ml-2">{network.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>{network.type}</TableCell>
                            <TableCell>{network.cidr}</TableCell>
                            <TableCell>{network.connected} devices</TableCell>
                            <TableCell>
                              <div>
                                <div className="flex items-center justify-between text-xs mb-1">
                                  <span>{network.bandwidth.utilized}%</span>
                                </div>
                                <Progress value={network.bandwidth.utilized} className="h-1.5" />
                              </div>
                            </TableCell>
                            <TableCell>
                              {network.latency > 0 ? `${network.latency} ms` : 'N/A'}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  toast({
                                    title: "Monitoring network",
                                    description: `Viewing live metrics for ${network.name}`,
                                  });
                                }}
                              >
                                Monitor
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="maintenance" className="mt-6">
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>CIDR</TableHead>
                        <TableHead>Maintenance Since</TableHead>
                        <TableHead>Expected Completion</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredNetworks.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                            No networks in maintenance mode.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredNetworks.map(network => (
                          <TableRow key={network.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center">
                                {getNetworkTypeIcon(network.type)}
                                <span className="ml-2">{network.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>{network.type}</TableCell>
                            <TableCell>{network.cidr}</TableCell>
                            <TableCell>Today, 08:00</TableCell>
                            <TableCell>Today, 18:00</TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  toast({
                                    title: "Maintenance completed",
                                    description: `${network.name} is now active`,
                                  });
                                }}
                              >
                                Complete Maintenance
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="inactive" className="mt-6">
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>CIDR</TableHead>
                        <TableHead>Last Active</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredNetworks.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                            No inactive networks found.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredNetworks.map(network => (
                          <TableRow key={network.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center">
                                <WifiOff className="h-4 w-4 mr-2 text-red-500" />
                                <span>{network.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>{network.type}</TableCell>
                            <TableCell>{network.cidr}</TableCell>
                            <TableCell>3 days ago</TableCell>
                            <TableCell>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => {
                                  toast({
                                    title: "Network activated",
                                    description: `${network.name} is now active`,
                                  });
                                }}
                              >
                                Activate Network
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>
        
        <TabsContent value="routes" className="mt-6">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Source</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Hops</TableHead>
                    <TableHead>Metric</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array(3).fill(0).map((_, i) => (
                      <TableRow key={`skeleton-${i}`} className="animate-pulse">
                        <TableCell>
                          <div className="h-4 w-24 bg-muted rounded" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-24 bg-muted rounded" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-16 bg-muted rounded" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-16 bg-muted rounded" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-8 bg-muted rounded" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-8 bg-muted rounded" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-16 bg-muted rounded" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : filteredRoutes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        No routes found matching your criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRoutes.map(route => (
                      <TableRow key={route.id}>
                        <TableCell>
                          {route.source}
                        </TableCell>
                        <TableCell>
                          {route.destination}
                        </TableCell>
                        <TableCell>{route.type}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={route.status === 'Active' ? 'default' : 'destructive'}
                          >
                            {route.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{route.hops}</TableCell>
                        <TableCell>{route.metric}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Edit Route</DropdownMenuItem>
                              <DropdownMenuItem>Trace Route</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {route.status === 'Active' ? (
                                <DropdownMenuItem className="text-destructive">
                                  Disable Route
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem>
                                  Enable Route
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="justify-between py-4">
              <div className="text-sm text-muted-foreground">
                Showing {filteredRoutes.length} routes
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  toast({
                    title: "Feature coming soon",
                    description: "Adding new routes functionality is under development",
                  });
                }}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Route
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="topology" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Network Topology</CardTitle>
              <CardDescription>
                Visual representation of network connections and routing paths
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center items-center h-96 border border-dashed rounded-md bg-muted/20">
                <div className="text-center space-y-4">
                  <Network className="h-12 w-12 text-primary mx-auto opacity-70" />
                  <div>
                    <h3 className="text-lg font-medium">Network Topology Viewer</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Interactive network topology visualization coming soon
                    </p>
                  </div>
                  <Button variant="outline">
                    <ArrowRightLeft className="h-4 w-4 mr-2" />
                    Load Sample Topology
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Networking;
