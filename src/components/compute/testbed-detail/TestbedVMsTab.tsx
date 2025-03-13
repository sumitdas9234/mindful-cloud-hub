
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface VirtualMachine {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'suspended';
  cpu: number;
  memory: number;
  storage: number;
  ip?: string;
  os?: string;
}

interface TestbedVMsTabProps {
  virtualMachines: VirtualMachine[];
}

export const TestbedVMsTab: React.FC<TestbedVMsTabProps> = ({ virtualMachines }) => {
  const getVMStatusColor = (status: VirtualMachine['status']) => {
    switch (status) {
      case 'running': return 'bg-green-500 text-green-500';
      case 'stopped': return 'bg-red-500 text-red-500';
      case 'suspended': return 'bg-yellow-500 text-yellow-500';
      default: return 'bg-gray-500 text-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader className="py-3">
        <CardTitle className="text-sm font-medium">Virtual Machines ({virtualMachines.length})</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="rounded-md border overflow-auto max-h-[500px]">
          <Table>
            <TableHeader className="bg-secondary/50 sticky top-0">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>CPU</TableHead>
                <TableHead>Memory</TableHead>
                <TableHead>IP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {virtualMachines.map((vm) => (
                <TableRow key={vm.id}>
                  <TableCell className="font-medium">{vm.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${getVMStatusColor(vm.status)}`}></div>
                      <span className="capitalize">{vm.status}</span>
                    </div>
                  </TableCell>
                  <TableCell>{vm.cpu} cores</TableCell>
                  <TableCell>{vm.memory} GB</TableCell>
                  <TableCell>{vm.ip || 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
