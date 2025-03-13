
import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TestbedOverviewTab } from "./TestbedOverviewTab";
import { TestbedVMsTab } from "./TestbedVMsTab";
import { TestbedInfrastructureTab } from "./TestbedInfrastructureTab";
import { TestbedDetailsTab } from "./TestbedDetailsTab";

interface Testbed {
  id: string;
  name: string;
  description: string;
  purpose: string;
  status: 'active' | 'provisioning' | 'failed' | 'decommissioned';
  type: 'hardware' | 'virtual' | 'hybrid';
  location: string;
  ownedBy: string;
  createdAt: string;
  expiresAt: string | null;
  cpu: number;
  memory: number;
  storage: number;
  usagePercent: number;
  vms: number;
  networks: number;
  users: number;
  deployments: number;
  whitelisted?: boolean;
  environment?: 'Openshift' | 'Vanilla' | 'Rancher' | 'Anthos' | 'Charmed';
  environmentVersion?: string;
  kubernetesVersion?: string;
  vCenterName?: string;
  vSphereDatacenter?: string;
  vSphereCluster?: string;
  vSphereDatastore?: string;
  vSphereNetwork?: string;
  logsDirectory?: string;
  externalDashboardUrl?: string;
  virtualMachines?: VirtualMachine[];
  kernel?: string;
  os?: string;
}

interface VirtualMachine {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'suspended';
  cpu: number;
  memory: number;
  storage: number;
  ip?: string;
  os?: string;
}

interface TestbedTabsProps {
  testbed: Testbed;
  handleOpenExternalDashboard: () => void;
  handleOpenLogs: () => void;
  handleDownloadKubeconfig: () => void;
  handleCopySshKey: () => void;
  handleCopyCredentials: () => void;
  showPassword: boolean;
  handleTogglePassword: () => void;
  setConnectDialogOpen: (open: boolean) => void;
}

export const TestbedTabs: React.FC<TestbedTabsProps> = ({
  testbed,
  handleOpenExternalDashboard,
  handleOpenLogs,
  handleDownloadKubeconfig,
  handleCopySshKey,
  handleCopyCredentials,
  showPassword,
  handleTogglePassword,
  setConnectDialogOpen
}) => {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <div className="flex justify-between items-center">
        <TabsList className="w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="vms">Virtual Machines</TabsTrigger>
          <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
          <TabsTrigger value="details">Additional Details</TabsTrigger>
        </TabsList>
        <Button 
          variant="default" 
          size="sm" 
          onClick={handleOpenExternalDashboard}
        >
          Dashboard
        </Button>
      </div>

      <TabsContent value="overview" className="space-y-4">
        <TestbedOverviewTab 
          testbed={testbed}
          handleCopySshKey={handleCopySshKey}
          handleCopyCredentials={handleCopyCredentials}
          showPassword={showPassword}
          handleTogglePassword={handleTogglePassword}
          setConnectDialogOpen={setConnectDialogOpen}
        />
        <div className="flex gap-2 justify-end mt-4">
          <Button 
            variant="default" 
            size="sm" 
            onClick={handleOpenLogs}
          >
            Logs
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={handleDownloadKubeconfig}
          >
            Kubeconfig
          </Button>
        </div>
      </TabsContent>

      <TabsContent value="vms" className="space-y-4">
        <TestbedVMsTab virtualMachines={testbed.virtualMachines || []} />
      </TabsContent>

      <TabsContent value="infrastructure" className="space-y-4">
        <TestbedInfrastructureTab testbed={testbed} />
      </TabsContent>

      <TabsContent value="details" className="space-y-4">
        <TestbedDetailsTab testbed={testbed} />
      </TabsContent>
    </Tabs>
  );
};
