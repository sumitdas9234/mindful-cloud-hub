
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Globe, Server } from 'lucide-react';
import { SubnetData, RouteFilter } from '@/api/types/networking';

interface RouteHeaderProps {
  subnet: SubnetData | null;
  handleRefresh: () => void;
  activeTab: RouteFilter['type'];
  setActiveTab: (tab: RouteFilter['type']) => void;
  onBack?: () => void;
}

export const RouteHeader: React.FC<RouteHeaderProps> = ({
  subnet,
  handleRefresh,
  activeTab,
  setActiveTab,
  onBack
}) => {
  const handleTabChange = (value: string) => {
    setActiveTab(value as RouteFilter['type']);
  };

  return (
    <div>
      {subnet && (
        <div className="mb-4">
          {onBack && (
            <Button
              variant="ghost"
              size="sm"
              className="mb-2"
              onClick={onBack}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Subnets
            </Button>
          )}
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight">{subnet.name}</h2>
            <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
              {subnet.cidr}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm mt-1">{subnet.description}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid w-full grid-cols-3 sm:w-auto">
            <TabsTrigger value="all" className="flex gap-1 items-center">All Routes</TabsTrigger>
            <TabsTrigger value="openshift" className="flex gap-1 items-center">
              <Globe className="h-3.5 w-3.5 text-red-500" />
              OpenShift
            </TabsTrigger>
            <TabsTrigger value="static" className="flex gap-1 items-center">
              <Server className="h-3.5 w-3.5 text-blue-500" />
              Static
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};
