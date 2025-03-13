
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
import { HardDrive, MapPin, Network, Clock, Cpu, Activity, Minimize } from "lucide-react";
import { FlashArray } from "@/api/types/storage";

interface FlashArrayDetailSheetProps {
  flashArray: FlashArray | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FlashArrayDetailSheet: React.FC<FlashArrayDetailSheetProps> = ({
  flashArray,
  open,
  onOpenChange,
}) => {
  if (!flashArray) return null;

  const getStatusColor = (status: FlashArray["status"]) => {
    switch (status) {
      case "online":
        return "bg-green-500 text-green-500";
      case "degraded":
        return "bg-yellow-500 text-yellow-500";
      case "offline":
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
              <HardDrive className="h-5 w-5 text-purple-500" />
              {flashArray.name}
              <Badge
                variant="outline"
                className={`ml-2 capitalize border-${getStatusColor(
                  flashArray.status
                )}`}
              >
                <span
                  className={`mr-1.5 h-2 w-2 rounded-full inline-block ${getStatusColor(
                    flashArray.status
                  )}`}
                ></span>
                {flashArray.status}
              </Badge>
            </SheetTitle>
          </div>
          <SheetDescription>
            {flashArray.model} in {flashArray.location}
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
                      {flashArray.usedCapacity} TB /{" "}
                      {flashArray.totalCapacity} TB (
                      {flashArray.usagePercentage}%)
                    </span>
                  </div>
                  <Progress
                    value={flashArray.usagePercentage}
                    className="h-2"
                    style={{
                      color:
                        flashArray.usagePercentage > 90
                          ? "hsl(var(--destructive))"
                          : flashArray.usagePercentage > 80
                          ? "hsl(var(--warning))"
                          : "hsl(var(--primary))",
                    }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="text-sm font-medium">
                      {flashArray.totalCapacity} TB
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Used</p>
                    <p className="text-sm font-medium">
                      {flashArray.usedCapacity} TB
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Free</p>
                    <p className="text-sm font-medium">
                      {flashArray.freeCapacity} TB
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="py-2">
              <CardTitle className="text-sm font-medium">Performance</CardTitle>
            </CardHeader>
            <CardContent className="pb-3 pt-0">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <Activity className="h-3 w-3 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">IOPS</p>
                  </div>
                  <p className="text-sm font-medium">
                    {(flashArray.iops / 1000).toFixed(0)}K
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Latency</p>
                  </div>
                  <p className="text-sm font-medium">{flashArray.latency}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <Minimize className="h-3 w-3 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Data Reduction</p>
                  </div>
                  <p className="text-sm font-medium">{flashArray.dataReduction}:1</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="py-2">
              <CardTitle className="text-sm font-medium">Details</CardTitle>
            </CardHeader>
            <CardContent className="pb-3 pt-0">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Firmware:
                    </span>
                  </div>
                  <span className="text-sm">{flashArray.firmware}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Location:
                    </span>
                  </div>
                  <span className="text-sm">{flashArray.location}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Network className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      IP Address:
                    </span>
                  </div>
                  <span className="text-sm">{flashArray.ipAddress}</span>
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
                    {formatDate(flashArray.lastUpdated)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" className="rounded-none border-blue-500 text-blue-500 hover:bg-blue-50">
              Diagnostics
            </Button>
            <Button variant="outline" className="rounded-none border-blue-500 text-blue-500 hover:bg-blue-50">
              Snapshots
            </Button>
            <Button className="rounded-none">Manage</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
