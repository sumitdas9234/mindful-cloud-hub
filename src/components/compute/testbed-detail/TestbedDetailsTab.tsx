
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Testbed {
  id: string;
  type: 'hardware' | 'virtual' | 'hybrid';
  location: string;
  createdAt: string;
  expiresAt: string | null;
  whitelisted?: boolean;
  deployments: number;
  users: number;
}

interface TestbedDetailsTabProps {
  testbed: Testbed;
}

export const TestbedDetailsTab: React.FC<TestbedDetailsTabProps> = ({ testbed }) => {
  return (
    <Card>
      <CardHeader className="py-3">
        <CardTitle className="text-sm font-medium">Testbed Details</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <dl className="space-y-2">
          <div className="flex justify-between items-center py-1">
            <dt className="text-muted-foreground">ID:</dt>
            <dd className="font-mono text-sm">{testbed.id}</dd>
          </div>
          <Separator />
          <div className="flex justify-between items-center py-1">
            <dt className="text-muted-foreground">Type:</dt>
            <dd className="capitalize">{testbed.type}</dd>
          </div>
          <Separator />
          <div className="flex justify-between items-center py-1">
            <dt className="text-muted-foreground">Location:</dt>
            <dd>{testbed.location}</dd>
          </div>
          <Separator />
          <div className="flex justify-between items-center py-1">
            <dt className="text-muted-foreground">Created At:</dt>
            <dd>{new Date(testbed.createdAt).toLocaleString()}</dd>
          </div>
          <Separator />
          <div className="flex justify-between items-center py-1">
            <dt className="text-muted-foreground">Expires At:</dt>
            <dd>{testbed.expiresAt ? new Date(testbed.expiresAt).toLocaleString() : 'Never'}</dd>
          </div>
          <Separator />
          <div className="flex justify-between items-center py-1">
            <dt className="text-muted-foreground">Whitelisted:</dt>
            <dd>{testbed.whitelisted ? 'Yes' : 'No'}</dd>
          </div>
          <Separator />
          <div className="flex justify-between items-center py-1">
            <dt className="text-muted-foreground">Deployments:</dt>
            <dd>{testbed.deployments}</dd>
          </div>
          <Separator />
          <div className="flex justify-between items-center py-1">
            <dt className="text-muted-foreground">Users:</dt>
            <dd>{testbed.users}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
};
