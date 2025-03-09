
import React from 'react';
import { PlaceholderPage } from '@/components/layout/PlaceholderPage';
import { AlertTriangle, Bell, CheckCircle, Filter, Trash, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

type AlertSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';
type AlertStatus = 'active' | 'acknowledged' | 'resolved';

interface AlertItem {
  id: string;
  title: string;
  message: string;
  severity: AlertSeverity;
  status: AlertStatus;
  source: string;
  timestamp: string;
  assignee?: string;
}

const mockAlerts: AlertItem[] = [
  {
    id: 'alert-001',
    title: 'High CPU Usage',
    message: 'Server east-rke-control-001 is experiencing sustained high CPU usage (92%) for over 15 minutes.',
    severity: 'high',
    status: 'active',
    source: 'System Monitor',
    timestamp: '2023-11-28T10:15:23Z'
  },
  {
    id: 'alert-002',
    title: 'Datastore Space Critical',
    message: 'Production Datastore is at 95% capacity. Immediate action required.',
    severity: 'critical',
    status: 'active',
    source: 'Storage Monitor',
    timestamp: '2023-11-28T09:45:12Z'
  },
  {
    id: 'alert-003',
    title: 'Network Latency Spike',
    message: 'Unusually high network latency detected on Production Network (120ms vs normal 15ms).',
    severity: 'medium',
    status: 'acknowledged',
    source: 'Network Monitor',
    timestamp: '2023-11-28T08:30:45Z',
    assignee: 'Network Team'
  },
  {
    id: 'alert-004',
    title: 'Authentication Failures',
    message: 'Multiple failed login attempts detected for admin account from IP 192.168.1.155.',
    severity: 'high',
    status: 'acknowledged',
    source: 'Security Monitor',
    timestamp: '2023-11-28T07:22:18Z',
    assignee: 'Security Team'
  },
  {
    id: 'alert-005',
    title: 'Backup Job Failed',
    message: 'Daily backup job for development environment failed to complete.',
    severity: 'medium',
    status: 'active',
    source: 'Backup System',
    timestamp: '2023-11-28T04:00:05Z'
  },
  {
    id: 'alert-006',
    title: 'VM Shutdown Unexpectedly',
    message: 'Virtual machine db-server-02 shutdown unexpectedly. Auto-restart attempt failed.',
    severity: 'high',
    status: 'resolved',
    source: 'VM Monitor',
    timestamp: '2023-11-27T22:15:30Z',
    assignee: 'Infrastructure Team'
  },
  {
    id: 'alert-007',
    title: 'Certificate Expiring Soon',
    message: 'SSL certificate for api.example.com will expire in 7 days.',
    severity: 'low',
    status: 'acknowledged',
    source: 'Certificate Monitor',
    timestamp: '2023-11-27T14:30:15Z',
    assignee: 'Security Team'
  },
  {
    id: 'alert-008',
    title: 'Disk I/O Bottleneck',
    message: 'High disk I/O wait times detected on storage volume vol-003.',
    severity: 'medium',
    status: 'resolved',
    source: 'Performance Monitor',
    timestamp: '2023-11-27T11:45:22Z',
    assignee: 'Storage Team'
  }
];

const getSeverityBadge = (severity: AlertSeverity) => {
  switch (severity) {
    case 'critical':
      return <Badge variant="destructive">Critical</Badge>;
    case 'high':
      return <Badge className="bg-orange-500">High</Badge>;
    case 'medium':
      return <Badge className="bg-amber-500">Medium</Badge>;
    case 'low':
      return <Badge className="bg-blue-500">Low</Badge>;
    case 'info':
      return <Badge variant="outline">Info</Badge>;
    default:
      return null;
  }
};

const getStatusBadge = (status: AlertStatus) => {
  switch (status) {
    case 'active':
      return <Badge variant="outline" className="border-red-500 text-red-500">Active</Badge>;
    case 'acknowledged':
      return <Badge variant="outline" className="border-amber-500 text-amber-500">Acknowledged</Badge>;
    case 'resolved':
      return <Badge variant="outline" className="border-green-500 text-green-500">Resolved</Badge>;
    default:
      return null;
  }
};

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const ActiveAlertsTab = () => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <div className="relative w-80">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search alerts..."
          className="w-full rounded-md pl-8"
        />
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-1" />
          Filter
        </Button>
        <Button variant="outline" size="sm">
          <Trash className="h-4 w-4 mr-1" />
          Clear Resolved
        </Button>
      </div>
    </div>
    
    <div className="space-y-4">
      {mockAlerts.filter(alert => alert.status !== 'resolved').map((alert) => (
        <Card key={alert.id} className={`
          ${alert.severity === 'critical' ? 'border-l-4 border-l-red-500' : 
            alert.severity === 'high' ? 'border-l-4 border-l-orange-500' : 
            alert.severity === 'medium' ? 'border-l-4 border-l-amber-500' : 
            alert.severity === 'low' ? 'border-l-4 border-l-blue-500' : ''}
        `}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className={`h-5 w-5 
                    ${alert.severity === 'critical' ? 'text-red-500' : 
                      alert.severity === 'high' ? 'text-orange-500' : 
                      alert.severity === 'medium' ? 'text-amber-500' : 
                      alert.severity === 'low' ? 'text-blue-500' : ''}
                  `} />
                  {alert.title}
                </CardTitle>
                <CardDescription>
                  {alert.source} • {formatDate(alert.timestamp)}
                </CardDescription>
              </div>
              <div className="flex flex-col items-end gap-2">
                {getSeverityBadge(alert.severity)}
                {getStatusBadge(alert.status)}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{alert.message}</p>
            {alert.assignee && (
              <p className="text-sm mt-2 text-muted-foreground">Assigned to: {alert.assignee}</p>
            )}
          </CardContent>
          <CardFooter className="flex gap-2 pt-0">
            {alert.status === 'active' && (
              <Button size="sm" variant="outline" className="flex-1">Acknowledge</Button>
            )}
            <Button size="sm" variant="outline" className="flex-1">
              {alert.status === 'resolved' ? 'Details' : 'Resolve'}
            </Button>
            <Button size="sm" variant="outline" className="flex-1">Assign</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  </div>
);

const HistoryTab = () => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      <div className="relative w-80">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search alert history..."
          className="w-full rounded-md pl-8"
        />
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-1" />
          Filter
        </Button>
        <Button variant="outline" size="sm">
          Export
        </Button>
      </div>
    </div>
    
    <div className="space-y-4">
      {mockAlerts.filter(alert => alert.status === 'resolved').map((alert) => (
        <Card key={alert.id} className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  {alert.title}
                </CardTitle>
                <CardDescription>
                  {alert.source} • {formatDate(alert.timestamp)}
                </CardDescription>
              </div>
              <div className="flex flex-col items-end gap-2">
                {getSeverityBadge(alert.severity)}
                {getStatusBadge(alert.status)}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{alert.message}</p>
            {alert.assignee && (
              <p className="text-sm mt-2 text-muted-foreground">Resolved by: {alert.assignee}</p>
            )}
          </CardContent>
          <CardFooter className="flex gap-2 pt-0">
            <Button size="sm" variant="outline" className="flex-1">View Details</Button>
            <Button size="sm" variant="outline" className="flex-1">Reopen</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  </div>
);

const ConfigurationTab = () => (
  <Card>
    <CardHeader>
      <CardTitle>Alert Configuration</CardTitle>
      <CardDescription>Manage alert rules, thresholds, and notification settings</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="h-60 flex items-center justify-center">
        <p className="text-muted-foreground">Alert configuration options will be displayed here</p>
      </div>
    </CardContent>
  </Card>
);

const tabs = [
  { id: 'active', label: 'Active Alerts', content: <ActiveAlertsTab /> },
  { id: 'history', label: 'Alert History', content: <HistoryTab /> },
  { id: 'configuration', label: 'Configuration', content: <ConfigurationTab /> }
];

const Alerts = () => {
  return (
    <PlaceholderPage
      title="Alerts"
      description="Monitor and respond to infrastructure alerts"
      icon={<Bell className="h-6 w-6" />}
      tabs={tabs}
      actionLabel="Create Alert Rule"
    />
  );
};

export default Alerts;
