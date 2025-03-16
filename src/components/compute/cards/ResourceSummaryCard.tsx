
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Server } from 'lucide-react';

interface ResourceStats {
  totalCpu: number;
  totalMemory: number;
  totalStorage: number;
  totalVMs: number;
}

interface ResourceSummaryCardProps {
  stats: ResourceStats;
}

export const ResourceSummaryCard: React.FC<ResourceSummaryCardProps> = ({ stats }) => (
  <Card className="md:col-span-1">
    <CardHeader className="py-2">
      <div className="flex items-center justify-between">
        <CardTitle className="text-sm font-medium">Resources</CardTitle>
        <Server className="h-4 w-4 text-muted-foreground" />
      </div>
    </CardHeader>
    <CardContent className="pt-0 pb-2">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">CPUs:</span>
          <span className="text-xs font-medium">{stats.totalCpu}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Memory:</span>
          <span className="text-xs font-medium">{stats.totalMemory} GB</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Storage:</span>
          <span className="text-xs font-medium">{stats.totalStorage} GB</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">VMs:</span>
          <span className="text-xs font-medium">{stats.totalVMs}</span>
        </div>
      </div>
    </CardContent>
  </Card>
);
