
import React from 'react';
import { TestbedStats } from '../testbedUtils';
import { DistributionChart } from '../charts/DistributionChart';

interface TestbedDistributionTabProps {
  stats: TestbedStats;
}

export const TestbedDistributionTab: React.FC<TestbedDistributionTabProps> = ({ stats }) => {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <DistributionChart 
          title="Environment Distribution" 
          data={stats.byEnvironment} 
          size="large"
        />
        <DistributionChart 
          title="Type Distribution" 
          data={stats.byType} 
          size="large"
        />
      </div>

      <DistributionChart 
        title="Testbed Status Distribution" 
        data={stats.byStatus} 
        size="large"
      />
    </div>
  );
};
