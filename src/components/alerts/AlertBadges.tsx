
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertSeverity, AlertStatus } from '@/api/types/alerts';
import { Clock, Volume2, CheckCircle } from 'lucide-react';

interface SeverityBadgeProps {
  severity: AlertSeverity;
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity }) => {
  const styles = {
    critical: "bg-red-500 hover:bg-red-600",
    high: "bg-orange-500 hover:bg-orange-600",
    medium: "bg-amber-500 hover:bg-amber-600",
    low: "bg-blue-500 hover:bg-blue-600",
    info: "bg-gray-500 hover:bg-gray-600",
  };

  return (
    <Badge className={styles[severity]}>
      {severity.charAt(0).toUpperCase() + severity.slice(1)}
    </Badge>
  );
};

interface StatusBadgeProps {
  status: AlertStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const styles = {
    firing: "border-red-500 text-red-500 bg-red-50 dark:bg-red-950/30",
    pending: "border-amber-500 text-amber-500 bg-amber-50 dark:bg-amber-950/30",
    resolved: "border-green-500 text-green-500 bg-green-50 dark:bg-green-950/30",
  };

  return (
    <Badge variant="outline" className={styles[status]}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

interface StateBadgeProps {
  state: 'silenced' | 'acknowledged' | null;
  by?: string;
}

export const StateBadge: React.FC<StateBadgeProps> = ({ state, by }) => {
  if (!state) return null;
  
  const badges = {
    silenced: {
      icon: <Volume2 className="mr-1 h-3 w-3" />,
      label: "Silenced",
      className: "border-purple-500 text-purple-500 bg-purple-50 dark:bg-purple-950/30"
    },
    acknowledged: {
      icon: <CheckCircle className="mr-1 h-3 w-3" />,
      label: "Acknowledged",
      className: "border-blue-500 text-blue-500 bg-blue-50 dark:bg-blue-950/30"
    }
  };
  
  const badge = badges[state];
  
  return (
    <Badge variant="outline" className={`flex items-center ${badge.className}`}>
      {badge.icon}
      <span>{badge.label}{by ? ` by ${by}` : ''}</span>
    </Badge>
  );
};
