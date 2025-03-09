
import React, { useState } from 'react';
import { 
  Cloud,
  Search,
  Plus,
  RefreshCw,
  MoreHorizontal,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface KubernetesCluster {
  id: string;
  name: string;
  version: string;
  status: 'healthy' | 'warning' | 'critical';
  provider: 'rke' | 'aks' | 'eks' | 'gke' | 'ocp';
  nodes: number;
  pods: number;
  namespaces: number;
  cpu: {
    usage: number;
    total: number;
  };
  memory: {
    usage: number;
    total: number;
  };
  storage: {
    usage: number;
    total: number;
  };
  created: string;
  lastUpdated: string;
}

const clusters: KubernetesCluster[] = [
  {
    id: '1',
    name: 'prod-cluster-01',
    version: 'v1.28.3',
    status: 'healthy',
    provider: 'rke',
    nodes: 12,
    pods: 245,
    namespaces: 8,
    cpu: {
      usage: 42,
      total: 96
    },
    memory: {
      usage: 156,
      total: 384
    },
    storage: {
      usage: 2.8,
      total: 10
    },
    created: '2023-01-15',
    lastUpdated: '2023-10-05'
  },
  {
    id: '2',
    name: 'staging-cluster-01',
    version: 'v1.28.2',
    status: 'healthy',
    provider: 'rke',
    nodes: 6,
    pods: 124,
    namespaces: 5,
    cpu: {
      usage: 18,
      total: 48
    },
    memory: {
      usage: 72,
      total: 192
    },
    storage: {
      usage: 1.4,
      total: 5
    },
    created: '2023-02-20',
    lastUpdated: '2023-09-28'
  },
  {
    id: '3',
    name: 'dev-cluster-01',
    version: 'v1.28.1',
    status: 'warning',
    provider: 'rke',
    nodes: 3,
    pods: 87,
    namespaces: 4,
    cpu: {
      usage: 12,
      total: 24
    },
    memory: {
      usage: 58,
      total: 96
    },
    storage: {
      usage: 0.9,
      total: 2
    },
    created: '2023-03-10',
    lastUpdated: '2023-08-15'
  },
  {
    id: '4',
    name: 'azure-east-prod',
    version: 'v1.27.4',
    status: 'healthy',
    provider: 'aks',
    nodes: 8,
    pods: 156,
    namespaces: 6,
    cpu: {
      usage: 32,
      total: 64
    },
    memory: {
      usage: 120,
      total: 256
    },
    storage: {
      usage: 2.1,
      total: 8
    },
    created: '2023-04-05',
    lastUpdated: '2023-09-10'
  },
  {
    id: '5',
    name: 'aws-west-prod',
    version: 'v1.27.6',
    status: 'critical',
    provider: 'eks',
    nodes: 10,
    pods: 189,
    namespaces: 7,
    cpu: {
      usage: 68,
      total: 80
    },
    memory: {
      usage: 210,
      total: 320
    },
    storage: {
      usage: 5.8,
      total: 12
    },
    created: '2023-02-28',
    lastUpdated: '2023-10-01'
  }
];

const Kubernetes: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredClusters = clusters.filter(cluster => 
    cluster.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cluster.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cluster.version.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('Kubernetes data refreshed successfully');
    }, 1500);
  };

  const handleAddNew = () => {
    toast.info('Add Kubernetes cluster functionality coming soon');
  };

  const handleExportKubeconfig = (clusterId: string) => {
    toast.success(`Kubeconfig for cluster ${clusterId} downloaded`);
  };

  const getStatusBadge = (status: KubernetesCluster['status']) => {
    switch (status) {
      case 'healthy':
        return (
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
            <Badge variant="default" className="bg-green-500">Healthy</Badge>
          </div>
        );
      case 'warning':
        return (
          <div className="flex items-center">
            <AlertTriangle className="h-4 w-4 text-amber-500 mr-1" />
            <Badge variant="default" className="bg-amber-500">Warning</Badge>
          </div>
        );
      case 'critical':
        return (
          <div className="flex items-center">
            <XCircle className="h-4 w-4 text-red-500 mr-1" />
            <Badge variant="default" className="bg-red-500">Critical</Badge>
          </div>
        );
    }
  };

  const getProviderBadge = (provider: KubernetesCluster['provider']) => {
    switch (provider) {
      case 'rke':
        return <Badge variant="outline">RKE</Badge>;
      case 'aks':
        return <Badge variant="outline" className="border-blue-500 text-blue-500">AKS</Badge>;
      case 'eks':
        return <Badge variant="outline" className="border-orange-500 text-orange-500">EKS</Badge>;
      case 'gke':
        return <Badge variant="outline" className="border-green-500 text-green-500">GKE</Badge>;
      case 'ocp':
        return <Badge variant="outline" className="border-red-500 text-red-500">OCP</Badge>;
    }
  };

  const calculateResourceUsagePercentage = (used: number, total: number) => {
    return Math.round((used / total) * 100);
  };

  const getResourceColor = (percentage: number) => {
    if (percentage < 60) return "hsl(var(--primary))";
    if (percentage < 80) return "hsl(var(--warning))";
    return "hsl(var(--destructive))";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">Kubernetes Management</h2>
          <p className="text-muted-foreground">
            Manage and monitor your Kubernetes clusters
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleAddNew}>
            <Plus className="h-4 w-4 mr-2" />
            Add Cluster
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search clusters..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Clusters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clusters.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Healthy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {clusters.filter(c => c.status === 'healthy').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Nodes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">
              {clusters.reduce((sum, c) => sum + c.nodes, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Pods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-500">
              {clusters.reduce((sum, c) => sum + c.pods, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {filteredClusters.map((cluster) => (
        <Card key={cluster.id} className="mb-4">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl font-bold">{cluster.name}</CardTitle>
                <div className="flex items-center mt-1 space-x-2">
                  {getProviderBadge(cluster.provider)}
                  <span className="text-sm text-muted-foreground">v{cluster.version}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusBadge(cluster.status)}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuGroup>
                      <DropdownMenuItem>View Dashboard</DropdownMenuItem>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleExportKubeconfig(cluster.id)}>
                        <Download className="h-4 w-4 mr-2" />
                        Export Kubeconfig
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem>Upgrade Cluster</DropdownMenuItem>
                      <DropdownMenuItem>Add Node</DropdownMenuItem>
                      <DropdownMenuItem>Add Namespace</DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-500">Delete Cluster</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Resource usage */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">CPU Usage</span>
                    <span className="text-sm text-muted-foreground">
                      {cluster.cpu.usage} / {cluster.cpu.total} cores
                    </span>
                  </div>
                  <Progress 
                    value={calculateResourceUsagePercentage(cluster.cpu.usage, cluster.cpu.total)} 
                    className="h-2"
                    style={{ 
                      color: getResourceColor(
                        calculateResourceUsagePercentage(cluster.cpu.usage, cluster.cpu.total)
                      ) 
                    }}
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Memory Usage</span>
                    <span className="text-sm text-muted-foreground">
                      {cluster.memory.usage} / {cluster.memory.total} GB
                    </span>
                  </div>
                  <Progress 
                    value={calculateResourceUsagePercentage(cluster.memory.usage, cluster.memory.total)} 
                    className="h-2"
                    style={{ 
                      color: getResourceColor(
                        calculateResourceUsagePercentage(cluster.memory.usage, cluster.memory.total)
                      ) 
                    }}
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Storage Usage</span>
                    <span className="text-sm text-muted-foreground">
                      {cluster.storage.usage} / {cluster.storage.total} TB
                    </span>
                  </div>
                  <Progress 
                    value={calculateResourceUsagePercentage(cluster.storage.usage, cluster.storage.total)} 
                    className="h-2"
                    style={{ 
                      color: getResourceColor(
                        calculateResourceUsagePercentage(cluster.storage.usage, cluster.storage.total)
                      ) 
                    }}
                  />
                </div>
              </div>
              
              {/* Cluster stats */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Nodes</p>
                  <p className="text-2xl font-bold">{cluster.nodes}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Pods</p>
                  <p className="text-2xl font-bold">{cluster.pods}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Namespaces</p>
                  <p className="text-2xl font-bold">{cluster.namespaces}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Healthy</p>
                  <p className="text-2xl font-bold text-green-500">
                    {cluster.status === 'healthy' ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>
              
              {/* Dates & Actions */}
              <div>
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-1">Created</p>
                  <p className="text-sm font-medium">{cluster.created}</p>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-1">Last Updated</p>
                  <p className="text-sm font-medium">{cluster.lastUpdated}</p>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="flex-1">View Nodes</Button>
                  <Button size="sm" className="flex-1">Access</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Kubernetes;
