import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  DropdownMenu, DropdownMenuContent, 
  DropdownMenuItem, DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MoreVertical
} from 'lucide-react';
import { SubnetData } from '@/api/types/networking';
import { DataTable, Column } from '@/components/compute/DataTable';
import { SearchBar } from '@/components/compute/SearchBar';
import { useToast } from '@/hooks/use-toast';
import { SubnetDetailSheet } from './SubnetDetailSheet';

const mockSubnets: SubnetData[] = [
  {
    id: "subnet-1",
    name: "Production Network",
    cidr: "10.0.0.0/16",
    description: "Main production network subnet",
    status: "active",
    vlanId: 100,
    gatewayIp: "10.0.0.1",
    routesCount: 12,
    createdAt: "2023-01-15T10:00:00Z",
    location: "US-East",
    environment: "Production"
  },
  {
    id: "subnet-2",
    name: "Development Network",
    cidr: "172.16.0.0/20",
    description: "Development and testing environment",
    status: "active",
    vlanId: 200,
    gatewayIp: "172.16.0.1",
    routesCount: 8,
    createdAt: "2023-02-20T14:30:00Z",
    location: "US-West",
    environment: "Development"
  },
  {
    id: "subnet-3",
    name: "Management Network",
    cidr: "192.168.0.0/24",
    description: "Management and control plane traffic",
    status: "active",
    vlanId: 300,
    gatewayIp: "192.168.0.1",
    routesCount: 5,
    createdAt: "2023-03-05T09:15:00Z",
    location: "EU-Central",
    environment: "Infrastructure"
  },
  {
    id: "subnet-4",
    name: "Backup Network",
    cidr: "10.10.0.0/16",
    description: "Subnet for backup operations",
    status: "inactive",
    vlanId: 400,
    gatewayIp: "10.10.0.1",
    routesCount: 3,
    createdAt: "2023-04-10T16:45:00Z",
    location: "APAC",
    environment: "Backup"
  },
  {
    id: "subnet-5",
    name: "Staging Network",
    cidr: "192.168.10.0/24",
    description: "Pre-production staging environment",
    status: "pending",
    vlanId: 500,
    gatewayIp: "192.168.10.1",
    routesCount: 6,
    createdAt: "2023-05-20T11:20:00Z",
    location: "US-East",
    environment: "Staging"
  }
];

interface SubnetsSectionProps {
  onSubnetSelect?: (subnetId: string) => void;
  selectedSubnetId?: string | null;
}

export const SubnetsSection: React.FC<SubnetsSectionProps> = () => {
  const [selectedSubnet, setSelectedSubnet] = useState<SubnetData | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const { data: subnets = [], isLoading, refetch } = useQuery({
    queryKey: ['subnets'],
    queryFn: () => Promise.resolve(mockSubnets),
  });

  const filteredSubnets = subnets.filter(subnet => 
    subnet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subnet.cidr.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subnet.gatewayIp.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subnet.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRowClick = (subnet: SubnetData) => {
    setSelectedSubnet(subnet);
    setIsDetailOpen(true);
  };

  const handleSubnetAction = (action: string, subnet: SubnetData) => {
    toast({
      title: `${action} Subnet`,
      description: `Action "${action}" triggered for subnet "${subnet.name}".`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-500 hover:bg-green-500/20';
      case 'inactive': 
      default: return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20';
    }
  };

  const columns: Column<SubnetData>[] = [
    {
      key: 'name',
      header: 'Name',
      cell: (subnet) => <span className="font-medium">{subnet.name}</span>
    },
    {
      key: 'cidr',
      header: 'CIDR',
      cell: (subnet) => subnet.cidr
    },
    {
      key: 'gateway',
      header: 'Gateway',
      cell: (subnet) => subnet.gatewayIp
    },
    {
      key: 'status',
      header: 'Status',
      cell: (subnet) => (
        <Badge
          variant="outline"
          className={getStatusColor(subnet.status)}
        >
          {subnet.status === 'pending' ? 'inactive' : subnet.status}
        </Badge>
      )
    },
    {
      key: 'routes',
      header: 'Routes',
      cell: (subnet) => subnet.routesCount
    }
  ];

  const actionColumn = (subnet: SubnetData) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleSubnetAction('View', subnet)}>
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSubnetAction('Edit', subnet)}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleSubnetAction('Delete', subnet)}
          className="text-red-500"
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Subnets</h2>
      </div>
      
      <SearchBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        placeholder="Search subnets..."
      />

      <DataTable
        data={filteredSubnets}
        columns={columns}
        keyExtractor={(subnet) => subnet.id}
        isLoading={isLoading}
        emptyTitle="No Subnets Found"
        emptyDescription={searchQuery ? "No subnets match your search criteria." : "No subnets have been added yet."}
        searchQuery={searchQuery}
        onRowClick={handleRowClick}
        actionColumn={actionColumn}
      />

      <SubnetDetailSheet
        subnet={selectedSubnet}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />
    </div>
  );
};
