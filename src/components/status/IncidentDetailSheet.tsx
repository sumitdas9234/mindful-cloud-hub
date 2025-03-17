
import React from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from '@/components/ui/sheet';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Incident } from './IncidentsTable';
import { formatDistanceToNow, parseISO } from 'date-fns';

interface IncidentDetailSheetProps {
  incident: Incident | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  relatedAlerts: any[];
  affectedSystems: any[];
  isLoading?: boolean;
}

export const IncidentDetailSheet: React.FC<IncidentDetailSheetProps> = ({
  incident,
  open,
  onOpenChange,
  relatedAlerts,
  affectedSystems,
  isLoading = false
}) => {
  if (!incident && !isLoading) return null;

  const getStatusColor = (status: Incident['status']) => {
    switch (status) {
      case 'investigating': return 'text-orange-500 border-orange-500';
      case 'identified': return 'text-blue-500 border-blue-500';
      case 'monitoring': return 'text-yellow-500 border-yellow-500';
      case 'resolved': return 'text-green-500 border-green-500';
      default: return 'text-gray-500 border-gray-500';
    }
  };
  
  const getBadgeColor = (status: Incident['status']) => {
    switch (status) {
      case 'investigating': return 'bg-orange-500';
      case 'identified': return 'bg-blue-500';
      case 'monitoring': return 'bg-yellow-500';
      case 'resolved': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        {isLoading ? (
          <IncidentDetailSkeleton />
        ) : incident ? (
          <>
            <SheetHeader className="pb-4">
              <div className="flex items-center gap-2">
                <SheetTitle>{incident.title}</SheetTitle>
                <Badge
                  variant="outline"
                  className={`ml-2 capitalize ${getStatusColor(incident.status)}`}
                >
                  <span
                    className={`mr-1.5 h-2 w-2 rounded-full inline-block ${getBadgeColor(
                      incident.status
                    )}`}
                  ></span>
                  {incident.status}
                </Badge>
              </div>
              <SheetDescription>
                System: {incident.system}
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-6 py-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{incident.description}</p>
                  
                  <Separator className="my-4" />
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Started</div>
                      <div>{incident.started}</div>
                    </div>
                    
                    {incident.updated && (
                      <div>
                        <div className="text-muted-foreground">Last Update</div>
                        <div>{incident.updated}</div>
                      </div>
                    )}
                    
                    {incident.resolved && (
                      <div>
                        <div className="text-muted-foreground">Resolved</div>
                        <div>{incident.resolved}</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {affectedSystems.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Affected Systems</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {affectedSystems.map((system) => (
                        <div key={system.id} className="flex items-center justify-between border-b last:border-0 pb-2 last:pb-0">
                          <div className="font-medium">{system.name}</div>
                          <Badge variant={system.status === 'healthy' ? 'outline' : 'destructive'}>
                            {system.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {relatedAlerts.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Related Alerts</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {relatedAlerts.map((alert) => (
                      <div key={alert.id} className="p-3 border rounded-md">
                        <div className="font-medium">{alert.alertname}</div>
                        <p className="text-sm text-muted-foreground mt-1">{alert.summary}</p>
                        <div className="flex justify-between text-xs text-muted-foreground mt-2">
                          <span>Severity: {alert.severity}</span>
                          <span>Status: {alert.status}</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
};

const IncidentDetailSkeleton = () => {
  return (
    <>
      <div className="pb-4">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>

      <div className="space-y-6 py-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
            
            <Separator className="my-4" />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1"></div>
                <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
              
              <div>
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1"></div>
                <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="h-5 w-36 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </CardHeader>
          <CardContent className="space-y-3">
            {Array(2).fill(0).map((_, i) => (
              <div key={i} className="flex items-center justify-between border-b last:border-0 pb-2 last:pb-0">
                <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
};
