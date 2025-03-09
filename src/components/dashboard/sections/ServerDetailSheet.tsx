import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ServerData } from "@/api/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Cpu, HardDrive, MemoryStick } from "lucide-react";

interface ServerDetailSheetProps {
  server: ServerData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ServerDetailSheet: React.FC<ServerDetailSheetProps> = ({
  server,
  open,
  onOpenChange,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "offline":
        return "bg-red-500";
      case "maintenance":
        return "bg-amber-500";
      default:
        return "bg-gray-500";
    }
  };

  if (!server) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-2xl flex items-center gap-2">
            <span className="font-mono">{server.name}</span>
            <Badge
              variant="outline"
              className={`ml-2 capitalize ${
                server.status === "online"
                  ? "text-green-500 border-green-500"
                  : server.status === "offline"
                  ? "text-red-500 border-red-500"
                  : "text-amber-500 border-amber-500"
              }`}
            >
              <span
                className={`mr-1.5 h-2 w-2 rounded-full inline-block ${getStatusColor(
                  server.status
                )}`}
              ></span>
              {server.status}
            </Badge>
          </SheetTitle>
          <SheetDescription>
            Server details and performance metrics
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
                    <Cpu className="h-4 w-4 text-blue-500" />
                    <span>CPU</span>
                  </div>
                  <span className="font-mono text-sm">{server.cpu}%</span>
                </div>
                <Progress value={server.cpu} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <MemoryStick className="h-4 w-4 text-indigo-500" />
                    <span>Memory</span>
                  </div>
                  <span className="font-mono text-sm">{server.memory}%</span>
                </div>
                <Progress value={server.memory} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <HardDrive className="h-4 w-4 text-purple-500" />
                    <span>Disk</span>
                  </div>
                  <span className="font-mono text-sm">{server.disk}%</span>
                </div>
                <Progress value={server.disk} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Server Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Server ID:</dt>
                  <dd className="font-mono">{server.id}</dd>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Status:</dt>
                  <dd className="capitalize">{server.status}</dd>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Type:</dt>
                  <dd>
                    {server.name.includes("app")
                      ? "Application Server"
                      : server.name.includes("db")
                      ? "Database Server"
                      : server.name.includes("cache")
                      ? "Cache Server"
                      : "General Purpose"}
                  </dd>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Environment:</dt>
                  <dd>
                    {server.name.includes("prod")
                      ? "Production"
                      : server.name.includes("dev")
                      ? "Development"
                      : server.name.includes("test")
                      ? "Testing"
                      : server.name.includes("staging")
                      ? "Staging"
                      : server.name.includes("backup")
                      ? "Backup"
                      : "Unknown"}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
};
