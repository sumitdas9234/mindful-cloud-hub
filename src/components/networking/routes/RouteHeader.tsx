
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { SubnetData } from '@/api/types/networking';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Router, GitBranch } from 'lucide-react';
import { RouteFilter } from '@/api/types/networking';

interface RouteHeaderProps {
  subnet: SubnetData | null;
  handleRefresh: () => void;
  activeTab: RouteFilter['type'];
  setActiveTab: (value: RouteFilter['type']) => void;
}

export const RouteHeader: React.FC<RouteHeaderProps> = ({ 
  subnet, 
  activeTab, 
  setActiveTab 
}) => {
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
      
      <Tabs 
        defaultValue={activeTab} 
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as RouteFilter['type'])}
        className="w-auto"
      >
        <TabsList>
          <TabsTrigger value="all">
            <Router className="mr-1.5 h-4 w-4" />
            All
          </TabsTrigger>
          <TabsTrigger value="static">
            <Router className="mr-1.5 h-4 w-4" />
            Static
          </TabsTrigger>
          <TabsTrigger value="openshift">
            <GitBranch className="mr-1.5 h-4 w-4" />
            OpenShift
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
