
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
import { Progress } from '@/components/ui/progress';
import { UptimeGraph } from './UptimeGraph';
import { SystemStatus } from './SystemStatusCard';
import { AlertTriangle, CheckCircle, Clock, Server } from 'lucide-react';

interface SystemDetailSheetProps {
  system: SystemStatus | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  relatedIncidents: any[];
  relatedAlerts: any[];
  isLoading?: boolean;
}

export const SystemDetailSheet: React.FC<SystemDetailSheetProps> = ({ 
  system, 
  open, 
  onOpenChange,
  relatedIncidents,
  relatedAlerts,
  isLoading = false
}) => {
  if (!system && !isLoading) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      case 'maintenance': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'maintenance': return <Clock className="h-5 w-5 text-blue-500" />;
      default: return <Server className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        {isLoading ? (
          <SystemDetailSkeleton />
        ) : system ? (
          <>
            <SheetHeader className="pb-4">
              <div className="flex items-center gap-2">
                <SheetTitle className="text-2xl">{system.name}</SheetTitle>
                <Badge
                  variant="outline"
                  className={`ml-2 capitalize ${
                    system.status === 'healthy'
                      ? 'text-green-500 border-green-500'
                      : system.status === 'error'
                      ? 'text-red-500 border-red-500'
                      : system.status === 'warning'
                      ? 'text-yellow-500 border-yellow-500'
                      : 'text-blue-500 border-blue-500'
                  }`}
                >
                  <span
                    className={`mr-1.5 h-2 w-2 rounded-full inline-block ${getStatusColor(
                      system.status
                    )}`}
                  ></span>
                  {system.status}
                </Badge>
              </div>
              <SheetDescription>
                {system.description || `Detailed status information for ${system.name}`}
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-6 py-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Uptime History</CardTitle>
                </CardHeader>
                <CardContent>
                  <UptimeGraph data={system.uptimeData} daysShown={45} />
                  
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Current Uptime</div>
                      <div className="text-lg font-semibold">{system.uptime}</div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">Last Incident</div>
                      <div className="text-lg font-semibold">{system.lastIncident}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {relatedIncidents.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Related Incidents</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {relatedIncidents.map((incident) => (
                      <div key={incident.id} className="p-3 border rounded-md">
                        <div className="flex justify-between">
                          <div className="font-medium">{incident.title}</div>
                          <Badge variant="outline">{incident.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{incident.description}</p>
                        <div className="text-xs text-muted-foreground mt-2">Started {incident.started}</div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {relatedAlerts.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Active Alerts</CardTitle>
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

const SystemDetailSkeleton = () => {
  return (
    <>
      <div className="pb-4">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
        <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>

      <div className="space-y-6 py-6">
        <Card>
          <CardHeader className="pb-2">
            <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
            
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
              
              <div className="space-y-1">
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </CardHeader>
          <CardContent className="space-y-3">
            {Array(2).fill(0).map((_, i) => (
              <div key={i} className="p-3 border rounded-md">
                <div className="flex justify-between">
                  <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-2"></div>
                <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-2"></div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
};
