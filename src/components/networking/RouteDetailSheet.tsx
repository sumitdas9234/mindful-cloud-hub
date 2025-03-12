
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { RouteData } from "@/api/types/networking";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GitBranch, Network, ArrowRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface RouteDetailSheetProps {
  route: RouteData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const RouteDetailSheet: React.FC<RouteDetailSheetProps> = ({
  route,
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case "static":
        return "text-blue-500 border-blue-500";
      case "openshift":
        return "text-red-500 border-red-500";
      default:
        return "text-gray-500 border-gray-500";
    }
  };

  if (!route) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-2xl flex items-center gap-2">
            <span>{route.name}</span>
            <Badge variant="outline" className={getStatusColor(route.status)}>
              {route.status}
            </Badge>
          </SheetTitle>
          <SheetDescription>Route configuration and details</SheetDescription>
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
                  <dt className="text-muted-foreground flex items-center gap-2">
                    <GitBranch className="h-4 w-4" />
                    Type
                  </dt>
                  <dd>
                    <Badge variant="outline" className={getTypeColor(route.type)}>
                      {route.type}
                    </Badge>
                  </dd>
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
                  <dt className="text-muted-foreground">Priority:</dt>
                  <dd>{route.priority}</dd>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subnet:</dt>
                  <dd>{route.subnetName}</dd>
                </div>
                {route.description && (
                  <>
                    <Separator />
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Description:</dt>
                      <dd className="text-right max-w-[300px]">{route.description}</dd>
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
