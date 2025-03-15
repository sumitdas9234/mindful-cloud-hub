
import React from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClusterData } from '@/api/types/clusters';
import { 
  Server, 
  Network, 
  Database, 
  MemoryStick, 
  Cpu, 
  Tag, 
  Users, 
  Globe, 
  HardDrive,
  Edit
} from 'lucide-react';

interface ClusterDetailSheetProps {
  cluster: ClusterData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateClick: () => void;
}

export const ClusterDetailSheet: React.FC<ClusterDetailSheetProps> = ({ 
  cluster, 
  open, 
  onOpenChange,
  onUpdateClick
}) => {
  if (!cluster) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server className="h-5 w-5 text-blue-500" />
              <SheetTitle>{cluster.name}</SheetTitle>
            </div>
          </div>
          <div className="flex gap-2 mt-1">
            <Badge
              variant="outline"
              className={
                cluster.isActive 
                  ? "bg-green-500/10 text-green-500 border-green-500" 
                  : "bg-gray-500/10 text-gray-500 border-gray-500"
              }
            >
              {cluster.isActive ? "Active" : "Inactive"}
            </Badge>
            <Badge
              variant="outline"
              className="bg-blue-500/10 text-blue-500 border-blue-500"
            >
              {cluster.businessUnit || "No BU"}
            </Badge>
          </div>
          <SheetDescription className="mt-2">
            Cluster in {cluster.datacenter}
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Cluster Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div className="flex flex-row justify-between">
                  <dt className="text-sm font-medium text-muted-foreground">Organization</dt>
                  <dd className="text-sm">{cluster.org}</dd>
                </div>
                <Separator />
                
                <div className="flex flex-row justify-between">
                  <dt className="text-sm font-medium text-muted-foreground">vCenter</dt>
                  <dd className="text-sm font-mono">{cluster.vc}</dd>
                </div>
                <Separator />
                
                <div className="flex flex-row justify-between">
                  <dt className="text-sm font-medium text-muted-foreground">Datacenter</dt>
                  <dd className="text-sm">{cluster.datacenter}</dd>
                </div>
                <Separator />
                
                <div className="flex flex-row justify-between">
                  <dt className="text-sm font-medium text-muted-foreground">Resource Pool</dt>
                  <dd className="text-sm">{cluster.resourcepool}</dd>
                </div>
                <Separator />
                
                <div className="flex flex-row justify-between">
                  <dt className="text-sm font-medium text-muted-foreground">Datastore</dt>
                  <dd className="text-sm">{cluster.datastore}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Network Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div className="flex flex-row justify-between">
                  <dt className="text-sm font-medium text-muted-foreground">Default Network</dt>
                  <dd className="text-sm font-mono">{cluster.defaultnetwork}</dd>
                </div>
                {cluster.airgapnetwork && (
                  <>
                    <Separator />
                    <div className="flex flex-row justify-between">
                      <dt className="text-sm font-medium text-muted-foreground">Airgap Network</dt>
                      <dd className="text-sm font-mono">{cluster.airgapnetwork}</dd>
                    </div>
                  </>
                )}
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Resource Thresholds</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-row justify-between items-center">
                <div className="flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">CPU Threshold</span>
                </div>
                <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
                  {cluster.cpuThreshold || 80}%
                </Badge>
              </div>
              
              <div className="flex flex-row justify-between items-center">
                <div className="flex items-center gap-2">
                  <MemoryStick className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">Memory Threshold</span>
                </div>
                <Badge variant="outline" className="bg-purple-500/10 text-purple-500">
                  {cluster.memThreshold || 80}%
                </Badge>
              </div>
              
              <div className="flex flex-row justify-between items-center">
                <div className="flex items-center gap-2">
                  <HardDrive className="h-4 w-4 text-indigo-500" />
                  <span className="text-sm font-medium">Storage Threshold</span>
                </div>
                <Badge variant="outline" className="bg-indigo-500/10 text-indigo-500">
                  {cluster.storageThreshold || 85}%
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-row justify-between items-center">
                <span className="text-sm font-medium">Auto Purge VMs</span>
                <Badge 
                  variant="outline" 
                  className={
                    cluster.autoPurgeEnabled 
                      ? "bg-green-500/10 text-green-500" 
                      : "bg-gray-500/10 text-gray-500"
                  }
                >
                  {cluster.autoPurgeEnabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              
              <div className="flex flex-row justify-between items-center">
                <span className="text-sm font-medium">Datastore Cluster</span>
                <Badge 
                  variant="outline" 
                  className={
                    cluster.hasDatastoreCluster 
                      ? "bg-green-500/10 text-green-500" 
                      : "bg-gray-500/10 text-gray-500"
                  }
                >
                  {cluster.hasDatastoreCluster ? "Yes" : "No"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Tags and Sharing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center">
                  <Tag className="h-4 w-4 mr-1 text-amber-500" />
                  Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {cluster.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center">
                  <Users className="h-4 w-4 mr-1 text-teal-500" />
                  Shared With
                </h4>
                <div className="flex flex-wrap gap-2">
                  {cluster.sharedWith.map(team => (
                    <Badge key={team} variant="outline" className="text-xs bg-teal-500/10 text-teal-500">
                      {team}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end mt-6">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onUpdateClick}
          >
            <Edit className="h-4 w-4 mr-1" />
            Update
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
