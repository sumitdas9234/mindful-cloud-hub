
export interface Testbed {
  id: string;
  name: string;
  description: string;
  purpose: string;
  status: 'active' | 'provisioning' | 'failed' | 'decommissioned';
  type: 'hardware' | 'virtual' | 'hybrid';
  location: string;
  ownedBy: string;
  createdAt: string;
  expiresAt: string | null;
  cpu: number;
  memory: number;
  storage: number;
  usagePercent: number;
  vms: number;
  networks: number;
  users: number;
  deployments: number;
  whitelisted?: boolean;
  environment?: 'Openshift' | 'Vanilla' | 'Rancher' | 'Anthos' | 'Charmed';
  envFlavor?: 'ControlPlane' | 'User';
  deploymentType?: 'Single VM' | 'VM Group' | 'Kubernetes';
}

export interface TestbedStats {
  total: number;
  active: number;
  provisioning: number;
  failed: number;
  decommissioned: number;
  whitelisted: number;
  totalCpu: number;
  totalMemory: number;
  totalStorage: number;
  totalVMs: number;
  byEnvironment: {
    name: string;
    value: number;
    color: string;
  }[];
  byType: {
    name: string;
    value: number;
    color: string;
  }[];
  byStatus: {
    name: string;
    value: number;
    color: string;
  }[];
}

export const ENV_COLORS = {
  'Openshift': '#EF4444',
  'Vanilla': '#3B82F6',
  'Rancher': '#10B981',
  'Anthos': '#8B5CF6',
  'Charmed': '#F97316',
  'Other': '#6B7280',
};

export const TYPE_COLORS = {
  'hardware': '#EF4444',
  'virtual': '#3B82F6',
  'hybrid': '#8B5CF6',
};

export const STATUS_COLORS = {
  'active': '#10B981',
  'provisioning': '#3B82F6',
  'failed': '#EF4444',
  'decommissioned': '#6B7280',
};

export const calculateStats = (testbeds: Testbed[]): TestbedStats => {
  const envCounts: Record<string, number> = {};
  const typeCounts: Record<string, number> = {};
  const statusCounts: Record<string, number> = {};

  testbeds.forEach(tb => {
    const env = tb.environment || 'Other';
    envCounts[env] = (envCounts[env] || 0) + 1;

    typeCounts[tb.type] = (typeCounts[tb.type] || 0) + 1;

    statusCounts[tb.status] = (statusCounts[tb.status] || 0) + 1;
  });

  return {
    total: testbeds.length,
    active: testbeds.filter(tb => tb.status === 'active').length,
    provisioning: testbeds.filter(tb => tb.status === 'provisioning').length,
    failed: testbeds.filter(tb => tb.status === 'failed').length,
    decommissioned: testbeds.filter(tb => tb.status === 'decommissioned').length,
    whitelisted: testbeds.filter(tb => tb.whitelisted).length,
    totalCpu: testbeds.reduce((sum, tb) => sum + tb.cpu, 0),
    totalMemory: testbeds.reduce((sum, tb) => sum + tb.memory, 0),
    totalStorage: testbeds.reduce((sum, tb) => sum + tb.storage, 0),
    totalVMs: testbeds.reduce((sum, tb) => sum + tb.vms, 0),
    byEnvironment: Object.entries(envCounts).map(([name, value]) => ({
      name,
      value,
      color: ENV_COLORS[name as keyof typeof ENV_COLORS] || ENV_COLORS.Other
    })),
    byType: Object.entries(typeCounts).map(([name, value]) => ({
      name,
      value,
      color: TYPE_COLORS[name as keyof typeof TYPE_COLORS] || '#6B7280'
    })),
    byStatus: Object.entries(statusCounts).map(([name, value]) => ({
      name,
      value,
      color: STATUS_COLORS[name as keyof typeof STATUS_COLORS] || '#6B7280'
    }))
  };
};

export const getEnvironmentBadgeColor = (env: Testbed['environment']) => {
  switch (env) {
    case 'Openshift':
      return 'bg-red-500/10 text-red-500 hover:bg-red-500/20';
    case 'Vanilla':
      return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20';
    case 'Rancher':
      return 'bg-teal-500/10 text-teal-500 hover:bg-teal-500/20';
    case 'Anthos':
      return 'bg-purple-500/10 text-purple-500 hover:bg-purple-500/20';
    case 'Charmed':
      return 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20';
    default:
      return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20';
  }
};
