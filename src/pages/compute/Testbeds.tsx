import React, { useState } from 'react';
import { MoreVertical } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

import { SearchBar } from '@/components/compute/SearchBar';
import { PageHeader } from '@/components/compute/PageHeader';
import { DataTable, Column } from '@/components/compute/DataTable';
import { TestbedDetailSheet } from '@/components/compute/TestbedDetailSheet';
import { TestbedActivityChart } from '@/components/compute/TestbedActivityChart';

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
  whitelisted?: boolean;
  environment?: 'Openshift' | 'Vanilla' | 'Rancher' | 'Anthos' | 'Charmed';
}

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
    deployments: 8,
    whitelisted: true,
    environment: 'Openshift'
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
    deployments: 12,
    whitelisted: false,
    environment: 'Vanilla'
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
    deployments: 5,
    whitelisted: true,
    environment: 'Rancher'
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
    deployments: 0,
    whitelisted: false,
    environment: 'Anthos'
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
    deployments: 2,
    whitelisted: true,
    environment: 'Charmed'
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
    deployments: 0,
    whitelisted: false,
    environment: 'Vanilla'
  }
];

interface TestbedStats {
  total: number;
  active: number;
  provisioning: number;
  failed: number;
  decommissioned: number;
  whitelisted: number;
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
    whitelisted: testbeds.filter(tb => tb.whitelisted).length,
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

  const getEnvironmentBadgeColor = (env: Testbed['environment']) => {
    switch (env) {
      case 'Openshift':
        return 'bg-red-500/10 text-red-500 hover:bg-red-500/20';
      case 'Vanilla':
        return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20';
      case 'Rancher':
        return 'bg-teal-500/10 text-teal-500 hover:bg-teal-500/20';
      case 'Anthos':
        return 'bg-purple-500/10 text-purple-500 hover:bg-purple-500/20';
      case 'Charmed':
        return 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20';
    }
  };

  const columns: Column<Testbed>[] = [
    {
      key: 'name',
      header: 'Name',
      cell: (testbed) => <span className="font-medium">{testbed.name}</span>
    },
    {
      key: 'owner',
      header: 'Owner',
      cell: (testbed) => testbed.ownedBy
    },
    {
      key: 'environment',
      header: 'Environment',
      cell: (testbed) => testbed.environment ? (
        <Badge
          variant="outline"
          className={getEnvironmentBadgeColor(testbed.environment)}
        >
          {testbed.environment}
        </Badge>
      ) : null
    },
    {
      key: 'created',
      header: 'Created',
      cell: (testbed) => new Date(testbed.createdAt).toLocaleDateString()
    },
    {
      key: 'whitelisted',
      header: 'Whitelisted',
      cell: (testbed) => (testbed.whitelisted ? 'Yes' : 'No')
    }
  ];

  const actionColumn = (testbed: Testbed) => (
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
  );

  return (
    <div className="container mx-auto space-y-6">
      <PageHeader 
        title="Testbed Management"
        description="Manage your testing environments and infrastructure."
        onRefresh={handleRefresh}
        onAdd={handleAddTestbed}
        addButtonText="Add Testbed"
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Testbeds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.whitelisted} whitelisted
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total VMs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVMs}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all testbeds
            </p>
          </CardContent>
        </Card>
        <TestbedActivityChart />
      </div>

      <SearchBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        placeholder="Search testbeds..."
      />

      <Separator />

      <DataTable
        data={filteredTestbeds}
        columns={columns}
        keyExtractor={(testbed) => testbed.id}
        isLoading={isLoading}
        emptyTitle="No Testbeds Found"
        emptyDescription="No testbeds have been added yet."
        searchQuery={searchQuery}
        onRowClick={openTestbedDetails}
        actionColumn={actionColumn}
      />

      <TestbedDetailSheet
        testbed={selectedTestbed}
        open={detailSheetOpen}
        onOpenChange={setDetailSheetOpen}
      />
    </div>
  );
};

export default TestbedsPage;
