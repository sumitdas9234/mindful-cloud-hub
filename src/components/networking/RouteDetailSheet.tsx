
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
import { Network, Clock, FileText, Globe, Server, Link2, Calendar, Laptop } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  
  if (!route) return null;

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'attached': return 'bg-blue-500/10 text-blue-500 border-blue-500';
      case 'reserved': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500';
      case 'orphaned': return 'bg-red-500/10 text-red-500 border-red-500';
      case 'available': return 'bg-green-500/10 text-green-500 border-green-500';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500';
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'static': return 'bg-blue-500/10 text-blue-500 border-blue-500';
      case 'openshift': return 'bg-red-500/10 text-red-500 border-red-500';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500';
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied to clipboard",
        description: `${label} has been copied to your clipboard.`,
      });
    });
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
          </SheetTitle>
          <SheetDescription>Network route details and configuration</SheetDescription>
        </SheetHeader>

        <div className="space-y-6 pt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                {route.type === 'openshift' ? 
                  <Globe className="h-5 w-5 text-red-500" /> : 
                  <Server className="h-5 w-5 text-blue-500" />
                }
                Route Information
              </CardTitle>
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
                  <dt className="text-muted-foreground">Status</dt>
                  <dd>
                    <Badge
                      variant="outline"
                      className={getStatusBadgeColor(route.status)}
                    >
                      {route.status}
                    </Badge>
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Different cards based on route type */}
          {route.type === 'openshift' && route.vip && route.apps && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Globe className="h-5 w-5 text-red-500" />
                  OpenShift Endpoints
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-muted-foreground mb-1 font-medium">API Endpoint (VIP)</dt>
                    <dd className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">FQDN</span>
                        <div className="flex items-center">
                          <span className="text-sm font-medium mr-2">{route.vip.fqdn}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6" 
                            onClick={() => handleCopy(route.vip?.fqdn || '', 'API FQDN')}
                          >
                            <Link2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">IP Address</span>
                        <div className="flex items-center">
                          <span className="text-sm font-medium mr-2">{route.vip.ip}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6" 
                            onClick={() => handleCopy(route.vip?.ip || '', 'API IP')}
                          >
                            <Link2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </dd>
                  </div>
                  <Separator />
                  <div>
                    <dt className="text-muted-foreground mb-1 font-medium">Applications (Apps)</dt>
                    <dd className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">FQDN</span>
                        <div className="flex items-center">
                          <span className="text-sm font-medium mr-2">{route.apps.fqdn}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6" 
                            onClick={() => handleCopy(route.apps?.fqdn || '', 'Apps FQDN')}
                          >
                            <Link2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">IP Address</span>
                        <div className="flex items-center">
                          <span className="text-sm font-medium mr-2">{route.apps.ip}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6" 
                            onClick={() => handleCopy(route.apps?.ip || '', 'Apps IP')}
                          >
                            <Link2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          )}

          {route.type === 'static' && route.ip && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Server className="h-5 w-5 text-blue-500" />
                  Static IP Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2">
                  <div className="flex justify-between items-center">
                    <dt className="text-muted-foreground">IP Address</dt>
                    <dd className="flex items-center">
                      <span className="font-medium mr-2">{route.ip}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6" 
                        onClick={() => handleCopy(route.ip || '', 'Static IP')}
                      >
                        <Link2 className="h-3.5 w-3.5" />
                      </Button>
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          )}

          {(route.testbed || route.expiry) && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Laptop className="h-5 w-5 text-primary" />
                  Testbed Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2">
                  {route.testbed && (
                    <div className="flex justify-between items-center">
                      <dt className="text-muted-foreground flex items-center gap-2">
                        <Laptop className="h-4 w-4" />
                        Testbed
                      </dt>
                      <dd className="font-medium">{route.testbed}</dd>
                    </div>
                  )}
                  {route.testbed && route.expiry && <Separator />}
                  {route.expiry && (
                    <div className="flex justify-between items-center">
                      <dt className="text-muted-foreground flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Expiry Date
                      </dt>
                      <dd>{new Date(route.expiry).toLocaleString()}</dd>
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Timestamps</CardTitle>
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
              </dl>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
};
