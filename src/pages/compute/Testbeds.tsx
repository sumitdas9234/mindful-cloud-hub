import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { PageHeader } from '@/components/compute/PageHeader';
import { TestbedDetailSheet } from '@/components/compute/TestbedDetailSheet';
import { TestbedOverviewTab } from '@/components/compute/testbed-tabs/TestbedOverviewTab';
import { TestbedDistributionTab } from '@/components/compute/testbed-tabs/TestbedDistributionTab';
import { TestbedListTab } from '@/components/compute/testbed-tabs/TestbedListTab';
import { Testbed, calculateStats } from '@/components/compute/testbedUtils';

// Mock data for testbeds
const mockTestbeds: Testbed[] = [
  {
    id: 'tb-1',
    name: 'Performance Lab',
    description: 'High-performance testbed for stress testing and benchmarking',
    purpose: 'Performance Testing',
    status: 'active',
    type: 'hardware',
    location: 'East Datacenter',
    ownedBy: 'Performance Team',
    createdAt: '2023-01-10T09:00:00Z',
    expiresAt: null,
    cpu: 64,
    memory: 512,
    storage: 8000,
    usagePercent: 75,
    vms: 0,
    networks: 3,
    users: 12,
    deployments: 8,
    whitelisted: true,
    environment: 'Openshift'
  },
  {
    id: 'tb-2',
    name: 'Cloud Migration Dev',
    description: 'Virtual environment for testing cloud migration strategies',
    purpose: 'Migration Testing',
    status: 'active',
    type: 'virtual',
    location: 'AWS us-east-1',
    ownedBy: 'Cloud Team',
    createdAt: '2023-03-15T11:30:00Z',
    expiresAt: '2023-12-31T23:59:59Z',
    cpu: 32,
    memory: 128,
    storage: 2000,
    usagePercent: 45,
    vms: 24,
    networks: 4,
    users: 8,
    deployments: 12,
    whitelisted: false,
    environment: 'Vanilla'
  },
  {
    id: 'tb-3',
    name: 'Security Testing Lab',
    description: 'Isolated environment for security and penetration testing',
    purpose: 'Security Testing',
    status: 'active',
    type: 'hybrid',
    location: 'Secure Zone',
    ownedBy: 'Security Team',
    createdAt: '2023-02-01T10:15:00Z',
    expiresAt: null,
    cpu: 16,
    memory: 64,
    storage: 1000,
    usagePercent: 30,
    vms: 12,
    networks: 2,
    users: 6,
    deployments: 5,
    whitelisted: true,
    environment: 'Rancher'
  },
  {
    id: 'tb-4',
    name: 'Integration Test Env',
    description: 'Environment for testing service integrations and APIs',
    purpose: 'Integration Testing',
    status: 'provisioning',
    type: 'virtual',
    location: 'Azure East US',
    ownedBy: 'DevOps Team',
    createdAt: '2023-08-01T15:45:00Z',
    expiresAt: '2024-02-01T23:59:59Z',
    cpu: 24,
    memory: 96,
    storage: 1500,
    usagePercent: 0,
    vms: 18,
    networks: 3,
    users: 15,
    deployments: 0,
    whitelisted: false,
    environment: 'Anthos'
  },
  {
    id: 'tb-5',
    name: 'Legacy System Test',
    description: 'Hardware environment for testing with legacy systems',
    purpose: 'Compatibility Testing',
    status: 'failed',
    type: 'hardware',
    location: 'West Datacenter',
    ownedBy: 'Infrastructure Team',
    createdAt: '2022-11-15T08:30:00Z',
    expiresAt: null,
    cpu: 8,
    memory: 32,
    storage: 500,
    usagePercent: 0,
    vms: 0,
    networks: 1,
    users: 4,
    deployments: 2,
    whitelisted: true,
    environment: 'Charmed'
  },
  {
    id: 'tb-6',
    name: 'End-of-Life Lab',
    description: 'Testbed scheduled for decommissioning',
    purpose: 'Archived',
    status: 'decommissioned',
    type: 'hybrid',
    location: 'South Datacenter',
    ownedBy: 'Infrastructure Team',
    createdAt: '2022-06-20T13:15:00Z',
    expiresAt: '2023-06-20T23:59:59Z',
    cpu: 16,
    memory: 64,
    storage: 1000,
    usagePercent: 0,
    vms: 0,
    networks: 2,
    users: 0,
    deployments: 0,
    whitelisted: false,
    environment: 'Vanilla'
  }
];

const TestbedsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTestbed, setSelectedTestbed] = useState<Testbed | null>(null);
  const [detailSheetOpen, setDetailSheetOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  const { data: testbeds = [], isLoading, refetch } = useQuery({
    queryKey: ['testbeds'],
    queryFn: () => Promise.resolve(mockTestbeds),
  });

  const filteredTestbeds = testbeds.filter(
    tb => tb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tb.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tb.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tb.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tb.ownedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (tb.environment && tb.environment.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const stats = calculateStats(testbeds);

  const handleRefresh = () => {
    refetch();
    toast({
      title: "Refreshing testbeds",
      description: "The testbed list has been refreshed.",
    });
  };

  const handleAddTestbed = () => {
    toast({
      title: "Add Testbed",
      description: "This would open a dialog to add a new testbed environment.",
    });
  };

  const handleTestbedAction = (action: string, testbed: Testbed) => {
    toast({
      title: `${action} Testbed`,
      description: `Action "${action}" has been triggered for testbed "${testbed.name}".`,
    });
  };

  const openTestbedDetails = (testbed: Testbed) => {
    setSelectedTestbed(testbed);
    setDetailSheetOpen(true);
  };

  return (
    <div className="container mx-auto space-y-6">
      <PageHeader 
        title="Testbed Management"
        description="Manage your testing environments and infrastructure."
        onRefresh={handleRefresh}
        onAdd={handleAddTestbed}
        addButtonText="Add Testbed"
      />

      <Tabs 
        defaultValue="overview" 
        className="w-full"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <TestbedOverviewTab stats={stats} />
        </TabsContent>

        <TabsContent value="distribution">
          <TestbedDistributionTab stats={stats} />
        </TabsContent>

        <TabsContent value="list">
          <TestbedListTab 
            testbeds={testbeds}
            filteredTestbeds={filteredTestbeds}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isLoading={isLoading}
            onTestbedAction={handleTestbedAction}
            onViewDetails={openTestbedDetails}
          />
        </TabsContent>
      </Tabs>

      <TestbedDetailSheet
        testbed={selectedTestbed}
        open={detailSheetOpen}
        onOpenChange={setDetailSheetOpen}
      />
    </div>
  );
};

export default TestbedsPage;
