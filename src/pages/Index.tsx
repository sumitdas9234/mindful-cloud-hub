
import React, { useState, useEffect } from 'react';
import { Cpu, Database, HardDrive, Network, Server, Users, Clock, Activity } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ResourceCard } from '@/components/dashboard/ResourceCard';
import { UsageChart } from '@/components/dashboard/UsageChart';

// Mock time-series data
const generateTimeSeriesData = () => {
  const now = new Date();
  const data = [];
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now);
    time.setHours(now.getHours() - i);
    
    data.push({
      name: `${time.getHours()}:00`,
      cpu: Math.floor(Math.random() * 30) + 30,
      memory: Math.floor(Math.random() * 25) + 40,
      network: Math.floor(Math.random() * 80) + 100,
    });
  }
  return data;
};

// Mock server data
const servers = [
  { id: 1, name: 'prod-app-server-01', cpu: 62, memory: 58, disk: 43, status: 'online' },
  { id: 2, name: 'prod-app-server-02', cpu: 45, memory: 72, disk: 32, status: 'online' },
  { id: 3, name: 'prod-db-server-01', cpu: 78, memory: 65, disk: 68, status: 'online' },
  { id: 4, name: 'staging-app-server-01', cpu: 22, memory: 34, disk: 19, status: 'online' },
];

const Index = () => {
  const [timeSeriesData, setTimeSeriesData] = useState(generateTimeSeriesData());
  const [animateIn, setAnimateIn] = useState(false);
  
  useEffect(() => {
    setAnimateIn(true);
    
    // Update chart data every minute
    const interval = setInterval(() => {
      setTimeSeriesData(generateTimeSeriesData());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`space-y-6 transition-opacity duration-500 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Cloud Overview</h2>
        <div className="flex items-center text-muted-foreground text-sm">
          <Clock className="h-4 w-4 mr-1" />
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Total Servers" 
          value="12"
          description="Active infrastructure"
          icon={Server}
          trend="up"
          trendValue="+2 from last month"
        />
        <StatsCard 
          title="Databases" 
          value="8"
          description="Production & staging"
          icon={Database}
          trend="neutral"
          trendValue="No change"
        />
        <StatsCard 
          title="Storage" 
          value="4.2 TB"
          description="Used across all systems"
          icon={HardDrive}
          trend="up"
          trendValue="+0.8 TB from last month"
        />
        <StatsCard 
          title="Users" 
          value="42"
          description="Active team members"
          icon={Users}
          trend="up"
          trendValue="+5 from last month"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UsageChart 
          title="Resource Usage (24h)"
          data={timeSeriesData}
          dataKeys={[
            { key: 'cpu', name: 'CPU', color: 'hsl(var(--primary))' },
            { key: 'memory', name: 'Memory', color: 'hsl(217, 91%, 60%)' },
            { key: 'network', name: 'Network (Mb/s)', color: 'hsl(142, 71%, 45%)' },
          ]}
        />
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Current System Load</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ResourceCard 
              title="CPU Usage" 
              value={72} 
              icon={Cpu}
              color="hsl(var(--primary))"
              usageLabel="72%"
              showProgressRing={true}
            />
            <ResourceCard 
              title="Memory Usage" 
              value={64} 
              icon={Database}
              color="hsl(217, 91%, 60%)"
              usageLabel="32 GB"
              total="50 GB"
            />
            <ResourceCard 
              title="Storage" 
              value={43} 
              icon={HardDrive}
              color="hsl(330, 87%, 66%)"
              usageLabel="4.2 TB"
              total="10 TB"
            />
            <ResourceCard 
              title="Network" 
              value={58} 
              icon={Network}
              color="hsl(142, 71%, 45%)"
              usageLabel="580 Mbps"
              total="1 Gbps"
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Active Servers</h3>
          <button className="text-sm text-primary font-medium hover:underline">View all servers</button>
        </div>
        
        <div className="overflow-hidden rounded-lg border border-border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Server Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">CPU</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Memory</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Disk</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {servers.map((server) => (
                  <tr key={server.id} className="border-t border-border hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium">{server.name}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center">
                        <div className="w-full bg-secondary rounded-full h-2 mr-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${server.cpu}%` }}
                          />
                        </div>
                        <span>{server.cpu}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center">
                        <div className="w-full bg-secondary rounded-full h-2 mr-2">
                          <div 
                            className="bg-[hsl(217,91%,60%)] h-2 rounded-full" 
                            style={{ width: `${server.memory}%` }}
                          />
                        </div>
                        <span>{server.memory}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center">
                        <div className="w-full bg-secondary rounded-full h-2 mr-2">
                          <div 
                            className="bg-[hsl(330,87%,66%)] h-2 rounded-full" 
                            style={{ width: `${server.disk}%` }}
                          />
                        </div>
                        <span>{server.disk}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                        <span>{server.status}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
