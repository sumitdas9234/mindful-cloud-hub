
import React from 'react';
import { MoreVertical, Bell, CheckCircle, Volume2, ExternalLink, Clipboard } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Alert } from '@/api/types/alerts';

interface AlertMenuProps {
  alert: Alert;
  onAcknowledge: (alertId: string) => void;
  onSilence: (alertId: string) => void;
}

export const AlertMenu: React.FC<AlertMenuProps> = ({ 
  alert, 
  onAcknowledge,
  onSilence 
}) => {
  // Prevent event propagation to avoid triggering row click
  const handleItemClick = (e: React.MouseEvent, callback: Function) => {
    e.preventDefault();
    e.stopPropagation();
    callback();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        
        {alert.status !== 'resolved' && (
          <>
            <DropdownMenuItem 
              onClick={(e) => handleItemClick(e, () => onAcknowledge(alert.id))}
              disabled={!!alert.acknowledgedBy}
              className="cursor-pointer"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              <span>Acknowledge</span>
              {alert.acknowledgedBy && (
                <span className="ml-2 text-xs text-muted-foreground">
                  (By {alert.acknowledgedBy})
                </span>
              )}
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onClick={(e) => handleItemClick(e, () => onSilence(alert.id))}
              disabled={!!alert.silenceURL}
              className="cursor-pointer"
            >
              <Volume2 className="mr-2 h-4 w-4" />
              <span>Silence</span>
              {alert.silenceURL && (
                <span className="ml-2 text-xs text-muted-foreground">(Already silenced)</span>
              )}
            </DropdownMenuItem>
          </>
        )}
        
        <DropdownMenuSeparator />
        
        {alert.generatorURL && (
          <DropdownMenuItem 
            onClick={(e) => handleItemClick(e, () => window.open(alert.generatorURL, '_blank'))}
            className="cursor-pointer"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            <span>View in Prometheus</span>
          </DropdownMenuItem>
        )}
        
        {alert.dashboardURL && (
          <DropdownMenuItem 
            onClick={(e) => handleItemClick(e, () => window.open(alert.dashboardURL, '_blank'))}
            className="cursor-pointer"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            <span>View in Grafana</span>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem 
          onClick={(e) => {
            handleItemClick(e, () => {
              navigator.clipboard.writeText(alert.fingerprint);
            });
          }}
          className="cursor-pointer"
        >
          <Clipboard className="mr-2 h-4 w-4" />
          <span>Copy Fingerprint</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
