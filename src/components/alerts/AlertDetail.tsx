
import React from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import { ExternalLink, UserCheck, Volume2 } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Alert } from '@/api/types/alerts';
import { Button } from '@/components/ui/button';
import { SeverityBadge, StatusBadge, StateBadge } from './AlertBadges';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AlertDetailProps {
  alert: Alert | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAcknowledge: (alertId: string) => void;
  onSilence: (alertId: string) => void;
}

export const AlertDetail: React.FC<AlertDetailProps> = ({
  alert,
  open,
  onOpenChange,
  onAcknowledge,
  onSilence,
}) => {
  if (!alert) return null;

  const formatTimestamp = (timestamp: string) => {
    return format(new Date(timestamp), 'PPpp');
  };

  const renderLabelValue = (value: string) => {
    // Check if it's a URL
    if (value.startsWith('http://') || value.startsWith('https://')) {
      return (
        <a 
          href={value} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline flex items-center"
        >
          {value}
          <ExternalLink className="ml-1 h-3 w-3" />
        </a>
      );
    }
    return value;
  };

  // Handle sheet close with proper body overflow reset
  const handleSheetOpenChange = (open: boolean) => {
    document.body.style.overflow = 'auto';
    onOpenChange(open);
  };

  // Handle action buttons
  const handleAcknowledge = () => {
    document.body.style.overflow = 'auto';
    onAcknowledge(alert.id);
  };

  const handleSilence = () => {
    document.body.style.overflow = 'auto';
    onSilence(alert.id);
  };

  return (
    <Sheet open={open} onOpenChange={handleSheetOpenChange}>
      <SheetContent className="sm:max-w-lg overflow-hidden">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            {alert.alertname}
            <SeverityBadge severity={alert.severity} />
            <StatusBadge status={alert.status} />
          </SheetTitle>
          <SheetDescription>
            {alert.summary}
          </SheetDescription>
          <div className="flex gap-2 mt-2">
            {alert.status === 'acknowledged' && (
              <StateBadge state="acknowledged" by={alert.acknowledgedBy} />
            )}
            {alert.status === 'silenced' && (
              <StateBadge state="silenced" by={alert.silencedBy} />
            )}
          </div>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-180px)] mt-6 pr-4">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium">Description</h3>
              <p className="mt-1 text-sm">{alert.description}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium">Timing</h3>
              <div className="mt-1 grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-muted-foreground">Started</p>
                  <p className="text-sm">{formatTimestamp(alert.startsAt)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(alert.startsAt), { addSuffix: true })}
                  </p>
                </div>
                
                {alert.endsAt && (
                  <div>
                    <p className="text-xs text-muted-foreground">Ended</p>
                    <p className="text-sm">{formatTimestamp(alert.endsAt)}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(alert.endsAt), { addSuffix: true })}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {alert.status === 'acknowledged' && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3 rounded-md">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 flex items-center">
                  <UserCheck className="mr-2 h-4 w-4" />
                  Acknowledged
                </h3>
                <p className="mt-1 text-sm">By {alert.acknowledgedBy}</p>
                {alert.acknowledgedAt && (
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    {formatTimestamp(alert.acknowledgedAt)} ({formatDistanceToNow(new Date(alert.acknowledgedAt), { addSuffix: true })})
                  </p>
                )}
              </div>
            )}
            
            {alert.status === 'silenced' && (
              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 p-3 rounded-md">
                <h3 className="text-sm font-medium text-purple-800 dark:text-purple-300 flex items-center">
                  <Volume2 className="mr-2 h-4 w-4" />
                  Silenced
                </h3>
                <p className="mt-1 text-sm">By {alert.silencedBy}</p>
                {alert.silencedAt && (
                  <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                    {formatTimestamp(alert.silencedAt)} ({formatDistanceToNow(new Date(alert.silencedAt), { addSuffix: true })})
                  </p>
                )}
                {alert.silenceDuration && (
                  <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                    Duration: {alert.silenceDuration} hours
                  </p>
                )}
                {alert.silenceComment && (
                  <div className="mt-2 bg-purple-100 dark:bg-purple-900/30 p-2 rounded text-xs text-purple-700 dark:text-purple-300">
                    <p className="font-medium">Comment:</p>
                    <p>{alert.silenceComment}</p>
                  </div>
                )}
                {alert.silenceURL && (
                  <Button variant="link" size="sm" className="p-0 h-auto mt-1" asChild>
                    <a 
                      href={alert.silenceURL} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-purple-600 dark:text-purple-400 text-xs inline-flex items-center"
                    >
                      View Silence Details
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </Button>
                )}
              </div>
            )}
            
            <div>
              <h3 className="text-sm font-medium mb-1">Labels</h3>
              <div className="bg-secondary/50 rounded-md p-3">
                {Object.entries(alert.labels).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-4 gap-4 py-1">
                    <span className="text-xs font-medium">{key}</span>
                    <span className="text-xs col-span-3">{renderLabelValue(value)}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {Object.keys(alert.annotations).length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-1">Annotations</h3>
                <div className="bg-secondary/50 rounded-md p-3">
                  {Object.entries(alert.annotations).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-4 gap-4 py-1">
                      <span className="text-xs font-medium">{key}</span>
                      <span className="text-xs col-span-3">{renderLabelValue(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <Separator />
            
            <div>
              <div className="space-y-1 mb-2">
                <h3 className="text-sm font-medium">Links</h3>
              </div>
              
              <div className="flex flex-col space-y-2">
                {alert.generatorURL && (
                  <Button variant="outline" size="sm" className="justify-start" asChild>
                    <a href={alert.generatorURL} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View in Prometheus
                    </a>
                  </Button>
                )}
                
                {alert.annotations.dashboard && (
                  <Button variant="outline" size="sm" className="justify-start" asChild>
                    <a href={alert.annotations.dashboard} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Dashboard
                    </a>
                  </Button>
                )}
                
                {alert.silenceURL && (
                  <Button variant="outline" size="sm" className="justify-start" asChild>
                    <a href={alert.silenceURL} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Silence
                    </a>
                  </Button>
                )}
              </div>
            </div>
            
            {alert.status !== 'resolved' && alert.status !== 'acknowledged' && alert.status !== 'silenced' && (
              <div className="mt-6 space-x-2">
                <Button onClick={handleAcknowledge}>
                  Acknowledge
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleSilence}
                >
                  Silence
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
