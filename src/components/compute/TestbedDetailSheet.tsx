
import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Cpu, 
  HardDrive, 
  MemoryStick, 
  Server,
  Database,
  Network,
  User,
  Calendar,
  FileText,
  ExternalLink,
  Terminal,
  Copy,
  Globe
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VirtualMachine {
  id: string;
  name: string;
  status: "running" | "stopped" | "error";
  cpu: number;
  memory: number;
  disks: Disk[];
}

interface Disk {
  id: string;
  name: string;
  sizeGB: number;
  type: "ssd" | "hdd";
}

interface Testbed {
  id: string;
  name: string;
  description: string;
  purpose: string;
  status: "active" | "provisioning" | "failed" | "decommissioned";
  type: "hardware" | "virtual" | "hybrid";
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
  virtualMachines?: VirtualMachine[];
  vcenterName?: string;
  vsphereDatacenter?: string;
  vsphereCluster?: string;
  vsphereDatastore?: string;
  vsphereNetwork?: string;
  logsDirectory?: string;
  kubeConfig?: string;
  externalDashboardUrl?: string;
  whitelisted?: boolean;
  environment?: string;
}

interface TestbedDetailSheetProps {
  testbed: Testbed | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TestbedDetailSheet: React.FC<TestbedDetailSheetProps> = ({
  testbed,
  open,
  onOpenChange,
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();

  const getStatusIcon = (status: Testbed["status"]) => {
    switch (status) {
      case "active":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "provisioning":
        return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "decommissioned":
        return <XCircle className="h-4 w-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const getUsageColor = (usage: number) => {
    if (usage >= 80) return "text-red-500";
    if (usage >= 60) return "text-yellow-500";
    return "text-green-500";
  };

  const getProgressColor = (usage: number) => {
    if (usage >= 80) return "bg-red-500";
    if (usage >= 60) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getVmStatusColor = (status: VirtualMachine["status"]) => {
    switch (status) {
      case "running": return "text-green-500 border-green-500";
      case "stopped": return "text-yellow-500 border-yellow-500";
      case "error": return "text-red-500 border-red-500";
      default: return "text-gray-500 border-gray-500";
    }
  };

  const getVmStatusBg = (status: VirtualMachine["status"]) => {
    switch (status) {
      case "running": return "bg-green-500";
      case "stopped": return "bg-yellow-500";
      case "error": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: message,
    });
  };

  // Mock data for virtual machines
  const mockVirtualMachines: VirtualMachine[] = [
    {
      id: "vm-1",
      name: "worker-node-1",
      status: "running",
      cpu: 4,
      memory: 16,
      disks: [
        { id: "disk-1", name: "os-disk", sizeGB: 120, type: "ssd" },
        { id: "disk-2", name: "data-disk", sizeGB: 500, type: "hdd" }
      ]
    },
    {
      id: "vm-2",
      name: "worker-node-2",
      status: "running",
      cpu: 4,
      memory: 16,
      disks: [
        { id: "disk-3", name: "os-disk", sizeGB: 120, type: "ssd" },
        { id: "disk-4", name: "data-disk", sizeGB: 500, type: "hdd" }
      ]
    },
    {
      id: "vm-3",
      name: "control-plane",
      status: "running",
      cpu: 8,
      memory: 32,
      disks: [
        { id: "disk-5", name: "os-disk", sizeGB: 240, type: "ssd" },
        { id: "disk-6", name: "etcd-disk", sizeGB: 100, type: "ssd" }
      ]
    }
  ];

  // Enhance the testbed with mock data
  const enhancedTestbed = testbed ? {
    ...testbed,
    virtualMachines: mockVirtualMachines,
    vcenterName: "vcenter-east-01.example.com",
    vsphereDatacenter: "DC-East",
    vsphereCluster: "Cluster-Production",
    vsphereDatastore: "SAN-East-SSD-01",
    vsphereNetwork: "VLAN-200-Dev",
    logsDirectory: "/var/log/testbeds/tb-" + testbed.id,
    kubeConfig: "kubectl config use-context testbed-" + testbed.id,
    externalDashboardUrl: "https://dashboard.example.com/testbeds/" + testbed.id
  } : null;

  if (!enhancedTestbed) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[700px] overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-2xl flex items-center gap-2">
            <span className="font-medium">{enhancedTestbed.name}</span>
            <Badge
              variant="outline"
              className={`ml-2 capitalize ${
                enhancedTestbed.status === "active"
                  ? "text-green-500 border-green-500"
                  : enhancedTestbed.status === "provisioning"
                  ? "text-blue-500 border-blue-500"
                  : enhancedTestbed.status === "failed"
                  ? "text-red-500 border-red-500"
                  : "text-gray-500 border-gray-500"
              }`}
            >
              <span
                className={`mr-1.5 h-2 w-2 rounded-full inline-block ${
                  enhancedTestbed.status === "active"
                    ? "bg-green-500"
                    : enhancedTestbed.status === "provisioning"
                    ? "bg-blue-500"
                    : enhancedTestbed.status === "failed"
                    ? "bg-red-500"
                    : "bg-gray-500"
                }`}
              ></span>
              {enhancedTestbed.status}
            </Badge>
          </SheetTitle>
          <SheetDescription>
            {enhancedTestbed.description}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary">{enhancedTestbed.type}</Badge>
          <Badge variant="secondary">{enhancedTestbed.purpose}</Badge>
          {enhancedTestbed.environment && (
            <Badge variant="secondary">{enhancedTestbed.environment}</Badge>
          )}
          {enhancedTestbed.whitelisted && (
            <Badge variant="outline" className="border-green-500 text-green-500">Whitelisted</Badge>
          )}
        </div>

        <div className="flex justify-between mb-4">
          <Button
            variant="outline" 
            size="sm" 
            className="text-xs"
            onClick={() => window.open(enhancedTestbed.externalDashboardUrl, '_blank')}
          >
            <ExternalLink className="mr-1 h-3 w-3" />
            Dashboard
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs">
                <Terminal className="mr-1 h-3 w-3" />
                Connect
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Connect to {enhancedTestbed.name}</DialogTitle>
                <DialogDescription>
                  Use the following command to connect to this testbed:
                </DialogDescription>
              </DialogHeader>
              <div className="bg-slate-950 text-slate-100 p-3 rounded-md relative">
                <pre className="font-mono text-sm overflow-x-auto">
                  {enhancedTestbed.kubeConfig}
                </pre>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="absolute top-2 right-2 h-6 w-6 text-slate-100 hover:text-white hover:bg-slate-800"
                  onClick={() => copyToClipboard(enhancedTestbed.kubeConfig || "", "Command copied to clipboard")}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs"
            onClick={() => copyToClipboard(enhancedTestbed.logsDirectory || "", "Logs directory copied to clipboard")}
          >
            <FileText className="mr-1 h-3 w-3" />
            Logs
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="vms">Virtual Machines</TabsTrigger>
            <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4 space-y-4">
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-base">Resource Allocation</CardTitle>
              </CardHeader>
              <CardContent className="py-0 space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Cpu className="h-4 w-4 text-blue-500" />
                      <span>CPU Cores</span>
                    </div>
                    <span className="font-mono text-sm">{enhancedTestbed.cpu}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <MemoryStick className="h-4 w-4 text-indigo-500" />
                      <span>Memory (GB)</span>
                    </div>
                    <span className="font-mono text-sm">{enhancedTestbed.memory}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <HardDrive className="h-4 w-4 text-purple-500" />
                      <span>Storage (GB)</span>
                    </div>
                    <span className="font-mono text-sm">{enhancedTestbed.storage}</span>
                  </div>
                </div>

                <div className="space-y-1 pt-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Overall Usage</span>
                    <span className={`font-mono text-sm ${getUsageColor(enhancedTestbed.usagePercent)}`}>
                      {enhancedTestbed.usagePercent}%
                    </span>
                  </div>
                  <Progress value={enhancedTestbed.usagePercent} className={getProgressColor(enhancedTestbed.usagePercent)} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-base">Testbed Details</CardTitle>
              </CardHeader>
              <CardContent className="py-0">
                <dl className="grid grid-cols-2 gap-1 text-sm">
                  <dt className="text-muted-foreground">ID:</dt>
                  <dd className="font-mono">{enhancedTestbed.id}</dd>
                  
                  <dt className="text-muted-foreground">Type:</dt>
                  <dd className="capitalize">{enhancedTestbed.type}</dd>
                  
                  <dt className="text-muted-foreground">Location:</dt>
                  <dd>{enhancedTestbed.location}</dd>
                  
                  <dt className="text-muted-foreground">Owned By:</dt>
                  <dd>{enhancedTestbed.ownedBy}</dd>
                  
                  <dt className="text-muted-foreground">Virtual Machines:</dt>
                  <dd>{enhancedTestbed.vms}</dd>
                  
                  <dt className="text-muted-foreground">Networks:</dt>
                  <dd>{enhancedTestbed.networks}</dd>
                  
                  <dt className="text-muted-foreground">Users:</dt>
                  <dd>{enhancedTestbed.users}</dd>
                  
                  <dt className="text-muted-foreground">Deployments:</dt>
                  <dd>{enhancedTestbed.deployments}</dd>
                  
                  <dt className="text-muted-foreground">Created:</dt>
                  <dd>{new Date(enhancedTestbed.createdAt).toLocaleString()}</dd>
                  
                  {enhancedTestbed.expiresAt && (
                    <>
                      <dt className="text-muted-foreground">Expires:</dt>
                      <dd>{new Date(enhancedTestbed.expiresAt).toLocaleString()}</dd>
                    </>
                  )}
                </dl>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vms" className="mt-4">
            <div className="space-y-4">
              {enhancedTestbed.virtualMachines?.map((vm) => (
                <Card key={vm.id} className="overflow-hidden">
                  <CardHeader className="py-3 flex flex-row items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Server className="h-4 w-4 text-blue-500" />
                      <CardTitle className="text-base">{vm.name}</CardTitle>
                    </div>
                    <Badge
                      variant="outline"
                      className={getVmStatusColor(vm.status)}
                    >
                      <span
                        className={`mr-1.5 h-2 w-2 rounded-full inline-block ${getVmStatusBg(vm.status)}`}
                      ></span>
                      {vm.status}
                    </Badge>
                  </CardHeader>
                  <CardContent className="py-0 pb-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="flex items-center text-sm mb-1">
                          <Cpu className="h-3 w-3 mr-1 text-blue-500" />
                          <span>CPU Cores: </span>
                          <span className="font-mono ml-1">{vm.cpu}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <MemoryStick className="h-3 w-3 mr-1 text-indigo-500" />
                          <span>Memory (GB): </span>
                          <span className="font-mono ml-1">{vm.memory}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Disks:</p>
                        <div className="space-y-1">
                          {vm.disks.map((disk) => (
                            <div key={disk.id} className="flex items-center text-xs">
                              <HardDrive className="h-3 w-3 mr-1 text-purple-500" />
                              <span>{disk.name}:</span>
                              <span className="font-mono ml-1">{disk.sizeGB} GB ({disk.type.toUpperCase()})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="infrastructure" className="mt-4">
            <Card>
              <CardHeader className="py-3">
                <CardTitle className="text-base">vSphere Infrastructure</CardTitle>
              </CardHeader>
              <CardContent className="py-0">
                <dl className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex items-start py-1">
                    <dt className="w-1/3 flex items-center text-muted-foreground">
                      <Database className="h-3 w-3 mr-2" />
                      vCenter
                    </dt>
                    <dd className="w-2/3">{enhancedTestbed.vcenterName}</dd>
                  </div>
                  <Separator />
                  
                  <div className="flex items-start py-1">
                    <dt className="w-1/3 flex items-center text-muted-foreground">
                      <Globe className="h-3 w-3 mr-2" />
                      Datacenter
                    </dt>
                    <dd className="w-2/3">{enhancedTestbed.vsphereDatacenter}</dd>
                  </div>
                  <Separator />
                  
                  <div className="flex items-start py-1">
                    <dt className="w-1/3 flex items-center text-muted-foreground">
                      <Server className="h-3 w-3 mr-2" />
                      Cluster
                    </dt>
                    <dd className="w-2/3">{enhancedTestbed.vsphereCluster}</dd>
                  </div>
                  <Separator />
                  
                  <div className="flex items-start py-1">
                    <dt className="w-1/3 flex items-center text-muted-foreground">
                      <HardDrive className="h-3 w-3 mr-2" />
                      Datastore
                    </dt>
                    <dd className="w-2/3">{enhancedTestbed.vsphereDatastore}</dd>
                  </div>
                  <Separator />
                  
                  <div className="flex items-start py-1">
                    <dt className="w-1/3 flex items-center text-muted-foreground">
                      <Network className="h-3 w-3 mr-2" />
                      Network
                    </dt>
                    <dd className="w-2/3">{enhancedTestbed.vsphereNetwork}</dd>
                  </div>
                  <Separator />
                  
                  <div className="flex items-start py-1">
                    <dt className="w-1/3 flex items-center text-muted-foreground">
                      <User className="h-3 w-3 mr-2" />
                      Owner
                    </dt>
                    <dd className="w-2/3">{enhancedTestbed.ownedBy}</dd>
                  </div>
                  <Separator />
                  
                  <div className="flex items-start py-1">
                    <dt className="w-1/3 flex items-center text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-2" />
                      Created
                    </dt>
                    <dd className="w-2/3">{new Date(enhancedTestbed.createdAt).toLocaleString()}</dd>
                  </div>
                  
                  {enhancedTestbed.expiresAt && (
                    <>
                      <Separator />
                      <div className="flex items-start py-1">
                        <dt className="w-1/3 flex items-center text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-2" />
                          Expires
                        </dt>
                        <dd className="w-2/3">{new Date(enhancedTestbed.expiresAt).toLocaleString()}</dd>
                      </div>
                    </>
                  )}
                </dl>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};
