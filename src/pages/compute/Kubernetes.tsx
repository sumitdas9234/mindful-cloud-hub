
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
  Clock,
  Shield
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { ClusterDetailSheet } from '@/components/compute/ClusterDetailSheet';

// Types for our Kubernetes data
interface KubernetesCluster {
  id: string;
  name: string;
  version: string;
  status: 'running' | 'provisioning' | 'degraded' | 'stopped';
  provider: 'on-premise' | 'aws' | 'azure' | 'gcp';
  location: string;
  nodeCount: number;
  portworxInstalled: boolean;
  portworxVersion?: string;
  needsUpgrade: boolean;
  certificates: number;
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
    portworxInstalled: true,
    portworxVersion: '2.11.5',
    needsUpgrade: false,
    certificates: 12,
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
    portworxInstalled: true,
    portworxVersion: '2.10.2',
    needsUpgrade: true,
    certificates: 8,
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
    portworxInstalled: false,
    needsUpgrade: true,
    certificates: 6,
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
    portworxInstalled: false,
    needsUpgrade: false,
    certificates: 4,
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
    portworxInstalled: true,
    portworxVersion: '2.9.1',
    needsUpgrade: true,
    certificates: 10,
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
  totalCertificates: number;
  needsUpgrade: number;
}

const calculateStats = (clusters: KubernetesCluster[]): KubernetesStats => {
  return {
    total: clusters.length,
    running: clusters.filter(c => c.status === 'running').length,
    degraded: clusters.filter(c => c.status === 'degraded').length,
    provisioning: clusters.filter(c => c.status === 'provisioning').length,
    stopped: clusters.filter(c => c.status === 'stopped').length,
    totalNodes: clusters.reduce((sum, c) => sum + c.nodeCount, 0),
    totalCertificates: clusters.reduce((sum, c) => sum + c.certificates, 0),
    needsUpgrade: clusters.filter(c => c.needsUpgrade).length
  };
};

const KubernetesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCluster, setSelectedCluster] = useState<KubernetesCluster | null>(null);
  const [detailSheetOpen, setDetailSheetOpen] = useState(false);
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
      description: "The production cluster list has been refreshed.",
    });
  };

  const handleAddCluster = () => {
    toast({
      title: "Add Production Cluster",
      description: "This would open a dialog to add a new production cluster.",
    });
  };

  const handleClusterAction = (action: string, cluster: KubernetesCluster) => {
    toast({
      title: `${action} Production Cluster`,
      description: `Action "${action}" has been triggered for cluster "${cluster.name}".`,
    });
  };

  const openClusterDetails = (cluster: KubernetesCluster) => {
    setSelectedCluster(cluster);
    setDetailSheetOpen(true);
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

  const getUpgradeStatus = (needsUpgrade: boolean) => {
    return needsUpgrade 
      ? <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">Needs upgrade</Badge>
      : <Badge variant="outline" className="bg-green-500/10 text-green-500">Up to date</Badge>;
  };

  const getPortworxStatus = (installed: boolean, version?: string) => {
    return installed
      ? <div className="flex items-center">
          <CheckCircle2 className="h-3 w-3 text-green-500 mr-1.5" />
          <span>{version || 'Installed'}</span>
        </div>
      : <div className="flex items-center">
          <XCircle className="h-3 w-3 text-red-500 mr-1.5" />
          <span>Not installed</span>
        </div>;
  };

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Production Clusters</h1>
          <p className="text-muted-foreground">Manage your production Kubernetes infrastructure.</p>
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
              Across all clusters
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Certificates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCertificates}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all clusters
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Upgrade Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-yellow-500" />
              <div className="text-2xl font-bold">{stats.needsUpgrade}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Clusters need upgrade
            </p>
          </CardContent>
        </Card>
      </div>

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

      <Separator />

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading production clusters...</p>
        </div>
      ) : filteredClusters.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64">
          <Cloud className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No Production Clusters Found</h3>
          <p className="text-muted-foreground">
            {searchQuery
              ? "No clusters match your search criteria."
              : "No production clusters have been added yet."}
          </p>
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
                <TableHead>Portworx</TableHead>
                <TableHead>Certificates</TableHead>
                <TableHead>Upgrade</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClusters.map((cluster) => (
                <TableRow 
                  key={cluster.id} 
                  className="cursor-pointer"
                  onClick={() => openClusterDetails(cluster)}
                >
                  <TableCell className="font-medium py-2">
                    {cluster.name}
                  </TableCell>
                  <TableCell className="py-2">
                    <div className="flex items-center">
                      {getStatusIcon(cluster.status)}
                      <span className="ml-1 capitalize">{cluster.status}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-2">
                    <Badge
                      variant="outline"
                      className={getProviderBadgeColor(cluster.provider)}
                    >
                      {cluster.provider}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-2">v{cluster.version}</TableCell>
                  <TableCell className="py-2">{cluster.nodeCount}</TableCell>
                  <TableCell className="py-2">
                    {getPortworxStatus(cluster.portworxInstalled, cluster.portworxVersion)}
                  </TableCell>
                  <TableCell className="py-2">
                    <div className="flex items-center">
                      <Shield className="h-3.5 w-3.5 text-blue-500 mr-1.5" />
                      <span>{cluster.certificates}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-2">
                    {getUpgradeStatus(cluster.needsUpgrade)}
                  </TableCell>
                  <TableCell className="py-2" onClick={(e) => e.stopPropagation()}>
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
      
      <ClusterDetailSheet
        cluster={selectedCluster}
        open={detailSheetOpen}
        onOpenChange={setDetailSheetOpen}
      />
    </div>
  );
};

export default KubernetesPage;
