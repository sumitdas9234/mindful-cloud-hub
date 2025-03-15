
import React, { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ClusterData } from '@/api/types/clusters';

interface ClusterUpdateDialogProps {
  cluster: ClusterData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClusterUpdate: (clusterId: string, updates: Partial<ClusterData>) => void;
}

export const ClusterUpdateDialog: React.FC<ClusterUpdateDialogProps> = ({
  cluster,
  open,
  onOpenChange,
  onClusterUpdate
}) => {
  const [isActive, setIsActive] = useState(false);
  const [cpuThreshold, setCpuThreshold] = useState(80);
  const [memThreshold, setMemThreshold] = useState(80);
  const [storageThreshold, setStorageThreshold] = useState(85);
  const [autoPurgeEnabled, setAutoPurgeEnabled] = useState(false);

  // Initialize form values when cluster changes
  useEffect(() => {
    if (cluster) {
      setIsActive(cluster.isActive);
      setCpuThreshold(cluster.cpuThreshold || 80);
      setMemThreshold(cluster.memThreshold || 80);
      setStorageThreshold(cluster.storageThreshold || 85);
      setAutoPurgeEnabled(cluster.autoPurgeEnabled || false);
    }
  }, [cluster]);

  const handleUpdate = () => {
    onClusterUpdate(cluster.id, {
      isActive,
      cpuThreshold,
      memThreshold,
      storageThreshold,
      autoPurgeEnabled,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Cluster</DialogTitle>
          <DialogDescription>
            Update cluster settings for {cluster.name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="active-status">Active Status</Label>
            <Switch 
              id="active-status" 
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cpu-threshold">CPU Threshold (%)</Label>
            <Input 
              id="cpu-threshold" 
              type="number"
              min={1}
              max={100}
              value={cpuThreshold} 
              onChange={(e) => setCpuThreshold(parseInt(e.target.value, 10))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mem-threshold">Memory Threshold (%)</Label>
            <Input 
              id="mem-threshold" 
              type="number"
              min={1}
              max={100}
              value={memThreshold} 
              onChange={(e) => setMemThreshold(parseInt(e.target.value, 10))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="storage-threshold">Storage Threshold (%)</Label>
            <Input 
              id="storage-threshold" 
              type="number"
              min={1}
              max={100}
              value={storageThreshold} 
              onChange={(e) => setStorageThreshold(parseInt(e.target.value, 10))}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="auto-purge">Auto Purge VMs</Label>
            <Switch 
              id="auto-purge" 
              checked={autoPurgeEnabled}
              onCheckedChange={setAutoPurgeEnabled}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpdate}>
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
