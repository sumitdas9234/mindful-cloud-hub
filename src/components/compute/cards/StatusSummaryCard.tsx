
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

interface StatusStats {
  active: number;
  provisioning: number;
  failed: number;
}

interface StatusSummaryCardProps {
  stats: StatusStats;
}

export const StatusSummaryCard: React.FC<StatusSummaryCardProps> = ({ stats }) => (
  <Card className="md:col-span-1 overflow-hidden border-none shadow-md bg-gradient-to-br from-card to-card/80">
    <CardHeader className="py-4 bg-card/5">
      <div className="flex items-center justify-between">
        <CardTitle className="text-sm font-medium">Status</CardTitle>
        <BarChart3 className="h-4 w-4 text-muted-foreground" />
      </div>
    </CardHeader>
    <CardContent className="pt-2 pb-4">
      <div className="space-y-3">
        <div className="flex justify-between items-center rounded-md p-2 transition-colors hover:bg-muted/50">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-xs font-medium">Active</span>
          </div>
          <span className="text-xs font-semibold">{stats.active}</span>
        </div>
        <div className="flex justify-between items-center rounded-md p-2 transition-colors hover:bg-muted/50">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-xs font-medium">Provisioning</span>
          </div>
          <span className="text-xs font-semibold">{stats.provisioning}</span>
        </div>
        <div className="flex justify-between items-center rounded-md p-2 transition-colors hover:bg-muted/50">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-xs font-medium">Failed</span>
          </div>
          <span className="text-xs font-semibold">{stats.failed}</span>
        </div>
      </div>
    </CardContent>
  </Card>
);
