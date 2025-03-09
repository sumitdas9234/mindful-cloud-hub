
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CheckCircle2, 
  AlertCircle,
  Server, 
  Database,
  HardDrive,
  Layers
} from "lucide-react";

interface VCenter {
  id: string;
  name: string;
  url: string;
  status: 'healthy' | 'warning' | 'error';
  version: string;
  datacenters: number;
  clusters: number;
  hosts: number;
  vms: number;
  lastSync: string;
}

interface VCenterDetailSheetProps {
  vcenter: VCenter | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const VCenterDetailSheet: React.FC<VCenterDetailSheetProps> = ({
  vcenter,
  open,
  onOpenChange,
}) => {
  const getStatusIcon = (status: VCenter['status']) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  if (!vcenter) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-2xl flex items-center gap-2">
            <span className="font-mono">{vcenter.name}</span>
            <Badge
              variant="outline"
              className={`ml-2 capitalize ${
                vcenter.status === "healthy"
                  ? "text-green-500 border-green-500"
                  : vcenter.status === "warning"
                  ? "text-yellow-500 border-yellow-500"
                  : "text-red-500 border-red-500"
              }`}
            >
              <span
                className={`mr-1.5 h-2 w-2 rounded-full inline-block ${
                  vcenter.status === "healthy"
                    ? "bg-green-500"
                    : vcenter.status === "warning"
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
              ></span>
              {vcenter.status}
            </Badge>
          </SheetTitle>
          <SheetDescription>
            vCenter Server details and infrastructure
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 pt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Infrastructure Overview</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <HardDrive className="h-4 w-4 text-blue-500" />
                  <span className="text-muted-foreground">Datacenters</span>
                </div>
                <p className="text-2xl font-semibold">{vcenter.datacenters}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-indigo-500" />
                  <span className="text-muted-foreground">Clusters</span>
                </div>
                <p className="text-2xl font-semibold">{vcenter.clusters}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Server className="h-4 w-4 text-purple-500" />
                  <span className="text-muted-foreground">Hosts</span>
                </div>
                <p className="text-2xl font-semibold">{vcenter.hosts}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-green-500" />
                  <span className="text-muted-foreground">VMs</span>
                </div>
                <p className="text-2xl font-semibold">{vcenter.vms}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">vCenter Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">vCenter ID:</dt>
                  <dd className="font-mono">{vcenter.id}</dd>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">URL:</dt>
                  <dd className="font-mono text-sm">{vcenter.url}</dd>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Version:</dt>
                  <dd>{vcenter.version}</dd>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Status:</dt>
                  <dd className="flex items-center">
                    {getStatusIcon(vcenter.status)}
                    <span className="ml-1 capitalize">{vcenter.status}</span>
                  </dd>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Last Sync:</dt>
                  <dd>{new Date(vcenter.lastSync).toLocaleString()}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
};
