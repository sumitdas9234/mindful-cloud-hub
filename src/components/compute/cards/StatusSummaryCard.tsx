
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

interface StatusStats {
  active: number;
  provisioning: number;
  failed: number;
  decommissioned: number;
}

interface StatusSummaryCardProps {
  stats: StatusStats;
}

export const StatusSummaryCard: React.FC<StatusSummaryCardProps> = ({ stats }) => (
  <Card className="md:col-span-1">
    <CardHeader className="py-2">
      <div className="flex items-center justify-between">
        <CardTitle className="text-sm font-medium">Status</CardTitle>
        <BarChart3 className="h-4 w-4 text-muted-foreground" />
      </div>
    </CardHeader>
    <CardContent className="pt-0 pb-2">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-xs">Active</span>
          </div>
          <span className="text-xs font-medium">{stats.active}</span>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-xs">Provisioning</span>
          </div>
          <span className="text-xs font-medium">{stats.provisioning}</span>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-xs">Failed</span>
          </div>
          <span className="text-xs font-medium">{stats.failed}</span>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-500" />
            <span className="text-xs">Decommissioned</span>
          </div>
          <span className="text-xs font-medium">{stats.decommissioned}</span>
        </div>
      </div>
    </CardContent>
  </Card>
);
