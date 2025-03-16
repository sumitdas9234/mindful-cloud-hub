
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bell, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { PageHeader } from '@/components/compute/PageHeader';
import { AlertsStats } from '@/components/alerts/AlertsStats';
import { AlertsTabs } from '@/components/alerts/AlertsTabs';
import { fetchAlerts, fetchAlertStats, acknowledgeAlert, silenceAlert } from '@/api/alertsApi';
import { AlertStatus, AlertSeverity } from '@/api/types/alerts';

const Alerts = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedStatuses, setSelectedStatuses] = useState<AlertStatus[]>([]);
  const [selectedSeverities, setSelectedSeverities] = useState<AlertSeverity[]>([]);

  // Fetch alerts
  const { 
    data: alertsResponse,
    isLoading: isAlertsLoading,
    error: alertsError,
    refetch: refetchAlerts
  } = useQuery({
    queryKey: ['alerts', selectedStatuses, selectedSeverities, searchQuery],
    queryFn: () => fetchAlerts(
      selectedStatuses.length > 0 ? selectedStatuses : undefined,
      selectedSeverities.length > 0 ? selectedSeverities : undefined,
      searchQuery || undefined
    )
  });

  // Fetch alert stats
  const {
    data: alertStats,
    isLoading: isStatsLoading,
    refetch: refetchStats
  } = useQuery({
    queryKey: ['alert-stats'],
    queryFn: fetchAlertStats
  });

  const handleRefresh = () => {
    refetchAlerts();
    refetchStats();
    toast({
      title: "Refreshed alerts",
      description: "The alerts list has been refreshed."
    });
  };

  const handleCreateAlertRule = () => {
    toast({
      title: "Create Alert Rule",
      description: "The alert rule creation dialog would open here."
    });
  };

  const resetFilters = () => {
    setSelectedStatuses([]);
    setSelectedSeverities([]);
    setSearchQuery('');
  };

  const handleAcknowledge = async (alertId: string, by: string, comment: string) => {
    try {
      const result = await acknowledgeAlert(alertId);
      if (result.success) {
        toast({
          title: "Alert Acknowledged",
          description: `Alert has been acknowledged by ${by}.`
        });
        refetchAlerts();
        refetchStats();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to acknowledge alert",
        variant: "destructive"
      });
    }
  };

  const handleSilence = async (alertId: string, duration: number, comment: string) => {
    try {
      const result = await silenceAlert(alertId, duration, comment);
      if (result.success) {
        toast({
          title: "Alert Silenced",
          description: `Alert has been silenced for ${duration} hours.`
        });
        refetchAlerts();
        refetchStats();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to silence alert",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto space-y-6">
      <PageHeader
        title="Alerts"
        description="Monitor and respond to infrastructure alerts"
        onRefresh={handleRefresh}
        onAdd={handleCreateAlertRule}
        addButtonText="Create Alert Rule"
      >
        <div className="text-sm text-muted-foreground">
          {alertsResponse?.total} alerts found
        </div>
      </PageHeader>

      <AlertsStats
        stats={alertStats || {
          critical: 0,
          high: 0,
          medium: 0,
          low: 0,
          info: 0,
          total: 0,
          firing: 0,
          pending: 0,
          resolved: 0
        }}
        isLoading={isStatsLoading}
      />

      <Separator className="my-6" />

      <AlertsTabs
        alerts={alertsResponse?.data || []}
        isLoading={isAlertsLoading}
        error={alertsError instanceof Error ? alertsError : null}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        selectedStatuses={selectedStatuses}
        setSelectedStatuses={setSelectedStatuses}
        selectedSeverities={selectedSeverities}
        setSelectedSeverities={setSelectedSeverities}
        resetFilters={resetFilters}
        handleAcknowledge={handleAcknowledge}
        handleSilence={handleSilence}
      />
    </div>
  );
};

export default Alerts;
