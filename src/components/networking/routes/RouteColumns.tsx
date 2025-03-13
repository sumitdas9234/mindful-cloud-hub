
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Column } from '@/components/compute/DataTable';
import { RouteData } from '@/api/types/networking';

export const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-500/10 text-green-500 hover:bg-green-500/20';
    case 'inactive': return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20';
    case 'pending': return 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20';
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

export const getRouteStatusBadgeColor = (routeStatus: string) => {
  switch (routeStatus) {
    case 'attached': return 'bg-green-500/10 text-green-500 hover:bg-green-500/20';
    case 'reserved': return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20';
    case 'orphaned': return 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20';
    case 'available': return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20';
    default: return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20';
  }
};

export const getRouteColumns = (): Column<RouteData & { routeStatus?: string }>[] => [
  {
    key: 'name',
    header: 'Name',
    cell: (route) => <span className="font-medium">{route.name}</span>
  },
  {
    key: 'subnet',
    header: 'Subnet',
    cell: (route) => (
      <Badge
        variant="outline"
        className="bg-blue-500/10 text-blue-500"
      >
        {route.subnetName}
      </Badge>
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
    key: 'routeStatus',
    header: 'Route Status',
    cell: (route) => (
      route.routeStatus ? (
        <Badge
          variant="outline"
          className={getRouteStatusBadgeColor(route.routeStatus)}
        >
          {route.routeStatus}
        </Badge>
      ) : null
    )
  }
];
