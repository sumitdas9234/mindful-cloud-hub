
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { TransformedSubnetData } from '@/api/types/networking';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Network, Router, Calendar, Server, Layers, Globe, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchRoutesBySubnet } from '@/api/routesApi';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface SubnetDetailSheetProps {
  subnet: TransformedSubnetData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface DetailRowProps {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value, icon }) => (
  <div className="flex items-start space-x-3 py-2">
    {icon && <div className="text-muted-foreground mt-0.5">{icon}</div>}
    <div className="flex-1 space-y-1">
      <p className="text-sm font-medium leading-none text-muted-foreground">{label}</p>
      <div className="font-medium">{value}</div>
    </div>
  </div>
);

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-500/10 text-green-500 hover:bg-green-500/20';
    case 'inactive': return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20';
    case 'pending': return 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20';
    default: return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20';
  }
};

export const SubnetDetailSheet: React.FC<SubnetDetailSheetProps> = ({
  subnet,
  open,
  onOpenChange,
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const { data: routes = [] } = useQuery({
    queryKey: ['routes-by-subnet', subnet?.id],
    queryFn: () => subnet ? fetchRoutesBySubnet(subnet.id) : Promise.resolve([]),
    enabled: !!subnet,
  });
  
  if (!subnet) return null;
  
  const handleEditSubnet = () => {
    toast({
      title: "Edit Subnet",
      description: "This would open a form to edit the subnet details.",
    });
  };
  
  const handleDeleteSubnet = () => {
    toast({
      title: "Delete Subnet",
      description: "This would prompt for confirmation before deletion.",
    });
  };
  
  const handleViewRoutes = () => {
    navigate(`/networking/routes?subnetId=${subnet.id}`);
  };
  
  const handleExportSubnet = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(subnet, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `subnet-${subnet.name}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    toast({
      title: "Subnet Exported",
      description: `Subnet ${subnet.name} has been exported as JSON.`,
    });
  };

  // Calculate route stats
  const totalRoutes = subnet.metadata?.total || 0;
  const availableRoutes = subnet.metadata?.available || 0;
  const reservedRoutes = subnet.metadata?.reserved || 0;
  const attachedRoutes = subnet.metadata?.attached || 0;
  const orphanedRoutes = subnet.metadata?.orphaned || 0;
  
  // Calculate percentages for static vs openshift
  const staticCount = subnet.metadata?.static || 0; 
  const openshiftCount = subnet.metadata?.openshift || 0;
  const staticPercentage = totalRoutes > 0 ? (staticCount / totalRoutes) * 100 : 0;
  const openshiftPercentage = totalRoutes > 0 ? (openshiftCount / totalRoutes) * 100 : 0;
  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl w-[90vw] overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-2xl font-bold">
            <div className="flex items-center gap-2">
              {subnet.name}
              <Badge
                variant="outline"
                className={getStatusBadgeColor(subnet.status)}
              >
                {subnet.status}
              </Badge>
            </div>
          </SheetTitle>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="bg-blue-500/10 text-blue-500 font-mono">
              {subnet.cidr}
            </Badge>
            <Badge variant="outline" className="bg-gray-500/10 text-gray-700">
              {subnet.location}
            </Badge>
          </div>
          
          <div className="mt-6 flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={handleViewRoutes}>
              <Router className="mr-2 h-4 w-4" />
              View Routes
            </Button>
            <Button variant="outline" size="sm" onClick={handleEditSubnet}>
              Edit Subnet
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportSubnet}>
              Export
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDeleteSubnet}>
              Delete
            </Button>
          </div>
        </SheetHeader>
        
        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="routes">Routes</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Network Information</h3>
              <DetailRow 
                label="CIDR" 
                value={subnet.cidr}
                icon={<Network className="h-4 w-4" />}
              />
              <DetailRow 
                label="Gateway IP" 
                value={subnet.gatewayIp}
                icon={<Router className="h-4 w-4" />}
              />
              <DetailRow 
                label="IP Range" 
                value={`${subnet.ipRange.starts} - ${subnet.ipRange.ends}`}
                icon={<Activity className="h-4 w-4" />}
              />
              <DetailRow 
                label="Netmask" 
                value={subnet.netmask}
                icon={<Layers className="h-4 w-4" />}
              />
              <DetailRow 
                label="Domain" 
                value={subnet.domain}
                icon={<Globe className="h-4 w-4" />}
              />
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Infrastructure</h3>
              <DetailRow 
                label="vCenter" 
                value={subnet.vcenter}
                icon={<Server className="h-4 w-4" />}
              />
              <DetailRow 
                label="Cluster" 
                value={subnet.cluster}
                icon={<Server className="h-4 w-4" />}
              />
              <DetailRow 
                label="Datacenter" 
                value={subnet.datacenter}
                icon={<Server className="h-4 w-4" />}
              />
              <DetailRow 
                label="Datastore" 
                value={subnet.datastore}
                icon={<Server className="h-4 w-4" />}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="routes" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Route Distribution</CardTitle>
                  <CardDescription>Allocation status of routes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Available</span>
                        <span className="font-medium">{availableRoutes} ({((availableRoutes / totalRoutes) * 100).toFixed(0)}%)</span>
                      </div>
                      <Progress value={(availableRoutes / totalRoutes) * 100} className="h-2 bg-gray-100" indicatorClassName="bg-green-500" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Attached</span>
                        <span className="font-medium">{attachedRoutes} ({((attachedRoutes / totalRoutes) * 100).toFixed(0)}%)</span>
                      </div>
                      <Progress value={(attachedRoutes / totalRoutes) * 100} className="h-2 bg-gray-100" indicatorClassName="bg-blue-500" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Reserved</span>
                        <span className="font-medium">{reservedRoutes} ({((reservedRoutes / totalRoutes) * 100).toFixed(0)}%)</span>
                      </div>
                      <Progress value={(reservedRoutes / totalRoutes) * 100} className="h-2 bg-gray-100" indicatorClassName="bg-yellow-500" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Orphaned</span>
                        <span className="font-medium">{orphanedRoutes} ({((orphanedRoutes / totalRoutes) * 100).toFixed(0)}%)</span>
                      </div>
                      <Progress value={(orphanedRoutes / totalRoutes) * 100} className="h-2 bg-gray-100" indicatorClassName="bg-red-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Route Types</CardTitle>
                  <CardDescription>Static vs OpenShift distribution</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Static Routes</span>
                        <span className="font-medium">{staticCount} ({staticPercentage.toFixed(0)}%)</span>
                      </div>
                      <Progress value={staticPercentage} className="h-2 bg-gray-100" indicatorClassName="bg-blue-500" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">OpenShift Routes</span>
                        <span className="font-medium">{openshiftCount} ({openshiftPercentage.toFixed(0)}%)</span>
                      </div>
                      <Progress value={openshiftPercentage} className="h-2 bg-gray-100" indicatorClassName="bg-red-500" />
                    </div>
                    
                    <div className="mt-6 pt-4 border-t">
                      <div className="flex justify-between text-sm font-medium">
                        <span>Total Routes</span>
                        <span>{totalRoutes}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={handleViewRoutes}>
                <Router className="mr-2 h-4 w-4" />
                View All Routes
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="details" className="space-y-4 mt-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Additional Details</h3>
              <DetailRow 
                label="Subnet ID" 
                value={subnet.id}
                icon={<Calendar className="h-4 w-4" />}
              />
              <DetailRow 
                label="Created At" 
                value={new Date(subnet.createdAt).toLocaleString()}
                icon={<Calendar className="h-4 w-4" />}
              />
              <DetailRow 
                label="Status" 
                value={
                  <Badge
                    variant="outline"
                    className={getStatusBadgeColor(subnet.status)}
                  >
                    {subnet.status}
                  </Badge>
                }
              />
              <DetailRow 
                label="Environment" 
                value={subnet.environment || 'Production'}
              />
              <DetailRow 
                label="VLAN ID" 
                value={subnet.vlanId}
              />
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};
