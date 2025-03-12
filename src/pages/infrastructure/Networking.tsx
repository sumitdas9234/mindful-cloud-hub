
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Separator } from '@/components/ui/separator';
import { PageHeader } from '@/components/compute/PageHeader';
import { useToast } from '@/hooks/use-toast';
import { SubnetsSection } from '@/components/networking/SubnetsSection';
import { RoutesSection } from '@/components/networking/RoutesSection';
import { SubnetData } from '@/api/types/networking';

// Mock data for subnets - same as in SubnetsSection for consistency
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

const NetworkingPage: React.FC = () => {
  const [selectedSubnetId, setSelectedSubnetId] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: subnets = [] } = useQuery({
    queryKey: ['subnets'],
    queryFn: () => Promise.resolve(mockSubnets),
  });

  const selectedSubnet = selectedSubnetId 
    ? subnets.find(subnet => subnet.id === selectedSubnetId) || null
    : null;

  const handleRefresh = () => {
    toast({
      title: "Refreshing network data",
      description: "The network information has been refreshed.",
    });
  };

  const handleAddResource = () => {
    toast({
      title: "Add Network Resource",
      description: "This would open a dialog to add a new network resource.",
    });
  };

  const handleSubnetSelect = (subnetId: string) => {
    setSelectedSubnetId(subnetId);
  };

  const handleBackToSubnets = () => {
    setSelectedSubnetId(null);
  };

  return (
    <div className="container mx-auto space-y-6">
      <PageHeader 
        title="Network Management"
        description="Manage your network resources, subnets, and routes."
        onRefresh={handleRefresh}
        onAdd={handleAddResource}
        addButtonText="Add Resource"
      />

      <Separator className="my-6" />

      {selectedSubnetId ? (
        <RoutesSection 
          subnetId={selectedSubnetId}
          subnet={selectedSubnet}
          onBack={handleBackToSubnets}
        />
      ) : (
        <SubnetsSection 
          onSubnetSelect={handleSubnetSelect}
          selectedSubnetId={selectedSubnetId}
        />
      )}
    </div>
  );
};

export default NetworkingPage;
