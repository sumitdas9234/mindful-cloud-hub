
import React from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
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
  HardDrive
} from 'lucide-react';

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
  if (!subnet) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-500 hover:bg-green-500/20';
      case 'inactive': 
      default: return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20';
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center gap-2">
            <Network className="h-5 w-5 text-primary" />
            <SheetTitle>{subnet.name}</SheetTitle>
          </div>
          <SheetDescription>
            {subnet.description || `Subnet in ${subnet.datacenter}`}
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
            <Badge
              variant="outline"
              className={getStatusColor(subnet.status)}
            >
              {subnet.status}
            </Badge>
          </div>

          <Separator />
          
          <div className="space-y-4">
            <h3 className="font-medium">Network Information</h3>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-sm font-medium text-muted-foreground">CIDR</div>
                <div className="flex items-center gap-1 mt-1">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  {subnet.cidr}
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-muted-foreground">Gateway</div>
                <div className="flex items-center gap-1 mt-1">
                  <Router className="h-4 w-4 text-muted-foreground" />
                  {subnet.gatewayIp}
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-muted-foreground">Netmask</div>
                <div className="mt-1">{subnet.netmask}</div>
              </div>

              <div>
                <div className="text-sm font-medium text-muted-foreground">Domain</div>
                <div className="mt-1">{subnet.domain}</div>
              </div>
            </div>
            
            <div className="mt-2">
              <div className="text-sm font-medium text-muted-foreground">IP Range</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs px-2 py-1 bg-blue-100 rounded-md dark:bg-blue-900/30">{subnet.ipRange.starts}</span>
                <span>to</span>
                <span className="text-xs px-2 py-1 bg-blue-100 rounded-md dark:bg-blue-900/30">{subnet.ipRange.ends}</span>
              </div>
            </div>
          </div>

          <Separator />
          
          <div className="space-y-4">
            <h3 className="font-medium">Infrastructure</h3>
            
            <div className="space-y-3">
              <div>
                <div className="text-sm font-medium text-muted-foreground">vCenter</div>
                <div className="flex items-center gap-1 mt-1">
                  <Server className="h-4 w-4 text-muted-foreground" />
                  {subnet.vcenter}
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-muted-foreground">Datacenter</div>
                <div className="mt-1">{subnet.datacenter}</div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-muted-foreground">Cluster</div>
                <div className="flex items-center gap-1 mt-1">
                  <Database className="h-4 w-4 text-muted-foreground" />
                  {subnet.cluster}
                </div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-muted-foreground">Datastore</div>
                <div className="flex items-center gap-1 mt-1">
                  <HardDrive className="h-4 w-4 text-muted-foreground" />
                  {subnet.datastore}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
