
import React from 'react';
import { PlaceholderPage } from '@/components/layout/PlaceholderPage';
import { LineChart, BarChart, PieChart, Cpu, Activity, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

// Recharts components
import {
  Area,
  AreaChart,
  Bar,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  ComposedChart,
  Pie,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

// Sample monitoring data
const performanceData = [
  { time: '00:00', cpu: 42, memory: 58, disk: 30, network: 25 },
  { time: '01:00', cpu: 38, memory: 55, disk: 28, network: 22 },
  { time: '02:00', cpu: 35, memory: 54, disk: 28, network: 18 },
  { time: '03:00', cpu: 32, memory: 52, disk: 27, network: 15 },
  { time: '04:00', cpu: 34, memory: 53, disk: 28, network: 16 },
  { time: '05:00', cpu: 38, memory: 56, disk: 30, network: 20 },
  { time: '06:00', cpu: 45, memory: 60, disk: 32, network: 28 },
  { time: '07:00', cpu: 55, memory: 65, disk: 35, network: 45 },
  { time: '08:00', cpu: 68, memory: 72, disk: 40, network: 65 },
  { time: '09:00', cpu: 75, memory: 78, disk: 45, network: 78 },
  { time: '10:00', cpu: 80, memory: 82, disk: 48, network: 82 },
  { time: '11:00', cpu: 82, memory: 85, disk: 50, network: 85 },
  { time: '12:00', cpu: 85, memory: 87, disk: 52, network: 88 },
  { time: '13:00', cpu: 83, memory: 86, disk: 51, network: 84 },
  { time: '14:00', cpu: 80, memory: 84, disk: 49, network: 80 },
  { time: '15:00', cpu: 82, memory: 85, disk: 50, network: 82 },
  { time: '16:00', cpu: 78, memory: 82, disk: 48, network: 75 },
  { time: '17:00', cpu: 75, memory: 80, disk: 46, network: 70 },
  { time: '18:00', cpu: 70, memory: 78, disk: 43, network: 60 },
  { time: '19:00', cpu: 65, memory: 75, disk: 40, network: 55 },
  { time: '20:00', cpu: 60, memory: 70, disk: 38, network: 48 },
  { time: '21:00', cpu: 55, memory: 68, disk: 35, network: 40 },
  { time: '22:00', cpu: 50, memory: 65, disk: 33, network: 35 },
  { time: '23:00', cpu: 45, memory: 60, disk: 32, network: 30 },
];

const resourceDistribution = [
  { name: 'Production', value: 40, color: '#8884d8' },
  { name: 'Development', value: 25, color: '#82ca9d' },
  { name: 'Testing', value: 15, color: '#ffc658' },
  { name: 'Infrastructure', value: 20, color: '#ff8042' },
];

const statusData = [
  { name: 'Healthy', value: 32, color: '#4ade80' },
  { name: 'Warning', value: 8, color: '#facc15' },
  { name: 'Critical', value: 3, color: '#f87171' },
  { name: 'Maintenance', value: 5, color: '#60a5fa' },
];

const PerformanceDashboardTab = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>System Resource Usage (24h)</CardTitle>
          <CardDescription>CPU, memory, disk, and network utilization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(tick) => `${tick}%`} tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value) => [`${value}%`, undefined]}
                  contentStyle={{ backgroundColor: '#f9fafb', borderRadius: '6px', border: '1px solid #e5e7eb' }}
                />
                <Area type="monotone" dataKey="cpu" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                <Area type="monotone" dataKey="memory" stackId="2" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                <Area type="monotone" dataKey="disk" stackId="3" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
                <Area type="monotone" dataKey="network" stackId="4" stroke="#ff8042" fill="#ff8042" fillOpacity={0.6} />
                <Legend />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Resource Distribution</CardTitle>
          <CardDescription>Allocation by environment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={resourceDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {resourceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Allocation']}
                  contentStyle={{ backgroundColor: '#f9fafb', borderRadius: '6px', border: '1px solid #e5e7eb' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>Current health of monitored systems</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, value }) => `${name} (${value})`}
                  labelLine={false}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [value, 'Systems']}
                  contentStyle={{ backgroundColor: '#f9fafb', borderRadius: '6px', border: '1px solid #e5e7eb' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

const MetricsTab = () => (
  <Card>
    <CardHeader>
      <CardTitle>Infrastructure Metrics</CardTitle>
      <CardDescription>Detailed performance metrics and telemetry data</CardDescription>
    </CardHeader>
    <CardContent>
      <Tabs defaultValue="cpu">
        <TabsList className="mb-4">
          <TabsTrigger value="cpu">CPU</TabsTrigger>
          <TabsTrigger value="memory">Memory</TabsTrigger>
          <TabsTrigger value="disk">Disk I/O</TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
        </TabsList>
        
        <TabsContent value="cpu" className="space-y-4">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(tick) => `${tick}%`} tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Utilization']}
                  contentStyle={{ backgroundColor: '#f9fafb', borderRadius: '6px', border: '1px solid #e5e7eb' }}
                />
                <Legend />
                <Bar dataKey="cpu" fill="#8884d8" radius={[4, 4, 0, 0]} barSize={20} />
                <Line type="monotone" dataKey="cpu" stroke="#ff7300" dot={false} strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
        
        <TabsContent value="memory" className="space-y-4">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(tick) => `${tick}%`} tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Utilization']}
                  contentStyle={{ backgroundColor: '#f9fafb', borderRadius: '6px', border: '1px solid #e5e7eb' }}
                />
                <Legend />
                <Bar dataKey="memory" fill="#82ca9d" radius={[4, 4, 0, 0]} barSize={20} />
                <Line type="monotone" dataKey="memory" stroke="#ff7300" dot={false} strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
        
        <TabsContent value="disk" className="space-y-4">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(tick) => `${tick}%`} tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Utilization']}
                  contentStyle={{ backgroundColor: '#f9fafb', borderRadius: '6px', border: '1px solid #e5e7eb' }}
                />
                <Legend />
                <Bar dataKey="disk" fill="#ffc658" radius={[4, 4, 0, 0]} barSize={20} />
                <Line type="monotone" dataKey="disk" stroke="#ff7300" dot={false} strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
        
        <TabsContent value="network" className="space-y-4">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(tick) => `${tick}%`} tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Utilization']}
                  contentStyle={{ backgroundColor: '#f9fafb', borderRadius: '6px', border: '1px solid #e5e7eb' }}
                />
                <Legend />
                <Bar dataKey="network" fill="#ff8042" radius={[4, 4, 0, 0]} barSize={20} />
                <Line type="monotone" dataKey="network" stroke="#ff7300" dot={false} strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
      </Tabs>
    </CardContent>
  </Card>
);

const tabs = [
  { id: 'dashboard', label: 'Dashboard', content: <PerformanceDashboardTab /> },
  { id: 'metrics', label: 'Metrics', content: <MetricsTab /> },
  { id: 'logs', label: 'Logs', content: (
    <Card>
      <CardHeader>
        <CardTitle>System Logs</CardTitle>
        <CardDescription>View and analyze system and application logs</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 flex items-center justify-center">
          <p className="text-muted-foreground">Log data will be displayed here</p>
        </div>
      </CardContent>
    </Card>
  )},
  { id: 'events', label: 'Events', content: (
    <Card>
      <CardHeader>
        <CardTitle>System Events</CardTitle>
        <CardDescription>Track and respond to system events and changes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 flex items-center justify-center">
          <p className="text-muted-foreground">Event data will be displayed here</p>
        </div>
      </CardContent>
    </Card>
  )},
];

const Monitoring = () => {
  return (
    <PlaceholderPage
      title="Monitoring"
      description="Monitor infrastructure performance and health"
      icon={<Activity className="h-6 w-6" />}
      tabs={tabs}
      actionLabel="Add Monitor"
    />
  );
};

export default Monitoring;
