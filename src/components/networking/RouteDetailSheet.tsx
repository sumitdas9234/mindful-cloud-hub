
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { RouteData } from "@/api/types/networking";
import { CardContent, Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Router, Network, ArrowRight, Clock, FileText } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface RouteDetailSheetProps {
  route: RouteData & { routeStatus?: string } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const RouteDetailSheet: React.FC<RouteDetailSheetProps> = ({
  route,
  open,
  onOpenChange,
}) => {
  if (!route) return null;

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-500 border-green-500";
      case "inactive":
        return "bg-gray-500/10 text-gray-500 border-gray-500";
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500";
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "static":
        return "bg-blue-500/10 text-blue-500 border-blue-500";
      case "openshift":
        return "bg-red-500/10 text-red-500 border-red-500";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500";
    }
  };

  const getRouteStatusBadgeColor = (routeStatus: string) => {
    switch (routeStatus) {
      case 'attached': return 'bg-green-500/10 text-green-500 border-green-500';
      case 'reserved': return 'bg-blue-500/10 text-blue-500 border-blue-500';
      case 'orphaned': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500';
      case 'available': return 'bg-gray-500/10 text-gray-500 border-gray-500';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500';
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-2xl flex items-center gap-2">
            <span>{route.name}</span>
            <Badge variant="outline" className={getStatusBadgeColor(route.status)}>
              {route.status}
            </Badge>
            {route.routeStatus && (
              <Badge variant="outline" className={getRouteStatusBadgeColor(route.routeStatus)}>
                {route.routeStatus}
              </Badge>
            )}
          </SheetTitle>
          <SheetDescription>Network route details and configuration</SheetDescription>
        </SheetHeader>

        <div className="space-y-6 pt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Route Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2">
                <div className="flex justify-between items-center">
                  <dt className="text-muted-foreground flex items-center gap-2">
                    <Network className="h-4 w-4" />
                    Subnet
                  </dt>
                  <dd className="font-medium">
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                      {route.subnetName}
                    </Badge>
                  </dd>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <dt className="text-muted-foreground flex items-center gap-2">
                    <Router className="h-4 w-4" />
                    Destination
                  </dt>
                  <dd className="font-mono">{route.destination}</dd>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <dt className="text-muted-foreground flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    Next Hop
                  </dt>
                  <dd className="font-mono">{route.nextHop}</dd>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <dt className="text-muted-foreground">Type</dt>
                  <dd>
                    <Badge
                      variant="outline"
                      className={getTypeBadgeColor(route.type)}
                    >
                      {route.type}
                    </Badge>
                  </dd>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <dt className="text-muted-foreground">Priority</dt>
                  <dd className="font-medium">{route.priority}</dd>
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
                <div className="flex justify-between items-center">
                  <dt className="text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Created
                  </dt>
                  <dd>{new Date(route.createdAt).toLocaleString()}</dd>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <dt className="text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Updated
                  </dt>
                  <dd>{new Date(route.updatedAt).toLocaleString()}</dd>
                </div>
                {route.description && (
                  <>
                    <Separator />
                    <div className="flex flex-col gap-1">
                      <dt className="text-muted-foreground flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Description
                      </dt>
                      <dd className="text-sm">{route.description}</dd>
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
