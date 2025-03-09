
import React from 'react';
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

type StatusType = 'healthy' | 'warning' | 'error' | 'active' | 'provisioning' | 'failed' | 'decommissioned';

interface StatusIndicatorProps {
  status: StatusType;
  showLabel?: boolean;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ 
  status,
  showLabel = true
}) => {
  const getStatusIcon = (status: StatusType) => {
    switch (status) {
      case 'healthy':
      case 'active':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'warning':
      case 'provisioning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error':
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'decommissioned':
        return <XCircle className="h-4 w-4 text-gray-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center">
      {getStatusIcon(status)}
      {showLabel && <span className="ml-1 capitalize">{status}</span>}
    </div>
  );
};
