
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
import { RouteData } from '@/api/types/networking';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from '@/components/ui/label';

interface RouteUpdateDialogProps {
  route: RouteData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRouteUpdate: (routeId: string, updates: Partial<RouteData>) => void;
}

export const RouteUpdateDialog: React.FC<RouteUpdateDialogProps> = ({
  route,
  open,
  onOpenChange,
  onRouteUpdate
}) => {
  const [status, setStatus] = useState<RouteData['status']>('available');
  const [testbed, setTestbed] = useState<string | null>(null);
  const [expiry, setExpiry] = useState<string | null>(null);

  // Initialize form values when route changes
  useEffect(() => {
    if (route) {
      setStatus(route.status);
      setTestbed(route.testbed);
      setExpiry(route.expiry);
    }
  }, [route]);

  const handleUpdate = () => {
    onRouteUpdate(route.id, {
      status,
      testbed,
      expiry
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Route</DialogTitle>
          <DialogDescription>
            Update route details for {route.name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as RouteData['status'])}>
              <SelectTrigger id="status" className="w-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="attached">Attached</SelectItem>
                <SelectItem value="reserved">Reserved</SelectItem>
                <SelectItem value="orphaned">Orphaned</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="testbed">Testbed</Label>
            <Input 
              id="testbed" 
              value={testbed || ''} 
              onChange={(e) => setTestbed(e.target.value || null)}
              placeholder="Testbed name" 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiry">Expiry Date</Label>
            <Input 
              id="expiry" 
              type="date" 
              value={expiry ? new Date(expiry).toISOString().split('T')[0] : ''} 
              onChange={(e) => setExpiry(e.target.value || null)}
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
