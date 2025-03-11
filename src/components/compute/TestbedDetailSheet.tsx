
import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Server, 
  CpuIcon, 
  HardDrive, 
  Network, 
  Database,
  Clock,
  User,
  FileText,
  ExternalLink,
  Copy,
  Check
} from "lucide-react";

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
  // Additional fields for details
  vCenterName?: string;
  vSphereDatacenter?: string;
  vSphereCluster?: string;
  vSphereDatastore?: string;
  vSphereNetwork?: string;
  logsDirectory?: string;
  externalDashboardUrl?: string;
  virtualMachines?: VirtualMachine[];
}

interface VirtualMachine {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'suspended';
  cpu: number;
  memory: number; // in GB
  storage: number; // in GB
  ip?: string;
  os?: string;
}

// Mock data for VMs - in a real app this would come from the API
const mockVMs: VirtualMachine[] = [
  {
    id: 'vm-001',
    name: 'master-node-1',
    status: 'running',
    cpu: 4,
    memory: 16,
    storage: 120,
    ip: '10.0.0.1',
    os: 'Ubuntu 20.04 LTS'
  },
  {
    id: 'vm-002',
    name: 'worker-node-1',
    status: 'running',
    cpu: 8,
    memory: 32,
    storage: 250,
    ip: '10.0.0.2',
    os: 'Ubuntu 20.04 LTS'
  },
  {
    id: 'vm-003',
    name: 'worker-node-2',
    status: 'running',
    cpu: 8,
    memory: 32,
    storage: 250,
    ip: '10.0.0.3',
    os: 'Ubuntu 20.04 LTS'
  }
];

interface TestbedDetailSheetProps {
  testbed: Testbed | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TestbedDetailSheet: React.FC<TestbedDetailSheetProps> = ({ 
  testbed, 
  open, 
  onOpenChange 
}) => {
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);
  const [copiedCommand, setCopiedCommand] = useState(false);

  if (!testbed) return null;

  // Generate a mock kubectl command
  const kubeCtlCommand = `kubectl config use-context ${testbed.name.toLowerCase().replace(/\s+/g, '-')}-context\nkubectl get pods -n default`;

  // Mock values for vSphere infrastructure - in a real app these would come from the testbed
  const vCenterName = testbed.vCenterName || "vcenter-01.datacenter.local";
  const vSphereDatacenter = testbed.vSphereDatacenter || "Datacenter-East";
  const vSphereCluster = testbed.vSphereCluster || "Cluster-01";
  const vSphereDatastore = testbed.vSphereDatastore || "SAN-Volume-01";
  const vSphereNetwork = testbed.vSphereNetwork || "VLAN-Production-10";
  const logsDirectory = testbed.logsDirectory || "/var/log/testbeds/" + testbed.id;
  const externalDashboardUrl = testbed.externalDashboardUrl || "https://dashboard.example.com/testbeds/" + testbed.id;

  // In a real application, VMs would be loaded from an API
  const virtualMachines = testbed.virtualMachines || mockVMs;

  const getStatusColor = (status: Testbed['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500 text-green-500';
      case 'provisioning': return 'bg-blue-500 text-blue-500';
      case 'failed': return 'bg-red-500 text-red-500';
      case 'decommissioned': return 'bg-gray-500 text-gray-500';
      default: return 'bg-gray-500 text-gray-500';
    }
  };

  const getVMStatusColor = (status: VirtualMachine['status']) => {
    switch (status) {
      case 'running': return 'bg-green-500 text-green-500';
      case 'stopped': return 'bg-red-500 text-red-500';
      case 'suspended': return 'bg-yellow-500 text-yellow-500';
      default: return 'bg-gray-500 text-gray-500';
    }
  };

  const handleCopyCommand = () => {
    navigator.clipboard.writeText(kubeCtlCommand);
    setCopiedCommand(true);
    setTimeout(() => setCopiedCommand(false), 2000);
  };

  const handleOpenExternalDashboard = () => {
    window.open(externalDashboardUrl, '_blank');
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl overflow-y-auto">
          <SheetHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <SheetTitle className="text-2xl flex items-center gap-2">
                {testbed.name}
                <Badge variant="outline" className={`ml-2 capitalize border-${getStatusColor(testbed.status)}`}>
                  <span className={`mr-1.5 h-2 w-2 rounded-full inline-block ${getStatusColor(testbed.status)}`}></span>
                  {testbed.status}
                </Badge>
              </SheetTitle>
              {/* Moved buttons down to avoid overlap with close button */}
            </div>
            <SheetDescription>{testbed.description}</SheetDescription>
            {/* Added buttons here after the title and description */}
            <div className="flex gap-2 mt-2">
              <Button variant="outline" size="sm" onClick={() => setConnectDialogOpen(true)}>Connect</Button>
              <Button variant="outline" size="sm" onClick={handleOpenExternalDashboard}>
                <ExternalLink className="h-4 w-4 mr-1" />
                Dashboard
              </Button>
            </div>
          </SheetHeader>

          <Tabs defaultValue="overview" className="mt-6">
            <TabsList className="mb-4 w-full overflow-x-auto flex-nowrap">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="vms">Virtual Machines</TabsTrigger>
              <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
              <TabsTrigger value="details">Additional Details</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="py-2">
                    <CardTitle className="text-sm font-medium">Purpose</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-3 pt-0">
                    <p className="text-sm">{testbed.purpose}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="py-2">
                    <CardTitle className="text-sm font-medium">Status</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-3 pt-0">
                    <div className="flex items-center gap-2">
                      <div className={`h-2.5 w-2.5 rounded-full ${getStatusColor(testbed.status)}`}></div>
                      <span className="capitalize font-medium">{testbed.status}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {testbed.status === 'active' ? 'Fully operational' : 
                       testbed.status === 'provisioning' ? 'Setting up resources' :
                       testbed.status === 'failed' ? 'There was an error' : 'No longer in use'}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="py-2">
                    <CardTitle className="text-sm font-medium">Environment</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-3 pt-0">
                    <div className="flex items-center">
                      <Badge variant="outline" className={`
                        ${testbed.environment === 'Openshift' ? 'text-red-500 border-red-500' :
                          testbed.environment === 'Vanilla' ? 'text-blue-500 border-blue-500' :
                          testbed.environment === 'Rancher' ? 'text-teal-500 border-teal-500' :
                          testbed.environment === 'Anthos' ? 'text-purple-500 border-purple-500' :
                          testbed.environment === 'Charmed' ? 'text-orange-500 border-orange-500' :
                          'text-gray-500 border-gray-500'}
                      `}>
                        {testbed.environment || 'Not specified'}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Type: {testbed.type}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="py-2">
                    <CardTitle className="text-sm font-medium">Owner</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-3 pt-0">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{testbed.ownedBy}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Created: {new Date(testbed.createdAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="py-2">
                    <CardTitle className="text-sm font-medium">Expiry</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-3 pt-0">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{testbed.expiresAt ? new Date(testbed.expiresAt).toLocaleDateString() : 'No expiry'}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {testbed.whitelisted ? 'Whitelisted - no automatic removal' : 'Will be removed after expiry'}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="py-2">
                    <CardTitle className="text-sm font-medium">Resources</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-3 pt-0">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <div className="flex items-center gap-1">
                          <CpuIcon className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">CPU:</span>
                        </div>
                        <div className="font-medium">{testbed.cpu} cores</div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <HardDrive className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">Memory:</span>
                        </div>
                        <div className="font-medium">{testbed.memory} GB</div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <Database className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">Storage:</span>
                        </div>
                        <div className="font-medium">{testbed.storage} GB</div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <Network className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">Networks:</span>
                        </div>
                        <div className="font-medium">{testbed.networks}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="py-2">
                  <CardTitle className="text-sm font-medium">Logs</CardTitle>
                </CardHeader>
                <CardContent className="pb-3 pt-0">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <code className="text-sm font-mono bg-secondary rounded px-1 py-0.5">
                      {logsDirectory}
                    </code>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="vms" className="space-y-4">
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm font-medium">Virtual Machines ({virtualMachines.length})</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="rounded-md border overflow-auto max-h-[500px]">
                    <Table>
                      <TableHeader className="bg-secondary/50 sticky top-0">
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>CPU</TableHead>
                          <TableHead>Memory</TableHead>
                          <TableHead>Storage</TableHead>
                          <TableHead>IP</TableHead>
                          <TableHead>OS</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {virtualMachines.map((vm) => (
                          <TableRow key={vm.id}>
                            <TableCell className="font-medium">{vm.name}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className={`h-2 w-2 rounded-full ${getVMStatusColor(vm.status)}`}></div>
                                <span className="capitalize">{vm.status}</span>
                              </div>
                            </TableCell>
                            <TableCell>{vm.cpu} cores</TableCell>
                            <TableCell>{vm.memory} GB</TableCell>
                            <TableCell>{vm.storage} GB</TableCell>
                            <TableCell>{vm.ip || 'N/A'}</TableCell>
                            <TableCell>{vm.os || 'N/A'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="infrastructure" className="space-y-4">
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm font-medium">vSphere Infrastructure</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <dl className="space-y-2">
                    <div className="flex justify-between items-center py-1">
                      <dt className="text-muted-foreground flex items-center gap-1">
                        <Server className="h-4 w-4" />
                        vCenter:
                      </dt>
                      <dd className="font-medium">{vCenterName}</dd>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center py-1">
                      <dt className="text-muted-foreground">Datacenter:</dt>
                      <dd className="font-medium">{vSphereDatacenter}</dd>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center py-1">
                      <dt className="text-muted-foreground">Cluster:</dt>
                      <dd className="font-medium">{vSphereCluster}</dd>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center py-1">
                      <dt className="text-muted-foreground">Datastore:</dt>
                      <dd className="font-medium">{vSphereDatastore}</dd>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center py-1">
                      <dt className="text-muted-foreground">Network:</dt>
                      <dd className="font-medium">{vSphereNetwork}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm font-medium">Testbed Details</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <dl className="space-y-2">
                    <div className="flex justify-between items-center py-1">
                      <dt className="text-muted-foreground">ID:</dt>
                      <dd className="font-mono text-sm">{testbed.id}</dd>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center py-1">
                      <dt className="text-muted-foreground">Type:</dt>
                      <dd className="capitalize">{testbed.type}</dd>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center py-1">
                      <dt className="text-muted-foreground">Location:</dt>
                      <dd>{testbed.location}</dd>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center py-1">
                      <dt className="text-muted-foreground">Created At:</dt>
                      <dd>{new Date(testbed.createdAt).toLocaleString()}</dd>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center py-1">
                      <dt className="text-muted-foreground">Expires At:</dt>
                      <dd>{testbed.expiresAt ? new Date(testbed.expiresAt).toLocaleString() : 'Never'}</dd>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center py-1">
                      <dt className="text-muted-foreground">Whitelisted:</dt>
                      <dd>{testbed.whitelisted ? 'Yes' : 'No'}</dd>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center py-1">
                      <dt className="text-muted-foreground">Deployments:</dt>
                      <dd>{testbed.deployments}</dd>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center py-1">
                      <dt className="text-muted-foreground">Users:</dt>
                      <dd>{testbed.users}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>

      <Dialog open={connectDialogOpen} onOpenChange={setConnectDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Connect to {testbed.name}</DialogTitle>
            <DialogDescription>
              Use the following kubectl command to connect to this testbed
            </DialogDescription>
          </DialogHeader>
          <div className="bg-secondary rounded-md p-4 mt-4 overflow-x-auto">
            <div className="flex justify-between items-start">
              <pre className="text-sm font-mono whitespace-pre overflow-x-auto max-w-[300px] break-all">
                {kubeCtlCommand}
              </pre>
              <Button variant="ghost" size="icon" onClick={handleCopyCommand} className="ml-2 self-start flex-shrink-0">
                {copiedCommand ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
