
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { PageHeader } from '@/components/compute/PageHeader';
import { useToast } from '@/hooks/use-toast';
import { RoutesSection } from '@/components/networking/RoutesSection';
import { SubnetData } from '@/api/types/networking';
import { fetchSubnets } from '@/api/networkingApi';

const RoutesPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Extract subnetId from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const subnetIdFromQuery = queryParams.get('subnetId');
  
  const [selectedSubnetId, setSelectedSubnetId] = useState<string | null>(subnetIdFromQuery);

  useEffect(() => {
    // Update the selectedSubnetId when the URL changes
    setSelectedSubnetId(subnetIdFromQuery);
  }, [subnetIdFromQuery]);

  // Fetch the subnet data
  const { data: subnets = [], refetch: refetchSubnets } = useQuery({
    queryKey: ['subnets'],
    queryFn: fetchSubnets,
    staleTime: 0,
    refetchOnMount: 'always',
    gcTime: 0,
  });

  const selectedSubnet = selectedSubnetId 
    ? subnets.find(subnet => subnet.id === selectedSubnetId) || null
    : null;

  const handleRefresh = () => {
    // Invalidate and refetch queries
    refetchSubnets();
    
    toast({
      title: "Refreshing routes data",
      description: "The routes information has been refreshed.",
    });
  };

  const handleAddResource = () => {
    toast({
      title: "Add Route",
      description: "This would open a dialog to add a new route.",
    });
  };

  const handleBackToSubnets = () => {
    navigate('/networking/subnets');
  };

  return (
    <div className="container mx-auto space-y-6">
      <PageHeader 
        title="Route Management"
        description="Manage network routes and traffic paths."
        onRefresh={handleRefresh}
        onAdd={handleAddResource}
        addButtonText="Add Route"
      />

      <Separator className="my-6" />

      <RoutesSection 
        subnetId={selectedSubnetId}
        subnet={selectedSubnet}
        onBack={handleBackToSubnets}
      />
    </div>
  );
};

export default RoutesPage;
