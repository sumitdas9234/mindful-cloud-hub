
import React from 'react';
import { MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';

interface TestbedActionMenuProps {
  testbed: any;
  onAction: (action: string, testbed: any) => void;
  onViewDetails: (testbed: any) => void;
}

export const TestbedActionMenu: React.FC<TestbedActionMenuProps> = ({ 
  testbed, 
  onAction,
  onViewDetails
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onViewDetails(testbed)}>
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAction('Edit', testbed)}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {testbed.status === 'active' && (
          <DropdownMenuItem onClick={() => onAction('Deploy', testbed)}>
            Deploy Workload
          </DropdownMenuItem>
        )}
        {testbed.status === 'active' && (
          <DropdownMenuItem onClick={() => onAction('Snapshot', testbed)}>
            Create Snapshot
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        {testbed.status === 'active' && (
          <DropdownMenuItem onClick={() => onAction('Decommission', testbed)}>
            Decommission
          </DropdownMenuItem>
        )}
        {testbed.status !== 'active' && testbed.status !== 'decommissioned' && (
          <DropdownMenuItem onClick={() => onAction('Recover', testbed)}>
            Recover
          </DropdownMenuItem>
        )}
        <DropdownMenuItem 
          onClick={() => onAction('Delete', testbed)}
          className="text-red-500"
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
