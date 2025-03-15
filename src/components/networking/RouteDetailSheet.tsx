
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RouteData } from '@/api/types/networking';
import { getStatusBadgeColor, getTypeBadgeColor } from './routes/RouteColumns';
import { Copy, ExternalLink, Globe, Server, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from '@/components/ui/label';

interface RouteDetailSheetProps {
  route: RouteData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRouteUpdate?: (routeId: string, updates: Partial<RouteData>) => void;
}

export const RouteDetailSheet: React.FC<RouteDetailSheetProps> = ({ 
  route, 
  open, 
  onOpenChange,
  onRouteUpdate
}) => {
  const { toast } = useToast();
  const [status, setStatus] = useState<RouteData['status']>('available');
  const [testbed, setTestbed] = useState<string | null>(null);
  const [expiry, setExpiry] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Initialize form values when route changes
  React.useEffect(() => {
    if (route) {
      setStatus(route.status);
      setTestbed(route.testbed);
      setExpiry(route.expiry);
    }
  }, [route]);

  if (!route) return null;

  const handleCopyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard',
      description: `${label} has been copied to your clipboard.`,
    });
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'PPp');
    } catch (e) {
      return 'Invalid date';
    }
  };

  const handleUpdate = () => {
    if (isEditing) {
      // Save changes
      if (onRouteUpdate && route) {
        onRouteUpdate(route.id, {
          status,
          testbed,
          expiry
        });
      }
      
      toast({
        title: 'Route Updated',
        description: `Route ${route.name} has been updated successfully.`,
      });
      
      setIsEditing(false);
    } else {
      // Start editing
      setIsEditing(true);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            {route.type === 'openshift' ? (
              <Globe className="h-5 w-5 text-red-500" />
            ) : (
              <Server className="h-5 w-5 text-blue-500" />
            )}
            {route.name}
          </SheetTitle>
          <SheetDescription>
            <div className="flex gap-2 mt-1">
              <Badge
                variant="outline"
                className={getTypeBadgeColor(route.type)}
              >
                {route.type}
              </Badge>
              <Badge
                variant="outline"
                className={getStatusBadgeColor(status)}
              >
                {status}
              </Badge>
            </div>
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Subnet</h4>
            <p className="text-sm">{route.subnetName}</p>
          </div>

          {isEditing ? (
            <div className="space-y-4">
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
          ) : (
            <>
              {/* Testbed information (conditional) */}
              {testbed && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Testbed</h4>
                  <p className="text-sm">{testbed}</p>
                </div>
              )}

              {/* Expiry information (conditional) */}
              {expiry && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Expires</h4>
                  <p className="text-sm">{formatDate(expiry)}</p>
                </div>
              )}
            </>
          )}

          <Separator />

          {/* Display details based on route type */}
          {route.type === 'openshift' && route.vip && route.apps ? (
            <>
              <div className="space-y-3">
                <h4 className="text-sm font-medium">API Endpoint</h4>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">FQDN</p>
                    <div className="flex gap-2">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8"
                        onClick={() => handleCopyToClipboard(route.vip?.fqdn || '', 'API FQDN')}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8"
                        onClick={() => window.open(`https://${route.vip?.fqdn}`, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm font-mono">{route.vip.fqdn}</p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">IP Address</p>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8"
                      onClick={() => handleCopyToClipboard(route.vip?.ip || '', 'API IP')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm font-mono">{route.vip.ip}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="text-sm font-medium">Applications Endpoint</h4>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">FQDN</p>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8"
                      onClick={() => handleCopyToClipboard(route.apps?.fqdn || '', 'Apps FQDN')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm font-mono">{route.apps.fqdn}</p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">IP Address</p>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8"
                      onClick={() => handleCopyToClipboard(route.apps?.ip || '', 'Apps IP')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm font-mono">{route.apps.ip}</p>
                </div>
              </div>
            </>
          ) : (
            // For static routes
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Static IP Address</h4>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">IP Address</p>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="h-8 w-8"
                    onClick={() => handleCopyToClipboard(route.ip || '', 'IP Address')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm font-mono">{route.ip}</p>
              </div>
            </div>
          )}

          <Separator />

          <div className="flex justify-end gap-2">
            <Button 
              variant={isEditing ? "default" : "outline"} 
              onClick={handleUpdate}
            >
              {isEditing ? (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              ) : (
                'Update Route'
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
