
import React from 'react';
import { AlertTriangle, Bell, CheckCircle, Clock, ExternalLink, Trash } from 'lucide-react';
import { 
  Table, 
  TableHeader,
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { StatusBadge, SeverityBadge, StateBadge } from './AlertBadges';
import { Alert } from '@/api/types/alerts';
import { formatDistanceToNow } from 'date-fns';
import { AlertMenu } from './AlertMenu';

interface AlertsTableProps {
  alerts: Alert[];
  isLoading: boolean;
  onAcknowledge: (alertId: string) => void;
  onSilence: (alertId: string) => void;
  onViewDetails: (alert: Alert) => void;
}

export const AlertsTable: React.FC<AlertsTableProps> = ({ 
  alerts, 
  isLoading,
  onAcknowledge,
  onSilence,
  onViewDetails
}) => {
  if (isLoading) {
    return <AlertsTableSkeleton />;
  }

  if (alerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-white dark:bg-secondary/10 rounded-md border">
        <Bell className="h-12 w-12 text-muted-foreground mb-3" />
        <h3 className="text-lg font-medium">No alerts found</h3>
        <p className="text-muted-foreground mt-1">No alerts match your current filters.</p>
      </div>
    );
  }

  const getAlertIcon = (status: Alert['status'], severity: Alert['severity']) => {
    switch (status) {
      case 'firing':
        return <AlertTriangle className={`h-5 w-5 ${severity === 'critical' ? 'text-red-500' : 'text-orange-500'}`} />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'resolved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="rounded-md border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Alert</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Since</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alerts.map((alert) => (
              <TableRow key={alert.id} className="cursor-pointer hover:bg-muted/50" onClick={() => onViewDetails(alert)}>
                <TableCell>
                  {getAlertIcon(alert.status, alert.severity)}
                </TableCell>
                <TableCell className="font-medium">
                  <div>
                    {alert.alertname}
                    <p className="text-sm text-muted-foreground line-clamp-1">{alert.summary}</p>
                    <div className="flex gap-1 mt-1">
                      {alert.acknowledgedBy && (
                        <StateBadge state="acknowledged" by={alert.acknowledgedBy} />
                      )}
                      {alert.silenceURL && (
                        <StateBadge state="silenced" />
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{alert.service}</span>
                    {alert.labels && alert.labels.instance && (
                      <span className="text-xs text-muted-foreground">{alert.labels.instance}</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <SeverityBadge severity={alert.severity} />
                </TableCell>
                <TableCell>
                  <StatusBadge status={alert.status} />
                </TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(alert.startsAt), { addSuffix: true })}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end" onClick={(e) => e.stopPropagation()}>
                    {alert.status !== 'resolved' && (
                      <>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onAcknowledge(alert.id);
                                }}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Acknowledge</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <AlertMenu 
                          alert={alert} 
                          onAcknowledge={onAcknowledge}
                          onSilence={onSilence}
                        />
                      </>
                    )}
                    
                    {alert.status === 'resolved' && alert.generatorURL && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(alert.generatorURL, '_blank');
                              }}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View in Prometheus</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export const AlertsTableSkeleton = () => {
  return (
    <div className="rounded-md border">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Alert</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Since</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="h-5 w-5 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                </TableCell>
                <TableCell>
                  <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-2"></div>
                  <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </TableCell>
                <TableCell>
                  <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </TableCell>
                <TableCell>
                  <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </TableCell>
                <TableCell>
                  <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </TableCell>
                <TableCell>
                  <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end space-x-2">
                    <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
