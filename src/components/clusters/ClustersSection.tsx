
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  DropdownMenu, DropdownMenuContent, 
  DropdownMenuItem, DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MoreVertical, Server, HardDrive, Network
} from 'lucide-react';
import { ClusterData } from '@/api/types/clusters';
import { DataTable, Column } from '@/components/compute/DataTable';
import { SearchBar } from '@/components/compute/SearchBar';
import { useToast } from '@/hooks/use-toast';
import { ClusterDetailSheet } from './ClusterDetailSheet';
import { ClusterUpdateDialog } from './ClusterUpdateDialog';
import { fetchClusters, updateCluster } from '@/api/clustersApi';
import { TableSkeleton } from '@/components/ui/skeleton';

interface ClustersSectionProps {
  onClusterSelect?: (clusterId: string) => void;
  selectedClusterId?: string | null;
  onRefresh?: () => void;
}

export const ClustersSection: React.FC<ClustersSectionProps> = ({ 
  onClusterSelect,
  selectedClusterId,
  onRefresh 
}) => {
  const [selectedCluster, setSelectedCluster] = useState<ClusterData | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const { 
    data: clusters = [], 
    isLoading, 
    isError,
    error,
    refetch 
  } = useQuery({
    queryKey: ['clusters'],
    queryFn: fetchClusters,
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
    console.error('Error fetching clusters:', error);
  }

  const filteredClusters = clusters.filter(cluster => 
    cluster.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cluster.vc.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cluster.datastore.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cluster.resourcepool.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cluster.defaultnetwork.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRowClick = (cluster: ClusterData) => {
    setSelectedCluster(cluster);
    setIsDetailOpen(true);
  };

  const handleClusterAction = (action: string, cluster: ClusterData) => {
    if (action === 'View') {
      setSelectedCluster(cluster);
      setIsDetailOpen(true);
    } else if (action === 'Update') {
      setSelectedCluster(cluster);
      setIsUpdateOpen(true);
    } else {
      toast({
        title: `${action} Cluster`,
        description: `Action "${action}" triggered for cluster "${cluster.name}".`,
      });
    }
  };

  const handleUpdateCluster = async (clusterId: string, updates: Partial<ClusterData>) => {
    try {
      const updatedCluster = await updateCluster(clusterId, updates);
      toast({
        title: "Cluster Updated",
        description: `Cluster "${updatedCluster.name}" has been updated successfully.`,
      });
      setIsUpdateOpen(false);
      refetch();
    } catch (error) {
      console.error('Error updating cluster:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update the cluster. Please try again.",
        variant: "destructive",
      });
    }
  };

  const columns: Column<ClusterData>[] = [
    {
      key: 'name',
      header: 'Name',
      cell: (cluster) => <span className="font-medium">{cluster.name}</span>
    },
    {
      key: 'vc',
      header: 'vCenter',
      cell: (cluster) => (
        <div className="flex items-center">
          <Server className="mr-2 h-4 w-4 text-muted-foreground" /> 
          {cluster.vc}
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      cell: (cluster) => (
        <Badge
          variant="outline"
          className={cluster.isActive ? "bg-green-500/10 text-green-500" : "bg-gray-500/10 text-gray-500"}
        >
          {cluster.isActive ? "Active" : "Inactive"}
        </Badge>
      )
    },
    {
      key: 'datastore',
      header: 'Datastore',
      cell: (cluster) => (
        <div className="flex items-center">
          <HardDrive className="mr-2 h-4 w-4 text-muted-foreground" /> 
          <span className="truncate max-w-[200px]">{cluster.datastore}</span>
        </div>
      )
    },
    {
      key: 'network',
      header: 'Network',
      cell: (cluster) => (
        <div className="flex items-center">
          <Network className="mr-2 h-4 w-4 text-muted-foreground" /> 
          <span className="truncate max-w-[200px]">{cluster.defaultnetwork}</span>
        </div>
      )
    }
  ];

  const actionColumn = (cluster: ClusterData) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleClusterAction('View', cluster)}>
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleClusterAction('Update', cluster)}>
          Update
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleClusterAction('Delete', cluster)}
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
          placeholder="Search clusters..."
        />
        <Badge className="bg-blue-500/10 text-blue-500">
          {!isLoading ? `${clusters.length} total` : "Loading..."}
        </Badge>
      </div>

      {isLoading ? (
        <TableSkeleton rows={5} />
      ) : (
        <DataTable
          data={filteredClusters}
          columns={columns}
          keyExtractor={(cluster) => cluster.id}
          isLoading={isLoading}
          emptyTitle="No Clusters Found"
          emptyDescription={searchQuery ? "No clusters match your search criteria." : "No clusters have been added yet."}
          searchQuery={searchQuery}
          onRowClick={handleRowClick}
          actionColumn={actionColumn}
        />
      )}

      <ClusterDetailSheet
        cluster={selectedCluster}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        onUpdateClick={() => {
          setIsDetailOpen(false);
          setIsUpdateOpen(true);
        }}
      />

      {selectedCluster && (
        <ClusterUpdateDialog
          cluster={selectedCluster}
          open={isUpdateOpen}
          onOpenChange={setIsUpdateOpen}
          onClusterUpdate={handleUpdateCluster}
        />
      )}
    </div>
  );
};
