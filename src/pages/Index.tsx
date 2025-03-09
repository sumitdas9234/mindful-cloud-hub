
import React, { useState, useEffect } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StatsSummary } from '@/components/dashboard/sections/StatsSummary';
import { ResourceUsageChart } from '@/components/dashboard/sections/ResourceUsageChart';
import { SystemLoad } from '@/components/dashboard/sections/SystemLoad';
import { ServerList } from '@/components/dashboard/sections/ServerList';

const Index = () => {
  const [animateIn, setAnimateIn] = useState(false);
  
  useEffect(() => {
    setAnimateIn(true);
  }, []);

  return (
    <div className={`space-y-6 transition-opacity duration-500 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
      <DashboardHeader />
      
      <StatsSummary />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ResourceUsageChart />
        <SystemLoad />
      </div>
      
      <ServerList />
    </div>
  );
};

export default Index;
