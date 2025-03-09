
import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  RefreshCw, 
  MoreVertical, 
  Cloud, 
  CheckCircle2, 
  AlertCircle,
  XCircle,
  PieChart,
  CpuIcon,
  Database
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from "@/components/ui/progress";
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

// Types for our Kubernetes data
interface KubernetesCluster {
  id: string;
  name: string;
  version: string;
  status: 'running' | 'provisioning' | 'degraded' | 'stopped';
  provider: 'on-premise' | 'aws' | 'azure' | 'gcp';
  location: string;
  nodeCount: number;
  cpuUsage: number;
  memoryUsage: number;
  storageUsage: number;
  namespaceCount: number;
  podCount: number;
  deploymentCount: number;
  serviceCount: number;
  createdAt: string;
  lastUpdatedAt: string;
}

// Mock data for Kubernetes clusters
const mockKubernetesClusters: KubernetesCluster[] = [
  {
    id: 'k8s-1',
    name: 'production-cluster',
    version: '1.26.3',
    status: 'running',
    provider: 'on-premise',
    location: 'East Datacenter',
    nodeCount: 8,
    cpuUsage: 65,
    memoryUsage: 72,
    storageUsage: 45,
    namespaceCount: 12,
    podCount: 86,
    deploymentCount: 24,
    serviceCount: 36,
    createdAt: '2023-01-15T10:30:00Z',
    lastUpdatedAt: '2023-08-10T15:45:00Z'
  },
  {
    id: 'k8s-2',
    name: 'development-cluster',
    version: '1.27.0',
    status: 'running',
    provider: 'aws',
    location: 'us-east-1',
    nodeCount: 5,
    cpuUsage: 42,
    memoryUsage: 50,
    storageUsage: 35,
    namespaceCount: 8,
    podCount: 48,
    deploymentCount: 16,
    serviceCount: 20,
    createdAt: '2023-03-20T09:15:00Z',
    lastUpdatedAt: '2023-08-05T11:30:00Z'
  },
  {
    id: 'k8s-3',
    name: 'staging-cluster',
    version: '1.25.9',
    status: 'degraded',
    provider: 'azure',
    location: 'East US',
    nodeCount: 4,
    cpuUsage: 78,
    memoryUsage: 85,
    storageUsage: 60,
    namespaceCount: 6,
    podCount: 52,
    deploymentCount: 18,
    serviceCount: 22,
    createdAt: '2023-02-05T14:20:00Z',
    lastUpdatedAt: '2023-08-12T08:45:00Z'
  },
  {
    id: 'k8s-4',
    name: 'test-cluster',
    version: '1.26.6',
    status: 'provisioning',
    provider: 'gcp',
    location: 'us-central1',
    nodeCount: 3,
    cpuUsage: 10,
    memoryUsage: 15,
    storageUsage: 8,
    namespaceCount: 4,
    podCount: 12,
    deploymentCount: 6,
    serviceCount: 8,
    createdAt: '2023-08-01T16:40:00Z',
    lastUpdatedAt: '2023-08-01T16:40:00Z'
  },
  {
    id: 'k8s-5',
    name: 'backup-cluster',
    version: '1.25.12',
    status: 'stopped',
    provider: 'on-premise',
    location: 'West Datacenter',
    nodeCount: 6,
    cpuUsage: 0,
    memoryUsage: 0,
    storageUsage: 25,
    namespaceCount: 10,
    podCount: 0,
    deploymentCount: 22,
    serviceCount: 28,
    createdAt: '2022-11-10T11:05:00Z',
    lastUpdatedAt: '2023-07-25T09:30:00Z'
  }
];

// Summary stats type
interface KubernetesStats {
  total: number;
  running: number;
  degraded: number;
  provisioning: number;
  stopped: number;
  totalNodes: number;
  totalPods: number;
  totalDeployments: number;
  avgCpuUsage: number;
  avgMemoryUsage: number;
  avgStorageUsage: number;
}

const calculateStats = (clusters: KubernetesCluster[]): KubernetesStats => {
  const activeClusters = clusters.filter(c => c.status === 'running' || c.status === 'degraded');
  
  return {
    total: clusters.length,
    running: clusters.filter(c => c.status === 'running').length,
    degraded: clusters.filter(c => c.status === 'degraded').length,
    provisioning: clusters.filter(c => c.status === 'provisioning').length,
    stopped: clusters.filter(c => c.status === 'stopped').length,
    totalNodes: clusters.reduce((sum, c) => sum + c.nodeCount, 0),
    totalPods: clusters.reduce((sum, c) => sum + c.podCount, 0),
    totalDeployments: clusters.reduce((sum, c) => sum + c.deploymentCount, 0),
    avgCpuUsage: activeClusters.length ? Math.round(activeClusters.reduce((sum, c) => sum + c.cpuUsage, 0) / activeClusters.length) : 0,
    avgMemoryUsage: activeClusters.length ? Math.round(activeClusters.reduce((sum, c) => sum + c.memoryUsage, 0) / activeClusters.length) : 0,
    avgStorageUsage: activeClusters.length ? Math.round(activeClusters.reduce((sum, c) => sum + c.storageUsage, 0) / activeClusters.length) : 0
  };
};

const KubernetesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState('grid');
  const { toast } = useToast();

  // In a real application, this would use the real API
  const { data: kubernetesClusters = [], isLoading, refetch } = useQuery({
    queryKey: ['kubernetes'],
    queryFn: () => Promise.resolve(mockKubernetesClusters),
  });

  const filteredClusters = kubernetesClusters.filter(
    cluster => cluster.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
               cluster.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
               cluster.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = calculateStats(kubernetesClusters);

  const handleRefresh = () => {
    refetch();
    toast({
      title: "Refreshing clusters",
      description: "The Kubernetes cluster list has been refreshed.",
    });
  };

  const handleAddCluster = () => {
    toast({
      title: "Add Kubernetes Cluster",
      description: "This would open a dialog to add a new Kubernetes cluster.",
    });
  };

  const handleClusterAction = (action: string, cluster: KubernetesCluster) => {
    toast({
      title: `${action} Kubernetes Cluster`,
      description: `Action "${action}" has been triggered for cluster "${cluster.name}".`,
    });
  };

  const getStatusBadgeColor = (status: KubernetesCluster['status']) => {
    switch (status) {
      case 'running':
        return 'bg-green-500/10 text-green-500 hover:bg-green-500/20';
      case 'provisioning':
        return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20';
      case 'degraded':
        return 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20';
      case 'stopped':
        return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20';
    }
  };

  const getStatusIcon = (status: KubernetesCluster['status']) => {
    switch (status) {
      case 'running':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'provisioning':
        return <Cloud className="h-4 w-4 text-blue-500" />;
      case 'degraded':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'stopped':
        return <XCircle className="h-4 w-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const getProviderBadgeColor = (provider: KubernetesCluster['provider']) => {
    switch (provider) {
      case 'on-premise':
        return 'bg-purple-500/10 text-purple-500 hover:bg-purple-500/20';
      case 'aws':
        return 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20';
      case 'azure':
        return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20';
      case 'gcp':
        return 'bg-red-500/10 text-red-500 hover:bg-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20';
    }
  };

  const getResourceColor = (usage: number) => {
    if (usage >= 80) return 'text-red-500';
    if (usage >= 60) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getProgressColor = (usage: number) => {
    if (usage >= 80) return 'bg-red-500';
    if (usage >= 60) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Kubernetes Management</h1>
          <p className="text-muted-foreground">Manage your Kubernetes infrastructure and workloads.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={handleAddCluster} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Cluster
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Clusters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.running} running, {stats.degraded} degraded
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Nodes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalNodes}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.totalPods} pods running
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Deployments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDeployments}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all clusters
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Resource Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CpuIcon className="h-4 w-4 mr-1" />
                  <span className="text-xs text-muted-foreground">CPU</span>
                </div>
                <span className={`text-xs font-medium ${getResourceColor(stats.avgCpuUsage)}`}>
                  {stats.avgCpuUsage}%
                </span>
              </div>
              <Progress value={stats.avgCpuUsage} className={getProgressColor(stats.avgCpuUsage)} />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-4 w-4 mr-1">📊</div>
                  <span className="text-xs text-muted-foreground">Memory</span>
                </div>
                <span className={`text-xs font-medium ${getResourceColor(stats.avgMemoryUsage)}`}>
                  {stats.avgMemoryUsage}%
                </span>
              </div>
              <Progress value={stats.avgMemoryUsage} className={getProgressColor(stats.avgMemoryUsage)} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search clusters..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Tabs defaultValue="grid" className="hidden md:block" onValueChange={setView}>
          <TabsList>
            <TabsTrigger value="grid">Grid</TabsTrigger>
            <TabsTrigger value="table">Table</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Separator />

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading Kubernetes clusters...</p>
        </div>
      ) : filteredClusters.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64">
          <Cloud className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No Kubernetes Clusters Found</h3>
          <p className="text-muted-foreground">
            {searchQuery
              ? "No clusters match your search criteria."
              : "No Kubernetes clusters have been added yet."}
          </p>
        </div>
      ) : view === 'grid' ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredClusters.map((cluster) => (
            <Card key={cluster.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium">
                    {cluster.name}
                  </CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleClusterAction('Details', cluster)}>
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleClusterAction('Dashboard', cluster)}>
                        Open Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleClusterAction('Upgrade', cluster)}>
                        Upgrade Kubernetes
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleClusterAction('Scale', cluster)}>
                        Scale Nodes
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {cluster.status === 'running' ? (
                        <DropdownMenuItem onClick={() => handleClusterAction('Stop', cluster)}>
                          Stop Cluster
                        </DropdownMenuItem>
                      ) : cluster.status === 'stopped' ? (
                        <DropdownMenuItem onClick={() => handleClusterAction('Start', cluster)}>
                          Start Cluster
                        </DropdownMenuItem>
                      ) : null}
                      <DropdownMenuItem 
                        onClick={() => handleClusterAction('Delete', cluster)}
                        className="text-red-500"
                      >
                        Delete Cluster
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant="outline"
                    className={getProviderBadgeColor(cluster.provider)}
                  >
                    {cluster.provider}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{cluster.location}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Status</span>
                    <div className="flex items-center">
                      {getStatusIcon(cluster.status)}
                      <span className="ml-1 capitalize">{cluster.status}</span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Version</span>
                    <span>v{cluster.version}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Nodes</span>
                    <span>{cluster.nodeCount}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Namespaces</span>
                    <span>{cluster.namespaceCount}</span>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">CPU Usage</span>
                    <span className={getResourceColor(cluster.cpuUsage)}>{cluster.cpuUsage}%</span>
                  </div>
                  <Progress value={cluster.cpuUsage} className={getProgressColor(cluster.cpuUsage)} />
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Memory Usage</span>
                    <span className={getResourceColor(cluster.memoryUsage)}>{cluster.memoryUsage}%</span>
                  </div>
                  <Progress value={cluster.memoryUsage} className={getProgressColor(cluster.memoryUsage)} />
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Storage Usage</span>
                    <span className={getResourceColor(cluster.storageUsage)}>{cluster.storageUsage}%</span>
                  </div>
                  <Progress value={cluster.storageUsage} className={getProgressColor(cluster.storageUsage)} />
                </div>
              </CardContent>
              <CardFooter className="pt-1">
                <div className="w-full flex justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      <PieChart className="h-3 w-3 mr-1" />
                      <span className="text-xs">{cluster.podCount} pods</span>
                    </div>
                    <div className="flex items-center">
                      <Database className="h-3 w-3 mr-1" />
                      <span className="text-xs">{cluster.deploymentCount} deployments</span>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={getStatusBadgeColor(cluster.status)}
                  >
                    {cluster.status}
                  </Badge>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Nodes</TableHead>
                <TableHead>Resources</TableHead>
                <TableHead>Workloads</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClusters.map((cluster) => (
                <TableRow key={cluster.id}>
                  <TableCell className="font-medium">
                    <div>
                      {cluster.name}
                      <p className="text-xs text-muted-foreground">{cluster.location}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {getStatusIcon(cluster.status)}
                      <span className="ml-1 capitalize">{cluster.status}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getProviderBadgeColor(cluster.provider)}
                    >
                      {cluster.provider}
                    </Badge>
                  </TableCell>
                  <TableCell>v{cluster.version}</TableCell>
                  <TableCell>{cluster.nodeCount}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span>CPU</span>
                        <span className={getResourceColor(cluster.cpuUsage)}>{cluster.cpuUsage}%</span>
                      </div>
                      <Progress value={cluster.cpuUsage} className={`h-1 ${getProgressColor(cluster.cpuUsage)}`} />
                      <div className="flex items-center justify-between text-xs">
                        <span>Mem</span>
                        <span className={getResourceColor(cluster.memoryUsage)}>{cluster.memoryUsage}%</span>
                      </div>
                      <Progress value={cluster.memoryUsage} className={`h-1 ${getProgressColor(cluster.memoryUsage)}`} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs">
                      <div>{cluster.namespaceCount} namespaces</div>
                      <div>{cluster.podCount} pods</div>
                      <div>{cluster.deploymentCount} deployments</div>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(cluster.lastUpdatedAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleClusterAction('Details', cluster)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleClusterAction('Dashboard', cluster)}>
                          Open Dashboard
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleClusterAction('Upgrade', cluster)}>
                          Upgrade Kubernetes
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleClusterAction('Scale', cluster)}>
                          Scale Nodes
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {cluster.status === 'running' ? (
                          <DropdownMenuItem onClick={() => handleClusterAction('Stop', cluster)}>
                            Stop Cluster
                          </DropdownMenuItem>
                        ) : cluster.status === 'stopped' ? (
                          <DropdownMenuItem onClick={() => handleClusterAction('Start', cluster)}>
                            Start Cluster
                          </DropdownMenuItem>
                        ) : null}
                        <DropdownMenuItem 
                          onClick={() => handleClusterAction('Delete', cluster)}
                          className="text-red-500"
                        >
                          Delete Cluster
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default KubernetesPage;
