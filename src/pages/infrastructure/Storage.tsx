
import React from 'react';
import { PlaceholderPage } from '@/components/layout/PlaceholderPage';
import { HardDrive, Database, Server, FileText, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

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
  const baseClasses = "px-2 py-1 text-xs rounded-full";
  
  switch (status) {
    case 'online':
    case 'healthy':
      return <span className={`${baseClasses} bg-green-100 text-green-800`}>Healthy</span>;
    case 'degraded':
    case 'warning':
      return <span className={`${baseClasses} bg-amber-100 text-amber-800`}>Warning</span>;
    case 'offline':
    case 'critical':
      return <span className={`${baseClasses} bg-red-100 text-red-800`}>Critical</span>;
    case 'maintenance':
      return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>Maintenance</span>;
    default:
      return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{status}</span>;
  }
};

const VolumesTab = () => (
  <Card>
    <CardHeader>
      <CardTitle>Storage Volumes</CardTitle>
      <CardDescription>Physical storage devices and volumes</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {storageVolumes.map((volume) => (
          <div key={volume.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold">{volume.name}</h3>
                <p className="text-sm text-muted-foreground">Type: {volume.type}</p>
              </div>
              <div>
                {getStatusBadge(volume.status)}
              </div>
            </div>
            
            <div className="space-y-2 my-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Usage</span>
                <span>{volume.used} / {volume.total}</span>
              </div>
              <Progress 
                value={volume.usedPercentage} 
                className="h-2" 
                style={{
                  // Use style.color to set the background color instead of indicator prop
                  color: volume.usedPercentage > 90 ? 'hsl(var(--destructive))' : 
                         volume.usedPercentage > 80 ? 'hsl(var(--warning))' : 
                         'hsl(var(--primary))'
                }}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm my-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">IOPS:</span>
                <span>{volume.iops.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Latency:</span>
                <span>{volume.latency}</span>
              </div>
              {volume.host && (
                <div className="flex justify-between col-span-2">
                  <span className="text-muted-foreground">Host:</span>
                  <span>{volume.host}</span>
                </div>
              )}
            </div>
            
            <div className="flex gap-2 mt-2">
              <Button size="sm" variant="outline" className="flex-1">Details</Button>
              <Button size="sm" variant="outline" className="flex-1">Performance</Button>
              <Button size="sm" variant="outline" className="flex-1">Manage</Button>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const DatastoresTab = () => (
  <Card>
    <CardHeader>
      <CardTitle>Datastores</CardTitle>
      <CardDescription>Logical storage pools for virtual machines</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {datastores.map((ds) => (
          <div key={ds.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold">{ds.name}</h3>
                <p className="text-sm text-muted-foreground">Type: {ds.type}</p>
              </div>
              <div>
                {getStatusBadge(ds.status)}
              </div>
            </div>
            
            <div className="space-y-2 my-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Capacity</span>
                <span>{ds.used} / {ds.total}</span>
              </div>
              <Progress 
                value={ds.usedPercentage} 
                className="h-2"
                style={{
                  // Use style.color to set the background color instead of indicator prop
                  color: ds.usedPercentage > 90 ? 'hsl(var(--destructive))' : 
                         ds.usedPercentage > 80 ? 'hsl(var(--warning))' : 
                         'hsl(var(--primary))'
                }}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm my-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Volumes:</span>
                <span>{ds.volumes}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Free Space:</span>
                <span>{(parseFloat(ds.total) - parseFloat(ds.used)).toFixed(1)} TB</span>
              </div>
            </div>
            
            <div className="flex gap-2 mt-2">
              <Button size="sm" variant="outline" className="flex-1">Details</Button>
              <Button size="sm" variant="outline" className="flex-1">VMs</Button>
              <Button size="sm" variant="outline" className="flex-1">Manage</Button>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const tabs = [
  { id: 'volumes', label: 'Volumes', content: <VolumesTab /> },
  { id: 'datastores', label: 'Datastores', content: <DatastoresTab /> },
  { id: 'snapshots', label: 'Snapshots', content: (
    <Card>
      <CardHeader>
        <CardTitle>Storage Snapshots</CardTitle>
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
      <CardHeader>
        <CardTitle>Storage Policies</CardTitle>
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
