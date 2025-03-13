
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { SubnetData } from '@/api/types/networking';

interface RouteHeaderProps {
  subnet: SubnetData | null;
  handleRefresh: () => void;
}

export const RouteHeader: React.FC<RouteHeaderProps> = ({ subnet }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold mr-3">{subnet?.name || 'All Routes'}</h2>
          {subnet && (
            <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
              {subnet.cidr}
            </Badge>
          )}
        </div>
        {subnet && (
          <p className="text-sm text-muted-foreground mt-1">
            Gateway: {subnet.gatewayIp} · {subnet.routesCount} routes · {subnet.environment}
          </p>
        )}
      </div>
    </div>
  );
};
