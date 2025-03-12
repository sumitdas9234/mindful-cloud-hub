
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { PageHeader } from '@/components/compute/PageHeader';
import { useToast } from '@/hooks/use-toast';
import { RoutesSection } from '@/components/networking/RoutesSection';
import { SubnetData, RouteData } from '@/api/types/networking';

// Mock data for subnets (needed for subnet reference)
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
  const { data: subnets = [] } = useQuery({
    queryKey: ['subnets'],
    queryFn: () => Promise.resolve(mockSubnets),
  });

  const selectedSubnet = selectedSubnetId 
    ? subnets.find(subnet => subnet.id === selectedSubnetId) || null
    : null;

  const handleRefresh = () => {
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
