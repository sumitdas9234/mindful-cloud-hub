
import { Alert } from "../types/alerts";

// Mock data inspired by Prometheus/Alertmanager alerts
export const mockAlerts: Alert[] = [
  {
    id: "1",
    alertname: "HighCPULoad",
    summary: "High CPU load on node-exporter",
    description: "CPU load is above 80% for more than 5 minutes on node-exporter instance",
    severity: "critical",
    status: "firing",
    startsAt: "2023-11-28T08:42:23.649Z",
    generatorURL: "http://prometheus.example.com/graph?g0.expr=cpu_usage_idle+%3C+20&g0.tab=1",
    labels: {
      instance: "node-exporter:9100",
      job: "node-exporter",
      severity: "critical",
      cluster: "prod-us-east"
    },
    annotations: {
      summary: "High CPU load on node-exporter",
      description: "CPU load is above 80% for more than 5 minutes on node-exporter instance",
      dashboard: "https://grafana.example.com/d/rYdddlPWk/node-exporter-full"
    },
    fingerprint: "a1b2c3d4e5f6",
    service: "infrastructure",
    group: "hardware",
    value: "87.5"
  },
  {
    id: "2",
    alertname: "KubernetesPodCrashLooping",
    summary: "Pod is crash looping",
    description: "Pod api-server in namespace kube-system is crash looping",
    severity: "critical",
    status: "firing",
    startsAt: "2023-11-28T09:15:13.123Z",
    generatorURL: "http://prometheus.example.com/graph?g0.expr=kube_pod_container_status_restarts_total+%3E+5&g0.tab=1",
    labels: {
      pod: "api-server-67d8fb7b8b-9xz7p",
      namespace: "kube-system",
      severity: "critical",
      cluster: "prod-us-east"
    },
    annotations: {
      summary: "Pod is crash looping",
      description: "Pod api-server in namespace kube-system is crash looping",
      dashboard: "https://grafana.example.com/d/k8s/kubernetes-pod-overview"
    },
    fingerprint: "b2c3d4e5f6g7",
    service: "kubernetes",
    group: "kube-system",
    value: "8"
  },
  {
    id: "3",
    alertname: "DiskSpaceLow",
    summary: "Low disk space on /var/log",
    description: "Server db-01 has less than 10% free disk space on /var/log",
    severity: "high",
    status: "firing",
    startsAt: "2023-11-28T07:23:45.432Z",
    generatorURL: "http://prometheus.example.com/graph?g0.expr=node_filesystem_free_bytes+%2F+node_filesystem_size_bytes+%2A+100+%3C+10&g0.tab=1",
    labels: {
      instance: "db-01:9100",
      mountpoint: "/var/log",
      severity: "high",
      cluster: "prod-us-east"
    },
    annotations: {
      summary: "Low disk space on /var/log",
      description: "Server db-01 has less than 10% free disk space on /var/log",
      dashboard: "https://grafana.example.com/d/rYdddlPWk/node-exporter-full"
    },
    fingerprint: "c3d4e5f6g7h8",
    service: "infrastructure",
    group: "storage",
    value: "6.2"
  },
  {
    id: "4",
    alertname: "APIHighResponseTime",
    summary: "High API response time",
    description: "The API is responding slowly (>500ms) for more than 5 minutes",
    severity: "high",
    status: "firing",
    startsAt: "2023-11-28T10:05:34.321Z",
    generatorURL: "http://prometheus.example.com/graph?g0.expr=http_request_duration_seconds+%3E+0.5&g0.tab=1",
    labels: {
      instance: "api-gateway:8080",
      endpoint: "/api/v1/users",
      severity: "high",
      cluster: "prod-us-east"
    },
    annotations: {
      summary: "High API response time",
      description: "The API is responding slowly (>500ms) for more than 5 minutes",
      dashboard: "https://grafana.example.com/d/api/api-performance"
    },
    fingerprint: "d4e5f6g7h8i9",
    service: "api-service",
    group: "performance",
    value: "736.5"
  },
  {
    id: "5",
    alertname: "DatabaseConnectionsHigh",
    summary: "High number of database connections",
    description: "The database has a high number of connections (>80% of max)",
    severity: "medium",
    status: "firing",
    startsAt: "2023-11-28T11:12:56.789Z",
    generatorURL: "http://prometheus.example.com/graph?g0.expr=pg_stat_activity_count+%2F+pg_settings_max_connections+%2A+100+%3E+80&g0.tab=1",
    labels: {
      instance: "postgres-db:5432",
      database: "users",
      severity: "medium",
      cluster: "prod-us-east"
    },
    annotations: {
      summary: "High number of database connections",
      description: "The database has a high number of connections (>80% of max)",
      dashboard: "https://grafana.example.com/d/postgres/postgresql-overview"
    },
    fingerprint: "e5f6g7h8i9j0",
    service: "database",
    group: "resources",
    value: "85.2"
  },
  {
    id: "6",
    alertname: "ServiceEndpointDown",
    summary: "Service endpoint is down",
    description: "The HTTP service endpoint /health has been down for more than 1 minute",
    severity: "high",
    status: "pending",
    startsAt: "2023-11-28T11:45:12.345Z",
    generatorURL: "http://prometheus.example.com/graph?g0.expr=probe_success+%3D%3D+0&g0.tab=1",
    labels: {
      instance: "auth-service:8080",
      endpoint: "/health",
      severity: "high",
      cluster: "prod-us-east"
    },
    annotations: {
      summary: "Service endpoint is down",
      description: "The HTTP service endpoint /health has been down for more than 1 minute",
      dashboard: "https://grafana.example.com/d/services/services-health"
    },
    fingerprint: "f6g7h8i9j0k1",
    service: "auth-service",
    group: "availability",
    value: "0"
  },
  {
    id: "7",
    alertname: "CertificateExpiringSoon",
    summary: "TLS Certificate expiring soon",
    description: "TLS Certificate for api.example.com will expire in less than 7 days",
    severity: "medium",
    status: "firing",
    startsAt: "2023-11-28T12:30:45.678Z",
    generatorURL: "http://prometheus.example.com/graph?g0.expr=probe_ssl_earliest_cert_expiry+-+time%28%29+%3C+86400+%2A+7&g0.tab=1",
    labels: {
      instance: "api.example.com:443",
      domain: "api.example.com",
      severity: "medium",
      cluster: "prod-us-east"
    },
    annotations: {
      summary: "TLS Certificate expiring soon",
      description: "TLS Certificate for api.example.com will expire in less than 7 days",
      dashboard: "https://grafana.example.com/d/ssl/ssl-certificate-expirations"
    },
    fingerprint: "g7h8i9j0k1l2",
    service: "infrastructure",
    group: "security",
    value: "518400"
  },
  {
    id: "8",
    alertname: "SlowQueries",
    summary: "Slow database queries detected",
    description: "Multiple slow queries (>1s) detected on database users_db",
    severity: "low",
    status: "firing",
    startsAt: "2023-11-28T13:15:22.222Z",
    generatorURL: "http://prometheus.example.com/graph?g0.expr=pg_stat_activity_max_tx_duration+%3E+1&g0.tab=1",
    labels: {
      instance: "postgres-db:5432",
      database: "users_db",
      severity: "low",
      cluster: "prod-us-east"
    },
    annotations: {
      summary: "Slow database queries detected",
      description: "Multiple slow queries (>1s) detected on database users_db",
      dashboard: "https://grafana.example.com/d/postgres/postgresql-overview"
    },
    fingerprint: "h8i9j0k1l2m3",
    service: "database",
    group: "performance",
    value: "3.5"
  },
  {
    id: "9",
    alertname: "HighMemoryUsage",
    summary: "High memory usage on application server",
    description: "Memory usage is above 90% for more than 15 minutes on app-server-01",
    severity: "medium",
    status: "pending",
    startsAt: "2023-11-28T14:05:11.111Z",
    generatorURL: "http://prometheus.example.com/graph?g0.expr=100+-+%28node_memory_MemAvailable_bytes+%2F+node_memory_MemTotal_bytes+%2A+100%29+%3E+90&g0.tab=1",
    labels: {
      instance: "app-server-01:9100",
      job: "node-exporter",
      severity: "medium",
      cluster: "prod-us-east"
    },
    annotations: {
      summary: "High memory usage on application server",
      description: "Memory usage is above 90% for more than 15 minutes on app-server-01",
      dashboard: "https://grafana.example.com/d/rYdddlPWk/node-exporter-full"
    },
    fingerprint: "i9j0k1l2m3n4",
    service: "infrastructure",
    group: "hardware",
    value: "92.8"
  },
  {
    id: "10",
    alertname: "JobFailed",
    summary: "Cron job backup-db failed",
    description: "The cron job backup-db in namespace operations has failed",
    severity: "high",
    status: "resolved",
    startsAt: "2023-11-28T00:05:00.000Z",
    endsAt: "2023-11-28T01:15:30.000Z",
    generatorURL: "http://prometheus.example.com/graph?g0.expr=kube_job_status_failed+%3E+0&g0.tab=1",
    labels: {
      job_name: "backup-db",
      namespace: "operations",
      severity: "high",
      cluster: "prod-us-east"
    },
    annotations: {
      summary: "Cron job backup-db failed",
      description: "The cron job backup-db in namespace operations has failed",
      dashboard: "https://grafana.example.com/d/k8s/kubernetes-jobs"
    },
    fingerprint: "j0k1l2m3n4o5",
    service: "kubernetes",
    group: "jobs",
    value: "1"
  },
  {
    id: "11",
    alertname: "NetworkPacketLoss",
    summary: "Network packet loss detected",
    description: "Packet loss of >1% detected between data centers",
    severity: "medium",
    status: "resolved",
    startsAt: "2023-11-27T22:15:00.000Z",
    endsAt: "2023-11-27T23:30:00.000Z",
    generatorURL: "http://prometheus.example.com/graph?g0.expr=ping_packet_loss+%3E+1&g0.tab=1",
    labels: {
      source: "dc-east",
      destination: "dc-west",
      severity: "medium",
      cluster: "network"
    },
    annotations: {
      summary: "Network packet loss detected",
      description: "Packet loss of >1% detected between data centers",
      dashboard: "https://grafana.example.com/d/network/network-overview"
    },
    fingerprint: "k1l2m3n4o5p6",
    service: "network",
    group: "connectivity",
    value: "2.3"
  },
  {
    id: "12",
    alertname: "APIRateLimitExceeded",
    summary: "API rate limit exceeded",
    description: "External API rate limit has been exceeded for service payment-gateway",
    severity: "low",
    status: "resolved",
    startsAt: "2023-11-28T03:12:00.000Z",
    endsAt: "2023-11-28T03:42:00.000Z",
    generatorURL: "http://prometheus.example.com/graph?g0.expr=rate%28http_requests_total%7Bstatus_code%3D%22429%22%7D%5B5m%5D%29+%3E+0&g0.tab=1",
    labels: {
      service: "payment-gateway",
      endpoint: "/api/v1/transactions",
      severity: "low",
      cluster: "prod-us-east"
    },
    annotations: {
      summary: "API rate limit exceeded",
      description: "External API rate limit has been exceeded for service payment-gateway",
      dashboard: "https://grafana.example.com/d/api/api-usage"
    },
    fingerprint: "l2m3n4o5p6q7",
    service: "api-service",
    group: "rate-limits",
    value: "6"
  }
];
