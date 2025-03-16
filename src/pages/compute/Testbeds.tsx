
import React, { useState } from 'react';
import { MoreVertical, Server, Layers, CubeIcon, ServerOff, BarChart3 } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { SearchBar } from '@/components/compute/SearchBar';
import { PageHeader } from '@/components/compute/PageHeader';
import { DataTable, Column } from '@/components/compute/DataTable';
import { TestbedDetailSheet } from '@/components/compute/TestbedDetailSheet';
import { TestbedActivityChart } from '@/components/compute/TestbedActivityChart';
import { ChartContainer } from '@/components/ui/chart';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { TableSkeleton } from '@/components/ui/skeleton';

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
  envFlavor?: 'ControlPlane' | 'User';
  deploymentType?: 'Single VM' | 'VM Group' | 'Kubernetes';
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

// Define colors for different environment types
const ENV_COLORS = {
  'Openshift': '#EF4444',
  'Vanilla': '#3B82F6',
  'Rancher': '#10B981',
  'Anthos': '#8B5CF6',
  'Charmed': '#F97316',
  'Other': '#6B7280',
};

const TYPE_COLORS = {
  'hardware': '#EF4444',
  'virtual': '#3B82F6',
  'hybrid': '#8B5CF6',
};

const STATUS_COLORS = {
  'active': '#10B981',
  'provisioning': '#3B82F6',
  'failed': '#EF4444',
  'decommissioned': '#6B7280',
};

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
  byEnvironment: {
    name: string;
    value: number;
    color: string;
  }[];
  byType: {
    name: string;
    value: number;
    color: string;
  }[];
  byStatus: {
    name: string;
    value: number;
    color: string;
  }[];
}

const calculateStats = (testbeds: Testbed[]): TestbedStats => {
  const envCounts: Record<string, number> = {};
  const typeCounts: Record<string, number> = {};
  const statusCounts: Record<string, number> = {};

  testbeds.forEach(tb => {
    // Count by environment
    const env = tb.environment || 'Other';
    envCounts[env] = (envCounts[env] || 0) + 1;

    // Count by type
    typeCounts[tb.type] = (typeCounts[tb.type] || 0) + 1;

    // Count by status
    statusCounts[tb.status] = (statusCounts[tb.status] || 0) + 1;
  });

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
    totalVMs: testbeds.reduce((sum, tb) => sum + tb.vms, 0),
    byEnvironment: Object.entries(envCounts).map(([name, value]) => ({
      name,
      value,
      color: ENV_COLORS[name as keyof typeof ENV_COLORS] || ENV_COLORS.Other
    })),
    byType: Object.entries(typeCounts).map(([name, value]) => ({
      name,
      value,
      color: TYPE_COLORS[name as keyof typeof TYPE_COLORS] || '#6B7280'
    })),
    byStatus: Object.entries(statusCounts).map(([name, value]) => ({
      name,
      value,
      color: STATUS_COLORS[name as keyof typeof STATUS_COLORS] || '#6B7280'
    }))
  };
};

const CustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent < 0.05) return null;
  
  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor='middle' 
      dominantBaseline="central"
      className="text-xs font-medium"
    >
      {value}
    </text>
  );
};

const TestbedsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTestbed, setSelectedTestbed] = useState<Testbed | null>(null);
  const [detailSheetOpen, setDetailSheetOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
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
          tb.ownedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (tb.environment && tb.environment.toLowerCase().includes(searchQuery.toLowerCase()))
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
      key: 'environment',
      header: 'Environment',
      cell: (testbed) => testbed.environment ? (
        <Badge
          variant="outline"
          className={getEnvironmentBadgeColor(testbed.environment)}
        >
          {testbed.environment}
          {testbed.envFlavor && ` (${testbed.envFlavor})`}
        </Badge>
      ) : null
    },
    {
      key: 'status',
      header: 'Status',
      cell: (testbed) => (
        <Badge
          variant="outline"
          className={`
            ${testbed.status === 'active' ? 'text-green-500 border-green-500' : 
              testbed.status === 'provisioning' ? 'text-blue-500 border-blue-500' : 
              testbed.status === 'failed' ? 'text-red-500 border-red-500' : 
              'text-gray-500 border-gray-500'}
          `}
        >
          <span className={`mr-1.5 h-2 w-2 rounded-full inline-block ${
            testbed.status === 'active' ? 'bg-green-500' : 
            testbed.status === 'provisioning' ? 'bg-blue-500' : 
            testbed.status === 'failed' ? 'bg-red-500' : 
            'bg-gray-500'
          }`}></span>
          {testbed.status}
        </Badge>
      )
    },
    {
      key: 'type',
      header: 'Type',
      cell: (testbed) => (
        <Badge
          variant="outline"
          className={`
            ${testbed.type === 'hardware' ? 'text-red-500 border-red-500' : 
              testbed.type === 'virtual' ? 'text-blue-500 border-blue-500' : 
              'text-purple-500 border-purple-500'}
          `}
        >
          {testbed.type}
        </Badge>
      )
    },
    {
      key: 'owner',
      header: 'Owner',
      cell: (testbed) => testbed.ownedBy
    },
    {
      key: 'created',
      header: 'Created',
      cell: (testbed) => new Date(testbed.createdAt).toLocaleDateString()
    },
  ];

  const actionColumn = (testbed: Testbed) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => openTestbedDetails(testbed)}>
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

  const StatusSummaryCard = ({ stats }: { stats: TestbedStats }) => (
    <Card className="md:col-span-1">
      <CardHeader className="py-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Status</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-xs">Active</span>
            </div>
            <span className="text-xs font-medium">{stats.active}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-xs">Provisioning</span>
            </div>
            <span className="text-xs font-medium">{stats.provisioning}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-xs">Failed</span>
            </div>
            <span className="text-xs font-medium">{stats.failed}</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-500" />
              <span className="text-xs">Decommissioned</span>
            </div>
            <span className="text-xs font-medium">{stats.decommissioned}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ResourceSummaryCard = ({ stats }: { stats: TestbedStats }) => (
    <Card className="md:col-span-1">
      <CardHeader className="py-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Resources</CardTitle>
          <Server className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="pt-0 pb-2">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">CPUs:</span>
            <span className="text-xs font-medium">{stats.totalCpu}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Memory:</span>
            <span className="text-xs font-medium">{stats.totalMemory} GB</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Storage:</span>
            <span className="text-xs font-medium">{stats.totalStorage} GB</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">VMs:</span>
            <span className="text-xs font-medium">{stats.totalVMs}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto space-y-6">
      <PageHeader 
        title="Testbed Management"
        description="Manage your testing environments and infrastructure."
        onRefresh={handleRefresh}
      >
        <Button onClick={handleAddTestbed}>Add Testbed</Button>
      </PageHeader>

      <Tabs 
        defaultValue="overview" 
        className="w-full"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="md:col-span-1">
              <CardHeader className="py-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Total Testbeds</CardTitle>
                  <Layers className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="pt-0 pb-2">
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.whitelisted} whitelisted
                </p>
              </CardContent>
            </Card>
            
            <StatusSummaryCard stats={stats} />
            <ResourceSummaryCard stats={stats} />

            <Card className="md:col-span-1">
              <CardHeader className="py-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Environments</CardTitle>
                  <CubeIcon className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent className="pt-0 pb-2">
                <div className="space-y-2">
                  {stats.byEnvironment.map(env => (
                    <div key={env.name} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: env.color }}
                        />
                        <span className="text-xs">{env.name}</span>
                      </div>
                      <span className="text-xs font-medium">{env.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <TestbedActivityChart />

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Environment Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.byEnvironment}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={CustomizedLabel}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {stats.byEnvironment.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: any) => [`${value} testbeds`, 'Count']}
                        labelFormatter={(label) => `${label}`}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.byStatus}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={CustomizedLabel}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {stats.byStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: any) => [`${value} testbeds`, 'Count']}
                        labelFormatter={(label) => `${label}`}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Environment Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.byEnvironment}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={CustomizedLabel}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {stats.byEnvironment.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: any) => [`${value} testbeds`, 'Count']}
                        labelFormatter={(label) => `${label}`}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Type Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.byType}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={CustomizedLabel}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {stats.byType.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: any) => [`${value} testbeds`, 'Count']}
                        labelFormatter={(label) => `${label}`}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Testbed Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.byStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={CustomizedLabel}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {stats.byStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: any) => [`${value} testbeds`, 'Count']}
                      labelFormatter={(label) => `${label}`}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="space-y-6">
          <SearchBar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder="Search testbeds..."
          />

          <Separator />

          {isLoading ? (
            <TableSkeleton rows={5} />
          ) : (
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
          )}
        </TabsContent>
      </Tabs>

      <TestbedDetailSheet
        testbed={selectedTestbed}
        open={detailSheetOpen}
        onOpenChange={setDetailSheetOpen}
      />
    </div>
  );
};

export default TestbedsPage;
