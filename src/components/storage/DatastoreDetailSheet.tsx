
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
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Database, Server, Network, Calendar, Clock } from "lucide-react";
import { Datastore } from "@/api/types/storage";

interface DatastoreDetailSheetProps {
  datastore: Datastore | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DatastoreDetailSheet: React.FC<DatastoreDetailSheetProps> = ({
  datastore,
  open,
  onOpenChange,
}) => {
  if (!datastore) return null;

  const getStatusColor = (status: Datastore["status"]) => {
    switch (status) {
      case "healthy":
        return "bg-green-500 text-green-500";
      case "warning":
        return "bg-yellow-500 text-yellow-500";
      case "critical":
        return "bg-red-500 text-red-500";
      case "maintenance":
        return "bg-blue-500 text-blue-500";
      default:
        return "bg-gray-500 text-gray-500";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[40%] overflow-y-auto">
        <SheetHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <SheetTitle className="text-2xl flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-500" />
              {datastore.name}
              <Badge
                variant="outline"
                className={`ml-2 capitalize border-${getStatusColor(
                  datastore.status
                )}`}
              >
                <span
                  className={`mr-1.5 h-2 w-2 rounded-full inline-block ${getStatusColor(
                    datastore.status
                  )}`}
                ></span>
                {datastore.status}
              </Badge>
            </SheetTitle>
          </div>
          <SheetDescription>
            {datastore.type} datastore in {datastore.cluster}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4">
          <Card>
            <CardHeader className="py-2">
              <CardTitle className="text-sm font-medium">Capacity</CardTitle>
            </CardHeader>
            <CardContent className="pb-3 pt-0">
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Usage</span>
                    <span>
                      {(datastore.usedCapacity / 1024).toFixed(1)} TB /{" "}
                      {(datastore.totalCapacity / 1024).toFixed(1)} TB (
                      {datastore.usagePercentage}%)
                    </span>
                  </div>
                  <Progress
                    value={datastore.usagePercentage}
                    className="h-2"
                    style={{
                      color:
                        datastore.usagePercentage > 90
                          ? "hsl(var(--destructive))"
                          : datastore.usagePercentage > 80
                          ? "hsl(var(--warning))"
                          : "hsl(var(--primary))",
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="text-sm font-medium">
                      {(datastore.totalCapacity / 1024).toFixed(1)} TB
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Used</p>
                    <p className="text-sm font-medium">
                      {(datastore.usedCapacity / 1024).toFixed(1)} TB
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Free</p>
                    <p className="text-sm font-medium">
                      {(datastore.freeCapacity / 1024).toFixed(1)} TB
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                      Provisioning
                    </p>
                    <p className="text-sm font-medium capitalize">
                      {datastore.provisionType}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="py-2">
              <CardTitle className="text-sm font-medium">
                Infrastructure
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-3 pt-0">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Host:</span>
                  </div>
                  <span className="text-sm">{datastore.host}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Network className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Cluster:
                    </span>
                  </div>
                  <span className="text-sm">{datastore.cluster}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Created:
                    </span>
                  </div>
                  <span className="text-sm">
                    {formatDate(datastore.createdAt)}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Last Updated:
                    </span>
                  </div>
                  <span className="text-sm">
                    {formatDate(datastore.lastUpdated)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" className="rounded-none border-blue-500 text-blue-500 hover:bg-blue-50">
              View VMs
            </Button>
            <Button variant="outline" className="rounded-none border-blue-500 text-blue-500 hover:bg-blue-50">
              Edit
            </Button>
            <Button className="rounded-none">Manage</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
