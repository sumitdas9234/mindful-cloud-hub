
import React, { useState } from 'react';
import { 
  Server, 
  Plus, 
  RefreshCw, 
  Search,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { toast } from 'sonner';

interface VCenter {
  id: string;
  name: string;
  url: string;
  status: 'online' | 'offline' | 'warning';
  hostCount: number;
  vmCount: number;
  datastoreCount: number;
  lastSync: string;
}

const vCenters: VCenter[] = [
  {
    id: '1',
    name: 'vcenter-prod-01',
    url: 'https://vcenter-prod-01.example.com',
    status: 'online',
    hostCount: 24,
    vmCount: 356,
    datastoreCount: 12,
    lastSync: '2023-10-12 14:30:22'
  },
  {
    id: '2',
    name: 'vcenter-dr-01',
    url: 'https://vcenter-dr-01.example.com',
    status: 'online',
    hostCount: 16,
    vmCount: 284,
    datastoreCount: 8,
    lastSync: '2023-10-12 14:28:45'
  },
  {
    id: '3',
    name: 'vcenter-dev-01',
    url: 'https://vcenter-dev-01.example.com',
    status: 'warning',
    hostCount: 8,
    vmCount: 124,
    datastoreCount: 4,
    lastSync: '2023-10-12 13:45:30'
  },
  {
    id: '4',
    name: 'vcenter-test-01',
    url: 'https://vcenter-test-01.example.com',
    status: 'offline',
    hostCount: 4,
    vmCount: 78,
    datastoreCount: 2,
    lastSync: '2023-10-11 09:15:10'
  }
];

const VCenters: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredVCenters = vCenters.filter(vcenter => 
    vcenter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vcenter.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('vCenter data refreshed successfully');
    }, 1500);
  };

  const handleAddNew = () => {
    toast.info('Add vCenter functionality coming soon');
  };

  const getStatusIcon = (status: VCenter['status']) => {
    switch (status) {
      case 'online':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'offline':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
    }
  };

  const getStatusBadge = (status: VCenter['status']) => {
    switch (status) {
      case 'online':
        return <Badge variant="default" className="bg-green-500">Online</Badge>;
      case 'offline':
        return <Badge variant="default" className="bg-red-500">Offline</Badge>;
      case 'warning':
        return <Badge variant="default" className="bg-amber-500">Warning</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">vCenter Management</h2>
          <p className="text-muted-foreground">
            Manage your vCenter instances and monitor their status
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleAddNew}>
            <Plus className="h-4 w-4 mr-2" />
            Add vCenter
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search vCenters..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total vCenters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vCenters.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Healthy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {vCenters.filter(v => v.status === 'online').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Warning</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">
              {vCenters.filter(v => v.status === 'warning').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Offline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {vCenters.filter(v => v.status === 'offline').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>URL</TableHead>
                <TableHead className="text-right">Hosts</TableHead>
                <TableHead className="text-right">VMs</TableHead>
                <TableHead className="text-right">Datastores</TableHead>
                <TableHead>Last Sync</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVCenters.map((vcenter) => (
                <TableRow key={vcenter.id}>
                  <TableCell>
                    <div className="flex items-center">
                      {getStatusIcon(vcenter.status)}
                      <span className="ml-2 hidden md:inline">
                        {getStatusBadge(vcenter.status)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{vcenter.name}</TableCell>
                  <TableCell className="text-muted-foreground">{vcenter.url}</TableCell>
                  <TableCell className="text-right">{vcenter.hostCount}</TableCell>
                  <TableCell className="text-right">{vcenter.vmCount}</TableCell>
                  <TableCell className="text-right">{vcenter.datastoreCount}</TableCell>
                  <TableCell className="text-muted-foreground">{vcenter.lastSync}</TableCell>
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
                        <DropdownMenuItem>Resync</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500">Disconnect</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default VCenters;
