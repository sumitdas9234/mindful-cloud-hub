
export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';
export type AlertStatus = 'firing' | 'pending' | 'resolved';

export interface Alert {
  id: string;
  alertname: string;
  summary: string;
  description: string;
  severity: AlertSeverity;
  status: AlertStatus;
  startsAt: string;
  endsAt?: string;
  generatorURL?: string;
  labels: Record<string, string>;
  annotations: Record<string, string>;
  silenceURL?: string;
  dashboardURL?: string;
  panelURL?: string;
  fingerprint: string;
  service?: string;
  group?: string;
  value?: string;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
}

export interface AlertsAPIResponse {
  status: string;
  data: Alert[];
  total: number;
}

export interface AlertGroup {
  name: string;
  alerts: Alert[];
}

export interface SilenceData {
  id?: string;
  matchers: {
    name: string;
    value: string;
    isRegex: boolean;
  }[];
  startsAt: string;
  endsAt: string;
  createdBy: string;
  comment: string;
}

export interface AlertManagerConfig {
  url: string;
  name: string;
}

export interface AlertStats {
  critical: number;
  high: number;
  medium: number;
  low: number;
  info: number;
  total: number;
  firing: number;
  pending: number;
  resolved: number;
}
