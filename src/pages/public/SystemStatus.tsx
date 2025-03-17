
import React from 'react';
import { AlertTriangle, CheckCircle, Server, Clock } from 'lucide-react';
import { StatusIndicator } from '@/components/compute/StatusIndicator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Link } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useQuery } from '@tanstack/react-query';
import { fetchAlerts } from '@/api/alertsApi';

const SystemStatus: React.FC = () => {
  const { data: alertsData } = useQuery({
    queryKey: ['alerts', 'status-page'],
    queryFn: () => fetchAlerts(['firing']),
  });

  const systems = [
    { name: 'Core Infrastructure', status: 'healthy', uptime: '99.99%', lastIncident: '45 days ago' },
    { name: 'Kubernetes Clusters', status: 'healthy', uptime: '99.95%', lastIncident: '12 days ago' },
    { name: 'Storage Services', status: 'warning', uptime: '99.87%', lastIncident: 'Ongoing' },
    { name: 'Network Services', status: 'healthy', uptime: '99.98%', lastIncident: '30 days ago' },
    { name: 'Monitoring Tools', status: 'healthy', uptime: '99.91%', lastIncident: '5 days ago' },
    { name: 'Backup Services', status: 'error', uptime: '98.75%', lastIncident: 'Ongoing' },
  ];

  const currentIncidents = [
    { id: '1', system: 'Storage Services', title: 'Degraded Performance', description: 'Increased latency observed in storage cluster', status: 'investigating', started: '2 hours ago' },
    { id: '2', system: 'Backup Services', title: 'Scheduled backup failed', description: 'Daily backup job failed to complete', status: 'identified', started: '5 hours ago' },
  ];

  // Get alerts related to degraded systems
  const relevantAlerts = alertsData?.data.filter(alert => 
    alert.status === 'firing' && 
    (alert.labels.service === 'storage' || alert.labels.service === 'backup')
  ) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Public header with minimal navigation */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Server className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">InfraOps Status</h1>
          </div>
          
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/system-status">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Status
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Help</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[400px] gap-3 p-4">
                    <div className="p-2">
                      <h3 className="font-medium leading-none">Support</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Contact our support team for assistance
                      </p>
                    </div>
                    <Separator />
                    <div className="p-2">
                      <h3 className="font-medium leading-none">Documentation</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        View our system documentation
                      </p>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Current status summary */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Current Status</h2>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Last updated: Just now</span>
            </div>
          </div>

          {currentIncidents.length > 0 ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-5 w-5" />
              <AlertTitle>Service Disruption</AlertTitle>
              <AlertDescription>
                We're currently experiencing issues with {systems.filter(s => s.status !== 'healthy').map(s => s.name).join(', ')}.
                Our team is working to resolve these issues.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert>
              <CheckCircle className="h-5 w-5 text-green-500" />
              <AlertTitle>All Systems Operational</AlertTitle>
              <AlertDescription>
                All systems are running smoothly with no reported issues.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* System grid */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Systems</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {systems.map((system) => (
              <Card key={system.name} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base">{system.name}</CardTitle>
                    <StatusIndicator status={system.status as any} showLabel={false} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Uptime:</span>
                      <span>{system.uptime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last incident:</span>
                      <span>{system.lastIncident}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Current incidents */}
        {currentIncidents.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Active Incidents</h2>
            <div className="space-y-4">
              {currentIncidents.map((incident) => (
                <Card key={incident.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-base">{incident.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{incident.system}</p>
                      </div>
                      <Badge variant={incident.status === 'investigating' ? 'secondary' : 'outline'}>
                        {incident.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-2">{incident.description}</p>
                    <div className="text-xs text-muted-foreground">Started {incident.started}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Related alerts */}
        {relevantAlerts.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Related Alerts</h2>
            <div className="space-y-4">
              {relevantAlerts.map((alert) => (
                <Card key={alert.id} className="border-l-4 border-l-red-500">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{alert.alertname}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-2">{alert.summary}</p>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Service: {alert.labels.service}</span>
                      <span>Severity: {alert.severity}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-border py-6 mt-8">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2023 InfraOps. All rights reserved.</p>
            <p className="mt-1">For urgent support, please contact the NOC team.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SystemStatus;
