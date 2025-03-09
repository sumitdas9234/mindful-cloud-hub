
import React from 'react';
import { PlaceholderPage } from '@/components/layout/PlaceholderPage';
import { Server, Shield, Network, HardDrive } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const vCenterData = [
  {
    id: 'vc1',
    name: 'vCenter East',
    status: 'online',
    hosts: 14,
    clusters: 4,
    datastores: 12
  },
  {
    id: 'vc2',
    name: 'vCenter West',
    status: 'online',
    hosts: 9,
    clusters: 3,
    datastores: 8
  },
  {
    id: 'vc3',
    name: 'vCenter Central',
    status: 'maintenance',
    hosts: 11,
    clusters: 3,
    datastores: 10
  }
];

const VCentersList = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {vCenterData.map((vc) => (
      <Card key={vc.id} className="h-full">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{vc.name}</CardTitle>
            <div className={`px-2 py-1 text-xs rounded-full ${
              vc.status === 'online' ? 'bg-green-100 text-green-800' : 
              vc.status === 'maintenance' ? 'bg-amber-100 text-amber-800' : 
              'bg-red-100 text-red-800'
            }`}>
              {vc.status.charAt(0).toUpperCase() + vc.status.slice(1)}
            </div>
          </div>
          <CardDescription>vSphere Infrastructure</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Hosts:</span>
              <span className="font-medium">{vc.hosts}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Clusters:</span>
              <span className="font-medium">{vc.clusters}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Datastores:</span>
              <span className="font-medium">{vc.datastores}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-2 flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">Details</Button>
          <Button variant="outline" size="sm" className="flex-1">Manage</Button>
        </CardFooter>
      </Card>
    ))}
  </div>
);

const PropertiesTab = () => (
  <Card>
    <CardHeader>
      <CardTitle>vCenter Properties</CardTitle>
      <CardDescription>Configure vCenter server settings and properties</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="font-medium">Connection Settings</h3>
            <div className="text-sm text-muted-foreground">
              <p>Configure connection parameters, timeouts, and authentication settings</p>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Permissions</h3>
            <div className="text-sm text-muted-foreground">
              <p>Manage roles, users, and access control for vCenter resources</p>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Datacenter Settings</h3>
            <div className="text-sm text-muted-foreground">
              <p>Configure datacenter properties and organization</p>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">Security Policies</h3>
            <div className="text-sm text-muted-foreground">
              <p>Set security compliance and certificate management</p>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const tabs = [
  { id: 'instances', label: 'vCenter Instances', content: <VCentersList /> },
  { id: 'properties', label: 'Properties', content: <PropertiesTab /> },
];

const VCenters = () => {
  return (
    <PlaceholderPage
      title="vCenter Management"
      description="Manage and monitor your vCenter infrastructure"
      icon={<Server className="h-6 w-6" />}
      tabs={tabs}
      actionLabel="Add vCenter"
    />
  );
};

export default VCenters;
