
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { User, Eye, EyeOff, Copy } from "lucide-react";

interface Testbed {
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
  environmentVersion?: string;
  kubernetesVersion?: string;
  kernel?: string;
  os?: string;
}

interface TestbedOverviewTabProps {
  testbed: Testbed;
  handleCopySshKey: () => void;
  handleCopyCredentials: () => void;
  showPassword: boolean;
  handleTogglePassword: () => void;
  setConnectDialogOpen: (open: boolean) => void;
}

export const TestbedOverviewTab: React.FC<TestbedOverviewTabProps> = ({
  testbed,
  handleCopySshKey,
  handleCopyCredentials,
  showPassword,
  handleTogglePassword,
  setConnectDialogOpen
}) => {
  const mockSshKey = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC6vSUlP66dFJH+/xj9VRkO5z9I9dP...";
  const mockSshUsername = "testbed-admin";
  const mockSshPassword = "Str0ngP@ssw0rd!";
  const environmentVersion = testbed?.environmentVersion || "4.17";
  const kubernetesVersion = testbed?.kubernetesVersion || "1.29";
  const kernelVersion = testbed?.kernel || "5.15.0-91-generic";
  const osVersion = testbed?.os || "Ubuntu 22.04.3 LTS";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="py-2">
          <CardTitle className="text-sm font-medium">Environment</CardTitle>
        </CardHeader>
        <CardContent className="pb-3 pt-0">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Provisioner:</span>
              <Badge variant="outline" className={`
                ${testbed.environment === 'Openshift' ? 'text-red-500 border-red-500' :
                  testbed.environment === 'Vanilla' ? 'text-blue-500 border-blue-500' :
                  testbed.environment === 'Rancher' ? 'text-teal-500 border-teal-500' :
                  testbed.environment === 'Anthos' ? 'text-purple-500 border-purple-500' :
                  testbed.environment === 'Charmed' ? 'text-orange-500 border-orange-500' :
                  'text-gray-500 border-gray-500'}
              `}>
                {testbed.environment || 'Not specified'}
              </Badge>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Version:</span>
              <span className="text-sm font-medium">{environmentVersion}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Kubernetes:</span>
              <span className="text-sm font-medium">v{kubernetesVersion}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">OS:</span>
              <span className="text-sm font-medium">{osVersion}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Kernel:</span>
              <span className="text-sm font-medium">{kernelVersion}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="py-2">
          <CardTitle className="text-sm font-medium">Owner</CardTitle>
        </CardHeader>
        <CardContent className="pb-3 pt-0">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>{testbed.ownedBy}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Created: {new Date(testbed.createdAt).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader className="py-2">
          <CardTitle className="text-sm font-medium">SSH Access</CardTitle>
        </CardHeader>
        <CardContent className="pb-3 pt-0">
          <div className="space-y-4 w-full">
            <div>
              <div className="flex justify-between items-center mb-1">
                <h5 className="text-xs font-medium text-muted-foreground">SSH Key</h5>
                <Button variant="ghost" size="icon" onClick={handleCopySshKey} className="h-6 w-6">
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </div>
              <div className="bg-secondary rounded-md p-3 overflow-hidden">
                <code className="text-xs font-mono break-all">
                  {mockSshKey}
                </code>
              </div>
            </div>
            
            <div>
              <h5 className="text-xs font-medium text-muted-foreground mb-1">Credentials</h5>
              <div className="bg-secondary rounded-md p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium">Username:</span>
                  <code className="text-xs font-mono">{mockSshUsername}</code>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium">Password:</span>
                  <div className="flex items-center gap-2">
                    <code className="text-xs font-mono">
                      {showPassword ? mockSshPassword : '••••••••••••'}
                    </code>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={handleTogglePassword} 
                      className="h-6 w-6"
                    >
                      {showPassword ? (
                        <EyeOff className="h-3.5 w-3.5" />
                      ) : (
                        <Eye className="h-3.5 w-3.5" />
                      )}
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={handleCopyCredentials} 
                      className="h-6 w-6"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-start items-center">
              <Button 
                variant="default" 
                size="sm" 
                onClick={() => setConnectDialogOpen(true)}
                className="w-1/4"
              >
                Connect
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
