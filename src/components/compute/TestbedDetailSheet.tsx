
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
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Cpu, 
  HardDrive, 
  MemoryStick 
} from "lucide-react";

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

  if (!testbed) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-2xl flex items-center gap-2">
            <span className="font-medium">{testbed.name}</span>
            <Badge
              variant="outline"
              className={`ml-2 capitalize ${
                testbed.status === "active"
                  ? "text-green-500 border-green-500"
                  : testbed.status === "provisioning"
                  ? "text-blue-500 border-blue-500"
                  : testbed.status === "failed"
                  ? "text-red-500 border-red-500"
                  : "text-gray-500 border-gray-500"
              }`}
            >
              <span
                className={`mr-1.5 h-2 w-2 rounded-full inline-block ${
                  testbed.status === "active"
                    ? "bg-green-500"
                    : testbed.status === "provisioning"
                    ? "bg-blue-500"
                    : testbed.status === "failed"
                    ? "bg-red-500"
                    : "bg-gray-500"
                }`}
              ></span>
              {testbed.status}
            </Badge>
          </SheetTitle>
          <SheetDescription>
            {testbed.description}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 pt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Resource Allocation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-blue-500" />
                    <span>CPU Cores</span>
                  </div>
                  <span className="font-mono text-sm">{testbed.cpu}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <MemoryStick className="h-4 w-4 text-indigo-500" />
                    <span>Memory (GB)</span>
                  </div>
                  <span className="font-mono text-sm">{testbed.memory}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <HardDrive className="h-4 w-4 text-purple-500" />
                    <span>Storage (GB)</span>
                  </div>
                  <span className="font-mono text-sm">{testbed.storage}</span>
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Overall Usage</span>
                  <span className={`font-mono text-sm ${getUsageColor(testbed.usagePercent)}`}>
                    {testbed.usagePercent}%
                  </span>
                </div>
                <Progress value={testbed.usagePercent} className={getProgressColor(testbed.usagePercent)} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Testbed Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">ID:</dt>
                  <dd className="font-mono">{testbed.id}</dd>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Type:</dt>
                  <dd className="capitalize">{testbed.type}</dd>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Purpose:</dt>
                  <dd>{testbed.purpose}</dd>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Location:</dt>
                  <dd>{testbed.location}</dd>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Owned By:</dt>
                  <dd>{testbed.ownedBy}</dd>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Virtual Machines:</dt>
                  <dd>{testbed.vms}</dd>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Networks:</dt>
                  <dd>{testbed.networks}</dd>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Users:</dt>
                  <dd>{testbed.users}</dd>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Deployments:</dt>
                  <dd>{testbed.deployments}</dd>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Created:</dt>
                  <dd>{new Date(testbed.createdAt).toLocaleString()}</dd>
                </div>
                {testbed.expiresAt && (
                  <>
                    <Separator />
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Expires:</dt>
                      <dd>{new Date(testbed.expiresAt).toLocaleString()}</dd>
                    </div>
                  </>
                )}
              </dl>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
};
