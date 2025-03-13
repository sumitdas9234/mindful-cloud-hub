
import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { TestbedTabs } from "./testbed-detail/TestbedTabs";
import { ConnectDialog } from "./testbed-detail/ConnectDialog";

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

interface TestbedDetailSheetProps {
  testbed: Testbed | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TestbedDetailSheet: React.FC<TestbedDetailSheetProps> = ({ 
  testbed, 
  open, 
  onOpenChange 
}) => {
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);
  const [copiedCommand, setCopiedCommand] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (!testbed) return null;

  // Add mock VM data if none exists
  const testbedWithVMs = {
    ...testbed,
    virtualMachines: testbed.virtualMachines && testbed.virtualMachines.length > 0 
      ? testbed.virtualMachines 
      : [
          {
            id: `vm-${testbed.id}-1`,
            name: `${testbed.name}-worker-1`,
            status: 'running',
            cpu: 4,
            memory: 16,
            storage: 100,
            ip: '10.0.0.10'
          },
          {
            id: `vm-${testbed.id}-2`,
            name: `${testbed.name}-master-1`,
            status: 'running',
            cpu: 8,
            memory: 32,
            storage: 200,
            ip: '10.0.0.11'
          },
          {
            id: `vm-${testbed.id}-3`,
            name: `${testbed.name}-storage-1`,
            status: 'stopped',
            cpu: 4,
            memory: 16,
            storage: 500,
            ip: '10.0.0.12'
          }
        ]
  };

  const kubeCtlCommand = `kubectl config use-context ${testbed.name.toLowerCase().replace(/\s+/g, '-')}-context\nkubectl get pods -n default`;
  const logsDirectory = testbed.logsDirectory || "/var/log/testbeds/" + testbed.id;
  const externalDashboardUrl = testbed.externalDashboardUrl || "https://dashboard.example.com/testbeds/" + testbed.id;

  const getStatusColor = (status: Testbed['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500 text-green-500';
      case 'provisioning': return 'bg-blue-500 text-blue-500';
      case 'failed': return 'bg-red-500 text-red-500';
      case 'decommissioned': return 'bg-gray-500 text-gray-500';
      default: return 'bg-gray-500 text-gray-500';
    }
  };

  const handleCopyCommand = () => {
    navigator.clipboard.writeText(kubeCtlCommand);
    setCopiedCommand(true);
    setTimeout(() => setCopiedCommand(false), 2000);
  };

  const handleCopySshKey = () => {
    const mockSshKey = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC6vSUlP66dFJH+/xj9VRkO5z9I9dP...";
    navigator.clipboard.writeText(mockSshKey);
    setCopiedCommand(true);
    setTimeout(() => setCopiedCommand(false), 2000);
  };

  const handleCopyCredentials = () => {
    const mockSshUsername = "testbed-admin";
    const mockSshPassword = "Str0ngP@ssw0rd!";
    navigator.clipboard.writeText(`Username: ${mockSshUsername}\nPassword: ${mockSshPassword}`);
    setCopiedCommand(true);
    setTimeout(() => setCopiedCommand(false), 2000);
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleOpenExternalDashboard = () => {
    window.open(externalDashboardUrl, '_blank');
  };

  const handleOpenLogs = () => {
    alert(`Accessing logs at: ${logsDirectory}`);
  };

  const handleDownloadKubeconfig = () => {
    const element = document.createElement("a");
    const file = new Blob([kubeCtlCommand], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${testbed.name.toLowerCase().replace(/\s+/g, '-')}-kubeconfig.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-[40%] overflow-y-auto">
          <SheetHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <SheetTitle className="text-2xl flex items-center gap-2">
                {testbed.name}
                <Badge variant="outline" className={`ml-2 capitalize border-${getStatusColor(testbed.status)}`}>
                  <span className={`mr-1.5 h-2 w-2 rounded-full inline-block ${getStatusColor(testbed.status)}`}></span>
                  {testbed.status}
                </Badge>
              </SheetTitle>
            </div>
            <SheetDescription>{testbed.description}</SheetDescription>
          </SheetHeader>

          <div className="flex items-center justify-between mt-6 mb-4">
            <TestbedTabs 
              testbed={testbedWithVMs}
              handleOpenExternalDashboard={handleOpenExternalDashboard}
              handleOpenLogs={handleOpenLogs}
              handleDownloadKubeconfig={handleDownloadKubeconfig}
              handleCopySshKey={handleCopySshKey}
              handleCopyCredentials={handleCopyCredentials}
              showPassword={showPassword}
              handleTogglePassword={handleTogglePassword}
              setConnectDialogOpen={setConnectDialogOpen}
            />
          </div>
        </SheetContent>
      </Sheet>

      <ConnectDialog
        open={connectDialogOpen}
        onOpenChange={setConnectDialogOpen}
        testbedName={testbed.name}
        kubeCtlCommand={kubeCtlCommand}
        copiedCommand={copiedCommand}
        handleCopyCommand={handleCopyCommand}
      />
    </>
  );
};

export { TestbedDetailSheet };
