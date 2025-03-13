
import React, { useState } from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetFooter
} from "@/components/ui/sheet";
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TransformedSubnetData } from '@/api/types/networking';
import { 
  Network, 
  Server, 
  Database, 
  Globe, 
  Router,
  HardDrive,
  Clock,
  PencilIcon,
  GitBranch,
  Package,
  PackageCheck,
  PackagePlus,
  PackageX
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface SubnetDetailSheetProps {
  subnet: TransformedSubnetData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SubnetDetailSheet: React.FC<SubnetDetailSheetProps> = ({
  subnet,
  open,
  onOpenChange
}) => {
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [updatedSubnet, setUpdatedSubnet] = useState<Partial<TransformedSubnetData> | null>(null);

  if (!subnet) {
    return null;
  }

  const handleOpenUpdateDialog = () => {
    setUpdatedSubnet({ ...subnet });
    setUpdateDialogOpen(true);
  };

  const handleUpdateChange = (field: keyof TransformedSubnetData, value: string | boolean) => {
    if (updatedSubnet) {
      setUpdatedSubnet({
        ...updatedSubnet,
        [field]: value,
      });
    }
  };

  const handleUpdateSubmit = () => {
    // Here you would implement the API call to update the subnet
    console.log('Updating subnet with:', updatedSubnet);
    setUpdateDialogOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-500 hover:bg-green-500/20';
      case 'inactive': 
      default: return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20';
    }
  };

  const formattedCreatedAt = subnet.createdAt ? new Date(subnet.createdAt).toLocaleString() : 'N/A';

  // Prepare route distribution data for chart
  const routeDistributionData = subnet.metadata ? [
    { name: 'attached', value: subnet.metadata.attached, color: '#10b981' }, // green
    { name: 'available', value: subnet.metadata.available, color: '#3b82f6' }, // blue
    { name: 'reserved', value: subnet.metadata.reserved, color: '#f59e0b' }, // amber
    { name: 'orphaned', value: subnet.metadata.orphaned, color: '#ef4444' }  // red
  ] : [];

  // Prepare route type data for chart
  const routeTypeData = subnet.metadata ? [
    { name: 'openshift', value: subnet.metadata.openshift, color: '#8b5cf6' }, // purple
    { name: 'static', value: subnet.metadata.static, color: '#6b7280' }  // gray
  ] : [];

  const getRouteIcon = (type: string) => {
    switch (type) {
      case 'attached': return <PackageCheck className="h-4 w-4 text-green-500" />;
      case 'available': return <PackagePlus className="h-4 w-4 text-blue-500" />;
      case 'reserved': return <Package className="h-4 w-4 text-amber-500" />;
      case 'orphaned': return <PackageX className="h-4 w-4 text-red-500" />;
      case 'openshift': return <GitBranch className="h-4 w-4 text-purple-500" />;
      case 'static': return <Package className="h-4 w-4 text-gray-500" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto w-[35%] max-w-none">
        <SheetHeader>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Network className="h-5 w-5 text-primary" />
              <SheetTitle>{subnet.name}</SheetTitle>
            </div>
            <Badge
              variant="outline"
              className={getStatusColor(subnet.status)}
            >
              {subnet.status}
            </Badge>
          </div>
          <SheetDescription>
            {subnet.rawId || subnet.description || `Subnet in ${subnet.datacenter}`}
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          {subnet.metadata && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Route Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="h-40">
                    <ChartContainer config={{}} className="h-full">
                      <PieChart>
                        <Pie
                          data={routeDistributionData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={30}
                          outerRadius={60}
                          paddingAngle={5}
                        >
                          {routeDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip 
                          content={<ChartTooltipContent formatter={(value, name) => (
                            <div className="flex items-center gap-2">
                              {getRouteIcon(name as string)}
                              <span className="capitalize">{name}: {value}</span>
                            </div>
                          )}/>}
                        />
                      </PieChart>
                    </ChartContainer>
                  </div>

                  <div className="space-y-2">
                    <div className="font-semibold">Status Distribution</div>
                    {routeDistributionData.map((item) => (
                      <div key={item.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1.5">
                          {getRouteIcon(item.name)}
                          <span className="capitalize">{item.name}</span>
                        </div>
                        <div>{item.value}</div>
                      </div>
                    ))}
                    <Separator className="my-2" />
                    <div className="font-semibold">Type Distribution</div>
                    {routeTypeData.map((item) => (
                      <div key={item.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1.5">
                          {getRouteIcon(item.name)}
                          <span className="capitalize">{item.name}</span>
                        </div>
                        <div>{item.value}</div>
                      </div>
                    ))}
                    <Separator className="my-2" />
                    <div className="flex items-center justify-between text-sm font-medium">
                      <span>Total Routes</span>
                      <span>{subnet.metadata.total}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

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
                  <dd className="font-medium">{subnet.cidr}</dd>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <dt className="text-muted-foreground flex items-center gap-2">
                    <Router className="h-4 w-4" />
                    Gateway
                  </dt>
                  <dd className="font-medium">{subnet.gatewayIp}</dd>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <dt className="text-muted-foreground">Netmask</dt>
                  <dd className="font-medium">{subnet.netmask}</dd>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <dt className="text-muted-foreground">Domain</dt>
                  <dd className="font-medium">{subnet.domain}</dd>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <dt className="text-muted-foreground">IP Range</dt>
                  <dd className="font-medium flex items-center gap-2">
                    <span className="text-xs px-2 py-1 bg-blue-100 rounded-md dark:bg-blue-900/30">
                      {subnet.ipRange.starts}
                    </span>
                    <span>to</span>
                    <span className="text-xs px-2 py-1 bg-blue-100 rounded-md dark:bg-blue-900/30">
                      {subnet.ipRange.ends}
                    </span>
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Infrastructure</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2">
                <div className="flex justify-between items-center">
                  <dt className="text-muted-foreground flex items-center gap-2">
                    <Server className="h-4 w-4" />
                    vCenter
                  </dt>
                  <dd className="font-medium text-right">{subnet.vcenter}</dd>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <dt className="text-muted-foreground">Datacenter</dt>
                  <dd className="font-medium">{subnet.datacenter}</dd>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <dt className="text-muted-foreground flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    Cluster
                  </dt>
                  <dd className="font-medium text-right">{subnet.cluster}</dd>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <dt className="text-muted-foreground flex items-center gap-2">
                    <HardDrive className="h-4 w-4" />
                    Datastore
                  </dt>
                  <dd className="font-medium text-right break-words max-w-[200px]">{subnet.datastore}</dd>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <dt className="text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Created
                  </dt>
                  <dd>{formattedCreatedAt}</dd>
                </div>
                {subnet.environment && (
                  <>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <dt className="text-muted-foreground">Environment</dt>
                      <dd>{subnet.environment}</dd>
                    </div>
                  </>
                )}
                {subnet.location && (
                  <>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <dt className="text-muted-foreground">Location</dt>
                      <dd>{subnet.location}</dd>
                    </div>
                  </>
                )}
              </dl>
            </CardContent>
          </Card>
        </div>

        <SheetFooter className="mt-6">
          <Button onClick={handleOpenUpdateDialog} className="w-full">
            <PencilIcon className="h-4 w-4 mr-2" />
            Update Subnet
          </Button>
        </SheetFooter>
      </SheetContent>

      <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Subnet</DialogTitle>
            <DialogDescription>
              Make changes to the subnet configuration.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={updatedSubnet?.name || ''}
                onChange={(e) => handleUpdateChange('name', e.target.value)}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={updatedSubnet?.description || ''}
                onChange={(e) => handleUpdateChange('description', e.target.value)}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="domain" className="text-right">
                Domain
              </Label>
              <Input
                id="domain"
                value={updatedSubnet?.domain || ''}
                onChange={(e) => handleUpdateChange('domain', e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpdateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateSubmit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sheet>
  );
};
