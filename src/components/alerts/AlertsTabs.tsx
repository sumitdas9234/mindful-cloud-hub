
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AlertsTable } from './AlertsTable';
import { Alert, AlertStatus, AlertSeverity } from '@/api/types/alerts';
import { AlertsFilters } from './AlertsFilters';
import { AlertDetail } from './AlertDetail';
import { SilenceForm } from './SilenceForm';
import { AcknowledgeForm } from './AcknowledgeForm';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';

interface AlertsTabsProps {
  alerts: Alert[];
  isLoading: boolean;
  error: Error | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  selectedStatuses: AlertStatus[];
  setSelectedStatuses: (statuses: AlertStatus[]) => void;
  selectedSeverities: AlertSeverity[];
  setSelectedSeverities: (severities: AlertSeverity[]) => void;
  resetFilters: () => void;
  handleAcknowledge: (alertId: string, by: string, comment: string) => void;
  handleSilence: (alertId: string, duration: number, comment: string) => void;
}

export const AlertsTabs: React.FC<AlertsTabsProps> = ({
  alerts,
  isLoading,
  error,
  searchQuery,
  setSearchQuery,
  selectedTab,
  setSelectedTab,
  selectedStatuses,
  setSelectedStatuses,
  selectedSeverities,
  setSelectedSeverities,
  resetFilters,
  handleAcknowledge,
  handleSilence
}) => {
  const [selectedAlert, setSelectedAlert] = React.useState<Alert | null>(null);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [silenceOpen, setSilenceOpen] = React.useState(false);
  const [acknowledgeOpen, setAcknowledgeOpen] = React.useState(false);
  const [actionAlertId, setActionAlertId] = React.useState<string | null>(null);

  // Filter alerts based on tab and filters
  const filteredAlerts = React.useMemo(() => {
    // Start with the alerts filtered by search query
    return alerts.filter(alert => {
      // If there are selected statuses, filter by them
      if (selectedStatuses.length > 0 && !selectedStatuses.includes(alert.status)) {
        return false;
      }
      
      // If there are selected severities, filter by them
      if (selectedSeverities.length > 0 && !selectedSeverities.includes(alert.severity)) {
        return false;
      }
      
      // If there's a search query, filter by it
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          alert.alertname.toLowerCase().includes(query) ||
          alert.summary.toLowerCase().includes(query) ||
          alert.description.toLowerCase().includes(query) ||
          (alert.service && alert.service.toLowerCase().includes(query)) ||
          Object.entries(alert.labels).some(([key, value]) => 
            key.toLowerCase().includes(query) || 
            value.toLowerCase().includes(query)
          );
        if (!matchesSearch) return false;
      }
      
      // Filter by tab
      switch (selectedTab) {
        case 'firing':
          return alert.status === 'firing';
        case 'pending':
          return alert.status === 'pending';
        case 'resolved':
          return alert.status === 'resolved';
        case 'all':
        default:
          return true;
      }
    });
  }, [alerts, searchQuery, selectedTab, selectedStatuses, selectedSeverities]);

  const openAlertDetail = (alert: Alert) => {
    setSelectedAlert(alert);
    setDetailOpen(true);
  };

  const handleSilenceButtonClick = (alertId: string) => {
    setActionAlertId(alertId);
    setSilenceOpen(true);
  };

  const handleAcknowledgeButtonClick = (alertId: string) => {
    setActionAlertId(alertId);
    setAcknowledgeOpen(true);
  };

  const onSilenceSubmit = (duration: number, comment: string) => {
    if (actionAlertId) {
      handleSilence(actionAlertId, duration, comment);
      setSilenceOpen(false);
      setActionAlertId(null);
    }
  };

  const onAcknowledgeSubmit = (by: string, comment: string) => {
    if (actionAlertId) {
      handleAcknowledge(actionAlertId, by, comment);
      setAcknowledgeOpen(false);
      setActionAlertId(null);
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 my-4">
        <h3 className="text-red-800 dark:text-red-400 font-medium">Error loading alerts</h3>
        <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AlertsFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedStatuses={selectedStatuses}
        setSelectedStatuses={setSelectedStatuses}
        selectedSeverities={selectedSeverities}
        setSelectedSeverities={setSelectedSeverities}
        resetFilters={resetFilters}
      />
      
      <Tabs 
        value={selectedTab} 
        onValueChange={setSelectedTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Alerts</TabsTrigger>
          <TabsTrigger value="firing">Firing</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          <AlertsTable 
            alerts={filteredAlerts} 
            isLoading={isLoading}
            onAcknowledge={handleAcknowledgeButtonClick}
            onSilence={handleSilenceButtonClick}
            onViewDetails={openAlertDetail}
          />
        </TabsContent>
        
        <TabsContent value="firing" className="mt-4">
          <AlertsTable 
            alerts={filteredAlerts} 
            isLoading={isLoading}
            onAcknowledge={handleAcknowledgeButtonClick}
            onSilence={handleSilenceButtonClick}
            onViewDetails={openAlertDetail}
          />
        </TabsContent>
        
        <TabsContent value="pending" className="mt-4">
          <AlertsTable 
            alerts={filteredAlerts} 
            isLoading={isLoading}
            onAcknowledge={handleAcknowledgeButtonClick}
            onSilence={handleSilenceButtonClick}
            onViewDetails={openAlertDetail}
          />
        </TabsContent>
        
        <TabsContent value="resolved" className="mt-4">
          <AlertsTable 
            alerts={filteredAlerts} 
            isLoading={isLoading}
            onAcknowledge={handleAcknowledgeButtonClick}
            onSilence={handleSilenceButtonClick}
            onViewDetails={openAlertDetail}
          />
        </TabsContent>
      </Tabs>
      
      {/* Alert Detail Sheet */}
      <AlertDetail 
        alert={selectedAlert}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onAcknowledge={handleAcknowledgeButtonClick}
        onSilence={handleSilenceButtonClick}
      />
      
      {/* Silence Dialog */}
      <Dialog open={silenceOpen} onOpenChange={setSilenceOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Silence Alert</DialogTitle>
            <DialogDescription>
              Create a silence to temporarily stop receiving notifications for this alert.
            </DialogDescription>
          </DialogHeader>
          <SilenceForm onSubmit={onSilenceSubmit} onCancel={() => setSilenceOpen(false)} />
        </DialogContent>
      </Dialog>
      
      {/* Acknowledge Dialog */}
      <Dialog open={acknowledgeOpen} onOpenChange={setAcknowledgeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Acknowledge Alert</DialogTitle>
            <DialogDescription>
              Acknowledge this alert to indicate that you're aware of it and working on it.
            </DialogDescription>
          </DialogHeader>
          <AcknowledgeForm onSubmit={onAcknowledgeSubmit} onCancel={() => setAcknowledgeOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};
