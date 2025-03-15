
import React from 'react';
import { format } from 'date-fns';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RouteData } from '@/api/types/networking';
import { getStatusBadgeColor, getTypeBadgeColor } from './routes/RouteColumns';
import { Copy, ExternalLink, Globe, Server, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RouteDetailSheetProps {
  route: RouteData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateClick: () => void;
}

export const RouteDetailSheet: React.FC<RouteDetailSheetProps> = ({ 
  route, 
  open, 
  onOpenChange,
  onUpdateClick
}) => {
  const { toast } = useToast();

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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {route.type === 'openshift' ? (
                <Globe className="h-5 w-5 text-red-500" />
              ) : (
                <Server className="h-5 w-5 text-blue-500" />
              )}
              <SheetTitle>{route.name}</SheetTitle>
            </div>
          </div>
          <div className="flex gap-2 mt-1">
            <Badge
              variant="outline"
              className={getTypeBadgeColor(route.type)}
            >
              {route.type}
            </Badge>
            <Badge
              variant="outline"
              className={getStatusBadgeColor(route.status)}
            >
              {route.status}
            </Badge>
          </div>
          <SheetDescription className="mt-2">
            Route in subnet {route.subnetName}
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Route Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div className="flex flex-row justify-between">
                  <dt className="text-sm font-medium text-muted-foreground">Subnet</dt>
                  <dd className="text-sm">{route.subnetName}</dd>
                </div>
                
                {route.testbed && (
                  <div className="flex flex-row justify-between">
                    <dt className="text-sm font-medium text-muted-foreground">Testbed</dt>
                    <dd className="text-sm">{route.testbed}</dd>
                  </div>
                )}
                
                {route.expiry && (
                  <div className="flex flex-row justify-between">
                    <dt className="text-sm font-medium text-muted-foreground">Expires</dt>
                    <dd className="text-sm">{formatDate(route.expiry)}</dd>
                  </div>
                )}
                
                <div className="flex flex-row justify-between">
                  <dt className="text-sm font-medium text-muted-foreground">Created</dt>
                  <dd className="text-sm">{formatDate(route.createdAt)}</dd>
                </div>
                
                <div className="flex flex-row justify-between">
                  <dt className="text-sm font-medium text-muted-foreground">Updated</dt>
                  <dd className="text-sm">{formatDate(route.updatedAt)}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Display details based on route type */}
          {route.type === 'openshift' && route.vip && route.apps ? (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Endpoints</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium mb-2">API Endpoint</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">FQDN</p>
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
                  
                  <div className="space-y-2 mt-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">IP Address</p>
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

                <div>
                  <h4 className="text-sm font-medium mb-2">Applications Endpoint</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">FQDN</p>
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
                  
                  <div className="space-y-2 mt-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">IP Address</p>
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
              </CardContent>
            </Card>
          ) : (
            // For static routes
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Static IP Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">IP Address</p>
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
              </CardContent>
            </Card>
          )}
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
