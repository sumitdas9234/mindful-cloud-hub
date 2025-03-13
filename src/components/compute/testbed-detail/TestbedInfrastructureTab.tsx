
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Server } from "lucide-react";

interface Testbed {
  vCenterName?: string;
  vSphereDatacenter?: string;
  vSphereCluster?: string;
  vSphereDatastore?: string;
  vSphereNetwork?: string;
}

interface TestbedInfrastructureTabProps {
  testbed: Testbed;
}

export const TestbedInfrastructureTab: React.FC<TestbedInfrastructureTabProps> = ({ testbed }) => {
  const vCenterName = testbed.vCenterName || "vcenter-01.datacenter.local";
  const vSphereDatacenter = testbed.vSphereDatacenter || "Datacenter-East";
  const vSphereCluster = testbed.vSphereCluster || "Cluster-01";
  const vSphereDatastore = testbed.vSphereDatastore || "SAN-Volume-01";
  const vSphereNetwork = testbed.vSphereNetwork || "VLAN-Production-10";

  return (
    <Card>
      <CardHeader className="py-3">
        <CardTitle className="text-sm font-medium">vSphere Infrastructure</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <dl className="space-y-2">
          <div className="flex justify-between items-center py-1">
            <dt className="text-muted-foreground flex items-center gap-1">
              <Server className="h-4 w-4" />
              vCenter:
            </dt>
            <dd className="font-medium">{vCenterName}</dd>
          </div>
          <Separator />
          <div className="flex justify-between items-center py-1">
            <dt className="text-muted-foreground">Datacenter:</dt>
            <dd className="font-medium">{vSphereDatacenter}</dd>
          </div>
          <Separator />
          <div className="flex justify-between items-center py-1">
            <dt className="text-muted-foreground">Cluster:</dt>
            <dd className="font-medium">{vSphereCluster}</dd>
          </div>
          <Separator />
          <div className="flex justify-between items-center py-1">
            <dt className="text-muted-foreground">Datastore:</dt>
            <dd className="font-medium">{vSphereDatastore}</dd>
          </div>
          <Separator />
          <div className="flex justify-between items-center py-1">
            <dt className="text-muted-foreground">Network:</dt>
            <dd className="font-medium">{vSphereNetwork}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
};
