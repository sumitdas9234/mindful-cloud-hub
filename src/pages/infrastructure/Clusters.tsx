
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { PageHeader } from '@/components/compute/PageHeader';
import { useToast } from '@/hooks/use-toast';
import { ClustersSection } from '@/components/clusters/ClustersSection';
import { useQueryClient } from '@tanstack/react-query';

const ClustersPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const handleRefresh = () => {
    // Invalidate and refetch clusters data
    queryClient.invalidateQueries({ queryKey: ['clusters'] });
    
    toast({
      title: "Refreshing clusters data",
      description: "The clusters information has been refreshed.",
    });
  };

  const handleAddResource = () => {
    toast({
      title: "Add Cluster",
      description: "This would open a dialog to add a new cluster.",
    });
  };

  return (
    <div className="container mx-auto space-y-6">
      <PageHeader 
        title="Cluster Management"
        description="Manage compute clusters and resource pools."
        onRefresh={handleRefresh}
        onAdd={handleAddResource}
        addButtonText="Add Cluster"
      />

      <Separator className="my-6" />

      <ClustersSection onRefresh={handleRefresh} />
    </div>
  );
};

export default ClustersPage;
