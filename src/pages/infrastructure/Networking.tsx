
import React, { useState } from 'react';
import { 
  Network, 
  Search, 
  Plus, 
  RefreshCw, 
  MoreHorizontal,
  Router,
  Wifi,
  Globe,
  Shield,
  Activity,
  CircleAlert
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

// Network Devices Types
type DeviceType = 'router' | 'switch' | 'firewall' | 'loadbalancer' | 'gateway';
type DeviceStatus = 'online' | 'offline' | 'maintenance' | 'warning';

interface NetworkDevice {
  id: string;
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  ip: string;
  location: string;
  model: string;
  throughput: {
    current: number;
    max: number;
  };
  connections: number;
  lastChecked: string;
}

// VLANs
interface VLAN {
  id: number;
  name: string;
  subnet: string;
  purpose: string;
  devices: number;
  traffic: number;
  secure: boolean;
}

// Firewall Rules
interface FirewallRule {
  id: string;
  name: string;
  source: string;
  destination: string;
  port: string | null;
  protocol: 'tcp' | 'udp' | 'icmp' | 'any';
  action: 'allow' | 'deny';
  enabled: boolean;
  hits: number;
}

// Sample data
const networkDevices: NetworkDevice[] = [
  {
    id: '1',
    name: 'core-rtr-01',
    type: 'router',
    status: 'online',
    ip: '10.0.0.1',
    location: 'DC1 - Rack A01',
    model: 'Cisco Nexus 9000',
    throughput: {
      current: 18.4,
      max: 40
    },
    connections: 124,
    lastChecked: '2023-10-12 14:35:22'
  },
  {
    id: '2',
    name: 'edge-fw-01',
    type: 'firewall',
    status: 'online',
    ip: '10.0.0.254',
    location: 'DC1 - Rack A03',
    model: 'Palo Alto PA-5260',
    throughput: {
      current: 8.2,
      max: 20
    },
    connections: 4582,
    lastChecked: '2023-10-12 14:34:12'
  },
  {
    id: '3',
    name: 'dist-sw-03',
    type: 'switch',
    status: 'warning',
    ip: '10.0.1.3',
    location: 'DC1 - Rack B07',
    model: 'Arista DCS-7280R',
    throughput: {
      current: 36.8,
      max: 40
    },
    connections: 48,
    lastChecked: '2023-10-12 14:33:05'
  },
  {
    id: '4',
    name: 'lb-cluster-01',
    type: 'loadbalancer',
    status: 'online',
    ip: '10.0.2.10',
    location: 'DC1 - Rack C02',
    model: 'F5 BIG-IP i4800',
    throughput: {
      current: 5.6,
      max: 20
    },
    connections: 2845,
    lastChecked: '2023-10-12 14:32:01'
  },
  {
    id: '5',
    name: 'vpn-gw-01',
    type: 'gateway',
    status: 'online',
    ip: '10.0.0.240',
    location: 'DC1 - Rack A04',
    model: 'Cisco ASA 5585-X',
    throughput: {
      current: 1.2,
      max: 10
    },
    connections: 86,
    lastChecked: '2023-10-12 14:30:56'
  },
  {
    id: '6',
    name: 'dist-sw-08',
    type: 'switch',
    status: 'offline',
    ip: '10.0.1.8',
    location: 'DC2 - Rack D03',
    model: 'Arista DCS-7280R',
    throughput: {
      current: 0,
      max: 40
    },
    connections: 0,
    lastChecked: '2023-10-12 13:15:42'
  }
];

const vlans: VLAN[] = [
  {
    id: 10,
    name: 'Management',
    subnet: '10.0.0.0/24',
    purpose: 'Device Management',
    devices: 48,
    traffic: 2.4,
    secure: true
  },
  {
    id: 20,
    name: 'Servers',
    subnet: '10.0.1.0/24',
    purpose: 'Production Servers',
    devices: 124,
    traffic: 34.8,
    secure: true
  },
  {
    id: 30,
    name: 'Storage',
    subnet: '10.0.2.0/24',
    purpose: 'SAN Network',
    devices: 18,
    traffic: 28.4,
    secure: true
  },
  {
    id: 40,
    name: 'DMZ',
    subnet: '192.168.1.0/24',
    purpose: 'Internet Facing',
    devices: 12,
    traffic: 15.6,
    secure: true
  },
  {
    id: 50,
    name: 'Guest',
    subnet: '172.16.0.0/24',
    purpose: 'Guest Wi-Fi',
    devices: 102,
    traffic: 8.2,
    secure: false
  }
];

const firewallRules: FirewallRule[] = [
  {
    id: '1',
    name: 'Allow HTTP/S Inbound',
    source: 'Any',
    destination: 'DMZ Servers',
    port: '80, 443',
    protocol: 'tcp',
    action: 'allow',
    enabled: true,
    hits: 28456
  },
  {
    id: '2',
    name: 'Block Suspicious IPs',
    source: 'Threat List',
    destination: 'Any',
    port: 'Any',
    protocol: 'any',
    action: 'deny',
    enabled: true,
    hits: 4567
  },
  {
    id: '3',
    name: 'Allow VPN Access',
    source: 'Remote Users',
    destination: 'VPN Gateway',
    port: '1194',
    protocol: 'udp',
    action: 'allow',
    enabled: true,
    hits: 892
  },
  {
    id: '4',
    name: 'Internal SSH',
    source: 'Admin Subnet',
    destination: 'Server Subnet',
    port: '22',
    protocol: 'tcp',
    action: 'allow',
    enabled: true,
    hits: 345
  },
  {
    id: '5',
    name: 'Block P2P Traffic',
    source: 'Any',
    destination: 'Any',
    port: 'Various',
    protocol: 'any',
    action: 'deny',
    enabled: true,
    hits: 1204
  }
];

const Networking: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('devices');

  const filteredDevices = networkDevices.filter(device => 
    device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    device.ip.toLowerCase().includes(searchQuery.toLowerCase()) ||
    device.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    device.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredVLANs = vlans.filter(vlan => 
    vlan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vlan.subnet.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vlan.purpose.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFirewallRules = firewallRules.filter(rule => 
    rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rule.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rule.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success('Network data refreshed successfully');
    }, 1500);
  };

  const handleAddNew = () => {
    switch (activeTab) {
      case 'devices':
        toast.info('Add network device functionality coming soon');
        break;
      case 'vlans':
        toast.info('Add VLAN functionality coming soon');
        break;
      case 'firewall':
        toast.info('Add firewall rule functionality coming soon');
        break;
    }
  };

  const getDeviceTypeIcon = (type: DeviceType) => {
    switch (type) {
      case 'router':
        return <Router className="h-4 w-4 text-blue-500" />;
      case 'switch':
        return <Network className="h-4 w-4 text-green-500" />;
      case 'firewall':
        return <Shield className="h-4 w-4 text-red-500" />;
      case 'loadbalancer':
        return <Activity className="h-4 w-4 text-purple-500" />;
      case 'gateway':
        return <Globe className="h-4 w-4 text-amber-500" />;
    }
  };

  const getDeviceStatusBadge = (status: DeviceStatus) => {
    switch (status) {
      case 'online':
        return <Badge variant="default" className="bg-green-500">Online</Badge>;
      case 'offline':
        return <Badge variant="default" className="bg-red-500">Offline</Badge>;
      case 'maintenance':
        return <Badge variant="default" className="bg-blue-500">Maintenance</Badge>;
      case 'warning':
        return <Badge variant="default" className="bg-amber-500">Warning</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">Network Management</h2>
          <p className="text-muted-foreground">
            Manage network devices, VLANs, and security policies
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleAddNew}>
            <Plus className="h-4 w-4 mr-2" />
            {activeTab === 'devices' ? 'Add Device' : activeTab === 'vlans' ? 'Add VLAN' : 'Add Rule'}
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={`Search ${activeTab}...`}
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Devices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{networkDevices.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">VLANs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vlans.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Firewall Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{firewallRules.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex items-center">
                <CircleAlert className="h-4 w-4 text-red-500 mr-1" />
                Alerts
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">2</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="devices" onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="vlans">VLANs</TabsTrigger>
          <TabsTrigger value="firewall">Firewall Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="devices">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Throughput</TableHead>
                    <TableHead>Connections</TableHead>
                    <TableHead>Last Check</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDevices.map((device) => (
                    <TableRow key={device.id}>
                      <TableCell className="font-medium">{device.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {getDeviceTypeIcon(device.type)}
                          <span className="ml-2 capitalize">{device.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getDeviceStatusBadge(device.status)}</TableCell>
                      <TableCell>{device.ip}</TableCell>
                      <TableCell>{device.location}</TableCell>
                      <TableCell>
                        <div className="w-32">
                          <div className="flex justify-between text-xs mb-1">
                            <span>{device.throughput.current} Gbps</span>
                            <span className="text-muted-foreground">{device.throughput.max} Gbps</span>
                          </div>
                          <Progress 
                            value={(device.throughput.current / device.throughput.max) * 100} 
                            className="h-1.5"
                            style={{ 
                              color: device.throughput.current / device.throughput.max > 0.8 
                                ? "hsl(var(--destructive))" 
                                : device.throughput.current / device.throughput.max > 0.6 
                                ? "hsl(var(--warning))" 
                                : "hsl(var(--primary))" 
                            }}
                          />
                        </div>
                      </TableCell>
                      <TableCell>{device.connections.toLocaleString()}</TableCell>
                      <TableCell>{device.lastChecked}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>View Config</DropdownMenuItem>
                            <DropdownMenuItem>View Traffic</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-500">Shutdown</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vlans">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Subnet</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Devices</TableHead>
                    <TableHead>Traffic (Gbps)</TableHead>
                    <TableHead>Secure</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVLANs.map((vlan) => (
                    <TableRow key={vlan.id}>
                      <TableCell>{vlan.id}</TableCell>
                      <TableCell className="font-medium">{vlan.name}</TableCell>
                      <TableCell>{vlan.subnet}</TableCell>
                      <TableCell>{vlan.purpose}</TableCell>
                      <TableCell>{vlan.devices}</TableCell>
                      <TableCell>{vlan.traffic}</TableCell>
                      <TableCell>
                        {vlan.secure ? (
                          <Badge className="bg-green-500">Secure</Badge>
                        ) : (
                          <Badge variant="outline" className="text-amber-500 border-amber-500">Open</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>View Devices</DropdownMenuItem>
                            <DropdownMenuItem>View Traffic</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="firewall">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rule Name</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Port/Protocol</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Enabled</TableHead>
                    <TableHead>Hits</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFirewallRules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium">{rule.name}</TableCell>
                      <TableCell>{rule.source}</TableCell>
                      <TableCell>{rule.destination}</TableCell>
                      <TableCell>
                        {rule.port ? `${rule.port} (${rule.protocol})` : rule.protocol}
                      </TableCell>
                      <TableCell>
                        {rule.action === 'allow' ? (
                          <Badge className="bg-green-500">Allow</Badge>
                        ) : (
                          <Badge className="bg-red-500">Deny</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {rule.enabled ? (
                          <div className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                            <span>Yes</span>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-slate-300 mr-2"></div>
                            <span>No</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{rule.hits.toLocaleString()}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit Rule</DropdownMenuItem>
                            <DropdownMenuItem>Duplicate</DropdownMenuItem>
                            <DropdownMenuItem>Move Up</DropdownMenuItem>
                            <DropdownMenuItem>Move Down</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {rule.enabled ? (
                              <DropdownMenuItem>Disable</DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem>Enable</DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Networking;
