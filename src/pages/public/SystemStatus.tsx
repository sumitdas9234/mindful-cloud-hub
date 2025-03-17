
import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Clock, Server, Bell } from 'lucide-react';
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
import { fetchAlerts, fetchAlertStats } from '@/api/alertsApi';
import { UptimeGraph } from '@/components/status/UptimeGraph';
import { TablePagination } from '@/components/compute/TablePagination';
import { SystemStatusCard, SystemStatus } from '@/components/status/SystemStatusCard';
import { IncidentsTable, Incident } from '@/components/status/IncidentsTable';
import { SystemDetailSheet } from '@/components/status/SystemDetailSheet';
import { IncidentDetailSheet } from '@/components/status/IncidentDetailSheet';
import { PageSkeleton } from '@/components/ui/skeleton';

// Mock data for uptime graphs
const generateUptimeData = (days = 45, status = 'healthy') => {
  const data = [];
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - i - 1));
    
    // Generate mostly 'up' status with occasional issues
    let pointStatus: 'up' | 'degraded' | 'down' = 'up';
    
    // For warning/error statuses, add some degraded or down days
    if (status === 'warning' && (i === 15 || i === 35)) {
      pointStatus = 'degraded';
    } else if (status === 'error' && (i === 20 || i === 21)) {
      pointStatus = 'down';
    } else if (Math.random() > 0.95) {
      pointStatus = Math.random() > 0.5 ? 'degraded' : 'down';
    }
    
    data.push({
      status: pointStatus,
      date: date.toISOString().split('T')[0]
    });
  }
  return data;
};

const SystemStatus: React.FC = () => {
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  // State for details sheets
  const [selectedSystem, setSelectedSystem] = useState<SystemStatus | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [systemDetailOpen, setSystemDetailOpen] = useState(false);
  const [incidentDetailOpen, setIncidentDetailOpen] = useState(false);
  
  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch alerts data
  const { data: alertsData, isLoading: alertsLoading } = useQuery({
    queryKey: ['alerts', 'status-page'],
    queryFn: () => fetchAlerts(['firing']),
  });
  
  const { data: alertStats, isLoading: statsLoading } = useQuery({
    queryKey: ['alert-stats'],
    queryFn: fetchAlertStats,
  });

  // Mock systems data
  const systems = [
    { 
      id: '1', 
      name: 'Core Infrastructure', 
      status: 'healthy' as const, 
      uptime: '99.99%', 
      lastIncident: '45 days ago',
      uptimeData: generateUptimeData(45, 'healthy'),
      description: 'Core infrastructure including servers, network, and storage.'
    },
    { 
      id: '2', 
      name: 'Kubernetes Clusters', 
      status: 'healthy' as const, 
      uptime: '99.95%', 
      lastIncident: '12 days ago',
      uptimeData: generateUptimeData(45, 'healthy'),
      description: 'Production and development Kubernetes clusters.'
    },
    { 
      id: '3', 
      name: 'Storage Services', 
      status: 'warning' as const, 
      uptime: '99.87%', 
      lastIncident: 'Ongoing',
      uptimeData: generateUptimeData(45, 'warning'),
      description: 'Block and object storage services.'
    },
    { 
      id: '4', 
      name: 'Network Services', 
      status: 'healthy' as const, 
      uptime: '99.98%', 
      lastIncident: '30 days ago',
      uptimeData: generateUptimeData(45, 'healthy'),
      description: 'Network services including load balancers, routers, and firewalls.'
    },
    { 
      id: '5', 
      name: 'Monitoring Tools', 
      status: 'healthy' as const, 
      uptime: '99.91%', 
      lastIncident: '5 days ago',
      uptimeData: generateUptimeData(45, 'healthy'),
      description: 'Monitoring and observability tools.'
    },
    { 
      id: '6', 
      name: 'Backup Services', 
      status: 'error' as const, 
      uptime: '98.75%', 
      lastIncident: 'Ongoing',
      uptimeData: generateUptimeData(45, 'error'),
      description: 'Backup and disaster recovery services.'
    },
  ];

  // Mock incidents data
  const incidents = [
    { 
      id: '1', 
      system: 'Storage Services', 
      title: 'Degraded Performance', 
      description: 'Increased latency observed in storage cluster. Engineering team is investigating the root cause.', 
      status: 'investigating' as const, 
      started: '2 hours ago',
      updated: '30 minutes ago'
    },
    { 
      id: '2', 
      system: 'Backup Services', 
      title: 'Scheduled backup failed', 
      description: 'Daily backup job failed to complete. The issue has been identified as a storage capacity problem.', 
      status: 'identified' as const, 
      started: '5 hours ago',
      updated: '1 hour ago'
    },
    { 
      id: '3', 
      system: 'Network Services', 
      title: 'Intermittent connectivity issues', 
      description: 'Users reported intermittent connectivity issues in the east region. The problem has been resolved.', 
      status: 'resolved' as const, 
      started: '1 day ago',
      updated: '20 hours ago',
      resolved: '18 hours ago'
    },
    { 
      id: '4', 
      system: 'Kubernetes Clusters', 
      title: 'Pod scheduling delay', 
      description: 'Delays in pod scheduling observed in the production cluster. This was caused by resource constraints.', 
      status: 'monitoring' as const, 
      started: '3 hours ago',
      updated: '1 hour ago'
    },
    { 
      id: '5', 
      system: 'Monitoring Tools', 
      title: 'Alert notification delay', 
      description: 'Delays in alert notifications from monitoring system. A fix has been applied and we are monitoring the system.', 
      status: 'monitoring' as const, 
      started: '6 hours ago',
      updated: '2 hours ago'
    },
    { 
      id: '6', 
      system: 'Core Infrastructure', 
      title: 'Database failover test', 
      description: 'Scheduled maintenance: Testing database failover procedure.', 
      status: 'resolved' as const, 
      started: '2 days ago',
      updated: '1 day ago',
      resolved: '1 day ago'
    },
  ];

  // Filter active incidents
  const activeIncidents = incidents.filter(incident => incident.status !== 'resolved');
  
  // Paginate incidents
  const paginatedIncidents = incidents.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );
  
  // Get total pages
  const totalIncidentPages = Math.ceil(incidents.length / itemsPerPage);

  // Get relevant alerts for degraded systems
  const relevantAlerts = alertsData?.data.filter(alert => 
    alert.status === 'firing' && 
    (alert.labels.service === 'storage' || alert.labels.service === 'backup')
  ) || [];

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  const handleSystemClick = (system: SystemStatus) => {
    setSelectedSystem(system);
    setSystemDetailOpen(true);
  };

  const handleIncidentClick = (incident: Incident) => {
    setSelectedIncident(incident);
    setIncidentDetailOpen(true);
  };

  // Find related incidents for a system
  const getRelatedIncidents = (systemName: string) => {
    return incidents.filter(incident => incident.system === systemName);
  };

  // Find related alerts for a system
  const getRelatedAlerts = (systemName: string) => {
    return alertsData?.data.filter(alert => {
      const service = alert.labels.service?.toLowerCase() || '';
      return service.includes(systemName.toLowerCase().split(' ')[0]);
    }) || [];
  };

  // Find affected systems for an incident
  const getAffectedSystems = (incident: Incident) => {
    return systems.filter(system => system.name === incident.system);
  };

  // If loading, show skeleton UI
  if (isLoading || alertsLoading || statsLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Server className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">InfraOps Status</h1>
            </div>
            <div className="w-[200px] h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <PageSkeleton />
        </main>
      </div>
    );
  }

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

      <main className="container mx-auto px-4 py-8 space-y-8 animate-fade-in">
        {/* Current status summary */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Current Status</h2>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Last updated: Just now</span>
            </div>
          </div>

          {activeIncidents.length > 0 ? (
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
              <SystemStatusCard 
                key={system.id} 
                system={system} 
                onClick={handleSystemClick} 
              />
            ))}
          </div>
        </div>

        {/* Current incidents */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Active Incidents</h2>
          <IncidentsTable 
            incidents={paginatedIncidents}
            isLoading={false}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalIncidentPages}
            totalIncidents={incidents.length}
            onViewIncident={handleIncidentClick}
          />
        </div>

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

      {/* Detail sheets */}
      <SystemDetailSheet 
        system={selectedSystem} 
        open={systemDetailOpen} 
        onOpenChange={setSystemDetailOpen}
        relatedIncidents={selectedSystem ? getRelatedIncidents(selectedSystem.name) : []}
        relatedAlerts={selectedSystem ? getRelatedAlerts(selectedSystem.name) : []}
      />
      
      <IncidentDetailSheet 
        incident={selectedIncident} 
        open={incidentDetailOpen} 
        onOpenChange={setIncidentDetailOpen}
        relatedAlerts={selectedIncident ? getRelatedAlerts(selectedIncident.system) : []}
        affectedSystems={selectedIncident ? getAffectedSystems(selectedIncident) : []}
      />

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
