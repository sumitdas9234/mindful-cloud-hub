
import React from 'react';
import { TestbedStats } from '../testbedUtils';
import { TestbedActivityChart } from '../TestbedActivityChart';
import { TotalTestbedsCard } from '../cards/TotalTestbedsCard';
import { StatusSummaryCard } from '../cards/StatusSummaryCard';
import { EnvironmentSummaryCard } from '../cards/EnvironmentSummaryCard';
import { DistributionChart } from '../charts/DistributionChart';

interface TestbedOverviewTabProps {
  stats: TestbedStats;
}

export const TestbedOverviewTab: React.FC<TestbedOverviewTabProps> = ({ stats }) => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <TotalTestbedsCard total={stats.total} whitelisted={stats.whitelisted} />
        <StatusSummaryCard stats={stats} />
        <EnvironmentSummaryCard environments={stats.byEnvironment} />
      </div>

      <TestbedActivityChart />

      <div className="grid gap-4 md:grid-cols-2">
        <DistributionChart 
          title="Environment Distribution" 
          data={stats.byEnvironment}
          size="small"
        />
        <DistributionChart 
          title="Type Distribution" 
          data={stats.byType}
          size="small"
        />
      </div>
    </div>
  );
};
