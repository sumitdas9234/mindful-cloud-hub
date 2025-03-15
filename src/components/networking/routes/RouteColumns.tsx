
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Column } from '@/components/compute/DataTable';
import { RouteData } from '@/api/types/networking';
import { Globe, Server } from 'lucide-react';

export const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case 'attached': return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20';
    case 'reserved': return 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20';
    case 'orphaned': return 'bg-red-500/10 text-red-500 hover:bg-red-500/20';
    case 'available': return 'bg-green-500/10 text-green-500 hover:bg-green-500/20';
    default: return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20';
  }
};

export const getTypeBadgeColor = (type: string) => {
  switch (type) {
    case 'static': return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20';
    case 'openshift': return 'bg-red-500/10 text-red-500 hover:bg-red-500/20';
    default: return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20';
  }
};

export const getRouteColumns = (): Column<RouteData>[] => [
  {
    key: 'name',
    header: 'Name',
    cell: (route) => (
      <div className="flex items-center gap-2">
        {route.type === 'openshift' ? (
          <Globe className="h-4 w-4 text-red-500" />
        ) : (
          <Server className="h-4 w-4 text-blue-500" />
        )}
        <span className="font-medium">{route.name}</span>
      </div>
    )
  },
  {
    key: 'subnet',
    header: 'Subnet',
    cell: (route) => <span>{route.subnetName}</span>
  },
  {
    key: 'address',
    header: 'Address',
    cell: (route) => (
      <span className="text-sm">
        {route.type === 'openshift' ? route.vip?.ip : route.ip}
      </span>
    )
  },
  {
    key: 'type',
    header: 'Type',
    cell: (route) => (
      <Badge
        variant="outline"
        className={getTypeBadgeColor(route.type)}
      >
        {route.type}
      </Badge>
    )
  },
  {
    key: 'status',
    header: 'Status',
    cell: (route) => (
      <Badge
        variant="outline"
        className={getStatusBadgeColor(route.status)}
      >
        {route.status}
      </Badge>
    )
  },
  {
    key: 'testbed',
    header: 'Testbed',
    cell: (route) => route.testbed ? <span>{route.testbed}</span> : <span className="text-muted-foreground">-</span>
  }
];
