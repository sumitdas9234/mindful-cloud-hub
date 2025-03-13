import React from 'react';
import { PlaceholderPage } from '@/components/layout/PlaceholderPage';
import { HardDrive, Database, Server, FileText, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface StorageVolume {
  id: string;
  name: string;
  type: 'SSD' | 'HDD' | 'NVMe' | 'NFS';
  status: 'online' | 'offline' | 'degraded' | 'maintenance';
  total: string;
  used: string;
  usedPercentage: number;
  iops: number;
  latency: string;
  host?: string;
}

interface DatastoreInfo {
  id: string;
  name: string;
  type: 'VMFS' | 'NFS' | 'vSAN';
  volumes: number;
  total: string;
  used: string;
  usedPercentage: number;
  status: 'healthy' | 'warning' | 'critical' | 'maintenance';
}

const storageVolumes: StorageVolume[] = [
  {
    id: 'vol-001',
    name: 'Production SSD',
    type: 'SSD',
    status: 'online',
    total: '2 TB',
    used: '1.2 TB',
    usedPercentage: 60,
    iops: 12500,
    latency: '0.8ms',
    host: 'esx-host-01'
  },
  {
    id: 'vol-002',
    name: 'Archive Storage',
    type: 'HDD',
    status: 'online',
    total: '10 TB',
    used: '7.5 TB',
    usedPercentage: 75,
    iops: 950,
    latency: '8.5ms',
    host: 'esx-host-02'
  },
  {
    id: 'vol-003',
    name: 'High Performance',
    type: 'NVMe',
    status: 'online',
    total: '1 TB',
    used: '350 GB',
    usedPercentage: 35,
    iops: 50000,
    latency: '0.2ms',
    host: 'esx-host-01'
  },
  {
    id: 'vol-004',
    name: 'Shared Storage',
    type: 'NFS',
    status: 'degraded',
    total: '5 TB',
    used: '4.2 TB',
    usedPercentage: 84,
    iops: 2200,
    latency: '3.5ms',
    host: 'nfs-host-01'
  },
  {
    id: 'vol-005',
    name: 'Backup Volume',
    type: 'HDD',
    status: 'maintenance',
    total: '8 TB',
    used: '2.1 TB',
    usedPercentage: 26,
    iops: 850,
    latency: '12ms',
    host: 'esx-host-03'
  }
];

const datastores: DatastoreInfo[] = [
  {
    id: 'ds-001',
    name: 'Production Datastore',
    type: 'VMFS',
    volumes: 3,
    total: '5 TB',
    used: '3.8 TB',
    usedPercentage: 76,
    status: 'healthy'
  },
  {
    id: 'ds-002',
    name: 'Development Datastore',
    type: 'VMFS',
    volumes: 2,
    total: '2 TB',
    used: '0.8 TB',
    usedPercentage: 40,
    status: 'healthy'
  },
  {
    id: 'ds-003',
    name: 'Distributed Storage',
    type: 'vSAN',
    volumes: 8,
    total: '12 TB',
    used: '10.8 TB',
    usedPercentage: 90,
    status: 'warning'
  },
  {
    id: 'ds-004',
    name: 'Backup Datastore',
    type: 'NFS',
    volumes: 1,
    total: '8 TB',
    used: '5.5 TB',
    usedPercentage: 69,
    status: 'healthy'
  }
];

const getStatusBadge = (status: string) => {
  const baseClasses = "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset";
  
  switch (status) {
    case 'online':
    case 'healthy':
      return <span className={`${baseClasses} bg-green-50 text-green-700 ring-green-600/20`}>Healthy</span>;
    case 'degraded':
    case 'warning':
      return <span className={`${baseClasses} bg-yellow-50 text-yellow-700 ring-yellow-600/20`}>Warning</span>;
    case 'offline':
    case 'critical':
      return <span className={`${baseClasses} bg-red-50 text-red-700 ring-red-600/20`}>Critical</span>;
    case 'maintenance':
      return <span className={`${baseClasses} bg-blue-50 text-blue-700 ring-blue-600/20`}>Maintenance</span>;
    default:
      return <span className={`${baseClasses} bg-gray-50 text-gray-700 ring-gray-600/20`}>{status}</span>;
  }
};

const VolumesTab = () => (
  <Card>
    <CardHeader className="pb-3">
      <CardTitle className="text-lg font-medium">Storage Volumes</CardTitle>
      <CardDescription>Physical storage devices and volumes</CardDescription>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Usage</TableHead>
            <TableHead>IOPS</TableHead>
            <TableHead>Latency</TableHead>
            <TableHead>Host</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {storageVolumes.map((volume) => (
            <TableRow key={volume.id}>
              <TableCell className="font-medium">{volume.name}</TableCell>
              <TableCell>{volume.type}</TableCell>
              <TableCell>{getStatusBadge(volume.status)}</TableCell>
              <TableCell>
                <div className="w-full max-w-[120px]">
                  <div className="flex justify-between text-xs mb-1">
                    <span>{volume.usedPercentage}%</span>
                    <span>{volume.used}/{volume.total}</span>
                  </div>
                  <Progress 
                    value={volume.usedPercentage} 
                    className="h-1.5" 
                    style={{
                      color: volume.usedPercentage > 90 ? 'hsl(var(--destructive))' : 
                             volume.usedPercentage > 80 ? 'hsl(var(--warning))' : 
                             'hsl(var(--primary))'
                    }}
                  />
                </div>
              </TableCell>
              <TableCell>{volume.iops.toLocaleString()}</TableCell>
              <TableCell>{volume.latency}</TableCell>
              <TableCell>{volume.host || '—'}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm">Details</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

const DatastoresTab = () => (
  <Card>
    <CardHeader className="pb-3">
      <CardTitle className="text-lg font-medium">Datastores</CardTitle>
      <CardDescription>Logical storage pools for virtual machines</CardDescription>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Volumes</TableHead>
            <TableHead>Usage</TableHead>
            <TableHead>Free Space</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {datastores.map((ds) => (
            <TableRow key={ds.id}>
              <TableCell className="font-medium">{ds.name}</TableCell>
              <TableCell>{ds.type}</TableCell>
              <TableCell>{getStatusBadge(ds.status)}</TableCell>
              <TableCell>{ds.volumes}</TableCell>
              <TableCell>
                <div className="w-full max-w-[120px]">
                  <div className="flex justify-between text-xs mb-1">
                    <span>{ds.usedPercentage}%</span>
                    <span>{ds.used}/{ds.total}</span>
                  </div>
                  <Progress 
                    value={ds.usedPercentage} 
                    className="h-1.5" 
                    style={{
                      color: ds.usedPercentage > 90 ? 'hsl(var(--destructive))' : 
                             ds.usedPercentage > 80 ? 'hsl(var(--warning))' : 
                             'hsl(var(--primary))'
                    }}
                  />
                </div>
              </TableCell>
              <TableCell>{(parseFloat(ds.total) - parseFloat(ds.used)).toFixed(1)} TB</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm">Details</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

const tabs = [
  { id: 'volumes', label: 'Volumes', content: <VolumesTab /> },
  { id: 'datastores', label: 'Datastores', content: <DatastoresTab /> },
  { id: 'snapshots', label: 'Snapshots', content: (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Storage Snapshots</CardTitle>
        <CardDescription>Manage point-in-time storage snapshots</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-60 flex items-center justify-center">
          <p className="text-muted-foreground">Snapshot information will be displayed here</p>
        </div>
      </CardContent>
    </Card>
  )},
  { id: 'policies', label: 'Policies', content: (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Storage Policies</CardTitle>
        <CardDescription>Manage storage allocation and retention policies</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-60 flex items-center justify-center">
          <p className="text-muted-foreground">Policy information will be displayed here</p>
        </div>
      </CardContent>
    </Card>
  )},
];

const Storage = () => {
  return (
    <PlaceholderPage
      title="Storage Management"
      description="Manage and monitor storage infrastructure"
      icon={<HardDrive className="h-6 w-6" />}
      tabs={tabs}
      actionLabel="Add Storage"
    />
  );
};

export default Storage;
