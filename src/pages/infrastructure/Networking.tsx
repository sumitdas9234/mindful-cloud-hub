
import React from 'react';
import { PlaceholderPage } from '@/components/layout/PlaceholderPage';
import { Network, Globe, Wifi, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

type ConnectionStatus = 'active' | 'inactive' | 'warning';

interface NetworkInterface {
  id: string;
  name: string;
  ipAddress: string;
  status: ConnectionStatus;
  macAddress: string;
  subnet: string;
  usage: {
    tx: string;
    rx: string;
  };
  vlan?: number;
}

interface VirtualNetwork {
  id: string;
  name: string;
  type: 'vlan' | 'overlay';
  cidr: string;
  interfaces: number;
  hosts: number;
  status: ConnectionStatus;
}

const networkInterfaces: NetworkInterface[] = [
  {
    id: 'eth0',
    name: 'Primary Network',
    ipAddress: '10.10.10.1',
    status: 'active',
    macAddress: '00:1A:2B:3C:4D:5E',
    subnet: '255.255.255.0',
    usage: {
      tx: '45.6 Mbps',
      rx: '32.1 Mbps'
    },
    vlan: 100
  },
  {
    id: 'eth1',
    name: 'Management Network',
    ipAddress: '192.168.1.10',
    status: 'active',
    macAddress: '00:1A:2B:3C:4D:5F',
    subnet: '255.255.255.0',
    usage: {
      tx: '12.3 Mbps',
      rx: '8.7 Mbps'
    },
    vlan: 200
  },
  {
    id: 'eth2',
    name: 'Storage Network',
    ipAddress: '172.16.10.5',
    status: 'inactive',
    macAddress: '00:1A:2B:3C:4D:60',
    subnet: '255.255.0.0',
    usage: {
      tx: '0 Mbps',
      rx: '0 Mbps'
    },
    vlan: 300
  },
  {
    id: 'eth3',
    name: 'Backup Network',
    ipAddress: '10.20.30.40',
    status: 'warning',
    macAddress: '00:1A:2B:3C:4D:61',
    subnet: '255.255.255.0',
    usage: {
      tx: '89.2 Mbps',
      rx: '5.3 Mbps'
    },
    vlan: 400
  }
];

const virtualNetworks: VirtualNetwork[] = [
  {
    id: 'vnet1',
    name: 'Production Network',
    type: 'vlan',
    cidr: '10.10.0.0/16',
    interfaces: 8,
    hosts: 45,
    status: 'active'
  },
  {
    id: 'vnet2',
    name: 'Development Network',
    type: 'overlay',
    cidr: '172.16.0.0/16',
    interfaces: 4,
    hosts: 12,
    status: 'active'
  },
  {
    id: 'vnet3',
    name: 'Test Network',
    type: 'vlan',
    cidr: '192.168.10.0/24',
    interfaces: 2,
    hosts: 8,
    status: 'warning'
  }
];

// Status indicator component
const StatusIndicator = ({ status }: { status: ConnectionStatus }) => {
  const baseClasses = "h-2.5 w-2.5 rounded-full";
  let statusClasses = "";
  
  switch (status) {
    case 'active':
      statusClasses = "bg-green-500";
      break;
    case 'warning':
      statusClasses = "bg-amber-500";
      break;
    default:
      statusClasses = "bg-red-500";
  }
  
  return <span className={`${baseClasses} ${statusClasses}`}></span>;
};

const PhysicalNetworksTab = () => (
  <Card>
    <CardHeader>
      <CardTitle>Physical Network Interfaces</CardTitle>
      <CardDescription>Network adapters and physical connections</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {networkInterfaces.map((iface) => (
          <div key={iface.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  <StatusIndicator status={iface.status} />
                  {iface.name} ({iface.id})
                </h3>
                <p className="text-sm text-muted-foreground">VLAN: {iface.vlan}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{iface.ipAddress}</p>
                <p className="text-xs text-muted-foreground">Subnet: {iface.subnet}</p>
              </div>
            </div>
            
            <Separator className="my-3" />
            
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">MAC Address:</span>
                <span>{iface.macAddress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className="capitalize">{iface.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">TX Rate:</span>
                <span>{iface.usage.tx}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">RX Rate:</span>
                <span>{iface.usage.rx}</span>
              </div>
            </div>
            
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="outline" className="flex-1">Configure</Button>
              <Button size="sm" variant="outline" className="flex-1">Diagnostics</Button>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const VirtualNetworksTab = () => (
  <Card>
    <CardHeader>
      <CardTitle>Virtual Networks</CardTitle>
      <CardDescription>Software-defined networks and VLANs</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {virtualNetworks.map((vnet) => (
          <div key={vnet.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  <StatusIndicator status={vnet.status} />
                  {vnet.name}
                </h3>
                <p className="text-sm text-muted-foreground">Type: {vnet.type.toUpperCase()}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{vnet.cidr}</p>
                <p className="text-xs text-muted-foreground">ID: {vnet.id}</p>
              </div>
            </div>
            
            <Separator className="my-3" />
            
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Interfaces:</span>
                <span>{vnet.interfaces}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Connected Hosts:</span>
                <span>{vnet.hosts}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className="capitalize">{vnet.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Network Type:</span>
                <span className="capitalize">{vnet.type}</span>
              </div>
            </div>
            
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="outline" className="flex-1">Details</Button>
              <Button size="sm" variant="outline" className="flex-1">Manage</Button>
              <Button size="sm" variant="outline" className="flex-1">Traffic</Button>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
    <CardFooter>
      <Button variant="outline" className="w-full">Create Virtual Network</Button>
    </CardFooter>
  </Card>
);

const tabs = [
  { id: 'physical', label: 'Physical Networks', content: <PhysicalNetworksTab /> },
  { id: 'virtual', label: 'Virtual Networks', content: <VirtualNetworksTab /> },
  { id: 'routing', label: 'Routing', content: (
    <Card>
      <CardHeader>
        <CardTitle>Network Routing</CardTitle>
        <CardDescription>Configure and manage network routes and gateways</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-60 flex items-center justify-center">
          <p className="text-muted-foreground">Routing information will be displayed here</p>
        </div>
      </CardContent>
    </Card>
  )},
  { id: 'firewall', label: 'Firewall', content: (
    <Card>
      <CardHeader>
        <CardTitle>Firewall Rules</CardTitle>
        <CardDescription>Manage security rules and traffic filtering</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-60 flex items-center justify-center">
          <p className="text-muted-foreground">Firewall rules will be displayed here</p>
        </div>
      </CardContent>
    </Card>
  )},
];

const Networking = () => {
  return (
    <PlaceholderPage
      title="Network Management"
      description="Configure and monitor network infrastructure"
      icon={<Network className="h-6 w-6" />}
      tabs={tabs}
      actionLabel="Add Network"
    />
  );
};

export default Networking;
