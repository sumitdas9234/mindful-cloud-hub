
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  DropdownMenu, DropdownMenuContent, 
  DropdownMenuItem, DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MoreVertical, Server, Database
} from 'lucide-react';
import { TransformedSubnetData } from '@/api/types/networking';
import { DataTable, Column } from '@/components/compute/DataTable';
import { SearchBar } from '@/components/compute/SearchBar';
import { useToast } from '@/hooks/use-toast';
import { SubnetDetailSheet } from './SubnetDetailSheet';
import { fetchSubnets } from '@/api/networkingApi';
import { TableSkeleton } from '@/components/ui/skeleton';

interface SubnetsSectionProps {
  onSubnetSelect?: (subnetId: string) => void;
  selectedSubnetId?: string | null;
  onRefresh?: () => void;
}

export const SubnetsSection: React.FC<SubnetsSectionProps> = ({ 
  onSubnetSelect,
  selectedSubnetId,
  onRefresh 
}) => {
  const [selectedSubnet, setSelectedSubnet] = useState<TransformedSubnetData | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const { 
    data: subnets = [], 
    isLoading, 
    isError,
    error,
    refetch 
  } = useQuery({
    queryKey: ['subnets'],
    queryFn: fetchSubnets,
    refetchOnWindowFocus: true,
  });

  // Expose refetch method to parent component
  React.useEffect(() => {
    if (onRefresh) {
      const originalOnRefresh = onRefresh;
      onRefresh = () => {
        refetch();
        originalOnRefresh();
      };
    }
  }, [onRefresh, refetch]);

  // Error handling
  if (isError && error) {
    console.error('Error fetching subnets:', error);
  }

  const filteredSubnets = subnets.filter(subnet => 
    subnet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subnet.cidr.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subnet.gatewayIp.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subnet.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subnet.cluster?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subnet.datacenter?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRowClick = (subnet: TransformedSubnetData) => {
    setSelectedSubnet(subnet);
    setIsDetailOpen(true);
  };

  const handleSubnetAction = (action: string, subnet: TransformedSubnetData) => {
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

  const columns: Column<TransformedSubnetData>[] = [
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
      key: 'datacenter',
      header: 'Datacenter',
      cell: (subnet) => (
        <div className="flex items-center">
          <Server className="mr-2 h-4 w-4 text-muted-foreground" /> 
          {subnet.datacenter}
        </div>
      )
    },
    {
      key: 'cluster',
      header: 'Cluster',
      cell: (subnet) => (
        <div className="flex items-center">
          <Database className="mr-2 h-4 w-4 text-muted-foreground" /> 
          {subnet.cluster}
        </div>
      )
    }
  ];

  const actionColumn = (subnet: TransformedSubnetData) => (
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
        <SearchBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder="Search subnets..."
        />
        <Badge className="bg-blue-500/10 text-blue-500">
          {!isLoading ? `${subnets.length} total` : "Loading..."}
        </Badge>
      </div>

      {isLoading ? (
        <TableSkeleton rows={5} />
      ) : (
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
      )}

      <SubnetDetailSheet
        subnet={selectedSubnet}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />
    </div>
  );
};
