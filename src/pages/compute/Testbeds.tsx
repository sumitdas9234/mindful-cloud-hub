
import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  RefreshCw, 
  MoreVertical, 
  Server, 
  CheckCircle2, 
  AlertCircle,
  XCircle 
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
import { Progress } from '@/components/ui/progress';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { TestbedDetailSheet } from '@/components/compute/TestbedDetailSheet';

// Types for our testbed data
interface Testbed {
  id: string;
  name: string;
  description: string;
  purpose: string;
  status: 'active' | 'provisioning' | 'failed' | 'decommissioned';
  type: 'hardware' | 'virtual' | 'hybrid';
  location: string;
  ownedBy: string;
  createdAt: string;
  expiresAt: string | null;
  cpu: number;
  memory: number;
  storage: number;
  usagePercent: number;
  vms: number;
  networks: number;
  users: number;
  deployments: number;
}

// Mock data for testbeds
const mockTestbeds: Testbed[] = [
  {
    id: 'tb-1',
    name: 'Performance Lab',
    description: 'High-performance testbed for stress testing and benchmarking',
    purpose: 'Performance Testing',
    status: 'active',
    type: 'hardware',
    location: 'East Datacenter',
    ownedBy: 'Performance Team',
    createdAt: '2023-01-10T09:00:00Z',
    expiresAt: null,
    cpu: 64,
    memory: 512,
    storage: 8000,
    usagePercent: 75,
    vms: 0,
    networks: 3,
    users: 12,
    deployments: 8
  },
  {
    id: 'tb-2',
    name: 'Cloud Migration Dev',
    description: 'Virtual environment for testing cloud migration strategies',
    purpose: 'Migration Testing',
    status: 'active',
    type: 'virtual',
    location: 'AWS us-east-1',
    ownedBy: 'Cloud Team',
    createdAt: '2023-03-15T11:30:00Z',
    expiresAt: '2023-12-31T23:59:59Z',
    cpu: 32,
    memory: 128,
    storage: 2000,
    usagePercent: 45,
    vms: 24,
    networks: 4,
    users: 8,
    deployments: 12
  },
  {
    id: 'tb-3',
    name: 'Security Testing Lab',
    description: 'Isolated environment for security and penetration testing',
    purpose: 'Security Testing',
    status: 'active',
    type: 'hybrid',
    location: 'Secure Zone',
    ownedBy: 'Security Team',
    createdAt: '2023-02-01T10:15:00Z',
    expiresAt: null,
    cpu: 16,
    memory: 64,
    storage: 1000,
    usagePercent: 30,
    vms: 12,
    networks: 2,
    users: 6,
    deployments: 5
  },
  {
    id: 'tb-4',
    name: 'Integration Test Env',
    description: 'Environment for testing service integrations and APIs',
    purpose: 'Integration Testing',
    status: 'provisioning',
    type: 'virtual',
    location: 'Azure East US',
    ownedBy: 'DevOps Team',
    createdAt: '2023-08-01T15:45:00Z',
    expiresAt: '2024-02-01T23:59:59Z',
    cpu: 24,
    memory: 96,
    storage: 1500,
    usagePercent: 0,
    vms: 18,
    networks: 3,
    users: 15,
    deployments: 0
  },
  {
    id: 'tb-5',
    name: 'Legacy System Test',
    description: 'Hardware environment for testing with legacy systems',
    purpose: 'Compatibility Testing',
    status: 'failed',
    type: 'hardware',
    location: 'West Datacenter',
    ownedBy: 'Infrastructure Team',
    createdAt: '2022-11-15T08:30:00Z',
    expiresAt: null,
    cpu: 8,
    memory: 32,
    storage: 500,
    usagePercent: 0,
    vms: 0,
    networks: 1,
    users: 4,
    deployments: 2
  },
  {
    id: 'tb-6',
    name: 'End-of-Life Lab',
    description: 'Testbed scheduled for decommissioning',
    purpose: 'Archived',
    status: 'decommissioned',
    type: 'hybrid',
    location: 'South Datacenter',
    ownedBy: 'Infrastructure Team',
    createdAt: '2022-06-20T13:15:00Z',
    expiresAt: '2023-06-20T23:59:59Z',
    cpu: 16,
    memory: 64,
    storage: 1000,
    usagePercent: 0,
    vms: 0,
    networks: 2,
    users: 0,
    deployments: 0
  }
];

// Summary stats type
interface TestbedStats {
  total: number;
  active: number;
  provisioning: number;
  failed: number;
  decommissioned: number;
  totalCpu: number;
  totalMemory: number;
  totalStorage: number;
  totalVMs: number;
}

const calculateStats = (testbeds: Testbed[]): TestbedStats => {
  return {
    total: testbeds.length,
    active: testbeds.filter(tb => tb.status === 'active').length,
    provisioning: testbeds.filter(tb => tb.status === 'provisioning').length,
    failed: testbeds.filter(tb => tb.status === 'failed').length,
    decommissioned: testbeds.filter(tb => tb.status === 'decommissioned').length,
    totalCpu: testbeds.reduce((sum, tb) => sum + tb.cpu, 0),
    totalMemory: testbeds.reduce((sum, tb) => sum + tb.memory, 0),
    totalStorage: testbeds.reduce((sum, tb) => sum + tb.storage, 0),
    totalVMs: testbeds.reduce((sum, tb) => sum + tb.vms, 0)
  };
};

const TestbedsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTestbed, setSelectedTestbed] = useState<Testbed | null>(null);
  const [detailSheetOpen, setDetailSheetOpen] = useState(false);
  const { toast } = useToast();

  // In a real application, this would use the real API
  const { data: testbeds = [], isLoading, refetch } = useQuery({
    queryKey: ['testbeds'],
    queryFn: () => Promise.resolve(mockTestbeds),
  });

  const filteredTestbeds = testbeds.filter(
    tb => tb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tb.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tb.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tb.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tb.ownedBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = calculateStats(testbeds);

  const handleRefresh = () => {
    refetch();
    toast({
      title: "Refreshing testbeds",
      description: "The testbed list has been refreshed.",
    });
  };

  const handleAddTestbed = () => {
    toast({
      title: "Add Testbed",
      description: "This would open a dialog to add a new testbed environment.",
    });
  };

  const handleTestbedAction = (action: string, testbed: Testbed) => {
    toast({
      title: `${action} Testbed`,
      description: `Action "${action}" has been triggered for testbed "${testbed.name}".`,
    });
  };

  const openTestbedDetails = (testbed: Testbed) => {
    setSelectedTestbed(testbed);
    setDetailSheetOpen(true);
  };

  const getStatusBadgeColor = (status: Testbed['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-500 hover:bg-green-500/20';
      case 'provisioning':
        return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20';
      case 'failed':
        return 'bg-red-500/10 text-red-500 hover:bg-red-500/20';
      case 'decommissioned':
        return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20';
    }
  };

  const getStatusIcon = (status: Testbed['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'provisioning':
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'decommissioned':
        return <XCircle className="h-4 w-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const getTypeBadgeColor = (type: Testbed['type']) => {
    switch (type) {
      case 'hardware':
        return 'bg-purple-500/10 text-purple-500 hover:bg-purple-500/20';
      case 'virtual':
        return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20';
      case 'hybrid':
        return 'bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20';
    }
  };

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Testbed Management</h1>
          <p className="text-muted-foreground">Manage your testing environments and infrastructure.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={handleAddTestbed} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Testbed
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Testbeds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.active} active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">CPU Cores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCpu}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all testbeds
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Memory (GB)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMemory}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all testbeds
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Storage (GB)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStorage}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all testbeds
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search testbeds..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Separator />

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading testbeds...</p>
        </div>
      ) : filteredTestbeds.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64">
          <Server className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No Testbeds Found</h3>
          <p className="text-muted-foreground">
            {searchQuery
              ? "No testbeds match your search criteria."
              : "No testbeds have been added yet."}
          </p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Owned By</TableHead>
                <TableHead>Resources</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTestbeds.map((testbed) => (
                <TableRow 
                  key={testbed.id} 
                  className="cursor-pointer"
                  onClick={() => openTestbedDetails(testbed)}
                >
                  <TableCell className="font-medium">
                    <div>
                      {testbed.name}
                      <p className="text-xs text-muted-foreground line-clamp-1">{testbed.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {getStatusIcon(testbed.status)}
                      <span className="ml-1 capitalize">{testbed.status}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getTypeBadgeColor(testbed.type)}
                    >
                      {testbed.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{testbed.purpose}</TableCell>
                  <TableCell>{testbed.location}</TableCell>
                  <TableCell>{testbed.ownedBy}</TableCell>
                  <TableCell>
                    <div className="text-xs space-y-1">
                      <div>CPU: {testbed.cpu} cores</div>
                      <div>Memory: {testbed.memory} GB</div>
                      <div>Storage: {testbed.storage} GB</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {testbed.status === 'active' && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Usage</span>
                          <span>{testbed.usagePercent}%</span>
                        </div>
                        <Progress value={testbed.usagePercent} className="h-1" />
                      </div>
                    )}
                    {testbed.status !== 'active' && (
                      <span className="text-xs text-muted-foreground">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      {new Date(testbed.createdAt).toLocaleDateString()}
                      {testbed.expiresAt && (
                        <p className="text-xs text-muted-foreground">
                          Expires: {new Date(testbed.expiresAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleTestbedAction('View', testbed)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleTestbedAction('Edit', testbed)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {testbed.status === 'active' && (
                          <DropdownMenuItem onClick={() => handleTestbedAction('Deploy', testbed)}>
                            Deploy Workload
                          </DropdownMenuItem>
                        )}
                        {testbed.status === 'active' && (
                          <DropdownMenuItem onClick={() => handleTestbedAction('Snapshot', testbed)}>
                            Create Snapshot
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        {testbed.status === 'active' && (
                          <DropdownMenuItem onClick={() => handleTestbedAction('Decommission', testbed)}>
                            Decommission
                          </DropdownMenuItem>
                        )}
                        {testbed.status !== 'active' && testbed.status !== 'decommissioned' && (
                          <DropdownMenuItem onClick={() => handleTestbedAction('Recover', testbed)}>
                            Recover
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          onClick={() => handleTestbedAction('Delete', testbed)}
                          className="text-red-500"
                        >
                          Delete
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

      <TestbedDetailSheet
        testbed={selectedTestbed}
        open={detailSheetOpen}
        onOpenChange={setDetailSheetOpen}
      />
    </div>
  );
};

export default TestbedsPage;
