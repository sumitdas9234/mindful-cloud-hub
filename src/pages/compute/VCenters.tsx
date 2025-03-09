
import React, { useState, useEffect } from 'react';
import { 
  Server, 
  RefreshCw, 
  Search,
  PlusCircle, 
  MoreHorizontal,
  Power,
  Cpu,
  HardDrive,
  Network
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

interface VCenterData {
  id: string;
  name: string;
  url: string;
  status: 'Connected' | 'Disconnected' | 'Maintenance';
  version: string;
  resourceUsage: {
    cpu: number;
    memory: number;
    storage: number;
    network: number;
  };
  clusters: number;
  hosts: number;
  vms: number;
}

const mockVCenters: VCenterData[] = [
  {
    id: 'vc1',
    name: 'Production vCenter',
    url: 'vcenter.prod.example.com',
    status: 'Connected',
    version: '7.0.3',
    resourceUsage: {
      cpu: 65,
      memory: 72,
      storage: 58,
      network: 45
    },
    clusters: 4,
    hosts: 24,
    vms: 186
  },
  {
    id: 'vc2',
    name: 'Development vCenter',
    url: 'vcenter.dev.example.com',
    status: 'Connected',
    version: '7.0.2',
    resourceUsage: {
      cpu: 42,
      memory: 51,
      storage: 38,
      network: 32
    },
    clusters: 2,
    hosts: 12,
    vms: 95
  },
  {
    id: 'vc3',
    name: 'QA vCenter',
    url: 'vcenter.qa.example.com',
    status: 'Maintenance',
    version: '7.0.3',
    resourceUsage: {
      cpu: 0,
      memory: 0,
      storage: 15,
      network: 0
    },
    clusters: 2,
    hosts: 8,
    vms: 64
  },
  {
    id: 'vc4',
    name: 'DR vCenter',
    url: 'vcenter.dr.example.com',
    status: 'Connected',
    version: '7.0.1',
    resourceUsage: {
      cpu: 28,
      memory: 35,
      storage: 42,
      network: 18
    },
    clusters: 1,
    hosts: 6,
    vms: 48
  },
  {
    id: 'vc5',
    name: 'Test vCenter',
    url: 'vcenter.test.example.com',
    status: 'Disconnected',
    version: '7.0.3',
    resourceUsage: {
      cpu: 0,
      memory: 0,
      storage: 0,
      network: 0
    },
    clusters: 1,
    hosts: 4,
    vms: 32
  }
];

const VCenters = () => {
  const [vcenters, setVCenters] = useState<VCenterData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedTab, setSelectedTab] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchVCenters();
  }, []);

  const fetchVCenters = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      setVCenters(mockVCenters);
    } catch (error) {
      toast({
        title: "Error fetching vCenters",
        description: "Failed to load vCenter data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchVCenters();
    toast({
      title: "Refreshing vCenter data",
      description: "The vCenter data is being refreshed."
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredVCenters = vcenters.filter(vcenter => 
    vcenter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vcenter.url.toLowerCase().includes(searchQuery.toLowerCase())
  ).filter(vcenter => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'connected') return vcenter.status === 'Connected';
    if (selectedTab === 'maintenance') return vcenter.status === 'Maintenance';
    if (selectedTab === 'disconnected') return vcenter.status === 'Disconnected';
    return true;
  });

  const handleAddNewVCenter = () => {
    toast({
      title: "Feature coming soon",
      description: "Adding new vCenter functionality is under development."
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">vCenter Management</h1>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add vCenter
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New vCenter</DialogTitle>
                <DialogDescription>
                  Connect to a new vCenter server to manage its resources.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="name" className="text-right text-sm font-medium">
                    Name
                  </label>
                  <Input id="name" className="col-span-3" placeholder="Production vCenter" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="url" className="text-right text-sm font-medium">
                    URL
                  </label>
                  <Input id="url" className="col-span-3" placeholder="vcenter.example.com" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="username" className="text-right text-sm font-medium">
                    Username
                  </label>
                  <Input id="username" className="col-span-3" placeholder="administrator@vsphere.local" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="password" className="text-right text-sm font-medium">
                    Password
                  </label>
                  <Input id="password" type="password" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {}}>Cancel</Button>
                <Button onClick={handleAddNewVCenter}>Connect</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input 
          placeholder="Search vCenters..." 
          className="max-w-sm"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      <Tabs defaultValue="all" onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="all">All vCenters</TabsTrigger>
          <TabsTrigger value="connected">Connected</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="disconnected">Disconnected</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              // Loading skeletons
              Array(3).fill(0).map((_, i) => (
                <Card key={`skeleton-${i}`} className="animate-pulse">
                  <CardHeader className="bg-muted/30 h-24" />
                  <CardContent className="pt-6">
                    <div className="h-4 w-3/4 bg-muted mb-4 rounded" />
                    <div className="h-4 w-1/2 bg-muted mb-6 rounded" />
                    <div className="space-y-2">
                      {Array(3).fill(0).map((_, j) => (
                        <div key={j} className="h-3 bg-muted rounded" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : filteredVCenters.length === 0 ? (
              <div className="col-span-full flex justify-center items-center h-32">
                <p className="text-muted-foreground">No vCenters found matching your criteria.</p>
              </div>
            ) : (
              filteredVCenters.map(vcenter => (
                <Card key={vcenter.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="mb-1 flex items-center">
                          <Server className="h-5 w-5 mr-2 text-primary" />
                          {vcenter.name}
                        </CardTitle>
                        <CardDescription>{vcenter.url}</CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Connection</DropdownMenuItem>
                          <DropdownMenuItem>Schedule Maintenance</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Disconnect</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <Badge 
                      variant={
                        vcenter.status === 'Connected' ? 'default' : 
                        vcenter.status === 'Maintenance' ? 'outline' : 'destructive'
                      }
                      className="mt-1"
                    >
                      {vcenter.status}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="flex items-center text-muted-foreground">
                            <Cpu className="h-3.5 w-3.5 mr-1" /> CPU
                          </span>
                          <span>{vcenter.resourceUsage.cpu}%</span>
                        </div>
                        <Progress value={vcenter.resourceUsage.cpu} className="h-1.5" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="flex items-center text-muted-foreground">
                            <HardDrive className="h-3.5 w-3.5 mr-1" /> Memory
                          </span>
                          <span>{vcenter.resourceUsage.memory}%</span>
                        </div>
                        <Progress value={vcenter.resourceUsage.memory} className="h-1.5" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="flex items-center text-muted-foreground">
                            <HardDrive className="h-3.5 w-3.5 mr-1" /> Storage
                          </span>
                          <span>{vcenter.resourceUsage.storage}%</span>
                        </div>
                        <Progress value={vcenter.resourceUsage.storage} className="h-1.5" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="flex items-center text-muted-foreground">
                            <Network className="h-3.5 w-3.5 mr-1" /> Network
                          </span>
                          <span>{vcenter.resourceUsage.network}%</span>
                        </div>
                        <Progress value={vcenter.resourceUsage.network} className="h-1.5" />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="text-sm text-muted-foreground justify-between border-t pt-4">
                    <div className="flex space-x-4">
                      <div>{vcenter.clusters} Clusters</div>
                      <div>{vcenter.hosts} Hosts</div>
                      <div>{vcenter.vms} VMs</div>
                    </div>
                    <div>Version {vcenter.version}</div>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="connected" className="mt-6">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {isLoading ? (
              // Loading skeletons
              Array(2).fill(0).map((_, i) => (
                <Card key={`skeleton-${i}`} className="animate-pulse">
                  <CardHeader className="bg-muted/30 h-24" />
                  <CardContent className="pt-6">
                    <div className="h-4 w-3/4 bg-muted mb-4 rounded" />
                    <div className="h-4 w-1/2 bg-muted mb-6 rounded" />
                    <div className="space-y-2">
                      {Array(3).fill(0).map((_, j) => (
                        <div key={j} className="h-3 bg-muted rounded" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : filteredVCenters.length === 0 ? (
              <div className="col-span-full flex justify-center items-center h-32">
                <p className="text-muted-foreground">No connected vCenters found.</p>
              </div>
            ) : (
              // Same card display as in "all" tab
              filteredVCenters.map(vcenter => (
                <Card key={vcenter.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="mb-1 flex items-center">
                          <Server className="h-5 w-5 mr-2 text-primary" />
                          {vcenter.name}
                        </CardTitle>
                        <CardDescription>{vcenter.url}</CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit Connection</DropdownMenuItem>
                          <DropdownMenuItem>Schedule Maintenance</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Disconnect</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <Badge variant="default" className="mt-1">Connected</Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="flex items-center text-muted-foreground">
                            <Cpu className="h-3.5 w-3.5 mr-1" /> CPU
                          </span>
                          <span>{vcenter.resourceUsage.cpu}%</span>
                        </div>
                        <Progress value={vcenter.resourceUsage.cpu} className="h-1.5" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="flex items-center text-muted-foreground">
                            <HardDrive className="h-3.5 w-3.5 mr-1" /> Memory
                          </span>
                          <span>{vcenter.resourceUsage.memory}%</span>
                        </div>
                        <Progress value={vcenter.resourceUsage.memory} className="h-1.5" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="flex items-center text-muted-foreground">
                            <HardDrive className="h-3.5 w-3.5 mr-1" /> Storage
                          </span>
                          <span>{vcenter.resourceUsage.storage}%</span>
                        </div>
                        <Progress value={vcenter.resourceUsage.storage} className="h-1.5" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="flex items-center text-muted-foreground">
                            <Network className="h-3.5 w-3.5 mr-1" /> Network
                          </span>
                          <span>{vcenter.resourceUsage.network}%</span>
                        </div>
                        <Progress value={vcenter.resourceUsage.network} className="h-1.5" />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="text-sm text-muted-foreground justify-between border-t pt-4">
                    <div className="flex space-x-4">
                      <div>{vcenter.clusters} Clusters</div>
                      <div>{vcenter.hosts} Hosts</div>
                      <div>{vcenter.vms} VMs</div>
                    </div>
                    <div>Version {vcenter.version}</div>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="maintenance" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Maintenance Since</TableHead>
                    <TableHead>Expected Completion</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVCenters.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No vCenters in maintenance mode.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredVCenters.map(vcenter => (
                      <TableRow key={vcenter.id}>
                        <TableCell className="font-medium">{vcenter.name}</TableCell>
                        <TableCell>{vcenter.url}</TableCell>
                        <TableCell>{vcenter.version}</TableCell>
                        <TableCell>Today, 08:00</TableCell>
                        <TableCell>Today, 18:00</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <Power className="h-4 w-4 mr-2" />
                            End Maintenance
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
        
        <TabsContent value="disconnected" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Last Connected</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVCenters.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No disconnected vCenters found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredVCenters.map(vcenter => (
                      <TableRow key={vcenter.id}>
                        <TableCell className="font-medium">{vcenter.name}</TableCell>
                        <TableCell>{vcenter.url}</TableCell>
                        <TableCell>{vcenter.version}</TableCell>
                        <TableCell>2 days ago</TableCell>
                        <TableCell>
                          <Badge variant="destructive">Disconnected</Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="default" size="sm">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Reconnect
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
    </div>
  );
};

export default VCenters;
