
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RotateCw } from 'lucide-react';
import { SubnetData } from '@/api/types/networking';

interface RouteHeaderProps {
  subnet: SubnetData | null;
  handleRefresh: () => void;
}

export const RouteHeader: React.FC<RouteHeaderProps> = ({ subnet, handleRefresh }) => {
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
      <div className="flex space-x-2">
        <Button onClick={handleRefresh} variant="outline" size="sm">
          <RotateCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>
    </div>
  );
};
