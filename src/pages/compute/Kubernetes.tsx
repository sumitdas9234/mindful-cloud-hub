
import React from 'react';
import { PlaceholderPage } from '@/components/layout/PlaceholderPage';
import { Cloud, CheckCircle2, AlertTriangle, XCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

const clusterData = [
  {
    id: 'k8s-1',
    name: 'Production Cluster',
    version: 'v1.26.5',
    nodes: 8,
    status: 'healthy',
    uptime: '99.98%',
    cpuUsage: 68,
    memoryUsage: 72,
    podCount: 124
  },
  {
    id: 'k8s-2',
    name: 'Development Cluster',
    version: 'v1.27.2',
    nodes: 5,
    status: 'warning',
    uptime: '99.5%',
    cpuUsage: 45,
    memoryUsage: 62,
    podCount: 87
  },
  {
    id: 'k8s-3',
    name: 'Testing Cluster',
    version: 'v1.26.5',
    nodes: 3,
    status: 'degraded',
    uptime: '97.2%',
    cpuUsage: 82,
    memoryUsage: 89,
    podCount: 56
  },
  {
    id: 'k8s-4',
    name: 'Staging Cluster',
    version: 'v1.27.0',
    nodes: 4,
    status: 'maintenance',
    uptime: '0%',
    cpuUsage: 0,
    memoryUsage: 12,
    podCount: 5
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'healthy':
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    case 'warning':
      return <AlertTriangle className="h-5 w-5 text-amber-500" />;
    case 'degraded':
      return <XCircle className="h-5 w-5 text-red-500" />;
    case 'maintenance':
      return <Clock className="h-5 w-5 text-blue-500" />;
    default:
      return null;
  }
};

const ClustersTab = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {clusterData.map((cluster) => (
      <Card key={cluster.id} className="h-full">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{cluster.name}</CardTitle>
              <CardDescription>Kubernetes {cluster.version}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(cluster.status)}
              <span className={`text-sm font-medium ${
                cluster.status === 'healthy' ? 'text-green-600' : 
                cluster.status === 'warning' ? 'text-amber-600' : 
                cluster.status === 'degraded' ? 'text-red-600' : 
                'text-blue-600'
              }`}>
                {cluster.status.charAt(0).toUpperCase() + cluster.status.slice(1)}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-semibold">{cluster.nodes}</div>
              <div className="text-xs text-muted-foreground">Nodes</div>
            </div>
            <div>
              <div className="text-2xl font-semibold">{cluster.podCount}</div>
              <div className="text-xs text-muted-foreground">Pods</div>
            </div>
            <div>
              <div className="text-2xl font-semibold">{cluster.uptime}</div>
              <div className="text-xs text-muted-foreground">Uptime</div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">CPU</span>
                <span className="font-medium">{cluster.cpuUsage}%</span>
              </div>
              <Progress value={cluster.cpuUsage} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Memory</span>
                <span className="font-medium">{cluster.memoryUsage}%</span>
              </div>
              <Progress value={cluster.memoryUsage} className="h-2" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0 flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">Details</Button>
          <Button variant="outline" size="sm" className="flex-1">Workloads</Button>
          <Button variant="outline" size="sm" className="flex-1">Logs</Button>
        </CardFooter>
      </Card>
    ))}
  </div>
);

const tabs = [
  { id: 'clusters', label: 'Clusters', content: <ClustersTab /> },
  { id: 'workloads', label: 'Workloads', content: (
    <Card>
      <CardHeader>
        <CardTitle>Kubernetes Workloads</CardTitle>
        <CardDescription>View and manage deployments, statefulsets, and other resources</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-60 flex items-center justify-center">
          <p className="text-muted-foreground">Workload information will be displayed here</p>
        </div>
      </CardContent>
    </Card>
  )},
  { id: 'storage', label: 'Storage', content: (
    <Card>
      <CardHeader>
        <CardTitle>Kubernetes Storage</CardTitle>
        <CardDescription>Manage persistent volumes and storage classes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-60 flex items-center justify-center">
          <p className="text-muted-foreground">Storage information will be displayed here</p>
        </div>
      </CardContent>
    </Card>
  )},
];

const Kubernetes = () => {
  return (
    <PlaceholderPage
      title="Kubernetes Management"
      description="Monitor and manage Kubernetes clusters and workloads"
      icon={<Cloud className="h-6 w-6" />}
      tabs={tabs}
      actionLabel="Create Cluster"
    />
  );
};

export default Kubernetes;
