import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Network } from 'lucide-react';
import { SubnetData } from '@/api/types/networking';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EmptyState } from '@/components/compute/EmptyState';
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

  const { data: subnets = [], isLoading } = useQuery({
    queryKey: ['subnets'],
    queryFn: () => Promise.resolve(mockSubnets),
  });

  const handleRowClick = (subnet: SubnetData) => {
    setSelectedSubnet(subnet);
    setIsDetailOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-500 hover:bg-green-500/20';
      case 'inactive': return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20';
      case 'pending': return 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20';
      default: return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Subnets...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (subnets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subnets</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState 
            icon={<Network className="h-8 w-8 text-muted-foreground mb-2" />}
            title="No Subnets Found"
            description="There are no subnets configured in the network."
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subnets</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>CIDR</TableHead>
              <TableHead>Gateway</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Routes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subnets.map((subnet) => (
              <TableRow 
                key={subnet.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => handleRowClick(subnet)}
              >
                <TableCell className="font-medium">{subnet.name}</TableCell>
                <TableCell>{subnet.cidr}</TableCell>
                <TableCell>{subnet.gatewayIp}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusColor(subnet.status)}>
                    {subnet.status}
                  </Badge>
                </TableCell>
                <TableCell>{subnet.routesCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <SubnetDetailSheet
          subnet={selectedSubnet}
          open={isDetailOpen}
          onOpenChange={setIsDetailOpen}
        />
      </CardContent>
    </Card>
  );
};
