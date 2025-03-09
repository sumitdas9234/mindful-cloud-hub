
import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  RefreshCw, 
  MoreVertical, 
  Folder, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Tag,
  Calendar,
  Filter,
  XCircle
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
  DropdownMenuCheckboxItem,
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

// Types for our testbed data
interface Testbed {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'provisioning' | 'failed' | 'decommissioned';
  type: 'development' | 'testing' | 'staging' | 'qa';
  owner: string;
  environment: string;
  createdAt: string;
  expiresAt: string | null;
  vms: number;
  resources: {
    cpu: number;
    memory: number;
    storage: number;
  };
  tags: string[];
}

// Mock data for testbeds
const mockTestbeds: Testbed[] = [
  {
    id: 'tb-1',
    name: 'dev-feature-a',
    description: 'Development environment for Feature A',
    status: 'active',
    type: 'development',
    owner: 'john.doe@example.com',
    environment: 'development',
    createdAt: '2023-06-15T10:30:00Z',
    expiresAt: '2023-09-15T10:30:00Z',
    vms: 4,
    resources: {
      cpu: 8,
      memory: 16,
      storage: 250
    },
    tags: ['feature-a', 'dev', 'automated-tests']
  },
  {
    id: 'tb-2',
    name: 'qa-regression',
    description: 'QA Regression Testing Environment',
    status: 'active',
    type: 'qa',
    owner: 'jane.smith@example.com',
    environment: 'qa',
    createdAt: '2023-05-20T09:15:00Z',
    expiresAt: null,
    vms: 6,
    resources: {
      cpu: 12,
      memory: 32,
      storage: 500
    },
    tags: ['regression', 'qa', 'persistent']
  },
  {
    id: 'tb-3',
    name: 'staging-v2-release',
    description: 'Staging environment for v2.0 release',
    status: 'provisioning',
    type: 'staging',
    owner: 'release.team@example.com',
    environment: 'staging',
    createdAt: '2023-08-10T14:45:00Z',
    expiresAt: '2023-10-10T14:45:00Z',
    vms: 8,
    resources: {
      cpu: 16,
      memory: 64,
      storage: 1000
    },
    tags: ['v2.0', 'staging', 'release-candidate']
  },
  {
    id: 'tb-4',
    name: 'dev-hotfix-123',
    description: 'Development environment for hotfix #123',
    status: 'active',
    type: 'development',
    owner: 'alex.developer@example.com',
    environment: 'development',
    createdAt: '2023-07-05T11:20:00Z',
    expiresAt: '2023-08-05T11:20:00Z',
    vms: 2,
    resources: {
      cpu: 4,
      memory: 8,
      storage: 100
    },
    tags: ['hotfix', 'dev', 'priority-high']
  },
  {
    id: 'tb-5',
    name: 'testing-integration',
    description: 'Integration testing environment',
    status: 'failed',
    type: 'testing',
    owner: 'test.team@example.com',
    environment: 'testing',
    createdAt: '2023-08-01T08:30:00Z',
    expiresAt: '2023-09-01T08:30:00Z',
    vms: 5,
    resources: {
      cpu: 10,
      memory: 24,
      storage: 400
    },
    tags: ['integration', 'testing', 'automated']
  },
  {
    id: 'tb-6',
    name: 'dev-prototype',
    description: 'Prototype development environment',
    status: 'decommissioned',
    type: 'development',
    owner: 'innovation.team@example.com',
    environment: 'development',
    createdAt: '2023-04-12T15:10:00Z',
    expiresAt: '2023-07-12T15:10:00Z',
    vms: 3,
    resources: {
      cpu: 6,
      memory: 12,
      storage: 200
    },
    tags: ['prototype', 'dev', 'innovation']
  }
];

// Summary stats type
interface TestbedStats {
  total: number;
  active: number;
  provisioning: number;
  failed: number;
  decommissioned: number;
  totalVMs: number;
  cpuCores: number;
  memoryGB: number;
  storageGB: number;
}

const calculateStats = (testbeds: Testbed[]): TestbedStats => {
  return {
    total: testbeds.length,
    active: testbeds.filter(tb => tb.status === 'active').length,
    provisioning: testbeds.filter(tb => tb.status === 'provisioning').length,
    failed: testbeds.filter(tb => tb.status === 'failed').length,
    decommissioned: testbeds.filter(tb => tb.status === 'decommissioned').length,
    totalVMs: testbeds.reduce((sum, tb) => sum + tb.vms, 0),
    cpuCores: testbeds.reduce((sum, tb) => sum + tb.resources.cpu, 0),
    memoryGB: testbeds.reduce((sum, tb) => sum + tb.resources.memory, 0),
    storageGB: testbeds.reduce((sum, tb) => sum + tb.resources.storage, 0)
  };
};

// All possible tags from our mock data
const getAllTags = (testbeds: Testbed[]): string[] => {
  const tagsSet = new Set<string>();
  testbeds.forEach(tb => {
    tb.tags.forEach(tag => tagsSet.add(tag));
  });
  return Array.from(tagsSet).sort();
};

const TestbedsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState('grid');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { toast } = useToast();

  // In a real application, this would use the real API
  const { data: testbeds = [], isLoading, refetch } = useQuery({
    queryKey: ['testbeds'],
    queryFn: () => Promise.resolve(mockTestbeds),
  });

  const allTags = getAllTags(testbeds);

  const filteredTestbeds = testbeds.filter(testbed => {
    // Apply search query filter
    const matchesSearch = 
      testbed.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      testbed.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      testbed.owner.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply type filter if any types are selected
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(testbed.type);
    
    // Apply status filter if any statuses are selected
    const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(testbed.status);
    
    // Apply tags filter if any tags are selected
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => testbed.tags.includes(tag));
    
    return matchesSearch && matchesType && matchesStatus && matchesTags;
  });

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
      description: "This would open a dialog to add a new testbed.",
    });
  };

  const handleTestbedAction = (action: string, testbed: Testbed) => {
    toast({
      title: `${action} Testbed`,
      description: `Action "${action}" has been triggered for testbed "${testbed.name}".`,
    });
  };

  const toggleTypeSelection = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type) 
        : [...prev, type]
    );
  };

  const toggleStatusSelection = (status: string) => {
    setSelectedStatuses(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status) 
        : [...prev, status]
    );
  };

  const toggleTagSelection = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };

  const clearAllFilters = () => {
    setSelectedTypes([]);
    setSelectedStatuses([]);
    setSelectedTags([]);
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
        return <Clock className="h-4 w-4 text-blue-500" />;
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
      case 'development':
        return 'bg-purple-500/10 text-purple-500 hover:bg-purple-500/20';
      case 'testing':
        return 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20';
      case 'staging':
        return 'bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500/20';
      case 'qa':
        return 'bg-pink-500/10 text-pink-500 hover:bg-pink-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20';
    }
  };

  const hasActiveFilters = selectedTypes.length > 0 || selectedStatuses.length > 0 || selectedTags.length > 0;

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Testbed Management</h1>
          <p className="text-muted-foreground">Manage your development, testing, and staging environments.</p>
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
              {stats.active} active, {stats.provisioning} provisioning
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
              Across all environments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">CPU Cores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.cpuCores}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.memoryGB} GB RAM allocated
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Storage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.storageGB} GB</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total allocated storage
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between">
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
        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="relative">
                <Filter className="mr-2 h-4 w-4" />
                Filter
                {hasActiveFilters && (
                  <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3 items-center justify-center rounded-full bg-primary">
                    <span className="animate-pulse h-2 w-2 rounded-full bg-background" />
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem
                onClick={clearAllFilters}
                disabled={!hasActiveFilters}
                className="justify-center font-medium"
              >
                Clear All Filters
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="p-2">
                <p className="text-xs font-medium mb-2">Type</p>
                <div className="space-y-1">
                  <DropdownMenuCheckboxItem
                    checked={selectedTypes.includes('development')}
                    onCheckedChange={() => toggleTypeSelection('development')}
                  >
                    Development
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={selectedTypes.includes('testing')}
                    onCheckedChange={() => toggleTypeSelection('testing')}
                  >
                    Testing
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={selectedTypes.includes('staging')}
                    onCheckedChange={() => toggleTypeSelection('staging')}
                  >
                    Staging
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={selectedTypes.includes('qa')}
                    onCheckedChange={() => toggleTypeSelection('qa')}
                  >
                    QA
                  </DropdownMenuCheckboxItem>
                </div>
              </div>
              <DropdownMenuSeparator />
              <div className="p-2">
                <p className="text-xs font-medium mb-2">Status</p>
                <div className="space-y-1">
                  <DropdownMenuCheckboxItem
                    checked={selectedStatuses.includes('active')}
                    onCheckedChange={() => toggleStatusSelection('active')}
                  >
                    Active
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={selectedStatuses.includes('provisioning')}
                    onCheckedChange={() => toggleStatusSelection('provisioning')}
                  >
                    Provisioning
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={selectedStatuses.includes('failed')}
                    onCheckedChange={() => toggleStatusSelection('failed')}
                  >
                    Failed
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={selectedStatuses.includes('decommissioned')}
                    onCheckedChange={() => toggleStatusSelection('decommissioned')}
                  >
                    Decommissioned
                  </DropdownMenuCheckboxItem>
                </div>
              </div>
              <DropdownMenuSeparator />
              <div className="p-2">
                <p className="text-xs font-medium mb-2">Tags</p>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {allTags.map(tag => (
                    <DropdownMenuCheckboxItem
                      key={tag}
                      checked={selectedTags.includes(tag)}
                      onCheckedChange={() => toggleTagSelection(tag)}
                    >
                      {tag}
                    </DropdownMenuCheckboxItem>
                  ))}
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <Tabs defaultValue="grid" className="hidden md:block" onValueChange={setView}>
            <TabsList>
              <TabsTrigger value="grid">Grid</TabsTrigger>
              <TabsTrigger value="table">Table</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {selectedTypes.map(type => (
            <Badge
              key={`type-${type}`}
              variant="outline"
              className={getTypeBadgeColor(type as Testbed['type'])}
              onClick={() => toggleTypeSelection(type)}
            >
              <span className="mr-1 capitalize">{type}</span>
              <XCircle className="h-3 w-3" />
            </Badge>
          ))}
          {selectedStatuses.map(status => (
            <Badge
              key={`status-${status}`}
              variant="outline"
              className={getStatusBadgeColor(status as Testbed['status'])}
              onClick={() => toggleStatusSelection(status)}
            >
              <span className="mr-1 capitalize">{status}</span>
              <XCircle className="h-3 w-3" />
            </Badge>
          ))}
          {selectedTags.map(tag => (
            <Badge
              key={`tag-${tag}`}
              variant="outline"
              onClick={() => toggleTagSelection(tag)}
            >
              <span className="mr-1">{tag}</span>
              <XCircle className="h-3 w-3" />
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-7 px-2 text-xs"
          >
            Clear all
          </Button>
        </div>
      )}

      <Separator />

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading testbeds...</p>
        </div>
      ) : filteredTestbeds.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64">
          <Folder className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No Testbeds Found</h3>
          <p className="text-muted-foreground">
            {searchQuery || hasActiveFilters
              ? "No testbeds match your search criteria."
              : "No testbeds have been created yet."}
          </p>
        </div>
      ) : view === 'grid' ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTestbeds.map((testbed) => (
            <Card key={testbed.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium">
                    {testbed.name}
                  </CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleTestbedAction('Edit', testbed)}>
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleTestbedAction('Clone', testbed)}>
                        Clone
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleTestbedAction('Restart', testbed)}>
                        Restart
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleTestbedAction('Decommission', testbed)}
                        className="text-red-500"
                      >
                        Decommission
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardDescription>{testbed.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Owner</span>
                    <span className="truncate">{testbed.owner}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Status</span>
                    <div className="flex items-center">
                      {getStatusIcon(testbed.status)}
                      <span className="ml-1 capitalize">{testbed.status}</span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Type</span>
                    <span className="capitalize">{testbed.type}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">VMs</span>
                    <span>{testbed.vms}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Created</span>
                    <span>{new Date(testbed.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">Expires</span>
                    <span>{testbed.expiresAt ? new Date(testbed.expiresAt).toLocaleDateString() : 'Never'}</span>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-xs text-muted-foreground">Resources</span>
                  <div className="grid grid-cols-3 gap-1 mt-1">
                    <div className="flex items-center text-xs">
                      <span className="font-medium">{testbed.resources.cpu}</span>
                      <span className="ml-1 text-muted-foreground">CPUs</span>
                    </div>
                    <div className="flex items-center text-xs">
                      <span className="font-medium">{testbed.resources.memory}</span>
                      <span className="ml-1 text-muted-foreground">GB RAM</span>
                    </div>
                    <div className="flex items-center text-xs">
                      <span className="font-medium">{testbed.resources.storage}</span>
                      <span className="ml-1 text-muted-foreground">GB Storage</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-start pt-1">
                <div className="flex w-full justify-between items-center mb-2">
                  <Badge
                    variant="outline"
                    className={getTypeBadgeColor(testbed.type)}
                  >
                    {testbed.type}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={getStatusBadgeColor(testbed.status)}
                  >
                    {testbed.status}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1">
                  {testbed.tags.map(tag => (
                    <Badge
                      key={`${testbed.id}-${tag}`}
                      variant="secondary"
                      className="text-xs"
                    >
                      <Tag className="mr-1 h-3 w-3" />
                      {tag}
                    </Badge>
                  ))}
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
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>VMs</TableHead>
                <TableHead>Resources</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTestbeds.map((testbed) => (
                <TableRow key={testbed.id}>
                  <TableCell className="font-medium">
                    <div>
                      {testbed.name}
                      <p className="text-xs text-muted-foreground">{testbed.description}</p>
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
                  <TableCell>
                    <div className="flex items-center">
                      {getStatusIcon(testbed.status)}
                      <span className="ml-1 capitalize">{testbed.status}</span>
                    </div>
                  </TableCell>
                  <TableCell>{testbed.owner}</TableCell>
                  <TableCell>{testbed.vms}</TableCell>
                  <TableCell>
                    <div className="text-xs">
                      <div>{testbed.resources.cpu} CPU</div>
                      <div>{testbed.resources.memory} GB RAM</div>
                      <div>{testbed.resources.storage} GB Storage</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-3 w-3" />
                      {new Date(testbed.createdAt).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    {testbed.expiresAt ? (
                      <div className="flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        {new Date(testbed.expiresAt).toLocaleDateString()}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Never</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {testbed.tags.map(tag => (
                        <Badge
                          key={`${testbed.id}-${tag}`}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleTestbedAction('Edit', testbed)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleTestbedAction('Clone', testbed)}>
                          Clone
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleTestbedAction('Restart', testbed)}>
                          Restart
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleTestbedAction('Decommission', testbed)}
                          className="text-red-500"
                        >
                          Decommission
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

export default TestbedsPage;
