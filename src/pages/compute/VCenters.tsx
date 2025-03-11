import React, { useState } from 'react';
import { MoreVertical, Server } from 'lucide-react';
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
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

import { StatusIndicator } from '@/components/compute/StatusIndicator';
import { SearchBar } from '@/components/compute/SearchBar';
import { VCenterStatCards } from '@/components/compute/StatCards';
import { PageHeader } from '@/components/compute/PageHeader';
import { EmptyState } from '@/components/compute/EmptyState';
import { VCenterDetailSheet } from '@/components/compute/VCenterDetailSheet';

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

  return (
    <div className="container mx-auto space-y-6">
      <PageHeader 
        title="vCenter Management"
        description="Manage your VMware vCenter Server instances."
        onRefresh={handleRefresh}
        onAdd={handleAddVCenter}
        addButtonText="Add vCenter"
      />

      <VCenterStatCards 
        total={stats.total}
        healthy={stats.healthy}
        totalHosts={stats.totalHosts}
        totalVMs={stats.totalVMs}
      />

      <SearchBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        placeholder="Search vCenters..."
      />

      <Separator />

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading vCenters...</p>
        </div>
      ) : filteredVCenters.length === 0 ? (
        <EmptyState 
          title="No vCenters Found"
          description={searchQuery
            ? "No vCenters match your search criteria."
            : "No vCenters have been added yet."}
        />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Version</TableHead>
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
                  <TableCell className="font-medium py-2">{vcenter.name}</TableCell>
                  <TableCell className="py-2">
                    <StatusIndicator status={vcenter.status} />
                  </TableCell>
                  <TableCell className="py-2">{vcenter.version}</TableCell>
                  <TableCell className="py-2">{new Date(vcenter.lastSync).toLocaleDateString()}</TableCell>
                  <TableCell className="py-2" onClick={(e) => e.stopPropagation()}>
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
