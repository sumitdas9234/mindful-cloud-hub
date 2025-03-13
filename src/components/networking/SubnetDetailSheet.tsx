
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { SubnetData } from "@/api/types/networking";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, Network, Server, Layers, Router } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

interface RouteStatusCount {
  available: number;
  reserved: number;
  orphaned: number;
  attached: number;
  total: number;
}

interface SubnetDetailSheetProps {
  subnet: SubnetData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SubnetDetailSheet: React.FC<SubnetDetailSheetProps> = ({
  subnet,
  open,
  onOpenChange,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-500 border-green-500";
      case "inactive":
        return "text-red-500 border-red-500";
      case "pending":
        return "text-yellow-500 border-yellow-500";
      default:
        return "text-gray-500 border-gray-500";
    }
  };

  // Mock route status counts
  const getRouteStatusCounts = (totalRoutes: number): RouteStatusCount => {
    // Create a realistic distribution of routes
    return {
      attached: Math.floor(totalRoutes * 0.5),
      reserved: Math.floor(totalRoutes * 0.2),
      orphaned: Math.floor(totalRoutes * 0.1),
      available: Math.floor(totalRoutes * 0.2),
      total: totalRoutes
    };
  };

  if (!subnet) return null;

  const routeStatusCounts = getRouteStatusCounts(subnet.routesCount);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-2xl flex items-center gap-2">
            <span>{subnet.name}</span>
            <Badge variant="outline" className={getStatusColor(subnet.status)}>
              {subnet.status}
            </Badge>
          </SheetTitle>
          <SheetDescription>Subnet configuration and details</SheetDescription>
        </SheetHeader>

        <div className="space-y-6 pt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Network Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2">
                <div className="flex justify-between items-center">
                  <dt className="text-muted-foreground flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    CIDR
                  </dt>
                  <dd className="font-mono">{subnet.cidr}</dd>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <dt className="text-muted-foreground flex items-center gap-2">
                    <Network className="h-4 w-4" />
                    Gateway IP
                  </dt>
                  <dd className="font-mono">{subnet.gatewayIp}</dd>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <dt className="text-muted-foreground flex items-center gap-2">
                    <Server className="h-4 w-4" />
                    VLAN ID
                  </dt>
                  <dd className="font-mono">{subnet.vlanId}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Route Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <dt className="text-muted-foreground flex items-center gap-2">
                      <Router className="h-4 w-4" />
                      Total Routes
                    </dt>
                    <dd className="font-medium">{routeStatusCounts.total}</dd>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <dt className="text-muted-foreground">Attached</dt>
                    <dd className="font-medium">{routeStatusCounts.attached} <span className="text-xs text-muted-foreground">({Math.round(routeStatusCounts.attached / routeStatusCounts.total * 100)}%)</span></dd>
                  </div>
                  <Progress 
                    value={(routeStatusCounts.attached / routeStatusCounts.total) * 100} 
                    className="h-2 bg-muted" 
                    indicatorClassName="bg-green-500" 
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <dt className="text-muted-foreground">Reserved</dt>
                    <dd className="font-medium">{routeStatusCounts.reserved} <span className="text-xs text-muted-foreground">({Math.round(routeStatusCounts.reserved / routeStatusCounts.total * 100)}%)</span></dd>
                  </div>
                  <Progress 
                    value={(routeStatusCounts.reserved / routeStatusCounts.total) * 100} 
                    className="h-2 bg-muted" 
                    indicatorClassName="bg-blue-500" 
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <dt className="text-muted-foreground">Orphaned</dt>
                    <dd className="font-medium">{routeStatusCounts.orphaned} <span className="text-xs text-muted-foreground">({Math.round(routeStatusCounts.orphaned / routeStatusCounts.total * 100)}%)</span></dd>
                  </div>
                  <Progress 
                    value={(routeStatusCounts.orphaned / routeStatusCounts.total) * 100} 
                    className="h-2 bg-muted" 
                    indicatorClassName="bg-yellow-500" 
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <dt className="text-muted-foreground">Available</dt>
                    <dd className="font-medium">{routeStatusCounts.available} <span className="text-xs text-muted-foreground">({Math.round(routeStatusCounts.available / routeStatusCounts.total * 100)}%)</span></dd>
                  </div>
                  <Progress 
                    value={(routeStatusCounts.available / routeStatusCounts.total) * 100} 
                    className="h-2 bg-muted" 
                    indicatorClassName="bg-gray-500" 
                  />
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Additional Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Environment:</dt>
                  <dd>{subnet.environment}</dd>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Location:</dt>
                  <dd>{subnet.location}</dd>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Created:</dt>
                  <dd>{new Date(subnet.createdAt).toLocaleDateString()}</dd>
                </div>
                {subnet.description && (
                  <>
                    <Separator />
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Description:</dt>
                      <dd className="text-right max-w-[300px]">{subnet.description}</dd>
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
