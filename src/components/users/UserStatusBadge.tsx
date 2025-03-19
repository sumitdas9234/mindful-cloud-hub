
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface UserStatusBadgeProps {
  isActive: boolean;
  className?: string;
}

export const UserStatusBadge: React.FC<UserStatusBadgeProps> = ({ 
  isActive,
  className
}) => {
  return isActive ? (
    <Badge 
      className={cn("bg-green-500 hover:bg-green-600", className)}
    >
      Active
    </Badge>
  ) : (
    <Badge 
      variant="outline" 
      className={cn("text-gray-500", className)}
    >
      Inactive
    </Badge>
  );
};
