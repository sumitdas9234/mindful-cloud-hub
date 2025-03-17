
import React from 'react';
import { MoreVertical, Bell, CheckCircle, Volume2, ExternalLink, Clipboard, UserCheck } from 'lucide-react';
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
    document.body.style.overflow = 'auto';
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
        
        {(alert.status !== 'resolved' && alert.status !== 'acknowledged') && (
          <DropdownMenuItem 
            onClick={(e) => handleItemClick(e, () => onAcknowledge(alert.id))}
            className="cursor-pointer"
          >
            <UserCheck className="mr-2 h-4 w-4" />
            <span>Acknowledge</span>
          </DropdownMenuItem>
        )}
        
        {(alert.status !== 'resolved' && alert.status !== 'silenced') && (
          <DropdownMenuItem 
            onClick={(e) => handleItemClick(e, () => onSilence(alert.id))}
            className="cursor-pointer"
          >
            <Volume2 className="mr-2 h-4 w-4" />
            <span>Silence</span>
          </DropdownMenuItem>
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
