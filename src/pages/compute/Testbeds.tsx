
import React from 'react';
import { PlaceholderPage } from '@/components/layout/PlaceholderPage';
import { Folder, Calendar, Users, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

const testbedData = [
  {
    id: 'tb1',
    name: 'Production Validation',
    status: 'active',
    progress: 78,
    owner: 'Infrastructure Team',
    created: '2023-10-15',
    expiry: '2023-12-31'
  },
  {
    id: 'tb2',
    name: 'Feature Testing',
    status: 'active',
    progress: 45,
    owner: 'Development Team',
    created: '2023-11-02',
    expiry: '2023-12-15'
  },
  {
    id: 'tb3',
    name: 'Performance Benchmark',
    status: 'completed',
    progress: 100,
    owner: 'Performance Team',
    created: '2023-09-20',
    expiry: '2023-11-30'
  },
  {
    id: 'tb4',
    name: 'Security Testing',
    status: 'pending',
    progress: 0,
    owner: 'Security Team',
    created: '2023-11-25',
    expiry: '2024-01-15'
  }
];

const TestbedList = () => (
  <div className="space-y-4">
    {testbedData.map((testbed) => (
      <Card key={testbed.id}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{testbed.name}</CardTitle>
              <CardDescription>ID: {testbed.id}</CardDescription>
            </div>
            <div className={`px-2 py-1 text-xs rounded-full ${
              testbed.status === 'active' ? 'bg-green-100 text-green-800' : 
              testbed.status === 'pending' ? 'bg-blue-100 text-blue-800' : 
              testbed.status === 'completed' ? 'bg-purple-100 text-purple-800' : 
              'bg-gray-100 text-gray-800'
            }`}>
              {testbed.status.charAt(0).toUpperCase() + testbed.status.slice(1)}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Progress</span>
                <span>{testbed.progress}%</span>
              </div>
              <Progress value={testbed.progress} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Owner:</span>
                <span className="font-medium">{testbed.owner}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Created:</span>
                <span className="font-medium">{testbed.created}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Expires:</span>
                <span className="font-medium">{testbed.expiry}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Status:</span>
                <span className="font-medium capitalize">{testbed.status}</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1">Details</Button>
              <Button size="sm" variant="outline" className="flex-1">Manage</Button>
              {testbed.status !== 'completed' && (
                <Button size="sm" variant="outline" className="flex-1">Results</Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

const tabs = [
  { id: 'active', label: 'Active Testbeds', content: <TestbedList /> },
  { id: 'templates', label: 'Templates', content: (
    <Card>
      <CardHeader>
        <CardTitle>Testbed Templates</CardTitle>
        <CardDescription>Standardized testbed configurations for quick deployment</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-60 flex items-center justify-center">
          <p className="text-muted-foreground">Templates will be displayed here</p>
        </div>
      </CardContent>
    </Card>
  )},
];

const Testbeds = () => {
  return (
    <PlaceholderPage
      title="Testbed Management"
      description="Create and manage test environments for development and validation"
      icon={<Folder className="h-6 w-6" />}
      tabs={tabs}
      actionLabel="Create Testbed"
    />
  );
};

export default Testbeds;
