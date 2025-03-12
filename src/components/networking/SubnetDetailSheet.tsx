
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
import { Globe, Network, Server } from "lucide-react";
import { Separator } from "@/components/ui/separator";

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

  if (!subnet) return null;

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
                  <dt className="text-muted-foreground">Routes Count:</dt>
                  <dd>{subnet.routesCount}</dd>
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
