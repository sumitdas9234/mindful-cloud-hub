
import React from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical } from 'lucide-react';
import { RouteData } from '@/api/types/networking';

interface RouteActionsProps {
  route: RouteData;
  handleRouteAction: (action: string, route: RouteData) => void;
}

export const RouteActions: React.FC<RouteActionsProps> = ({ route, handleRouteAction }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleRouteAction('View', route)}>
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleRouteAction('Edit', route)}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleRouteAction('Delete', route)}
          className="text-red-500"
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
