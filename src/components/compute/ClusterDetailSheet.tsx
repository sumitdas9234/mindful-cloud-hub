
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
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CheckCircle2,
  AlertCircle,
  XCircle,
  Cloud,
  CpuIcon,
  Database,
  HardDrive,
  Shield,
} from "lucide-react";

interface KubernetesCluster {
  id: string;
  name: string;
  version: string;
  status: "running" | "provisioning" | "degraded" | "stopped";
  provider: "on-premise" | "aws" | "azure" | "gcp";
  location: string;
  nodeCount: number;
  portworxInstalled: boolean;
  portworxVersion?: string;
  needsUpgrade: boolean;
  certificates: number;
  createdAt: string;
  lastUpdatedAt: string;
  // Optional properties for detail view
  cpuUsage?: number;
  memoryUsage?: number;
  storageUsage?: number;
  namespaceCount?: number;
  podCount?: number;
  deploymentCount?: number;
  serviceCount?: number;
}

interface ClusterDetailSheetProps {
  cluster: KubernetesCluster | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ClusterDetailSheet: React.FC<ClusterDetailSheetProps> = ({
  cluster,
  open,
  onOpenChange,
}) => {
  const getStatusIcon = (status: KubernetesCluster["status"]) => {
    switch (status) {
      case "running":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "provisioning":
        return <Cloud className="h-4 w-4 text-blue-500" />;
      case "degraded":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "stopped":
        return <XCircle className="h-4 w-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const getResourceColor = (usage: number) => {
    if (usage >= 80) return "text-red-500";
    if (usage >= 60) return "text-yellow-500";
    return "text-green-500";
  };

  const getProgressColor = (usage: number) => {
    if (usage >= 80) return "bg-red-500";
    if (usage >= 60) return "bg-yellow-500";
    return "bg-green-500";
  };

  // Default values for optional metrics
  const cpuUsage = cluster?.cpuUsage ?? 35;
  const memoryUsage = cluster?.memoryUsage ?? 42;
  const storageUsage = cluster?.storageUsage ?? 28;

  if (!cluster) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-2xl flex items-center gap-2">
            <span className="font-mono">{cluster.name}</span>
            <Badge
              variant="outline"
              className={`ml-2 capitalize ${
                cluster.status === "running"
                  ? "text-green-500 border-green-500"
                  : cluster.status === "degraded"
                  ? "text-yellow-500 border-yellow-500"
                  : cluster.status === "provisioning"
                  ? "text-blue-500 border-blue-500"
                  : "text-gray-500 border-gray-500"
              }`}
            >
              <span
                className={`mr-1.5 h-2 w-2 rounded-full inline-block ${
                  cluster.status === "running"
                    ? "bg-green-500"
                    : cluster.status === "degraded"
                    ? "bg-yellow-500"
                    : cluster.status === "provisioning"
                    ? "bg-blue-500"
                    : "bg-gray-500"
                }`}
              ></span>
              {cluster.status}
            </Badge>
          </SheetTitle>
          <SheetDescription>
            Kubernetes cluster details and performance metrics
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 pt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Resource Usage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <CpuIcon className="h-4 w-4 text-blue-500" />
                    <span>CPU</span>
                  </div>
                  <span className="font-mono text-sm">{cpuUsage}%</span>
                </div>
                <Progress value={cpuUsage} className={getProgressColor(cpuUsage)} />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <HardDrive className="h-4 w-4 text-indigo-500" />
                    <span>Memory</span>
                  </div>
                  <span className="font-mono text-sm">{memoryUsage}%</span>
                </div>
                <Progress value={memoryUsage} className={getProgressColor(memoryUsage)} />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-purple-500" />
                    <span>Storage</span>
                  </div>
                  <span className="font-mono text-sm">{storageUsage}%</span>
                </div>
                <Progress value={storageUsage} className={getProgressColor(storageUsage)} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Cluster Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Cluster ID:</dt>
                  <dd className="font-mono">{cluster.id}</dd>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Version:</dt>
                  <dd>v{cluster.version}</dd>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Provider:</dt>
                  <dd className="capitalize">{cluster.provider}</dd>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Location:</dt>
                  <dd>{cluster.location}</dd>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Nodes:</dt>
                  <dd>{cluster.nodeCount}</dd>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Certificates:</dt>
                  <dd className="flex items-center">
                    <Shield className="h-3.5 w-3.5 text-blue-500 mr-1.5" />
                    <span>{cluster.certificates}</span>
                  </dd>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Portworx:</dt>
                  <dd>
                    {cluster.portworxInstalled ? (
                      <span className="flex items-center">
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500 mr-1.5" />
                        {cluster.portworxVersion || "Installed"}
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <XCircle className="h-3.5 w-3.5 text-red-500 mr-1.5" />
                        Not installed
                      </span>
                    )}
                  </dd>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Upgrade Status:</dt>
                  <dd>
                    {cluster.needsUpgrade ? (
                      <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">
                        Needs upgrade
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-green-500/10 text-green-500">
                        Up to date
                      </Badge>
                    )}
                  </dd>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Created At:</dt>
                  <dd>{new Date(cluster.createdAt).toLocaleString()}</dd>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Last Updated:</dt>
                  <dd>{new Date(cluster.lastUpdatedAt).toLocaleString()}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
};
