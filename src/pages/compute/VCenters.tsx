
import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  RefreshCw, 
  MoreVertical, 
  Server, 
  CheckCircle2, 
  AlertCircle
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
import { Separator } from '@/components/ui/separator';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
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
import { VCenterDetailSheet } from '@/components/compute/VCenterDetailSheet';

// Types for our vCenter data
interface VCenter {
  id: string;
  name: string;
  url: string;
  status: 'healthy' | 'warning' | 'error';
  version: string;
  datacenters: number;
  clusters: number;
  hosts: number;
  vms: number;
  lastSync: string;
}

// Mock data for vCenters
const mockVCenters: VCenter[] = [
  {
    id: 'vc-1',
    name: 'vcenter-east-01',
    url: 'https://vcenter-east-01.example.com',
    status: 'healthy',
    version: '7.0.3',
    datacenters: 2,
    clusters: 8,
    hosts: 32,
    vms: 245,
    lastSync: '2023-08-15T14:30:00Z'
  },
  {
    id: 'vc-2',
    name: 'vcenter-west-01',
    url: 'https://vcenter-west-01.example.com',
    status: 'warning',
    version: '7.0.2',
    datacenters: 3,
    clusters: 12,
    hosts: 48,
    vms: 356,
    lastSync: '2023-08-15T12:45:00Z'
  },
  {
    id: 'vc-3',
    name: 'vcenter-central-01',
    url: 'https://vcenter-central-01.example.com',
    status: 'healthy',
    version: '7.0.3',
    datacenters: 1,
    clusters: 6,
    hosts: 24,
    vms: 198,
    lastSync: '2023-08-15T13:15:00Z'
  },
  {
    id: 'vc-4',
    name: 'vcenter-dev-01',
    url: 'https://vcenter-dev-01.example.com',
    status: 'error',
    version: '7.0.1',
    datacenters: 1,
    clusters: 4,
    hosts: 16,
    vms: 120,
    lastSync: '2023-08-15T10:30:00Z'
  },
  {
    id: 'vc-5',
    name: 'vcenter-test-01',
    url: 'https://vcenter-test-01.example.com',
    status: 'healthy',
    version: '7.0.3',
    datacenters: 1,
    clusters: 3,
    hosts: 12,
    vms: 85,
    lastSync: '2023-08-15T11:20:00Z'
  }
];

// Summary stats type
interface VCenterStats {
  total: number;
  healthy: number;
  warning: number;
  error: number;
  totalHosts: number;
  totalVMs: number;
}

const calculateStats = (vcenters: VCenter[]): VCenterStats => {
  return {
    total: vcenters.length,
    healthy: vcenters.filter(vc => vc.status === 'healthy').length,
    warning: vcenters.filter(vc => vc.status === 'warning').length,
    error: vcenters.filter(vc => vc.status === 'error').length,
    totalHosts: vcenters.reduce((sum, vc) => sum + vc.hosts, 0),
    totalVMs: vcenters.reduce((sum, vc) => sum + vc.vms, 0)
  };
};

const VCentersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVCenter, setSelectedVCenter] = useState<VCenter | null>(null);
  const [detailSheetOpen, setDetailSheetOpen] = useState(false);
  const { toast } = useToast();

  // In a real application, this would use the real API
  const { data: vcenters = [], isLoading, refetch } = useQuery({
    queryKey: ['vcenters'],
    queryFn: () => Promise.resolve(mockVCenters),
  });

  const filteredVCenters = vcenters.filter(
    vc => vc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vc.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = calculateStats(vcenters);

  const handleRefresh = () => {
    refetch();
    toast({
      title: "Refreshing vCenters",
      description: "The vCenter list has been refreshed.",
    });
  };

  const handleAddVCenter = () => {
    toast({
      title: "Add vCenter",
      description: "This would open a dialog to add a new vCenter.",
    });
  };

  const handleVCenterAction = (action: string, vcenter: VCenter) => {
    toast({
      title: `${action} vCenter`,
      description: `Action "${action}" has been triggered for vCenter "${vcenter.name}".`,
    });
  };

  const openVCenterDetails = (vcenter: VCenter) => {
    setSelectedVCenter(vcenter);
    setDetailSheetOpen(true);
  };

  const getStatusIcon = (status: VCenter['status']) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">vCenter Management</h1>
          <p className="text-muted-foreground">Manage your VMware vCenter Server instances.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={handleAddVCenter} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add vCenter
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total vCenters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Healthy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="text-2xl font-bold">{stats.healthy}</div>
              <CheckCircle2 className="ml-2 h-5 w-5 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Hosts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalHosts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Virtual Machines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVMs}</div>
          </CardContent>
        </Card>
      </div>

      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search vCenters..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Separator />

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading vCenters...</p>
        </div>
      ) : filteredVCenters.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64">
          <Server className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No vCenters Found</h3>
          <p className="text-muted-foreground">
            {searchQuery
              ? "No vCenters match your search criteria."
              : "No vCenters have been added yet."}
          </p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Datacenters</TableHead>
                <TableHead>Clusters</TableHead>
                <TableHead>Hosts</TableHead>
                <TableHead>VMs</TableHead>
                <TableHead>Last Sync</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVCenters.map((vcenter) => (
                <TableRow 
                  key={vcenter.id} 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => openVCenterDetails(vcenter)}
                >
                  <TableCell className="font-medium">{vcenter.name}</TableCell>
                  <TableCell>{vcenter.url}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {getStatusIcon(vcenter.status)}
                      <span className="ml-1 capitalize">{vcenter.status}</span>
                    </div>
                  </TableCell>
                  <TableCell>{vcenter.version}</TableCell>
                  <TableCell>{vcenter.datacenters}</TableCell>
                  <TableCell>{vcenter.clusters}</TableCell>
                  <TableCell>{vcenter.hosts}</TableCell>
                  <TableCell>{vcenter.vms}</TableCell>
                  <TableCell>{new Date(vcenter.lastSync).toLocaleString()}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleVCenterAction('Edit', vcenter)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleVCenterAction('Refresh', vcenter)}>
                          Refresh
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleVCenterAction('Disconnect', vcenter)}>
                          Disconnect
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleVCenterAction('Remove', vcenter)} className="text-red-500">
                          Remove
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

      <VCenterDetailSheet
        vcenter={selectedVCenter}
        open={detailSheetOpen}
        onOpenChange={setDetailSheetOpen}
      />
    </div>
  );
};

export default VCentersPage;
