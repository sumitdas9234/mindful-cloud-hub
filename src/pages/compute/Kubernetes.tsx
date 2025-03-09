
import React, { useState, useEffect } from 'react';
import { 
  Cloud, 
  RefreshCw, 
  Search,
  PlusCircle, 
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Cpu,
  HardDrive,
  Network,
  DownloadCloud,
  ChevronRight
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

interface ClusterHealth {
  apiServer: 'Healthy' | 'Degraded' | 'Unhealthy';
  scheduler: 'Healthy' | 'Degraded' | 'Unhealthy';
  controller: 'Healthy' | 'Degraded' | 'Unhealthy';
  etcd: 'Healthy' | 'Degraded' | 'Unhealthy';
}

interface ClusterData {
  id: string;
  name: string;
  version: string;
  nodes: number;
  pods: number;
  status: 'Running' | 'Degraded' | 'Failed';
  health: ClusterHealth;
  resourceUsage: {
    cpu: number;
    memory: number;
    storage: number;
    network: number;
  };
  provider: 'On-Premise' | 'AWS' | 'Azure' | 'GCP';
  created: string;
}

const mockClusters: ClusterData[] = [
  {
    id: 'k8s-1',
    name: 'Production Cluster',
    version: 'v1.28.5',
    nodes: 12,
    pods: 128,
    status: 'Running',
    health: {
      apiServer: 'Healthy',
      scheduler: 'Healthy',
      controller: 'Healthy',
      etcd: 'Healthy'
    },
    resourceUsage: {
      cpu: 68,
      memory: 75,
      storage: 52,
      network: 48
    },
    provider: 'On-Premise',
    created: '2023-06-15'
  },
  {
    id: 'k8s-2',
    name: 'Development Cluster',
    version: 'v1.29.0',
    nodes: 6,
    pods: 64,
    status: 'Running',
    health: {
      apiServer: 'Healthy',
      scheduler: 'Healthy',
      controller: 'Healthy',
      etcd: 'Healthy'
    },
    resourceUsage: {
      cpu: 42,
      memory: 58,
      storage: 35,
      network: 28
    },
    provider: 'AWS',
    created: '2023-09-22'
  },
  {
    id: 'k8s-3',
    name: 'Testing Cluster',
    version: 'v1.28.3',
    nodes: 4,
    pods: 48,
    status: 'Degraded',
    health: {
      apiServer: 'Healthy',
      scheduler: 'Degraded',
      controller: 'Healthy',
      etcd: 'Healthy'
    },
    resourceUsage: {
      cpu: 55,
      memory: 62,
      storage: 48,
      network: 35
    },
    provider: 'Azure',
    created: '2023-11-05'
  },
  {
    id: 'k8s-4',
    name: 'CI/CD Cluster',
    version: 'v1.27.8',
    nodes: 3,
    pods: 42,
    status: 'Running',
    health: {
      apiServer: 'Healthy',
      scheduler: 'Healthy',
      controller: 'Healthy',
      etcd: 'Healthy'
    },
    resourceUsage: {
      cpu: 78,
      memory: 82,
      storage: 58,
      network: 60
    },
    provider: 'GCP',
    created: '2023-08-12'
  },
  {
    id: 'k8s-5',
    name: 'Backup Cluster',
    version: 'v1.28.0',
    nodes: 2,
    pods: 24,
    status: 'Failed',
    health: {
      apiServer: 'Unhealthy',
      scheduler: 'Unhealthy',
      controller: 'Unhealthy',
      etcd: 'Degraded'
    },
    resourceUsage: {
      cpu: 0,
      memory: 0,
      storage: 15,
      network: 0
    },
    provider: 'On-Premise',
    created: '2023-07-28'
  }
];

const Kubernetes = () => {
  const [clusters, setClusters] = useState<ClusterData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedTab, setSelectedTab] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchClusters();
  }, []);

  const fetchClusters = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      setClusters(mockClusters);
    } catch (error) {
      toast({
        title: "Error fetching clusters",
        description: "Failed to load Kubernetes cluster data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchClusters();
    toast({
      title: "Refreshing cluster data",
      description: "The Kubernetes cluster data is being refreshed."
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredClusters = clusters.filter(cluster => 
    cluster.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cluster.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cluster.version.toLowerCase().includes(searchQuery.toLowerCase())
  ).filter(cluster => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'running') return cluster.status === 'Running';
    if (selectedTab === 'degraded') return cluster.status === 'Degraded';
    if (selectedTab === 'failed') return cluster.status === 'Failed';
    return true;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Healthy':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'Degraded':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'Unhealthy':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: 'Running' | 'Degraded' | 'Failed') => {
    switch (status) {
      case 'Running':
        return <Badge variant="default" className="bg-green-500">Running</Badge>;
      case 'Degraded':
        return <Badge variant="outline" className="text-yellow-500 border-yellow-500">Degraded</Badge>;
      case 'Failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return null;
    }
  };

  const handleAddNewCluster = () => {
    toast({
      title: "Feature coming soon",
      description: "Adding new Kubernetes cluster functionality is under development."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Kubernetes Management</h1>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button size="sm" onClick={handleAddNewCluster}>
            <PlusCircle className="h-4 w-4 mr-2" />
            New Cluster
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input 
          placeholder="Search clusters..." 
          className="max-w-sm"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      <Tabs defaultValue="all" onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="all">All Clusters</TabsTrigger>
          <TabsTrigger value="running">Running</TabsTrigger>
          <TabsTrigger value="degraded">Degraded</TabsTrigger>
          <TabsTrigger value="failed">Failed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Nodes</TableHead>
                    <TableHead>Pods</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>CPU Usage</TableHead>
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
                          <div className="h-4 w-16 bg-muted rounded" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-8 bg-muted rounded" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-8 bg-muted rounded" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-24 bg-muted rounded" />
                        </TableCell>
                        <TableCell>
                          <div className="h-4 w-full bg-muted rounded" />
                        </TableCell>
                        <TableCell>
                          <div className="h-8 w-20 bg-muted rounded" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : filteredClusters.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                        No Kubernetes clusters found matching your criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredClusters.map(cluster => (
                      <TableRow key={cluster.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <Cloud className="h-5 w-5 mr-2 text-primary" />
                            {cluster.name}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(cluster.status)}</TableCell>
                        <TableCell>{cluster.version}</TableCell>
                        <TableCell>{cluster.nodes}</TableCell>
                        <TableCell>{cluster.pods}</TableCell>
                        <TableCell>{cluster.provider}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={cluster.resourceUsage.cpu} className="h-2 flex-1" />
                            <span className="text-sm">{cluster.resourceUsage.cpu}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => {
                                toast({
                                  title: "Opening cluster details",
                                  description: `Viewing details for ${cluster.name}`,
                                });
                              }}
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>View Dashboard</DropdownMenuItem>
                                <DropdownMenuItem>Get Kubeconfig</DropdownMenuItem>
                                <DropdownMenuItem>Upgrade Version</DropdownMenuItem>
                                <DropdownMenuItem>Add Node</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive">Delete Cluster</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="running" className="mt-6">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Nodes</TableHead>
                    <TableHead>Pods</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Health</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClusters.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        No running Kubernetes clusters found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredClusters.map(cluster => (
                      <TableRow key={cluster.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <Cloud className="h-5 w-5 mr-2 text-primary" />
                            {cluster.name}
                          </div>
                        </TableCell>
                        <TableCell>{cluster.version}</TableCell>
                        <TableCell>{cluster.nodes}</TableCell>
                        <TableCell>{cluster.pods}</TableCell>
                        <TableCell>{cluster.provider}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(cluster.health.apiServer)}
                            {getStatusIcon(cluster.health.scheduler)}
                            {getStatusIcon(cluster.health.controller)}
                            {getStatusIcon(cluster.health.etcd)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8"
                            onClick={() => {
                              toast({
                                title: "Downloading Kubeconfig",
                                description: `Kubeconfig for ${cluster.name} is ready.`,
                              });
                            }}
                          >
                            <DownloadCloud className="h-4 w-4 mr-2" />
                            Kubeconfig
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
        
        <TabsContent value="degraded" className="mt-6">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Issue</TableHead>
                    <TableHead>Component</TableHead>
                    <TableHead>Detected</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClusters.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No degraded Kubernetes clusters found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredClusters.map(cluster => (
                      <TableRow key={cluster.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <Cloud className="h-5 w-5 mr-2 text-primary" />
                            {cluster.name}
                          </div>
                        </TableCell>
                        <TableCell>{cluster.version}</TableCell>
                        <TableCell>Performance degradation</TableCell>
                        <TableCell>
                          {Object.entries(cluster.health)
                            .filter(([_, status]) => status === 'Degraded')
                            .map(([component]) => component)
                            .join(', ')}
                        </TableCell>
                        <TableCell>12 minutes ago</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8"
                            onClick={() => {
                              toast({
                                title: "Auto-remediation started",
                                description: `Attempting to fix issues on ${cluster.name}`,
                              });
                            }}
                          >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Auto-remediate
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
        
        <TabsContent value="failed" className="mt-6">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Failure Reason</TableHead>
                    <TableHead>Failed Since</TableHead>
                    <TableHead>Last Healthy</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClusters.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No failed Kubernetes clusters found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredClusters.map(cluster => (
                      <TableRow key={cluster.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <Cloud className="h-5 w-5 mr-2 text-primary" />
                            {cluster.name}
                          </div>
                        </TableCell>
                        <TableCell>{cluster.version}</TableCell>
                        <TableCell>Control plane components unreachable</TableCell>
                        <TableCell>2 hours ago</TableCell>
                        <TableCell>Yesterday, 23:15</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="default"
                              size="sm"
                              className="h-8"
                              onClick={() => {
                                toast({
                                  title: "Recovery initiated",
                                  description: `Attempting to recover ${cluster.name}`,
                                });
                              }}
                            >
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Recover
                            </Button>
                          </div>
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
    </div>
  );
};

export default Kubernetes;
