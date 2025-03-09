import React, { useState } from 'react';
import { 
  Folder, 
  Plus, 
  Search, 
  RefreshCw,
  MoreHorizontal,
  PlayCircle,
  StopCircle,
  Trash2,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

interface Testbed {
  id: string;
  name: string;
  description: string;
  status: 'running' | 'stopped' | 'provisioning' | 'failed';
  type: 'network' | 'compute' | 'storage' | 'hybrid';
  owner: string;
  created: string;
  vms: number;
  resources: {
    cpu: number;
    memory: number;
    storage: number;
  };
}

const testbeds: Testbed[] = [
  {
    id: '1',
    name: 'Network Performance Test',
    description: 'Performance testing for network configurations',
    status: 'running',
    type: 'network',
    owner: 'network-team',
    created: '2023-09-15',
    vms: 8,
    resources: {
      cpu: 16,
      memory: 64,
      storage: 500
    }
  },
  {
    id: '2',
    name: 'Storage Reliability Test',
    description: 'Long-term reliability test for SAN storage',
    status: 'running',
    type: 'storage',
    owner: 'storage-team',
    created: '2023-09-20',
    vms: 4,
    resources: {
      cpu: 8,
      memory: 32,
      storage: 2000
    }
  },
  {
    id: '3',
    name: 'High Availability Cluster',
    description: 'Testing HA failover capabilities',
    status: 'stopped',
    type: 'compute',
    owner: 'platform-team',
    created: '2023-10-01',
    vms: 12,
    resources: {
      cpu: 32,
      memory: 128,
      storage: 1000
    }
  },
  {
    id: '4',
    name: 'DR Simulation',
    description: 'Disaster recovery simulation environment',
    status: 'provisioning',
    type: 'hybrid',
    owner: 'dr-team',
    created: '2023-10-10',
    vms: 20,
    resources: {
      cpu: 40,
      memory: 160,
      storage: 3000
    }
  },
  {
    id: '5',
    name: 'Load Balancer Testing',
    description: 'Performance testing for load balancer configurations',
    status: 'failed',
    type: 'network',
    owner: 'network-team',
    created: '2023-10-05',
    vms: 6,
    resources: {
      cpu: 12,
      memory: 48,
      storage: 400
    }
  }
];

const Testbeds: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const filteredTestbeds = testbeds.filter(testbed => {
    const matchesSearch = 
      testbed.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      testbed.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      testbed.owner.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = 
      activeTab === 'all' || 
      (activeTab === 'running' && testbed.status === 'running') ||
      (activeTab === 'stopped' && testbed.status === 'stopped') ||
      (activeTab === 'provisioning' && testbed.status === 'provisioning') ||
      (activeTab === 'failed' && testbed.status === 'failed');
    
    return matchesSearch && matchesTab;
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('Testbed data refreshed successfully');
    }, 1500);
  };

  const handleAddNew = () => {
    toast.info('Add Testbed functionality coming soon');
  };

  const getStatusBadge = (status: Testbed['status']) => {
    switch (status) {
      case 'running':
        return <Badge variant="default" className="bg-green-500">Running</Badge>;
      case 'stopped':
        return <Badge variant="default" className="bg-slate-500">Stopped</Badge>;
      case 'provisioning':
        return <Badge variant="default" className="bg-blue-500">Provisioning</Badge>;
      case 'failed':
        return <Badge variant="default" className="bg-red-500">Failed</Badge>;
    }
  };

  const getTypeBadge = (type: Testbed['type']) => {
    switch (type) {
      case 'network':
        return <Badge variant="outline" className="border-blue-500 text-blue-500">Network</Badge>;
      case 'compute':
        return <Badge variant="outline" className="border-purple-500 text-purple-500">Compute</Badge>;
      case 'storage':
        return <Badge variant="outline" className="border-amber-500 text-amber-500">Storage</Badge>;
      case 'hybrid':
        return <Badge variant="outline" className="border-emerald-500 text-emerald-500">Hybrid</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">Testbed Management</h2>
          <p className="text-muted-foreground">
            Create and manage test environments for your infrastructure
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleAddNew}>
            <Plus className="h-4 w-4 mr-2" />
            New Testbed
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search testbeds..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Testbeds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{testbeds.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Running</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {testbeds.filter(t => t.status === 'running').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total VMs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">
              {testbeds.reduce((sum, t) => sum + t.vms, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">
              {`${(testbeds.reduce((sum, t) => sum + t.resources.storage, 0) / 1000).toFixed(1)} TB`}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Testbeds</TabsTrigger>
          <TabsTrigger value="running">Running</TabsTrigger>
          <TabsTrigger value="stopped">Stopped</TabsTrigger>
          <TabsTrigger value="provisioning">Provisioning</TabsTrigger>
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
                    <TableHead>Type</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead className="text-right">VMs</TableHead>
                    <TableHead className="text-right">CPU</TableHead>
                    <TableHead className="text-right">Memory (GB)</TableHead>
                    <TableHead className="text-right">Storage (GB)</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTestbeds.map((testbed) => (
                    <TableRow key={testbed.id}>
                      <TableCell className="font-medium">
                        <div>
                          {testbed.name}
                          <div className="text-xs text-muted-foreground mt-1">
                            {testbed.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(testbed.status)}</TableCell>
                      <TableCell>{getTypeBadge(testbed.type)}</TableCell>
                      <TableCell>{testbed.owner}</TableCell>
                      <TableCell className="text-right">{testbed.vms}</TableCell>
                      <TableCell className="text-right">{testbed.resources.cpu}</TableCell>
                      <TableCell className="text-right">{testbed.resources.memory}</TableCell>
                      <TableCell className="text-right">{testbed.resources.storage}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Clone</DropdownMenuItem>
                            {testbed.status === 'running' ? (
                              <DropdownMenuItem>
                                <StopCircle className="h-4 w-4 mr-2" />
                                Stop
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem>
                                <PlayCircle className="h-4 w-4 mr-2" />
                                Start
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="text-red-500">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
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
                    <TableHead>Status</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead className="text-right">VMs</TableHead>
                    <TableHead className="text-right">CPU</TableHead>
                    <TableHead className="text-right">Memory (GB)</TableHead>
                    <TableHead className="text-right">Storage (GB)</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTestbeds.map((testbed) => (
                    <TableRow key={testbed.id}>
                      <TableCell className="font-medium">
                        <div>
                          {testbed.name}
                          <div className="text-xs text-muted-foreground mt-1">
                            {testbed.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(testbed.status)}</TableCell>
                      <TableCell>{getTypeBadge(testbed.type)}</TableCell>
                      <TableCell>{testbed.owner}</TableCell>
                      <TableCell className="text-right">{testbed.vms}</TableCell>
                      <TableCell className="text-right">{testbed.resources.cpu}</TableCell>
                      <TableCell className="text-right">{testbed.resources.memory}</TableCell>
                      <TableCell className="text-right">{testbed.resources.storage}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Clone</DropdownMenuItem>
                            <DropdownMenuItem>
                              <StopCircle className="h-4 w-4 mr-2" />
                              Stop
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-500">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="stopped" className="mt-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="mb-4">
                <StopCircle className="h-12 w-12 mx-auto text-slate-500" />
              </div>
              <h3 className="text-lg font-medium mb-2">Stopped Testbeds</h3>
              <p className="text-muted-foreground mb-4">
                View and manage testbeds that are currently stopped. These environments are not consuming compute resources.
              </p>
              <Button variant="outline">
                <PlayCircle className="h-4 w-4 mr-2" />
                Start Selected
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="provisioning" className="mt-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="h-12 w-12 rounded-full border-4 border-t-blue-500 border-r-blue-500 border-b-blue-200 border-l-blue-200 animate-spin" />
              </div>
              <h3 className="text-lg font-medium mb-2">Provisioning Testbeds</h3>
              <p className="text-muted-foreground mb-4">
                These testbeds are currently being provisioned. This process can take several minutes depending on the complexity.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="failed" className="mt-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="mb-4">
                <div className="h-12 w-12 mx-auto rounded-full bg-red-100 flex items-center justify-center">
                  <XCircle className="h-8 w-8 text-red-500" />
                </div>
              </div>
              <h3 className="text-lg font-medium mb-2">Failed Testbeds</h3>
              <p className="text-muted-foreground mb-4">
                These testbeds encountered errors during provisioning or operation. Review logs for troubleshooting.
              </p>
              <Button variant="outline" className="mr-2">View Logs</Button>
              <Button>Retry All</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Testbeds;
