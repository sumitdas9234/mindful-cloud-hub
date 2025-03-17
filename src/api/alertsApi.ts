
import { AlertStatus, Alert, AlertsAPIResponse, AlertManagerConfig, AlertStats } from "./types/alerts";
import { mockAlerts } from "./mockData/alertsData";

// This would be replaced with the actual API implementation
// using axios or fetch to connect to Prometheus/Alertmanager

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchAlerts = async (
  status?: AlertStatus[],
  severity?: string[],
  search?: string,
  silenced?: boolean,
  inhibited?: boolean,
  active?: boolean,
  alertmanager?: string[]
): Promise<AlertsAPIResponse> => {
  // Simulate API delay
  await delay(800);
  
  // Filter alerts based on parameters
  let filteredAlerts = [...mockAlerts];
  
  if (status && status.length > 0) {
    filteredAlerts = filteredAlerts.filter(alert => status.includes(alert.status));
  }
  
  if (severity && severity.length > 0) {
    filteredAlerts = filteredAlerts.filter(alert => severity.includes(alert.severity));
  }
  
  if (search) {
    const searchLower = search.toLowerCase();
    filteredAlerts = filteredAlerts.filter(alert => 
      alert.alertname.toLowerCase().includes(searchLower) ||
      alert.summary.toLowerCase().includes(searchLower) ||
      alert.description.toLowerCase().includes(searchLower) ||
      Object.entries(alert.labels).some(([key, value]) => 
        key.toLowerCase().includes(searchLower) || 
        value.toLowerCase().includes(searchLower)
      )
    );
  }
  
  return {
    status: "success",
    data: filteredAlerts,
    total: filteredAlerts.length
  };
};

export const fetchAlertStats = async (): Promise<AlertStats> => {
  // Simulate API delay
  await delay(500);
  
  // Calculate stats from the mock data
  const stats: AlertStats = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    info: 0,
    total: mockAlerts.length,
    firing: 0,
    pending: 0,
    resolved: 0,
    acknowledged: 0,
    silenced: 0
  };
  
  // Count by severity and status
  mockAlerts.forEach(alert => {
    stats[alert.severity]++;
    stats[alert.status]++;
  });
  
  return stats;
};

// This would be connected to the actual Alertmanager API
export const silenceAlert = async (alertId: string, duration: number, comment: string, by: string): Promise<{ success: boolean, message: string }> => {
  await delay(800);
  
  // Find the alert in our mock data and update its status
  const alertIndex = mockAlerts.findIndex(alert => alert.id === alertId);
  if (alertIndex !== -1) {
    mockAlerts[alertIndex].status = 'silenced';
    mockAlerts[alertIndex].silencedBy = by;
    mockAlerts[alertIndex].silencedAt = new Date().toISOString();
    mockAlerts[alertIndex].silenceDuration = duration;
    mockAlerts[alertIndex].silenceComment = comment;
    mockAlerts[alertIndex].silenceURL = `https://alertmanager.example.com/silence/${alertId}`;
  }
  
  return { success: true, message: `Alert ${alertId} silenced for ${duration} hours by ${by}` };
};

export const acknowledgeAlert = async (alertId: string, by: string, comment?: string): Promise<{ success: boolean, message: string }> => {
  await delay(800);
  
  // Find the alert in our mock data and update its status
  const alertIndex = mockAlerts.findIndex(alert => alert.id === alertId);
  if (alertIndex !== -1) {
    mockAlerts[alertIndex].status = 'acknowledged';
    mockAlerts[alertIndex].acknowledgedBy = by;
    mockAlerts[alertIndex].acknowledgedAt = new Date().toISOString();
  }
  
  return { success: true, message: `Alert ${alertId} acknowledged by ${by}` };
};

export const getAlertmanagerConfig = async (): Promise<AlertManagerConfig[]> => {
  await delay(500);
  return [
    { url: 'http://alertmanager.example.com', name: 'Production' },
    { url: 'http://alertmanager-dev.example.com', name: 'Development' }
  ];
};
